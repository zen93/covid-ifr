const url = require('url');
var express = require('express');
var router = express.Router();

const covid = require('../controllers/covid');
const countries = require('../controllers/countries');

router.get('/countries', async function(req, res, next) {
  try {
    let data = await countries.getAllCountries();
    res.status(200).send({ message: data });
  } catch (error) {
    console.log(error.stack);
    res.status(500).send({ message: error.message });
  }
});

router.get('/', async function(req, res, next) {
  try {
    let query = url.parse(req.url, true).query;

    let estimateCountry = '';
    let sourceCountries = [];
    let stats = {};
    let days = 10;
    
    if(query) {
      if(query.estimate) {
        estimateCountry = query.estimate.trim().toLowerCase();
      }
      if(query.source) {
        sourceCountries = query.source.trim().split(',');
        for(let i = 0; i < sourceCountries.length; i++) {
          sourceCountries[i] = sourceCountries[i].trim().toLowerCase();
        }
        sourceCountries = sourceCountries.filter((el) => el != '');
      }
      if(query.days) {
        days = parseInt(query.days);
        if(days < 1 || days > 90) throw new Error('Days must be between 1 and 90.');
      }
    }
    stats = await covid.covidStats(sourceCountries, estimateCountry, days);
    res.status(200).send({ message: stats });
  } catch (error) {
    console.log(error.stack);
    res.status(500).send({ message: error.message });
  }
  
});

module.exports = router;
