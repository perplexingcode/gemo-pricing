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
      class="order-wrapper w-[348px] relative mb-3"
    >
      <div
        @click="editOrder(order)"
        v-if="!order.state.isEditing && order.state.isShownOptions"
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
        :class="[
          {
            large: order.items.length > 12,
            'is-editing': order.state.isEditing,
          },
          'order',
        ]"
        class="flex flex-col gap-[10px] p-1 my-1 bg-teal-50 hover:bg-teal-300 min-h-[78px] border-2 border-green-800 rounded overflow-y-hidden"
      >
        <Dev :value="order.id" />
        <div class="header flex">
          <div class="order-items-wrapper w-[190px]">
            <div
              :class="['order-items', { 'big-icon': order.items.length <= 3 }]"
              class="grid h-[64px] mr-2 border-2 border-teal-400 rounded"
            >
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex order-item cursor-pointer"
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
              class="w-full flex items-center justify-center cursor-default"
              :class="['order-status']"
            >
              <p>{{ lang(order.status.toLowerCase()).value }}</p>
            </div>
            <div
              class="flex flex-col items-center justify-center w-full h-[28px] text-xs cursor-pointer mt-1 bg-gray-300 hover:bg-gray-300 rounded"
              :class="['btn', 'order-options', order.status.toLowerCase()]"
            >
              <span @click="handleShowOptions(order)">
                {{ lang('options').value }}
              </span>
            </div>
          </div>
        </div>
        <div v-show="order.state.isShownOptions" class="option-btns flex">
          <button
            v-if="order.status == 'Received'"
            @click="APP.cancelConfirm = true"
            class="cancel w-full bg-gray-500 hover:bg-orange-500"
          >
            {{ lang('orderCancel').value }}
          </button>
          <button
            v-if="order.status == 'Processing'"
            class="see-details w-full"
            @click="order.toggleState('isShownDetails')"
          >
            {{ lang('seeDetails').value }}
          </button>
          <button
            v-if="order.status == 'Done'"
            class="reorder w-full"
            @click="order.toggleState('isShownTableInfo')"
          >
            {{ lang('reorder').value }}
          </button>
          <button
            v-if="['Done', 'Cancelled'].includes(order.status)"
            class="rate-order w-full"
            @click="APP.rateOrder = true"
          >
            {{ lang('rateOrder').value }}
          </button>
        </div>
        <div class="option-content relative">
          <OrderDetails
            v-show="order.state.isShownDetails"
            :order="order"
            :title="lang('orderDetails').value"
          />
          <div v-show="order.state.isShownTableInfo">
            <TableInfo />
            <div class="text-center">
              <button @click="reorder">
                {{ lang('order').value }}
              </button>
            </div>
            <img
              class="absolute top-[-10px] right-0 cursor-pointer"
              @click="order.toggleState('isShownTableInfo')"
              width="26"
              height="26"
              src="https://img.icons8.com/metro/26/circled-chevron-up.png"
              alt="circled-chevron-up"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="pop-ups">
    <div v-if="APP.cancelConfirm" class="cancel-confirm text-center">
      <p>{{ lang('orderCancelConfirm').value }}</p>
      <button
        class="w-full bg-gray-500 hover:bg-orange-500"
        @click="
          cancelOrder();
          APP.cancelConfirm = false;
        "
      >
        {{ lang('orderCancel').value }}
      </button>
      <button
        class="w-full hover:bg-teal-700"
        @click="APP.cancelConfirm = false"
      >
        {{ lang('goBack').value }}
      </button>
    </div>
    <div :class="['rate-order']" class="modal" v-if="APP.rateOrder">
      <div class="flex flex-col items-center">
        <h3 class="text-lg font-bold mb-2">{{ lang('rateUs').value }}</h3>
        <div class="stars flex mb-2">
          <div v-for="n in 5" class="star" :key="n">
            <img
              v-show="review.star >= n"
              src="~/assets/img/icons8-star-32-fill.png"
              alt="star"
              @click="review.star = n"
            />
            <img
              v-show="review.star < n"
              width="32"
              height="32"
              src="~/assets/img/icons8-star-32.png"
              alt="star"
              @click="review.star = n"
            />
          </div>
        </div>
        <div>
          <textarea
            class="w-full h-[100px] p-1 border-2 border-gray-400 rounded"
            v-model="review.feedback"
            :placeholder="lang('writeFeedback').value"
          ></textarea>
        </div>
        <button @click="submitFeedback()">
          {{ lang('submit').value }}
        </button>
      </div>
      <div>
        <img
          width="24"
          height="24"
          src="https://img.icons8.com/material-two-tone/24/1D7CA4/cancel--v1.png"
          alt="close"
          class="close absolute top-[-1rem] right-[-1.5rem] cursor-pointer"
          @click="APP.rateOrder = false"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { deepClone } from '~/static/util';
