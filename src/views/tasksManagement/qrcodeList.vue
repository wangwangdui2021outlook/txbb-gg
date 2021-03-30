<template>
  <div class="tasks-content">
    <el-row>
      <el-form :inline="true" size="small" :model="searchForm" ref="searchForm">
        <el-form-item label="二维码ID" prop="qr_order_id">
          <el-input
            placeholder="请输入二维码ID"
            type="number"
            clearable
            v-model="searchForm.qr_order_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="notes">
          <el-input
            v-model="searchForm.notes"
            clearable
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="form-btn__defalut"
            type="primary"
            @click="search"
            round
            v-has="42001"
            icon="el-icon-search"
            >查询</el-button
          >
          <el-button
            class="form-btn__defalut"
            type="info"
            round
            v-has="42005"
            @click="isShowFailure = !isShowFailure"
            >{{
              isShowFailure ? "显示失效二维码" : "隐藏失效二维码"
            }}</el-button
          >
          <el-button type="warning" @click="resetSearchForm('searchForm')" round
            >清空搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>

    <div v-if="tableData.length > 0">
      <el-row>
        <ul>
          <li
            v-for="(item, index) in tableData"
            :key="index"
            class="task-qr-box"
          >
            <div
              v-show="getUlHeaderClass(item.effect_start, item.effect_end)[2]"
            >
              <div
                :class="getUlHeaderClass(item.effect_start, item.effect_end)[0]"
              >
                <div class="left">
                  任务生效时间：{{
                    item.effect_start + " ~ " + item.effect_end
                  }}
                </div>
                <div class="right">
                  共 {{ item.statisticsData[0] }} 单，未接
                  {{ item.statisticsData[1] }} 单，进行中
                  {{ item.statisticsData[2] }} 单，待返款
                  {{ item.statisticsData[3] }} 单，已完成
                  {{ item.statisticsData[4] }} 单
                </div>
              </div>
              <el-row class="content">
                <el-col :span="6">
                  <p style="margin-bottom:20px;">
                    状态:{{
                      getUlHeaderClass(item.effect_start, item.effect_end)[1]
                    }}
                  </p>
                  <p style="margin-bottom:10px;">
                    二维码ID:{{ item.id | encodeId }}
                  </p>
                  <div :id="'qr' + item.id" class="qr-box"></div>
                  <p class="task-limit">
                    接单限制：{{ item.qr_task_limit | matchTaskLimit }}
                  </p>
                </el-col>
                <el-col :span="18">
                  <div class="ps">
                    <div>备注信息:&nbsp;&nbsp;</div>
                    <div style="width:90%">
                      {{ item.qr_note }}
                    </div>
                  </div>
                  <div>
                    <el-table
                      :data="item.isMore ? item.task_four : item.goodsList"
                      style="width: 100%"
                    >
                      <el-table-column
                        type="index"
                        width="50"
                        label="序号"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="item_id"
                        label="商品ID"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="shop_name"
                        label="店铺名"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="item_title"
                        label="宝贝标题"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <div v-if="scope.row.item_title">
                            <el-popover
                              v-if="scope.row.item_title.length > 15"
                              placement="left-start"
                              width="200"
                              trigger="hover"
                              :content="scope.row.item_title"
                            >
                              <p slot="reference">
                                {{
                                  scope.row.item_title.substring(0, 15) + "..."
                                }}
                              </p>
                            </el-popover>
                            <p v-else>{{ scope.row.item_title }}</p>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="item_pic"
                        label="商品主图"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <img
                            v-if="scope.row.item_pic"
                            v-lazy="getImgUrl(scope.row.item_pic)"
                            style="width:100px;height:100px"
                            @click="previewImage(scope.row.item_pic, $event)"
                          />
                          <span v-else>-</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="关键词" align="center">
                        <template slot-scope="scope">
                          {{ scope.row.task_method_details }}<br />
                          <span v-has="42006">
                            <el-button
                              type="warning"
                              plain
                              style="border-radius:14px; margin-top:10px"
                              size="mini"
                              @click="
                                addTask(
                                  scope.row,
                                  item.effect_start,
                                  item.effect_end
                                )
                              "
                              >加单</el-button
                            >
                          </span>
                          <!-- <el-button
                            type="warning"
                            plain
                            style="border-radius:14px; margin-top:10px"
                            size="mini"
                            v-if="
                              new Date(item.effect_end).getTime() >
                                new Date().getTime()
                            "
                            @click="
                              addTask(
                                scope.row,
                                item.effect_start,
                                item.effect_end
                              )
                            "
                            >加单</el-button
                          > -->
                        </template>
                      </el-table-column>
                    </el-table>

                    <p style="text-align:center;margin:38px 0">
                      <el-button
                        type="text"
                        v-if="item.isMore"
                        @click="moreGoodsLists(index, item)"
                        >点击查看完整商品列表</el-button
                      >
                    </p>
                  </div>
                  <el-row style="float:right;margin:48px 0">
                    <el-button
                      round
                      type="danger"
                      v-has="42002"
                      v-if="item.status === CONFIG.STATUS_ABLE"
                      @click="clickRemoveQrTask(item.id)"
                      >解除任务二维码</el-button
                    >
                    <el-button
                      round
                      type="warning"
                      v-has="42003"
                      v-if="item.status === CONFIG.STATUS_ABLE"
                      @click="checkQr(item)"
                      >查看二维码</el-button
                    >
                    <el-button
                      round
                      v-has="41000"
                      type="primary"
                      @click="
                        $router.push({
                          name: 'tasks',
                          params: {
                            qr_order_id: encodeId(item.id)
                          }
                        })
                      "
                      >查看任务详情</el-button
                    >
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </li>
        </ul>
      </el-row>

      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="sizeArr"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        >
        </el-pagination>
      </el-row>
    </div>
    <div v-else>
      <br />
      <br />
      <h2 class="ta-c" v-cloak>
        {{ noDataTitle }}
      </h2>
    </div>

    <el-row>
      <el-dialog
        width="438px"
        :visible.sync="qrBoxVisible"
        append-to-body
        class="configureCode"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <div class="show-qr-box" ref="imageWrapper">
          <img class="qr-background" src="@/assets/png/qr-box.png" alt="" />
          <div id="qr-box" class="ta-c" ref="qr-box"></div>
          <div class="qr-note-box">
            <p>备注：</p>
            <p>{{ showQrNote }}</p>
          </div>
        </div>
        <img :src="dataURL" alt="" class="show-qr-img" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="qrBoxVisible = false">关 闭</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="加单"
        :visible.sync="addTastVisible"
        class="configureCode"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <el-form :model="addTaskForm">
          <el-form-item label="商品ID:" :label-width="formLabelWidth">
            {{ addTaskForm.item_id }}
          </el-form-item>
          <el-form-item label="宝贝标题:" :label-width="formLabelWidth">
            {{ addTaskForm.item_title }}
          </el-form-item>
          <el-form-item label="商品主图:" :label-width="formLabelWidth">
            <el-image
              :src="addTaskForm.item_pic"
              class="item-img-box"
              :preview-src-list="[addTaskForm.item_pic]"
            ></el-image>
          </el-form-item>
          <el-form-item label="关键词:" :label-width="formLabelWidth">
            {{ addTaskForm.task_method_details }}
          </el-form-item>
          <el-form-item
            class="task-cnt-box"
            label="加单数量:"
            :label-width="formLabelWidth"
          >
            <el-input-number
              v-model="addTaskForm.task_cnt"
              :min="1"
              :max="100"
              label="加单数量"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="生效时间:" :label-width="formLabelWidth">
            <!-- <el-time-select
              v-model="addTaskForm.new_gmt_start"
              :picker-options="{
                start: getStartTime(addTaskForm.effect_start),
                step: '01:00',
                end: new Date(addTaskForm.effect_end).getHours() + ':00'
              }"
              placeholder="选择时间"
            >
            </el-time-select> -->
            <el-time-select
              v-model="addTaskForm.new_gmt_start"
              :picker-options="{
                start: new Date().getHours() + ':00',
                step: '01:00',
                end: '23:00'
              }"
              placeholder="选择时间"
            >
            </el-time-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addTastVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureAddTask()">确 认</el-button>
        </div>
      </el-dialog>
    </el-row>
    <preview-image ref="previewImage"></preview-image>
  </div>
