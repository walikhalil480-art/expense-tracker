import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller';
import { validate } from '../middleware/validate';
import {
  createExpenseSchema,
  expenseIdSchema,
  getExpensesSchema,
  updateExpenseSchema,
} from '../validators/expense.validator';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .post(validate(createExpenseSchema), expenseController.createExpense)
  .get(validate(getExpensesSchema), expenseController.getExpenses);

router.route('/:id')
  .get(validate(expenseIdSchema), expenseController.getExpenseById)
  .put(validate(updateExpenseSchema), expenseController.updateExpense)
  .delete(validate(expenseIdSchema), expenseController.deleteExpense);

export default router;
