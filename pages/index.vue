<template>
  <ClientOnly>
    <div id="main-wrap" class="">
      <div
        class="language p-3 cursor-pointer w-fit fixed sm:z-20"
        @click="toggleLanguage"
      >
        <img
          width="32"
          :src="'https://img.icons8.com/color/48/' + langCodeImg + '.png'"
        />
      </div>
      <div class="header text-center p-3">
        <div
          v-if="notifications.length > 0"
          class="notifications p-3 fixed sm:top-5 top-12 left-0 right-0 z-10"
        >
          <div v-for="(noti, index) in notifications" :key="noti.id">
            <div
              v-if="noti.value"
              class="p-2 mb-3 bg-yellow-300 rounded sm:w-80 w-90 m-auto border-2 border-green-900"
              @click="notifications.splice(index, 1)"
            >
              <p>
                {{ noti.value }}
              </p>
            </div>
          </div>
        </div>
        <h1 class="sm:mb-5 sm:mt-20 mt-10 mb-2 app-title text-yellow-200">
          Wunder bar
        </h1>
      </div>
      <div class="content mx-auto w-fit flex sm:gap-10 flex-col sm:flex-row">
        <transition name="height-transition" mode="out-in">
          <div class="item-details card">
            <div class="nav flex justify-around items-center">
              <div>
                <img
                  v-if="step === 2"
                  @click="backStep"
                  width="32"
                  class="go-back cursor-pointer"
                  src="~/assets/img/arrow-left.png"
                />
                <img
                  v-else
                  @click="backStep"
                  width="32"
                  class="go-back cursor-pointer"
                  src="~/assets/img/arrow-left-white.png"
                />
              </div>
              <div class="flex justify-center text-lg font-bold">
                <div
                  class="step"
                  :class="{ active: step === 1, hidden: step !== 1 }"
                >
                  <div class="text">
                    {{ lang('selectItem').value }}
                  </div>
                </div>
                <div
                  class="step"
                  :class="{ active: step === 2, hidden: step !== 2 }"
                >
                  <div class="text">
                    {{ lang('selectOptions').value }}
                  </div>
                </div>
              </div>
              <div class="btn-wrapper plus-minus">
                <img
                  v-if="step === 1 && currentItem.type"
                  @click="nextStep"
                  width="32"
                  class="go-next cursor-pointer"
                  src="~/assets/img/arrow-right.png"
                />
                <img
                  v-else
                  @click="backStep"
                  width="32"
                  class="go-back cursor-pointer"
                  src="~/assets/img/arrow-right-white.png"
                />
              </div>
            </div>
            <div
              class="current-item-mobile text-center sm:hidden block"
              v-if="currentItem.type && step == 2"
            >
              <p>{{ currentItem.name }}</p>
              <span class="price"> ${{ currentItem.price }} </span>
              <span
                class="text-xs price"
                v-if="currentItem.price != currentItem.basePrice"
                >{{ '  ($' + currentItem.basePrice + ')' }}</span
              >
            </div>
            <div
              v-if="currentItem.type"
              class="current-item card m-auto outline-3 outline-teal-300 outline sm:block hidden"
              @dblclick="addItem"
            >
              <div class="flex flex-col text-center">
                <h3>{{ lang('currentItem').value }}</h3>
                <img
                  width="48"
                  height="48"
                  :src="currentItem.img"
                  :alt="currentItem.name"
                  class="m-auto"
                />
                <div class="flex flex-col">
                  <h3>{{ currentItem.name }}</h3>
                  <div class="flex flex-col">
                    <span class="price"> ${{ currentItem.price }} </span>
                    <!-- <span class="text-xs price">{{
                      '  ($' + currentItem.basePrice + ')'
                    }}</span> -->
                  </div>
                </div>
              </div>
            </div>

            <div class="step-1" v-show="step === 1">
              <div class="menu">
                <div class="menu-list drink">
                  <h3 class="ml-2">{{ lang('drink').value }}</h3>
                  <div class="flex list-items">
                    <div
                      v-for="item in drinks"
                      class="item text-center"
                      :class="{ active: currentItem.key === item.key }"
                      @click="
                        selectItem(item);
                        currentItem.key !== item.key ? resetOptions() : null;
                      "
                      :key="item.name"
                    >
                      <div v-if="item.type === 'drink'">
                        <img
                          width="48"
                          height="48"
                          :src="item.img"
                          :alt="item.name"
                          class="m-auto"
                        />
                        <label>{{ item.name.value }}</label>
                        <p class="price text-sm">(${{ item.basePrice }})</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="menu-list food">
                  <h3 class="ml-2">{{ lang('food').value }}</h3>
                  <div class="list-items flex">
                    <div
                      v-for="item in foods"
                      class="item text-center"
                      :class="{ active: currentItem.key === item.key }"
                      @click="selectItem(item)"
                      :key="item.name"
                    >
                      <div v-if="item.type === 'food'">
                        <img
                          width="48"
                          height="48"
                          :src="item.img"
                          :alt="item.name"
                          class="m-auto"
                        />
                        <label>{{ item.name.value }}</label>
                        <p class="price text-sm">(${{ item.basePrice }})</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="step-2" v-show="step === 2">
              <div class="options flex flex-col">
                <div
                  v-for="option in currentItem.options"
                  :key="option.name"
                  :class="option.key"
                >
                  <h4 class="ml-1">{{ option.name }}</h4>
                  <div class="flex text-center">
                    <div
                      v-for="value in option.values"
                      :key="value.key"
                      class="option flex flex-col border"
                      @click="selectOption(option, value)"
                      :data-tooltip="value.disabled ? value.tooltip : null"
                    >
                      <label>{{ value.name }}</label>
                      <span
                        class="text-xs pb-1 price"
                        :style="{ opacity: value.price !== 0 ? '1' : '1' }"
                        >{{
                          value.price
                            ? '($' + value.price + ')'
                            : lang('free').value
                        }}</span
                      >
                      <input
                        type="radio"
                        :name="option.name"
                        :for="option.key"
                        :disabled="value.disabled"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="addons flex flex-col">
                <div
                  v-for="addon in currentItem.addons"
                  :key="addon.name"
                  :class="addon.key"
                >
                  <h4 class="ml-1">{{ addon.name }}</h4>
                  <p class="text-xs ml-1 price" v-if="addon.showBasePrice">
                    {{ '($' + addon.basePrice + ')' }}
                  </p>
                  <div class="text-xs ml-1" v-html="addon.description"></div>
                  <p class="text-xs ml-1 price" v-if="addon.quantity">
                    {{ 'Total: $' + addon.price }}
                  </p>
                  <div class="flex">
                    <img :src="addon.img" />
                    <div class="flex gap-3 items-center">
                      <button
                        @click="
                          addon.quantity--;
                          addon.logic();
                        "
                        class="plus-minus"
                      >
                        -
                      </button>
                      <p>{{ addon.quantity }}</p>
                      <button
                        @click="
                          addon.quantity++;
                          addon.logic();
                        "
                        class="plus-minus"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="add-item">
                <button @click="addItem" :disabled="!optionsSelected">
                  {{ lang('addItem').value }}
                </button>
              </div>
            </div>
          </div>
        </transition>
        <div class="order-details">
          <div class="invoice">
            <div class="border h-fit">
              <div class="text-center">
                <h1 v-if="orderStatus == 'ordering'" class="text-xl font-bold">
                  {{ lang('checkout').value }}
                </h1>
                <h1
                  v-if="
                    orderStatus == 'processing' || orderStatus == 'received'
                  "
                  class="text-xl font-bold"
                >
                  {{ lang('orderPlaced').value }}
                </h1>
              </div>
              <div class="invoice-items">
                <div v-for="item in order.items" :key="item.id" class="flex">
                  <div class="invoice-item-name">
                    <p>{{ item.name }}</p>
                  </div>
                  <div class="invoice-dots"></div>
                  <p>${{ item.price }}</p>
                </div>
              </div>
              <hr />
              <div class="invoice-tax flex">
                <div class="invoice-item-name">
                  <p>
                    {{ lang('tax').value }} ({{
                      Math.floor(tax * 10000) / 100
                    }}%)
                  </p>
                </div>
                <div class="invoice-dots"></div>
                <p>
                  ${{
                    Math.floor(
                      order.items.reduce(
                        (total, item) => total + item.price,
                        0
                      ) *
                        tax *
                        100
                    ) / 100
                  }}
                </p>
              </div>
              <div class="invoice-total flex">
                <p>{{ lang('total').value }}</p>
                <div class="invoice-dots"></div>
                <p>
                  ${{
                    Math.floor(
                      order.items.reduce(
                        (total, item) => total + item.price,
                        0
                      ) *
                        (1 + tax) *
                        100
                    ) / 100
                  }}
                </p>
              </div>
            </div>
          </div>
          <div v-if="orderStatus == 'ordering'" class="flex flex-col customer">
            <input
              class="customer-name"
              v-model="customer.name"
              :placeholder="lang('yourName').value"
            />
            <select v-model="customer.table">
              <option disabled value="">{{ lang('yourTable').value }}</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <div
            v-if="orderStatus == 'processing' || orderStatus == 'received'"
            class="pl-3"
          >
            <p>Table: {{ customer.table }}</p>
            <p>Name: {{ customer.name }}</p>
          </div>
          <div class="text-center">
            <button
              v-if="orderStatus == 'ordering'"
              @click="placeOrder"
              :disabled="customer.table === '' || order.items.length === 0"
            >
              {{ lang('order').value }}
            </button>
            <button
              v-if="orderStatus == 'processing' || orderStatus == 'received'"
              @click="showCancelConfirm = true"
              class="cancel-button"
            >
              {{ lang('orderCancel').value }}
            </button>
            <button
              v-if="orderStatus == 'cancelled'"
              @click="newOrder"
              class="btn-new-order"
            >
              {{ lang('orderNew').value }}
            </button>
            <div v-if="showCancelConfirm" class="cancel-confirm">
              <p>{{ lang('orderCancelConfirm').value }}</p>
              <button
                @click="
                  cancelOrder();
                  showCancelConfirm = false;
                "
              >
                {{ lang('orderCancel').value }}
              </button>
              <button @click="showCancelConfirm = false">
                {{ lang('goBack').value }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="development" class="development py-5 card">
        <p class="py-1">{{ orderStatus }}</p>
        <div class="flex">
          <h3>order</h3>
          <JsonViewer :value="order" :expandDepth="10" copyable boxed sort />
          <h3>order backend</h3>
          <JsonViewer
            :value="orderBackend"
            :expandDepth="10"
            copyable
            boxed
            sort
          />
          <h3>log</h3>
          <JsonViewer :value="log" :expandDepth="10" copyable boxed sort />
          <h3>current-item</h3>
          <JsonViewer
            :value="currentItem"
            :expandDepth="10"
            copyable
            boxed
            sort
          />
          <h3>sessionData</h3>
          <JsonViewer
            :value="sessionData"
            :expandDepth="10"
            copyable
            boxed
            sort
          />
        </div>
        <input v-model="testVar" />
        <!-- expanded -->
      </div>
    </div>
  </ClientOnly>
</template>
<script setup>
// << DEV
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';

import { v4 } from 'uuid';
import dict from '~/static/dictionary.js';
//<< DEV
const log = ref('');
const development = ref(true);
const testVar = ref(0);
// >>

const tax = 0.0725;

const langCodeImg = computed(() => {
  const langCodeImgs = {
    EN: 'usa',
    VN: 'vietnam',
  };
  return langCodeImgs[langCode.value];
});
const languages = ['EN', 'VN'];
const langCode = ref(languages[0]);
const toggleLanguage = () => {
  langCode.value = languages[0];
  languages.shift();
  languages.push(langCode.value);
  langCode.value = languages[0];
};

const lang = function (key, isTemplate) {
  try {
    return computed(() => dict[key][langCode.value]);
  } catch (error) {
    return key;
  }
};

const notifications = ref([{ id: 'ok' }]);

const customer = ref({ name: '', table: '' });

// API
const lockerOrder = 'wunderbar_order';
const lockerSession = 'wunderbar_session';
const apiUrl =
  'https://vq4h0iro9k.execute-api.ap-southeast-1.amazonaws.com/locker';
function updateOrder(order) {
  fetch(apiUrl + '/upsert/' + lockerOrder, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(order),
  });
}

