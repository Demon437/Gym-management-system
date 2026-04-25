import ClassModel from '../models/Class.js';

export const getClasses = async (req, res) => {
  try {
    const classes = await ClassModel.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      classes
    });
  } catch (error) {
    console.error('❌ Error fetching classes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes'
    });
  }
};

export const createClass = async (req, res) => {
  try {
    const {
      name,
      trainerId,
      trainer,
      schedule,
      duration,
      capacity,
      enrolled,
      description,
      level,
      status
    } = req.body;

    if (!name || !trainer || !schedule || !duration || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Name, trainer, schedule, duration and capacity are required'
      });
    }

    const newClass = await ClassModel.create({
      name,
      trainerId,
      trainer,
      schedule,
      duration,
      capacity,
      enrolled: enrolled || 0,
      description,
      level,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      classItem: newClass
    });
  } catch (error) {
    console.error('❌ Error creating class:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create class'
    });
  }
};

export const updateClass = async (req, res) => {
  try {
    const updatedClass = await ClassModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      classItem: updatedClass
    });
  } catch (error) {
    console.error('❌ Error updating class:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update class'
    });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const deletedClass = await ClassModel.findByIdAndDelete(req.params.id);

    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting class:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete class'
    });
  }
};