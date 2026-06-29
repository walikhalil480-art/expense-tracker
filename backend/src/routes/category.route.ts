import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { validate } from '../middleware/validate';
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.validator';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .post(validate(createCategorySchema), categoryController.createCategory)
  .get(categoryController.getCategories);

router.route('/:id')
  .put(validate(updateCategorySchema), categoryController.updateCategory)
  .delete(validate(categoryIdSchema), categoryController.deleteCategory);

export default router;
