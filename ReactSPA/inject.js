const path = require('path')
const fs = require('fs-extra')

const getChunkmap = require('../utils/get-chunkmap')
const readClientFile = require('../utils/read-client-file')

module.exports = (settings = {}) => {
    const {
        WEBPACK_BUILD_ENV: ENV,
    } = process.env
    const {
        localeId,
        chunkmap = getChunkmap(localeId) || {},
        compilation,
    } = settings

    const {
        '.entrypoints': entrypoints = {},
        '.files': filemap = {},
    } = chunkmap

    return {

        styles: (() => {
            let r = ''
            if (typeof filemap['critical.css'] === 'string') {
                if (ENV === 'prod')
                    r += `<style type="text/css">${readClientFile('critical.css', localeId, compilation)}</style>`
                if (ENV === 'dev')
                    r += `<link media="all" rel="stylesheet" href="/${filemap['critical.css']}" />`
            }
        })(),

        scripts: (() => {
            let r = `<script type="text/javascript">var __REDUX_STATE__ = {};</script>`

            if (typeof entrypoints === 'object') {
                // 优先引入 critical
                if (Array.isArray(entrypoints.critical)) {
                    entrypoints.critical
                        .filter(filename => path.extname(filename) === '.js')
                        .forEach(filename => {
                            r += ENV === 'prod'
                                ? `<script type="text/javascript">${fs.readFileSync(
                                    path.resolve(
                                        process.env.SUPER_DIST_DIR,
                                        filename.replace(/^\//, '')
                                    ),
                                    'utf-8'
                                )}</script>`
                                : `<script type="text/javascript" src="/${filename}"></script>`
                        })
                }

                // 引入其他入口
                if (typeof entrypoints === 'object') {
                    Object.keys(entrypoints).filter(key => (
                        key !== 'critical' && key !== 'polyfill'
                    )).forEach(key => {
                        if (Array.isArray(entrypoints[key])) {
                            entrypoints[key].forEach(file => {
                                r += ENV === 'prod'
                                    ? `<script type="text/javascript" src="${file.replace(/(^\.\/|^)public\//, '')}" defer></script>`
                                    : `<script type="text/javascript" src="/${file}" defer></script>`
                            })
                        }
                    })
                }
            }

            return r
        })()
    }
}
