const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find()
    .populate('user.ref')
    .populate('campsite.ref')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err =>  next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {   
    favorite.findById(req.user._id)
    .populate('user.ref')
    .populate('campsite.ref')
    .then(favorite => {
        if(favorite) {
            req.body.forEach(message => {
                if(message._id === message._id) {
                    console.log('Campsite already Favorited')
                }else {
                    campsite.findById(message._id)
                    .then(campsite => {
                        favorite.campsite.push(campsite)
                        favorite.save();
                    })
                    .then(campsite => {
                        console.log('Campsite added to your favorite')
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(campsite);
                    })
                    .catch(err => next(err));
                }                
            })
        }
    })
    Favorite.create(req.body)
    .then(favorite => {
        console.log('Favorite Created ', favorite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findByIdAndDelete(req.user._id)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});



favoriteRouter.route('/favorites/:campsiteId ')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('Operation is not supported on /favorites/:campsiteId')
    })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorite.findById(req.user._id)
    .then(favorite => {
        favorite.campsites.forEach(campsite => {
            if(campsite._id === req.params.campsiteId) {
                res.statusCode = 403;
                res.end('POST operation is not supported on /favorites');
            } else {
                favorite.campsites.push(campsite.findById(req.params.campsiteId));
                favorite.save()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    .catch(err => next(err))
            }
        })
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Operation is not supported on /favorites/:campsiteId')
    })
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;
