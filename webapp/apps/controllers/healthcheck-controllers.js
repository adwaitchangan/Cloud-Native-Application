//import * as service from '../services/healthcheck-services.js';
import {sequelize} from '../db.js';
import logger from '../logger/logger.js';
import {setResponseHeaders} from '../utils.js';

export const check = async (request, response) => {
    setResponseHeaders(response);
    try {
        await sequelize.authenticate();
        logger.info("Database connection working")
        response.status(200).send();
      } catch (error) {
        logger.error('Something went wrong in authentication');
        response.status(503).send();
      }
}