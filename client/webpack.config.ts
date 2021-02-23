import path from 'path'
import webpack, { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'

const webpackConfig = (env: Record<string, string>): Configuration => ({
  entry: './src/index.tsx',
  ...(env.production || !env.development ? {} : { devtool: 'eval-source-map' }),
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    //https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/61
    //@ts-ignore
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'build.js'
  },
  devServer: {
    proxy: {
      '/user/login': {
        target: 'http://127.0.0.1:8080/',
        pathRewrite: { '^/api': '' }
      },
      'user/validate': {
        target: 'http://127.0.0.1:8080/',
        pathRewrite: { '^/api': '' }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        },
        exclude: /dist/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.PRODUCTION': env.production || !env.development,
      'process.env.API_SERVER': JSON.stringify(env.API_SERVER)
    }),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}'
      }
    })
  ]
})

export default webpackConfig
