
<template>
  <div class="statistics-content">
    <div class="data-box" v-has="21001">
      <el-row class="data-top-p">
        <el-col :span="12">
          <p class="data-box-title">数据概览</p>
        </el-col>
        <el-col :span="12">
          <p class="ta-r">数据时间：{{ nowDate }}</p>
        </el-col>
      </el-row>
      <el-row :gutter="25">
        <el-col :span="countList.length == 3? 8 : 6" v-for="item in countList" :key="item.type">
          <div class="data-f-box">
            <el-row>
              <el-col :span="12" align="center">
                <i :class="['iconfont', 'iconjinri', item.color]"></i>
              </el-col>
              <el-col :span="12">
                <p class="ta-l data-title">
                  {{ item.title }}
                </p>
                <p :class="['ta-l', item.color, 'data-num-1']">
                  {{ item.num }}
                </p>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="data-box" v-has="21002">
      <el-row class="data-top-p">
        <el-col :span="12">
          <p class="data-box-title">今日总览</p>
        </el-col>
        <el-col :span="12">
          <p class="ta-r">今日总任务完成率：{{ finishRate }}%</p>
        </el-col>
      </el-row>
      <el-row class="data-s-box" type="flex" justify="space-between">
        <el-col
          class="data-s-box-det"
          :span="2"
          v-for="(item, index) in todayData"
          :key="index"
        >
          <div>
            <p class="ta-c data-num-2 m-b-17">
              {{ item.num }}
            </p>
            <p class="ta-c ">
              {{ item.name }}
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="data-box" v-has="21003">
      <el-row class="data-top-p">
        <el-col :span="12">
          <p class="data-box-title">数据统计</p>
        </el-col>
      </el-row>
      <el-row class="data-box-t" :gutter="25">
        <el-col :span="4">
          <div class="data-t-detalis bg-w data-box-t-l">
            <div v-for="(item, index) in bottomData" :key="index" :class="industry_status != CONFIG.INDUSTRY_STATUS_CLOSE ? 'padding38' : 'padding57' ">
              <p class="ta-l data-t-title">
                {{ type == CONFIG.DATA_SEVEN ? "近7天" : "近30天"
                }}{{ item.name }}
              </p>
              <p class="ta-l data-num-3">{{ item.num }}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="bg-w data-box-t-r">
            <div class="echarts-btn-box">
              <el-button
                @click="getDataType(item)"
                :type="type == item.type ? 'primary' : ''"
                round
                v-for="item in dataType"
                :key="item.title"
                >{{ item.title }}</el-button
              >
            </div>
            <div class="echarts-box">
              <v-charts
                ref="chartId"
                class="charts"
                :id="echartId"
                :jsonData="chartData"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getTrendDataHandler, getDataHandler } from '@/api/statistics'
