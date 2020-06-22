
import React, { Component} from 'react';

import {  
  Navbar,
  NavLeft,
  NavTitle,
  NavRight,
  Link, 
  Menu,
  MenuItem,
  MenuDropdown,
  MenuDropdownItem,  
} from 'framework7-react';

import BasketContext from '../context/basket';
import CurrencyConxtext from '../context/currency';
import UserContext from '../context/user';

class TopMenu extends Component {  
  constructor() {        
    super();    
  }

  totalBasketQuantity(basket)
  {
    if(basket.length===0) {
      return 0;
    }
    
    let total = 0;
    basket.forEach((item) => {total += item.quantity;});
    return total;
  }


  render() {
    return (
      <CurrencyConxtext.Consumer>
      {({currency, changeCurrency}) =>(
      <UserContext.Consumer>
      {({user}) => (     
            <Navbar  sliding={false}>      
              <NavLeft>
                <NavTitle><a href="/">Pizza shop</a></NavTitle>
                <Menu>
                  <MenuItem  bgColor="blue" popupOpen="#delivery-popup" text="Delivery"/>
                </Menu>
              </NavLeft>
              <NavRight>              
                <Menu>                  
                  {                    
                    user===null ? <MenuItem key="login-link" iconIos="f7:person" iconAurora="f7:person" iconMd="material:person" loginScreenOpen="#my-login-screen"></MenuItem>:<MenuItem bgColor="transparent" key='order-list-link' link={true} href="/orders" text="Order list"></MenuItem>
                  }                       
                  <MenuItem text={currency} dropdown>
                  <MenuDropdown left>
                    <MenuDropdownItem onClick={()=>{changeCurrency('EUR')}} text="EUR" />
                    <MenuDropdownItem onClick={()=>{changeCurrency('USD')}} text="USD" />
                  </MenuDropdown>
                  </MenuItem>
                </Menu>
                <Link iconIos="f7:cart" iconAurora="f7:cart" iconMd="material:cart" panelOpen="right">
                  <BasketContext.Consumer>
                  {({ basket }) => (
                    <span>{ this.totalBasketQuantity(basket) || null}</span>
                  )}
                  </BasketContext.Consumer>
                </Link>            
              </NavRight>      
            </Navbar>
      )}    
      </UserContext.Consumer>  
      )}
      </CurrencyConxtext.Consumer> 
    )
  }       
}  

export default TopMenu;