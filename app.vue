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
    <div
      v-if="notifications.length > 0"
      class="notifications p-3 fixed sm:top-5 top-12 left-0 right-0 z-10 w-fit m-auto text-center"
    >
      <div
        v-for="(noti, index) in notifications"
        :key="noti"
        class="w-fit m-auto"
      >
        <div
          v-if="noti?.message"
          class="p-2 mb-3 bg-yellow-300 rounded sm:w-80 w-90 m-auto border-2 border-green-900"
          :class="'noti-' + noti.type"
          @click="removeNotification(index)"
        >
          <p>
            {{ noti.message }}
          </p>
        </div>
      </div>
    </div>
    <NuxtPage />
    <div v-if="development" class="development py-5 card">
      <div class="flex items-center">
        <h1 class="text-lg font-bold">Development</h1>
        <button @click="showDevelopment = !showDevelopment">
          {{ showDevelopment ? '-' : '+' }}
        </button>
      </div>
      <div v-show="showDevelopment">
        <div class="flex">
          <button @click="resetSession">Reset session</button>
          <button @click="notifications.pushNoti('wtf')">Add Noti</button>
        </div>
        <p class="py-1">{{ session.status }}</p>
        <div class="flex">
          <!-- <Json name="Log" :value="log" /> -->
          <Json name="Session" :value="session" />
          <Json name="User" :value="user" />
          <Json name="Order" :value="order" />
          <Json name="Orders" :value="orders" />
          <Json name="Noti" :value="notifications" />
          <Json
            name="appStates
        "
            :value="appStates"
          />
        </div>
        <input v-model="testVar" />
        <!-- expanded -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { v4 } from 'uuid';

import Cookies from 'js-cookie';
import dict from '~/static/dictionary.js';

import {
  getAll,
  getById,
  getByIdProjection,
  upsert,
  query,
} from '~/static/db.js';

//<< DEV
const development = ref(false);
const showDevelopment = ref(true);
const log = ref('');
const testVar = ref(0);
// >>

const sessionToken = ref(null);

const appStates = reactive({
  isEditingOrder: false,
});

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
const lang = function (key, counter) {
  try {
    if (!key) return;
    if (!dict[key]) return key;
    if (!dict[key][session.language]) return key;
    if (counter && session.language === 'EN')
      return counter > 1
        ? computed(() => dict[key][session.language].plural)
        : computed(() => dict[key][session.language].singular);
    return computed(() => dict[key][session.language]);
  } catch (error) {
    return key;
  }
};

// NOTIFICATIONS
const notifications = ref([
  // { id: v4(), message: 'ok', type: 'info' }
]);
// SESSION, USER, ORDERS
const session = reactive({
  id: 'danchoiasia',
  language: 'EN',
  customer: null,
  table: null,
  item: { type: '' },
});

const user = reactive({
  id: null,
  name: null,
  email: null,
  avatar: null,
  orders: {},
});

const order = reactive({
  id: v4(),
  userId: 'danchoiasia',
  status: 'Ordering',
  items: [],
  price: 0,
  priceBeforeTax: 0,
  table: computed(() => session.table),
  customer: computed(() => session.customer),
  state: {
    isEditing: false,
  },
});

const orders = ref([]);

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

// SYNC WITH CLOUD
onMounted(async () => {
  nextTick(async () => {
    //dev mode
    if (window.location.search === '?dev') development.value = true;

    // get sessionToken from cookie
    sessionToken.value = Cookies.get('sessionToken') || null;

    // fetch session data from server
    // if (!sessionToken.value) return; // DEV
    const cloudSession = await db.get.session();
    // console.log(cloudSession);
    if (!cloudSession.id) {
      session.id = v4();
      session.status = 'Ordering';
      session.language = 'EN';
      return;
    }
    session.id = cloudSession.id;
    session.language = cloudSession.language;
    session.item = cloudSession.item;
    session.customer = cloudSession.customer;
    session.table = cloudSession.table;

    // All orders
    orders.value = await getCloudOrders();
  });
});

const sortOrder = {
  Processing: 0,
  Ordering: 1,
  Received: 2,
  Done: 3,
  Cancelled: 4,
};

setInterval(function () {
  // if (!sessionToken.value) {
  //   return;
  // }
  // if (testVar.value < 10) {
  //   db.get.orderStatus();
  //   db.get.orders();
  //   if (development.value) {
  //     testVar.value++;
  //   }
  // }
}, 2000);

// PROVIDES
provide('development', development);
provide('lang', lang);
provide('sessionToken', sessionToken);
provide('notifications', notifications);
provide('session', session);
provide('user', user);
provide('order', order);
provide('orders', orders);
provide('sortOrder', sortOrder);
provide('db', db);
provide('appStates', appStates);

//
Array.prototype.pushWithId = function (...items) {
  items.forEach((item) => {
    const itemWithId = {
      id: v4(),
      ...item,
    };
    Array.prototype.push.call(this, itemWithId);
  });
};

Array.prototype.pushNoti = function (noti) {
  if (!noti) return;
  const notiWithId = {
    id: v4(),
    message: noti.message || noti,
    type: noti.type || 'info',
  };
  Array.prototype.push.call(this, notiWithId);
};

// FUNCTION DECLARATIONS

const removeNotification = (index) => {
  delete notifications.value[index];
};

// Get
async function getCloudSession() {
  return (await getById('wunderbar_session', session.id)).data._rawValue;
}

async function getCloudOrders() {
  return (
    await query('wunderbar_order', 'userId', session.id)
  ).data._rawValue.map((order) => ({
    ...order,
    state: {
      isEditing: false,
    },
  }));
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
    notifications.value.pushNoti(lang('orderProcessing'));
    session.status = 'Processing';
  }
  if (orderStatus === 'Done' && session.status !== 'Done') {
    notifications.value.pushNoti(lang('orderCompleted'));
    session.status = 'Done';
  }
}

// Upsert
async function upsertCloudSession() {
  return await upsert('wunderbar_session', session);
}

async function upsertCloudOrder(order) {
  return await upsert('wunderbar_order', order);
}

async function upsertCloudUser() {
  return await upsert('wunderbar_user', user);
}

// DEV : Reset sesssion
const resetSession = () => {
  session.id = '';
  session.customer = '';
  session.table = '';
  session.language = 'EN';
  orders.value = [];

  db.upsert.session();
  db.upsert.user();
  db.upsert.order();
};
</script>
