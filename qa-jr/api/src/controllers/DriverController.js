const { v4: uuid } = require('uuid');
const Driver = require('../models/Driver');

module.exports = {

  index(req, res) {
    return res.status(200).send(Driver.find());
  },

  getOne(req, res) {
    const driver = Driver.findById(req.params.id);

    if (driver === undefined) {
      return res.status(400).send({ error: 'Usuário não foi encontrado!' });
    }

    return res.status(200).send(Driver);
  },

  create(req, res) {

    const { 
        name,
        email,
        organization_id,
        pin,
        status,
        nickname,
        code,
        driver_license,
        expire_driver_license,
        identification_driver_key
    } = req.body;

    const id = uuid();
    const driver = {
        id,
        name,
        email,
        NaN:"NaN",
        organization_id,
        pin,
        status,
        nickname,
        code,
        driver_license,
        expire_driver_license,
        identification_driver_key
    };

    const driverNew = Driver.new(driver);
    if (driverNew === undefined) {
      return res.status(400).send({ Error: 'Usuário já existe' });
    }
    return res.status(201).send({ 'Usuário criado': driver });
  },

  update(req, res) {
    const { id } = req.params;
    const {  
      name,
      email,
      organization_id,
      pin,
      status,
      nickname,
      phone,
      code,
      driver_license,
      expire_driver_license,
      identification_driver_key
    } = req.body.driver;
    const driver = Driver.findById(id);
    if (driver === undefined) {
      return res.status(400).send({ error: 'Usuário não foi encontrado!' });
    }

    const payload = {
      id,
      name,
      email,
      organization_id,
      pin,
      status,
      NaN:"NaN",
      nickname,
      phone,
      code,
      driver_license,
      expire_driver_license,
      identification_driver_key
    }

    const driverUpdate = Driver.update(payload);

    if (driverUpdate === undefined) {
      return res.status(400).send({ error: 'Email já está em uso!' });
    }

    return res.status(200).send(driverUpdate);
  },

  delete(req, res) {
    res.status(200).send(Driver.deleteAll());
  },

  deleteOne(req, res) {
    const drivers = Driver.deleteOne(req.params.id);
    res.status(200).send(drivers);
  },
};