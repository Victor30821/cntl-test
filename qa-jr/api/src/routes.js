const express = require('express');
const DriverController = require('./controllers/DriverController');
const { checkDriverListExist, inputValidation } = require('./middlewares/DriverMiddlewares');

const router = express.Router();

router.get('/api/v1/Drivers', checkDriverListExist, DriverController.index);
router.get('/api/v1/Drivers/:id', checkDriverListExist, DriverController.getOne);

router.post('/api/v1/Drivers',  DriverController.create);

router.put('/api/v1/Drivers/:id', checkDriverListExist, DriverController.update);

router.delete('/api/v1/Drivers', checkDriverListExist, DriverController.delete);
router.delete('/api/v1/Drivers/:id', checkDriverListExist, DriverController.deleteOne);

module.exports = router;