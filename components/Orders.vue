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
            class="w-full flex flex-col items-center justify-center text-xs"
            :class="'order-detail-btn'"
            :popovertarget="'order-detail-' + order.id"
          >
            <p>{{ lang('seeDetails').value }}</p>
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
</script>
<style></style>
