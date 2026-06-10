import { Router } from "express";

import VenueController from "../controllers/venue.controller";

const router = Router();

router.post("/", VenueController.createVenue);
router.get("/", VenueController.getAllVenues);
router.get("/:venueId", VenueController.getVenueById);
router.put("/:venueId", VenueController.updateVenue);
router.delete("/:venueId", VenueController.deleteVenue);

// TODO: Creating, updating and deleting routes should only be accessible by Admin

export default router;
