export default {
  apiUrl: `http://localhost:8000/api`,  
  /**
   * product list
   */
  getProducts(){ 
    return `${this.apiUrl}/product`;
  },
  getDeliveries() {
    return `${this.apiUrl}/delivery`;
  },
  createOrder() {
    return `${this.apiUrl}/order`;
  },
  login(){
    return `${this.apiUrl}/auth`;
  },
  register(){
    return `${this.apiUrl}/register`;
  },
  checkAuth(){
    return `${this.apiUrl}/check-auth`;
  },
  orderList(){
    return `${this.apiUrl}/order-list`;
  },
};