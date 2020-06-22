import React, { Component, useState} from 'react';
import {
  Page, 
  Block,
  BlockTitle,  
  Row, 
  Col,
  List,
  ListItem,
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent
} from 'framework7-react';

import TopMenu from '../components/topMenu';

import UserContext,{getOrderList} from '../context/user';

class OrdersPage extends Component {  
  constructor() {        
    super();    

    this.state = {
      orders: []
    }
  }

  componentDidMount() {
    this.$f7ready((f7) => {
      let {user} = this.context;      
      getOrderList(user.api_token).then((data) => {        
        this.setState({orders:data});        
      });      
    });
  }

  render() {

    let basketMap = function(basket) {
      return basket.map( (item) => (<p key={'basket-'+item.id}>{item.product} x {item.quantity} - {item.price}</p>))
    } 

    let orderMap =  this.state.orders.map((item) => {        
        return (<ListItem accordionItem key={'order_'+item.id}  title={'Order №'+item.id+' at: ' + item.created_at}>
          <AccordionContent>
            <Block>
              <p>name: {item.name}</p>
              {item.phone && <p>phone: {item.phone}</p>}
              {item.address && <p>address: {item.address}</p>}              
              {item.deliveryPrice && <p>delivery price: {item.deliveryPrice}</p>}
              <p>total price: {item.totalPrice}</p>
              <div>
                <BlockTitle>Basket:</BlockTitle>
              </div>
              {basketMap(item.basket)}
            </Block>
          </AccordionContent>
        </ListItem>);
      }); 

    return (                
      <Page name="orders">
        {/* Top Navbar */}
        <TopMenu/>

        <BlockTitle className="text-align-center"><h1 >Order list</h1></BlockTitle>
        <Block>
          <Row>
            <Col>
            {
              this.state.orders.length > 0  ? <List accordionList>{orderMap}</List> : <Block>Your order list is empty.</Block>
            }              
            </Col>            
          </Row>
        </Block>        
      </Page>                        
    )
  }
}

OrdersPage.contextType = UserContext;

export default OrdersPage;