const webpackConfig = require('./webpack.config');

module.exports = Object.assign(webpackConfig, {

    devtool: 'source-maps',

    output: {
        pathinfo: true,
        publicPath: '/',
        filename: '[name].js'
    }

});
