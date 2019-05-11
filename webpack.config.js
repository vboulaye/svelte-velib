const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		extensions: ['.mjs', '.js', '.svelte'],
		alias:{
			//faye: 'faye/browser/faye-browser' , // alias needed because webpack use the node version
		}
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	plugins: [
		new CopyPlugin([
			{ from: 'public', to: '.' },
		]),
	],
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
	devtool: prod ? false: 'source-map'
};
