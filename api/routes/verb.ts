import express from 'express';
import * as verbController from '../controllers/verbController.js';

const router = express.Router();

router.post('/conjugate', verbController.conjugate);
router.get('/', verbController.list);
router.post('/', verbController.create);
router.delete('/:id', verbController.remove);
router.patch('/:id/hide', verbController.hide);

export default router;