import { v4 } from 'uuid';

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
const db = inject('db');

const APP = inject('APP');

const selectedOrder = ref(null);
const review = reactive({
  star: 0,
  feedback: '',
});

watchEffect(
  () => {
    const index = allOrders.value.findIndex(
      (o) => o.id === selectedOrder.value
    );
    const order = allOrders.value[index];
    if (APP.rateOrder) {
      review.star = order?.review?.star || 0;
      review.feedback = order?.review?.feedback || '';
    }
  },
  { immediate: true }
);

const handleShowOptions = (order) => {
  order.state.isShownOptions = !order.state.isShownOptions;
  selectedOrder.value = order.id;
};

const editOrder = (order) => {
  if (APP.isEditingOrder) {
    notifications.value.pushNoti({
      type: 'error',
      message: lang('alreadyEditing'),
    });
    return;
  }
  APP.isEditingOrder = true;
  order = deepClone(order);
  currentOrder.items = order.items;
  currentOrder.status = order.status;
  currentOrder.id = order.id;
  currentOrder.status = 'Ordering';
  currentOrder.state.isEditing = true;
  // set all isEditing to false
  allOrders.value.forEach((o) => (o.state.isEditing = false));
  // Find order in orders and set isEditing to true
  const index = allOrders.value.findIndex((o) => o.id === order.id);
  allOrders.value[index].state.isEditing = true;
};

const reorder = () => {
  const index = allOrders.value.findIndex((o) => o.id === selectedOrder.value);
  const order = deepClone(allOrders.value[index]);
  order.id = v4();
  order.status = 'Received';
  allOrders.value.push(order);
  db.upsert.order(order);
  notifications.value.pushNoti({
    type: 'success',
    message: lang('reorderSuccess'),
  });
};

const cancelOrder = () => {
  const index = allOrders.value.findIndex((o) => o.id === selectedOrder.value);
  allOrders.value[index].status = 'Cancelled';
  db.upsert.order(allOrders.value[index]);
  notifications.value.pushNoti(lang('orderCancelled'));
};

const submitFeedback = () => {
  const index = allOrders.value.findIndex((o) => o.id === selectedOrder.value);
  allOrders.value[index].review = review;
  db.upsert.order(allOrders.value[index]);
  APP.rateOrder = false;
  switch (review.star) {
    case 1:
      notifications.value.pushNoti({
        type: 'error',
        message: lang('feedback1'),
      });
      break;
    case 2:
      notifications.value.pushNoti({
        type: 'error',
        message: lang('feedback2'),
      });
      break;
    case 3:
      notifications.value.pushNoti({
        type: 'error',
        message: lang('feedback3'),
      });
      break;
    case 4:
      notifications.value.pushNoti({
        type: 'success',
        message: lang('feedback4'),
      });
      break;
    case 5:
      notifications.value.pushNoti({
        type: 'success',
        message: lang('feedback5'),
      });
      break;
    default:
      break;
  }
};
</script>
<style></style>
