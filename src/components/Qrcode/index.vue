<template>
  <div>
    <div>
      <el-button @click="getQrcode">生成二维码</el-button>
      <el-button @click="DownLoadDomImg()">生成成品</el-button>
      <div ref="imageWrapper">
        <div id="qrcode"></div>
        <el-row>
          <el-col :span="2">
            <el-input placeholder="" v-model="beizhu"> </el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <h1>成品：</h1>
      <img class="showQrcodeImg" :src="dataURL" alt="" />
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'
export default {
  name: '',
  data () {
    return {
      dataURL: '',
      beizhu: ''
    }
  },

  mounted () { },

  methods: {
    getQrcode () {
      let _this = this
      _this.qrcode = new QRCode('qrcode', {
        width: 130,
        height: 130,
        text: 'http://www.baidu.com',
        colorDark: '#000',
        colorLight: '#fff'
      })
    },
    DownLoadDomImg () {
      html2canvas(this.$refs.imageWrapper, {
        backgroundColor: null
      }).then((canvas) => {
        let dataURL = canvas.toDataURL("image/png")
        this.dataURL = dataURL
        dataURL = null
      })
    }
  }
}
</script>
<style lang='' scoped>
</style>
