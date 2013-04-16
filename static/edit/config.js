seajs.config({
    // Enable plugins
    plugins: ['shim'],

    // Configure alias
    alias: {
        'jquery': {
            src: 'lib/jquery.js',
            exports: 'jQuery'
        },
        'jquery.ui': {
            src: 'lib/jquery-ui-1.8.23.custom.min.js',
            exports: 'jQuery',
            deps: ['jquery']
        }
    }
});

