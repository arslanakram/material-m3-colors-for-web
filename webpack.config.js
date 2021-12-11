const Dotenv = require('dotenv-webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = (env, options) => {
    const devMode = options.mode !== 'production';

    return {
        // Define the entry points of our application (can be multiple for different sections of a website)
        entry: {
            script: './src/js/script.js',
        },

        // Set Web Target
        target: 'web',

        // Define development options
        devtool: devMode ? 'source-map' : undefined,

        // Run Dev Server
        devServer: {
            static: {
                directory: path.join(__dirname),
            },
            liveReload: true,
            port: 9000,
        },

        // Define the destination directory and filenames of compiled resources
        output: {
            publicPath: '/',
            filename: 'js/[name].js',
            path: path.resolve(__dirname),
        },

        // Optimization Rules
        optimization: {
            minimizer: [
                new ESBuildMinifyPlugin({
                    target: 'es2015', // Syntax to compile to (see options below for possible values)
                    css: true,
                }),
            ],
        },

        // Define loaders
        module: {
            rules: [
                // Use babel for JS files
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    loader: 'esbuild-loader',
                    options: {
                        target: 'es2015', // Syntax to compile to (see options below for possible values)
                    },
                },

                // Styles Loader
                {
                    test: /\.[s]?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            // translates CSS into CommonJS modules
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2,
                                sourceMap: true,
                                url: false,
                            },
                        },
                        {
                            // Run postcss actions
                            loader: 'postcss-loader',
                            options: {
                                // `postcssOptions` is needed for postcss 8.x;
                                // if you use postcss 7.x skip the key
                                postcssOptions: {
                                    // postcss plugins, can be exported to postcss.config.js
                                    plugins: function () {
                                        return [require('autoprefixer')];
                                    },
                                },
                            },
                        },
                        {
                            // compiles Sass to CSS
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
            ],
        },

        // Define used plugins
        plugins: [
            // Load .env file for environment variables in JS
            new Dotenv({
                path: './.env',
            }),

            // Extracts CSS into separate files
            new MiniCssExtractPlugin({
                filename: 'css/style.css',
            }),
        ],
    };
};