// SESSION
const session = reactive({
  id: '',
  customer: '',
  table: '',
  status: '',
  order: {},
});
//
onMounted(async () => {
  const cloudSession = await getSessionData();
  if (!cloudSession.id) {
    session.id = v4();
    session.status = 'ordering';
    return;
  }
  session.id = cloudSession.id;
  session.customer = cloudSession.customer;
  session.table = cloudSession.table;
  session.status = cloudSession.status;
  session.order = cloudSession.order;
});
//
async function updateSessionData() {
  await fetch(apiUrl + '/upsert/' + lockerSession, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(session),
  });
}

async function getSessionData() {
  const response = await fetch(apiUrl + '/get/' + lockerSession);
  const _cloudSession = await response.json();
  console.log(_cloudSession);
  return _cloudSession;
}
//

const order = ref({ items: [], price: 0, customer: '' });

// :P
const warnTooManyItems = ref(false);
watchEffect(() => {
  if (order.value.items.length > 5 && !warnTooManyItems.value) {
    notifications.value.push(lang('tooManyItems'));
  }
});

const orderBackend = computed(() => {
  if (order.value.items.length === 0) {
    return {};
  }
  let description = '';
  let price = 0;
  for (let i = 0; i < order.value.items.length; i++) {
    // Make description
    const item = order.value.items[i];
    description += '{ ' + (+i + 1) + ' | ' + item.name + ' | ';
    const options = [];

    // Read options
    for (const optionKey in item.options) {
      const option = item.options[optionKey];
      const selectedValues = option.values.filter((value) => value.selected);
      if (selectedValues.length > 0) {
        const optionKey = option.name;
        let optionValue = '';
        for (let i = 0; i < selectedValues.length; i++) {
          const selectedValue = selectedValues[i];
          optionValue = '(' + selectedValue.name + ')';
        }
        options.push(optionKey + '=' + optionValue);
      }
    }
    // Read addons
    for (const addonKey in item.addons) {
      const addon = item.addons[addonKey];
      if (addon.quantity > 0) {
        options.push('(' + addon.name + ')x' + addon.quantity);
      }
    }
    description += options.join(' ');
    description += ' } \n';

    // Calculate price
    price += item.price;
  }
  log.value = description;
  return {
    id: currentOrderId.value,
    description,
    customer: customer.value.name,
    table: customer.value.table,
    price: Math.floor(price * (1 + tax) * 100) / 100,
    status: orderStatus.value || 'ordering',
    sessionData: {
      order: order.value,
      customer: ref(customer.value),
    },
  };
});

