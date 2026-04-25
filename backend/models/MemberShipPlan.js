import mongoose from 'mongoose';

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    billingType: {
      type: String,
      enum: ['Monthly', 'Yearly'],
      required: true,
      default: 'Monthly'
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    features: {
      type: [String],
      default: []
    },
    included: {
      type: [String],
      default: []
    },
    highlights: {
      type: [String],
      default: []
    },
    buttonText: {
      type: String,
      default: 'Choose Plan'
    },
    color: {
      type: String,
      default: '#3B82F6'
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const MembershipPlan = mongoose.model('MembershipPlan', membershipPlanSchema);

export default MembershipPlan;