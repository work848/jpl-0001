import express from 'express';
import * as adjectiveController from '../controllers/adjectiveController.js';

const router = express.Router();

router.post('/conjugate', adjectiveController.conjugate);
router.get('/', adjectiveController.list);
router.post('/', adjectiveController.create);
router.delete('/:id', adjectiveController.remove);
router.patch('/:id/hide', adjectiveController.hide);

export default router;
