<template>
  <div class="preview-content" v-if="show">
    <i class="el-icon-circle-close close" @click="close"></i>
    <div class="preview-bac"></div>
    <div class="img-content">
      <el-image :src="imgUrl"></el-image>
    </div>
    
  </div>
</template>

<script>

export default {
  name: 'previewImage',
  data () {
    return {
      show:false,
      imgUrl:''
    }
  },

  mounted () {
    this.imgUrl = ''
    this.show = false
  },

  methods: {
   open (imgUrl) {
     this.imgUrl = imgUrl
     this.show = true
   },
   close () {
     this.imgUrl = ''
     this.show = false
   }
  }
}
</script>
<style lang='scss' scoped>
  .preview-content{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    .preview-bac{
      width: 100%;
      height: 100%;
      background-color: #000000;
      opacity: 0.8;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
    .close{
      position: absolute;
      right: 40px;
      top: 40px;
      z-index: 10;
      color: #f0f0f0;
      width: 40px;
      height: 40px;
      font-size: 40px;
    }
    .img-content{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 5;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: scroll;
      // .el-image{
      //   max-width: 80%;
      //   max-height: 80%;
      // }
    }
  }
</style>
