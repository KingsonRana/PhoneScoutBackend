import express from 'express';
import { createPhone } from '../controllers/phoneController.js';

const router = express.Router();

// Route to handle phone specifications submission
router.post('/addPhone', createPhone);

export default router;
