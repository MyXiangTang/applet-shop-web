<template>
  <section>
    <!--工具条-->
    <el-col :span="24"
            style="padding-bottom: 0px;padding-top: 50px;">
      <el-form :inline="true"
               :model="filters">
        <el-form-item label="单据编号:">
          <el-input v-model="filters.docno"
          ></el-input>
        </el-form-item>
        <el-form-item label="顾客:">
          <!--<el-input v-model="filters.wxCustomerId"-->
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
        <el-form-item label="单据日期:">
          <!--<el-input v-model="filters.billdate"-->
          <!--&gt;</el-input>-->
          <template>
            <el-date-picker
              v-model="filters.billdate"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyyMMdd"
              :picker-options="pickerOptions">
            </el-date-picker>
          </template>
        </el-form-item>
        <el-form-item label="单据状态:">
          <!--<el-input v-model="filters.status"-->
          <!--&gt;</el-input>-->
          <template>
            <el-select v-model="filters.status" placeholder="请选择" clearable>
              <el-option
                v-for="item in ordersStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-col :span="24" style="padding-left: 40px;padding-top: 10px;">
          <el-form-item>
            <el-button type="primary"
                       @click="getSale">查询
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
                       width="50">
      </el-table-column>
      <el-table-column type="index"
                       width="50">
      </el-table-column>
      <el-table-column prop="docno"
                       label="单据编号"
                       width="130"
                       sortable>
      </el-table-column>
      <el-table-column prop="billdate"
                       label="单据日期"
                       width="130"
                       sortable>
      </el-table-column>
      <el-table-column prop="wxCustomerName"
                       label="顾客"
                       width="130"
                       sortable>
      </el-table-column>
      <el-table-column prop="totQty"
                       label="总数量"
                       width="130"
                       sortable>
      </el-table-column>
      <el-table-column prop="totAmt"
                       label="总金额"
                       min-width="130">
      </el-table-column>
      <el-table-column prop="status"
                       label="单据状态"
                       min-width="130"
                       sortable>
      </el-table-column>
      <el-table-column type="expand"  >
        <template slot-scope="props">
          <div v-for ="item in props.row.details">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="id:">
              <span>{{ item.id }}</span>
            </el-form-item>
            <el-form-item label="商品名称:">
              <span>{{ item.mProductName }}</span>
            </el-form-item>
            <el-form-item label="数量:">
              <span>{{ item.qty }}</span>
            </el-form-item>
            <el-form-item label="金额:">
              <span>{{ item.amt }}</span>
            </el-form-item>
          </el-form>
          </div>
        </template>
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
    getSaleListPage,
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
        pageSize: 2,
        listLoading: false,
        customers: [],
        origCustomers: [],
        products: [],
        origProducts: [],
        selectLoading: false,
        ordersStatus: [{value: '待付款', label: '待付款'}, {value: '已取消', label: '已取消'}, {value: '待发货', label: '待发货'}],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    methods: {
      //改变列表当前页时候触发
      handleCurrentChange(val) {
        this.page = val;
        this.getSale();
      },
      //获取销售单列表
      getSale() {
        let para = this.filters;
        para.page = (this.page - 1) * this.pageSize;
        para.pageSize = this.pageSize;
        this.listLoading = true;
        getSaleListPage(para).then((res) => {
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
      this.getSale();
      this.initCustomer();
      this.initProduct();
    }
  }

</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand .el-form-item label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    color: #99a9bf;
    margin-right: 0;
    margin-bottom: 0;
    width: 20%;
  }
</style>