// DATA

// ORDER
async function getOrderStatus() {
  console.log('Getting order status...');
  const response = await fetch(apiUrl + '/get/' + lockerOrder);
  const order = await response.json();
  console.log(orderStatus.value, order);
  if (order.status === 'processsing' && orderStatus.value !== 'processing') {
    notifications.value.push(lang('orderProcessing'));
    orderStatus.value = 'processing';
  }
  if (order.status === 'done' && orderStatus.value !== 'done') {
    notifications.value.push(lang('orderCompleted'));
    orderStatus.value = 'done';
  }
  orderStatus.value = order.status;
}

setInterval(async function () {
  while (testVar < 10) {
    await getOrderStatus();
    testVar++;
  }
}, 2000);

onMounted(async () => {
  const response = await fetch(apiUrl + '/get/' + lockerOrder);
  const _order = await response.json();
  console.log('danchoi', _order);
  if (_order.sessionData) {
    order.value = _order.sessionData.order;
    orderStatus.value = _order.status;
    currentOrderId.value = _order.id;
    customer.value.name = _order.sessionData.customer.name;
  } else {
    order.value = { items: [], price: 0, customer: '' };
    currentOrderId.value = v4();
  }
});

const addItem = () => {
  if (!optionsSelected.value) return;
  const item = {
    id: v4(),
    name: currentItem.value.name,
    price: currentItem.value.price,
    options: currentItem.value.options,
    addons: currentItem.value.addons,
  };
  order.value.items.push(item);
  // Reset currentItem
  currentItem.value = { type: '' };
  step.value = 1;

  // Update session data
  updateSessionData(sessionData.value);
  updateOrder(orderBackend.value);
};

