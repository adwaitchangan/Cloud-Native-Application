import express from 'express';
import * as controller from '../controllers/user-controllers.js';
import {auth} from '../auth/auth.js';
import { GetMethodOnlyAndNoPayload } from '../middleware.js';

const router = express.Router();

router.post('/',controller.create);

router.get('/self',auth,controller.fetch)

router.put('/self',auth,controller.update)

router.get('/verify',controller.verify)


export default router;