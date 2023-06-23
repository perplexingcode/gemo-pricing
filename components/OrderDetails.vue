<template>
  <div class="invoice m-auto">
    <div class="border h-fit">
      <div class="text-center">
        <h1 class="text-xl font-bold">
          {{ APP?.isEditingOrder ? lang('editingOrder').value : props.title }}
        </h1>
      </div>
      <div class="invoice-items">
        <div
          v-for="(item, index) in props.order.items"
          :key="item.id"
          class="flex"
          :data-tooltip="item.description"
        >
          <div class="invoice-item-name">
            <p>{{ item.name }}</p>
          </div>
          <div class="invoice-dots"></div>
          <p>${{ item.price }}</p>
          <p
            @click="props.order.items.splice(index, 1)"
            v-if="props.editable"
            class="delete-item pl-2 cursor-pointer"
          >
            X
          </p>
        </div>
      </div>
      <p v-if="props.order.items.length" class="text-xs text-center">
        {{ lang('hoverItem').value }}
      </p>
      <hr class="mt-1 mb-1" />
      <div class="invoice-tax flex">
        <div class="invoice-item-name">
          <p>{{ lang('tax').value }} ({{ Math.floor(tax * 10000) / 100 }}%)</p>
        </div>
        <div class="invoice-dots"></div>
        <p>${{ Math.floor(props.order.priceBeforeTax * tax * 100) / 100 }}</p>
      </div>
      <div class="invoice-total flex">
        <p>{{ lang('total').value }}</p>
        <div class="invoice-dots"></div>
        <p>${{ props.order.price }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { tax } from '~/static/config';

const APP = inject('APP');

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  editable: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const lang = inject('lang');
</script>
<style></style>
