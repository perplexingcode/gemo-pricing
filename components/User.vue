<template>
  <div>
    <div class="user">
      <div
        @click="APP.isShownLoginBox = !APP.isShownLoginBox"
        class="icon-login cursor-pointer z-50"
        :title="lang('login').value"
      >
        <img src="~/assets/img/profile-64.png" />
      </div>
    </div>
    <Transition :appear="true" name="fade">
      <div v-show="APP.isShownLoginBox && !APP.isLoggedIn" class="login-box">
        <h3 class="font-bold ml-[-0.5rem] mt-[-0.25rem]">Login</h3>
        <div class="input-group mb-2">
          <label>{{ lang('username').value }}</label>
          <input
            type="text"
            v-model="username"
            :placeholder="lang('username').value"
          />
        </div>
        <div class="input-group">
          <label>{{ lang('password').value }}</label>
          <input
            type="password"
            v-model="password"
            :placeholder="lang('password').value"
          />
        </div>
        <div v-if="isSignup" class="input-group">
          <label>{{ lang('passwordConfirm').value }}</label>
          <input
            type="password"
            v-model="passwordConfirm"
            :placeholder="lang('passwordConfirm').value"
          />
        </div>
        <button @click="doLogin">{{ lang('login').value }}</button>
        <button @click="doSignup">{{ lang('signup').value }}</button>
      </div>
    </Transition>
    <div
      v-show="APP.isLoggedIn && page == 'menu'"
      class="app-menu flex flex-col z-50"
    >
      <button
        @click="
          page = 'orders';
          APP.isShownLoginBox = false;
        "
      >
        {{ lang('myOrders').value }}
      </button>
      <button @click="APP.isLoggedIn = false">
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
            @click="page = 'menu'"
            width="32"
            class="cursor-pointer"
            src="~/assets/img/arrow-left.png"
          />
        </div>
      </div>
      <div class="content">
        <div class="orders">
          <div class="header">
            <h4 class="font-bold">{{ lang('yourOrders').value }}</h4>
          </div>
          <div class="content">
            <Orders orders="userOrders" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';

const lang = inject('lang');
const sessionToken = inject('sessionToken');
const orders = inject('orders');

const sortOrder = inject('sortOrder');
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

const username = ref('buisondong20@gmail.com');
const password = ref('Token@00');
const passwordConfirm = ref('Token@00');

const APP = inject('APP');

const isSignup = ref(false);
const page = ref('menu'); // menu, orders, profile

APP.testVar = page;

const doLogin = async function () {
  if (isSignup.value) {
    isSignup.value = false;
    return;
  }
  try {
    const response = await axios.post(
      'https://wunder-bar.us.auth0.com/oauth/token',
      {
        grant_type: 'password',
        username: username.value,
        password: password.value,
        audience:
          'https://vq4h0iro9k.execute-api.ap-southeast-1.amazonaws.com/',
        client_id: 'zbV2i7N84aLgsOjvnbRNtlFCF6SZLWeS',
        client_secret:
          'netIEIcExh63UqkqfkUP5Hi68GkyapNszAxdErEXuZpcmYpRDCjMeIqR-gwklFkJ',
      }
    );

    console.log(response.data);
    Cookies.set('sessionToken', response.data.access_token, { expires: 7 });
    // Use the access token from the response for API calls or other operations
  } catch (error) {
    console.error(error);
  }
};

const doSignup = async function () {
  if (!isSignup.value) {
    isSignup.value = true;
    return;
  }
  try {
    const response = await axios.post(
      'https://wunder-bar.us.auth0.com/dbconnections/signup',
      {
        client_id: 'zbV2i7N84aLgsOjvnbRNtlFCF6SZLWeS',
        email: username.value,
        connection: 'Username-Password-Authentication',
        password: password.value,
      }
    );

    sessionToken.value = response.data.access_token;
    // Use the access token from the response for API calls or other operations
  } catch (error) {
    console.error(error);
  }
};
</script>
<style></style>
