import healthRouter from './healthcheck-route.js';
import userRouter from './user-route.js';
import {GetMethodOnlyAndNoPayload} from '../middleware.js';

export default (app) => {
    app.use('/healthz',GetMethodOnlyAndNoPayload, healthRouter)
    app.use('/v1/user',userRouter)
}