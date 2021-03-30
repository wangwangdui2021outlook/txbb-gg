<template>
  <div class="code-content">
    <el-row>
      <p style="color:red;margin-bottom:20px;font-size:15px;">
        为了您的数据安全以及保持平台稳定性，我们将定期清理数据。历史任务数据仅保留31天，请务必保存好所需的数据。
      </p>
      <el-form :inline="true" size="small" :model="searchForm" ref="searchForm">
        <el-form-item label="生效时间">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="effectTimeArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="接单时间">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="acceptTimeArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="返款时间">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="confirmTimeArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="微信号" prop="buyer_wechat">
          <el-select
            v-model="searchForm.buyer_wechat"
            filterable
            clearable
            placeholder="请选择微信号"
            @click.native="getWechatList"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(v, index) in wechatArr"
              :key="index"
              :label="v"
              :value="v"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品金额" prop="capital_start">
          <el-col :span="11">
            <el-input
              type="number"
              clearable
              placeholder="请输入商品金额"
              v-model="searchForm.capital_start"
            ></el-input>
          </el-col>
          <el-col class="ta-c" :span="2">-</el-col>
          <el-col :span="11">
            <el-input
              type="number"
              clearable
              placeholder="请输入商品金额"
              v-model="searchForm.capital_end"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号" prop="buyer_phone">
          <el-input
            type="number"
            placeholder="请输入手机号"
            clearable
            v-model="searchForm.buyer_phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="淘宝昵称" prop="buyer_tb_nick">
          <el-input
            clearable
            placeholder="请输入淘宝昵称"
            v-model="searchForm.buyer_tb_nick"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺名" prop="shop_name">
          <el-select
            v-model="searchForm.shop_name"
            filterable
            clearable
            multiple
            collapse-tags
            placeholder="请选择店铺名"
            @visible-change="getShopList"
            :filter-method="searchShopValue"
            @blur="searchShopEnd"
          >
            <el-option
              v-for="(v, index) in shopArr"
              :key="index"
              :label="v"
              :value="v"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在设备" prop="device_id">
          <div>
            <el-select
              v-model="searchForm.device_id"
              filterable
              clearable
              multiple
              collapse-tags
              placeholder="请选择所在设备"
              @visible-change="getSelectList"
            >
              <!-- <el-option label="全部" value=""></el-option> -->
              <el-option
                v-for="(v, index) in deviceArr"
                :key="index"
                :label="v.device_name"
                :value="v.id"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="商品ID" prop="item_id">
          <el-input
            type="number"
            clearable
            placeholder="请输入商品ID"
            v-model="searchForm.item_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="二维码ID" prop="qr_order_id">
          <el-input
            type="number"
            clearable
            placeholder="请输入二维码ID"
            v-model="searchForm.qr_order_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务ID" prop="task_id">
          <el-input
            type="number"
            clearable
            placeholder="请输入任务ID"
            v-model="searchForm.task_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="关键词" prop="task_method_details">
          <el-select
            v-model="searchForm.task_method_details"
            filterable
            clearable
            placeholder="请输入关键词"
            @click.native="getKeywordList"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(v, index) in keyArr"
              :key="index"
              :label="v"
              :value="v"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select
            v-model="searchForm.status"
            multiple
            clearable
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              label="已超时"
              :value="this.CONFIG.ORDER_STATUS_TIME_OUT + ''"
            ></el-option>
            <el-option
              label="审核失败"
              :value="this.CONFIG.ORDER_STATUS_FAIL + ''"
            ></el-option>
            <el-option
              label="已完成"
              :value="this.CONFIG.ORDER_STATUS_DONE + ''"
            ></el-option>
            <el-option
              label="已失效"
              :value="this.CONFIG.ORDER_STATUS_CANCEL + ''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="派单员"
          prop="shop_name"
          v-if="isCode || userInfoObj.is_admin == CONFIG.ROLE_ADMIN"
        >
          <div>
            <el-select
              v-model="searchForm.task_staff_id"
              filterable
              clearable
              multiple
              collapse-tags
              placeholder="请选择派单员"
              @visible-change="getStaffList"
            >
              <el-option
                v-for="(v, index) in staffList"
                :key="index"
                :label="v.task_staff_name"
                :value="v.task_staff_id"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            class="form-btn__defalut"
            type="primary"
            v-has="44001"
            @click="search"
            round
            icon="el-icon-search"
            >查询</el-button
          >
          <span v-has="44002" @click="exportList">
            <export-file ref="exportFile"></export-file>
          </span>
          <el-button v-has="43000" type="success" @click="jumpRouter" round
            >导出文件列表</el-button
          >
          <el-button type="warning" @click="resetSearchForm('searchForm')" round
            >清空搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>

    <div v-if="tableData.length > 0">
      <div class="ta-r">
        <el-select
          v-model="chooseTableName"
          multiple
          collapse-tags
          style="margin-left: 20px;"
          placeholder="请选择要显示的表头"
          @change="getShowTableName"
          size="small"
        >
          <el-option
            v-for="item in tableName"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </div>
      <el-row>
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%"
          ref="tableData"
          :key="key"
          @sort-change="sortChange"
        >
          <!-- <el-table-column type="selection" width="55" fixed> </el-table-column> -->
          <el-table-column prop="id" label="任务ID" width="120" fixed>
            <template slot-scope="scope">
              <p>{{ scope.row.id | encodeId }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="订单发布时间"
            prop="gmt_create"
            width="130"
            sortable="custom"
          >
            <template slot-scope="scope">
              <p v-html="trimText(scope.row.gmt_create)"></p>
            </template>
          </el-table-column>
          <el-table-column
            label="生效时间"
            prop="gmt_start"
            width="110"
            sortable="custom"
          >
            <template slot-scope="scope">
              <p v-html="trimText(scope.row.gmt_start)"></p>
            </template>
          </el-table-column>
          <el-table-column
            prop="item_id"
            label="商品ID"
            width="150"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column prop="item_title" label="宝贝标题">
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
                    {{ scope.row.item_title.substring(0, 15) + "..." }}
                  </p>
                </el-popover>
                <p v-else>{{ scope.row.item_title }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="item_pic" label="宝贝图片" width="160">
            <template slot-scope="scope">
              <img
                v-if="scope.row.item_pic"
                v-lazy="getImgUrl('goodsPic', scope.row)"
                style="width:100px;height:100px"
                @click="previewImage(scope.row.item_pic, $event)"
              />
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="shop_name" label="店铺名"> </el-table-column>
          <el-table-column prop="buyer_tb_nick" label="接单淘宝">
          </el-table-column>
          <el-table-column prop="buyer_wechat" label="接单微信">
          </el-table-column>
          <el-table-column prop="status" label="状态" width="160">
            <template slot-scope="scope">
              <p :class="['task-status__' + scope.row.status, 'task-status']">
                {{ scope.row.status | matchTaskStatus }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            min-width="110"
            v-for="(item, index) in formThead"
            :key="index"
            :label="item.name"
          >
            <template slot-scope="scope">
              <div v-if="item.key == 'task_note'">
                <el-popover
                  v-if="scope.row.task_note.length > 15"
                  placement="left-start"
                  width="200"
                  trigger="hover"
                  :content="scope.row.task_note"
                >
                  <p slot="reference">
                    {{ scope.row.task_note.substring(0, 15) + "..." }}
                  </p>
                </el-popover>
                <p v-else>{{ scope.row.task_note }}</p>
              </div>
              <div v-else>
                <div
                  v-if="
                    item.key == 'gmt_taking_task' ||
                      item.key == 'gmt_confirm_task'
                  "
                >
                  <p v-html="trimText(scope.row[item.key])"></p>
                </div>
                <p v-else>{{ scope.row[item.key] }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="single_task_price"
            label="商品金额"
            width="200"
          >
          </el-table-column>

          <el-table-column prop="sum" label="总金额">
            <template slot-scope="scope">
              <span
                v-if="
                  isRealNum(scope.row.task_commission) &&
                    isRealNum(scope.row.single_task_price)
                "
              >
                {{
                  Number(scope.row.task_commission) +
                    Number(scope.row.single_task_price)
                }}
              </span>
              <span v-else>0</span>
            </template>
          </el-table-column>

          <el-table-column prop="real_task_price" label="实返金额">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.status != CONFIG.ORDER_STATUS_DONE
                    ? 0
                    : scope.row.real_task_price
                }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            prop="buyer_collection_qr"
            label="收款码"
            width="160"
          >
            <template slot-scope="scope">
              <img
                v-if="scope.row.buyer_collection_qr"
                v-lazy="getImgUrl('bankInfo', scope.row)"
                style="width:100px;height:100px"
                @click="
                  previewImage(
                    scope.row.cdn_url + scope.row.buyer_collection_qr,
                    $event
                  )
                "
              />
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="buyer_bank_card_num"
            label="银行卡"
            width="150"
          >
          </el-table-column>

          <el-table-column prop="pay_note" label="返款备注" width="200">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.isNoteEdit">
                  <el-input v-model="pay_note" type="text"></el-input>
                </div>
                <div v-else>
                  <p>
                    {{ scope.row.pay_note }}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="reject_reason" label="问题反馈">
          </el-table-column>
        </el-table>
        <div>
          <p class="count-task-num" v-if="statisticsData.length">
            共 {{ statisticsData[0] }} 单，未接
            {{ statisticsData[1] }} 单，进行中
            {{ statisticsData[2] }} 单，待返款
            {{ statisticsData[3] }} 单，已完成 {{ statisticsData[4] }} 单
          </p>
        </div>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="sizeArr"
            :page-size="pageSize"
            layout="total, sizes, prev, next, slot"
            :total="totalPage"
            :disabled="!hasRasult"
            ><span style="background-color:#ffffff;"
              >第{{ currentPage }}页</span
            >
          </el-pagination>
        </div>
      </el-row>
    </div>
    <div v-else>
      <br />
      <br />
      <h2 class="ta-c">
        {{ noDataTitle }}
      </h2>
    </div>
    <preview-image ref="previewImage"></preview-image>
  </div>
</template>

<script>
import {
  getSearchShopListHandler,
  getStaffListHandler,
  getKeywordListHandler,
  getShopListHandler,
  getWechatListHandler,
  getDispatchSelectHandler,
  exportHandler,
  exportSelfHandler
} from "@/api/taskManage";
import {
  getHistoryTaskListHandler,
  getSelfHistoryTaskListHandler,
  getAllHistoryTaskListHandler,
  getSearchHistoryShopListHandler
} from "@/api/historyTask";
import {
  getSelectListHandler,
  getMySelectListHandler
} from "@/api/deviceManagement";
import { getQrCodeSrc } from "@/util/tool";
import ExportFile from "./components/exportFile";
import PreviewImage from "@/components/PreviewImage";
export default {
  components: { ExportFile, PreviewImage },
  data() {
    return {
      noDataTitle: "",
      // 用户信息
      userInfoObj: this.$store.state.userInfo,
      //是否有分配任务权限code
      isCode: false,
      // 是否有查看所有历史任务权限code
      isHistoryAll: false,
      // 修改本金
      singlePrice: "",
      //任务id
      taskId: "",
      // 生效时间
      effectTimeArr: [],
      // 接单时间
      acceptTimeArr: [],
      // 返款时间
      confirmTimeArr: [],
      // 分页数据
      currentPage: 1,
      pageSize: this.PAGE_SIZE,
      totalPage: 0,
      tableData: [],
      // 查询数据
      searchForm: {
        effect_start: null,
        effect_end: null,
        start_time: null,
        end_time: null,
        confirm_start: null,
        confirm_end: null,
        buyer_wechat: null,
        capital_start: null,
        capital_end: null,
        buyer_phone: null,
        buyer_tb_nick: null,
        shop_name: null,
        item_id: null,
        task_id: null,
        task_method_details: null,
        status: [],
        device_id: [],
        task_staff_id: null,
        sort_field: null,
        sort_unit: null
      },

      // 下拉匹配数据
      wechatArr: [],
      shopArr: [],
      shopArrOld: [],
      keyArr: [],
      deviceArr: [],
      taskStaffArr: [],
      task_limit: this.CONFIG.STATUS_FALSE,
      // 选中任务数据
      statisticsData: [],
      // 表头是否展示数据
      tableName: [
        {
          key: "task_method_details",
          name: "关键词"
        },
        {
          key: "gmt_taking_task",
          name: "接单时间"
        },
        {
          key: "gmt_confirm_task",
          name: "返款时间"
        },
        {
          key: "buyer_phone",
          name: "接单手机"
        },
        {
          key: "device_name",
          name: "所在设备"
        },
        {
          key: "tb_order_number",
          name: "淘宝订单编号"
        },
        {
          key: "task_staff_name",
          name: "派单员"
        },
        {
          key: "qr_order_id",
          name: "二维码ID"
        },
        {
          key: "task_commission",
          name: "任务奖金"
        },
        {
          key: "task_note",
          name: "额外要求"
        }
      ],
      formThead: [],
      chooseTableName: [],
      key: 0,
      tableLoading: false,
      hasRasult: false,
      // 下拉框数据缓存时间
      selSetTime: 60 * 2,
      staffList: [],
      pickerOptions: {
        disabledDate: time => {
          let curDate = new Date().getTime();
          // 这里算出一个月的毫秒数,这里使用30的平均值,实际中应根据具体的每个月有多少天计算
          let day = 31 * 24 * 3600 * 1000;
          let dateRegion = curDate - day;
          return time.getTime() > Date.now() || time.getTime() < dateRegion;
        }
      }
    };
  },
  created() {
    this.isCode =
      this.userInfoObj.rule.indexOf(this.CONFIG.ROLE_CODE) > 0 ? true : false;
    this.isHistoryAll =
      this.userInfoObj.rule.indexOf(this.CONFIG.ROLE_HISTORY_TASK_CODE) > 0
        ? true
        : false;
    this.init();
  },
  watch: {
    chooseTableName(valArr) {
      let _this = this;
      setTimeout(() => {
        _this.formThead = _this.tableName.filter(
          i => valArr.indexOf(i.key) >= 0
        );
        _this.key = _this.key + 1; // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
        _this.tableLoading = false;
      }, 1000);
    }
  },
  methods: {
    //预览图片
    previewImage(imgUrl, evemt) {
      if (!imgUrl) return;
      let loadStatus = event.currentTarget.getAttribute("lazy");
      if (loadStatus == "error") return;
      this.$refs.previewImage.open(imgUrl);
    },
    // 清空搜索
    resetSearchForm(formName) {
      this.effectTimeArr = [];
      this.acceptTimeArr = [];
      this.confirmTimeArr = [];
      this.searchForm.capital_end = null;
      this.$refs[formName].resetFields();
    },
    // 初始化
    init() {
      let chooseTableName = JSON.parse(
        localStorage.getItem("chooseTableNames")
      );
      this.chooseTableName = chooseTableName ? chooseTableName : [];
    },
    // 表格排序发送改变
    sortChange(v) {
      let _this = this;
      if (v.order) {
        let newSortUnit = "desc";
        if (v.order == "ascending") {
          newSortUnit = "asc";
        }
        this.searchForm.sort_field = v.prop;
        this.searchForm.sort_unit = newSortUnit;
        _this.getTaskList();
      }
    },
    // 判断表格表头是否显示
    tableHeadIsShow(key) {
      return this.tableName.filter(item => {
        return item.key == key;
      })[0].isShow;
    },
    // 得到显示表头数据
    getShowTableName(item) {
      let _this = this;
      _this.tableLoading = true;
      localStorage.setItem(
        "chooseTableNames",
        JSON.stringify(_this.chooseTableName)
      );
      setTimeout(() => {
        let newTableItem = [];
        let length = _this.tableName.length;
        for (let i = 0; i < length; i++) {
          newTableItem[i] = { ..._this.tableName[i] };
        }
        for (let i = 0; i < length; i++) {
          newTableItem[i].isShow = false;
          for (let j = 0; j < item.length; j++) {
            if (newTableItem[i].key == item[j]) {
              newTableItem[i].isShow = true;
            }
          }
        }
        _this.tableName = newTableItem;
      }, 100);
    },
    // 点击查询按钮
    search() {
      let _this = this;
      if (
        (!_this.effectTimeArr || _this.effectTimeArr.length == 0) &&
        (!_this.acceptTimeArr || _this.acceptTimeArr.length == 0)
      ) {
        return this.$message.warning("生效时间和接单时间不能同时为空！");
      }
      if (_this.effectTimeArr && _this.effectTimeArr.length == 2) {
        // // 判断生效时间段是否大于7天
        // if (_this.daysBetween(_this.effectTimeArr[0], _this.effectTimeArr[1]) > _this.CONFIG.TASK_LIST_TIME_INTERVAL) {
        //   return this.$message.warning(`生效时间查询范围不能超过${_this.CONFIG.TASK_LIST_TIME_INTERVAL}天`)
        // }
        // 判断生效结束时间是否大于今天
        if (!_this.judgeDate(_this.effectTimeArr[1])) {
          return this.$message.warning(
            `生效结束时间不能超过昨天的23:59:59，今天的任务在任务列表可查看`
          );
        }
      }
      if (_this.acceptTimeArr && _this.acceptTimeArr.length == 2) {
        if (!_this.judgeDate(_this.acceptTimeArr[1])) {
          return this.$message.warning(
            `接单结束时间不能超过昨天的23:59:59，今天的任务在任务列表可查看`
          );
        }
      }
      _this.currentPage = 1;
      _this.pageSize = _this.PAGE_SIZE;
      _this.getTaskList();
    },
    // 修改每页显示多少条
    handleSizeChange(val) {
      let _this = this;
      _this.pageSize = val;
      this.currentPage = 1;
      _this.getTaskList();
    },
    // 分页跳转
    handleCurrentChange(val) {
      let _this = this;
      _this.currentPage = val;
      _this.getTaskList();
    },
    // 根据状态获取任务数据
    getStatusData(arr, statusArr) {
      let params = [];
      for (let i = 0; i < arr.length; i++) {
        if (statusArr.indexOf(arr[i].status) > -1) {
          params.push(arr[i]);
        }
      }
      return params;
    },
    // 查看选中项任务各状态的数据
    countTaskByStatus(sel) {
      let statisticsData = [0, 0, 0, 0, 0];
      let _this = this;
      statisticsData[0] = sel.length;
      for (let i = 0; i < sel.length; i++) {
        // 获取任务统计数据
        switch (sel[i].status) {
          case _this.CONFIG.ORDER_STATUS_WAIT_ACCEPT:
            statisticsData[1] = statisticsData[1] + 1;
            break;
          case _this.CONFIG.ORDER_STATUS_WAIT_DOING:
            statisticsData[2] = statisticsData[2] + 1;
            break;
          case _this.CONFIG.ORDER_STATUS_WAITING_AUDIT:
            statisticsData[3] = statisticsData[3] + 1;
            break;
          case _this.CONFIG.ORDER_STATUS_DONE:
            statisticsData[4] = statisticsData[4] + 1;
            break;
        }
      }
      _this.statisticsData = [...statisticsData];
    },
    // 得到任务列表 - 接口
    async getTaskList(searchInfo) {
      let _this = this;
      let params = null;
      let data = null;
      if (searchInfo) {
        params = { ...searchInfo };
      } else {
        _this.searchForm.start_time =
          _this.acceptTimeArr && _this.acceptTimeArr.length == 2
            ? _this.acceptTimeArr[0]
            : null;
        _this.searchForm.end_time =
          _this.acceptTimeArr && _this.acceptTimeArr.length == 2
            ? _this.acceptTimeArr[1]
            : null;
        _this.searchForm.effect_start =
          _this.effectTimeArr && _this.effectTimeArr.length == 2
            ? _this.effectTimeArr[0]
            : null;
        _this.searchForm.effect_end =
          _this.effectTimeArr && _this.effectTimeArr.length == 2
            ? _this.effectTimeArr[1]
            : null;
        _this.searchForm.confirm_start =
          _this.confirmTimeArr && _this.confirmTimeArr.length > 0
            ? _this.confirmTimeArr[0]
            : null;
        _this.searchForm.confirm_end =
          _this.confirmTimeArr && _this.confirmTimeArr.length > 0
            ? _this.confirmTimeArr[1]
            : null;
        params = {
          ..._this.searchForm,
          ...{ page: _this.currentPage, page_size: _this.pageSize }
        };
      }
      // 缓存查询信息
      // _this.zyLocalStorage.set("taskList", JSON.stringify(params), _this.taskOverdueTime)
      _this.tableData = [];
      _this.hasRasult = false;
      if (_this.isHistoryAll) {
        data = await getAllHistoryTaskListHandler(params);
      } else {
        data = await getHistoryTaskListHandler(params);
      }
      _this.hasRasult = true;
      if (data.code == _this.CONFIG.CODE_PAGE_END)
        return (_this.noDataTitle = "暂无数据");
      if (data.code !== _this.CONFIG.CODE_SUCCESS)
        return _this.$message.warning(data.msg);
      _this.totalPage = data.result.count_all;
      _this.tableData = data.result.task_list;
      _this.tableData.map(item => {
        item.qr_order_id = item.qr_order_id
          ? _this.encodeId(item.qr_order_id)
          : "";
      });
    },
    // 获取关键词筛选列表-接口
    async getKeywordList() {
      let _this = this;
      if (_this.keyArr.length) {
        return false;
      }
      // 查看缓存中是否要keyArr
      let params = _this.zyLocalStorage.get("keyArr");
      if (params) {
        _this.keyArr = [...params];
      } else {
        let data = await getKeywordListHandler();
        if (data.code === _this.CONFIG.CODE_PAGE_END) return false;
        if (data.code !== _this.CONFIG.CODE_SUCCESS)
          return _this.$message.warning(data.msg);
        _this.keyArr = data.result.list;
        _this.zyLocalStorage.set("keyArr", _this.keyArr, _this.selSetTime);
      }
    },

    // 获取所在设备列表接口
    async getSelectList(visible) {
      if (!visible) return false;
      let _this = this;
      if (_this.deviceArr.length) return false;
      // 查看缓存中是否要shopArr
      let params = _this.zyLocalStorage.get("deviceArr");
      if (params) {
        _this.deviceArr = [...params];
      } else {
        let data = null;
        if (
          _this.isCode ||
          _this.userInfoObj.is_admin == _this.CONFIG.ROLE_ADMIN
        ) {
          data = await getSelectListHandler(params);
        } else {
          data = await getMySelectListHandler(params);
        }
        if (data.code === _this.CONFIG.CODE_PAGE_END) return false;
        if (data.code !== _this.CONFIG.CODE_SUCCESS)
          return _this.$message.warning(data.msg);
        _this.deviceArr =
          data.result && data.result.length > 0 ? data.result : [];
        _this.zyLocalStorage.set(
          "deviceArr",
          _this.deviceArr,
          _this.selSetTime
        );
      }
    },
    // 获取分配员列表
    async getStaffList(visible) {
      if (!visible) return false;
      let data = await getStaffListHandler();
      this.staffList = [];
      if (data.code === this.CONFIG.CODE_PAGE_END) return false;
      if (data.code !== this.CONFIG.CODE_SUCCESS)
        return this.$message.warning(data.msg);
      this.staffList = data.result.list;
    },
    // 获取店铺筛选列表-接口
    async getShopList(visible) {
      if (!visible) return false;
      let _this = this;
      _this.shopArr = [];
      _this.shopArrOld = [];
      let data = await getShopListHandler();
      if (data.code === _this.CONFIG.CODE_PAGE_END) return false;
      if (data.code !== _this.CONFIG.CODE_SUCCESS)
        return _this.$message.warning(data.msg);
      _this.shopArr = data.result.list;
      _this.shopArrOld = data.result.list;
      // if (_this.shopArr.length) {
      //   return false
      // }
      // // 查看缓存中是否要shopArr
      // let params = _this.zyLocalStorage.get("shopArr")
      // if (params) {
      //   _this.shopArr = [...params]
      // } else {
      //   let data = await getShopListHandler()
      //   if (data.code === _this.CONFIG.CODE_PAGE_END) return false
      //   if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      //   _this.shopArr = data.result.list
      //   _this.zyLocalStorage.set("shopArr", _this.shopArr, _this.selSetTime)
      // }
    },
    //搜索店铺
    async getSearchShopList() {
      let _this = this;
      if (!_this.searchData) return false;
      let data = await getSearchHistoryShopListHandler({
        shop_name: _this.searchData
      });
      // let data = await getSearchShopListHandler({ shop_name: _this.searchData })
      _this.shopArr = [];
      if (data.code === _this.CONFIG.CODE_PAGE_END) {
        if (!_this.searchData) {
          _this.shopArr = _this.shopArrOld;
        }
        return false;
      }
      if (data.code !== _this.CONFIG.CODE_SUCCESS)
        return _this.$message.warning(data.msg);
      _this.shopArr = data.result.list;
    },
    // 结束搜索店铺数据
    searchShopEnd() {
      clearTimeout(this.searchTimer);
    },
    // 获取用户输入搜索店铺数据
    searchShopValue(val) {
      let _this = this;
      if (!val) {
        _this.shopArr = _this.shopArrOld;
        _this.searchData = val;
        clearTimeout(this.searchTimer);
        return;
      }
      val = val.replace(/^\s*|\s*$/g, "");
      if (val == this.searchData) return false;
      _this.searchData = val;
      _this.searchTimer = setTimeout(() => {
        _this.getSearchShopList();
      }, 0);
    },

    // 获取微信筛选列表-接口
    async getWechatList() {
      let _this = this;
      if (_this.wechatArr.length) {
        return false;
      }
      // 查看缓存中是否要wechatArr
      let params = _this.zyLocalStorage.get("wechatArr");
      if (params) {
        _this.wechatArr = [...params];
      } else {
        let data = await getWechatListHandler();
        if (data.code === _this.CONFIG.CODE_PAGE_END) return false;
        if (data.code !== _this.CONFIG.CODE_SUCCESS)
          return _this.$message.warning(data.msg);
        _this.wechatArr = data.result.list;
        _this.zyLocalStorage.set(
          "wechatArr",
          _this.wechatArr,
          _this.selSetTime
        );
      }
    },
    // 获取派单员下拉列表
    async getDispatchSelect() {
      let _this = this;
      if (_this.taskStaffArr.length) return false;
      // 查看缓存中是否有派单员下拉列表
      let params = _this.zyLocalStorage.get("taskStaffArr");
      if (params) {
        _this.taskStaffArr = [...params];
      } else {
        let data = await getDispatchSelectHandler();
        if (data.code === _this.CONFIG.CODE_PAGE_END) return false;
        if (data.code !== _this.CONFIG.CODE_SUCCESS)
          return _this.$message.warning(data.msg);
        _this.taskStaffArr = data.result;
        _this.zyLocalStorage.set(
          "taskStaffArr",
          _this.taskStaffArr,
          _this.selSetTime
        );
      }
    },
    //导出数据
    exportList() {
      let _this = this;
      if (
        (!_this.effectTimeArr || _this.effectTimeArr.length == 0) &&
        (!_this.acceptTimeArr || _this.acceptTimeArr.length == 0)
      ) {
        return this.$message.warning("生效时间和接单时间不能同时为空！");
      }
      // 判断生效时间段是否大于15天
      if (_this.effectTimeArr && _this.effectTimeArr.length == 2) {
        if (
          _this.daysBetween(_this.effectTimeArr[0], _this.effectTimeArr[1]) >
          _this.CONFIG.TASK_HISTORY_EXPORT_LIMIT
        ) {
          return this.$message.warning(
            `任务导出的时间范围不能超过${_this.CONFIG.TASK_HISTORY_EXPORT_LIMIT}天`
          );
        }
      }
      if (_this.acceptTimeArr && _this.acceptTimeArr.length == 2) {
        if (
          _this.daysBetween(_this.acceptTimeArr[0], _this.acceptTimeArr[1]) >
          _this.CONFIG.TASK_HISTORY_EXPORT_LIMIT
        ) {
          return this.$message.warning(
            `任务导出的时间范围不能超过${_this.CONFIG.TASK_HISTORY_EXPORT_LIMIT}天`
          );
        }
      }
      _this.searchForm.start_time =
        _this.acceptTimeArr && _this.acceptTimeArr.length == 2
          ? _this.acceptTimeArr[0]
          : null;
      _this.searchForm.end_time =
        _this.acceptTimeArr && _this.acceptTimeArr.length == 2
          ? _this.acceptTimeArr[1]
          : null;
      _this.searchForm.effect_start =
        _this.effectTimeArr && _this.effectTimeArr.length == 2
          ? _this.effectTimeArr[0]
          : null;
      _this.searchForm.effect_end =
        _this.effectTimeArr && _this.effectTimeArr.length == 2
          ? _this.effectTimeArr[1]
          : null;
      _this.searchForm.confirm_start =
        _this.confirmTimeArr && _this.confirmTimeArr.length > 0
          ? _this.confirmTimeArr[0]
          : null;
      _this.searchForm.confirm_end =
        _this.confirmTimeArr && _this.confirmTimeArr.length > 0
          ? _this.confirmTimeArr[1]
          : null;
      let params = { ..._this.searchForm };
      params.export_type = _this.CONFIG.TASK_EXPORT_HISTORY;
      this.$refs.exportFile.deviceArr = [...this.deviceArr];
      this.$refs.exportFile.exportList(params);
    },
    // 跳转到文件下载列表
    jumpRouter() {
      this.$router.push(
        { path: "/tasksManagement/download" },
        onComplete => {},
        onAbort => {}
      );
    },
    // 获取展示缩略图文件
    getImgUrl(type, obj) {
      let setTime = Date.parse(new Date("2020-04-27")); // 缩略图功能生效时间
      if (type == "bankInfo") {
        if (!obj.buyer_collection_qr) return "-";
        let dateSlots = obj.buyer_collection_qr.split("/");
        let dateStr = `${dateSlots[2]}-${dateSlots[3]}-${dateSlots[4]}`;
        let uploadTime = Date.parse(new Date(dateStr));
        let picUrl =
          setTime > uploadTime
            ? `${obj.cdn_url}${obj.buyer_collection_qr}`
            : `${obj.cdn_url}${this.THUMBNAIL_URL}${obj.buyer_collection_qr}`;
        return picUrl;
      } else {
        if (obj.item_pic == "http://cdn.txbbcrm.com/gg/txbb.jpg")
          return obj.item_pic;
        if (obj.item_pic.indexOf(this.CDN_UP_URL) < 0) return obj.item_pic;
        let dateSlots = obj.item_pic.split("/");
        let dateStr = `${dateSlots[4]}-${dateSlots[5]}-${dateSlots[6]}`;
        let uploadTime = Date.parse(new Date(dateStr));
        if (setTime > uploadTime) return obj.item_pic;
        let index = obj.item_pic.lastIndexOf("/uploads");
        let strUrl = obj.item_pic.substring(index + 1, obj.item_pic.length);
        return `${this.CDN_UP_URL}${this.THUMBNAIL_URL}/${strUrl}`;
      }
    }
  }
};
</script>

<style lang="scss" scope>
.task-fp {
  line-height: 40px;
}
.task-qr {
  line-height: 20px;
}
#qr-box {
  img {
    margin: 0 auto;
  }
}
.single-price {
  margin-left: 15px;
}
.count-task-num {
  font-size: 13px;
}
</style>
