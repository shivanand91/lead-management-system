import Lead from "../models/lead.model.js"

export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;

    let query = {};

    // String contains
    if (filters.company) query.company = { $regex: filters.company, $options: 'i' };
    if (filters.email) query.email = { $regex: filters.email, $options: 'i' };

    // Enum exact match
    if (filters.status) query.status = filters.status;
    if (filters.source) query.source = filters.source;

    // Number filters
    if (filters.score_gt) query.score = { ...query.score, $gt: Number(filters.score_gt) };
    if (filters.score_lt) query.score = { ...query.score, $lt: Number(filters.score_lt) };

    // Date filters
    if (filters.created_after) query.createdAt = { ...query.createdAt, $gte: new Date(filters.created_after) };
    if (filters.created_before) query.createdAt = { ...query.createdAt, $lte: new Date(filters.created_before) };

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      data: leads,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
