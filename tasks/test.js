var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var build = require('./build');
var file = require('./utils/file');
var componentConfigPath = findup('component.config.js') || log.onError('You must have a component.config.js in the root of your project.');
var component = require(componentConfigPath);
var paths = component.paths;
var testWrapper = require('./wrappers/karma');
var test = new testWrapper(paths.test);

function once(){
    return test.run(true);
}

function tdd(){
    return test.run(false);
}

function coverage(){
    return test.coverage();
}

function all(){
    if (!component.test){
        log.info('Test set to false within component.config.js : skipping')
        return Promise.resolve();
    }
    return build.all().then(function() {
        return once();
    }).then(function(){
        return test.coverage();
    }).catch(log.onError);
}

module.exports = {
    tdd: tdd,
    once: once,
    coverage: coverage,
    all: all
}