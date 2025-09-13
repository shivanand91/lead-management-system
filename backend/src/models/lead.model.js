import mongoose from "mongoose"

const leadSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: String,
    company: String,
    city: String,
    state: String,
    source: {
        type: String,
        enum: ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'],
        default: 'other'
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'lost', 'won'],
        default: 'new'
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    lead_value: {
        type: Number,
        default: 0
    },
    last_activity_at: {
        type: Date
    },
    is_qualified: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead
