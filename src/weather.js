const request = require('request');
const log = console.log;
const chalk = require('chalk');
//global variables
const BaseWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
const weatherApiKey = "2a139b975fad3cfecbf1869e8bce7439";
const BaseGeocodeUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const geocodeApiKey = "pk.eyJ1IjoiamVhbmEwODM0MyIsImEiOiJja2xwMG4wOHEweHU4Mm9tc25lc2d1OWlpIn0.8DVm8a8ENpRX9HS15UtTMw";

//take coordinates and return waeather forecast
const getWeatherForecast = ({ longitude = 0, latitude = 0 } = {}, callback) => {
    // const finalUrl = BaseWeatherUrl + "q=" + encodeURIComponent(city) + "&appid=" + weatherApiKey + "&units=metric";
    const finalUrl = BaseWeatherUrl + "lat=" + latitude + "&lon=" + longitude + "&appid=" + weatherApiKey + "&units=metric";

    request({ url: finalUrl, json: true }, (error, response) => {
        if (error) {
            callback("A network error occured possibly due to unavailability or unstable of internet connection.", undefined);

        } else if (response.body.message) {
            callback("Unable to find location. Try another city name.", undefined);
        } else {
            const body = response.body; //the data we need
            const weather = body.weather[0]; //a dictionary of weaher data
            const main = body.main; //a dictionary of addtional data like temperature, etc.
            callback(undefined, {
                temperature: main.temp,
                feelsLike: main.feels_like,
                pressure: main.pressure,
                humidity: main.humidity,
                desciption: weather.main + ": " + weather.description
            });
        }
    });
}

//Take city name and return coordinates
const geocode = (city, callback) => {
    const url = BaseGeocodeUrl + encodeURIComponent(city) + ".json?" + "access_token=" + geocodeApiKey;
    request({ url, json: true }, (error, { body = [] } = {}) => {
        const results = body.features; //a disctionary of needed features
        if (error) {
            callback("A network error occured possibly due to unavailability or unstable of internet connection.", undefined);
            // log(chalk.red("Possibly a network error occured."));
        } else if (results.length === 0) {
            callback("Unable to find location. Try again with a different city name.", undefined);
            // log(chalk.red("Unable to find location. Try again with a different city name."));
        } else {
            const features = results[0]; //a disctionary of needed features at index 0
            const coordinates = features.center; //latitude and longitude
            const yourSearch = features.text;
            const foundCity = features.place_name;
            callback(undefined, {
                longitude: coordinates[0],
                latitude: coordinates[1],
                yourSearch: yourSearch,
                foundLocation: foundCity
            });
        }
    });
}
const reverseGeocode = (longitude, latitude, callback) => {
    const url = BaseGeocodeUrl + longitude + "," + latitude + ".json?" + "access_token=" + geocodeApiKey;
    request({ url, json: true }, (error, { body = [] } = {}) => {
        const results = body.features; //a disctionary of needed features
        if (error) {
            callback("Possibly a network error occured.", undefined);
            // log(chalk.red("Possibly a network error occured."));
        } else if (results.length === 0) {
            callback("Unable to find location. Try again with a different city name.", undefined);
            // log(chalk.red("Unable to find location. Try again with a different city name."));
        } else {
            const features = results[0]; //a disctionary of needed features at index 0
            const coordinates = features.center; //latitude and longitude
            const addressFound = features.text;
            const foundCity = features.place_name;
            callback(undefined, {
                longitude: coordinates[0],
                latitude: coordinates[1],
                foundAddress: addressFound,
                foundLocation: foundCity
            });
        }
    });
}

//Take coordinates and return city name

module.exports = {
    getWeatherForecast: getWeatherForecast,
    geocode: geocode,
    reverseGeocode: reverseGeocode
}