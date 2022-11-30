<template>

  <el-row justify="end">
    <el-button size="large" @click.prevent="saveClipboard" :disabled="datas.length === 0 || !isDone">
      クリップボードに保存する
    </el-button>
    <el-button size="large" @click.prevent="saveClipboardForH" :disabled="datas.length === 0 || !isDone">
      Hタグをクリップボードに保存する
    </el-button>
  </el-row>
  <el-table :data="datas" style="width: 100%" max-height="2000">
    <el-table-column type="index" width="30" />
    <el-table-column label="URL" width="150">
      <template #default="scope">
        <el-tooltip :content=scope.row.title placement="top">
          <el-link type="primary" :href="scope.row.url" target="_blank" :underline="false">{{ scope.row.url }}</el-link>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="Title" width="200" />
    <el-table-column prop="description" label="Description" width="300" />
    <el-table-column prop="keywords" label="Keywords" width="200" />

    <el-table-column label="Hタグ" width="600">
      <template #default="scope">
        <span v-for="h in scope.row.hs">
          <span style="font-size: 10px; line-height: 11px;" :class="`hs-${h.name}`">
            {{h.text}}
          </span>,
        </span>
      </template>
 
    </el-table-column>

    <el-table-column label="Canonical" width="150">
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
import { defineProps, h, ref } from 'vue'
const props = defineProps<{
  datas: any[],
  isDone: boolean
}>()

const drawer = ref(false)
const drawerInfo = ref({
  h: <any>[],
  text: <any>[],
});

const saveClipboard = () => {
  let csvArr = ["url\ttitle\tdescription\tkeywords\tcanonical"]
  let arr = (props.datas || []).map((row) => {
    return [row.url, row.title, row.description, row.keywords, row.canonical].join("\t")
  })
  
  csvArr = csvArr.concat(arr)
  let csv = csvArr.join("\n")
  writeClipboard(csv)
}

const saveClipboardForH = () => {
  let csvArr = ["url\ttitle\tH1\tH2\tH3\tH4"]
  let arr = (props.datas || []).map((row) => {
    let textHash = row.hs.reduce((obj: {[key: string]: string}, h: {text: string, name: string}) => {
      let text = obj[h.name]
      text = text == "" ? h.text : `${text},${h.text}`
      obj[h.name] = text
      return obj
    }, { h1: "", h2: "", h3: "", h4: ""})
    return [row.url, row.title, textHash.h1, textHash.h2, textHash.h3, textHash.h4].join("\t")
  })
 
  csvArr = csvArr.concat(arr)
  let csv = csvArr.join("\n")
  writeClipboard(csv)
}

const writeClipboard = (csv: string) => {
  navigator.clipboard.writeText(csv)
    .then(() => {
      alert('クリップボードに保存しました');
    })
    .catch(e => {
      console.error(e)
    })
}

</script>
<style scoped>


.hs-h1 {
  color: red
}
.hs-h2 {
  color: blue
}
.hs-h3 {
  color: green
}
.hs-h4 {
  color: orange
}

</style>