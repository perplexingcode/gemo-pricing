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
                  v-for="(item, index) in session.order.items"
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
                    @click="session.order.items.splice(index, 1)"
                    class="delete-item pl-2 cursor-pointer"
                  >
                    X
                  </p>
                </div>
              </div>
              <p v-if="session.order.items.length" class="text-xs text-center">
                Hover to see item details
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
                <p>
                  ${{
                    Math.floor(session.order.priceBeforeTax * tax * 100) / 100
                  }}
                </p>
              </div>
              <div class="invoice-total flex">
                <p>{{ lang('total').value }}</p>
                <div class="invoice-dots"></div>
                <p>${{ session.order.price }}</p>
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
              :disabled="
                session.table === '' || session.order.items.length === 0
              "
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
      <div v-if="development" class="development py-5 card">
        <button @click="resetSession">Reset session</button>
        <p class="py-1">{{ session.status }}</p>
        <div class="flex">
          <h3>session</h3>
          <JsonViewer :value="session" :expandDepth="10" copyable boxed sort />
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
          <h3>session.order</h3>
          <JsonViewer
            :value="session.order"
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
    const development = ref(false);
    const testVar = ref(0);
    // >>

    onMounted(() => {
        if (window.location.search === '?dev') {
            development.value = true;
        }
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
    const lang = function (key) {
        try {
            return computed(() => dict[key][session.language]);
        } catch (error) {
            return key;
        }
    };

    // API
    const lockerOrder = 'wunderbar_order';
    const lockerSession = 'wunderbar_session';
    const apiUrl =
        'https://vq4h0iro9k.execute-api.ap-southeast-1.amazonaws.com/locker';

    // SESSION
    const session = reactive({
        id: '',
        customer: '',
        table: '',
        status: 'Ordering',
        language: 'EN',
        order: { items: [], price: 0, priceBeforeTax: 0 },
    });

    // DEV : Reset sesssion
    const resetSession = () => {
        session.id = '';
        session.customer = '';
        session.table = '';
        session.status = 'Ordering';
        session.order = { items: [], price: 0, priceBeforeTax: 0 };
        session.language = 'EN';
        updateCloudSession();
        updateOrder();
    };

    // Sync session with cloud
    watch(
        () => session,
        () => {
            session.order.price =
                Math.floor(
                    session.order.items.reduce((total, item) => total + item.price, 0) *
                    (1 + tax) *
                    100
                ) / 100;
            session.order.priceBeforeTax =
                Math.floor(
                    session.order.items.reduce((total, item) => total + item.price, 0) * 100
                ) / 100;

            // Make description
            let description = '';
            for (let i = 0; i < session.order.items.length; i++) {
                // Make description
                const item = session.order.items[i];
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
            session.order.description = description;
            //
            updateCloudSession();
        },
        { deep: true }
    );
    //
    onMounted(async () => {
        const cloudSession = await getCloudSession();
        console.log('?', cloudSession);
        if (!cloudSession.id) {
            session.id = v4();
            session.status = 'Ordering';
            session.language = 'EN';
            return;
        }
        session.id = cloudSession.id;
        session.customer = cloudSession.customer;
        session.table = cloudSession.table;
        session.status = cloudSession.status;
        session.order = cloudSession.order;
        session.language = cloudSession.language;
    });
    //
    async function updateCloudSession() {
        await fetch(apiUrl + '/upsert/' + lockerSession, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(session),
        });
    }

    async function getCloudSession() {
        const response = await fetch(apiUrl + '/get/' + lockerSession);
        const _cloudSession = await response.json();

        return _cloudSession;
    }
    // UI
    const notifications = ref([{ id: 'ok' }]);
    const UI = reactive({
        cancelConfirm: false,
        warnTooManyItems: false,
    });

    // :P
    watchEffect(() => {
        if (session.order.items.length > 5 && !UI.warnTooManyItems) {
            notifications.value.push(lang('tooManyItems'));
        }
    });

    import { ref, onMounted, watch, reactive, computed } from 'vue';
    import order from './order.vue';
    import cart from './cart.vue';
    import menuitems from './menuitems.vue';

    export default {
        components: {
            order,
            cart: cart,
            menuitems: menuitems
        }
    };

</script>