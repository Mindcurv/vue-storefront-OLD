const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs')

let baseClientConfig = require('./webpack.client.config').default
let baseServerConfig = require('./webpack.server.config').default

const themeRoot = require('./theme-path')
const extendedConfig = require(path.join(themeRoot, '/webpack.config.js'))

let clientConfig = extendedConfig(baseClientConfig, { isClient: true, isDev: true })
let serverConfig = extendedConfig(baseServerConfig, { isClient: false, isDev: true })

module.exports = function setupDevServer (app, cb) {
  let bundle
  let template

  // Modify client config to work with hot middleware
  clientConfig.entry.app = ['webpack-hot-middleware/client', ...clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  // Dev middleware
  const clientCompiler = webpack(clientConfig)
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })
  app.use(devMiddleware)
  clientCompiler.plugin('done', () => {
    const fs = devMiddleware.fileSystem
    const filePath = path.join(clientConfig.output.path, 'index.html')
    if (fs.existsSync(filePath)) {
      template = fs.readFileSync(filePath, 'utf-8')
      if (bundle) {
        cb(bundle, template)
      }
    }
  })

  // Hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler))

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))

    // Read bundle generated by vue-ssr-webpack-plugin
    const bundlePath = path.join(serverConfig.output.path, 'vue-ssr-bundle.json')
    bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
    if (template) {
      cb(bundle, template)
    }
  })
}
