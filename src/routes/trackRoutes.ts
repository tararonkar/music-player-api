import express from 'express'
import { getAllTracks, getTrack, createTrack, updateTrack, deleteTrack } from '../controllers/trackController';
import { authenticate, authenticateAdmin } from '../middlewares/authMiddleware';


const router = express.Router();

router.get("/", authenticate, getAllTracks);
router.get("/:id", authenticate, getTrack);

router.post("/", authenticateAdmin, createTrack);
router.put("/", authenticateAdmin, updateTrack);
router.delete("/", authenticateAdmin, deleteTrack);

export default router;