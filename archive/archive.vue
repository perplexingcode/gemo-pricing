<template>
  <div class="flex">
    <div class="flex">
      <div class="flex gap-3 items-center">
        <button
          @click="
            addon.quantity--;
            addon.logic();
          "
          class="plus-minus"
        >
          -
        </button>
        <p>{{ addon.quantity }}</p>
        <button
          @click="
            addon.quantity++;
            addon.logic();
          "
          class="plus-minus"
        >
          +
        </button>
      </div>
      <div class="flex">
        <p class="text-xs ml-1 my-auto">
          {{ addon.description }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style></style>
