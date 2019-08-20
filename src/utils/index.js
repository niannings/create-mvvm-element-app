/**
 * 解析Unix、BSD和GNU参数风格
 * @param {Array} argv 命令行参数数组
 * @returns
 */
function parseArgv (argv) {
  const max = argv.length
  const result = {
    _: []
  }
  for (let i = 0; i < max; i++) {
    const arg = argv[i]
    const next = argv[i + 1]
    if (/^--.+/.test(arg)) {
      // GNU风格
      const key = arg.match(/^--(.+)/)[1]
      if (next != null && !/^-.+/.test(next)) {
        result[key] = next
        i++
      } else {
        result[key] = true
      }
    } else if (/^-[^-]+/.test(arg)) {
      // Unix风格
      const items = arg.match(/^-([^-]+)/)[1].split('')
      for (let j = 0, max = items.length; j < max; j++) {
        const item = items[j]
        // 非字母不解析
        if (!/[a-zA-Z]/.test(item)) {
          continue
        }
        if (next != null && !/^-.+/.test(next) && j === max - 1) {
          result[item] = next
          i++
        } else {
          result[item] = true
        }
      }
    } else {
      // BSD风格
      result._.push(arg)
    }
  }
  return result
}

function promiseify(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, res) => {
      if (err) {
        reject(err)
      }
      
      resolve(res)
    })
  })
}


module.exports = { //在这里写上需要向外暴露的函数、变量
  parseArgv,
  promiseify
}
