const db = require('../models/db');

async function getAllCountries() {
    let countriesData = await db.fetchAllCountriesData();
    return countriesData;
}

module.exports.getAllCountries = getAllCountries;