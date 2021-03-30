<template>
  <div class="Upload" @click="uploadImg(this)">
    <input
      type="file"
      @change="addImg"
      ref="inputer"
      accept="image/*"
      style="display:none"
      :id="'upload' + tid"
    />
    <!-- <img
      :src="CDN_UP_URL + id_card_pic"
      alt=""
      v-if="isShowImg && id_card_pic"
    /> -->
    <span class="upload-title">点击上传图片</span>
  </div>
</template>

<script>
import lrz from 'lrz'
import { uploaderFileHandle } from '@/api/uploaderFile'
export default {
  props: ['tid', 'isShowImg'],
  name: 'Upload',
  data () {
    return {
      fil: null,
      id_card_pic: null
    }
  },
  methods: {
    uploadImg (a) {
      var _this = this
      document.getElementById('upload' + _this.tid).click()
    },
    addImg () {
      let _this = this
      let inputDOM = _this.$refs.inputer
      // 通过DOM取文件数据
      if (!inputDOM.files[0]) return false
      _this.fil = inputDOM.files[0]
      let size = Math.floor(_this.fil.size / 1024)
      if (size > 1024) return _this.$message.error('最大上传文件不能超过1MB')
      lrz(_this.fil, { width: _this.UPLOAD_IMAGE_SIZE, quality: _this.UPLOAD_IMAGE_QUALITY }).then(async (results) => {
        // 你需要的数据都在这里，可以以字符串的形式传送base64给服务端转存为图片。
        if (!results.base64) return _this.$message.error('上传出错！请重新登录后再尝试上传图片')
        let params = { img_base: encodeURIComponent(results.base64) }
        let res = await uploaderFileHandle(params)
        if (res.code != _this.CONFIG.CODE_SUCCESS) return _this.$message.error(res.msg)
        _this.id_card_pic = res.msg
        if (!_this.isShowImg) return _this.$emit('addImg', res.msg)
        _this.$emit('addOneImg', res.msg)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Upload {
  width: 150px;
  height: 150px;
  background-position: 0 0;
  background: url("~@/assets/png/cross.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
  position: relative;
  img {
    width: 150px;
    height: 150px;
  }
  .upload-title {
    position: absolute;
    font-size: 14px;
    color: #cecece;
    bottom: 15px;
    left: 35px;
  }
}
</style>
