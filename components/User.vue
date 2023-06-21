<template>
  <div>
    <div class="user">
      <div
        @click="
          APP.isShownLoginBox = !APP.isShownLoginBox;
          APP.isShownMenu = !APP.isShownMenu;
        "
        class="icon-login cursor-pointer z-50"
        :title="lang('login').value"
      >
        <img src="~/assets/img/profile-64.png" />
      </div>
    </div>
    <Login />
    <div
      v-show="AUTH.isLoggedIn && APP.isShownMenu"
      class="app-menu flex flex-col z-50"
    >
      <button
        @click="
          page = 'orders';
          APP.isShownLoginBox = false;
          APP.isShownMenu = false;
        "
      >
        {{ lang('myOrders').value }}
      </button>
      <button @click="AUTH.isLoggedIn = false">
        {{ lang('logout').value }}
      </button>
    </div>
    <div
      v-show="page == 'orders'"
      class="my-orders relative flex flex-col card border-teal-300 rounded m-2 p-2 border-[3px] z-10"
    >
      <div class="header absolute flex items-center justify-between gap-5">
        <div class="btn go-back">
          <img
            @click="
              page = 'menu';
              APP.isShownMenu = true;
            "
            width="32"
            class="cursor-pointer"
            src="~/assets/img/arrow-left.png"
          />
        </div>
      </div>
      <div class="content">
        <Orders orders="userOrders" :title="lang('yourOrders').value" />
      </div>
    </div>
  </div>
</template>
<script setup>
const lang = inject('lang');
const orders = inject('orders');
const sortOrder = inject('sortOrder');
const AUTH = inject('AUTH');

const computedOrders = computed(() => {
  return orders.value.sort((a, b) => {
    // Compare the status of each order
    const statusA = sortOrder[a.status];
    const statusB = sortOrder[b.status];

    if (statusA !== statusB) {
      // Sort by status if they are different
      return statusA - statusB;
    } else {
      // Sort by date if the status is the same
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Sort in descending order (newest first)
      return dateB - dateA;
    }
  });
});

provide('userOrders', computedOrders);

const APP = inject('APP');

const page = ref('menu'); // menu, orders, profile
</script>
<style></style>
