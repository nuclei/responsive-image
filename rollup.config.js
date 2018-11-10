// rollup.config.js
import typescript from 'rollup-plugin-typescript'
import nodeResolve from 'rollup-plugin-node-resolve'

const pkg = require('./package')

export default {
  input: pkg.config.src,
  output: {
    file: pkg.main,
    name: pkg.moduleName,
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
      outDir: 'dist',
      rootDir: './',
      module: 'es6',
      target: 'es6',
      declaration: false,
      removeComments: true,
      lib: [
        'dom',
        'es6'
      ] // use local version
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      browser: true,
      extensions: [ '.js', '.json' ],
      preferBuiltins: false
    })
  ]
}
