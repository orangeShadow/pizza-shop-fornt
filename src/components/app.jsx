import React from 'react';

import {
  App,
  Panel,
  Views,
  View,
  Popup,
  Page,
  Navbar,
  Toolbar,
  NavRight,
  Link,
  Block,
  BlockTitle,
  LoginScreen,
  LoginScreenTitle,
  List,
  Tabs,
  Tab,
  ListItem,
  ListInput,
  ListButton,
  BlockFooter
} from 'framework7-react';

import BasketList from '../components/basketList';
import routes from '../js/routes';
import ProductContext, {loadProducts} from '../context/products';
import BasketContext from '../context/basket';
import CurrencyContext from '../context/currency';
import DeliveryContext, {loadDeliveries} from '../context/delivery';
import UserContext, {login, register, checkAuth} from '../context/user';

export default class extends React.Component {

  constructor() {
    super();
    
    this.changeBasket = (basket) => {
      this.setState({basket});
    };

    this.changeCurrency = (currency) =>  {
      Promise.all([loadProducts(currency), loadDeliveries(currency)]).then((values)=>{
        const products = values[0];
        const deliveries = values[1];
        
        const basket = this.state.basket.map((basketItem)=>{    
          let product = products.find( (product) => product.id === basketItem.productId);        
          basketItem.price = product.price;
          basketItem.currency = product.currency;
          return basketItem;
        });                         
        this.setState({products, deliveries, basket, currency});       
      });                
    };

    this.login = (loginForm) => {
      this.state.loginErrors = {};    
      login(this.state.loginForm).then((data)=>{
        this.setState({user:data});
        this.$f7.loginScreen.close();
        localStorage.setItem('user', JSON.stringify(data));
      }).catch((error)=>{        
        if(error.response && error.response.status === 401) {
          this.setState({loginErrors:error.response.data.errors});
        }   
        console.log(error);     
      });
    };

    this.register = (registerForm) => {  
      this.state.registerErrors = {};    
      register(this.state.registerForm).then((data)=>{        
        this.setState({user:data});        
        this.$f7.loginScreen.close();
        localStorage.setItem('user', JSON.stringify(data));
      }).catch((error)=>{        
        if(error.response && error.response.status === 422) {
          this.setState({registerErrors:error.response.data.errors});
        } 
        console.log(error);
      });
    };

    this.checkAuth = (user) => {
      checkAuth(user).then(()=>{
        this.setState({user});
      }).catch((error)=>{        
        localStorage.removeItem('user');
      });
    };
  
    let defaultCurrency=  "EUR";
    
    this.state = {
      // Framework7 Parameters
      f7params: {
        name: 'Pizza shop', // App name
        theme: 'aurora', // Automatic theme detectio
        pushState: true,
        // App routes
        routes: routes,
      },      
      login: this.login,
      register: this.register,
      changeBasket: this.changeBasket,
      changeCurrency: this.changeCurrency,
      login: this.login,
      register: this.register,
      currency: defaultCurrency,            
      deliveries: [],
      products: [],
      basket: [],      
      user:null,
      loginForm:{
        email:'',
        password:''
      },
      registerForm:{
        name:'',
        email:'',
        password:'',
        password_confirmation:'',
      },
      registerErrors:{},
      loginErrors:{}
    }
  }

  componentWillMount() {    
    Promise.all([loadProducts(this.state.currency), loadDeliveries(this.state.currency)]).then((values)=>{
      this.setState({products:values[0], deliveries:values[1]});       
    });
  }

