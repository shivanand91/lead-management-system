import express from "express";
import { createLead, getLeads, getLead, updateLead, deleteLead } from "../controllers/lead.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createLead)
  .get(protect, getLeads);

router.route("/:id")
  .get(protect, getLead)
  .put(protect, updateLead)
  .delete(protect, deleteLead);

export default router;
