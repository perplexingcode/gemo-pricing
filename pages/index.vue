<template>
  <ClientOnly>
    <div id="main-wrap" class="">
      <User />
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
                  <div
                    class="flex text-center option-radios"
                    :class="option.key"
                  >
                    <div
                      v-for="value in option.values"
                      :key="value.key"
                      class="option flex flex-col border"
                      :class="value.key"
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
                    {{ lang('total').value + ': $' + addon.price }}
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
                <button
                  @click="addItem"
                  :disabled="!optionsSelected || session.status != 'Ordering'"
                >
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
                <h1
                  v-if="session.status == 'Ordering'"
                  class="text-xl font-bold"
                >
                  {{ lang('checkout').value }}
                </h1>
                <h1
                  v-if="
                    session.status == 'Processing' ||
                    session.status == 'Received'
                  "
                  class="text-xl font-bold"
                >
                  {{ lang('orderPlaced').value }}
                </h1>
                <h1
                  v-if="session.status == 'Cancelled'"
                  class="text-xl font-bold"
                >
                  {{ lang('orderCancelled').value }}
                </h1>
                <h1 v-if="session.status == 'Done'" class="text-xl font-bold">
                  {{ lang('orderDoneTitle').value }}
                </h1>
              </div>
              <div class="invoice-items">
                <div
                  v-for="(item, index) in order.items"
                  :key="item.id"
                  class="flex"
                  :data-tooltip="item.description"
                >
                  <div class="invoice-item-name">
                    <p>{{ item.name }}</p>
                  </div>
                  <div class="invoice-dots"></div>
                  <p>${{ item.price }}</p>
                  <p
                    @click="order.items.splice(index, 1)"
                    class="delete-item pl-2 cursor-pointer"
                  >
                    X
                  </p>
                </div>
              </div>
              <p v-if="order.items.length" class="text-xs text-center">
                {{ lang('hoverItem').value }}
              </p>
              <hr class="mt-1 mb-1" />
              <div class="invoice-tax flex">
                <div class="invoice-item-name">
                  <p>
                    {{ lang('tax').value }} ({{
                      Math.floor(tax * 10000) / 100
                    }}%)
                  </p>
                </div>
                <div class="invoice-dots"></div>
                <p>${{ Math.floor(order.priceBeforeTax * tax * 100) / 100 }}</p>
              </div>
              <div class="invoice-total flex">
                <p>{{ lang('total').value }}</p>
                <div class="invoice-dots"></div>
                <p>${{ order.price }}</p>
              </div>
            </div>
          </div>
          <div
            v-if="session.status == 'Ordering'"
            class="flex flex-col customer"
          >
            <label class="pl-4 pt-1">{{ lang('name').value }}</label>
            <input
              class="customer-name"
              v-model="session.customer"
              :placeholder="lang('yourName').value"
            />
            <label class="pl-4 pt-1">{{ lang('table').value }}</label>
            <select v-model="session.table">
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
            v-if="
              session.status == 'Processing' ||
              session.status == 'Received' ||
              session.status == 'Done' ||
              session.status == 'Cancelled'
            "
            class="pl-3"
          >
            <p>{{ lang('table').value }}: {{ session.table }}</p>
            <p>{{ lang('name').value }}: {{ session.customer }}</p>
          </div>
          <div class="text-center">
            <button
              v-if="session.status == 'Ordering'"
              @click="placeOrder"
              :disabled="session.table === '' || order.items.length === 0"
            >
              {{ lang('order').value }}
            </button>
            <button
              v-if="session.status == 'Received'"
              @click="UI.cancelConfirm = true"
              class="btn-cancel"
            >
              {{ lang('orderCancel').value }}
            </button>
            <button
              v-if="session.status == 'Processing'"
              disabled
              class="btn-processing"
            >
              {{ lang('orderProcessingButton').value }}
            </button>
            <button
              v-if="session.status == 'Cancelled' || session.status == 'Done'"
              @click="newOrder"
              class="btn-new-order"
            >
              {{ lang('orderNew').value }}
            </button>
            <div v-if="UI.cancelConfirm" class="cancel-confirm">
              <p>{{ lang('orderCancelConfirm').value }}</p>
              <button
                @click="
                  cancelOrder();
                  UI.cancelConfirm = false;
                "
              >
                {{ lang('orderCancel').value }}
              </button>
              <button @click="UI.cancelConfirm = false">
                {{ lang('goBack').value }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
<script setup>
// << DEV
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';

import { v4 } from 'uuid';

// CONST
const development = inject('development');
const sessionToken = inject('sessionToken');
const lang = inject('lang');

// INJECTS
const session = inject('session');
const orders = inject('orders');
const user = inject('user');
const db = inject('db');

//<< DEV
const log = ref('');
const testVar = ref(0);
// >>
const order = reactive({});
// Sync session with cloud
watch(
  order,
  () => {
    order.price =
      Math.floor(
        order.items.reduce((total, item) => total + item.price, 0) *
          (1 + tax) *
          100
      ) / 100;
    order.priceBeforeTax =
      Math.floor(
        order.items.reduce((total, item) => total + item.price, 0) * 100
      ) / 100;

    // Make description
    let description = '';
    for (let i = 0; i < order.items.length; i++) {
      // Make description
      const item = order.items[i];
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
    }
    order.description = description;
    //
    db.upsert.session();
  },
  { deep: true }
);

// UI

const UI = reactive({
  cancelConfirm: false,
  warnTooManyItems: false,
});

// :P
watchEffect(() => {
  if (order.items.length > 5 && !UI.warnTooManyItems) {
    notifications.value.push(lang('tooManyItems'));
  }
});

// CART (CURRENT ITEM. BUILDING ITEM, VALIDATION, ADD ITEM)
const currentItem = ref({ type: '' });

// Building item
const step = ref(1);

const nextStep = () => {
  if (!currentItem.value.type) return;
  if (step.value === 2) return;
  step.value++;
};
const backStep = () => {
  if (step.value === 1) return;
  step.value--;
};

const resetOptions = () => {
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => {
    radio.checked = false;
  });
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

const addItem = () => {
  if (!optionsSelected.value) return;
  let description = '';
  {
    // Make description
    const item = currentItem.value;
    description += item.name + ' | ';
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
          optionValue = selectedValue.name;
        }
        options.push(optionKey + ': ' + optionValue);
      }
    }
    // Read addons
    for (const addonKey in item.addons) {
      const addon = item.addons[addonKey];
      if (addon.quantity > 0) {
        options.push(addon.name + ' x' + addon.quantity);
      }
    }
    description += options.join(', ');
  }
  const newItem = {
    id: v4(),
    name: currentItem.value.name,
    price: currentItem.value.price,
    options: currentItem.value.options,
    addons: currentItem.value.addons,
    description: description,
  };
  order.items.push(newItem);
  // Reset currentItem
  currentItem.value = { type: '' };
  step.value = 1;
};

