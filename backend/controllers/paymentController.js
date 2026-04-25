import Payment from "../models/Payment.js";

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("member")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSinglePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("member");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { member, amount, paymentDate, paymentMethod, status } = req.body;

    if (!member || amount === undefined) {
      return res.status(400).json({
        message: "Member and amount are required",
      });
    }

    const payment = await Payment.create({
      member,
      amount,
      paymentDate: paymentDate || Date.now(),
      paymentMethod,
      status,
    });

    const populatedPayment = await Payment.findById(payment._id).populate("member");

    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("member");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await payment.deleteOne();

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};