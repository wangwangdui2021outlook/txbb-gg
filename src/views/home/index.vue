<template>
  <div class="home-content">
    <p>欢迎来到{{ PLAT_NAME }}</p>
  </div>
</template>

<script>
import { getTaskListHandler } from '@/api/taskManage'
import { getQrListHandler } from "@/api/taskQrcodeList"
export default {
  data () {
    return {
      sendData: {
        page: 1,
        page_size: 20
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getTaskList()
    },
    // 得到任务列表 - 接口
    async getTaskList () {
      let data = await getTaskListHandler(this.sendData)
      if (data.code == this.CONFIG.CODE_SUCCESS) {
        this.zyLocalStorage.set('taskTableData', data.result.task_list, this.getOnedaySeconds())
      }
    },
    //获取今天还剩多久
    getOnedaySeconds () {
      let now = new Date()
      var tommorowDay = new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + ' 23:30:00')
      let timeDifference = tommorowDay.getTime() - now.getTime()
      return Math.ceil(timeDifference / 1000)
    },
  }
}
</script>

<style lang="scss">
.home-content {
  p {
    width: 100%;
    padding: 150px 0;
    background-color: #fff;
    text-align: center;
    font-size: 40px;
  }
}
</style>
