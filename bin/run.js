const { logger } = require('../logs')
const cluster = require('cluster')
const { cpus } = require('os')
const config = require('../src/config')
const app = require('../src/app')
// Express app is passed to an http server instance in order to set up the websocket's listener
const { Server } = require('http')
const http = new Server(app)

// Initializing modular websocket listener with http server as argument
require('../src/websocket/socketListener')(http)

//database connection is called as soon as the app is initialized
require('../src/databases').connect()
    .then(() => logger.info('Successfully connected to all databases.'))

if (config.MODE === 'cluster' && cluster.isPrimary) {
    logger.info(`Started master process with PID: ${process.pid}`)
    //Forking a worker for each core
    for (let i = 0; i < cpus().length; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        logger.info(`Worker PID: ${worker.process.pid} has died. Spawning new worker...`)
        cluster.fork()
    })
} else {
    //Runs express server for every worker that is spawned or just once if we're running on fork mode
    const PORT = config.PORT

    http.listen(PORT, () => {
        logger.info(`Express server listening on port ${PORT} - PID: ${process.pid}`)
    })

    http.on('error', error => logger.error(`HTTP server error: ${error}`))
}