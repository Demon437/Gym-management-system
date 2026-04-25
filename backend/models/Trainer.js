import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    specialization: {
      type: String,
      default: ''
    },
    experience: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    avatar: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 0
    },
    assignedMembers: {
      type: Number,
      default: 0
    },
    certifications: {
      type: [String],
      default: []
    },
    bio: {
      type: String,
      default: ''
    },
    joinDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;