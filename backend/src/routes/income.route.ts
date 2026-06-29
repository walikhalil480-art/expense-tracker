import { Router } from 'express';
import * as incomeController from '../controllers/income.controller';
import { validate } from '../middleware/validate';
import {
  createIncomeSchema,
  getIncomesSchema,
  incomeIdSchema,
  updateIncomeSchema,
} from '../validators/income.validator';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .post(validate(createIncomeSchema), incomeController.createIncome)
  .get(validate(getIncomesSchema), incomeController.getIncomes);

router.route('/:id')
  .get(validate(incomeIdSchema), incomeController.getIncomeById)
  .put(validate(updateIncomeSchema), incomeController.updateIncome)
  .delete(validate(incomeIdSchema), incomeController.deleteIncome);

export default router;
