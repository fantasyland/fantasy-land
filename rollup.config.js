import typescript from 'rollup-plugin-typescript'

export default {
  banner: '/** This file is generated - do not modify it by hand. */',
  entry: './index.ts',
  format: 'umd',
  moduleName: 'FantasyLand',
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
}
