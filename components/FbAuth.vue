<template>
  <div class="fb bg-blue-300 fixed top-0 right-1/2 hidden">
    <div id="status"></div>
    <div id="fb-root"></div>
    <div
      class="fb-login-button"
      data-width="200"
      data-size="small"
      data-button-type="continue_with"
      data-layout=""
      data-scope="email,public_profile"
      data-auto-logout-link="true"
    ></div>
  </div>
</template>

<script setup>
import { deepClone } from '~/static/util';

// Inject
const session = inject('session');
const user = inject('user');
const AUTH = inject('AUTH');

onMounted(async () => {
  window.fbAsyncInit = function () {
    FB.init({
      appId: '262473663130930',
      cookie: true,
      xfbml: true,
      version: 'v17.0',
    });
    fbLoaded.resolve();
    FB.AppEvents.logPageView();

    AUTH.loginFb = function () {
      FB.getLoginStatus(function (response) {
        console.log('stt', response);
        if (response.status == 'connected') {
          AUTH.data = response.authResponse;
          AUTH.type = 'facebook';
          AUTH.isLoggedIn = true;
          FB.api('/me', function (response) {
            console.log('fb status', response);
            if (!user.name) user.name = response.name;
            session.customer = response.name;
            user.id = response.id;
          });
        } else {
          if (AUTH.isLoggedIn && AUTH.type == 'facebook') return;
          FB.login(function (response) {
            console.log(response);
            if (response.status === 'connected') {
              AUTH.data = response.authResponse;
              AUTH.type = 'facebook';
              AUTH.isLoggedIn = true;
              FB.api('/me', function (response) {
                console.log('fb login', response);
                if (!user.name) user.name = response.name;
                session.customer = response.name;
                user.id = response.id;
              });
            } else if (response.status === 'unknown') {
              document.getElementById('status').innerHTML =
                'Please log into Facebook.';
              return false;
            } else {
              document.getElementById('status').innerHTML =
                'Please log into this app.';
              return false;
            }
          });
        }
      });
    };
  };

  // Load the Facebook SDK asynchronously
  function loadFacebookSDK() {
    return new Promise((resolve) => {
      // Check if the Facebook SDK script is already loaded
      if (document.getElementById('facebook-jssdk')) {
        resolve();
        return;
      }

      // Create the script element
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src =
        'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0&appId=262473663130930&autoLogAppEvents=1';
      script.async = true;

      // Append the script to the document
      document.head.appendChild(script);

      // Resolve the promise when the script is loaded
      script.onload = resolve;
    });
  }
  loadFacebookSDK();
});

if (process.client) {
  function Deferred() {
    var self = this;
    this.promise = new Promise(function (resolve, reject) {
      self.reject = reject;
      self.resolve = resolve;
    });
  }
  window.fbLoaded = new Deferred();

  fbLoaded.promise.then(() => {
    AUTH.app = FB;
  });
}
</script>

<style></style>
