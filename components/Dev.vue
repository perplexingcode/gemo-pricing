<template>
  <div>
    <span class="icon-dev" v-if="APP.development" @click="showData = !showData"
      >?</span
    >
    <Json v-if="showData" :value="props.value" />
  </div>
</template>
<script setup>
const props = defineProps({
  value: {
    required: true,
  },
});
const APP = inject('APP');
const showData = ref(false);
</script>
