<template>

  <!-- 整个游戏容器 -->
  <div class="container">
    <!-- 开始游戏按钮 -->
    <button class="startBtn"></button>
    <!-- 暂停游戏按钮 -->
    <button class="pauseBtn"></button>
  </div>
</template>

<script>

export default {

}
</script>

<style scoped>
*{
  /* 去除内外边距 */
  margin: 0;
  padding: 0;
}
/* 整体游戏容器样式 */
.container{
  display: flex;
  justify-content: center;
  align-items: center;
  width:600px;
  height: 600px;
  background: #225675;
  border: 20px solid #7dd9ff;
  margin: 20px auto;
  position: relative;
}

/* 设置按钮公共样式 */
.container button{
  border:none;
  outline: none; 
  /* 边框和轮廓 */
}
/* 开始按钮 */
.startBtn{
  display: block;
  width: 200px;
  height: 80px;
  background:url(./img/开始游戏.png) center/contain no-repeat
}
.pauseBtn{
  display: none;
  width: 70px;
  height: 70px;
  background:url(./img/开始.png) center/contain no-repeat
}
</style>

