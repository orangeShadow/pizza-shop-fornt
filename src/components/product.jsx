import React, { useState } from 'react';
import {
  Block, 
  Row,
  Col,
  Button,
  Stepper,
  Card,
  CardContent,
  CardHeader,
  CardFooter,  
  Icon
} from 'framework7-react';

import BasketContext from '../context/basket';
import PriceFormat from '../components/priceFormat';

class Product extends React.Component {
  constructor(props) {
    super(props);    
    this.product = props.product;    
    this.state = {
      quantity:0 
    };
    this.stepper = React.createRef();    
  }
  
  setQuantity(value) {        
    this.setState({quantity: value});       
  }
  
  addToBasket(basket, changeBasket) {
    let newBasket = basket;
    const product = this.product;
    const productId = product.id;
    const quantity = this.state.quantity;
    
    let findIndex = newBasket.findIndex( (item) => item.productId === productId );
    
    if (findIndex !== -1) {
      newBasket[findIndex].quantity += quantity;        
    } else {
      newBasket.push({productId, quantity, title:product.title, price: product.price, currency: product.currency});
    }      
    changeBasket(newBasket);      
    
    this.setState({quantity:0});
    this.stepper.current.setValue(0);
  }

  hasInBasket(basket) {
    const elementInBasket  = basket.find( (item) => item.productId === this.product.id);     
    const quantity = elementInBasket && elementInBasket.quantity || 0;     
    if( quantity > 0) {
      return (
        <span style={{marginLeft:10+'px'}}>in basket: {quantity}</span>      
      )
    }
    return null;
  }

  render () {
    return(           
      <BasketContext.Consumer>
        {({ basket, changeBasket }) => (
        <Card className="demo-card-header-pic">
        <CardHeader
          className="no-border"
          valign="bottom"              
        >{this.product.title}</CardHeader>
        <CardContent>              
          <Row>
            <Col width="35"><img width="100%" src={this.product.img}/></Col>
              <Col width="65">
                <Block>{this.product.description}</Block>   
              </Col>
            </Row>
          </CardContent>     
          <CardFooter>
            <div className="display-flex justify-content-flex-start">
              <PriceFormat price={this.product.price} currency={this.product.currency}/>              
            </div>
            <div className="display-flex justify-content-flex-end">
              <Stepper ref={this.stepper} value={this.state.quantity} fill onStepperChange={this.setQuantity.bind(this)}></Stepper> <Button style={{marginLeft: 10+'px'}} onClick={()=>{this.addToBasket(basket, changeBasket)}}  fill color="blue"><Icon f7="cart_badge_plus"/></Button> {this.hasInBasket(basket)}
            </div>            
          </CardFooter>      
        </Card>    
        )}
      </BasketContext.Consumer>   
    );
  }
}

export default Product;