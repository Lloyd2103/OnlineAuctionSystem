import express from 'express';
import { 
    createItem, 
    getAllItems,
    getAllItemsAdmin,
    getItemById, 
    updateItem, 
    deleteItem, 
    updateItemStatus
} from '../controllers/itemController.js';
import { uploadCloud } from '../libs/cloudinary.js';
import { protectedRoute, adminRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protectedRoute, getAllItems);
router.post('/', protectedRoute, uploadCloud.single('image'), createItem);


router.get('/all', protectedRoute, adminRoute, getAllItemsAdmin);

router.get('/:id', protectedRoute, getItemById);
router.delete('/:id', protectedRoute, deleteItem);
router.patch('/:id', protectedRoute, uploadCloud.single('image'), updateItem);
router.put('/:id/status', protectedRoute, adminRoute, updateItemStatus);

export default router;