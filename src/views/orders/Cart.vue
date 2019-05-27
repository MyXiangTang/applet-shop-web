<template>
  <section>
    <!--工具条-->
    <el-col :span="24"
            style="padding-bottom: 0px;padding-top: 50px;">
      <el-form :inline="true"
               :model="filters">
        <el-form-item label="顾客:">
          <!--<el-input v-model="filters.wxCustomerName"-->
          <!--&gt;</el-input>-->
          <template>
            <el-select
              v-model="filters.wxCustomerId"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="searchCustomer"
              :blur="getCustomer"
              :loading="selectLoading">
              <el-option
                v-for="item in customers"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="商品名称:">
          <!--<el-input v-model="filters.productName"-->
          <!--&gt;</el-input>-->
          <template>
            <el-select
              v-model="filters.mProductId"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="searchProduct"
              :blur="getProduct"
              :loading="selectLoading">
              <el-option
                v-for="item in products"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="数量:">
          <el-input v-model="filters.qty"
          ></el-input>
        </el-form-item>
        <el-form-item label="金额:">
          <el-input v-model="filters.amt"
          ></el-input>
        </el-form-item>
        <el-col :span="24" style="padding-left: 40px;padding-top: 10px;">
          <el-form-item>
            <el-button type="primary"
                       @click="getCart">查询
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="objectComtent"
              stripe
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              highlight-current-row
              v-loading="listLoading"
              style="width: 100%;">
      <el-table-column type="selection"
                       width="30">
      </el-table-column>
      <el-table-column type="index"
                       width="30">
      </el-table-column>
      <el-table-column prop="wxCustomerName"
                       label="顾客名称"
                       min-width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="productName"
                       label="商品名称"
                       min-width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="qty"
                       label="数  量"
                       min-width="150"
                       sortable>
      </el-table-column>
      <el-table-column prop="amt"
                       label="金  额"
                       min-width="120"
                       sortable>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next"
                     background
                     @current-change="handleCurrentChange"
                     :page-size="pageSize"
                     :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

  </section>
</template>

<script>
  import {
    getCartListPage,
    getCustomerListPage,
    getProductListPage
  } from "../../utils/AxiosClient"

  export default {
    data() {
      return {
        filters: {},
        objectComtent: [],
        total: 0,
        page: 1,
        pageSize: 20,
        listLoading: false,
        customers: [],
        origCustomers: [],
        products: [],
        origProducts: [],
        selectLoading: false,
      }
    },
    methods: {
      //改变列表当前页时候触发
      handleCurrentChange(val) {
        this.page = val;
        this.getCart();
      },
      //获取购物车列表
      getCart() {
        let para = this.filters;
        para.page = (this.page - 1) * this.pageSize;
        para.pageSize = this.pageSize;
        this.listLoading = true;
        getCartListPage(para).then((res) => {
            let {msg, code, content} = res.data;
            if (code !== 200) {
              this.$message({
                message: msg,
                type: 'error'
              });
            } else {
              console.log(content);
              this.total = content.total;
              this.objectComtent = content.content;
              this.listLoading = false;
            }
          }
        );
      },
      //动态查询顾客
      searchCustomer: function (query) {
        if (query !== '') {
          this.customers = [];
          this.selectLoading = true;
          setTimeout(() => {
            this.selectLoading = false;
            for (let foritem of this.origCustomers) {
              if (foritem.name.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                this.customers.push(foritem)
              }
            }
          }, 200)
        }
      },
      //重新获取顾客
      getCustomer: function () {
        this.customers = this.origCustomers;
      },
      //初始化顾客
      initCustomer: function () {
        let para = {page: 0, pageSize: 100000}
        getCustomerListPage(para).then((res) => {
          let {msg, code, content} = res.data;
          if (code !== 200) {
            this.$message({
              message: msg,
              type: 'error'
            });
          } else {
            this.origCustomers = content.content;
            this.customers = content.content;
          }
        })
      },
      //动态查询商品档案
      searchProduct: function (query) {
        if (query !== '') {
          this.products = [];
          this.selectLoading = true;
          setTimeout(() => {
            this.selectLoading = false;
            for (let foritem of this.origProducts) {
              if (foritem.name.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                this.products.push(foritem)
              }
            }
          }, 200)
        }
      },
      //重新获取商品档案
      getProduct: function () {
        this.products = this.origProducts;
      },
      //初始化商品档案
      initProduct: function () {
        let para = {page: 0, pageSize: 100000}
        getProductListPage(para).then((res) => {
          let {msg, code, content} = res.data;
          if (code !== 200) {
            this.$message({
              message: msg,
              type: 'error'
            });
          } else {
            this.origProducts = content.content;
            this.products = content.content;
          }
        })
      }
    }
    ,
    mounted() {
      this.getCart();
      this.initCustomer();
      this.initProduct();
    }
  }

</script>

<style scoped>
</style>
