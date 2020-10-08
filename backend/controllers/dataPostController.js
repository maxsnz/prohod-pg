const { Data } = require('../models');
const errors = require('../config/errors');

module.exports = async function(req, res) {
  try {
    if (!(req.body && req.body.data)) {
      res.send(JSON.stringify(errors.wrongFormat));
      return;
    }
    const data = req.body.data;

    await Data.create({ data: JSON.stringify(data) });
    
    res.send(JSON.stringify({ success: true }));

  } catch (error) {
    console.error(error);
    res.send(JSON.stringify(errors.unknownError));
  }
}