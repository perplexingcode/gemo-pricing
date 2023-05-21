<template>
  <p>{{ obj }}</p>
  <button @click="change">CHANGE</button>
  <button @click="get">GET</button>
  <button @click="post">POST</button>
</template>
<script setup>
let obj = reactive({ data: { a: 1, b: 2 } });
console.log(obj);
const change = function () {
  obj.data.a++;
  console.log(obj);
};
const apiUrl =
  'https://vq4h0iro9k.execute-api.ap-southeast-1.amazonaws.com/locker';
const post = async function () {
  await fetch(apiUrl + '/upsert/' + 'test', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(obj),
  });
};
const get = async function () {
  const res = await fetch(apiUrl + '/get/' + 'test');
  const data = await res.json();
  console.log(data);
  obj.data = data.data;
};
</script>
<style></style>
