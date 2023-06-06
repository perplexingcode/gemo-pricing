<template>
  <div class="orders p-3">
    <div class="header">
      <h1 v-if="props.title" class="text-lg font-bold">
        {{ props.title }}
      </h1>
    </div>
    <div
      v-for="order in orders"
      :key="order.id"
      class="order flex flex-col"
      :class="{ compact: order.items.length > 12 }"
    >
      <div class="edit-icon">
        <img
          width="26"
          height="26"
          src="https://img.icons8.com/metro/26/edit.png"
          alt="edit"
          class="icon-circle"
        />
      </div>
      <div class="header flex">
        <div class="order-items-wrapper">
          <div
            class="order-items flex flex-col"
            :class="{ 'big-icon': order.items.length <= 3 }"
          >
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex order-item"
              :data-tooltip="item.description"
            >
              <div class="img-wrapper">
                <img
                  :src="
                    order.items.length <= 3
                      ? items[item.key].img.replace('/48/', '/64/')
                      : items[item.key].img
                  "
                />
              </div>
            </div>
          </div>
          <div v-if="order.items.length > 12" class="items-more">
            <p>
              +{{
                order.items.length -
                12 +
                ' ' +
                lang('itemMore', order.items.length - 12).value
              }}
            </p>
          </div>
        </div>
        <div class="order-buttons" :class="order.status.toLowerCase()">
          <div
            class="w-full flex items-center justify-center"
            :class="['order-status']"
          >
            <p>{{ lang(order.status.toLowerCase()).value }}</p>
          </div>
          <div
            class="w-full flex flex-col items-center justify-center text-xs cursor-pointer"
            :class="['order-detail-btn', order.status.toLowerCase()]"
            @click="doOrderAction(order)"
          >
            <p v-if="statusActions[order.status]">
              {{ lang(statusActions[order.status]).value }}
            </p>
          </div>
        </div>
      </div>
      <div class="details">
        <h1 class="text-xl bg-teal-500">Ai cha dan choi</h1>
      </div>
    </div>
  </div>
</template>
<script setup>
import { deepClone } from '~/static/util';

const props = defineProps({
  orders: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
});
const lang = inject('lang');
const items = inject('items');
const orders = inject(props.orders);
const allOrders = inject('orders');
const currentOrder = inject('order');

const statusActions = {
  Received: 'editOrder',
  Processing: '',
  Done: 'reorder',
  Cancelled: 'feedback',
};

const doOrderAction = (order) => {
  switch (order.status) {
    case 'Received':
      editOrder(order);
      break;
    case 'Processing':
      break;
    case 'Done':
      reorder(order);
      break;
    case 'Cancelled':
      feedback();
      break;
    default:
      break;
  }
};

const editOrder = (order) => {
  order = deepClone(order);
  currentOrder.items = order.items;
  currentOrder.status = order.status;
  currentOrder.id = order.id;
  currentOrder.status = 'Ordering';
  currentOrder.isEditing = true;
};

const reorder = (order) => {
  order = deepClone(order);
  allOrders.value.push(order);
};
</script>
<style></style>
