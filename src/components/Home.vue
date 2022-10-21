<template>
  <h1 style="margin: 0">HOME</h1>
  <ul>
    <li>URLを入力することでTDK取得、LD+JSONバリデーションを行います</li>
    <li>TDK取得は<router-link to="/tdk">こちら</router-link>
    </li>
    <li>LD+JSONバリデーションは<router-link to="/json">こちら</router-link>
    </li>
  </ul>
</template>
<style scoped>
ul {
  list-style: none;
  color: #525457;
  padding: 0;
  margin: 8px 0 0;
}

li {
  color: #525457;
  line-height: 1;
  padding: 8px 0;
  font-size: 15px;
}
</style>
