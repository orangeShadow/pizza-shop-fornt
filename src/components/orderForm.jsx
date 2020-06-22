import React from 'react';
import axiox from 'axios';

import config from '../js/config';

import {
  Block, 
  BlockTitle,
  List,  
  ListItem,
  ListInput,
  Button,
  Preloader
} from 'framework7-react';

import DeliveryContext, { loadDeliveries } from '../context/delivery';
import UserContext from '../context/user';
import PriceFormat from '../components/priceFormat';

class OrderForm extends React.Component {
  
  constructor(props) { 
    super(props);            
   
    this.state = {
      name: "",
      email: "",
      phone: "",
      address:"",
      deliveryId: 1,       
      errors: {},
      loading:false      
    };
  }


  /**
   * Change input
   * @param Event event 
   * @param string fieldName 
   */
  changeField(event, fieldName) {
    let state = {};
    state[fieldName] = event.target.value;    
    this.setState(state);
  }


  /**
   * 
   * @param Event event 
   */
  onSubmit(event, deliveryList, user) {
    event.preventDefault();
    
    this.setState({loading: true});
    
    let data = {
      currency: this.props.currency,
      basket: this.props.basket, 
      name:this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      address: this.state.address,      
      deliveryId: this.state.deliveryId, 
    };
    
    let headers = {};

    if (user && user.api_token) {
      headers.Authorization = `Bearer ${user.api_token}`;
    }

    axiox.post(config.createOrder(),data, {headers:headers}).then(({data}) => {
      
      let messages = [];
      
      const order = data.data;

      if(order.id) {
        messages.push('<p><i class="f7-icons">checkmark_alt_circle</i> Order create, your order number is:'+order.id+'</p>');
      }

      if (order.deliveryPrice) {
        messages.push('<p>Delivery price: '+order.deliveryPrice+'</p>');        
      }

      if(order.address) {
        messages.push('<p>Delivery address: '+order.address+'</p>');
      }

      if (order.totalPrice) {
        messages.push('<p>Total order price: '+order.totalPrice+'</p>');
      }
 
      this.$f7.toast.create({      
        text: messages.join(''),
        position: 'center',
        closeButton: true,
        closeButtonText: 'Close',
      }).open();
      this.setState({loading: false});
      this.props.changeBasket([]);      
    }).catch((error)=>{ 
      this.setState({loading: false});
      if(error.response && error.response.status == 422) {        
        this.setState({errors:xhr.response.data.errors});        
      } else if(error.response) {
        this.$f7.toast.create({      
          text: 'Soory, order creating error!',
          position: 'center',
          closeButton: true,
          closeButtonText: 'Close',
        }).open();
      } else {
        console.log(error);
      }
    });
  }

  componentWillMount() 
  {
    const deliveryList = this.context;      
    this.setState({deliveryId:deliveryList[0].id});    
  }

  render() {
    const deliveryList = this.context;      
  
    return (      
      <UserContext.Consumer>
        {({user})=>(
      <form onSubmit={(event)=>{this.onSubmit(event,deliveryList,user)}}>
      <BlockTitle>Please input your data</BlockTitle>      
      <List noHairlinesMd>
        <ListInput
          required
          label="Name"
          type="text"
          placeholder="Your name"          
          value={this.state.name}
          errorMessage={this.state.errors['name'] && this.state.errors['name'].join('')}
          onChange={ (event) => {this.changeField(event,'name')} }
        ></ListInput>
        <ListInput
          required
          label="Email"
          type="text"
          placeholder="Your email"          
          value={this.state.email}
          errorMessageForce = {this.state.errors['email'] && this.state.errors['email'].length>0}
          errorMessage={this.state.errors['email'] && this.state.errors['email'].join('')}
          onChange={ (event) => {this.changeField(event,'email')} }
        ></ListInput>
        <ListInput          
          label="Phone"
          type="text"
          placeholder="Your phone"          
          value={this.state.phone}          
          errorMessage={this.state.errors['phone'] && this.state.errors['phone'].join('')}
          onChange={ (event) => {this.changeField(event,'phone')} }
        ></ListInput>
        <ListInput
          required
          label="Delivery"
          type="select"        
          value={this.state.deliveryId}          
          onChange={ (event) => { this.changeField(event,'deliveryId');} }
          errorMessage={this.state.errors['deliveryId'] && this.state.errors['deliveryId'].join('')}>            
            {
              deliveryList.map((item) => (<option key={'delivery-'+item.id} value={item.id}>{item.title}</option>))
            }            
        </ListInput>
        {
          this.state.deliveryId !== 1 && <ListInput          
            label="Address"
            type="text"          
            value={this.state.address}
            errorMessage={this.state.errors['address'] && this.state.errors['address'].join('')}
            onChange={ (event) => {this.changeField(event,'address')} }
          ></ListInput>
        }            
        <ListItem>
          {
            !this.state.loading ? <Button type="submit" fill color="orange">Confirm order</Button>:<Preloader color="orange"></Preloader>
          }
        </ListItem>
      </List>  
      </form>  
      )}
      </UserContext.Consumer>    
    )
  }
}

OrderForm.contextType = DeliveryContext;

export default OrderForm