var express = require('express'),
    exphbs = require('express-handlebars'),
    helpers = require('./lib/helpers'),
    http = require('http'),
    path = require('path'),
    logger = require('express-logger'),
    methodOverride = require('express-method-override'),
    favicon = require('express-favicon'),


    port = process.env.PORT || 8070,

    app = express(),
    appTitle = 'Realtime Markdown Viewer',

    hbs = exphbs.create({
        defaultLayout: 'application',
        helpers: helpers,
        extname: '.hbs',

        // Uses multiple partials dirs, templates in "shared/templates/" are shared
        // with the client-side of the app (see below).
        partialsDir: [
            'shared/templates',
            'views/partials'
        ]
    });


app.set('port', process.env.PORT || port);
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');


// Middleware to expose the app's shared templates to the client-side of the app
// for pages which need them.
function exposeTemplate(req, res, next) {
    // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
    // templates which will be shared with the client-side of the app.
    hbs.getTemplates('shared/templates', {
        cache: app.enabled('view cache'),
        precompiled: true
    }).then(function (templates) {
        // RegExp to remove the ".handlebars" extension from the template names.
        var extRegExp = new RegExp(hbs.extname + '$');


        // Creates an array of templates which are exposed via
        // `res.locals.templates`.
        templates = Object.keys(templates).map(function (name) {
            return {
                name: name.replace(extRegExp, ''),
                template: templates[name]
            };
        });

        // Exposes the templates during view rendering.
        if (templates.length) {
            res.locals.templates = templates;
        }
        setImmediate(next);
    })
        .catch(next);
}

////////////////////// Config Middleware  ////////////////////

app.use(logger({ path: 'logs/log.txt' }));      // log every request to the console
app.use(methodOverride());              // simulate DELETE and PUT
app.use(favicon(__dirname + '/public/img/favicon.ico'));


//app.use(express.static(__dirname + '/public'));
app.use('/public', express.static('public/'));   // serve static files from the public directory

// Routes!
app.get('/', function (req, res) {
    res.render('pad', {appTitle: appTitle});
});

app.get('/(:id)', function (req, res) {
    res.render('pad', {appTitle: appTitle});
});


/**
 * Create a Redis db instance that is appropriate for the current environment
 * By extracting the port, hostname, and authentication string from REDISTOGO_URL
 */
function createRedisInstance () {

    var redisClient;

    // setup redis for the appropriate environment
    if (process.env.REDISTOGO_URL) {
        // create a redistogo connection for production
        var redisToGo = require('url').parse(process.env.REDISTOGO_URL);
        redisClient = require('redis').createClient(redisToGo.port, redisToGo.hostname);
        redisClient.auth(redisToGo.auth.split(':')[1]);  // split up the username and password... and then use the password
    } else {
        redisClient = require('redis').createClient();
    }
    return redisClient;
}



/**
 * Attach our backend server impelmentation to
 * a shareJS shareJS instance
 * @param serverImpl -- our backend server implementation
 */
function createShareInstance(serverImpl) {

    var
        redisClient = createRedisInstance(),
        shareJS = require('share'),
        shareJSOpts = { db: { type: 'redis', client: redisClient} };

    shareJS.server.attach(serverImpl, shareJSOpts);
}



////////// Setup server boot functionality ///////////////
//var server = http.createServer(app),

    var boot = function boot() {

        // Attach the express server to sharejs
        // NOTE: When running from the command-line. Make sure to also execute "redis-server" in a separate console tab
        createShareInstance(app);

        app.listen(port, function () {
            console.log('Express server listening on port ' + app.get('port'));
        });
    },

    shutdown = function shutdown () {
        app.close();
    };

if (require.main === module) {
    boot();
} else {
    console.info('Running init.js as a module');
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = port;
}




