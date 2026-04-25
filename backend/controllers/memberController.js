import Member from '../models/Member.js';

// GET all members
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      members
    });
  } catch (error) {
    console.error('❌ Error fetching members:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch members'
    });
  }
};

// GET single member
export const getSingleMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      member
    });
  } catch (error) {
    console.error('❌ Error fetching member:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch member'
    });
  }
};

// CREATE member
export const createMember = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      membershipPlan,
      status,
      age,
      gender,
      address,
      emergencyContact,
      expiryDate,
      joinDate,
      avatar
    } = req.body;

    if (!name || !email || !phone || !membershipPlan) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone and membership plan are required'
      });
    }

    const existingMember = await Member.findOne({ email });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Member with this email already exists'
      });
    }

    const newMember = await Member.create({
      name,
      email,
      phone,
      membershipPlan,
      status,
      age: age || null,
      gender,
      address,
      emergencyContact,
      expiryDate: expiryDate || null,
      joinDate: joinDate || new Date(),
      avatar
    });

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      member: newMember
    });
  } catch (error) {
    console.error('❌ Error creating member:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create member'
    });
  }
};

// UPDATE member
export const updateMember = async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedMember) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      member: updatedMember
    });
  } catch (error) {
    console.error('❌ Error updating member:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update member'
    });
  }
};

// DELETE member
export const deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);

    if (!deletedMember) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting member:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete member'
    });
  }
};