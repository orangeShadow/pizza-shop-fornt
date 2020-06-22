import React from 'react';

import {
  Block, 
  BlockTitle,
  List,
  ListItem,
  ListInput,
  Button
} from 'framework7-react';

import BasketContext from '../context/basket';
import CurrencyContext from '../context/currency';
import OrderForm from './orderForm';
import PriceFormat from '../components/priceFormat';


class BasketList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  /**
   * Calculate total sum in basket
   * 
   * @param Array basket 
   */
  totalSum(basket) {
    if (basket.length === 0) {
      return 0;
    }
    let total = 0;
    basket.forEach((item) => {
      total+= item.price*item.quantity;
    });
    return total;
  }

  /**
   * Remove element from basket
   * 
   * @param object current 
   * @param Array basket 
   * @param function changeBasket 
   */
  removeElementFromBasket(current, basket, changeBasket) { 
    let removeIndex = basket.findIndex((item) => item.productId === current.productId);
    basket.splice(removeIndex, 1);  
    changeBasket(basket);
  }

  render (){
    return (      
      <BasketContext.Consumer>
        {({ basket, changeBasket }) => (   
        <CurrencyContext.Consumer>          
          {({currency, changeCurrency}) => (
            <Block>
              { basket.length>0 && <List inlineLabels noHairlinesMd>
                <ListInput label="Currency" type="select" value={currency} onChange={(event)=>changeCurrency(event.target.value)}>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </ListInput>
              </List>}
              {basket.length>0 && <BlockTitle>Basket:</BlockTitle>}
              <List mediaList>
                {
                  basket.map( (item) => {
                    return <ListItem key={item.productId+'_'+item.currency} title={item.title}>
                      <div slot="after"><PriceFormat price={item.price} currency={item.currency}/></div>
                      <div className="display-flex justify-content-space-between"><div slot="text">quantity: {item.quantity}</div> <Button onClick={()=> {this.removeElementFromBasket(item, basket, changeBasket)}} style={{display:'inline-block'}} color="red">x</Button></div>
                    </ListItem>
                  })
                }             
              </List>                        
              { basket.length ? <div className="display-flex justify-context-space-between">Basket price: &nbsp;<PriceFormat price={this.totalSum(basket)} currency={currency}/></div>: <div>Your order list is empty</div>}            
              { basket.length && <OrderForm currency={currency} changeBasket={changeBasket} basket={basket} basketSum={this.totalSum(basket)}/>}
            </Block>                             
          )}
        </CurrencyContext.Consumer>
        )}
      </BasketContext.Consumer>       
    );
  }
}
export default BasketList;
