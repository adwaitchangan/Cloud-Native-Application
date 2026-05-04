import logger from './logger/logger.js';
import {setResponseHeaders} from './utils.js';

export const GetMethodOnlyAndNoPayload = (request, response, next) => {
    const contentType = request.headers['content-type'];
    if (request.method !== 'GET') {
        setResponseHeaders(response); 
        logger.error('Request failed as invalid request method');
        return response.status(405).send();
    } 
    if (contentType === 'application/json') {
        try {
            request.body = JSON.parse(request.body);
        } catch (error) {
          setResponseHeaders(response);
          logger.error('Request failed as body is invalid');
          return response.status(400).send();
        }
      } else if(contentType && contentType!=='application/json') {
        setResponseHeaders(response);
        logger.error('Request failed as invalid content type');
        return response.status(400).send();
      }
    if(Object.keys(request.body).length > 0 || Object.keys(request.query).length > 0){
        setResponseHeaders(response);
        logger.error('Request failed as payload or query parameter for request exist');
        return response.status(400).send();
    }
    next();
};

export const logRequest = (request, response, next) => {
  logger.info(`Request triggered : ${request.method} ${request.url}`);
  next();
};