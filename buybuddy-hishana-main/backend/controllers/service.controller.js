import Service from "../models/service.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllServices = async (req, res) => {
	try {
		const services = await Service.find({ isAvailable: true });
		res.json(services);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getServicesByCategory = async (req, res) => {
	try {
		const services = await Service.find({ category: req.params.category, isAvailable: true });
		res.json(services);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getServiceById = async (req, res) => {
	try {
		const service = await Service.findById(req.params.id);
		if (!service) return res.status(404).json({ message: "Service not found" });
		res.json(service);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createService = async (req, res) => {
	try {
		const { name, description, price, image, category, duration } = req.body;
		const service = await Service.create({
			name, description, price, category, duration,
			image: image || "",
		});
		res.status(201).json(service);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateService = async (req, res) => {
	try {
		const { name, description, price, image, category, duration } = req.body;
		const service = await Service.findByIdAndUpdate(
			req.params.id,
			{ name, description, price, image, category, duration },
			{ new: true }
		);
		if (!service) return res.status(404).json({ message: "Service not found" });
		res.json(service);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteService = async (req, res) => {
	try {
		const service = await Service.findById(req.params.id);
		if (!service) return res.status(404).json({ message: "Service not found" });
		if (service.image) {
			const publicId = service.image.split("/").pop().split(".")[0];
			try { await cloudinary.uploader.destroy(`services/${publicId}`); } catch {}
		}
		await Service.findByIdAndDelete(req.params.id);
		res.json({ message: "Service deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
