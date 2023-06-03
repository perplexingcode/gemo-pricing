<template>
  <div>
    <h3>{{ props.name }}</h3>
    <JsonViewer :value="props.value" :expandDepth="10" copyable boxed sort />
  </div>
</template>
<script setup>
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
const props = defineProps({
  name: String,
  value: Object,
});
</script>
