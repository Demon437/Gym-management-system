import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    goal: {
      type: String
    },
    subject: {
      type: String
    },
    service: {
      type: String
    },
    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Inquiry', inquirySchema);