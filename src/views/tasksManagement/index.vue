<template>
  <div class="code-content">
    <el-row>
      <el-form :inline="true" size="small" :model="searchForm" ref="searchForm">
        <el-form-item label="生效时间">
          <el-date-picker
            v-model="effectTimeArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="接单时间">
          <el-date-picker
            v-model="acceptTimeArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="返款时间">
          <el-date-picker
            v-model="confirmTimeArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
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
              clearable
              type="number"
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
            clearable
            type="number"
            placeholder="请输入手机号"
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
          <div>
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
              <!-- <el-option label="全部" value=""></el-option> -->
              <el-option
                v-for="(v, index) in shopArr"
                :key="index"
                :label="v"
                :value="v"
              >
              </el-option>
            </el-select>
          </div>
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
            placeholder="请输入商品ID"
            clearable
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
        <el-form-item label="任务类型" props="task_type" v-if="industry_status != CONFIG.INDUSTRY_STATUS_CLOSE">
          <el-select
          v-model="searchForm.task_type"
          multiple
          clearable
          collapse-tags
          placeholder="请选择">
          <el-option
              :label="val"
              v-for="(val, key) in CONFIG.TASK_TYPE()"
              :value="key"
              :key="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态" prop="status" v-if="industry_status == CONFIG.INDUSTRY_STATUS_CLOSE">
          <el-select
            v-model="searchForm.status"
            multiple
            clearable
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              :label="val"
              v-for="(val, key) in CONFIG.ORDER_STATUS()"
              :value="key"
              :key="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态" prop="status" v-else>
          <el-select
            v-model="searchForm.status"
            multiple
            clearable
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              :label="val"
              v-for="(val, key) in CONFIG.ORDER_STATUS_TOMMORRO()"
              :value="key"
              :key="key"
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
            v-has="41001"
            class="form-btn__defalut"
            type="primary"
            @click="search"
            round
            icon="el-icon-search"
            >查询</el-button
          >
          <span v-has="41008" @click="exportList">
            <export-file ref="exportFile"></export-file>
          </span>
          <el-button type="success" v-has="43000" @click="jumpRouter" round
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" fixed> </el-table-column>
          <el-table-column prop="task_type" label="任务类型" fixed v-if="industry_status != CONFIG.INDUSTRY_STATUS_CLOSE">
            <template slot-scope="scope">
              <p>{{CONFIG.TASK_TYPE(scope.row.task_type)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="任务ID" fixed width="120">
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
          <el-table-column prop="item_pic" label="宝贝图片" width="210">
            <template slot-scope="scope">
              <div class="pic-box">
                <img
                  v-if="scope.row.item_pic"
                  v-lazy="getImgUrl('goods', scope.row)"
                  style="width:100px;height:100px"
                  @click="previewImage(scope.row.item_pic, $event)"
                />
                <span v-else>-</span>
                <el-button
                  type="warning"
                  plain
                  v-has="41014"
                  style="border-radius:14px; margin-left:10px"
                  size="mini"
                  @click="cloneTask(scope.row)"
                  >克隆任务</el-button
                >
              </div>
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
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.isEdit">
                  <el-input
                    style="width:130px;"
                    v-model="singlePrice"
                    size="mini"
                    type="number"
                  ></el-input>
                  <br />
                  <br />
                  <el-button
                    size="mini"
                    @click="alterTaskCommission"
                    type="primary"
                    >保存</el-button
                  >
                  <el-button
                    size="mini"
                    @click="cancelSinglePrice(scope.$index, scope.row)"
                    >取消</el-button
                  >
                </div>
                <div v-else>
                  <p>
                    {{ scope.row.single_task_price }}
                    <el-link
                      v-has="41007"
                      v-if="
                        [
                          CONFIG.ORDER_STATUS_NOT_ALLOT,
                          CONFIG.ORDER_STATUS_ALLOTED,
                          CONFIG.ORDER_STATUS_WAIT_ACCEPT,
                          CONFIG.ORDER_STATUS_WAIT_DOING
                        ].indexOf(scope.row.status) > -1
                      "
                      @click="editorSinglePrice(scope.$index, scope.row)"
                      class="single-price"
                      :underline="false"
                      icon="el-icon-edit"
                    ></el-link>
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="task_commission" label="额外奖励" v-if="industry_status != CONFIG.INDUSTRY_STATUS_CLOSE">
            <template slot-scope="scope">
              {{scope.row.task_type == CONFIG.INDUSTRY_STATUS_CLOSE ? '-' : scope.row.buyer_award_price}}
            </template>
          </el-table-column>
          <el-table-column prop="sum" label="总金额">
            <template slot-scope="scope">
              <span
                v-if="
                  isRealNum(scope.row.task_commission) &&
                    isRealNum(scope.row.single_task_price)
                "
              >
                {{ scope.row.real_task_price }}
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
                  <br />
                  <br />
                  <el-button
                    size="mini"
                    @click="updateTaskPayNote"
                    type="primary"
                    >保存</el-button
                  >
                  <el-button
                    size="mini"
                    @click="cancelPayNote(scope.$index, scope.row)"
                    >取消</el-button
                  >
                </div>
                <div v-else>
                  <p>
                    {{ scope.row.pay_note }}
                    <el-link
                      v-has="41009"
                      v-if="
                        [CONFIG.ORDER_STATUS_DONE].indexOf(scope.row.status) >
                          -1
                      "
                      @click="editorPayNote(scope.$index, scope.row)"
                      class="single-price"
                      :underline="false"
                      icon="el-icon-edit"
                    ></el-link>
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="reject_reason" label="问题反馈">
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <div
                v-if="
                  scope.row.status == CONFIG.ORDER_STATUS_WAIT_DOING ||
                    scope.row.status == CONFIG.ORDER_STATUS_WAITING_AUDIT ||
                    scope.row.status == CONFIG.ORDER_STATUS_ADD_SHOPPING_CARD_WAIT ||
                    scope.row.status == CONFIG.ORDER_STATUS_ADD_SHOPPING_CARD_DONE
                "
              >
                <div v-has="41011">
                  <el-dropdown @command="showQuestion" trigger="click">
                    <el-button
                      @click="returnQuestion(scope.row)"
                      type="warning"
                      size="mini"
                      round
                    >
                      问题反馈
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="'没下单'"
                        >没下单</el-dropdown-item
                      >
                      <el-dropdown-item :command="'收款码异常'"
                        >收款码异常</el-dropdown-item
                      >
                      <el-dropdown-item :command="'拍错链接'"
                        >拍错链接</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>

                <span
                  v-if="scope.row.status == CONFIG.ORDER_STATUS_WAITING_AUDIT"
                >
                  <el-button
                    type="success"
                    size="mini"
                    round
                    v-has="41006"
                    @click="passOne(scope.row)"
                    >确认返款</el-button
                  >
                  <br />
                  <el-button
                    type="danger"
                    size="mini"
                    round
                    v-has="41010"
                    @click="refusedOne(scope.row)"
                    >审核失败</el-button
                  >
                </span>
              </div>

              <span
                v-if="
                  [
                    CONFIG.ORDER_STATUS_NOT_ALLOT,
                    CONFIG.ORDER_STATUS_ALLOTED,
                    CONFIG.ORDER_STATUS_WAIT_ACCEPT,
                    CONFIG.ORDER_STATUS_WAIT_DOING,
                    CONFIG.ORDER_STATUS_WAITING_AUDIT,
                    CONFIG.ORDER_STATUS_ADD_SHOPPING_CARD_DONE,
                    CONFIG.ORDER_STATUS_WAIT_ADD
                  ].indexOf(scope.row.status) > -1
                "
              >
                <el-button
                  type="info"
                  size="mini"
                  round
                  v-has="41012"
                  @click="taskEditor(scope.row)"
                  >编辑</el-button
                >
              </span>

              <span v-if="scope.row.status == CONFIG.ORDER_STATUS_TIME_OUT"
                ><el-button
                  type="primary"
                  size="mini"
                  round
                  v-has="41013"
                  @click="recoverTask(scope.row.id)"
                  >恢复任务</el-button
                >
              </span>
              <span
                v-if="
                  [
                    CONFIG.ORDER_STATUS_NOT_ALLOT,
                    CONFIG.ORDER_STATUS_ALLOTED,
                    CONFIG.ORDER_STATUS_WAIT_ACCEPT,
                    CONFIG.ORDER_STATUS_WAIT_DOING,
                    CONFIG.ORDER_STATUS_TIME_OUT,
                    CONFIG.ORDER_STATUS_ADD_SHOPPING_CARD_DONE,
                    CONFIG.ORDER_STATUS_WAIT_ADD
                  ].indexOf(scope.row.status) > -1
                "
                ><el-button
                  type="danger"
                  size="mini"
                  round
                  v-has="41015"
                  @click="failureTask(scope.row)"
                  >失效任务</el-button
                >
              </span>
            </template>
          </el-table-column>
        </el-table>
        <br />
        <div>
          <br />
          <p class="count-task-num" v-if="statisticsData.length">
            <span>共 {{ totalPage }}单</span>&nbsp;，
            <span :key="index" v-for="(item, index) in statisticsData"
              >{{ item.name }}{{ item.num }}单
              <i v-if="index != statisticsData.length - 1">，</i>
            </span>
          </p>
        </div>
        <br />
        <div class="block">
          <el-row>
            <el-col :span="12" class="flex-bottom">
              <el-checkbox
                label="全选"
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="toggleSelection"
              ></el-checkbox>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="sizeArr"
                :page-size="pageSize"
                layout="sizes, prev, pager, next, jumper"
                :total="totalPage"
              >
              </el-pagination>
            </el-col>
            <el-col :span="12" class="ta-r">
              <el-button
                v-has="41006"
                type="success"
                size="mini"
                round
                @click="
                  operationTasks(
                    [CONFIG.ORDER_STATUS_WAITING_AUDIT],
                    CONFIG.TASK_FANKUAN
                  )
                "
                >批量确认返款</el-button
              >
              <el-button
                v-has="41002"
                type="primary"
                size="mini"
                round
                @click="
                  operationTasks(
                    [CONFIG.ORDER_STATUS_NOT_ALLOT],
                    CONFIG.TASK_FENPEI
                  )
                "
                >分配任务</el-button
              >
              <el-button
                type="warning"
                size="mini"
                round
                v-has="41003"
                @click="
                  operationTasks(
                    [CONFIG.ORDER_STATUS_ALLOTED],
                    CONFIG.TASK_CHEHUI
                  )
                "
                >撤回分配</el-button
              >

              <el-button
                type="info"
                size="mini"
                v-has="41004"
                round
                @click="
                  operationTasks(
                    [CONFIG.ORDER_STATUS_ALLOTED],
                    CONFIG.TASK_SHENGCHENG
                  )
                "
                >生成二维码</el-button
              >
              <el-button
                v-has="41013"
                size="mini"
                type="warning"
                round
                @click="
                  operationTasks(
                    [CONFIG.ORDER_STATUS_TIME_OUT],
                    CONFIG.TASK_RENEW
                  )
                "
                >批量恢复任务</el-button
              >
              <el-button
                v-has="41015"
                size="mini"
                type="danger"
                round
                @click="
                  operationTasks(
                    [
                      CONFIG.ORDER_STATUS_NOT_ALLOT,
                      CONFIG.ORDER_STATUS_ALLOTED,
                      CONFIG.ORDER_STATUS_WAIT_ACCEPT,
                      CONFIG.ORDER_STATUS_WAIT_DOING,
                      CONFIG.ORDER_STATUS_TIME_OUT
                    ],
                    CONFIG.TASK_FAILURE
                  )
                "
                >批量失效任务</el-button
              >
            </el-col>
          </el-row>
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
    <tasks-dialog ref="tasksDialog" @reloadData="delayUpdate"></tasks-dialog>
    <preview-image ref="previewImage"></preview-image>
  </div>
</template>

<script>
import { getSearchShopListHandler, getTaskListHandler, getSelfTaskListHandler, cancelTaskHandler, unAllotTasksHandler, taskOperationHandler, removeTaskHandler, getKeywordListHandler, getStaffListHandler, getShopListHandler, getWechatListHandler, alterTaskCommissionHandler, feedbackHandler, updateTaskPayNoteHandler, recoverTaskHandler } from '@/api/taskManage'
import { getSelectListHandler, getMySelectListHandler } from '@/api/deviceManagement'
import TasksDialog from './components/tasksDialog'
import ExportFile from './components/exportFile'

import PreviewImage from '@/components/PreviewImage'
export default {
  components: { TasksDialog, ExportFile, PreviewImage },
  data () {
    return {
      industry_status: localStorage.getItem('gg_industry_status'),
      noDataTitle: '',
      // 用户信息
      userInfoObj: this.$store.state.userInfo,
      // 修改商品金额
      singlePrice: '',
      //任务id
      taskId: '',
      // 时间选择
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            let date = new Date()
            let nowDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            picker.$emit('pick', [
              (nowDate + ' ' + '00:00:00'), (nowDate + ' ' + '23:59:59')
            ])
          }
        }, {
          text: '明天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            let nowDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            picker.$emit('pick', [
              (nowDate + ' ' + '00:00:00'), (nowDate + ' ' + '23:59:59')
            ])
          }
        },
        {
          text: '最近一小时',
          onClick (picker) {
            let date = new Date()
            let nows = date.getHours()
            let starthour = (nows > 9) ? nows + ":00:00" : "0" + nows + ":00:00"
            let endhour = (nows > 9) ? nows + ":59:59" : "0" + nows + ":59:59"
            let nowDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            picker.$emit('pick', [
              (nowDate + ' ' + starthour), (nowDate + ' ' + endhour)
            ])
          }
        },
        {
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }],
        // disabledDate: (time) => {
        //   return time.getTime() < Date.now() - 8.64e7
        // }
      },
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
        task_type: null,
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
        qr_order_id: null,
        sort_field: null,
        sort_unit: null
      },
      timmer: null,
      overtime: 0,
      hasRasult: false,
      // 下拉匹配数据
      wechatArr: [],
      shopArr: [],
      shopArrOld: [],
      keyArr: [],
      deviceArr: [],
      questionTask: {},
      // 选中任务数据
      statisticsData: [],
      // 表头是否展示数据
      tableName: [
        {
          key: 'task_method_details',
          name: "关键词",
        },
        {
          key: 'gmt_taking_task',
          name: "接单时间",
        },
        {
          key: 'gmt_confirm_task',
          name: "返款时间",
        },
        {
          key: 'buyer_phone',
          name: "接单手机",
        },
        {
          key: 'device_name',
          name: "所在设备",
        },
        {
          key: 'task_staff_name',
          name: "派单员",
        },
        {
          key: 'task_commission',
          name: "任务奖金",
        },
        {
          key: 'qr_order_id',
          name: "二维码ID",
        },
        {
          key: 'tb_order_number',
          name: "淘宝订单编号",
        },
        {
          key: 'task_note',
          name: "额外要求",
        }
      ],
      formThead: [],
      chooseTableName: [],
      key: 0,
      tableLoading: false,
      // 下拉框数据缓存时间
      selSetTime: 60 * 2,
      // 返款备注
      pay_note: null,
      //是否有分配任务权限code
      isCode: false,
      //是否全选
      isIndeterminate: false,
      checkAll: false,
      //派单员列表
      staffList: [],
      searchData: '',
      searchTimer: null
    }
  },
  mounted () {
    this.isCode = (this.userInfoObj.rule.indexOf(this.CONFIG.ROLE_CODE) > 0) ? true : false
    this.init()
  },
  watch: {
    chooseTableName (valArr) {
      let _this = this
      setTimeout(() => {
        _this.formThead = _this.tableName.filter(i => valArr.indexOf(i.key) >= 0)
        _this.key = _this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
        _this.tableLoading = false
      }, 1000)
    }
  },
  methods: {
    //预览图片
    previewImage (imgUrl, evemt) {
      if (!imgUrl) return
      let loadStatus = event.currentTarget.getAttribute('lazy')
      if (loadStatus == 'error') return
      this.$refs.previewImage.open(imgUrl)
    },
    exportList () {
      let _this = this
      _this.searchForm.start_time = (_this.acceptTimeArr && _this.acceptTimeArr.length > 0) ? _this.acceptTimeArr[0] : null
      _this.searchForm.end_time = (_this.acceptTimeArr && _this.acceptTimeArr.length > 0) ? _this.acceptTimeArr[1] : null
      _this.searchForm.effect_start = (_this.effectTimeArr && _this.effectTimeArr.length > 0) ? _this.effectTimeArr[0] : null
      _this.searchForm.effect_end = (_this.effectTimeArr && _this.effectTimeArr.length > 0) ? _this.effectTimeArr[1] : null
      _this.searchForm.confirm_start = (_this.confirmTimeArr && _this.confirmTimeArr.length > 0) ? _this.confirmTimeArr[0] : null
      _this.searchForm.confirm_end = (_this.confirmTimeArr && _this.confirmTimeArr.length > 0) ? _this.confirmTimeArr[1] : null
      let params = { ..._this.searchForm }
      this.$refs.exportFile.deviceArr = [...this.deviceArr]
      this.$refs.exportFile.exportList(params)
    },
    // 清空搜索
    resetSearchForm (formName) {
      this.effectTimeArr = []
      this.acceptTimeArr = []
      this.confirmTimeArr = []
      this.searchForm.capital_end = null
      this.$refs[formName].resetFields()
      this.search()
    },
    // 判断表格表头是否显示
    tableHeadIsShow (key) {
      return this.tableName.filter((item) => { return item.key == key })[0].isShow
    },
    // 得到显示表头数据
    getShowTableName (item) {
      let _this = this
      _this.tableLoading = true
      localStorage.setItem("chooseTableName", JSON.stringify(_this.chooseTableName))
      setTimeout(() => {
        let newTableItem = []
        let length = _this.tableName.length
        for (let i = 0; i < length; i++) {
          newTableItem[i] = { ..._this.tableName[i] }
        }
        for (let i = 0; i < length; i++) {
          newTableItem[i].isShow = false
          for (let j = 0; j < item.length; j++) {
            if (newTableItem[i].key == item[j]) {
              newTableItem[i].isShow = true
            }
          }
        }
        _this.tableName = newTableItem
      }, 100)
    },
    // 初始化表格数据
    async init () {
      let _this = this
      // 任务二维码页面跳转
      if (_this.$route.params.qr_order_id) {
        _this.searchForm.qr_order_id = _this.$route.params.qr_order_id
      }
      _this.isIndeterminate = false
      _this.checkAll = false
      let statisticsData = [
        {
          name: '未分配',
          type: _this.CONFIG.ORDER_STATUS_NOT_ALLOT,
          num: 0,
        },
        {
          name: '已分配',
          type: _this.CONFIG.ORDER_STATUS_ALLOTED,
          num: 0,
        },
        {
          name: '待接单',
          type: _this.CONFIG.ORDER_STATUS_WAIT_ACCEPT,
          num: 0,
        },
        {
          name: '待操作',
          type: _this.CONFIG.ORDER_STATUS_WAIT_DOING,
          num: 0,
        },
        {
          name: '已超时',
          type: _this.CONFIG.ORDER_STATUS_TIME_OUT,
          num: 0,
        },
        {
          name: '待审核',
          type: _this.CONFIG.ORDER_STATUS_WAITING_AUDIT,
          num: 0,
        }, {
          name: '已完成',
          type: _this.CONFIG.ORDER_STATUS_DONE,
          num: 0,
        }
        , {
          name: '审核失败',
          type: _this.CONFIG.ORDER_STATUS_FAIL,
          num: 0,
        },
        {
          name: '已失效',
          type: _this.CONFIG.ORDER_STATUS_CANCEL,
          num: 0,
        }
      ]
      _this.statisticsData = [...statisticsData]
      let chooseTableName = JSON.parse(localStorage.getItem("chooseTableName"))
      _this.chooseTableName = chooseTableName ? chooseTableName : []
      _this.getTaskList()
    },
    // 点击查询按钮
    search () {
      let _this = this
      _this.currentPage = 1
      _this.pageSize = _this.PAGE_SIZE
      _this.getTaskList()
    },
    // 修改每页显示多少条
    handleSizeChange (val) {
      let _this = this
      _this.pageSize = val
      this.currentPage = 1
      _this.getTaskList()
    },
    // 分页跳转
    handleCurrentChange (val) {
      let _this = this
      _this.currentPage = val
      _this.getTaskList()
    },
    // 问题反馈
    returnQuestion (row) {
      this.questionTask = {}
      this.questionTask = { ...row }
    },
    // 问题反馈
    showQuestion (command) {
      let id = this.questionTask.id
      this.$confirm(`您反馈的问题是：${command}`, '问题反馈', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          task_id: this.encodeId(id),
          reject_reason: command
        }
        const data = await feedbackHandler(params)
        if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
        this.$message.success(data.msg)
        // this.getTaskList()
        this.delayUpdate()
      })
    },
    // 根据状态获取任务数据
    getStatusData (arr, statusArr) {
      let params = []
      for (let i = 0; i < arr.length; i++) {
        if (statusArr.indexOf(arr[i].status) > -1) {
          params.push(arr[i])
        }
      }
      return params
    },
    // 选择发生改变
    handleSelectionChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.tableData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
    },
    //全选
    toggleSelection (val) {
      if (val) {
        this.tableData.forEach(row => {
          this.$refs.tableData.toggleAllSelection(row)
          this.isIndeterminate = true
        })
      } else {
        this.$refs.tableData.clearSelection()
        this.isIndeterminate = false
      }
    },
    // 单个审核失败
    refusedOne (row) {
      let _this = this
      let param = [
        {
          task_id: _this.encodeId(row.id),
          status: row.status
        }
      ]
      _this.$confirm(`是否确认审核失败该任务`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.taskOperation({ task_arr: JSON.stringify(param) })
      })
    },
    // 单个审核通过
    passOne (row) {
      this.$refs.tasksDialog.passOne(row)
    },
    // 操作任务
    operationTasks (status, methodType) {
      let _this = this
      let selData = _this.$refs.tableData.selection
      if (selData.length == 0) return _this.$message.warning('暂未选中任务！')
      let statusData = _this.getStatusData(selData, status)
      if (statusData.length == 0) return _this.$message.warning('选中项中暂无可以操作的任务！')
      let params = []
      let taskIdArr = []
      for (let i = 0; i < statusData.length; i++) {
        params.push({
          task_id: _this.encodeId(statusData[i].id),
          status: statusData[i].status
        })
        taskIdArr.push(_this.encodeId(statusData[i].id))
      }
      // 审核通过确认返款
      if (methodType == _this.CONFIG.TASK_FANKUAN) {
        this.$refs.tasksDialog.passAll(statusData, params)
      } else if (methodType == _this.CONFIG.TASK_FENPEI) {
        // 分配任务
        _this.$refs.tasksDialog.selAssignedTasksData = params
        _this.$refs.tasksDialog.assignedTasksVisible = true
      } else if (methodType == _this.CONFIG.TASK_CHEHUI) {
        // 撤销分配
        _this.$confirm(`选中的任务中，有${statusData.length}个任务可撤回分配，是否确认？`, '任务撤回分配', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.unAllotTasks({ task_arr: JSON.stringify(params) })
        })
      } else if (methodType == _this.CONFIG.TASK_SHENGCHENG) {
        // 生成二维码
        let qrParams = []
        for (let i = 0; i < statusData.length; i++) {
          qrParams.push(_this.encodeId(statusData[i].id))
        }
        this.$refs.tasksDialog.createQrData = qrParams
        _this.$refs.tasksDialog.createQrVisible = true
      } else if (methodType == _this.CONFIG.TASK_SHANCHU) {
        _this.$confirm(`是否确认删除该任务`, '删除任务', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.removeTask({ task_arr: JSON.stringify(params) })
        })
      } else if (methodType == _this.CONFIG.TASK_RENEW) {
        _this.$confirm(`选中的任务中，有${statusData.length}个任务可恢复，<br/>是否确认恢复任务,恢复后重新计算做单倒计时`, '批量恢复任务', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          let param = { task_ids: JSON.stringify(taskIdArr) }
          _this.recoverTaskSubmit(param)
        })
      } else if (methodType == _this.CONFIG.TASK_FAILURE) {
        _this.$confirm(`选中的任务中，有${statusData.length}个任务可失效，<br/>任务失效后将不能进行任何操作，请谨慎使用失效任务的功能，是否继续?`, '批量失效任务', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          let param = { task_ids: JSON.stringify(taskIdArr) }
          _this.cancelTask(param)
        })
      }
    },
    // 查看选中项任务各状态的数据
    countTaskByStatus (sel) {
      let statisticsData = [0, 0, 0, 0, 0]
      let _this = this
      statisticsData[0] = sel.length
      for (let i = 0; i < sel.length; i++) {
        // 获取任务统计数据
        switch (sel[i].status) {
          case _this.CONFIG.ORDER_STATUS_WAIT_ACCEPT:
            statisticsData[1] = statisticsData[1] + 1
            break
          case _this.CONFIG.ORDER_STATUS_WAIT_DOING:
            statisticsData[2] = statisticsData[2] + 1
            break
          case _this.CONFIG.ORDER_STATUS_WAITING_AUDIT:
            statisticsData[3] = statisticsData[3] + 1
            break
          case _this.CONFIG.ORDER_STATUS_DONE:
            statisticsData[4] = statisticsData[4] + 1
            break
        }
      }
      _this.statisticsData = [...statisticsData]
    },
    //判断是否需要重新加载
    isReload () {
      let _this = this
      this.timmer = setTimeout(() => {
        if (!_this.hasRasult && _this.overtime < _this.OVERTIME) {
          _this.overtime++
          _this.getTaskList()
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

    // 得到任务列表 - 接口
    async getTaskList (searchInfo) {
      let _this = this
      let params = null
      let data = null
      if (searchInfo) {
        params = { ...searchInfo }
      } else {
        _this.searchForm.start_time = (_this.acceptTimeArr && _this.acceptTimeArr.length > 0) ? _this.acceptTimeArr[0] : null
        _this.searchForm.end_time = (_this.acceptTimeArr && _this.acceptTimeArr.length > 0) ? _this.acceptTimeArr[1] : null
        _this.searchForm.effect_start = (_this.effectTimeArr && _this.effectTimeArr.length > 0) ? _this.effectTimeArr[0] : null
        _this.searchForm.effect_end = (_this.effectTimeArr && _this.effectTimeArr.length > 0) ? _this.effectTimeArr[1] : null
        _this.searchForm.confirm_start = (_this.confirmTimeArr && _this.confirmTimeArr.length > 0) ? _this.confirmTimeArr[0] : null
        _this.searchForm.confirm_end = (_this.confirmTimeArr && _this.confirmTimeArr.length > 0) ? _this.confirmTimeArr[1] : null
        params = { ..._this.searchForm, ...{ page: _this.currentPage, page_size: _this.pageSize } }
      }
      let isInit = _this.isReason(params)
      let localData = _this.zyLocalStorage.get('taskTableData')
      if (isInit && localData) {
        _this.tableData = localData
      }
      // 缓存查询信息
      _this.statisticsData.map((item) => { item.num = 0 })
      _this.hasRasult = false
      // _this.isReload()
      if (_this.isCode || _this.userInfoObj.is_admin == _this.CONFIG.ROLE_ADMIN) {
        data = await getTaskListHandler(params)
      } else {
        data = await getSelfTaskListHandler(params)
      }
      _this.hasRasult = true
      if (data.code == _this.CONFIG.CODE_PAGE_END) {
        _this.noDataTitle = '暂无数据'
        _this.tableData = []
        if (isInit) {
          localStorage.removeItem('taskTableData')
        }
        return false
      }
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.totalPage = data.result.count_all
      _this.tableData = data.result.task_list
      _this.tableData.map((item) => {
        item.isEdit = false
        item.isNoteEdit = false
        item.qr_order_id = item.qr_order_id ? _this.encodeId(item.qr_order_id) : ''
      })
      _this.statisticsData.map((item) => {
        item.num = data.result.count[item.type] ? data.result.count[item.type] : 0
      })
      if (isInit) {
        _this.zyLocalStorage.set('taskTableData', _this.tableData, _this.getOnedaySeconds())
      }

    },
    // 删除任务 - 接口
    async removeTask (params) {
      let data = await removeTaskHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.$alert(data.msg, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          // this.getTaskList()
          this.delayUpdate()
        }
      })
    },

    // 任务分配员解除派单员和任务的关系-接口
    async unAllotTasks (params) {
      let data = await unAllotTasksHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.$alert(data.msg, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          // this.getTaskList()
          this.delayUpdate()
        }
      })
    },

    // 任务审核失败-接口
    async taskOperation (params) {
      let data = await taskOperationHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.$alert(data.msg, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          // this.getTaskList()
          this.delayUpdate()
        }
      })
    },
    // 获取关键词筛选列表-接口
    async getKeywordList () {
      let _this = this
      if (_this.keyArr.length) return false
      // 查看缓存中是否要keyArr
      let params = _this.zyLocalStorage.get("keyArr")
      if (params) {
        _this.keyArr = [...params]
      } else {
        let data = await getKeywordListHandler()
        if (data.code === _this.CONFIG.CODE_PAGE_END) return false
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
        _this.keyArr = data.result.list
        _this.zyLocalStorage.set("keyArr", _this.keyArr, _this.selSetTime)
      }
    },
    // 获取分配员列表
    async getStaffList (visible) {
      if (!visible) return false
      let data = await getStaffListHandler()
      this.staffList = []
      if (data.code === this.CONFIG.CODE_PAGE_END) return false
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.staffList = data.result.list
    },
    // 获取店铺筛选列表-接口
    async getShopList (visible) {
      if (!visible) return false
      let _this = this
      _this.shopArr = []
      _this.shopArrOld = []
      let data = await getShopListHandler()
      if (data.code === _this.CONFIG.CODE_PAGE_END) return false
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.shopArr = data.result.list
      _this.shopArrOld = data.result.list
      // if (_this.shopArr.length) return false
      // //查看缓存中是否要shopArr
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
    async getSearchShopList () {
      let _this = this
      if (!_this.searchData) return false
      let data = await getSearchShopListHandler({ shop_name: _this.searchData })
      _this.shopArr = []
      if (data.code === _this.CONFIG.CODE_PAGE_END) {
        if (!_this.searchData) {
          _this.shopArr = _this.shopArrOld
        }
        return false
      }
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.shopArr = data.result.list
    },
    // 结束搜索店铺数据
    searchShopEnd () {
      clearTimeout(this.searchTimer)
    },
    // 获取用户输入搜索店铺数据
    searchShopValue (val) {
      let _this = this
      if (!val) {
        _this.shopArr = _this.shopArrOld
        clearTimeout(this.searchTimer)
        _this.searchData = val
        return false
      }
      val = val.replace(/^\s*|\s*$/g, "")
      if (val == this.searchData) return false
      _this.searchData = val
      _this.searchTimer = setTimeout(() => {
        _this.getSearchShopList()
      }, 0)
    },

    // 获取所在设备列表接口
    async getSelectList (visible) {
      let _this = this
      if (!visible) return false
      if (_this.deviceArr.length) return false
      // 查看缓存中是否要shopArr
      let params = _this.zyLocalStorage.get("deviceArr")
      if (params) {
        _this.deviceArr = [...params]
      } else {
        let data = null
        if (_this.isCode || _this.userInfoObj.is_admin == _this.CONFIG.ROLE_ADMIN) {
          data = await getSelectListHandler(params)
        } else {
          data = await getMySelectListHandler(params)
        }
        if (data.code === _this.CONFIG.CODE_PAGE_END) return false
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
        _this.deviceArr = (data.result && data.result.length > 0) ? data.result : []
        _this.zyLocalStorage.set("deviceArr", _this.deviceArr, _this.selSetTime)
      }
    },

    // 获取微信筛选列表-接口
    async getWechatList () {
      let _this = this
      if (_this.wechatArr.length) return false
      // 查看缓存中是否要wechatArr
      let params = _this.zyLocalStorage.get("wechatArr")
      if (params) {
        _this.wechatArr = [...params]
      } else {
        let data = await getWechatListHandler()
        if (data.code === _this.CONFIG.CODE_PAGE_END) return false
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
        _this.wechatArr = data.result.list
        _this.zyLocalStorage.set("wechatArr", _this.wechatArr, _this.selSetTime)
      }
    },
    // 修改商家金额
    editorSinglePrice (index, item) {
      this.singlePrice = ''
      this.taskId = ''
      const obj = { ...item }
      obj.isEdit = true
      this.taskId = this.encodeId(obj.id)
      this.singlePrice = obj.single_task_price
      this.tableData.splice(index, 1, obj)
    },
    // 修改返款备注
    editorPayNote (index, item) {
      this.pay_note = ''
      this.taskId = ''
      const obj = { ...item }
      obj.isNoteEdit = true
      this.taskId = this.encodeId(obj.id)
      this.pay_note = obj.pay_note
      this.tableData.splice(index, 1, obj)
    },
    // 商家金额修改取消
    cancelSinglePrice (index, item) {
      const obj = { ...item }
      obj.isEdit = false
      this.singlePrice = obj.single_task_price
      this.tableData.splice(index, 1, obj)
    },
    // 返款备注修改取消
    cancelPayNote (index, item) {
      const obj = { ...item }
      obj.isNoteEdit = false
      this.pay_note = obj.pay_note
      this.tableData.splice(index, 1, obj)
    },
    // 修改商品金额提交
    async alterTaskCommission () {
      if (this.singlePrice <= 0 || this.singlePrice == '') return this.$message.warning('输入金额不正确')
      const params = {
        task_id: this.taskId,
        task_price: this.singlePrice
      }
      const data = await alterTaskCommissionHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.$message.success(data.msg)
      // this.getTaskList()
      this.delayUpdate()
    },
    // 修改备注提交
    async updateTaskPayNote () {
      if (this.pay_note.length > 30 || this.pay_note.length < 0) return this.$message.warning('输入备注不正确，长度在0~30之间')
      const params = {
        task_id: this.taskId,
        pay_note: this.pay_note
      }
      const data = await updateTaskPayNoteHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.$message.success(data.msg)
      // this.getTaskList()
      this.delayUpdate()
    },
    // 跳转到文件下载列表
    jumpRouter () {
      this.$router.push({ path: '/tasksManagement/download' }, onComplete => { }, onAbort => { })
    },
    // 表格排序发送改变
    sortChange (v) {
      let _this = this
      if (v.order) {
        let newSortUnit = (v.order == 'ascending') ? 'asc' : 'desc'
        this.searchForm.sort_field = v.prop
        this.searchForm.sort_unit = newSortUnit
        _this.getTaskList()
      }
    },
    // 任务编辑蒙版显示
    taskEditor (row) {
      this.$refs.tasksDialog.editorTasksVisible = true
      for (let i in this.$refs.tasksDialog.taskInfo) {
        this.$refs.tasksDialog.taskInfo[i] = row[i] ? row[i] : ''
      }
      this.$refs.tasksDialog.taskInfo.real_task_price = 0
      this.$refs.tasksDialog.taskInfo.task_id = this.encodeId(row.id)
    },
    // 恢复任务提交
    async recoverTaskSubmit (params) {
      const _this = this
      const data = await recoverTaskHandler(params)
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.$message.success(data.msg)
      // _this.getTaskList()
      _this.delayUpdate()
    },
    // 单个恢复任务
    recoverTask (taskId) {
      let _this = this
      let taskarr = [this.encodeId(taskId)]
      let params = { task_ids: JSON.stringify(taskarr) }
      _this.$confirm('是否确认恢复任务，恢复后重新计算做单倒计时', '恢复任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.recoverTaskSubmit(params)
      })
    },
    // 显示克隆任务蒙版
    cloneTask (row) {
      let _this = this
      _this.$refs.tasksDialog.cloneTaskForm = { ...row }
      _this.$refs.tasksDialog.cloneTastVisible = true
    },
    // 单个失效
    failureTask (row) {
      let _this = this
      let taskarr = [this.encodeId(row.id)]
      let params = { task_ids: JSON.stringify(taskarr) }
      _this.$confirm(`任务失效后将不能进行任何操作，请谨慎使用失效任务的功能，是否继续?`, '失效任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.cancelTask(params)
      })
    },
    // 失效任务提交
    async cancelTask (params) {
      const _this = this
      const data = await cancelTaskHandler(params)
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.$message.success(data.msg)
      // _this.getTaskList()
      _this.delayUpdate()
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
        this.getTaskList()
      }, this.DELAY_TIME)
    },
    // 获取展示缩略图文件
    getImgUrl (type, obj) {
      let setTime = Date.parse(new Date('2020-04-27'))  // 缩略图功能生效时间
      if (type == 'bankInfo') {
        if (!obj.buyer_collection_qr) return '-'
        let dateSlots = obj.buyer_collection_qr.split('/')
        let dateStr = `${dateSlots[2]}-${dateSlots[3]}-${dateSlots[4]}`
        let uploadTime = Date.parse(new Date(dateStr))
        let picUrl = (setTime > uploadTime) ? `${obj.cdn_url}${obj.buyer_collection_qr}` : `${obj.cdn_url}${this.THUMBNAIL_URL}${obj.buyer_collection_qr}`
        return picUrl
      } else {
        if (obj.item_pic == 'http://cdn.wangwangdui2021.com/gg/txbb.jpg') return obj.item_pic
        if (obj.item_pic.indexOf(this.CDN_UP_URL) < 0) return obj.item_pic
        let dateSlots = obj.item_pic.split('/')
        let dateStr = `${dateSlots[4]}-${dateSlots[5]}-${dateSlots[6]}`
        let uploadTime = Date.parse(new Date(dateStr))
        if (setTime > uploadTime) return obj.item_pic
        let index = obj.item_pic.lastIndexOf('/uploads')
        let strUrl = obj.item_pic.substring(index + 1, obj.item_pic.length)
        return `${this.CDN_UP_URL}${this.THUMBNAIL_URL}/${strUrl}`
      }
    }
  },
}
</script>

<style lang="scss" scope>
.flex-bottom {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.code-content {
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
  .pic-box {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
