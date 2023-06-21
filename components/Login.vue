<template>
  <Transition :appear="true" name="fade">
    <div
      v-show="APP.isShownLoginBox && !AUTH.isLoggedIn"
      class="login-box"
      @keydown.enter="doSubmit"
    >
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
      <span
        class="text-red-500 pt-2"
        v-show="state.wrongPassword && !isSignup"
        >{{ lang('passwordWrong').value }}</span
      >
      <div v-if="isSignup" class="input-group">
        <label>{{ lang('passwordConfirm').value }}</label>
        <input
          type="password"
          v-model="passwordConfirm"
          :placeholder="lang('passwordConfirm').value"
        />
        <span class="text-red-500 pt-2" v-show="state.passwordMismatch">{{
          lang('passwordMismatch').value
        }}</span>
      </div>
      <div class="auth-btns">
        <div class="flex justify-center">
          <button :class="[{ 'bg-green-800': isSignup }]" @click="doLogin">
            {{ lang('login').value }}
          </button>
          <button :class="[{ 'bg-green-800': !isSignup }]" @click="doSignup">
            {{ lang('signup').value }}
          </button>
        </div>
        <h3 class="text-center">
          {{ lang('orLoginWith').value }}
        </h3>
        <div @click="doLogin('facebook')" class="cursor-pointer">
          <img
            width="48"
            height="48"
            src="https://img.icons8.com/color/48/facebook-new.png"
            alt="facebook-new"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>
<script setup>
import { login, getUserByEmail, signup } from '~/static/auth0';
import { deepClone } from '~/static/util';

const APP = inject('APP');
const lang = inject('lang');
const session = inject('session');
const AUTH = inject('AUTH');
const notifications = inject('notifications');
const user = inject('user');

const state = reactive({
  passwordMismatch: false,
  wrongPassword: false,
});

const isSignup = ref(false);

const username = ref('buisondong20@gmail.com');
const password = ref('Token@00');
const passwordConfirm = ref('Token@00');

onMounted(() => {
  nextTick(() => {
    // login(username.value, password.value);
  });
});

const doSubmit = function () {
  if (isSignup.value) {
    doSignup();
  } else {
    doLogin();
  }
};

const doLogin = async function (method) {
  if (username.value === '' || password.value === '') return;
  isSignup.value = false;
  switch (method) {
    case 'facebook':
      return doLoginFacebook();
    default:
      return doLoginEmail();
  }
};
const doLoginFacebook = async function () {
  const isLoginSuccess = AUTH.loginFb();
  if (!isLoginSuccess) {
    state.wrongPassword = true;
  }
};
const doLoginEmail = async function () {
  try {
    const data = await login(username.value, password.value);
    if (!data?.token) {
      state.wrongPassword = true;
      return;
    }
    session.token = data.token;
    user.id = data.user.identities[0].user_id;
    AUTH.isLoggedIn = true;
    AUTH.type = 'email';
  } catch (error) {
    state.wrongPassword = true;
    console.error(error);
  }
};

const doSignup = async function () {
  if (!isSignup.value) {
    isSignup.value = true;
    return;
  }
  if (password.value !== passwordConfirm.value) {
    state.passwordMismatch = true;
    return;
  }
  signup(username.value, password.value);
  doLoginEmail();
};

// Detect login status changes
const computedAUTH = computed(() => deepClone(AUTH));
watch(computedAUTH, (newValue, oldValue) => {
  // Log out
  if (newValue?.isLoggedIn == false && oldValue?.isLoggedIn) {
    console.log('logout');
    switch (AUTH?.type) {
      case 'facebook':
        FB.api('/me/permissions', 'DELETE', {}, function () {
          FB.logout();
        });
        break;
      case 'email':
        break;
      default:
        break;
    }
    AUTH.logout();
  }
});
</script>
<style></style>
