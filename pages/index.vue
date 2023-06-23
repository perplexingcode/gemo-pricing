<template>
  <ClientOnly>
    <div id="main-wrap" class="">
      <User />
      <div class="header text-center p-3">
        <h1 class="sm:mb-5 sm:mt-20 mt-10 mb-2 app-title text-yellow-200">
          Wunder bar
        </h1>
      </div>
      <div class="content mx-auto w-fit flex sm:gap-10 flex-col sm:flex-row">
        <transition name="height-transition" mode="out-in">
          <div class="item-details card h-fit">
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
                  v-if="step === 1 && session.item.type"
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
              v-if="session.item.type && step == 2"
            >
              <p>{{ session.item.name }}</p>
              <span class="price"> ${{ session.item.price }} </span>
              <span
                class="text-xs price"
                v-if="session.item.price != session.item.basePrice"
                >{{ '  ($' + session.item.basePrice + ')' }}</span
              >
            </div>
            <div
              v-if="session.item.type"
              class="current-item card m-auto outline-3 outline-teal-300 outline sm:block hidden"
              @dblclick="addItem"
            >
              <div class="flex flex-col text-center">
                <h3>{{ lang('currentItem').value }}</h3>
                <img
                  width="48"
                  height="48"
                  :src="session.item.img"
                  :alt="session.item.name"
                  class="m-auto"
                />
                <div class="flex flex-col">
                  <h3>{{ session.item.name }}</h3>
                  <div class="flex flex-col">
                    <span class="price"> ${{ session.item.price }} </span>
                    <!-- <span class="text-xs price">{{
                      '  ($' + session.item.basePrice + ')'
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
                      :class="{ active: session.item.key === item.key }"
                      @click="
                        selectItem(item);
                        session.item.key !== item.key ? resetOptions() : null;
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
                      :class="{ active: session.item.key === item.key }"
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
                  v-for="option in session.item.options"
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
                  v-for="addon in session.item.addons"
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
                  :disabled="!optionsSelected || order.status != 'Ordering'"
                >
                  {{ lang('addItem').value }}
                </button>
              </div>
            </div>
          </div>
        </transition>
        <div class="flex flex-col">
          <div class="section-order">
            <OrderDetails
              :order="order"
              :title="lang('checkout').value"
              editable
            />
            <TableInfo v-if="order.status == 'Ordering'" />
            <div
              v-if="
                order.status == 'Processing' ||
                order.status == 'Received' ||
                order.status == 'Done' ||
                order.status == 'Cancelled'
              "
              class="pl-3"
            >
              <p>{{ lang('table').value }}: {{ session.table }}</p>
              <p>{{ lang('name').value }}: {{ session.customer }}</p>
            </div>
            <div class="text-center">
              <button
                @click="placeOrder"
                :disabled="session.table === '' || order.items.length === 0"
              >
                {{
                  APP.isEditingOrder
                    ? lang('saveChanges').value
                    : lang('order').value
                }}
              </button>
            </div>
          </div>
          <Orders orders="indexOrders" />
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
import { deepClone } from '~/static/util';

// INJECTS
const lang = inject('lang');
const session = inject('session');
const user = inject('user');
const db = inject('db');
const notifications = inject('notifications');
const order = inject('order');
const orders = inject('orders');
const APP = inject('APP');
const AUTH = inject('AUTH');
import { tax } from '~/static/config';

// states
const states = reactive({
  cancelConfirm: false,
  warnTooManyItems: false,
});

// :P
watchEffect(() => {
  if (order.items.length > 5 && !states.warnTooManyItems) {
    notifications.value.pushNoti(lang('tooManyItems'));
  }
});

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

// CART (CURRENT ITEM. BUILDING ITEM, VALIDATION, ADD ITEM)
session.item = ref({ type: '' });

// Building item
const step = ref(1);

const nextStep = () => {
  if (!session.item.type) return;
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
  if (session.item.key === item.key) {
    step.value = 2;
    return;
  }
  resetOptions();
  session.item = item;

  // Default values
  if (item.type === 'drink') {
    session.item.options = {
      ...session.item.options,
      ...drinkOptions,
    };
    session.item.addons = {
      ...session.item.addons,
      ...drinkAddons,
    };
  }
  if (item.type === 'food') {
    session.item.options = {
      ...session.item.options,
      ...foodOptions,
    };
    session.item.addons = {
      ...session.item.addons,
      ...foodAddons,
    };
  }

  // Inintialize states
  for (const key in session.item.options) {
    for (const value of session.item.options[key].values) {
      value.selected = false;
    }
  }
  session.item.price = computed(() => {
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
        markup += session.item.addons[addon].price;
      }

      return markup;
    }
    return (
      session.item.basePrice +
      JSON.parse(
        JSON.stringify(
          calculateMarkup(session.item.options, session.item.addons)
        )
      )
    );
  });
  step.value = 2;
};

