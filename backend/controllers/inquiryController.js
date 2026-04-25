import Inquiry from "../models/Inquiry.js";

export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required"
      });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      service,
      message
    });

    res.status(201).json({
      message: "Inquiry submitted successfully",
      inquiry
    });
  } catch (error) {
    console.error("Create Inquiry Error:", error);
    res.status(500).json({
      message: "Failed to submit inquiry"
    });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      inquiries
    });
  } catch (error) {
    console.error("Get Inquiries Error:", error);
    res.status(500).json({
      message: "Failed to fetch inquiries"
    });
  }
};