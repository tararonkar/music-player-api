import express from 'express'
import { getUserDetails, updateUserPassword } from '../controllers/userController'
import { authenticate } from '../middlewares/authMiddleware'


const router = express.Router();

router.get("/", authenticate, getUserDetails);
router.put("/", authenticate, updateUserPassword);

export default router;