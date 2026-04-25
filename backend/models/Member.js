import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
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
    membershipPlan: {
      type: String,
      required: true,
      trim: true,
      default: 'Basic'
    },
    status: {
      type: String,
      enum: ['Active', 'Expired'],
      default: 'Active'
    },
    age: {
      type: Number,
      default: null
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    emergencyContact: {
      type: String,
      trim: true,
      default: ''
    },
    expiryDate: {
      type: Date,
      default: null
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Member = mongoose.model('Member', memberSchema);

export default Member;