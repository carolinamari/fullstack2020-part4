/*eslint-env es6*/

const logger = require('./logger')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('Authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }
    next()
}

const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method)
    logger.info('Path:   ', request.path)
    logger.info('Body:   ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        response.status(400).send({ error: 'Malformatted id' })
    } else if (error.name === 'ValidationError') {
        response.status(400).send({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        response.status(401).json({ error: 'Invalid token' })
    }

    next(error)
}

module.exports = {
    tokenExtractor,
    requestLogger,
    unknownEndpoint,
    errorHandler
}