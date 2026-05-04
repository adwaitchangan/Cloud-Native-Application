import {User} from '../models/user-model.js';
import {setResponseHeaders} from '../utils.js';
import bcryptjs from 'bcryptjs';
import logger from '../logger/logger.js';
import { PubSub } from '@google-cloud/pubsub';

const pubsub = new PubSub({ projectId: 'csye6225-414123' });

export const create = async (request, response) => {
    setResponseHeaders(response);
    try {

      const allowedFields = ['first_name', 'last_name', 'username', 'password'];
      const extraFields = Object.keys(request.body).filter(field => !allowedFields.includes(field));
      if (extraFields.length > 0) {
        logger.error('Request failed as only fields allowed are first_name, last_name, username, password');
        return response.status(400).json({ message : 'Only fields allowed are first_name, last_name, username, password'});
      }
      
      const missingOrEmptyFields = allowedFields.filter(field => {
        const value = request.body[field];
        return !value || typeof value !== 'string' || value.trim() === '';
      });
  
      if (missingOrEmptyFields.length > 0) {
        logger.error('Request failed as only fields allowed are first_name, last_name, username, password and they should be non empty strings');
        return response.status(400).json({ message : `Only fields allowed are first_name, last_name, username, password and they should be non empty strings` });
      }

    const emailCheckRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailCheckRegex.test(request.body.username)) {
      logger.error('Request failed as invalid email address format for username provided');
      return response.status(400).json({ message: 'Invalid email address format for username' });
    }

    const passwordCheckRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    if (!passwordCheckRegex.test(request.body.password)) {
      logger.error('Request failed as Password should contain atleast one capital letter, one special character one digit and its length should be between 8-15');
      return response.status(400).json({ message: 'Invalid password. Password should contain atleast one capital letter, one special character one digit and its length should be between 8-15' });
    }
      const userFound = await User.findOne({ 
        where: { username : request.body.username } 
    });

    if(userFound){
       logger.error('Request failed as username already present. Please try with a new email address.');
        return response.status(400).json({message : 'Username already present. Please try with a new email address.'});
    } 
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(request.body.password, salt);
    const user = await User.create({
      first_name : request.body.first_name,
      last_name : request.body.last_name,
      password : hashedPassword,
      username : request.body.username,
      is_verified : false
    });
    
    const responseData = {
      id : user.id,
      first_name : user.first_name,
      last_name : user.last_name,
      username : user.username,
      account_created : user.account_created,
      account_updated : user.account_updated
    }
    await publishMessage(user.first_name, user.username, user.verification_token);
    console.log(user.first_name, user.verification_token)
    logger.info('User created successfully')
    return response.status(201).json(responseData);
  } catch (error) {
    logger.error(error);
    response.status(400).send();
  }
}

async function publishMessage(firstName,email,token) {
  const topicName = 'verify_email'; 
  const data = Buffer.from(JSON.stringify({firstName,email,token}));
  console.log(data)
  try {
    await pubsub.topic(topicName).publish(data);
    logger.info("Message published successfully to Pub/Sub");
  } catch (error) {
    logger.error("Error publishing message to Pub/Sub:", error);
  }
}

export const fetch = async (request, response) => {
    setResponseHeaders(response);
    try {
      const authHeader = request.headers.authorization;
      const encodedCredentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');
  
      const userFound = await User.findOne({ 
          where: { username: username },
          attributes: {
              exclude: ['password']
          }
      });
      logger.info('User fetch successfully')
        response.status(200).json(userFound);
      } catch (error) {
        logger.error(error);
        response.status(400).send();
      }
}

export const update = async (request, response) => {
    setResponseHeaders(response);
    try {

      const authHeader = request.headers.authorization;
      const encodedCredentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');

      const allowedFields = ['first_name', 'last_name', 'password'];
      const extraFields = Object.keys(request.body).filter(field => !allowedFields.includes(field));
      if (extraFields.length > 0) {
        logger.error('Request failed as only fields allowed are first_name, last_name, password for update');
        return response.status(400).json({ message : 'Only fields allowed are first_name, last_name, password for update'});
      }
  
      const missingOrEmptyFields = allowedFields.filter(field => {
        const value = request.body[field];
        if(value === undefined || !value){
          return;
        }
        return typeof value !== 'string' || value.trim() === '';
      });
  
      if (missingOrEmptyFields.length > 0) {
        logger.error('Request failed as only fields allowed are first_name, last_name, password and should be non empty strings');
        return response.status(400).json({ message : `Only fields allowed are first_name, last_name, password and should be non empty strings` });
      }

      if(Object.keys(request.body).length === 0){
        logger.error('Request failed as please provide first_name, last_name, password for update');
        setResponseHeaders(response);
        return response.status(400).json({message : 'Please provide first_name, last_name, password for update'});
    }

    if(request.body.password !== undefined){
      const passwordCheckRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
      if (!passwordCheckRegex.test(request.body.password)) {
        logger.error('Request failed as invalid password provided. Password should contain atleast one capital letter, one special character one digit and its length should be between 8-15');
       return response.status(400).json({ message: 'Invalid password. Password should contain atleast one capital letter, one special character one digit and its length should be between 8-15' });
      }


    if (request.body.password) {
      const salt = await bcryptjs.genSalt(10);
      var updateHashedPassword = await bcryptjs.hash(request.body.password, salt)
    }
    }
    

    const userUpdated = {
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      password: updateHashedPassword,
    }

    const updateUser = await User.update(userUpdated, {
      where: { username: username }
  })  
      logger.info('User updated successfully')
      response.status(204).send();
    } catch (error) {
      logger.error(error);
      response.status(400).send();
    }
}

export const verify = async (request, response) => {
  setResponseHeaders(response);
  try {
    const token = request.query.token;
    const user = await User.findOne({ where: { verification_token:token } });
    if (!user) {
      return response.status(400).send('Invalid token');
    }
    const now = new Date();
    const verificationExpiry = new Date(user.verification_expiry_at);
    if(now < verificationExpiry){
      await User.update({ is_verified: true }, { where: { id: user.id } });
      logger.info('User verified successfully')
      response.status(200).send('User verified successfully');
    }else{
      logger.error('User verification unsuccessfull as time limit excceded');
      response.status(400).send('User verification unsuccessfull as token expired');
    }
    
    } catch (error) {
      logger.error(error);
      response.status(400).send();
    }
}
