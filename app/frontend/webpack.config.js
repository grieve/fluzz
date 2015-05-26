var webpack = require('webpack');

module.exports = {
    module: {
        loaders: [
            {test: /jquery\.js$/, loader: 'expose?$'},
            {test: /jquery\.js$/, loader: 'expose?jQuery'},
            {test: /\.scss$/, loader: 'style!css!sass'},
            {test: /\.hbs$/, loader: 'handlebars'}
        ]
    },
    entry: {
        app: './src/js/client/main',
        admin: './src/js/admin/main',
        present: './src/js/presenter/main',
        vendor: ['jquery', 'underscore', 'backbone']
    },
    output: {
        path: '../server/static/js',
        filename: '[name].bundle.js'
    },
    resolve: {
        alias: {
            backbone: 'exoskeleton',
            underscore: 'lodash'
        }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
    ]
};
