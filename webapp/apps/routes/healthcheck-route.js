import express from 'express';
import * as controller from '../controllers/healthcheck-controllers.js';

const router = express.Router();

router.route('/')
    .get(controller.check)

export default router;