import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug', 
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: '/var/log/webapp/webapp.log' })
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]' }),
    winston.format.json(),
    winston.format.printf(({ level, message, timestamp }) => {
        return `{"name":"webapp","severity":"${level.toUpperCase()}","message":"${message}","timestamp":"${timestamp}"}`;
      })
  )
});

export default logger;