</template>

<script>
import {
  getQrListHandler,
  removeQrTaskHandler,
  replenishTaskHandler
} from "@/api/taskQrcodeList";
import { getDispatchSelectHandler } from "@/api/taskManage";
import { getQrCodeSrc } from "@/util/tool";
import PreviewImage from '@/components/PreviewImage'
export default {
  components: { PreviewImage },
  data () {
    return {
      noDataTitle: '',
      isShowFailure: false,
      currentPage: 1,
      pageSize: this.PAGE_SIZE,
      totalPage: 0,
      tableData: [],
      searchForm: {
        qr_order_id: "",
        notes: "",
        task_staff_id: ""
      },
      taskStaffArr: [],

      // 查看二维码
      qrBoxVisible: false,
      showQrNote: "",
      dataURL: null,

      // 加单
      addTaskForm: {},
      addTastVisible: false,
      nowTime: new Date().getTime(),
      timmer: null,
      overtime: 0,
      hasRasult: false,
    };
  },
  mounted () {
    this.searchForm.qr_order_id = (this.$route.query && this.$route.query.qr_order_id) ? this.$route.query.qr_order_id : ""
    this.init()
  },
  methods: {
    //预览图片
    previewImage (imgUrl, evemt) {
      if (!imgUrl) return
      let loadStatus = event.currentTarget.getAttribute('lazy')
      if (loadStatus == 'error') return
      this.$refs.previewImage.open(imgUrl)
    },
    // 清空搜索
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.search()
    },
    // 初始化
    init () {
      let _this = this
      let params = {}
      // 任务二维码页面跳转
      if (_this.$route.query.qr_order_id) {
        params = { qr_order_id: _this.$route.query.qr_order_id }
        _this.searchForm = { ...params }
        _this.delayUpdate()
        return false
      }
      this.getQrList()
    },
    // 获取加单开始时间
    getStartTime (effect_start) {
      let time = new Date(effect_start)
      let _this = this
      let startTime = ''
      if ((new Date().getHours() >
        time.getHours()) &&
        _this.judgeTime(
          time.getTime()
        )) {
        startTime = new Date().getHours() + ':00'

      } else {
        startTime = new Date(effect_start).getHours() + ':00'
        startTime.length == 4 ? startTime = '0' + startTime : startTime
      }
      return startTime
    },
    // 匹配头部样式
    getUlHeaderClass (start, end) {
      let _this = this
      let startTime = new Date(start).getTime()
      let endTime = new Date(end).getTime()
      // 未生效
      if (_this.nowTime < startTime) {
        return ['title-wait', '未生效', true]
      }
      // 已失效
      if (_this.nowTime > endTime) {
        let isShow = !_this.isShowFailure
        return ['title-pass', '已失效', isShow]
      }
      // 进行中
      return ['title-ing', '生效中', true]
    },
    // 点击查询
    search () {
      let _this = this
      _this.currentPage = 1
      _this.pageSize = this.PAGE_SIZE
      _this.isShowFailure = false
      _this.getQrList()
    },
    // 修改原始列表数据
    checkData (data) {
      let _this = this
      let len = data.length
      if (!len) return false
      for (let i = 0; i < len; i++) {
        // 获取任务生效时间的最大时间和最小时间
        let effect_start = []
        let effect_end = []
        let statisticsData = [0, 0, 0, 0, 0]
        for (let j = 0; j < data[i].task_info.length; j++) {
          effect_start.push(new Date(data[i].task_info[j].gmt_start).getTime())
          effect_end.push(new Date(data[i].task_info[j].gmt_end).getTime())

          // 获取任务统计数据
          statisticsData[0] = data[i].task_info.length
          switch (data[i].task_info[j].status) {
            case _this.CONFIG.ORDER_STATUS_WAIT_ACCEPT:
              statisticsData[1] = statisticsData[1] + 1
              break;
            case _this.CONFIG.ORDER_STATUS_WAIT_DOING:
              statisticsData[2] = statisticsData[2] + 1
              break;
            case _this.CONFIG.ORDER_STATUS_WAITING_AUDIT:
              statisticsData[3] = statisticsData[3] + 1
              break;
            case _this.CONFIG.ORDER_STATUS_DONE:
              statisticsData[4] = statisticsData[4] + 1
              break;
          }
        }
        data[i].statisticsData = statisticsData;
        if (data[i].task_info.length > 0) {
          data[i].effect_start = _this.formatTime(
            Math.min(...effect_start),
            "Y-M-D h:m:s"
          )
          data[i].effect_end = _this.formatTime(
            Math.max(...effect_end),
            "Y-M-D h:m:s"
          )
        } else {
          data[i].effect_start = "无"
          data[i].effect_end = "无"
        }
        // 根据item_id去重
        data[i].goodsList = _this.arrayUnique(data[i].task_info, [
          "item_id",
          "task_method_details"
        ])
      }
      return data
    },
    // 修改每页显示多少条
    handleSizeChange (val) {
      let _this = this;
      this.pageSize = val;
      this.currentPage = 1
      this.isShowFailure = false
      this.getQrList()
    },
    // 分页跳转
    handleCurrentChange (val) {
      let _this = this
      this.currentPage = val
      this.isShowFailure = false
      this.getQrList()
    },
    // 查看任务二维码
    checkQr (item) {
      let _this = this
      _this.showQrNote = item.qr_note
      let QrCodeSrc = _this.operation + "qr_order_id=" + _this.encodeId(item.id)
      _this.qrBoxVisible = true
      setTimeout(() => {
        document.getElementById("qr-box").innerHTML = ""
        getQrCodeSrc(QrCodeSrc, "qr-box", 126, 126)
        setTimeout(() => {
          const html2canvas = require("html2canvas")
          html2canvas(_this.$refs.imageWrapper, {
            backgroundColor: null
          })
            .then(canvas => {
              let dataURL = canvas.toDataURL("image/png")
              _this.dataURL = dataURL
              dataURL = null
            })
            .catch(err => { })
        }, 10)
      }, 10)
    },
    // 解除任务二维码
    clickRemoveQrTask (id) {
      let _this = this
      _this
        .$confirm(
          "解除任务二维码之后，不影响已绑定会员的任务，未绑定会员的任务需要重新生成二维码才能让会员继续做任务.",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
        .then(() => {
          let params = { qr_id: _this.encodeId(id) }
          _this.removeQrTask(params)
        }).catch(() => { })
    },
    // 点击加单
    addTask (row, effect_start, effect_end) {
      let _this = this
      _this.addTaskForm = {
        ...row,
        ...{ effect_end: effect_end, effect_start: effect_start }
      }
      _this.addTastVisible = true
    },
    // 确认加单
    sureAddTask () {
      let _this = this
      if (!_this.addTaskForm.new_gmt_start || !_this.addTaskForm.task_cnt) return _this.$message.warning('填写内容不能为空！');
      let newTime = _this.formatAddTime(
        _this.addTaskForm.new_gmt_start,
        _this.addTaskForm.effect_end
      )
      let params = {
        task_id: _this.encodeId(_this.addTaskForm.task_id),
        task_cnt: _this.addTaskForm.task_cnt,
        gmt_start: newTime[0],
        start_time: _this.addTaskForm.effect_start,
        end_time: _this.addTaskForm.effect_end,
      }
      _this.replenishTask(params)
    },
    // 时间格式化
    formatAddTime (t1, t2) {
      let nt1 = t1.split(":")
      let nt2 = t2.split(" ")
      let nowData = new Date()
      let t3 = nowData.toLocaleDateString() + " " + nt1[0] + ":00:00"
      let t4 = nt2[0] + " " + nt1[0] + ":59:59"
      return [t3, t4]
    },
    //判断是否需要重新加载
    isReload () {
      let _this = this
      this.timmer = setTimeout(() => {
        if (!_this.hasRasult && _this.overtime < _this.OVERTIME) {
          _this.overtime++
          _this.getQrList()
        } else {
          clearTimeout(_this.timmer)
          if (_this.overtime >= _this.OVERTIME) {
            _this.$message.warning('网络错误，请稍后再试')
          }
          _this.overtime = 0
        }
      }, this.TIMEOUT);
    },
    //判断有无搜索条件
    isReason (data) {
      let reason = true
      for (let key in data) {
        if (key != 'page' && key != 'page_size' && key != 'noLoading') {
          if (data[key] != null && data[key] != '' && data[key] != undefined) {
            reason = false
          }
        }
      }
      if (data.page != 1 || data.page_size != 20) {
        reason = false
      }
      return reason
    },
    //获取今天还剩多久
    getOnedaySeconds () {
      let now = new Date()
      var tommorowDay = new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + ' 23:30:00')
      let timeDifference = tommorowDay.getTime() - now.getTime()
      return Math.ceil(timeDifference / 1000)
    },
    // 得到二维码列表-接口
    async getQrList () {
      let _this = this
      let params = {
        ..._this.searchForm,
        ...{ page: _this.currentPage, page_size: _this.pageSize }
      }
      let isInit = _this.isReason(params)
      let localData = _this.zyLocalStorage.get('qrcodeTableData')
      if (localData && isInit) {
        _this.tableData = localData
      }
      _this.hasRasult = false
      // _this.isReload()
      let data = await getQrListHandler(params)
      _this.hasRasult = true
      if (data.code == _this.CONFIG.CODE_PAGE_END) {
        _this.noDataTitle = '暂无数据'
        _this.tableData = []
        if (isInit) {
          localStorage.removeItem('qrcodeTableData')
        }
        return false
      }
      if (data.code !== _this.CONFIG.CODE_SUCCESS)
        return _this.$message.warning(data.msg)
      _this.totalPage = data.result.count_all
      let nowResult = data.result.qr_order_info
      nowResult.map(item => {
        if (item.qr_note && item.qr_note[0] == '叀') {
          item.qr_note = item.qr_note.slice(1)
        }
      })
      _this.tableData = _this.checkData(nowResult)

      _this.tableData.map(item => {
        item.isMore = item.goodsList.length > 4 ? true : false
        if (item.goodsList.length > 4) {
          item.task_four = item.goodsList.filter((item, index) => {
            return index < 4
          });
        } else {
          item.task_four = item.goodsList
        }
      })
      setTimeout(() => {
        for (let i = 0; i < _this.tableData.length; i++) {
          let tId = "qr" + _this.tableData[i].id;
          document.getElementById(tId).innerHTML = ""
          getQrCodeSrc(
            _this.operation +
            "qr_order_id=" +
            _this.encodeId(_this.tableData[i].id)+
            '&industry_status=' + localStorage.getItem('gg_industry_status'),
            tId,
            184,
            184
          )
        }
        if (isInit) {
          _this.zyLocalStorage.set('qrcodeTableData', _this.tableData, _this.getOnedaySeconds())
        }
      }, 100)
    },
    // 管理端解除任务二维码-接口
    async removeQrTask (params) {
      let data = await removeQrTaskHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS)
        return this.$message.warning(data.msg)
      this.$alert(data.msg, "提示", {
        confirmButtonText: "确定",
        callback: action => {
          this.delayUpdate()
        }
      })
    },
    // 管理端二维码任务临时加单-接口
    async replenishTask (params) {
      let data = await replenishTaskHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.$alert(data.msg, "提示", {
        confirmButtonText: "确定",
        callback: action => {
          this.addTastVisible = false
          this.delayUpdate()
        }
      })
    },
    // 获取派单员下拉列表
    async getDispatchSelect () {
      if (this.taskStaffArr.length == 0) {
        let data = await getDispatchSelectHandler()
        if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
        this.taskStaffArr = data.result
      }
    },
    // 查看更多
    moreGoodsLists (index, item) {
      const obj = { ...item }
      obj.isMore = !obj.isMore
      this.tableData.splice(index, 1, obj)
    },
    // 数据修改延迟三秒重新更新接口
    delayUpdate () {
      let loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
        this.getQrList()
      }, this.DELAY_TIME)
    },
    // 获取展示缩略图文件
    getImgUrl (picUrl) {
      let setTime = Date.parse(new Date('2020-04-27'))  // 缩略图功能生效时间
      if (picUrl.indexOf(this.CDN_UP_URL) < 0) return picUrl
      let dateSlots = picUrl.split('/')
      let dateStr = `${dateSlots[4]}-${dateSlots[5]}-${dateSlots[6]}`
      let uploadTime = Date.parse(new Date(dateStr))
      if (setTime > uploadTime) return picUrl
      let index = picUrl.lastIndexOf('/uploads')
      let strUrl = picUrl.substring(index + 1, picUrl.length)
      return `${this.CDN_UP_URL}${this.THUMBNAIL_URL}/${strUrl}`
    }
  }
}
</script>

