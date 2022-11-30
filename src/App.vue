<template>
  <div class="common-layout">
    <el-container style="min-height: 880px">
      <el-container>
        <el-aside width="200px">
          <el-menu default-active="home" router>
            <el-menu-item index="home" :route="{ name: 'home' }">Home</el-menu-item>
            <el-menu-item index="tool" :route="{ name: 'tdk' }">TDK</el-menu-item>
            <el-menu-item index="json" :route="{ name: 'json' }">JSON-LD</el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped>

body {
  margin: 0;
}
.el-header {
  background-color: rgb(255, 255, 255);
  text-align: left;
  line-height: 80px;
  border-bottom: 1px #ccc solid;
}

.el-menu-item,
.el-aside {
  background-color: #f5f2f2;
  color: var(--el-text-color-primary);
}


</style>