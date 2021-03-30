
let DAMAINCONFIG = require('./../../config/domainConfig/config')
const APIURL = `http://${window.location.host}`
const apiURL = DAMAINCONFIG.APIURL
const taskDownloadUrl = DAMAINCONFIG.DOWNLOADURL
// const mmURL = DAMAINCONFIG.APIURL + '/mm'
const mmURL = APIURL + '/mm'
const PAGE_SIZE = 20
const CDNURL = DAMAINCONFIG.CDNURL
const { thisIp } = require('./ip')
export default {
  api: process.env.NODE_ENV === 'development' ? '/api' : APIURL + '/Manager',
  PLAT_NAME: DAMAINCONFIG.PLAT_NAME,
  CODE_SUCCESS: 0,
  CODE_RESULT: 1012,
  CODE_FAILED: 1000,
  PAGE_SIZE: PAGE_SIZE,
  TOTAL: 100,
  sizeArr: [PAGE_SIZE, 50, 100, 200],
  taskDownloadUrl: taskDownloadUrl,
  TIMEOUT: 5000, // 请求接口超时时间
  OVERTIME: 5,  // 最多重复请求次数
  THUMBNAIL_URL: '/thumb',  // 显示缩略图添加的文件目录
  // cdn 路径
  CDN_UP_URL: process.env.NODE_ENV == 'development' ? 'http://cdn.txbbcrm.com' : CDNURL,
  UPLOAD_IMAGE_SIZE: 300,
  UPLOAD_IMAGE_QUALITY: 0.3,
  upload: process.env.NODE_ENV === 'development' ? '/upload' : CDNURL,
  excelDownUrl: CDNURL + '/gg/task_template.xlsx',
  register: (process.env.NODE_ENV === 'development' ? (thisIp + ':8089') : mmURL) + '/register?',
  login: (process.env.NODE_ENV === 'development' ? (thisIp + ':8089') : mmURL) + '/login?',
  operation: (process.env.NODE_ENV === 'development' ? (thisIp + ':8089') : mmURL) + '/operation?',
  // form表单长度
  formLabelWidth: '110px',
  // 缓存时间
  taskOverdueTime: 60 * 60 * 2,
  // Token 过期时间
  TOKEN_OVER_TIME: 60 * 60 * 8,
  // 接口延迟时间
  DELAY_TIME: 1500,  // 毫秒
  CONFIG: {
    // form表单条件不需要循环
    NO_FOR: 1200,
    CODE_SUCCESS: 0,    //成功返回状态码
    CODE_BAD_PASSWORD: 1001, //密码错误
    CODE_BANED: 1002, //禁止登录
    CODE_BAD_PARAMETER: 1003, //参数异常
    CODE_DB_ERROR: 1004, //DB操作异常
    CODE_BAD_REQUEST: 1005, //非法请求
    CODE_UNKNOWN_ERROR: 1006, //未知错误
    CODE_PERMISSION_DENIED: 1007,//权限不够
    CODE_BAD_PROVCODE: 1008, //验证码不正确
    CODE_USER_EXIT: 1009, //用户已经存在
    CODE_PAGE_END: 1010,//分页结束/数据为空
    CODE_USER_NOT_EXIT: 1011, //用户不存在
    CODE_TOKEN_INVALID: 1012, //token已失效
    CODE_USER_INVALID: 2001, //无效用户
    CODE_TASK_INSERT_BAD: 3001, //任务插入失败
    CODE_TASK_CHECK_BAD: 3002, //任务数据验证失败

    //################  一般状态  ##################
    STATUS_ABLE: 1, //正常/导出中，
    STATUS_ING: 2, //审核中/留空/导出成功 ， 解除异地登陆
    STATUS_DISABLE: 3, //拒绝/留空/拉黑/停用/导出失败
    STATUS_DEL: 4, //删除/导出内容为空
    STATUS_TASK_DISABLE: 5,  //禁止接单
    STATUS_HARD_DISABLE: 99,//彻底不可用状态
    STATUS_FALSE: 0,//否 , 等待导出， 关闭异地登陆
    STATUS_TRUE: 1,//是，  开启异地登陆

    //################  订单状态  ##################
    ORDER_STATUS_NOT_ALLOT: 5,//未分配
    ORDER_STATUS_ALLOTED: 10,//已分配，待生成二维码
    ORDER_STATUS_WAIT_ACCEPT: 15, //已生成二维码，待接单
    ORDER_STATUS_WAIT_DOING: 20,//已接单，待完成
    ORDER_STATUS_ADD_SHOPPING_CARD_WAIT: 21, // 提交购物车截图待审核
    ORDER_STATUS_ADD_SHOPPING_CARD_DONE: 23, // 购物车截图审核通过
    ORDER_STATUS_WAIT_ADD: 24, // 任务待提交
    ORDER_STATUS_WAITING_AUDIT: 25,//已完成，待审核
    ORDER_STATUS_DONE: 30,//已完成
    ORDER_STATUS_TIME_OUT: 50,  //已超时
    ORDER_STATUS_FAIL: 90, //审核失败
    ORDER_STATUS_CANCEL: 99,//已撤销
    // 普通单任务状态
    ORDER_STATUS: function (val) {
      let arr = {}
      arr[this.ORDER_STATUS_NOT_ALLOT] = '未分配'
      arr[this.ORDER_STATUS_ALLOTED] = '已分配'
      arr[this.ORDER_STATUS_WAIT_ACCEPT] = '待接单'
      arr[this.ORDER_STATUS_WAIT_DOING] = '待操作'
      arr[this.ORDER_STATUS_TIME_OUT] = '已超时'
      arr[this.ORDER_STATUS_WAITING_AUDIT] = '待审核'
      arr[this.ORDER_STATUS_DONE] = '已完成'
      arr[this.ORDER_STATUS_FAIL] = '审核失败'
      arr[this.ORDER_STATUS_CANCEL] = '已失效'
      if (val && arr[val]) return arr[val]
      return arr
    },
    // 隔日单任务状态
    ORDER_STATUS_TOMMORRO: function (val) {
      let arr = {}
      arr[this.ORDER_STATUS_NOT_ALLOT] = '未分配'
      arr[this.ORDER_STATUS_ALLOTED] = '已分配'
      arr[this.ORDER_STATUS_WAIT_ACCEPT] = '待接单'
      arr[this.ORDER_STATUS_WAIT_DOING] = '待操作'
      arr[this.ORDER_STATUS_ADD_SHOPPING_CARD_DONE] = '截图审核通过'
      arr[this.ORDER_STATUS_WAIT_ADD] = '待提交'
      arr[this.ORDER_STATUS_TIME_OUT] = '已超时'
      arr[this.ORDER_STATUS_WAITING_AUDIT] = '待审核'
      arr[this.ORDER_STATUS_DONE] = '已完成'
      arr[this.ORDER_STATUS_FAIL] = '审核失败'
      arr[this.ORDER_STATUS_CANCEL] = '已失效'
      if (val && arr[val]) return arr[val]
      return arr
    },
    //################## 导出数据方式 ##################
    EXPORT_TYPE_ALL: 1,//全部
    EXPORT_TYPE_CUSTOM: 2,//自定义
    //################## 二维码类型 ##################
    QR_TYPE_COUNT: 1,//次数类型
    QR_TYPE_TIME: 2,//时间类型

    //################## 短信发生类型 ##################
    SMS_REGISTER: 'register',//注册
    SMS_RESET_PWD: 'forget_pwd',//忘记密码

    //################### 性别 ####################
    SEX_MAN: 1, // 男
    SEX_WOMAN: 2, //女
    SEX_STATUS: function (val) {
      let arr = {}
      arr[this.SEX_MAN] = '男'
      arr[this.SEX_WOMAN] = '女'
      if (val && arr[val]) return arr[val]
      return arr
    },
    // ################## 是否需要身份证验证 ##############################
   SET_REFUND_TYPE_NOT:1,
   SET_REFUND_TYPE_OPEN:2,
    // ################## 分销机构状态 ##############################
    INDUSTRY_STATUS_OPEN: 1,
    INDUSTRY_STATUS_NOT: 2,
    INDUSTRY_STATUS_CLOSE: 3,
    INDUSTRY_STATUS: function (val) {
      let arr = {}
      arr[this.INDUSTRY_STATUS_OPEN] = '开通'
      arr[this.INDUSTRY_STATUS_CLOSE] = '关闭'
      arr[this.INDUSTRY_STATUS_NOT] = '禁止发单'
      if(val && arr[val]) return arr[val]
      return arr
    },
    //################### 任务状态，是否加购单 ####################
    TASK_TYPE_NOT: 1,
    TASK_TYPE_IS: 2,
    TASK_TYPE: function (val) {
      let arr = {}
      arr[this.TASK_TYPE_NOT] = '普通单'
      arr[this.TASK_TYPE_IS] = '隔日单'
      if(val && arr[val]) return arr[val]
      return arr
    },
    //################### 任务处理方法类型 ####################
    TASK_FANKUAN: 1,
    TASK_FENPEI: 2,
    TASK_CHEHUI: 3,
    TASK_SHENGCHENG: 4,
    TASK_SHANCHU: 5,
    TASK_RENEW: 6,  // 恢复任务
    TASK_FAILURE: 7,   // 失效任务

    //################### 数据统计类型 ####################
    DATA_SEVEN: 7,
    DATA_MONTH: 30,

    //################### 员工角色类型 ####################
    ROLE_ADMIN: 1, // 超级管理员
    ROLE_ALLOT: 2,  // 分配员
    ROLE_SEND: 3,  // 派单员
    ROLE_CODE: 41002,  // 分配权限的code码
    ROLE_HISTORY_TASK_CODE: 44003,  // 查看所有历史任务权限码


    EVERY_TIME_TASK_NUM: 300,

    // ################### 导出类型 ####################
    TASK_EXPORT_HISTORY: 'HISTORY_TASK',
    TASK_HISTORY_EXPORT_LIMIT: 15,

    // ################### 返款方式 ####################
    USER_REFUND_TYPE_WEIXIN: 1,
    USER_REFUND_TYPE_BANK: 2
  },
  // 加密/解密ID
  encodeId: (id) => {
    if (!id) return ''
    let sid = (id & 0xff000000)
    sid += (id & 0x0000ff00) << 8
    sid += (id & 0x00ff0000) >> 8
    sid += (id & 0x0000000f) << 4
    sid += (id & 0x000000f0) >> 4
    // sid ^= 11184810
    sid ^= 2147483648
    return sid
  },

  // 封装localStorage 带过期时间，单位为秒
  zyLocalStorage: {
    set: function (key, value, ttl_ms) {
      var data = {
        value: value,
        expirse: new Date(new Date().getTime() + ttl_ms * 1000).getTime(),
        reload: true
      }
      localStorage.setItem(key, JSON.stringify(data))
    },
    get: function (key) {
      var data = JSON.parse(localStorage.getItem(key))
      if (data !== null) {
        if (data.expirse != null && data.expirse < new Date().getTime()) {
          localStorage.removeItem(key)
        }else if(data.reload != true){
          localStorage.removeItem(key)
        } else {
          return data.value
        }
      }
      return null
    }
  },
  // 数组对象根据name去重
  arrayUnique: (arr, name) => {
    var hash = {}
    return arr.reduce(function (prev, cur) {
      (hash[cur[name[0]]] && hash[cur[name[1]]]) ? '' : ((hash[cur[name[0]]] = true) && (hash[cur[name[1]]] = true)) && prev.push(cur)
      return prev
    }, [])
  },
  //格式化时间格式
  formatTime: (number, format) => {
    function formatNumber (n) {
      n = n.toString()
      return n[1] ? n : '0' + n;
    }
    let time = new Date(number)
    let newArr = []
    let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
    newArr.push(time.getFullYear())
    newArr.push(formatNumber(time.getMonth() + 1))
    newArr.push(formatNumber(time.getDate()))

    newArr.push(formatNumber(time.getHours()))
    newArr.push(formatNumber(time.getMinutes()))
    newArr.push(formatNumber(time.getSeconds()))

    for (let i in newArr) {
      format = format.replace(formatArr[i], newArr[i])
    }
    return format
  },
  //格式化日期
  formatDate: (time, format) => {
    var t = new Date(time);
    var tf = function (i) {
      return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear());
        case 'MM':
          return tf(t.getMonth() + 1);
        case 'mm':
          return tf(t.getMinutes());
        case 'dd':
          return tf(t.getDate());
        case 'HH':
          return tf(t.getHours());
        case 'ss':
          return tf(t.getSeconds());
      }
    })
  },
  // 判断是否为数字
  isRealNum: (val) => {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
    if (val === "" || val == null) return false

    if (!isNaN(val)) {
      //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
      //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
      return true
    } else {
      return false
    }
  },
  // 时间换行显示
  trimText: (str) => {
    if (!str) return ''
    const text = str.replace(/ /g, "</br>");
    return text
  },
  // 判断是否为今天
  judgeTime: (str) => {
    if (new Date(str).toDateString() === new Date().toDateString()) {
      //今天
      return true
    } else if (new Date(str) < new Date()) {
      //之前
      return false
    }
  },
  // 检查唯一
  changeOV (data = {}) {
    let isExist = true
    for (let key in data) {
      if (data[key] === null || data[key] === '' || data[key] === undefined) {
        isExist = false
      }
    }
    return isExist
  },
  // 判断是否大于等于今日,返回 true
  judgeDate: (str) => {
    if (new Date(str).toDateString() === new Date().toDateString() || new Date(str) > new Date()) {
      return false
    } else {
      return true
    }
  },
  // 传入两个时间，判断时间间隔
  daysBetween: (sDate1, sDate2) => {
    if (!sDate1 || !sDate2) return 0
    //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
    var time1 = Date.parse(new Date(sDate1));
    var time2 = Date.parse(new Date(sDate2));
    var nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24));
    return nDays;
  },
  // 获取链接参数值
  getParam (key, strURL) {
    strURL = strURL || window.location.search;
    return new RegExp("(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i").test(strURL) ?
      decodeURIComponent(RegExp.$2.replace(/\+/g, " ")) : "";
  },
  // 获取当前时间
  getNowTime () {
    // 加0
    function add_10 (num) {
      if (num < 10) {
        num = '0' + num
      }
      return num
    }
    var myDate = new Date()
    myDate.getYear() //获取当前年份(2位)
    myDate.getFullYear() //获取完整的年份(4位,1970-????)
    myDate.getMonth() //获取当前月份(0-11,0代表1月)
    myDate.getDate() //获取当前日(1-31)
    myDate.getDay() //获取当前星期X(0-6,0代表星期天)
    myDate.getTime() //获取当前时间(从1970.1.1开始的毫秒数)
    myDate.getHours() //获取当前小时数(0-23)
    myDate.getMinutes() //获取当前分钟数(0-59)
    myDate.getSeconds() //获取当前秒数(0-59)
    myDate.getMilliseconds() //获取当前毫秒数(0-999)
    myDate.toLocaleDateString() //获取当前日期
    var nowTime = myDate.getFullYear() + '-' + add_10(myDate.getMonth()) + '-' + myDate.getDate() + ' ' + add_10(myDate.getHours()) + ':' + add_10(myDate.getMinutes()) + ':' + add_10(myDate.getSeconds())
    return nowTime
  }
}
