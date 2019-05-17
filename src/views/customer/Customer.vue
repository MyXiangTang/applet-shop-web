<template>
  <section>
    <!--工具条-->
    <el-col :span="24"
            style="padding-bottom: 0px;padding-top: 50px;">
      <el-form :inline="true"
               :model="filters">
        <el-form-item label="名称:">
          <el-input v-model="filters.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码:">
          <el-input v-model="filters.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="openId:">
          <el-input v-model="filters.openId"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址:">
          <el-input v-model="filters.address"
          ></el-input>
        </el-form-item>
        <el-col :span="24" style="padding-left: 40px;padding-top: 10px;">
          <el-form-item>
            <el-button type="primary"
                       @click="getCustomer">查询
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
      <el-table-column prop="name"
                       label="名称"
                       min-width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="phone"
                       label="手机号码"
                       min-width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="openId"
                       label="openId"
                       min-width="150"
                       sortable>
      </el-table-column>
      <el-table-column prop="address"
                       label="地址"
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
    getCustomerListPage
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
        this.getCustomer();
      },
      //获取用户列表
      getCustomer() {
        let para = this.filters;
        para.page = (this.page - 1) * this.pageSize;
        para.pageSize = this.pageSize;
        this.listLoading = true;
        getCustomerListPage(para).then((res) => {
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
      this.getCustomer();
    }
  }

</script>

<style scoped>
</style>
