import React from 'react';
import axios from 'axios';
import config from '../js/config';


export const loadProducts = (currency) => {  
  return  axios.get(config.getProducts(),{params:{currency}}).then(({data})=>{
    return data.data;
  });  
};

export default React.createContext([]);