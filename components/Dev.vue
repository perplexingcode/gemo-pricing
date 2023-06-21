<template>
  <div class="absolute left-[-1rem] top-[-1rem]">
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
<style scoped>
span.icon-dev {
  @apply h-5 w-5 bg-slate-500 text-gray-300  z-50 cursor-pointer flex items-center justify-center rounded-full;
}
</style>
