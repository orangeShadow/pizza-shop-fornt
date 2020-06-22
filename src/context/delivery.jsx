import React from 'react';

import axios from 'axios';
import config from '../js/config';

export const loadDeliveries = async (currency) => {
  return  axios.get(config.getDeliveries(),{params:{currency}}).then(({data})=>{    
    return data.data;
  });  
};

export default React.createContext([]);