import dotenv from "dotenv";
import Sequelize from 'sequelize';
import mysql2 from 'mysql2/promise';
import logger from './logger/logger.js';

dotenv.config();
export const sequelize = new Sequelize(process.env.DATABASENAME, process.env.DATABASEUSERNAME, process.env.DATABASEPASSWORD, {
    host: process.env.DATABASEURL,
    dialect: 'mysql',
    logging: (msg) => {
        logger.debug(msg);
    }
});

const createDatabase = async () => {
    const connection = await mysql2.createConnection({
        host: process.env.DATABASEURL,
        user: process.env.DATABASEUSERNAME,
        password: process.env.DATABASEPASSWORD,
    });

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASENAME}`);
        logger.debug(`Database ${process.env.DATABASENAME} created`);
    } catch (error) {
        logger.error('Error creating the database');
    } finally {
        await connection.end();
    }
};

export const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        logger.debug('Connection to the database has been established successfully.');
    } catch (error) {
        logger.warn(`Database ${process.env.DATABASENAME} not present`)
        await createDatabase();
    }
};