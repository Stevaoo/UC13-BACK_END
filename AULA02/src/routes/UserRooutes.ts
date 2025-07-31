import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const controller = new UserController();

router.get('/users', controller.list);
router.get('/users/:id', controller.getById);
router.post('/users', controller.create);
router.put('/users/:id', controller.update);
router.delete('/users/:id', controller.delete);

export default router;