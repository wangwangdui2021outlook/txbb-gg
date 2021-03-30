<template>
<div id="import-dialog">
    <el-dialog
    class="choise-type"
    title="导入天线宝宝（普通版）会员"
    :visible.sync="choiseType"
    >
      <div class="choise-tips">选择导入方式</div>
      <div class="dialog-footer">
        <el-button style="padding: 15px 40px;" type="primary" round @click="nextTip(false)">按设备导入</el-button>
        <el-button style="padding: 15px 40px;" type="primary" round @click="nextTip(true)">搜索会员导入</el-button>
      </div>
    </el-dialog>
    <el-dialog 
    :title="memberShip?'搜索会员导入天线包包（普通版）会员':'按设备导入天线包包（普通版）会员'"
    :visible.sync="showNext"
    >
   <el-row v-if="memberShip">
     <el-row class="flex-around">
       <el-input v-model="deviceKeyword" placeholder="输入会员手机号、淘宝号、微信号"></el-input>
       <el-button style="padding: 8px 30px;" type="primary" round @click="searchMember">搜索</el-button>
     </el-row>
      <el-table 
      v-if="memberList.length > 0"
      ref="memberList"
      :data="memberList"
      height="330px"
      @selection-change="handleSelectionChange"
      >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="phone_number" label="手机号"></el-table-column>
      <el-table-column prop="tb_nick" label="淘宝号"></el-table-column>
      <el-table-column prop="wechat_num" label="微信号"></el-table-column>
      <el-table-column prop="device_name" label="设备归属"></el-table-column>
      </el-table>
      <el-row class="member-select" v-if="memberList.length > 0">
        <el-checkbox
          class="flex-bottom"
          label="全选"
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="toggleSelection"
        ></el-checkbox>
        <p>已选人数：{{$refs.memberList ? $refs.memberList.selection.length : 0}}</p>
      </el-row>
      <div style="text-align: center;">
         <el-button style="padding: 16px 78px;" type="primary" round @click="addMember">下一步</el-button>
      </div>
   </el-row>
   <el-row v-if="!memberShip">
     <el-row class="flex-around">
       <el-input v-model="deviceInput" placeholder="输入设备名"></el-input>
       <el-button style="padding: 8px 30px;" type="primary" round @click="searchDevice">搜索</el-button>
     </el-row>
      <el-table 
      ref="deviceList"
      :data="deviceList"
      height="330px"
      highlight-current-row
      @selection-change="handleDeviceChange"
      >
      <el-table-column label="选择" prop="">
        <template slot-scope="scope" >
          <el-checkbox
            class="flex-bottom"
            label=""
            v-model="scope.row.checked"
            @change="changeSelectDevice(scope.$index)"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="device_id" label="设备编号"></el-table-column>
      <el-table-column prop="device_name" label="设备名称"></el-table-column>
      <el-table-column prop="device_user" label="保管人"></el-table-column>
      <el-table-column prop="count" label="会员人数"></el-table-column>
      </el-table>
      <div style="text-align: center;">
         <el-button style="padding: 16px 78px;" type="primary" round @click="choiseMemberBydevice">下一步</el-button>
      </div>
   </el-row>
  </el-dialog>
  <el-dialog
  title="选择导入的会员"
  :visible.sync="choiseMember"
  class="member-device"
  width="1000px"
  >
    <el-row style="padding-bottom: 20px;font-size: 18px;color:#000;">
      <span>设备编号：{{deviceCheckeed.device_id}}</span>
      <span>设备名称：{{deviceCheckeed.device_name}}</span>
    </el-row>
    <el-row class="flex-around member-device-row">
       <el-input v-model="deviceKeyword" placeholder="输入会员手机号、淘宝号、微信号"></el-input>
       <el-button style="padding: 8px 30px;" type="primary" round @click="searchMember">搜索</el-button>
     </el-row>
     <el-row :gutter="60">
      <el-col :span="12">
        <div class="title">等待添加的会员</div>
        <el-table 
        ref="memberListWaitAdd"
        :data="memberList"
        height="330px"
        @selection-change="handleSelectionChangeWaitAdd"
        >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="phone_number" label="手机号"></el-table-column>
        <el-table-column prop="tb_nick" label="淘宝号"></el-table-column>
        <el-table-column prop="wechat_num" label="微信号"></el-table-column>
        </el-table>
        <el-row class="member-select">
          <el-col :span="12">
            <el-checkbox
            class="flex-bottom"
            label="全选"
            :indeterminate="isIndeterminateWaitAdd"
            v-model="checkAllWaitAdd"
            @change="toggleSelectionWaitAdd"
          ></el-checkbox>
          </el-col>
          <el-col :span="12" style="display:flex;justify-content:flex-end;">
            <el-button type="primary" @click="addChecked" round>添加</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <div class="title">已添加的会员</div>
        <el-table 
        ref="memberListChecked"
        :data="memberListChecked"
        height="330px"
        @selection-change="handleSelectionChangeChecked"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="phone_number" label="手机号"></el-table-column>
          <el-table-column prop="tb_nick" label="淘宝号"></el-table-column>
          <el-table-column prop="wechat_num" label="微信号"></el-table-column>
        </el-table>
        <el-row class="member-select">
          <el-col :span="12">
            <el-checkbox
            class="flex-bottom"
            label="全选"
            :indeterminate="isIndeterminateChecked"
            v-model="checkAllChecked"
            @change="toggleSelectionChecked"
          ></el-checkbox>
          </el-col>
          <el-col :span="12" style="display:flex;justify-content:flex-end;">
            <el-button type="primary" @click="removeChecked" round>删除</el-button>
          </el-col>
        </el-row>
      </el-col>
   </el-row>    
   <div class="dialog-footer" style="text-align:center;margin-top:20px">
      <el-button style="padding: 16px 78px;margin-right:100px;" round type="info" @click="backDevice">上一步</el-button>
      <el-button style="padding: 16px 78px;" type="primary" round @click="addMember">导入</el-button>
    </div>
  </el-dialog>
