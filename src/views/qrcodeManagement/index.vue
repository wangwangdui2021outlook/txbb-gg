<template>
  <div class="code-content">
    <el-row>
      <el-form :model="searchForm" :inline="true" size="small" ref="searchForm">
        <el-form-item label="设备名称" prop="device_name">
          <el-input
            clearable
            v-model="searchForm.device_name"
            placeholder="请输入设备名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="生成时间">
          <el-date-picker
            v-model="createTimeArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option
              label="正常"
              :value="this.CONFIG.STATUS_ABLE"
            ></el-option>
            <el-option
              label="失效"
              :value="this.CONFIG.STATUS_DISABLE"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-has="71001"
            type="primary"
            icon="el-icon-search"
            round
            @click="search"
            >查询</el-button
          >
          <el-button type="warning" @click="resetSearchForm('searchForm')" round
            >清空搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>

    <el-row v-if="tableData.length > 0">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="qr_device_name" label="设备名称">
        </el-table-column>
        <el-table-column prop="gmt_create" label="生成时间"> </el-table-column>
        <el-table-column prop="gmt_expire" label="截止时间"> </el-table-column>
        <el-table-column prop="" label="二维码使用数">
          <template slot-scope="scope">
            <span
              >{{ scope.row.qr_used_count }} /
              {{ scope.row.qr_count_all }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | matchNomalStatus }}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="二维码">
          <template slot-scope="scope">
            <div :id="'qr' + scope.row.id"></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="60" align="center">
          <template slot-scope="scope">
            <el-button
              v-has="71002"
              v-if="scope.row.status == CONFIG.STATUS_ABLE"
              type="danger"
              size="small"
              @click="failureNow(scope.row)"
              >立即失效</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
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
    <div v-else>
      <br />
      <br />
      <h2 class="ta-c">
        {{ noDataTitle }}
      </h2>
    </div>
  </div>
</template>

<script>
import { getQrListHandler, updateQrHandler } from "@/api/qrcodeManagement";
import { getQrCodeSrc } from "@/util/tool";

export default {
  data() {
    return {
      noDataTitle: "",
      currentPage: 1,
      pageSize: this.PAGE_SIZE,
      totalPage: 0,
      createTimeArr: [],
      tableData: [],
      searchForm: {
        status: this.CONFIG.STATUS_ABLE
      }
    };
  },
  mounted() {
    // this.getQrList()
  },
  methods: {
    // 清空搜索
    resetSearchForm(formName) {
      this.createTimeArr = [];
      this.$refs[formName].resetFields();
      this.search();
    },
    // 点击查询
    search() {
      let _this = this;
      _this.currentPage = 1;
      _this.pageSize = _this.PAGE_SIZE;
      _this.getQrList();
    },
    // 注册管理列表
    async getQrList() {
      let _this = this;
      let params = {
        ..._this.searchForm,
        ...{ page: _this.currentPage, page_size: _this.pageSize }
      };
      params.start_time = _this.createTimeArr ? _this.createTimeArr[0] : "";
      params.end_time = _this.createTimeArr ? _this.createTimeArr[1] : "";
      _this.tableData = [];
      let data = await getQrListHandler(params);
      if (data.code == _this.CONFIG.CODE_PAGE_END)
        return (_this.noDataTitle = "暂无数据");
      if (data.code !== this.CONFIG.CODE_SUCCESS)
        return this.$message.warning(data.msg);
      this.tableData = data.result.qr_device_list;
      this.totalPage = data.result.count_all;
      setTimeout(() => {
        for (let i = 0; i < _this.tableData.length; i++) {
          let tId = "qr" + _this.tableData[i].id;
          document.getElementById(tId).innerHTML = "";
          getQrCodeSrc(
            _this.register +
              "device_id=" +
              _this.encodeId(_this.tableData[i].id),
            tId,
            130,
            130
          );
        }
      }, 100);
    },
    // 分页每页显示多少条
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getQrList();
    },
    // 下一页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getQrList();
    },
    // 立即失效
    failureNow(row) {
      let _this = this;
      this.$confirm("确定要将该二维码设为失效么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let params = { qr_id: _this.encodeId(row.id) };
        let data = await updateQrHandler(params);
        if (data.code !== _this.CONFIG.CODE_SUCCESS)
          return _this.$message.warning(data.msg);
        _this.$message.success(data.msg);
        _this.getQrList();
      });
    }
  }
};
</script>

<style lang="scss" scope></style>
