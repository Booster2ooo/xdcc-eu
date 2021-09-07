'use strict';
let cancel = false;

const
    EventEmitter = require('events')
    
  , xdccEuEvents = require('./xdcc-eu-events.js')
  , xdccEuHttpClient = require('./xdcc-eu-http-client.js')
  , xdccEuCache = require('./xdcc-eu-cache.js')
  
  , emitter = new EventEmitter()
  
  , doSearch = (terms) => new Promise((resolve, reject) => {
        let results = []
          , compute = (results) => new Promise((res, rej) => {
                if (!results) {
                    return rej('empty xdccEu reponse');
                }
                emitter.emit(xdccEuEvents.progress, results);
                res(results);
            })
          ;
        xdccEuHttpClient
            .get(terms)
            .then(compute)
            .then(resolve)
            .catch(reject)
            ;
    })
    
  , xdccEu = {
        search: (terms, cached) => new Promise((resolve, reject) => {
            cancel = false;
            if(!terms) {
                return reject('no search terms provided');
            }
            if(cached) {
                let cache = xdccEuCache.get(terms);
                if (cache && cache.done) {
                    emitter.emit(xdccEuEvents.complete, cache.results);
                    return resolve(cache.results);
                }
            }
            doSearch(terms)
                .then((results) => {
                    if (!cancel) {
                        xdccEuCache.set(terms, results);
                    }
                    emitter.emit(xdccEuEvents.complete, results);
                    resolve(results);
                })
                .catch((err) => {
                    emitter.emit(xdccEuEvents.error, err);
                    reject(err);
                })
            ;
        })
      , clearCache: (terms) => {
            if(terms) {
                xdccEuCache.remove(terms);
            }
            else {
                xdccEuCache.clear();
            }
            return Promise.resolve();
        }
      , cancel: () => { 
            cancel = true;
            return Promise.resolve();
        }
      , events: xdccEuEvents
      , on: emitter.on.bind(emitter)
    }
  ;

module.exports = xdccEu;