const showCancelConfirm = ref(false);

function cancelOrder() {
  updateOrder({
    id: currentOrderId.value,
    status: 'cancelled',
    sessionData: { customer: customer.value.name, table: customer.value.table },
  });
  notifications.value.push(lang('orderCancelled'));
}

const placeOrder = function () {
  if (order.value.items.length === 0) return;
  orderStatus.value = 'received';
  orderBackend.value.status = 'received';
  orderBackend.value.sessionData.order = order.value;
  orderBackend.value.sessionData.table = customer.value.table;
  orderBackend.value.sessionData.customer = customer.value.name;
  currentOrderId.value = orderBackend.value.id;
  // updateOrder(orderBackend.value);
  console.log(orderBackend.value);
  notifications.value.push(lang('orderPlaced'));
};

const newOrder = function () {
  updateOrder({
    id: v4(),
    status: 'ordering',
    sessionData: {
      customer: order.value.customer,
      items: [],
      table: order.value.table,
    },
  });
  orderStatus.value = 'ordering';
};

const step = ref(1);
const currentItem = ref({ type: '' });
log.value = currentItem;

const optionsSelected = ref(false); // Initialize with a default value

watch(
  () => {
    const options = currentItem.value.options;
    for (const optionKey in options) {
      const option = options[optionKey];
      const selectedValues = option.values.filter((value) => value.selected);

      if (selectedValues.length === 0) {
        optionsSelected.value = false; // At least one option does not have a selected value
        return;
      }
    }

    optionsSelected.value = true; // All options have at least one selected value
  },
  { immediate: true }
);