</div>
 

</template>

<script>
// 触发父组件 reloadData方法
import { getOtherDeviceListHandler, getSearchUserListHandler, getDeviceUserListHandler, exportUserHandler } from '@/api/deviceManagement'
// this.$emit('reloadData')
export default {
  name: 'importDialog',
  data() {
    return {
      device_id: 0,
      choiseType:false, // 选择导入方式
      showNext: false, // 开始导入
      memberShip: false, // 是否搜索会员
      choiseMember: false, // 是否选择会员，按设备导入第二步
      memberList:[], // 会员列表
      deviceList:[], // 设备列表
      deviceListOld: [], // 备份设备列表，搜索用
      deviceCheckeed:{},// 选择的设备
     //是否全选 搜索会员
      isIndeterminate: false, 
      checkAll: false,
      memberListWaitAddSelection: [], // 等待添加选择
      //是否全选 等待添加的会员
      isIndeterminateWaitAdd: false, 
      checkAllWaitAdd: false,
      // 已选择会员
      isIndeterminateChecked: false,
      checkAllChecked: false,
      memberListChecked: [], 
      deviceKeyword: '', //用户搜索
      deviceInput: '', // 设备搜索
    }
  },
  mounted() {},
  methods: {
    // 搜索设备 
    searchDevice () {
      if(!this.deviceInput) return this.deviceList = this.deviceListOld
      let resultData = this.deviceList.filter(iteam => {
        if(iteam.device_name == this.deviceInput || iteam.device_name.indexOf(this.deviceInput) != -1){ //此处根据具体需求判断
            return true;
        }
      });
      this.deviceList = resultData
    },
    // 选择导入方式
    nextTip (memberShip) {
      this.init()
      this.choiseType = false
      this.showNext = true
      this.memberShip = memberShip
      if(!memberShip) this.getOtherDeviceList()
    },
    // 初始化
    init () {
      this.choiseType = false
      this.showNext = false
      this.memberShip = false
      this.choiseMember = false
      this.deviceInput = ''
      this.deviceKeyword = ''
      this.deviceCheckeed = {}
      this.memberList = []
      this.deviceList = []
      this.deviceListOld = []
      this.memberListChecked = []
    },
    // 获取设备列表
    async getOtherDeviceList () {
      let data = await getOtherDeviceListHandler()
      if (data.code !== this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      let deviceList = data.result
      deviceList.forEach((iteam) =>{
          iteam.checked = false
          iteam.device_id = this.encodeId(iteam.id)
      })
      this.deviceList = deviceList
      this.deviceListOld = deviceList
    },
    // 设备选择改变
    handleDeviceChange (value) {
    },
    changeSelectDevice(index) {
      let deviceList = this.deviceList
      deviceList.forEach((iteam) =>{
          iteam.checked = false
      })
      deviceList[index].checked = true
      this.deviceCheckeed = deviceList[index]
      this.deviceList = Object.assign([], deviceList)
    },
     // 会员选择发生改变
    handleSelectionChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.memberList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.memberList.length;
      this.memberListChecked = value
    },
     //全选
    toggleSelection (val) {
      if (val) {
        this.memberList.forEach(row => {
          this.$refs.memberList.toggleAllSelection(row)
          this.isIndeterminate = true
        })
      } else {
        this.$refs.memberList.clearSelection()
        this.isIndeterminate = false
      }
    },
     // 等待添加 会员选择发生改变
    handleSelectionChangeWaitAdd (value) {
      let checkedCount = value.length;
      this.checkAllWaitAdd = checkedCount === this.memberList.length;
      this.isIndeterminateWaitAdd = checkedCount > 0 && checkedCount < this.memberList.length;
      this.memberListWaitAddSelection = value
    },
     //等待添加 全选
    toggleSelectionWaitAdd (val) {
      if (val) {
        this.memberList.forEach(row => {
          this.$refs.memberListWaitAdd.toggleAllSelection(row)
          this.isIndeterminateWaitAdd = true
        })
      } else {
        this.$refs.memberListWaitAdd.clearSelection()
        this.isIndeterminateWaitAdd = false
      }
    },
     // 等待移除 会员选择发生改变
    handleSelectionChangeChecked (value) {
      let checkedCount = value.length;
      this.checkAllChecked = checkedCount === this.memberListChecked.length;
      this.isIndeterminateChecked = checkedCount > 0 && checkedCount < this.memberListChecked.length;
    },
     //等待移除 全选
    toggleSelectionChecked (val) {
      if (val) {
        this.memberListChecked.forEach(row => {
          this.$refs.memberListChecked.toggleAllSelection(row)
          this.isIndeterminateChecked = true
        })
      } else {
        this.$refs.memberListChecked.clearSelection()
        this.isIndeterminateChecked = false
      }
    },
    // 添加选择
    addChecked () {
      let memberListChecked = this.memberListChecked
      let selection = this.memberListWaitAddSelection
      // let selectData = this.$refs.memberListWaitAdd.selection  这样赋值会使两者关联起来
      if(selection.length == 0) return
       if(memberListChecked.length == 0){
         memberListChecked = selection
       }else{
         selection.map(iteam => {
           iteam.hasChecked = false
           memberListChecked.map(iteam1 => {
             if(iteam.id == iteam1.id){
               iteam.hasChecked = true
             }
           })
         })
         selection.map(iteam => {
           if(!iteam.hasChecked){
             memberListChecked.push(iteam)
           }
         })
       }
      //  this.checkAllChecked = false
       this.memberListChecked = memberListChecked
       
    },
    // 删除选择
    removeChecked () {
      let memberListChecked = this.memberListChecked
      let selectData = this.$refs.memberListChecked.selection
      let max = memberListChecked.length -1
      for(let index = max; index > -1 ; index--){
        selectData.map(item => {
          if(memberListChecked[index] && memberListChecked[index].id == item.id){
            memberListChecked.splice(index,1)
          }
        })
      }
      this.checkAllChecked = false
      this.memberListChecked = memberListChecked
    },
    // 搜索会员
    searchMember () {
      this.getSearchUserList()
    },
    // 通过设备选择会员
    choiseMemberBydevice () {
      if(!this.deviceCheckeed.id) return this.$message.warning('请先选择设备')
      this.showNext = false
      this.choiseMember = true
      this.memberList = []
      this.getDeviceUserList()
    },
    // 通过设备id查找会员
    async getDeviceUserList () {
      let data = await getDeviceUserListHandler({device_id: this.deviceCheckeed.id})
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.memberList = data.result
    },
    // 搜索会员 
    async getSearchUserList () {
      let parmes = {
        keyword: this.deviceKeyword
      }
      if(this.deviceCheckeed.id) parmes.device_id = this.deviceCheckeed.id
      let data = await getSearchUserListHandler(parmes)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.memberList = data.result
    },
    // 返回设备列表
    backDevice () {
      this.choiseMember = false
      this.showNext = true
    },
    // 导入会员
    async addMember () {
      let memberListChecked = this.memberListChecked
      if(memberListChecked.length < 1) return
      
      let user_ids = []
      memberListChecked.map(iteam => {
        user_ids.push(iteam.id)
      })
      let parmes = {
        device_id: this.device_id,
        user_ids: user_ids
      }
      let data = await exportUserHandler(parmes)
      if (data.code != this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      let showMsg = `已成功导入${data.result}名会员`
      if(data.result != memberListChecked.length) showMsg = `已成功导入${data.result}名会员,重复${memberListChecked.length - data.result}个`
      this.$confirm(showMsg, {
        confirmButtonText: '确定',
        showCancelButton:false,
        type: 'success',
        center: true
      }).then(() =>{
        this.init()
        this.$emit('reloadData')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  
#import-dialog{
  // /deep/ .el-table::before {
  //   height: 0;
  // }
  /deep/ .el-checkbox__inner{
    border-radius: 50%;
  }
  /deep/ .el-table tr {
    th{
      color: #333333;
      background-color: #FBF8F5 !important;
    }
  }
  /deep/ .el-table-column--selection .cell{
    padding-left: 10px;
  }
  .flex-bottom {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .flex-around{
    display: flex;
    justify-content: space-around;
    padding-bottom: 20px;
  }
  .choise-type{
    .choise-tips{
      padding-bottom: 40px;
      text-align: center;
      font-size: 20px;
      color: #000;
      font-weight: 400;
    }
    .dialog-footer{
      display: flex;
      justify-content: space-around;
    }
  }
  .member-select{
    padding: 10px 10px;
    font-size: 18px;
    display: flex;
    justify-content: flex-start;
    /deep/ .el-checkbox__label{
      font-size: 18px;
      font-weight: 400;
    }
    p{
      font-size: 16px;
      font-weight: 400;
      padding-left: 25px;
    }
  }
  // .member-device{
  //   width: 800px;
  // }
}
  
</style>