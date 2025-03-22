import express from 'express'
import { getFile } from '../controllers/musicController';


const router = express.Router();

router.get("/:filename", getFile);

export default router;