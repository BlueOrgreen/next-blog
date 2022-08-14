import axios from 'axios';

const requestInstance = axios.create({
  baseURL: ''
});

requestInstance.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
})

requestInstance.interceptors.response.use((response) => {
  if(response.status === 200) {
    return response.data
  } else {
    return {
      code: -1,
      msg: '发生未知错误',
      data: null,
    }
  }
}, (error) => {
  return Promise.reject(error)
})

export default requestInstance;