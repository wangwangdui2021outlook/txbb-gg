<template>
  <div class="download-content">
    <el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          type="index"
          width="120"
          label="序号"
        ></el-table-column>
        <el-table-column prop="file_name" label="文件名"> </el-table-column>
        <el-table-column prop="gmt_create" label="生成时间"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | matchExportStatus }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              class="href-button"
              v-if="scope.row.status == CONFIG.STATUS_ING"
              type="primary"
              size="small"
            >
              <a
                class="download-href"
                :href="`${taskDownloadUrl}/${scope.row.url}`"
                >下载</a
              >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-if="tableData.length > 0">
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
      </div>
    </el-row>
  </div>
</template>

<script>

import { getExportRecordListHandler } from '@/api/taskManage'

export default {
  data () {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: this.PAGE_SIZE,
      totalPage: 0
    }
  },
  created () { },
  mounted () {
    this.getExportRecordList()
  },
  methods: {
    // 获取导出列表
    async getExportRecordList () {
      this.tableData = []
      const params = {
        page: this.currentPage, page_size: this.pageSize
      }
      const data = await getExportRecordListHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.tableData = data.result.record_list
      this.totalPage = data.result.count_all
    },

    // 分页每页显示多少条
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.getExportRecordList()
    },
    // 下一页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getExportRecordList()
    }
  }
}
</script>

<style lang="scss">
.download-content {
  .download-href {
    text-decoration: none;
    color: #fff;
    display: inline-block;
    padding: 9px 15px;
  }
  .href-button {
    padding: 0;
  }
}
</style>
