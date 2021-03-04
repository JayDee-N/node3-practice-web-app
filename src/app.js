//system/core modules
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const chalk = require('chalk');
const log = console.log;
//created modules/files
const weather = require('./weather.js');
const notes = require('./notes.js');

//init express server
const app = express();
const port = process.env.PORT || 3000;

//paths variales
const publicFolderPath = path.join(__dirname, '../public');
const viewsFolderPath = path.join(__dirname, '../public/templates/views');
const sharedFolderPath = path.join(__dirname, '../public/templates/shared');

//set up handlebars engine to work with express to create templates
app.set('view engine', 'hbs');
//tell the web-app where to find the views to render
app.set('views', viewsFolderPath);
//tell the web-app where to find the shared files to render
hbs.registerPartials(sharedFolderPath);

//use the folders and contents inside the public folder for our web-app
//"set up static diractory to serve"
app.use(express.static(publicFolderPath));

//set up the url/links for different pages
app.get('', (req, res) => {
    res.render('index', {
        title: 'Home',
        logo: 'Home page',
        footerContents: 'Copyright @ JEAN NIHO All Rights Reserved'
    });
});
app.use('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        logo: 'About page',
        footerContents: 'Copyright @ JEAN NIHO All Rights Reserved'
    });
});
app.get('/weather', (req, res) => {
    const queryObject = req.query;
    if (queryObject.location) {
        return weather.geocode(queryObject.location, (error, data) => {
            if (error) {
                return res.send({
                    error,
                });
            }
            weather.getWeatherForecast(data, (error, forecastData) => {
                if (error) {
                    return res.send({
                        error,
                    });
                }
                res.send({
                    yourSearch: data.yourSearch,
                    foundLocation: data.foundLocation,
                    ...forecastData,
                });
            });
        });
    }
    res.render('weather', {
        title: 'Search',
        logo: 'Search page',
        footerContents: 'Created by Jean Niho',
    });
});
app.get('/notes', (req, res) => {
    const queryObject = req.query;
    if (queryObject.query) {
        return notes.readNote(queryObject.query, (data) => {
            if (data.error) {
                return res.send({
                    error: data.error,
                });
            }
            res.send({
                title: data.title,
                body: data.body,
            });
        });
    } else if (queryObject.title && queryObject.body) {
        return notes.addNotes(queryObject.title, queryObject.body, (data) => {
            if (data.error) {
                return res.send({
                    error: data.error,
                });
            }
            res.send(data);
        });
    } else if (queryObject.delete) {
        return notes.removeNotes(queryObject.delete, (data) => {
            if (data.error) {
                return res.send({
                    error: data.error,
                });
            }
            res.send(data);
        });
    } else if (queryObject.all) {
        return notes.listNotes((data) => {
            if (data.length == 0) {
                return res.send({
                    error: "There are no notes available currently.",
                });
            }
            res.send(data);
        });
    }
    res.render('notes', {
        title: 'Notes',
        logo: 'Notes page',
        placeHolderContents: 'Make use of the available options to navigate and manipulate locally stored notes.',
        footerContents: 'Created by Jean Niho'
    });
});
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        logo: 'Help page',
        footerContents: 'Created by Jean Niho'
    });
});
//deal with unmatched url/links requests
app.get('/notes/*', (req, res) => {
    res.render('error', {
        title: 'Notice',
        logo: 'Notice page',
        error: 'This functionality is still under construction. It will completed soon. In the meanwhile, please navigate other available options. Thank you for your unerstanding :)',
        footerContents: 'Created by Jean Niho'
    });
});
//deal with unmatched url/links requests
app.get('*', (req, res) => {
    res.render('error', {
        title: 'Error',
        logo: 'Error page',
        error: 'Unable to find contents for the specified url(search). Try with a valid search.',
        footerContents: 'Created by Jean Niho'
    });
});

//start the server
app.listen(port, () => {
    log("Server started on port " + port);
});