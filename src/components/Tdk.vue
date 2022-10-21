<template>
  <h1 style="margin: 0">TDK取得</h1>
  <el-form ref="urlTextAreaRef" :model="urlTextArea" :rules="rules" :size="formSize" class="urlTextArea" status-icon>
    <el-form-item prop="url">
      <label for="url">*URL</label>
      <el-input v-model="urlTextArea.url" type="textarea" name="jsonData" rows="15" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onClickSubmit(urlTextAreaRef)" :disabled="percentage > 0">Go</el-button>
    </el-form-item>
  </el-form>

  <ul>
    <li>URL入力方法: 改行区切り</li>
  </ul>

  <el-alert v-show="doneAlert" title="完了しました" type="success" center show-icon />
  <el-progress v-show="percentage < 100 && percentage > 0" :percentage="percentage" :color="customStyle" />
  <UrlTable :datas="datas" :isDone="isDone" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import UrlTable from './UrlTable.vue';
import axios from 'axios';
import queue from "queue";

const urls = ref<String[]>([]);
const datas = ref<any[]>([])
const formSize = ref("default");
const urlTextAreaRef = ref<FormInstance>()
const urlTextArea = reactive({ url: '' })
const doneAlert = ref(false)
const percentage = ref(0)
const isDone = ref(false)

if (localStorage.getItem("urlTextArea")) {
  urlTextArea.url = String(localStorage.getItem("urlTextArea"))
}

const onClickSubmit = async (formEl: FormInstance | undefined) => {
  datas.value = []
  isDone.value = false

  if (!formEl) return

  let isValid = false
  localStorage.setItem('urlTextArea', urlTextArea.url);
  await formEl.validate((valid, _) => { isValid = valid })

  if (isValid) {
    const arr = urlTextArea.url.split(/\s/)
    // URLの空白の削除.
    var cleanArr = arr.filter(Boolean);
    urls.value = cleanArr;

    var q = queue({ results: [], concurrency: 4 });
    urls.value.forEach((element, i) => {
      const elementInQ = async () => {
        const response = await axios.post("http://localhost:3000/tdk", {
          element: element,
          number: i,
        });
        datas.value = [...datas.value, response.data];
        datas.value.sort((a, b) => {
          return a.requestNumber < b.requestNumber ? -1 : 1;
        });
        //　プログレスバ-の表示
        increaseProgressBar()
      };
      q.push(elementInQ);
    });

    q.start(err => {
      if (err) throw err;
      //　終了したことを画面上に表示.
      doneAlert.value = true
      isDone.value = true
    });
  }
};

const rules = reactive<FormRules>({
  url: [
    { required: true, message: 'URLが入力されていません', trigger: 'blur' },
  ],
})

const increaseProgressBar = () => {
  percentage.value += Math.ceil(100 / urls.value.length)

  if (percentage.value >= 100) {
    percentage.value = 0
  }
}

const customStyle = (percentage: number) => {
  if (percentage < 30) {
    return '#909399'
  }

  if (percentage < 70) {
    return '#e6a23c'
  }
  return '#67c23a'
}
</script>

<style scoped>
/* .progress .el-progress--line {
  margin-bottom: 16px;
  width: 350px;
} */
.el-alert {
  margin: 20px 0 16px;
}

ul,
ol {
  color: #525457;
  /* border-top: solid #a6a9ad 0.5px;上のボーダー */
  border-bottom: solid #a6a9ad 0.5px;
  /*下のボーダー*/
  padding: 0.5em 0 0.5em 0.5em;
  margin-bottom: 20px;
  list-style: none;
}

ul li,
ol li {
  line-height: 0.8;
  padding: 0.5em 0;
  font-size: small;
}
</style>
