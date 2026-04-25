import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    trainerId: {
      type: String,
      default: ''
    },
    trainer: {
      type: String,
      required: true,
      trim: true
    },
    schedule: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true,
      default: 0
    },
    enrolled: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    level: {
      type: String,
      default: 'Beginner'
    },
    status: {
      type: String,
      default: 'Active'
    }
  },
  { timestamps: true }
);

const ClassModel = mongoose.model('Class', classSchema);

export default ClassModel;