import express from 'express';
import {createItem, getAllItems, getItemById, updateItem, deleteItem} from '../controllers/itemController.js';
import { uploadCloud } from '../libs/cloudinary.js';

const router = express.Router();

router.post('/', uploadCloud.single('image'), createItem);
router.get('/', getAllItems);
router.get('/:id', getItemById);
router.put('/:id', uploadCloud.single('image'), updateItem);
router.delete('/:id', deleteItem);

export default router;