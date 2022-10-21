const serverlessExpress = require('@vendia/serverless-express')
const app = require('./server')

const server = serverlessExpress.createServer(app)

exports.handler = (event, context) => serverlessExpress.proxy(server, event, context)