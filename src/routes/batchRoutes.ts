import express from 'express';
import { createBatch, getBatches, getBatchStudents  } from '../controllers/Batch'; // Adjust path if needed

const router = express.Router();

router.post('/create', createBatch);
router.get('/', getBatches); // GET /batches to list all batches
router.get('/:batchId/students', getBatchStudents); // GET /batches/[batchId]/students to list students in a batch


export default router;
