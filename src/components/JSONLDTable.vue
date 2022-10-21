<template>
  <el-row justify="end">
    <el-button size="large" @click.prevent="saveClipboard" :disabled="datas.length === 0 || !isDone">
      クリップボードに保存する
    </el-button>
  </el-row>
  <el-table :data="datas" style="width: 100%" max-height="2000">
    <el-table-column label="URL" width="250">
      <template #default="scope">
        <el-tooltip :content="scope.row.title" placement="top">
          <el-link type="primary" :href="scope.row.url" target="_blank" :underline="false">{{ scope.row.url }}</el-link>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="JSONLD タイプ" width="250">
      <template #default="scope">
        <div v-for="(schema, i) in scope.row.schemas">
          <el-button :type="validColour(schema.isValid)" text @click="openDrawer(schema.name, schema.elements)">
            {{schema.name}}</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="詳細" width="1200">
      <template #default="scope">
        <div v-for="(msg, i) in errorMsgs(scope.row.schemas)">
          <span>{{ msg.name }} {{ msg.errorMsg }}</span>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <el-drawer v-model="drawer" :title="drawerInfo.name" size="40%" direction="ltr">
    <span>{{drawerInfo.elements}}</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "vue";

const drawer = ref(false);
const drawerInfo = ref({
  name: "",
  elements: [],
});

const openDrawer = (name: string, elements: never[]) => {
  drawer.value = true
  drawerInfo.value = {
    name,
    elements
  }
}

const validColour = (isValid: null | boolean) => {
  if (isValid === null) {
    return "";
  }
  return isValid ? "success" : "danger";
};
interface jsonLDChecked {
  name: String;
  isValid: null | boolean;
  errorMsg: null | String;
  elements: Array<object>;
}
const errorMsgs = (schemas: jsonLDChecked[]) => {
  let msgs = schemas
    .map((s) => {
      return {
        name: s.name,
        errorMsg: s.errorMsg,
      };
    })
    .filter((s) => !!s.errorMsg);
  if (msgs.length == 0) {
    return [{ name: "", errorMsg: "問題無し" }];
  }
  return msgs;
};

const props = defineProps<{
  datas: any[];
  isDone: boolean;
}>();
const saveClipboard = () => {
  let csvArr = ["url\tJSONLDタイプ\t詳細"]
  let arr = (props.datas || []).map((row) => {
    let jsonldType = row.schemas.map((schema: jsonLDChecked) => schema.name).join(",")
    let errorMsg = errorMsgs(row.schemas).map(msg => `${msg.name} ${msg.errorMsg}`).join(",")
    return [row.url, jsonldType, errorMsg].join("\t")
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

