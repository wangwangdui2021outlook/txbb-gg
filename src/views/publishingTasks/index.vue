<template>
  <div class="app-container">
    <div class="taskPublic-container" v-if="!isCloseTask">
      <el-steps direction="vertical">
        <el-step style="min-height:150px;" title="下载发单模版">
          <template slot="description">
            <div class="tips-template">
              为了保证数据成功导入，请严格按照发单模板的内容填写。如果你还没有发单模板，请<a
                :href="excelDownUrl"
                download
                >点击这里下载发单模板</a
              >
            </div>
          </template>
        </el-step>
        <el-step title="上传任务模版" style="min-height:200px;">
          <template slot="description">
            <upload-excel-component
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
            />
          </template>
        </el-step>
        <el-step title="预览任务信息" class="task-info" v-if="tableData.length">
          <template slot="description">
            <div class="task-table">
              <el-table
                stripe
                :data="tableData"
                highlight-current-row
                style="width: 100%;"
                min-height="200px;"
                ref="tableData"
              >
                <el-table-column
                  fixed="left"
                  type="index"
                  width="50"
                  label="行号"
                >
                </el-table-column>
                <el-table-column prop="0" width="100px" label="店铺名">
                </el-table-column>
                <el-table-column prop="1" width="120px" label="宝贝标题">
                </el-table-column>
                <el-table-column prop="2" width="200px" label="宝贝链接">
                </el-table-column>
                <el-table-column prop="3" width="200px" label="主图链接">
                  <template slot-scope="scope">
                    <el-image
                      :src="scope.row[3]"
                      style="width: 100px; height: 100px"
                      :preview-src-list="[scope.row[3]]"
                      :scroll-container="$refs.tableData"
                    ></el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="4" label="价格"> </el-table-column>
                <el-table-column prop="5" label="关键词"> </el-table-column>
                <el-table-column prop="6" label="收货人数"> </el-table-column>
                <el-table-column prop="7" width="250px" label="额外要求">
                </el-table-column>
                <el-table-column prop="8" label="日期"> </el-table-column>
                <el-table-column label="任务数量">
                  <el-table-column prop="9" label="00:00"> </el-table-column>
                  <el-table-column prop="10" label="01:00"> </el-table-column>
                  <el-table-column prop="11" label="02:00"> </el-table-column>
                  <el-table-column prop="12" label="03:00"> </el-table-column>
                  <el-table-column prop="13" label="04:00"> </el-table-column>
                  <el-table-column prop="14" label="05:00"> </el-table-column>
                  <el-table-column prop="15" label="06:00"> </el-table-column>
                  <el-table-column prop="16" label="07:00"> </el-table-column>
                  <el-table-column prop="17" label="08:00"> </el-table-column>
                  <el-table-column prop="18" label="09:00"> </el-table-column>
                  <el-table-column prop="19" label="10:00"> </el-table-column>
                  <el-table-column prop="20" label="11:00"> </el-table-column>
                  <el-table-column prop="21" label="12:00"> </el-table-column>
                  <el-table-column prop="22" label="13:00"> </el-table-column>
                  <el-table-column prop="23" label="14:00"> </el-table-column>
                  <el-table-column prop="24" label="15:00"> </el-table-column>
                  <el-table-column prop="25" label="16:00"> </el-table-column>
                  <el-table-column prop="26" label="17:00"> </el-table-column>
                  <el-table-column prop="27" label="18:00"> </el-table-column>
                  <el-table-column prop="28" label="19:00"> </el-table-column>
                  <el-table-column prop="29" label="20:00"> </el-table-column>
                  <el-table-column prop="30" label="21:00"> </el-table-column>
                  <el-table-column prop="31" label="22:00"> </el-table-column>
                  <el-table-column prop="32" label="23:00"> </el-table-column>
                </el-table-column>
                <el-table-column fixed="right" prop="33" label="汇总">
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-step>
        <el-step title="提交任务" style="height:80px;" v-if="tableData.length">
          <template slot="description">
            <div class="task-btn" v-if="industry_status != CONFIG.INDUSTRY_STATUS_CLOSE">
               <el-button
                v-if="isNewTemplate"
                type="primary"
                @click="goCreateExcelTask(false)"
                >生成任务普通任务</el-button
              >
               <el-button
                v-if="isNewTemplate"
                type="primary"
                @click="goCreateExcelTask(true)"
                >生成隔日单任务</el-button
              >
            </div>
            <div class="task-btn" v-else>
              <el-button
                v-if="isNewTemplate"
                type="primary"
                @click="goCreateExcelTask(false)"
                >生成任务</el-button
              >
            </div>
          </template>
        </el-step>
      </el-steps>
    </div>

    <div class="closeTime-task" v-else>
      <h2>
        每日04:30-05:00，系统例行维护，当前状态下不能发布任务，感谢您的配合。
      </h2>
    </div>

    <div>
      <el-dialog
        title="提示"
        :visible.sync="createTaskVisible"
        width="550px"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <div>
          <h3>任务正在生成中，请勿离开当前页面或进行其它操作！</h3>
          <br />
          <div>
            <el-progress
              :percentage="process"
              :color="customColors"
            ></el-progress>
          </div>
        </div>
        <span slot="footer" class="dialog-footer"> </span>
      </el-dialog>
    </div>

    <el-dialog
      :visible.sync="successDialog"
      width="350px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <p class="success-info">
        <i class="el-icon-success"></i>&nbsp;任务发布成功!
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="continueTask">继续发单</el-button>
        <el-button v-has="41000" type="primary" @click="taskDetails"
          >查看任务</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="newTemplateDialog"
      width="500px"
      center
      class="template-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="template-info">
        <i class="el-icon-warning"></i>
        <br />
        <p>请下载使用最新的发单模板用于发布任务</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="template-info__btn"
          type="primary"
          @click.native="newTemplateDialog = false"
        >
          <a :href="excelDownUrl" download>确 定</a>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNewTaskHandler } from '@/api/publishingTask'

