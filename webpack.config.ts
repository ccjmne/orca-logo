import { resolve } from 'path';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin, { MinifyOptions } from 'html-webpack-plugin';
import { Configuration, EntryObject, WebpackPluginInstance } from 'webpack';

import { author, description, keywords, name } from './package.json';

const HTML_MINIFY_OPTS: MinifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeAttributeQuotes: true,
  useShortDoctype: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  removeScriptTypeAttributes: true,
};

const src = resolve(__dirname, 'src');
const demo = resolve(__dirname, '.');
const dist = resolve(__dirname, 'dist');
export default (
  _env: string,
  { mode }: { mode?: 'production' | 'development' } = { mode: 'production' },
): Configuration => ({
  entry: {
    main: {
      import: resolve(src, 'orca-logo/orca-logo.ts'),
    },
  },
  output: {
    path: dist,
    filename: 'orca-logo.min.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: 'css-loader', options: { exportType: 'css-style-sheet' } },
          'sass-loader',
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              esModule: false,
              sources: {
                list: [
                  { tag: 'img', attribute: 'src', type: 'src' },
                  { tag: 'img', attribute: 'data-src', type: 'src' },
                  { tag: 'video', attribute: 'src', type: 'src' },
                  { tag: 'video', attribute: 'data-src', type: 'src' },
                ],
              },
              minimize: mode === 'production' && HTML_MINIFY_OPTS,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'vert', 'frag', '...'],
    // IMPORTANT: prioritise 'global' node modules, for extending modules (e.g.: d3-selection-multi enhances d3-selection)
    modules: [src, resolve(__dirname, 'node_modules'), 'node_modules'],
    mainFields: [
      'webpack',
      'module',
      'browser',
      'web',
      'browserify',
      ['jam', 'main'],
      'main',
    ],
  },
  plugins: ([] as WebpackPluginInstance[]).concat(
    mode === 'production' ? new CleanWebpackPlugin() : [],
    new HtmlWebpackPlugin({
      title: name,
      meta: {
        author,
        description,
        keywords: keywords.join(', '),
        charset: 'UTF-8',
      },
      template: resolve(demo, 'index.html'),
      filename: resolve(dist, 'index.html'),
      minify: HTML_MINIFY_OPTS,
    }),
  ),
  devtool: mode === 'development' ? 'source-map' : false,
  devServer: {
    hot: true,
  },
  optimization: {
    runtimeChunk: mode === 'development' && {
      name: (entrypoint: EntryObject) => `runtime~${entrypoint.name}`,
    },
  },
});