  render() {  

    const deliveryList = this.state.deliveries.map((item) => {
      return (<div key={item.id}>
        <BlockTitle>{item.title}</BlockTitle>
        <Block>{item.description}</Block>
      </div>);
    });

    return (                 
      <CurrencyContext.Provider value={this.state}>
      <DeliveryContext.Provider value={this.state.deliveries}>
      <BasketContext.Provider value={this.state}>
      <ProductContext.Provider value={this.state.products}>
      <UserContext.Provider value={this.state}>
          <App params={ this.state.f7params } >
          {/* Right panel with reveal effect*/}
          <Panel right reveal themeDark>
            <View>
              <Page>
                <Navbar title="Order"/> 
                <BasketList />
              </Page>
            </View>
          </Panel>


          {/* Your main view, should have "view-main" class */}
          <View main className="safe-areas" url="/" products="produtcs"/>

          {/* Popup */}
          <Popup id="delivery-popup">
            <View>
              <Page>
                <Navbar title="Delivery price and conditions">
                  <NavRight>
                    <Link popupClose>Close</Link>
                  </NavRight>
                </Navbar>
                <Block>
                  {deliveryList}                  
                </Block>
              </Page>
            </View>
          </Popup>

          <LoginScreen id="my-login-screen">
            <View>
              <Page loginScreen>
                <Navbar>
                  <NavRight><Link iconIos="f7:xmark" iconAurora="f7:xmark" iconMd="material:xmark" loginScreenClose="#my-login-screen"/></NavRight>
                </Navbar>                
                <Tabs>                  
                  <Tab id="login-tab" className="page-content" tabActive>
                    <LoginScreenTitle>Login</LoginScreenTitle>
                    <List form>
                      <ListInput
                        type="text"
                        name="email"
                        placeholder="Your email"
                        value={this.state.loginForm.email}
                        errorMessage={this.state.loginErrors['email'] && this.state.loginErrors['email'].join('')}
                        errorMessageForce = {this.state.loginErrors['email'] && true}
                        onInput={(e) => this.setStateForObject(this.state.loginForm, 'email', e.target.value)}
                      ></ListInput>
                      <ListInput
                        type="password"
                        name="password"
                        placeholder="Your password"
                        value={this.state.loginForm.password}                        
                        onInput={(e) => this.setStateForObject(this.state.loginForm, 'password', e.target.value)}
                      ></ListInput>
                    </List>
                    <List>
                      <ListButton title="Sign In" onClick={() => this.login()} />
                      <ListButton title="Registration" onClick={() => this.$f7.tab.show('#register-tab')} />
                      <BlockFooter>
                        If you want to have a history of your orders, please login or registered
                      </BlockFooter>
                    </List>
                  </Tab>
                  <Tab id="register-tab" className="page-content">
                    <LoginScreenTitle>Registration</LoginScreenTitle>
                    <List form>
                      <ListInput
                        autofocus={true}
                        type="text"
                        name="name"
                        placeholder="Your name"
                        errorMessage={this.state.registerErrors['name'] && this.state.registerErrors['name'].join('')}
                        errorMessageForce = {this.state.registerErrors['name'] && true}
                        value={this.state.registerForm.name}
                        onInput={(e) => this.setStateForObject(this.state.registerForm, 'name', e.target.value)}
                      ></ListInput>
                      <ListInput
                        type="text"
                        name="email"
                        placeholder="Your email"
                        value={this.state.registerForm.email}
                        errorMessage={this.state.registerErrors['email'] && this.state.registerErrors['email'].join('')}
                        errorMessageForce = {this.state.registerErrors['email'] && true}
                        onInput={(e) => this.setStateForObject(this.state.registerForm, 'email', e.target.value)}
                      ></ListInput>
                      <ListInput
                        type="password"
                        name="password"
                        placeholder="Your password"
                        value={this.state.registerForm.password}
                        errorMessage={this.state.registerErrors['password'] && this.state.registerErrors['password'].join('')}
                        errorMessageForce = {this.state.registerErrors['password'] && true}
                        onInput={(e) => this.setStateForObject(this.state.registerForm, 'password', e.target.value)}
                      ></ListInput>
                      <ListInput
                        type="password"
                        name="password_confirmation"
                        placeholder="Password confirmation"
                        value={this.state.registerForm.password_confirmation}
                        onInput={(e) => this.setStateForObject(this.state.registerForm, 'password_confirmation', e.target.value)}
                      ></ListInput>
                    </List>
                    <List>
                      <ListButton title="Sign Up" onClick={() => this.signUp()} />
                      <ListButton title="Login" onClick={() => this.$f7.tab.show('#login-tab')} />                      
                    </List>
                  </Tab>  
                </Tabs>                
              </Page>
            </View>
          </LoginScreen>          
        </App>
      </UserContext.Provider> 
      </ProductContext.Provider>
      </BasketContext.Provider>
      </DeliveryContext.Provider>
      </CurrencyContext.Provider>    
    )
  }    
  openRegistration(){
    this.$f7.tab.show('#register-tab');
  }
  signUp() {    
    this.register();
  }
  signIn() {
    this.login();
  }
  setStateForObject(object, field, value) 
  {
    object[field] = value;
    this.setState(object);
  } 
  componentDidMount() {
    this.$f7ready((f7) => {
      let user = localStorage.hasOwnProperty('user') && JSON.parse(localStorage.getItem('user'));      
      if(user && user.api_token) {
        this.checkAuth(user);      
      }    
      // Call F7 APIs here
    });
  }
}