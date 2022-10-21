<template>

  <el-row justify="end">
    <el-button size="large" @click.prevent="saveClipboard" :disabled="datas.length === 0 || !isDone">
      クリップボードに保存する
    </el-button>
  </el-row>
  <el-table :data="datas" style="width: 100%" max-height="2000">
    <el-table-column type="index" width="30" />
    <el-table-column label="URL" width="220">
      <template #default="scope">
        <el-tooltip :content=scope.row.title placement="top">
          <el-link type="primary" :href="scope.row.url" target="_blank" :underline="false">{{ scope.row.url }}</el-link>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="Title" width="300" />
    <el-table-column prop="description" label="Description" width="400" />
    <el-table-column prop="keywords" label="Keywords" width="300" />
    <!-- <el-table-column prop="canonical" label="Canonical" width="300" /> -->
    <el-table-column label="Canonical" width="220">
      <template #default="scope">
        <el-tooltip :content=scope.row.title placement="top">
          <el-link type="primary" :href="scope.row.url" target="_blank" :underline="false">{{ scope.row.canonical }}
          </el-link>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps<{
  datas: any[],
  isDone: boolean
}>()

const saveClipboard = () => {
  let csvArr = ["url\ttitle\tdescription\tkeywords\tcanonical"]
  let arr = (props.datas || []).map((row) => {

    return [row.url, row.title, row.description, row.keywords, row.canonical].join("\t")
  })

  csvArr = csvArr.concat(arr)
  let csv = csvArr.join("\n")

  navigator.clipboard.writeText(csv)
    .then(() => {
      alert('クリップボードに保存しました');
    })
    .catch(e => {
      console.error(e)
    })
}
</script>