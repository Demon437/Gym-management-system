import express from 'express';
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass
} from '../controllers/classController.js';

const router = express.Router();

router.get('/', getClasses);
router.post('/', createClass);
router.patch('/:id', updateClass);
router.delete('/:id', deleteClass);

export default router;