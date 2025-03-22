import express from 'express'
import { createPlaylist, deletePlaylist, updatePlaylist, getAllPlaylistForUser, removeTrackFromPlaylist, addTrackToPlaylist } from '../controllers/playlistController';
import { authenticate } from '../middlewares/authMiddleware';


const router = express.Router();

router.get("/", authenticate, getAllPlaylistForUser);
router.post("/add-track", authenticate, addTrackToPlaylist);
router.delete("/remove-track/:playlistId/:trackId", authenticate, removeTrackFromPlaylist);
router.post("/create", authenticate, createPlaylist);
router.delete("/:id", authenticate, deletePlaylist);
router.put("/:id", authenticate, updatePlaylist);

export default router;