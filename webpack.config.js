require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const { version } = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';

const cssLoaderOptions = { importLoaders: 1 };
const cssModulesLoaderOptions = { modules: { localIdentName: '[path]-[name]__[local]' }, importLoaders: 1 };

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    app: isProduction ? './frontend/index.js' : ['./frontend/index.js', 'webpack-hot-middleware/client'],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      components: path.resolve(__dirname, 'frontend/components/'),
      utils: path.resolve(__dirname, 'frontend/utils/'),
      api: path.resolve(__dirname, 'frontend/api/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: cssRegex,
        exclude: [cssModuleRegex, /node_modules/],
        use: isProduction
          ? [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: cssLoaderOptions }]
          : ['style-loader', { loader: 'css-loader', options: cssLoaderOptions }],
      },
      {
        test: cssModuleRegex,
        exclude: [/node_modules/],
        use: isProduction
          ? [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: cssModulesLoaderOptions }, 'postcss-loader']
          : ['style-loader', { loader: 'css-loader', options: cssModulesLoaderOptions }, 'postcss-loader'],
      },
      {
        test: /\.css$/,
        use: isProduction ? [MiniCssExtractPlugin.loader, 'css-loader'] : ['style-loader', 'raw-loader'],
        include: [/node_modules/],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              limit: 1024 * 15,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  },
  devtool: isProduction ? false/*'source-map'*/ : 'eval-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
  },
  plugins: isProduction ? [
    new webpack.DefinePlugin({ "process.env.RELEASE": JSON.stringify(version) }),
    new MiniCssExtractPlugin({ filename: 'styles.[contenthash].css' }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: "./frontend/index.html",
      filename: "./index.html"
    }),
    // new BundleAnalyzerPlugin(),
  ] : [
    new webpack.DefinePlugin({ "process.env.RELEASE": JSON.stringify(version) }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: "./frontend/index.html",
      filename: "./index.html"
    }),
  ],
  output: {
    filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
};