import { request } from './request.js';
import axios from 'axios';

export const getUserByEmail = async function (email) {
  const {
    auth0Url,
    auth0ManagementClientId,
    auth0ManagementClientSecret,
    auth0ManagementAudience,
  } = useRuntimeConfig().public;
  const token = (
    await request(auth0Url + '/oauth/token', 'POST', {
      grant_type: 'client_credentials',
      client_id: auth0ManagementClientId,
      client_secret: auth0ManagementClientSecret,
      audience: auth0ManagementAudience,
      'Content-Type': 'application/json',
    })
  )?.data?._rawValue?.access_token;

  // const user = await request(
  //   auth0Url + '/api/v2/users-by-email?email=' + email,
  //   'GET',
  //   {},
  //   {},
  //   { token, noCors: true }
  // );
  const user = (
    await axios.get(`${auth0Url}/api/v2/users-by-email?email=${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  )?.data[0];
  return user;
};

export const login = async function (email, password) {
  const { auth0Url, auth0ClientId, auth0ClientSecret, auth0Audience } =
    useRuntimeConfig().public;
  const token = (
    await request(auth0Url + '/oauth/token', 'POST', {
      grant_type: 'password',
      username: email,
      password: password,
      audience: auth0Audience,
      client_id: auth0ClientId,
      client_secret: auth0ClientSecret,
    })
  )?.data?._rawValue?.access_token;
  if (token) {
    const user = await getUserByEmail(email);
    return { user, token };
  }
  return false;
};

export const signup = async function (email, password) {
  const { auth0Url, auth0ClientId } = useRuntimeConfig().public;
  try {
    const response = await axios.post(auth0Url + '/dbconnections/signup', {
      client_id: auth0ClientId,
      email: username.value,
      connection: 'Username-Password-Authentication',
      password: password.value,
    });
  } catch (error) {
    console.error(error);
  }
};
