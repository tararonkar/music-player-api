import express from 'express'
import { signup, signin, refresh } from '../controllers/authController'; 
import { authenticate } from '../middlewares/authMiddleware';


const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/refresh", authenticate, refresh);

export default router;