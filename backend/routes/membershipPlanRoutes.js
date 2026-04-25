import express from 'express';
import {
  getMembershipPlans,
  getSingleMembershipPlan,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan
} from '../controllers/membershipPlanController.js';

const router = express.Router();

router.get('/', getMembershipPlans);
router.get('/:id', getSingleMembershipPlan);
router.post('/', createMembershipPlan);
router.patch('/:id', updateMembershipPlan);
router.delete('/:id', deleteMembershipPlan);

export default router;