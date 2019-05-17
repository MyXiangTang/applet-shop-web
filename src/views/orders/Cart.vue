<template>
  <section>
    <!--工具条-->
    <el-col :span="24"
            style="padding-bottom: 0px;padding-top: 50px;">
      <el-form :inline="true"
               :model="filters">
        <el-form-item label="顾客名称:">
          <el-input v-model="filters.wxCustomerName"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品名称:">
          <el-input v-model="filters.productName"
          ></el-input>
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
              @selection-change="selsChange"
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
                       label="数量"
                       min-width="150"
                       sortable>
      </el-table-column>
      <el-table-column prop="amt"
                       label="金额"
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
    getCartListPage
  } from "../../utils/AxiosClient"

  export default {
    data() {
      return {
        filters: {},
        objectComtent: [],
        total: 0,
        page: 1,
        pageSize: 20,
        listLoading: false
      }
    },
    methods: {
      //改变列表当前页时候触发
      handleCurrentChange(val) {
        this.page = val;
        this.getCart();
      },
      //获取用户列表
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
      }
    }
    ,
    mounted() {
      this.getCart();
    }
  }

</script>

<style scoped>
</style>
