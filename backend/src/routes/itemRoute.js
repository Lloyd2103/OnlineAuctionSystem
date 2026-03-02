import express from 'express';
import {createItem, getAllItems, getItemById, updateItem, deleteItem} from '../controllers/itemController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { ItemSchema, updateItemSchema } from '../validations/itemValidation.js';

const router = express.Router();

router.post('/', createItem);
router.get('/', getAllItems);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;