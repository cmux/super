/**
 * 配置转换 - 兼容性处理 - 客户端相关选项
 * - before
 * - after
 * - onRouterUpdate
 * - onHistoryUpdate
 * @async
 * @param {Object} config
 * @void
 */
module.exports = async (config) => {

    const transform = key => {
        if (typeof config[key] !== 'undefined' && typeof config.client === 'object') {
            delete config.client[key]
        } else if (typeof config.client === 'object') {
            config[key] = config.client[key]
            delete config.client[key]
        }
    }

    const keys = [
        'before',
        'after',
        'onRouterUpdate',
        'onHistoryUpdate'
    ]

    keys.forEach(key => transform(key))

}
