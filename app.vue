<template>
  <div>
    <div
      class="language p-3 cursor-pointer w-fit fixed sm:z-20"
      @click="toggleLanguage"
    >
      <img
        width="32"
        :src="'https://img.icons8.com/color/48/' + langCodeImg + '.png'"
      />
    </div>
    <NuxtPage />
    <div v-if="development" class="development py-5 card">
      <button @click="resetSession">Reset session</button>
      <p class="py-1">{{ session.status }}</p>
      <div class="flex">
        <Json name="Session" :value="session" />
        <Json name="Log" :value="log" />
        <Json name="User" :value="user" />
        <Json name="Orders" :value="orders" />
      </div>
      <input v-model="testVar" />
      <!-- expanded -->
    </div>
  </div>
</template>
<script setup>
import { v4 } from 'uuid';

import Cookies from 'js-cookie';
import dict from '~/static/dictionary.js';

import { upsert, getById, getAll } from '~/static/db.js';

//<< DEV
const development = ref(false);
const log = ref('');
const testVar = ref(0);
// >>

const sessionToken = ref(null);

// MULTI LANGUAGE
const langCodeImg = computed(() => {
  const langCodeImgs = {
    EN: 'usa',
    VN: 'vietnam',
  };
  return langCodeImgs[session.language];
});
const languages = ['EN', 'VN'];
const toggleLanguage = () => {
  session.language = languages[0];
  languages.shift();
  languages.push(session.language);
  session.language = languages[0];
};
const lang = function (key) {
  try {
    return computed(() => dict[key][session.language]);
  } catch (error) {
    return key;
  }
};

// NOTIFICATIONS
const notifications = ref([{ id: 'ok' }]);

// SESSION, USER, ORDERS
const session = reactive({
  id: null,
  language: 'EN',
  customer: null,
  table: null,
  item: { type: '' },
  orderId: null,
});

const user = reactive({
  id: null,
  name: null,
  email: null,
  avatar: null,
  orders: {},
});

const orders = reactive({});

// DATABASE
const db = {
  get: {
    session: getCloudSession,
    orders: getCloudOrders,
    user: getCloudUser,
    order: getCloudOrder,
    orderStatus: getCloudOrderStatus,
  },
  upsert: {
    session: upsertCloudSession,
    order: upsertCloudOrder,
    user: upsertCloudUser,
  },
};

onMounted(async () => {
  //dev mode
  if (window.location.search === '?dev') development.value = true;

  // get sessionToken from cookie
  sessionToken.value = Cookies.get('sessionToken') || null;

  // fetch session data from server
  if (!sessionToken.value) return;

  const cloudSession = await getCloudSession();
  if (!cloudSession.id) {dt8y1wjnhnhi
    session.id = v4();
    session.status = 'Ordering';
    session.language = 'EN';
    return;
  }
  session.id = cloudSession.id;
  session.customer = cloudSession.customer;
  session.table = cloudSession.table;
  session.language = cloudSession.language;

  // Order history
  await getCloudOrders();
});

setInterval(function () {
  if (!sessionToken.value) {
    return;
  }
  if (testVar.value < 10) {
    db.get.orderStatus();
    db.get.orders();
    if (development.value) {
      testVar.value++;
    }
  }
}, 2000);

// PROVIDES
provide('development', development);
provide('lang', lang);
provide('sessionToken', sessionToken);
provide('notifications', notifications);
provide('session', session);
provide('user', user);
provide('orders', orders);
provide('db', db);

// FUNCTION DECLARATIONS

// Get
async function getCloudSession(id) {
  return await getById('wunderbar_session', id || session.id);
}

async function getCloudOrders() {
  return await getAll('wunderbar_order');
}

async function getCloudUser(id) {
  return await getById('wunderbar_user', id || user.id);
}

async function getCloudOrder(id) {
  return await getById('wunderbar_order', id || session.order.id);
}

async function getCloudOrderStatus(id) {
  const orderStatus = await getByIdProjection(
    'wunderbar_order_status',
    id || session.order.id,
    'status'
  );

  if (orderStatus === 'Processing' && session.status !== 'Processing') {
    notifications.value.push(lang('orderProcessing'));
    session.status = 'Processing';
  }
  if (orderStatus === 'Done' && session.status !== 'Done') {
    notifications.value.push(lang('orderCompleted'));
    session.status = 'Done';
  }
}

// Upsert
async function upsertCloudSession() {
  return await upsert('wunderbar_session', session);
}

async function upsertCloudOrder() {
  return await upsert('wunderbar_order', session.order);
}

async function upsertCloudUser() {
  return await upsert('wunderbar_user', user);
}

// DEV : Reset sesssion
const resetSession = () => {
  session.id = '';
  session.customer = '';
  session.table = '';
  session.status = 'Ordering';
  session.order = { id: v4(), items: [], price: 0, priceBeforeTax: 0 };
  session.language = 'EN';
  orders = reactive({});

  updateOrderHistory();
  updateCloudSession();
  updateOrder();
};
</script>
