const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test:/\.css$/,
            use:['style-loader','css-loader']
        },
        {
            test: /\.(png|jp(e*)g|svg)$/,  
            use: [{
                loader: 'url-loader',
                options: { 
                    limit: 8000, // Convert images < 8kb to base64 strings
                    name: 'images/[hash]-[name].[ext]'
                } 
            }]
        }
    ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: 'index.html', //relative to root of the application,
            template: path.resolve(__dirname, 'src/', 'index.html'),
        })
   ],
   output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
}
};