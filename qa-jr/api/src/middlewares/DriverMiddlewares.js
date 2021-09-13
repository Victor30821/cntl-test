const Driver = require('../models/Driver');

module.exports = {
  checkDriverListExist(req, res, next) {
    const drivers = Driver.find();
    if (drivers === undefined) {
      return res.status(400).send({ Error: 'DriversList.json não existe, por favor crie um usuário para instânciar o arquivo' });
    }
    return next();
  },
};