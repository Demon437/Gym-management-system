import express from 'express';
import {
  getMembers,
  getSingleMember,
  createMember,
  updateMember,
  deleteMember
} from '../controllers/memberController.js';

const router = express.Router();

router.get('/', getMembers);
router.get('/:id', getSingleMember);
router.post('/', createMember);
router.patch('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;