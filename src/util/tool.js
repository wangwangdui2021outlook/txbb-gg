// 非空判断
export function changeOV (data = {}) {
  let isExist = true
  for (let key in data) {
    if (data[key] === null || data[key] === '' || data[key] === undefined) {
      isExist = false
    }
  }
  return isExist
}
// URL转码
export function encodeSearchParams (obj) {
  const params = []

  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    // 如果值为undefined我们将其置空
    if (typeof value === 'undefined') {
      value = ''
    }
    // 对于需要编码的文本（比如说中文）我们要进行编码
    params.push([key, encodeURIComponent(value)].join('='))
  })

  return params.join('&')
}

// a标签下载
export function aDownloadHandle (url) {
  const a = document.createElement('a') // 创建a标签
  a.setAttribute('download', '') // download属性
  a.setAttribute('target', '_blank') // target
  a.setAttribute('href', url) // href链接
  a.click() // 自执行点击事件
}

export function getQrCodeSrc (data, id, width, height) {
  const QRCode = require('qrcodejs2')
  new QRCode(id, {
    width: width,
    height: height,
    text: data,
    colorDark: '#000',
    colorLight: '#fff'
  })
}
