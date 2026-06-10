import { Router } from "express";

import VenueController from "../controllers/venue.controller";

const router = Router();

router.post("/", VenueController.createVenue);
router.get("/", VenueController.getAllVenues);
router.get("/:venueId", VenueController.getVenueById);
router.patch("/:venueId", VenueController.updateVenue);
router.delete("/:venueId", VenueController.deleteVenue);

export default router;
