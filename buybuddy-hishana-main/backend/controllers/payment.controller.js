import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // paise (INR smallest unit)
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "inr",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 500000) { // ₹5000 in paise
			await createNewCoupon(req.user._id);
		}
		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{
						isActive: false,
					}
				);
			}

			// create a new Order
			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100, // convert from paise to rupees
				stripeSessionId: sessionId,
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}

export const createCodOrder = async (req, res) => {
	try {
		const { products } = req.body;
		if (!Array.isArray(products) || products.length === 0)
			return res.status(400).json({ message: "Invalid or empty products array" });

		const orderProducts = products.map((p) => ({
			product: p._id || p.id || p.product,
			quantity: Number(p.quantity) || 1,
			price: Number(p.price),
		}));

		const invalid = orderProducts.find((p) => !p.product || isNaN(p.price));
		if (invalid)
			return res.status(400).json({ message: "Invalid product data in cart" });

		const totalAmount = orderProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

		const newOrder = await Order.create({
			user: req.user._id,
			products: orderProducts,
			totalAmount,
			paymentMethod: "cod",
			paymentStatus: "pending",
		});

		res.status(201).json({ success: true, orderId: newOrder._id });
	} catch (error) {
		console.error("COD order error:", error);
		res.status(500).json({ message: error.message || "Error creating order" });
	}
};

export const getUserOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id })
			.populate("products.product", "name image price")
			.sort({ createdAt: -1 });
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			.populate("products.product", "name image price")
			.populate("user", "name email")
			.sort({ createdAt: -1 });
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateProductStatus = async (req, res) => {
	try {
		const { orderId, itemId } = req.params;
		const { status } = req.body;
		const validStatuses = ["ordered", "processing", "shipped", "out_for_delivery", "delivered"];
		if (!validStatuses.includes(status))
			return res.status(400).json({ message: "Invalid status" });

		const order = await Order.findById(orderId);
		if (!order) return res.status(404).json({ message: "Order not found" });

		const item = order.products.id(itemId);
		if (!item) return res.status(404).json({ message: "Order item not found" });

		item.status = status;
		await order.save();
		res.json({ success: true, status });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createServiceCheckoutSession = async (req, res) => {
	try {
		const { serviceId, date, time, address } = req.body;
		const service = await Service.findById(serviceId);
		if (!service) return res.status(404).json({ message: "Service not found" });

		// Create a pending booking first
		const booking = await Booking.create({
			user: req.user._id,
			service: serviceId,
			date,
			time,
			address,
			totalAmount: service.price,
			paymentMethod: "online",
			paymentStatus: "pending",
		});

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [{
				price_data: {
					currency: "inr",
					product_data: {
						name: service.name,
						description: `${date} at ${time} — ${address}`,
						images: service.image ? [service.image] : [],
					},
					unit_amount: Math.round(service.price * 100),
				},
				quantity: 1,
			}],
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}&type=service`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			metadata: {
				bookingId: booking._id.toString(),
				userId: req.user._id.toString(),
			},
		});

		// Store session id on booking
		booking.stripeSessionId = session.id;
		await booking.save();

		res.status(200).json({ id: session.id });
	} catch (error) {
		console.error("Error creating service checkout:", error);
		res.status(500).json({ message: "Error creating service checkout", error: error.message });
	}
};

export const serviceCheckoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== "paid")
			return res.status(400).json({ message: "Payment not completed" });

		const booking = await Booking.findOneAndUpdate(
			{ stripeSessionId: sessionId },
			{ paymentStatus: "paid", status: "confirmed" },
			{ new: true }
		).populate("service");

		if (!booking) return res.status(404).json({ message: "Booking not found" });

		res.status(200).json({ success: true, booking });
	} catch (error) {
		console.error("Error processing service checkout success:", error);
		res.status(500).json({ message: "Error processing service payment", error: error.message });
	}
};
