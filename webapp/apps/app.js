import express from 'express';
import registerRouter from './routes/index.js';
import {sequelize,initializeDatabase} from './db.js';
import { logRequest } from './middleware.js';

export const initialize = async () => {
    const app = express();
    app.use(express.json());
    app.use(logRequest);
    //dotenv.config();
    await initializeDatabase();
    await sequelize.sync({alter : true});
    registerRouter(app);
    return app;
}

