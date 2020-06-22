
import HomePage from '../pages/home.jsx';
import OrdersPage from '../pages/orders.jsx';

import NotFoundPage from '../pages/404.jsx';

var routes = [
  {
    path: '/',
    component: HomePage,
  }, 
  {
    path: '/orders',
    component: OrdersPage,
  }, 
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