// Validation
const computedCurrentItem = computed(() => {
  return JSON.parse(JSON.stringify(currentItem.value));
});
watch(
  computedCurrentItem,
  (newValue, oldValue) => {
    // L size is only available for cold and blended drinks
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
    //
  },
  {
    deep: true,
  }
);

// Step 2: Select options
const selectOption = (option, value) => {
  // Reset all values
  option.values.forEach((value) => (value.selected = false));
  const radios = document.querySelectorAll(
    '.option-radios' + '.' + option.key + ' input'
  );

  radios.forEach((radio) => {
    radio.checked = false;
  });

  // Select value
  value.selected = true;
  const radio = document.querySelector('.option' + '.' + value.key + ' input');
  radio.checked = true;
};

// ORDER
const tax = 0.0725;
const orderBackend = computed(() => {
  if (order.items.length === 0) {
    return {};
  }
  return {
    id: session.id,
    description: order.description,
    customer: session.customer,
    table: session.table,
    price: order.price,
    status: session.status,
  };
});

const getTimestamp = function () {
  return new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .substring(11, 19);
};

const placeOrder = function () {
  if (order.items.length === 0) return;
  session.status = 'Received';
  // Add GMT+7 timestamp to order format yyyy-mm-dd hh:mm:ss
  orderBackend.value.timeStamp = getTimestamp();
  updateOrder();
  notifications.value.push(lang('orderPlaced'));
  updateOrderHistory();
};

function cancelOrder() {
  session.status = 'Cancelled';
  updateOrder();
  notifications.value.push(lang('orderCancelled'));
  updateOrderHistory();
}

const newOrder = function () {
  session.id = v4();

  if (session.status !== 'Cancelled') {
    order.items = [];
  }
  session.status = 'Ordering';
  updateOrder();
};

// MODULE: DATA
const drinks = computed(() => {
  return Object.values(items).filter((item) => item.type === 'drink');
});

const foods = computed(() => {
  return Object.values(items).filter((item) => item.type === 'food');
});
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
