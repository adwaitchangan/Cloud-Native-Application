import {initialize} from './apps/app.js';
import logger from './apps/logger/logger.js';

const startServer = async () => {
    const port = 3000;
    const app = await initialize();
    app.listen(port, () => logger.info('Server is listening at port 3000'));
  };
  
  startServer();