const { Data } = require('../models');
const errors = require('../config/errors');

module.exports = async function(req, res) {
  try {
    const data = await Data.findAll({ limit: 1, where: {}, order: [ [ 'createdAt', 'DESC' ]] });
    if (!(data && data[0] && data[0].data)) {
      res.send(JSON.stringify(errors.noData));
      return;
    }
    res.send(JSON.stringify(data[0].data));
  } catch (error) {
    console.error(error);
    res.send(JSON.stringify(errors.unknownError));
  }
}