import vCharts from '@/components/charts'
let echarts = require('echarts/lib/echarts')
export default {
  components: { vCharts },
  data () {
    return {
      industry_status: localStorage.getItem('gg_industry_status'),
      type: this.CONFIG.DATA_SEVEN,
      nowDate: '',
      finishRate: '0.00',
      dataType: [
        { type: '', title: '近7天' },
        { type: '', title: '近30天' }
      ],
      countList: [],
      countListOld: [
        { type: 'today', title: '今日任务总数', num: 0, color: 'color-green', icon: 'iconjinri' },
        { type: 'yesterday', title: '昨日任务总数', num: 0, color: 'color-orange', icon: 'iconzuori' },
        { type: 'total', title: '历史总单量', num: 0, color: 'color-red', icon: 'iconlishi' }
      ],
      countListNew: [
        { type: 'today', title: '今日任务总数', num: 0, color: 'color-green', icon: 'iconjinri' },
        { type: 'yesterday', title: '昨日普通任务总数', num: 0, color: 'color-orange', icon: 'iconzuori' },
        { type: 'yesterday', title: '昨日隔日任务总数', num: 0, color: 'color-orange', icon: 'iconzuori' },
        { type: 'total', title: '历史总单量', num: 0, color: 'color-red', icon: 'iconlishi' }
      ],
      todayData: [
        {
          name: '未分配',
          type: 'task_not_allot',
          num: 0
        },
        {
          name: '进行中',
          type: 'task_allot',
          num: 0
        },
        {
          name: '待完成',
          type: 'task_doing',
          num: 0
        },
        {
          name: '待审核',
          type: 'task_audit',
          num: 0
        },
        {
          name: '已完成',
          type: 'task_done',
          num: 0
        },
        {
          name: '已失效',
          type: 'task_cancel',
          num: 0
        },
         {
          name: '已超时',
          type: 'task_time_out',
          num: 0
        },
         {
          name: '审核失败',
          type: 'task_fail',
          num: 0
        },
        {
          name: '新增用户数',
          type: 'new_user',
          num: 0
        },
        {
          name: '活跃用户数',
          type: 'active_user',
          num: 0
        }
      ],

      bottomData: [],
      bottomDataOld: [
        {
          name: '发布任务数量',
          num: 0,
          type: 'task_num_all',

        },
        {
          name: '完成任务数量',
          num: 0,
          type: 'task_num_done',
        },
        {
          name: '用户活跃',
          num: 0,
          type: 'user_activity_num',
        },
        {
          name: '用户增长',
          num: 0,
          type: 'user_register_num',
        }
      ],
      bottomDataNew: [
        {
          name: '发布普通任务数量',
          num: 0,
          type: 'task_num_all',
        },
        {
          name: '完成普通任务数量',
          num: 0,
          type: 'task_num_done',
        },
         {
          name: '发布隔日任务数量',
          num: 0,
          type: 'cart_task_num_all',
        },
        {
          name: '完成隔日任务数量',
          num: 0,
          type: 'cart_task_num_done',
        },
        {
          name: '用户活跃',
          num: 0,
          type: 'user_activity_num',
        },
        {
          name: '用户增长',
          num: 0,
          type: 'user_register_num',
        }
      ],
      chartData: {},
      chartDataOld: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          x: 'center',
          icon: 'circle',
          itemWidth: 15,
          itemHeight: 15,
          textStyle: {
            fontSize: 15,
          },
          data: ['发布任务数', '完成任务数', '活跃用户数', '增长用户数']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '发布任务数',
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#12B7FF"
              }
            },
            data: []
          },
          {
            name: '完成任务数',
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#2CB82E"
              }
            },
            data: []
          },
          {
            name: '活跃用户数',
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#FFA900"
              }
            },
            data: []
          },
          {
            name: '增长用户数',
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#7876FF"
              }
            },
            data: []
          }
        ]
      },
      chartDataNew: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          x: 'center',
          icon: 'circle',
          itemWidth: 15,
          itemHeight: 15,
          textStyle: {
            fontSize: 15,
          },
          data: ['普通任务发布', '完成普通任务数', '隔日任务发布', '完成隔日任务数', '活跃用户数', '增长用户数']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '普通任务发布',
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#12B7FF"
              }
            },
            data: []
          },
          {
            name: '完成普通任务数',
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#2CB82E"
              }
            },
            data: []
          },
          {
            name: '隔日任务发布',
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#DC143C"
              }
            },
            data: []
          },
          {
            name: '完成隔日任务数',
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#191970"
              }
            },
            data: []
          },
          {
            name: '活跃用户数',
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#FFA900"
              }
            },
            data: []
          },
          {
            name: '增长用户数',
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#7876FF"
              }
            },
            data: []
          }
        ]
      },
      echartId: 'eId'
    }
  },
  mounted () {
    this.dataType[0].type = this.CONFIG.DATA_SEVEN
    this.dataType[1].type = this.CONFIG.DATA_MONTH
    let timestamp = new Date().getTime()
    this.nowDate = this.formatDate(timestamp, 'yyyy/MM/dd')
    let countList = this.countListOld
    let bottomData = this.bottomDataOld
    let chartData = this.chartDataOld
    // 如果是大单机构，走新数据
    if(this.industry_status != this.CONFIG.INDUSTRY_STATUS_CLOSE) {
      countList = this.countListNew
      bottomData = this.bottomDataNew
      chartData = this.chartDataNew
    } 
    this.countList = countList
    this.bottomData = bottomData
    this.chartData = chartData
    this.getData()
    this.getTrendData()
  },
  methods: {
    //获取一天的时间，最少为6小时
    getOnedaySeconds () {
      let now = new Date()
      let tommorow = new Date();
      let sixHours = 6 * 60 * 60 * 1000
      tommorow.setTime(tommorow.getTime() + 24 * 60 * 60 * 1000);
      var tommorowDay = new Date(tommorow.getFullYear() + "-" + (tommorow.getMonth() + 1) + "-" + tommorow.getDate())
      let timeDifference = tommorowDay.getTime() - now.getTime()
      timeDifference = timeDifference > sixHours ? timeDifference : sixHours
      return Math.ceil(timeDifference / 1000)
    },
    // 获取7或30天数据
    getDataType (item) {
      this.type = item.type
      this.getTrendData()
    },
    // 获取当天数据
    async getData () {
      let data = await getDataHandler()
      this.countList.map((item) => { item.num = 0 })
      this.todayData.map((item) => { item.num = 0 })
      if (data.code !== this.CONFIG.CODE_SUCCESS) return false
      const result = data.result
      let countList = this.countList
      let todayData = this.todayData
      if(this.industry_status != this.CONFIG.INDUSTRY_STATUS_CLOSE){
        countList.map((item) => { item.num = data.result[item.type].task_num + data.result[item.type].cart_task_num })
        countList[1].num = data.result.yesterday.task_num
        countList[2].num = data.result.yesterday.cart_task_num
        todayData.map((item) => { 
          item.num = result.today[item.type]
          if(item.type.indexOf('task') != -1 && item.type != 'task_time_out'){
            item.num = result.today[item.type] + result.today['cart_' + item.type]
          }
          if(item.type == 'task_doing' && result.today.cart_wait_commit_num) {
            item.num = result.today[item.type] + result.today['cart_' + item.type] + result.today.cart_wait_commit_num
          }
         })
      }else{
        countList.map((item) => { item.num = data.result[item.type].task_num })
        todayData.map((item) => { item.num = result.today[item.type] })
      }
      this.countList = countList
      this.todayData = todayData
      // TODO: 已失效是否要加上超时的，待定
      this.finishRate = (result.today.task_num == 0) ? '0.00' : (result.today.task_done * 100 / result.today.task_num).toFixed(2)
    },

    // 获取数据统计折线图
    async getTrendData () {
      let localChartDate = await this.zyLocalStorage.get('chartData' + this.type)
      let localBottomData = await this.zyLocalStorage.get('bottomData' + this.type)
      if (localChartDate && localBottomData) {
        this.chartData = []
        this.chartData = localChartDate
        this.bottomData = localBottomData
        setTimeout(() => {
          this.$refs.chartId.init()
        }, 0);
        return
      }
      this.bottomData.map((item) => { item.num = 0 })
      this.chartData.xAxis[0].data = []
      this.chartData.series.map((item) => { item.data = [] })
      const data = await getTrendDataHandler({ date_range: this.type })
      if (data.code !== this.CONFIG.CODE_SUCCESS) return false
      const result = data.result
      this.bottomData.map((item) => { item.num = result.sum[item.type] })
      this.zyLocalStorage.set('bottomData' + this.type, this.bottomData, this.getOnedaySeconds())
      const date = []
      const task_num_all = []
      const task_num_done = []
      const user_activity_num = []
      const user_register_num = []
      const cart_task_num_all = []
      const cart_task_num_done = []
      result.trend.map((item) => {
        date.push(item.date)
        task_num_all.push(item.task_num_all)
        task_num_done.push(item.task_num_done)
        user_activity_num.push(item.user_activity_num)
        user_register_num.push(item.user_register_num)
        if(this.industry_status == this.CONFIG.INDUSTRY_STATUS_CLOSE) return
        cart_task_num_all.push(item.cart_task_num_all)
        cart_task_num_done.push(item.cart_task_num_done)
      })
      this.chartData.xAxis[0].data = [...date]
      this.chartData.series[0].data = [...task_num_all]
      this.chartData.series[1].data = [...task_num_done]
      this.chartData.series[2].data = [...user_activity_num]
      this.chartData.series[3].data = [...user_register_num]
      if(this.industry_status != this.CONFIG.INDUSTRY_STATUS_CLOSE){
        this.chartData.series[2].data = [...cart_task_num_all]
        this.chartData.series[3].data = [...cart_task_num_done]
        this.chartData.series[4].data = [...user_activity_num]
        this.chartData.series[5].data = [...user_register_num]
      } 
      this.zyLocalStorage.set('chartData' + this.type, this.chartData, this.getOnedaySeconds())
      this.$refs.chartId.init()
    },
  }
}
</script>

