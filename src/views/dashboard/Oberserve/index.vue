<template>
<el-row :gutter="10">
  <el-col :span="12"><search></search></el-col>
   <el-col :span="12"><category></category></el-col>
</el-row>
</template>

<script>
import category from './Category'
import search from './Search'
export default {
  name:'Oberserve',
  components:{
    category,
    search
  }
}
</script>

<style></style>