export default {
  name: 'UploadExcel',
  components: {
    UploadExcelComponent: resolve => require(['@/components/UploadExcel/index.vue'], resolve)
  },
  data () {
    return {
      isCloseTask: false,
      industry_status: localStorage.getItem('gg_industry_status'),
      tableData: [],
      tableHeader: [],
      checkHeader: ['店铺名', '宝贝标题', '宝贝链接', '主图链接', '价格', '关键词', '收货人数', '额外要求', '日期', '任务数量', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '汇总'],
      tableDataObj: {},
      tableDataRelease: [],
      newArray: [],
      countNum: 0,
      isAxios: true,
      process: 0,
      createTaskVisible: false,
      successDialog: false,
      isNewTemplate: true,
      newTemplateDialog: false,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      dateType: ['****年**月**日', '****年**月*日', '****年*月**日', '****年*月*日', '****/**/**', '****/**/*', '****/*/**', '****/*/*', '****-**-**', '****-*-**', '****-**-*', '****-*-*']
    }
  },
  mounted () {
    this.getTimestamp()
  },
  methods: {
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 5
      if (isLt1M) return true
      return this.$message.warning('最大上传 5MB 大小的文件！')
    },
    handleSuccess ({ results, header }) {
      this.tableData = []
      this.newArray = results.slice(2, results.length)
      let res = []
      let resultArr = []
      for (let i in this.newArray) {
        if (this.newArray[i][0] !== '') {
          resultArr.push(this.newArray[i])
        }
      }
      for (let i = 0; i < resultArr.length; i++) {
        res[i] = {}
        for (let j in resultArr[i]) {
          res[i][j] = resultArr[i][j]
        }
        this.countNum += Number(resultArr[i][33])
      }
      if (resultArr[0].length != 34) {
        this.newTemplateDialog = true
        this.isNewTemplate = false
        return false
      }
      let isDateArray = res.map((item) => { return this.dateVaild(item[8]) })
      let isValidDate = isDateArray.find((item) => { return item == '1' })
      if (isValidDate) return this.$message.warning('请输入正确的日期格式，如：****/**/** ，****-**-** 或 ****年**月**日')

      res.map((item) => { item[8] = this.dateVaild(item[8]) })
      this.isNewTemplate = true
      let nowTime = new Date(((new Date()).toLocaleDateString()).replace(/-/g, "/")).getTime()
      for (let i = 0; i < res.length; i++) {
        // 判断宝贝链接是否正确
        let isBady = this.getParam('id', res[i][2])
        if (isBady) isBady = isBady * 1
        if (!isBady || typeof isBady != 'number') return this.$message.warning('第' + (i + 1) + '条任务信息的宝贝链接不正确，请核对')
        // 判断时间
        let startTime = (new Date(res[i][8].replace(/-/g, "/"))).getTime()
        if (nowTime > startTime) return this.$message.warning('第' + (i + 1) + '条任务信息的放单时间应该大于当前时间')
        if (nowTime == startTime) {
          let nowHour = (new Date()).getHours()
          for (let j = 9; j < (nowHour + 8); j++) {
            if (res[i][j] > 0) return this.$message.warning('第' + (i + 1) + '条任务信息的放单时间应该大于当前时间')
          }
        }
        // 判断基础数据是否为空
        for (let k = 0; k < 7; k++) {
          if (!res[i][k]) return this.$message.warning('第' + (i + 1) + '条数据不完整，请检查后再试！')
        }
      }
      if (res.length === 0) return this.$message.warning('任务数据为空，请重新上传！')
      this.tableData = [...this.tableData, ...res]
      for (let i = 10; i <= 32; i++) {
        header[i] = String(i)
      }
      this.tableHeader = header
    },
    // 得到任务数据
    getTaskData (pushArr) {
      // 得到任务数据
      let taskArr = []
      for (let i = 0; i < pushArr.length; i++) {
        let tObj = {
          buyer_cnt: pushArr[i].buyer_cnt,
          item_title: pushArr[i].item_title,
          item_pic: pushArr[i].item_pic,
          item_url: pushArr[i].item_url,
          keyword: pushArr[i].keyword,
          shop_name: pushArr[i].shop_name,
          summary: pushArr[i].summary,
          task_capital: pushArr[i].task_capital,
          task_note: pushArr[i].task_note,
        }
        for (let j = 0; j < 24; j++) {
          for (let k = 0; k < pushArr[i][j]; k++) {
            let newTask = { ...tObj }
            newTask.start_time = pushArr[i].start_time + ' ' + j + ':00:00'
            newTask.end_time = pushArr[i].start_time + ' ' + j + ':59:59'
            taskArr.push(newTask)
          }
        }
      }
      return taskArr
    },
    // 点击生成任务
    goCreateExcelTask (isJg) {
      let _this = this
      if (this.checkHeader.join('-') !== this.tableHeader.join('-')) {
        _this.newTemplateDialog = true
        _this.isNewTemplate = false
        this.tableData = []
        return false
      }
      // if (this.checkHeader.join('-') !== this.tableHeader.join('-')) return this.$message.warning('上传文件头部信息不符合要求！请重新上传')
      let keyMap = {
        '0': 'shop_name', // 店铺名
        '1': 'item_title', // 宝贝标题
        '2': 'item_url', // 宝贝链接
        '3': 'item_pic', // 主图链接
        '4': 'task_capital', // 价格
        '5': 'keyword', // 关键词
        '6': 'buyer_cnt', // 收货人数
        '7': 'task_note', // 额外要求
        '8': 'start_time', // 日期
        '9': '0', // 0点
        '10': '1',
        '11': '2',
        '12': '3',
        '13': '4',
        '14': '5',
        '15': '6',
        '16': '7',
        '17': '8',
        '18': '9',
        '19': '10',
        '20': '11',
        '21': '12',
        '22': '13',
        '23': '14',
        '24': '15',
        '25': '16',
        '26': '17',
        '27': '18',
        '28': '19',
        '29': '20',
        '30': '21',
        '31': '22',
        '32': '23', // 23点
        '33': 'summary' // 汇总
      }
      let pushArr = []
      for (let i = 0; i < this.tableData.length; i++) {
        let data = this.reduceKey(this.tableData[i], keyMap)
        pushArr.push(data)
      }
      // 得到任务数据
      let taskArr = _this.getTaskData(pushArr)
        // taskArr.map(item => {
        //   item.task_type = isJg? _this.CONFIG.TASK_TYPE_IS : _this.CONFIG.TASK_TYPE_NOT 
        // })
      _this.$confirm(`一共${taskArr.length}条任务，是否确认生成？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.createInterTask(taskArr, isJg)
      }).catch(() => {
      })
    },
    // 定时任务生成任务
    createInterTask (arr, isJg) {
      let _this = this
      let timer
      let axiosTime = Math.ceil(arr.length / _this.CONFIG.EVERY_TIME_TASK_NUM)
      _this.createTaskVisible = true
      //循环次数
      let trueTime = 0
      timer = setInterval(async () => {
        // 上一次请求是否完成
        if (_this.isAxios) {
          _this.isAxios = false
          let beginIndex = trueTime * _this.CONFIG.EVERY_TIME_TASK_NUM
          let params = {}
          if (trueTime < axiosTime) {
            params = {
              params: JSON.stringify(arr.slice(beginIndex, beginIndex + _this.CONFIG.EVERY_TIME_TASK_NUM))
            }
          } else {
            params = {
              params: JSON.stringify(arr.slice(beginIndex, arr.length))
            }
          }
          if ((arr.slice(beginIndex, arr.length)).length <= 0) {
            clearInterval(timer)
            _this.isAxios = true
            _this.createTaskVisible = false
            _this.successDialog = true
            return false
          }
          params.task_type = isJg? _this.CONFIG.TASK_TYPE_IS : _this.CONFIG.TASK_TYPE_NOT 
          let data = await createNewTaskHandler(params)
          if (data.code === this.CONFIG.CODE_DB_ERROR) {
            clearInterval(timer)
            _this.createTaskVisible = false
            let successDataNum = trueTime * _this.CONFIG.EVERY_TIME_TASK_NUM + data.result.success
            return _this.$message.success('由于网络波动，发单成功' + successDataNum + '条,失败' + (arr.length - successDataNum) + '条，请核对数据后再次发单')
          }
          if (data.code !== this.CONFIG.CODE_SUCCESS) {
            clearInterval(timer)
            _this.createTaskVisible = false
            return _this.$message.warning(data.msg)
          }
          _this.isAxios = true
          if (_this.process < 100) {
            _this.process += Number((100 / axiosTime).toFixed(2))
            _this.process = Number(_this.process.toFixed(2))
            _this.process = (_this.process > 100) ? 100 : _this.process
          }
          trueTime++
        }
      }, 3000)
    },
    reduceKey (obj, keyMap) {
      var objs = Object.keys(obj).reduce((newData, key) => {
        let newKey = keyMap[key] || key
        newData[newKey] = obj[key]
        return newData
      }, {})
      return objs
    },
    isValidDate (date) {
      if (isNaN(new Date(date).getDate())) return true
      return false
    },
    dateVaild (str) {
      let date = str.trim()
      let dateCopy = str.trim()
      const dateReplace = dateCopy.replace(/(\d)/g, "*")
      if (this.dateType.indexOf(dateReplace) == '-1') {
        return '1'
      }
      const r = new RegExp(/(\d{4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})/g)
      let isDate = null
      let endDate = null
      if (date.match(r)) {
        endDate = this.formatDate(date.match(r)[0], 'yyyy-MM-dd')
        isDate = this.isValidDate(endDate)
        if (!isDate) return endDate
        return '1'
      } else {
        if (date.length != 11 && date.length != 9 && date.length != 10) return false
        if (date.indexOf('年') != -1 && date.indexOf('月') != -1 && date.indexOf('日') != -1) {
          let newData = date.match(/\d{4}.\d{1,2}.\d{1,2}/mg).toString()
          newData = newData.replace(/[^0-9]/mg, '-')
          endDate = this.formatDate(newData, 'yyyy-MM-dd')
          isDate = this.isValidDate(endDate)
          if (!isDate) return endDate
          return '1'
        }
        return '1'
      }
    },
    // 继续发单提示
    continueTask () {
      this.successDialog = false
      window.location.reload()
    },
    // 查看任务详情
    taskDetails () {
      this.successDialog = false
      this.$router.push({ path: '/tasksManagement/tasks' }, onComplete => { }, onAbort => { })
    },

    // 禁止发单时间戳判断
    getTimestamp () {
      let date = this.formatDate(new Date(), 'yyyy-MM-dd')
      let closeTaskStart = Date.parse(new Date(`${date} 04:30:00`))
      let closeTaskEnd = Date.parse(new Date(`${date} 05:00:00`))
      let nowTimestamp = (new Date()).getTime()
      this.isCloseTask = (closeTaskStart < nowTimestamp && nowTimestamp < closeTaskEnd) ? true : false
    }
  }
}
</script>

<style lang="scss" >
.taskPublic-container {
  .el-step__title {
    font-size: 18px;
  }
  .el-button--primary{
    @include color_primary_button1();
  }
  .el-button:hover{
    @include color_primary_button1_hover()
  }
  .tips-template {
    height: 90px;
    font-size: 16px;
    line-height: 90px;
    text-align: center;
  }
  .task-table {
    padding: 25px 0;
  }
  .task-btn {
    padding: 10px;
    text-align: center;
  }
  .el-step__description {
    padding-right: 0;
  }
  .task-info {
    display: flex;
    flex-direction: column;
    .el-step__main {
      padding-left: 34px !important;
      position: relative;
      &::before {
        content: "";
        height: 100%;
        width: 2px;
        background-color: #c0c4cc;
        position: absolute;
        left: 10px;
        top: 0;
      }
    }
    .el-step__title {
      margin-top: -25px;
    }
  }
  .el-step.is-vertical .el-step__line {
    top: 3px;
  }
}

.success-info {
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  i {
    font-size: 28px;
    color: #29b7a3;
  }
}

.template-dialog {
  .template-info {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    i {
      font-size: 28px;
      color: #e6a23c;
    }
    &__btn {
      padding: 0 !important;
      a {
        display: inline-block;
        text-decoration: none;
        padding: 12px 20px;
        color: #fff;
      }
    }
  }
}
.closeTime-task {
  h2 {
    margin-top: 200px;
    text-align: center;
  }
}
</style>
