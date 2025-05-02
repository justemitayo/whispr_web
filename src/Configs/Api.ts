import axios, { InternalAxiosRequestConfig } from 'axios';
import { loadString } from './Storage';
import { strings } from './Strings';

async function useAuthentication(config: InternalAxiosRequestConfig) {
  // set api url
  console.log("process.env.REACT_APP_BASE_URL",process.env.REACT_APP_BASE_URL)
  config.baseURL = process.env.REACT_APP_BASE_URL;
  const token = await loadString(strings.userToken);

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
}

const instance = axios.create({
  timeout: 30 * 1000,
});

instance.interceptors.request.use(useAuthentication);

export default instance;
