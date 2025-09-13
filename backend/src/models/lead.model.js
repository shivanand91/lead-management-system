import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [2, "First name must be at least 2 characters"],
    maxlength: [50, "First name cannot exceed 50 characters"],
  },
  last_name: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    minlength: [2, "Last name must be at least 2 characters"],
    maxlength: [50, "Last name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\+?[1-9]\d{7,14}$/, "Please enter a valid phone number"], // E.164 format
  },
  company: {
    type: String,
    required: [true, "Company is required"],
    trim: true,
    maxlength: [100, "Company name cannot exceed 100 characters"],
  },
  city: {
    type: String,
    trim: true,
    maxlength: [50, "City cannot exceed 50 characters"],
  },
  state: {
    type: String,
    trim: true,
    maxlength: [50, "State cannot exceed 50 characters"],
  },
  source: {
    type: String,
    enum: {
      values: ["website", "facebook_ads", "google_ads", "referral", "events", "other"],
      message: "{VALUE} is not a valid source",
    },
    required: [true, "Lead source is required"],
  },
  status: {
    type: String,
    enum: {
      values: ["new", "contacted", "qualified", "lost", "won"],
      message: "{VALUE} is not a valid status",
    },
    default: "new",
  },
  score: {
    type: Number,
    min: [0, "Score must be at least 0"],
    max: [100, "Score cannot exceed 100"],
    validate: {
      validator: Number.isInteger,
      message: "Score must be an integer",
    },
  },
  lead_value: {
    type: Number,
    min: [0, "Lead value cannot be negative"],
  },
  last_activity_at: {
    type: Date,
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: "Last activity date cannot be in the future",
    },
  },
  is_qualified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);
