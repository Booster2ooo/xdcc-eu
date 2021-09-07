# xdcc-eu
Node.js module for xdcc-eu

## Disclamer
This module does not intend to facilitate illegal files transfer. The author may not be taken responsible for any copyright infringement or illegal uses.

## Usage

```javascript
#!/usr/bin/env node

var xdccEu = require('./src/xdcc-eu.js')
  , start
  , end
  ;
xdccEu.on(xdccEu.events.progress, function(results) {
    console.log('progress');
    console.log(results.length + ' results found');
});
xdccEu.on(xdccEu.events.complete, function(results) {
    console.log('complete');
    console.log(results.length + ' total results found');
});
start = process.hrtime();
xdccEu.search('test')
    .then(function(results) {
        end = process.hrtime(start);
        start = process.hrtime();
        console.log(end);
        return xdccEu.search('test', true);
    })
    .then(function(results) {
        end = process.hrtime(start);
        console.log(end);
        console.log('done');
        return xdccEu.clearCache();
    })
    .then(function() {
        process.exit();
    })
    .catch(function(err) {
        console.error(err);
        err.stack && console.error(err.stack);
    });
```