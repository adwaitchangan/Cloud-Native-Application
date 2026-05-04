import {User} from "../models/user-model.js";
import bcryptjs from 'bcryptjs';
import logger from "../logger/logger.js";
import { setResponseHeaders } from "../utils.js";
export const auth = async (request, response, next) => {
    const authHeader = request.headers.authorization;
    if(!authHeader){
        logger.error('Request failed as auth header is not present');
        setResponseHeaders(response); 
        return response.status(401).send(); 
    }
    if(!authHeader.split(' ')[0] === 'Basic'){
        logger.error('Request failed as basic auth is not present');
        setResponseHeaders(response); 
        return response.status(401).send();
    }

    const encodedCredentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    const userFound = await User.findOne({ 
        where: { username: username } 
    });

    if(!userFound){
        logger.error('Request failed as invalid username or password');
        setResponseHeaders(response); 
        return response.status(401).send({message : 'Invalid username or password'});
    }
    const checkPassword = bcryptjs.compareSync(password, userFound.password);
    if(!checkPassword){
        logger.error('Request failed as invalid username or password');
        setResponseHeaders(response); 
        return response.status(401).send({message : 'Invalid username or password'});
    }
    if(process.env.ENVRUN=="PRODUCTION"){
        if(!userFound.is_verified){
            logger.error('Request failed as user is not verified');
            setResponseHeaders(response); 
            return response.status(403).send({message : 'Not a verified user'});
        }
    }
    next();
}
