const express = require('express')
const multer = require('multer')
const uploadConfig = require('./config/upload')

const ServicesController = require('./controllers/ServicesController');
const CustomerController = require('./controllers/CustomerController');
const UserController = require('./controllers/UserController');

const routes = express.Router()
const upload = multer(uploadConfig)

// Rotas para os Serviços
routes.post('/service', ServicesController.store)
routes.get('/service/:userId', ServicesController.indexByDate)
routes.put('/service', ServicesController.updateById)
routes.delete('/service', ServicesController.deleteById)

// Rotas para os Clientes
routes.post('/customer', CustomerController.store)
routes.get('/customer', CustomerController.indexById)

routes.get('/')

//Rotas para os Usuários
routes.post('/user', UserController.store)
routes.put('/user', UserController.update)
routes.put('/userimg', upload.single('file'), UserController.updateImg)
routes.delete('/userimg', UserController.deleteImg)
routes.get('/user', UserController.authenticate)

routes.get('/main/:userId', UserController.userById)

module.exports = routes;