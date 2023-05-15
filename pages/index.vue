<template>
  <ClientOnly>
    <div id="main-wrap" class="">
      <div class="language p-3 cursor-pointer hidden" @click="lang = !lang">
        <img
          width="32"
          v-if="lang === true"
          src="https://img.icons8.com/color/48/usa.png"
        />
        <img
          v-else
          width="32"
          src="https://img.icons8.com/color/48/vietnam.png"
        />
      </div>
      <div class="header text-center">
        <div v-if="order.items.length > 5">
          <p>
            You have ordered too many items. Please be aware of possible
            bankruptcy.
          </p>
        </div>
        <h1 class="mb-5 mt-20 app-title text-yellow-200">Wunder bar</h1>
      </div>
      <div class="content mx-auto w-fit flex gap-10">
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
                  {{ lang ? 'Select item' : 'Hãy chọn món' }}
                </div>
              </div>
              <div
                class="step"
                :class="{ active: step === 2, hidden: step !== 2 }"
              >
                <div class="text">
                  {{ lang ? 'Select options' : 'Tùy chọn' }}
                </div>
              </div>
            </div>
            <div class="btn-wrapper plus-minus">
              <img
                v-if="step === 1"
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
          <div class="step-1" v-show="step === 1">
            <div class="menu">
              <div class="menu-list drink">
                <h3>{{ lang ? 'Drinks' : 'Đồ uống' }}</h3>
                <div class="flex list-items">
                  <div
                    v-for="item in drinks"
                    class="item"
                    @click="selectItem(item)"
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
                      <label>{{ item.name }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="menu-list food">
                <h3>{{ lang ? 'Foods' : 'Đồ ăn' }}</h3>
                <div class="list-items flex">
                  <div
                    v-for="item in foods"
                    class="item"
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
                      <label>{{ item.name }}</label>
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
                <h4>{{ option.name }}</h4>
                <div class="flex">
                  <div
                    v-for="value in option.values"
                    :key="value.key"
                    class="option flex flex-col border"
                    @click="selectOption(option, value)"
                    :data-tooltip="value.disabled ? value.tooltip : null"
                  >
                    <label>{{ value.name }}</label>
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
                <h4>{{ addon.name }}</h4>
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
              <button @click="addItem">Add item</button>
            </div>
          </div>
        </div>
        <div class="order-details border h-fit">
          <div class="text-center">
            <h1 class="text-xl font-bold">
              {{ lang ? 'Check out' : 'Tính tiền' }}
            </h1>
          </div>
          <div class="invoice-items">
            <div v-for="item in order.items" :key="item.id" class="flex">
              <p>{{ item.name }}</p>
              <div class="invoice-dots"></div>
              <p>${{ item.price }}</p>
            </div>
          </div>
          <hr />
          <div class="invoice-tax flex">
            <p>
              {{ lang ? 'Tax' : 'Thuế' }} ({{ Math.floor(tax * 10000) / 100 }}%)
            </p>
            <div class="invoice-dots"></div>
            <p>
              ${{
                Math.floor(
                  order.items.reduce((total, item) => total + item.price, 0) *
                    tax *
                    100
                ) / 100
              }}
            </p>
          </div>
          <div class="invoice-total flex">
            <p>{{ lang ? 'Total' : 'Tổng' }}</p>
            <div class="invoice-dots"></div>
            <p>
              ${{
                Math.floor(
                  order.items.reduce((total, item) => total + item.price, 0) *
                    (1 + tax) *
                    100
                ) / 100
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="development py-5 hidden">
        <!-- <p class="py-1">{{ log }}</p> -->
        <JsonViewer
          :value="order.items"
          expanded
          :expandDepth="10"
          copyable
          boxed
          sort
        />
      </div>
    </div>
  </ClientOnly>
</template>
<script setup>
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import { v4 } from 'uuid';
const log = ref('');
const lang = ref(true);

const order = ref({ items: [], price: 0 });
const step = ref(1);
const currentItem = ref({ type: '' });
log.value = currentItem;
const tax = 0.0725;

const addItem = () => {
  const item = {
    id: v4(),
    name: currentItem.value.name,
    price: currentItem.value.price,
  };
  order.value.items.push(item);
  console.log(order._rawValue);
  currentItem.value = { type: '' };
  step.value = 1;
};

// MODULE: NAVIGATION
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
    function calculateMarkup(options) {
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
      return markup;
    }
    return (
      currentItem.value.basePrice +
      JSON.parse(JSON.stringify(calculateMarkup(currentItem.value.options)))
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
    name: lang.value ? 'Coffee' : 'Cà phê',
    key: 'coffee',
    img: 'https://img.icons8.com/fluency/48/vietnamese-coffee.png',
    type: 'drink',
    basePrice: 2,
    options: {},
    addons: {},
  },
  milkTea: {
    name: lang.value ? 'Milk Tea' : 'Trà sữa',
    key: 'milkTea',
    img: 'https://img.icons8.com/fluency/48/milkshake.png',
    type: 'drink',
    basePrice: 2.25,
    options: {
      milk: {
        name: lang.value ? 'Milk' : 'Sữa',
        key: 'milk',
        values: [
          { name: 'Whole milk', key: 'whole', price: 0 },
          { name: 'Almond milk', key: 'almond', price: 0.5 },
        ],
      },
    },
    addons: {},
  },
  // Foods
  sandwich: {
    name: lang.value ? 'Sandwich' : 'Bánh mì kẹp',
    key: 'sandwich',
    img: 'https://img.icons8.com/fluency/48/sandwich.png',
    type: 'food',
    basePrice: 3,
    options: {
      filling: {
        name: lang.value ? 'Filling' : 'Nhân',
        values: [
          { name: lang.value ? 'Egg' : 'Trứng', key: 'egg', price: 1 },
          {
            name: lang.value ? 'Turkey' : 'Thịt gà tây',
            key: 'turkey',
            price: 1,
          },
        ],
      },
    },
  },
  bagel: {
    name: lang.value ? 'Bagel' : 'Bánh mì vòng',
    key: 'bagel',
    img: 'https://img.icons8.com/fluency/48/bagel.png',
    type: 'food',
    basePrice: 3,
    options: {
      spread: {
        name: lang.value ? 'Spread' : 'Kem phết',
        values: [
          { name: lang.value ? 'Butter' : 'Bơ', key: 'butter', price: 0.5 },
          {
            name: lang.value ? 'Cream cheese' : 'Kem phô mai',
            key: 'creamChese',
            price: 0.5,
          },
        ],
      },
    },
  },
};

const drinkOptions = {
  type: {
    name: lang.value ? 'Type' : 'Loại',
    key: 'type',
    values: [
      { name: lang.value ? 'Hot' : 'Nóng', key: 'hot', price: 0 },
      { name: lang.value ? 'Cold' : 'Lạnh', key: 'cold', price: 0 },
      { name: lang.value ? 'Blended' : 'Hỗn hợp', key: 'blended', price: 1 },
    ],
  },
  size: {
    name: lang.value ? 'Size' : 'Cỡ',
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
    name: 'Chocolate Sauce',
    key: 'chocolate',
    quantity: 0,
    price: 0.5,
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

<!-- <script>
const orderItem = {
  drinkType: '',
  size: '',
  cream: '',
  pumps: '',
  breakFast: '',
  foodOption: '',
};

// Final price = base price + markups + tax
const finalPrice = '';

//  Options
const drinkTypes = ['Hot', 'Cold', 'Blended'];
const sizes = ['S', 'M', 'L'];
const creams = ['WithCream', 'WithoutCream'];

// Base prices
const basePrices = {
  Hot: 2,
  Cold: 2,
  Blended: 2,
};

// Markups
const sizeMarkups = {
  S: 0,
  M: 0.5,
  L: 1,
};

const drinkTypeMarkups = {
  Hot: 0,
  Cold: 0,
  Blended: 1,
};

const creamMarkups = {
  WithCream: 0.5,
  WithoutCream: 0,
};

function calculatePrice1(drinkType, size, whippedCream) {
  // Exceptions
  if (size === 'L' && drinkType === 'Hot') {
    alert('Large size is only available for cold and blended drinks.');
  }

  if (drinkTypes.indexOf(drinkType) === -1) return;

  if (sizes.indexOf(size) === -1 || creams.indexOf(whippedCream) === -1) {
    alert('Invalid input, please double check your order.');
  }

  price += sizeMarkups[size];
  price += creamMarkups[whippedCream];
  price += drinkTypeMarkups[drinkType];

  return price;
}

function calculatePrice2() {
  sizes.push('XL');
  sizeMarkups.XL = 1.5;

  drinkTypes.push('MilkTea');
  basePrices.MilkTea = 2.25;

  var milk = ['Whole', 'Almond'];
  var milkMarkups = {
    Whole: 0,
    Almond: 0.5,
  };
}

function calculatePrice3(drinkType, pumps) {
  if (pumps > 6) {
    alert('Maximum 6 pumps of chocolate sauce.');
  }
  if (pumps < 0) {
    alert('Pumps cannot be negative.');
  }
  if (drinkType === 'Hot' && pumps > 2) {
    finalPrice += 0.5 * (pumps - 2);
  }
}

function calculatePrice4() {
  var breakFasts = ['Sandwich', 'Bagel'];
  basePrices.Sandwich = 3;
  basePrices.Bagel = 3;

  var foodOptions = ['Egg', 'Turkey', 'Butter', 'CreamCheese'];
  var foodOptionsMarkups = {
    Egg: 1,
    Turkey: 1,
    Butter: 0.5,
    CreamCheese: 0.5,
  };
}

function calculatePrice5(orderItems) {
  let invoice = '';
  for (let item of orderItems) {
    isDrink = item.drinkType ? true : false;
    invoice += (item.drinkType || item.breakFast) + '\n';
    let price = 0;

    price += basePrices[item.drinkType] ? basePrices[item.breakFast] : 0;
    invoice += 'Base price: ' + price + '\n';

    // Markups
    if (isDrink) {
      price += sizeMarkups[item.size];

      // Size
      sizeMarkups[item.size]
        ? (invoice += 'Size markup: ' + sizeMarkups[item.size] + '\n')
        : '';

      // Cream
      price += creamMarkups[item.cream];
      creamMarkups[item.cream]
        ? (invoice += 'Cream markup: ' + creamMarkups[item.cream] + '\n')
        : '';

      // Drink type
      price += drinkTypeMarkups[item.drinkType];
      drinkTypeMarkups[item.drinkType]
        ? (invoice +=
            'Drink type markup: ' + drinkTypeMarkups[item.drinkType] + '\n')
        : '';

      // Chocolate sauce pumps
      price += calculatePrice3(item.drinkType, item.pumps);
      calculatePrice3(item.drinkType, item.pumps)
        ? (invoice +=
            'Pumps markup: ' +
            calculatePrice3(item.drinkType, item.pumps) +
            '\n')
        : '';

      // Milk
      price += milkMarkups[item.milk];
      milkMarkups[item.milk]
        ? (invoice += 'Milk markup: ' + milkMarkups[item.milk] + '\n')
        : '';
    }

    if (!isDrink) {
      price += foodOptionsMarkups[item.foodOption];
      foodOptionsMarkups[item.foodOption]
        ? (invoice +=
            'Food option markup: ' + foodOptionsMarkups[item.foodOption] + '\n')
        : '';
    }
    price += price * 0.0725;
    invoice += 'Price: ' + price + '\n' + '\n' + '----------------';
  }
  return {
    invoice,
    price,
  };
}

</script> -->
