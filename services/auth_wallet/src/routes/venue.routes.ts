import { Router } from "express";
import {
  createVenue,
  getVenues,
  getVenue,
  updateVenue,
  deleteVenue,
} from "../controllers/venue.controller";

const router = Router();

router.post("/", createVenue);
router.get("/", getVenues);
router.get("/:venueId", getVenue);
router.put("/:venueId", updateVenue);
router.delete("/:venueId", deleteVenue);

export default router;
