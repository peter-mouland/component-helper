var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var config, bump = {};

bump.all = function all(type){
    if (type == 'current') return Promise.resolve(config.pkg.version);

    var build = require('./build');
    var Bump = require('./utils/bump');
    var newVersion;
    return new Bump(['./package.json','./README.md', config.paths.source + '/**/version.js'], {type: type }).run()
        .then(function(version){
            log.info(" * Now on " + version);
            newVersion = version;
            return build.html({version:version});
        }).then(function(){
            return newVersion;
        }).catch(log.onError);
};

function exec(task, options){
    config = helper.getConfig();
    log.info('Bumping :');
    if (bump[task]) return bump[task](options);
    //if (!bump[task]) help[task]()
}

module.exports = {
    all:  function(options){ return exec('all', options); }
};