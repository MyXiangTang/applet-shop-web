import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8070/api'
//设置请求头
axios.defaults.headers.post["Content-type"] = "application/json;charset=UTF-8"

//请求登陆
export const requestLogin = params => {
  return axios.post('/login/web', params).then(res => res.data);
};
//////////////////////////////////////////登陆用户////////////////////////////////////////////////////////
//获取登陆用户列表
export const getUserListPage = params => {
  return axios.post('/loginUser/listpage', params);
};

//新增登陆用户
export const saveLoginUser = params => {
  return axios.post('/loginUser/save', params);
};

//编辑登陆用户
export const editLoginUser = params => {
  return axios.post('/loginUser/edit', params);
};

export const removeLoginUser = params => {
  return axios.get('/loginUser/batchremove', {params: params});
};
//移除登陆用户
export const batchRemoveLoginUser = params => {
  return axios.get('/loginUser/batchremove', {params: params});
};

//////////////////////////////////////////商品分类////////////////////////////////////////////////////////
//获取商品分类列表
export const getDivisionListPage = params => {
  return axios.post('/division/listpage', params);
};

//新增商品分类
export const saveDivision = params => {
  return axios.post('/division/save', params);
};

//编辑商品分类
export const editDivision = params => {
  return axios.post('/division/edit', params);
};

export const removeDivision = params => {
  return axios.get('/division/batchremove', {params: params});
};
//移除商品分类
export const batchRemoveDivision = params => {
  return axios.get('/division/batchremove', {params: params});
};
//////////////////////////////////////////商品信息////////////////////////////////////////////////////////
//获取商品信息列表
export const getProductListPage = params => {
  return axios.post('/mProduct/listpage', params);
};

//新增商品信息
export const saveProduct = params => {
  return axios.post('/mProduct/save', params);
};

//编辑商品信息
export const editProduct = params => {
  return axios.post('/mProduct/edit', params);
};

export const removeProduct = params => {
  return axios.get('/mProduct/batchremove', {params: params});
};
//移除商品信息
export const batchRemoveProduct = params => {
  return axios.get('/mProduct/batchremove', {params: params});
};

//////////////////////////////////////////购物车////////////////////////////////////////////////////////
//获取购物车列表
export const getCartListPage = params => {
  return axios.post('/cart/listpage', params);
};
//////////////////////////////////////////顾客信息////////////////////////////////////////////////////////
//获取购物车列表
export const getCustomerListPage = params => {
  return axios.post('/customer/listpage', params);
};
