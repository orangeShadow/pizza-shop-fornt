import React from 'react';

import axios from 'axios';
import config from '../js/config';

export const login = async (loginForm) => {
  return  axios.post(config.login(), loginForm).then(({data})=>{    
    return data.data;
  });  
};

export const register = async (registerForm) => {  
  return  axios.post(config.register(), registerForm).then(({data})=>{    
    return data.data;
  });  
};

export const checkAuth = async (user) => {    
  return  axios.post(config.checkAuth(),{}, {headers:{'Authorization': `Bearer ${user.api_token}`}}).then(({data})=> {
    return data.data;
  });  
};

export const getOrderList = async (token) => {
  return  axios.get(config.orderList(), {headers:{'Authorization': `Bearer ${token}`}}).then(({data})=> {
    return data.data;
  });  
}

export default React.createContext({
  user: null,
  login: () => {},
  register: () => {},
  checkAuth: ()=> {},
  orderList: ()=> {},
});