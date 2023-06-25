<template>
  <div>
    <FbAuth />
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
        </div>
        <p class="py-1">{{ session.status }}</p>
        <div class="flex">
          <!-- <Json name="Log" :value="log" /> -->
          <Json name="Session" :value="session" />
          <Json name="User" :value="user" />
          <Json name="Order" :value="order" />
          <Json name="Orders" :value="orders" />
          <Json
            name="APP
        "
            :value="APP"
          />
        </div>
        <div class="flex flex-col">
          <input v-model="APP.testVar" />
          <textarea
            class="min-h-[100px] min-w-[250px]"
            v-model="APP.log"
            placeholder="Log"
            style="resize: both"
          />
          <Json name="Watch" :value="APP.testVar" />
          <Json name="Auth" :value="AUTH" />
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

useHead({
  title: 'Wunderbar - Taste of the ocean',
  // or, instead:
  // titleTemplate: (title) => `My App - ${title}`,
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [
    { name: 'Wunderbar', content: 'Cocktails, wines, boba & delicous foods.' },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: 'https://img.icons8.com/external-flat-icons-inmotus-design/67/external-beach-bocals-flat-icons-inmotus-design.png',
    },
  ],
  // bodyAttrs: {
  //   class: 'test',
  // },
  script: [
    {
      innerHTML: `
      if (Object.prototype.toggleState) return; 
      Object.prototype.toggleState = function (key) {
  console.log('ai cha chat nhi');
  if (this?.state === undefined) {
    this.state = {};
  }
  const state = this.state;
  state[key] = !state[key];
};
`,
    },
    // {
    //   async: true,
    //   defer: true,
    //   crossorigin: 'anonymous',
    //   nonce: 'XDlzejo0',
    //   src: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0&appId=262473663130930&autoLogAppEvents=1',
    // },
  ],
});

const APP = reactive({
  //<< DEV
  development: false,
  isShownDevelopment: false,
  log: '',
  testVar: null,
  // >>
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

// TODO:

const guestUserId = generateSessionId();

// SESSION, USER, ORDERS
const session = reactive({
  id: guestUserId,
  language: 'EN',
  customer: null,
  table: null,
  item: { type: '' },
  token: null,
  loginType: null,
});

const user = reactive({
  id: guestUserId,
  name: null,
  email: null,
  avatar: null,
  orders: {},
});

// Change user
watch(
  () => user.id,
  async () => {
    session.id = user.id;
    order.userId = user.id;
    orders.value = await db.get.orders();
  }
);
const order = reactive({
  id: v4(),
  userId: user.id,
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

const AUTH = reactive({
  app: null,
  data: null,
  type: null,
  isLoggedIn: false,
  login: null,
  logout: () => {
    AUTH.isLoggedIn = false;
    user.id = v4();
    session.customer = null;
    // reset cookkie
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf('=');
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
  },
  reset: () => {
    for (const key in this) {
      if (key !== 'reset') this[key] = null;
    }
  },
});

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
  await nextTick();
  //dev mode
  if (window.location.search === '?dev') APP.development = true;

  // get sessionToken from cookie
  session.token = Cookies.get('sessionToken') || null;

  // All orders
  orders.value = await getCloudOrders();

  // fetch session data from server
  // if (!session.token) return; // DEV
  const cloudSession = await db.get.session();
  if (!cloudSession) {
    session.status = 'Ordering';
    session.language = 'EN';
    return;
  }
  session.language = cloudSession.language;
  session.item = cloudSession.item;
  session.customer = cloudSession.customer;
  session.table = cloudSession.table;
});

const sortOrder = {
  Processing: 0,
  Ordering: 1,
  Received: 2,
  Done: 3,
  Cancelled: 4,
};
setInterval(async function () {
  if (!AUTH.isLoggedIn) {
    return;
  }
  if (APP.testVar < 2 && orders.value.length > 0) {
    await nextTick();
    for (let index in orders.value) {
      const order = orders.value[index];
      if (!order?.id) continue;
      if (order.status == 'Cancelled') continue;
      APP.log += order.id + ' ' + order.status + ' --> ';
      const status = await db.get.orderStatus(order.id);
      console.log(order?.id, status);
      APP.log +=
        status +
        `
      `;
      if (status == order.status) continue;
      orders.value[index].status = status;
      switch (status) {
        case 'Received':
          notifications.value.pushNoti(lang('orderPlaced'));
          break;
        case 'Processing':
          notifications.value.pushNoti(lang('orderProcessing'));
          break;
        case 'Done':
          notifications.value.push({
            message: lang('orderCompleted'),
            type: 'success',
          });
          break;
        case 'Cancelled':
          notifications.value.push({
            message: lang('orderCancelled'),
            type: 'error',
          });
          break;
      }
    }
    if (APP.development) {
      APP.testVar++;
    }
  }
}, 2000);

// PROVIDES
provide('lang', lang);
provide('notifications', notifications);
provide('session', session);
provide('user', user);
provide('order', order);
provide('orders', orders);
provide('sortOrder', sortOrder);
provide('db', db);
provide('APP', APP);
provide('AUTH', AUTH);

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
    message: noti?.message || noti,
    type: noti?.type || 'info',
  };
  Array.prototype.push.call(this, notiWithId);
};

// FUNCTION DECLARATIONS

function generateSessionId() {
  return v4();
}

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
  return (await query('wunderbar_order', 'userId', user.id)).data._rawValue.map(
    (order) => ({
      ...order,
      state: {
        isEditing: false,
        isShownOptions: false,
      },
    })
  );
}

async function getCloudUser(id) {
  return await getById('wunderbar_user', id || user.id);
}

async function getCloudOrder(id) {
  return await getById('wunderbar_order', id || session.order.id);
}

async function getCloudOrderStatus(id) {
  const orderStatus = await getByIdProjection('wunderbar_order', id, 'status');
  return orderStatus.data._rawValue.status;
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
