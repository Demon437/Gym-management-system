import Trainer from '../models/Trainer.js';

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      trainers
    });
  } catch (error) {
    console.error('❌ Error fetching trainers:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trainers'
    });
  }
};

export const getSingleTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      trainer
    });
  } catch (error) {
    console.error('❌ Error fetching trainer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trainer'
    });
  }
};

export const createTrainer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      experience,
      status,
      rating,
      assignedMembers,
      certifications,
      bio,
      joinDate
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and phone are required'
      });
    }

    const existingTrainer = await Trainer.findOne({ email });

    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        message: 'Trainer with this email already exists'
      });
    }

    const avatar = req.file ? `/uploads/${req.file.filename}` : '';

    const newTrainer = await Trainer.create({
      name,
      email,
      phone,
      specialization,
      experience,
      status,
      rating: rating || 0,
      assignedMembers: assignedMembers || 0,
      certifications: certifications
        ? Array.isArray(certifications)
          ? certifications
          : certifications.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
      bio,
      joinDate,
      avatar
    });

    res.status(201).json({
      success: true,
      message: 'Trainer created successfully',
      trainer: newTrainer
    });
  } catch (error) {
    console.error('❌ Error creating trainer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create trainer'
    });
  }
};

export const updateTrainer = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    if (updateData.certifications && !Array.isArray(updateData.certifications)) {
      updateData.certifications = updateData.certifications
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }

    const updatedTrainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTrainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trainer updated successfully',
      trainer: updatedTrainer
    });
  } catch (error) {
    console.error('❌ Error updating trainer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update trainer'
    });
  }
};

export const deleteTrainer = async (req, res) => {
  try {
    const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);

    if (!deletedTrainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trainer deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting trainer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trainer'
    });
  }
};