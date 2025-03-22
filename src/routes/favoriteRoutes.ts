import express from "express";
import { addToFavorite, removeFavorite, getFavorites } from "../controllers/favoriteController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/add", authenticate, addToFavorite);
router.delete("/remove/:trackId", authenticate, removeFavorite);
router.get("/", authenticate, getFavorites);

export default router;