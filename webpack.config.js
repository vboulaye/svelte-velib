const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'

const plugins = []
plugins.push(
    new CopyPlugin({
        patterns: [
            {from: "public", to: "."},
        ],
    }))

// plugins.push(
//     new MiniCssExtractPlugin({
//         filename: '[name].css',
//         chunkFilename: '[name].[id].css'
//     })
// )
if (!fs.existsSync('src/webcom/webcom-secret.js')) {
    console.error('using default webcom secret')
    plugins.push(
        new webpack.NormalModuleReplacementPlugin(/(.*)webcom-secret\.js/, function (resource) {
            resource.request = resource.request.replace(/webcom-secret\.js/, `webcom-secret.example.js`)
        })
    );
}
module.exports = {
    entry: {
        bundle: ['./src/main.js']
    },
    resolve: {
        extensions: ['.mjs', '.js', '.svelte'],
        alias: {
            //faye: 'faye/browser/faye-browser' , // alias needed because webpack use the node version
            svelte: path.resolve('node_modules', 'svelte'),
        },
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        chunkFilename: '[name].[id].js'
    },
    plugins: plugins,
    module: {
        rules: [
            {
                test: /\.svelte$/,
                exclude: /node_modules/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: true,
                        hotReload: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    /**
                     * MiniCssExtractPlugin doesn't support HMR.
                     * For developing, use 'style-loader' instead.
                     * */
                    //prod ? MiniCssExtractPlugin.loader : 'style-loader',
                    'style-loader',
                    // {
                    //     loader: MiniCssExtractPlugin.loader,
                    //     options: { hmr: !prod }
                    // },
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                },
            },
        ]
    },
    mode,
    // plugins: [
    // 	new MiniCssExtractPlugin({
    // 		filename: '[name].css'
    // 	})
    // ],
    devtool: prod ? false : 'source-map'
}
