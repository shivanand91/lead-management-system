import Lead from "../models/lead.model.js";

// Create Lead
export const createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.validate(); // explicit mongoose validation
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Get Leads with Pagination + Filters
export const getLeads = async (req, res) => {
  try {
    let { page = 1, limit = 20, ...filters } = req.query;
    page = Number(page);
    limit = Number(limit) > 100 ? 100 : Number(limit);

    const query = {};

    // String filters
    if (filters.email) query.email = { $regex: filters.email, $options: "i" };
    if (filters.company) query.company = { $regex: filters.company, $options: "i" };
    if (filters.city) query.city = { $regex: filters.city, $options: "i" };

    // Enum filters
    if (filters.status) query.status = filters.status;
    if (filters.source) query.source = filters.source;

    // Number filters
    if (filters.score) query.score = Number(filters.score);
    if (filters.score_gt) query.score = { ...query.score, $gt: Number(filters.score_gt) };
    if (filters.score_lt) query.score = { ...query.score, $lt: Number(filters.score_lt) };
    if (filters.score_between) {
      const [min, max] = filters.score_between.split(",").map(Number);
      query.score = { $gte: min, $lte: max };
    }

    if (filters.lead_value_gt) query.lead_value = { $gt: Number(filters.lead_value_gt) };
    if (filters.lead_value_lt) query.lead_value = { $lt: Number(filters.lead_value_lt) };

    // Date filters
    if (filters.created_after) query.createdAt = { $gte: new Date(filters.created_after) };
    if (filters.created_before) query.createdAt = { ...query.createdAt, $lte: new Date(filters.created_before) };
    if (filters.last_activity_after) query.last_activity_at = { $gte: new Date(filters.last_activity_after) };
    if (filters.last_activity_before) query.last_activity_at = { ...query.last_activity_at, $lte: new Date(filters.last_activity_before) };

    // Boolean
    if (filters.is_qualified !== undefined) query.is_qualified = filters.is_qualified === "true";

    // Pagination
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: leads,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single Lead
export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: "Invalid lead ID" });
  }
};

// Update Lead
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    Object.assign(lead, req.body);
    await lead.validate(); // validate before saving
    await lead.save();

    res.json(lead);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Lead
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid lead ID" });
  }
};
