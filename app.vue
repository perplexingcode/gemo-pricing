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
    <div v-if="APP.development" class="development py-5 card">
      <div class="flex items-center">
        <h1 class="text-lg font-bold">Development</h1>
        <button @click="APP.isShownDevelopment = !APP.isShownDevelopment">
          {{ APP.isShownDevelopment ? '-' : '+' }}
        </button>
      </div>
      <div v-show="APP.isShownDevelopment">
        <div class="change-order-status">
          <div class="flex">
            <select v-model="selectedOrder.id">
              <option v-for="order in orders" :key="order.id">
                {{ order.id }}
              </option>
            </select>
            <select v-model="selectedOrder.status">
              <option
                v-for="status in ['Ordering', 'Received', 'Processing', 'Done']"
                :key="status"
              >
                {{ status }}
              </option>
            </select>
            <button @click="changeOrderStatus">
              {{ selectedOrder.status || '<- Select action' }}
            </button>
          </div>
        </div>
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
            name="APP
        "
            :value="APP"
          />
        </div>
        <div class="flex flex-col">
          <textarea
            class="min-h-[100px] min-w-[250px]"
            v-model="APP.log"
            placeholder="Log"
            style="resize: both"
          />
          <Json title="Watch" :value="APP.testVar" />
        </div>

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
import { deepClone } from './static/util';

const sessionToken = ref(null);

const APP = reactive({
  //<< DEV
  development: false,
  isShownDevelopment: false,
  log: '',
  testVar: null,
  // >>
  isLoggedIn: true,
  isEditingOrder: false,
  cancelConfirm: false,
  rateOrder: false,
  isShownLoginBox: false,
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
    isShownOptions: false,
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
    if (window.location.search === '?dev') APP.development = true;

    // get sessionToken from cookie
    sessionToken.value = Cookies.get('sessionToken') || null;

    // All orders
    orders.value = await getCloudOrders();

    // fetch session data from server
    // if (!sessionToken.value) return; // DEV
    const cloudSession = await db.get.session();
    if (!cloudSession) {
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
provide('lang', lang);
provide('sessionToken', sessionToken);
provide('notifications', notifications);
provide('session', session);
provide('user', user);
provide('order', order);
provide('orders', orders);
provide('sortOrder', sortOrder);
provide('db', db);
provide('APP', APP);

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
  // return (await getById('wunderbar_session', session.id)).data._rawValue;
  // TODO:
  return null;
}

async function getCloudOrders() {
  return (
    await query('wunderbar_order', 'userId', session.id)
  ).data._rawValue.map((order) => ({
    ...order,
    state: {
      isEditing: false,
      isShownOptions: false,
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

// Force order status
const selectedOrder = reactive({
  id: null,
  status: null,
});
const changeOrderStatus = async () => {
  const index = orders.value.findIndex(
    (order) => order.id === selectedOrder.id
  );
  let order = orders.value[index];
  order.status = selectedOrder.status;
  await upsertCloudOrder(order);
  APP.testVar = order;
};
</script>
