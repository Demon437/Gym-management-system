import MembershipPlan from "../models/MembershipPlan.js";

export const getPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSinglePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPlan = async (req, res) => {
  try {
    const { name, duration, price, features, status } = req.body;

    if (!name || !duration || price === undefined) {
      return res.status(400).json({
        message: "Name, duration and price are required",
      });
    }

    const plan = await MembershipPlan.create({
      name,
      duration,
      price,
      features: Array.isArray(features) ? features : [],
      status,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plan.deleteOne();

    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};