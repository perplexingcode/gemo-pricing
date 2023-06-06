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
  <!--  -->
  <button
    v-if="order.status == 'Received'"
    @click="UI.cancelConfirm = true"
    class="btn-cancel"
  >
    {{ lang('orderCancel').value }}
  </button>
  <button v-if="order.status == 'Processing'" disabled class="btn-processing">
    {{ lang('orderProcessingButton').value }}
  </button>
  <button
    v-if="order.status == 'Cancelled' || order.status == 'Done'"
    @click="newOrder"
    class="btn-new-order"
  >
    {{ lang('orderNew').value }}
  </button>
</template>
<script setup></script>
<style></style>
