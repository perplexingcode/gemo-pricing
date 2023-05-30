<template>
  <div>
    <NuxtPage />
  </div>
</template>
<script setup>
const sessionToken = ref(null);
provide('sessionToken', sessionToken);
</script>
