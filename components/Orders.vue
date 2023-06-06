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
      class="order-wrapper w-[344px] relative mb-3"
    >
      <div
        @click="editOrder(order)"
        v-if="!order.isEditing"
        class="edit-icon absolute right-[-0.5rem] top-[-0.5rem] z-50 cursor-pointer"
      >
        <img
          width="26"
          height="26"
          src="https://img.icons8.com/metro/26/edit.png"
          alt="edit"
          class="rounded-full p-1 bg-white border-2 border-teal-300"
          :title="lang('editOrder').value"
        />
      </div>
      <div
        class="order flex flex-col"
        :class="{
          compact: order.items.length > 12,
          'is-editing': order.isEditing,
        }"
      >
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
const notifications = inject('notifications');

const { isEditingOrder } = inject('appStates');

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
  if (isEditingOrder.value) {
    notifications.value.pushNoti({
      type: 'error',
      message: lang('alreadyEditing'),
    });
    return;
  }
  isEditingOrder.value = true;
  order = deepClone(order);
  currentOrder.items = order.items;
  currentOrder.status = order.status;
  currentOrder.id = order.id;
  currentOrder.status = 'Ordering';
  currentOrder.isEditing = true;
  // set all isEditing to false
  allOrders.value.forEach((o) => (o.isEditing = false));
  // Find order in orders and set isEditing to true
  const index = allOrders.value.findIndex((o) => o.id === order.id);
  allOrders.value[index].isEditing = true;
};

const reorder = (order) => {
  order = deepClone(order);
  allOrders.value.push(order);
};
</script>
<style></style>
