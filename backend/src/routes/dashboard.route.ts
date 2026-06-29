import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { getDashboardSummarySchema } from '../validators/dashboard.validator';

const router = Router();

router.use(protect);
router.get('/summary', validate(getDashboardSummarySchema), dashboardController.getDashboardSummary);

export default router;