<style lang="scss" scope>
.tasks-content {
  ul {
    list-style: none;
    li {
      margin-bottom: 41px;
    }
  }
  .task-qr-box {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 16px 0px rgba(238, 234, 234, 0.5);
    border-radius: 4px;
    .title-wait {
      background-color: #fb773d;
      border-radius: 4px 4px 0px 0px;
      height: 65px;
      color: #fff;
      font-size: 18px;
      font-weight: 500;
      line-height: 25px;
      padding: 20px 28px;
      .left {
        float: left;
      }
      .right {
        float: right;
      }
    }
    .title-pass {
      background-color: #a2a3a6;
      border-radius: 4px 4px 0px 0px;
      height: 65px;
      color: #fff;
      font-size: 18px;
      font-weight: 500;
      line-height: 25px;
      padding: 20px 28px;
      .left {
        float: left;
      }
      .right {
        float: right;
      }
    }
    .title-ing {
      // background-color: #2c8d80;
      @include color_primary();
      border-radius: 4px 4px 0px 0px;
      height: 65px;
      color: #fff;
      font-size: 18px;
      font-weight: 500;
      line-height: 25px;
      padding: 20px 28px;
      .left {
        float: left;
      }
      .right {
        float: right;
      }
    }
    .content {
      background-color: #fff;
      .el-col-6 {
        text-align: center;
        margin-top: 40px;
      }
      .el-col-18 {
        padding: 40px 50px 0 0;
        .ps {
          height: 50px;
          div {
            float: left;
            font-size: 16px;
            font-weight: 400;
            color: rgba(255, 0, 0, 1);
          }
        }
        .el-table {
          margin-top: 24px;
          // th {
          //   background-color: #cbdede !important;
          //   color: #000 !important;
          // }
        }
      }
    }
  }
}
.item-img-box {
  width: 130px;
  height: 90px;
}
.show-qr-box {
  width: 375px;
  position: relative;
  margin: 0 auto;

  #qr-box {
    position: absolute;
    top: 340px;
    background: #fff;
    padding: 5px;
    left: 120px;
    img {
      margin: 0 auto;
    }
  }
  .qr-note-box {
    position: absolute;
    bottom: 40px;
    p {
      padding: 0 28px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 3px;
    }
  }
}
.qr-box {
  img {
    margin: 0 auto;
  }
}
.task-limit {
  margin-top: 12px;
}
.qr-background {
  width: 370px;
  height: 660px;
}
.configureCode {
  .el-dialog__body {
    padding: 10px 5px 5px;
  }
}
.show-qr-img {
  position: absolute;
  top: 38px;
  left: 31px;
  width: 375px;
  height: 667px;
  z-index: 10000;
  margin: 0 auto;
}

.configureCode {
  .task-cnt-box .el-input__inner {
    width: 305px !important;
  }
  .el-input-number {
    width: 305px;
  }
}
</style>