const resetOptions = () => {
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => {
    radio.checked = false;
  });
};

// NAVIGATION
const nextStep = () => {
  if (!currentItem.value.type) return;
  if (step.value === 2) return;
  step.value++;
};
const backStep = () => {
  if (step.value === 1) return;
  step.value--;
};

// Step 1: Select item
const selectItem = (item) => {
  if (currentItem.value.key === item.key) {
    step.value = 2;
    return;
  }
  resetOptions();
  currentItem.value = item;

  // Default values
  if (item.type === 'drink') {
    currentItem.value.options = {
      ...currentItem.value.options,
      ...drinkOptions,
    };
    currentItem.value.addons = {
      ...currentItem.value.addons,
      ...drinkAddons,
    };
  }
  if (item.type === 'food') {
    currentItem.value.options = {
      ...currentItem.value.options,
      ...foodOptions,
    };
    currentItem.value.addons = {
      ...currentItem.value.addons,
      ...foodAddons,
    };
  }

  // Inintialize states
  for (const key in currentItem.value.options) {
    for (const value of currentItem.value.options[key].values) {
      value.selected = false;
    }
  }
  currentItem.value.price = computed(() => {
    function calculateMarkup(options, addons) {
      let markup = 0;

      // Loop through each option
      for (const option in options) {
        // Loop through each value within option
        for (const valueKey in options[option].values) {
          const value = options[option].values[valueKey];
          // Check if the value is selected
          if (value.selected) {
            markup += value.price;
          }
        }
      }

      // Loop through each addon
      for (const addon in addons) {
        markup += currentItem.value.addons[addon].price;
      }

      return markup;
    }
    return (
      currentItem.value.basePrice +
      JSON.parse(
        JSON.stringify(
          calculateMarkup(currentItem.value.options, currentItem.value.addons)
        )
      )
    );
  });
  step.value = 2;
};

