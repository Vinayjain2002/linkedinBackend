const config= require('../config/index')
const express = require('express')
const {Server} = require('socket.io')
const cors= require('cors')
// for the detailed logging of the data
const morgan= require('morgan')
// helmet for the security 
const helmet= require('helmet')
const bodyParser = require('body-parser')
const errorHandler= require('../middlewares/error-handler')
const passport= require('passport')
const passportJwt= require('../services/passport')
const apiRouter= require('../routes/api')
const http= require('http')

const app= express();
// used to create a http server with the express
const server= http.Server(app)
// const io= require('socket.io')(server);
const io= new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
})

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cors());
app.use(helmet());

if (config.env !== 'test') app.use(morgan('combined'))
app.use(passport.initialize());
passport.use('jwt', passportJwt.jwt)
app.use('/api/v1', apiRouter)
app.use(errorHandler.handleNotFound);
app.use(errorHandler.handleError);

app.get('/', (req,res)=>{
    res.send('Welcome to the LinkedIn Server')
});

exports.start= ()=>{
    server.listen(config.port, (err)=>{
        if(err){
            console.log(`Error: ${err}`)
            process.exit(-1);
        }
        console.log(`${config.app} is running on ${config.port}`)
    })
}

exports.app= app;