import React, { Component, useState} from 'react';
import {
  Page,
  Block,
  BlockTitle,  
  Row,
  Col,
  Menu,
  MenuItem,
  MenuDropdown,
  MenuDropdownItem,
  Button
} from 'framework7-react';

import Product from '../components/product';
import TopMenu from '../components/topMenu';

import ProductContext from '../context/products';
import CurrencyConxtext from '../context/currency';
import UserContext from '../context/user';

class HomePage extends Component {  
  constructor() {        
    super();    
  }

  render() {
    return (          
      <CurrencyConxtext.Consumer>
      {({currency, changeCurrency}) =>(
      <UserContext.Consumer>
      {({user}) => (
      <ProductContext.Consumer>
        {(products) => (
          <Page name="home">
            {/* Top Navbar */}            
            <TopMenu />
            <BlockTitle className="text-align-center"><h1 >Pizza for any taste!</h1></BlockTitle>
            <Block>
              <Row>
                {
                  products.map((product) => {      
                    return <Col width="100" medium="50" key={product.id+''+product.currency}><Product product={product}/></Col>;
                  })
                }
              </Row>
            </Block>        
          </Page>   
        )}            
      </ProductContext.Consumer>
      )}    
      </UserContext.Consumer>  
      )}
      </CurrencyConxtext.Consumer> 
      
    )
  }
}

export default HomePage;