// Hanlding wrong input
let previous = null;
const computedCurrentItem = computed(() => {
  return JSON.parse(JSON.stringify(currentItem.value));
});
watch(
  computedCurrentItem,
  (newValue, oldValue) => {
    // Previous values for reversion
    previous = oldValue._rawValue;
    // Error logics
    if (newValue?.type === 'drink') {
      if (newValue.options.size.values[2].selected == true) {
        currentItem.value.options.type.values[0].disabled = true;
        currentItem.value.options.type.values[0].selected = false;
        currentItem.value.options.type.values[0].tooltip =
          'L size is only available for cold and blended drinks';
      } else {
        currentItem.value.options.type.values[0].disabled = false;
      }
    }
  },
  {
    deep: true,
  }
);

// Step 2: Select options
const selectOption = (option, value) => {
  option.values.forEach((value) => (value.selected = false));
  value.selected = true;
};

const drinks = computed(() => {
  return Object.values(items).filter((item) => item.type === 'drink');
});

const foods = computed(() => {
  return Object.values(items).filter((item) => item.type === 'food');
});

// MODULE: DATA
const items = {
  // Drinks
  coffee: {
    name: lang('coffee'),
    key: 'coffee',
    img: 'https://img.icons8.com/fluency/48/vietnamese-coffee.png',
    type: 'drink',
    basePrice: 2,
    options: {},
    addons: {},
  },
  milkTea: {
    name: lang('milkTea'),
    key: 'milkTea',
    img: 'https://img.icons8.com/fluency/48/milkshake.png',
    type: 'drink',
    basePrice: 2.25,
    options: {
      milk: {
        name: lang('milk'),
        key: 'milk',
        values: [
          { name: lang('wholeMilk'), key: 'whole', price: 0 },
          { name: lang('almondMilk'), key: 'almond', price: 0.5 },
        ],
      },
    },
    addons: {},
  },
  // Foods
  sandwich: {
    name: lang('sandwich'),
    key: 'sandwich',
    img: 'https://img.icons8.com/fluency/48/sandwich.png',
    type: 'food',
    basePrice: 3,
    options: {
      filling: {
        name: lang('filling'),
        values: [
          { name: lang('egg'), key: 'egg', price: 1 },
          {
            name: lang('turkey'),
            key: 'turkey',
            price: 1,
          },
        ],
      },
    },
  },
  bagel: {
    name: lang('bagel'),
    key: 'bagel',
    img: 'https://img.icons8.com/fluency/48/bagel.png',
    type: 'food',
    basePrice: 3,
    options: {
      spread: {
        name: lang('spread'),
        values: [
          { name: lang('butter'), key: 'butter', price: 0.5 },
          {
            name: lang('creamCheese'),
            key: 'creamCheese',
            price: 0.5,
          },
        ],
      },
    },
  },
};

const drinkOptions = {
  type: {
    name: lang('type'),
    key: 'type',
    values: [
      { name: lang('hot'), key: 'hot', price: 0 },
      { name: lang('cold'), key: 'cold', price: 0 },
      { name: lang('blended'), key: 'blended', price: 1 },
    ],
  },
  size: {
    name: lang('size'),
    key: 'size',
    values: [
      { name: 'S', key: 's', price: 0 },
      { name: 'M', key: 'm', price: 0.5 },
      { name: 'L', key: 'l', price: 1 },
      { name: 'XL', key: 'xl', price: 1.5 },
    ],
  },
};

const foodOptions = {};
const foodAddons = {};

const drinkAddons = {
  chocolate: {
    name: lang('chocolateSauce'),
    key: 'chocolate',
    quantity: 0,
    basePrice: 0.5,
    showBasePrice: false,
    price: 0.5,
    description: lang('chocolateSauceDes'),
    logic() {
      if (this.quantity < 0) {
        this.quantity = 0;
      }
      if (this.quantity > 6) {
        this.quantity = 6;
      }
      if (this.quantity <= 2) {
        this.price = 0;
      } else {
        this.price = 0.5 + (this.quantity - 2) * 0.5;
      }
    },
  },
};
</script>
<style></style>
