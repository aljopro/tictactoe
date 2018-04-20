const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		'app': './src/app.ts'
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist'
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
      }
    ]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
    	new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		 new CopyWebpackPlugin([
			{
				from: 'src/*.css',
				to: path.resolve(__dirname, 'dist'),
				flatten: true
			}
		 ])
  	]
};
