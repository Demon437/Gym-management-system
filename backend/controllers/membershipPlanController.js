import MembershipPlan from '../models/MembershipPlan.js';

// GET all plans
export const getMembershipPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      plans
    });
  } catch (error) {
    console.error('❌ Error fetching membership plans:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership plans'
    });
  }
};

// GET single plan
export const getSingleMembershipPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found'
      });
    }

    res.status(200).json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('❌ Error fetching membership plan:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership plan'
    });
  }
};

// CREATE plan
export const createMembershipPlan = async (req, res) => {
  try {
    const { name, duration, price, description, features, color, isActive } = req.body;

    if (!name || !duration || !price || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, duration, price and description are required'
      });
    }

    const newPlan = await MembershipPlan.create({
      name,
      duration,
      price,
      description,
      features: Array.isArray(features) ? features : [],
      color,
      isActive
    });

    res.status(201).json({
      success: true,
      message: 'Membership plan created successfully',
      plan: newPlan
    });
  } catch (error) {
    console.error('❌ Error creating membership plan:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create membership plan'
    });
  }
};

// UPDATE plan
export const updateMembershipPlan = async (req, res) => {
  try {
    const updatedPlan = await MembershipPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Membership plan updated successfully',
      plan: updatedPlan
    });
  } catch (error) {
    console.error('❌ Error updating membership plan:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update membership plan'
    });
  }
};

// DELETE plan
export const deleteMembershipPlan = async (req, res) => {
  try {
    const deletedPlan = await MembershipPlan.findByIdAndDelete(req.params.id);

    if (!deletedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Membership plan deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting membership plan:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete membership plan'
    });
  }
};