<style lang="scss" scope>
.padding38{
  padding: 38px 0;
}
.padding57{
  padding: 57px 0;
}
.statistics-content {
  .data-box {
    color: #000;
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 40px;
    .data-top-p {
      margin-bottom: 35px;
    }
    .data-f-box {
      height: 153px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 6px 16px 0px rgba(238, 234, 234, 0.5);
      border-radius: 4px;
      padding: 34px 0;
    }
  }

  .data-s-box {
    height: 153px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 16px 0px rgba(238, 234, 234, 0.5);
    border-radius: 4px;
    padding: 35px 0 36px;
    .data-s-box-det {
      border-right: 1px solid #d8d8d8;
    }
    .data-s-box-det:last-of-type {
      border-right: none;
    }
  }
  .data-box-t {
    .data-box-t-l {
      padding: 0 52px;
      div {
        border-bottom: 1px solid #d8d8d8;
      }
      div:last-of-type {
        border-bottom: none;
      }
    }
    .data-box-t-r {
      padding-bottom: 50px;
      .echarts-box {
        height: 550px;
      }
      .echarts-btn-box {
        width: 100%;
        text-align: center;
        padding: 50px 0 110px;
      }
      .el-button--primary{
         @include color_primary_button1();
      }
      .el-button:hover{
        @include color_primary_button1_hover();
      }
    }
    .data-t-title {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      // padding-top: 57px;
      margin-bottom: 22px;
    }
  }
  .data-box-title {
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
  }

  .iconfont {
    font-size: 72px;
    // margin-left: 84px;
  }
}
.data-num-1 {
  font-size: 40px;
  font-family: DINAlternate-Bold, DINAlternate;
  font-weight: bold;
}
.data-num-2 {
  font-size: 34px;
  font-family: DINAlternate-Bold, DINAlternate;
  font-weight: bold;
}
.data-num-3 {
  font-size: 30px;
  font-family: ArialMT;
  color: rgba(0, 0, 0, 1);
  // padding-bottom: 57px;
}
.data-title {
  font-weight: 500;
  margin-bottom: 13px;
}

.charts {
  width: 100%;
  height: 550px;
}
</style>

