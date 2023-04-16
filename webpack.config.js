const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './index.ts',
    devtool: 'source-map',
    mode: 'development',
    devServer: {
        port: 5000,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.build.json',
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.posix.join(
                        path.resolve(__dirname, 'assets').replace(/\\/g, '/'),
                        '*'
                    ),
                    to: path.resolve(__dirname, 'dist'),
                },
            ],
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
