import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Customer from '../views/customer/Customer.vue'
import Orders from '../views/orders/Orders.vue'
import Cart from '../views/orders/Cart.vue'
import Product from '../views/product/Product.vue'
import Division from '../views/product/Division.vue'
import User from '../views/user/User.vue'
import echarts from '../views/charts/echarts.vue'
import NotFound from '../views/404.vue'

let routers = [
  {
    path: '/test',
    component: User,
    name: '测试界面',
    hidden: true
  }, {
    path: '/login',
    component: Login,
    name: '登陆界面',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '404',
    hidden: true
  },
  //商品信息
  {
    path: '/',
    component: Home,
    name: '商品档案',
    iconCls: 'fa fa-id-card-o',   //图标样式class
    children: [{
      path: '/product',
      component: Product,
      name: '商品管理'
    },
      {
        path: '/division',
        component: Division,
        name: '商品分类'
      }]
  },
//  订单信息
  {
    path: '/',
    component: Home,
    name: '订单管理',
    iconCls: 'fa fa-id-card-o',
    children: [
      {
        path: '/orders',
        component: Orders,
        name: '销售单'
      }, {
        path: '/cart',
        component: Cart,
        name: '购物车'
      }]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true, //只有一个节点
    children: [{
      path: '/customer',
      component: Customer,
      name: '顾客信息'
    }]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true, //只有一个节点
    children: [{
      path: '/user',
      component: User,
      name: 'User'
    }]
  },
  {
    path: '/',
    component: Home,
    name: 'Charts',
    iconCls: 'fa fa-bar-chart',
    children: [{
      path: '/echarts',
      component: echarts,
      name: 'echarts'
    }]
  },
  {
    path: '*',
    hidden: true,
    redirect: {
      path: '/404'
    }
  }
]

export default routers;
