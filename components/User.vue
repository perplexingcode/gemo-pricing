<template>
  <div>
    <div class="user">
      <div
        class="icon-login cursor-pointer z-50 relative"
        :title="lang('login').value"
      >
        <img
          @click="
            APP.isShownLoginBox = !APP.isShownLoginBox;
            APP.isShownMenu = !APP.isShownMenu;
          "
          class="w-[48px]"
          src="~/assets/img/profile-64.png"
        />
        <div
          class="absolute bottom-[-75px] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <button
            v-if="AUTH.isLoggedIn"
            @click="AUTH.isLoggedIn = false"
            class="text-sm"
          >
            {{ lang('logout').value }}
          </button>
          <button
            v-if="!AUTH.isLoggedIn && !APP.isShownLoginBox"
            @click="APP.isShownLoginBox = true"
            class="text-sm"
          >
            {{ lang('login').value }}
          </button>
          <img
            v-if="AUTH.isLoggedIn"
            @click="
              APP.isShownLoginBox = !APP.isShownLoginBox;
              APP.isShownMenu = !APP.isShownMenu;
            "
            class="w-[36px] absolute top-[-23px] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            src="https://img.icons8.com/external-flat-icons-inmotus-design/67/external-beach-bocals-flat-icons-inmotus-design.png"
          />
        </div>
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
    </div>
    <div
      v-show="page == 'orders' && AUTH.isLoggedIn"
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
        <div
          v-if="!orders.length"
          class="no-order w-[372px] pt-[2.75rem] p-3 text-center"
        >
          <p>
            {{ lang('noOrder').value }}
          </p>
        </div>
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
