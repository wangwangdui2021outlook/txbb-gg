<template>
  <div class="img-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>图片小工具</span>
      </div>
      <p class="img-note">说明：图片保存的有效期为15天，过期将会删除</p>
      <div class="img-lists">
        <upload
          ref="idPic"
          :tid="2"
          @addOneImg="getImgUrl"
          :isShowImg="true"
        ></upload>
        <div class="img-box">
          <el-image
            class="upload-img"
            v-if="imgUrl"
            :src="imgUrl"
            :preview-src-list="imgList"
          ></el-image>
          <p class="upload-title" v-if="imgUrl">
            <span>图片地址：{{ imgUrl }}</span>
            <el-button
              class="copy-btn"
              size="mini"
              v-clipboard:copy="imgUrl"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="primary"
              >复 制</el-button
            >
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      imgUrl: null,
      imgList: []
    }
  },

  mounted () { },

  methods: {
    // 获取图片上传路径
    getImgUrl (imgUrl) {
      this.imgUrl = `${this.CDN_UP_URL}${imgUrl}`
      this.imgList[0] = `${this.CDN_UP_URL}${imgUrl}`
    },
    onCopy () {
      this.$message.success('已复制到剪贴板！')
    },
    onError (e) {
      this.$message.warning('复制失败，请稍后再试试！')
    }
  }
}
</script>
<style lang='scss' >
.img-container {
  .clearfix {
    span {
      font-size: 20px;
      font-weight: 500;
    }
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
  .img-note {
    font-size: 16px;
    padding-bottom: 25px;
  }
  .box-card {
    .el-card__body {
      padding: 20px 20px 50px 20px;
    }
  }
  .img-lists {
    display: flex;
    flex-direction: row;
  }
  .img-box {
    margin-left: 50px;
    .upload-img {
      width: 150px;
      height: 150px;
    }
    .upload-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 15px;
      font-size: 15px;
      .copy-btn {
        margin-left: 20px;
      }
    }
  }
}
</style>