const optionsSelected = ref(false); // Initialize with a default value
watch(
  session,
  () => {
    const options = session.item.options;
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
    const item = session.item;
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
    key: session.item.key,
    name: session.item.name,
    price: session.item.price,
    options: session.item.options,
    addons: session.item.addons,
    description: description,
  };
  order.items.push(newItem);
  // Reset session.item
  session.item = { type: '' };
  step.value = 1;
};

// Validation
const computedItem = computed(() => {
  return JSON.parse(JSON.stringify(session.item));
});
watch(
  computedItem,
  (newValue, oldValue) => {
    // L size is only available for cold and blended drinks
    if (newValue?.type === 'drink') {
      if (newValue.options.size.values[2].selected == true) {
        session.item.options.type.values[0].disabled = true;
        session.item.options.type.values[0].selected = false;
        session.item.options.type.values[0].tooltip =
          'L size is only available for cold and blended drinks';
      } else {
        session.item.options.type.values[0].disabled = false;
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

const getTimestamp = function () {
  return new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .substring(11, 19);
};

const placeOrder = function () {
  if (!AUTH.isLoggedIn) {
    notifications.value.pushNoti(lang('loginRequired'));
    APP.isShownLoginBox = true;
    return;
  }
  if (order.items.length === 0) return;
  // update
  order.status = 'Received';
  order.timestamp = getTimestamp();
  order.date = new Date().toISOString().substring(0, 10);
  // push
  let _order = deepClone(order);
  delete _order.state;
  db.upsert.order(_order);

  // CASE: Save edit changes
  if (APP.isEditingOrder) {
    console.log(notifications.value);
    notifications.value.pushNoti(lang('orderUpdated'));
    APP.isEditingOrder = false;
    // remove old order
    const editedOrder = orders.value.find((o) => o.id === order.id);
    orders.value.splice(orders.value.indexOf(editedOrder), 1);
  } else {
    notifications.value.pushNoti(lang('orderPlaced'));
  }

  _order = deepClone(order);
  _order.state.isEditing = false;
  orders.value.push(_order);

  // reset
  order.id = v4();
  order.items = [];
  order.status = 'Ordering';
  order.timestamp = '';
  order.date = '';
};

// Computed
const sortOrder = inject('sortOrder');
const sortedOrders = computed(() => {
  // const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  // const todayOrders = orders.value.filter((order) => order.date === today); // Filter orders with today's date
  return orders.value.sort((a, b) => sortOrder[a.status] - sortOrder[b.status]); // Sort the filtered orders
});

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

// PROVIDES
provide('indexOrders', sortedOrders);
provide('items', items);
</script>
<style>
.order.is-editing {
  @apply border-teal-300 border-[3px] bg-yellow-200;
}

.order-items {
  grid-template-columns: repeat(6, 30px);
}

.order-items.big-icon {
  grid-template-columns: repeat(3, 60px);
}

.order:hover .order-items {
  @apply bg-blue-50;
}

.large .order-items {
  height: auto;
}

.order.large {
  height: 75px;
}

.order.large .order-status {
  margin-top: 1px;
}

.order:hover {
  overflow-y: visible;
  height: auto;
}
.order-items-wrapper {
  position: relative;
}

.items-more {
  @apply border-2 p-1 text-white bg-teal-800 rounded text-xs;
  position: absolute;
  white-space: nowrap;
  width: fit-content;
  top: 2rem;
  left: 50%;
  transform: translate(-52%, 0);
}
.order:hover .items-more {
  display: none;
}

.order:hover .btn.order-options {
  @apply bg-gray-200;
}

.order-status {
  @apply border-2 border-black;
  padding: 0.85rem;
  font-size: 0.9rem;
  height: 30px;
  width: 142px;
}

.received .order-status {
  @apply bg-green-900  text-white;
}
.processing .order-status {
  @apply bg-yellow-300 text-blue-600;
}

.done .order-status {
  @apply bg-teal-500 text-white;
}

.cancelled .order-status {
  @apply bg-gray-500 text-white;
}

.btn-cancel:hover {
  @apply bg-red-500 text-white;
}
/* .btn-cancel {
  @apply bg-gray-500 text-white rounded;
}
.btn-cancel:hover {
  @apply bg-red-500 text-white rounded;
} */
</style>
