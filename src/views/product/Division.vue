<template>
  <section>
    <!--工具条-->
    <el-col :span="24"
            style="padding-bottom: 0px;padding-top: 50px;">
      <el-form :inline="true"
               :model="filters">
        <el-form-item label="分类代号:">
          <el-input v-model="filters.code"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类名称:">
          <el-input v-model="filters.name"
          ></el-input>
        </el-form-item>
        <el-col :span="24" style="padding-left: 40px;padding-top: 10px;">
          <el-form-item>
            <el-button type="primary"
                       @click="getDivision">查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       style="margin-left: 20px"
                       @click="handleAdd">新增
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
                       width="100">
      </el-table-column>
      <el-table-column type="index"
                       width="100">
      </el-table-column>
      <el-table-column prop="code"
                       label="分类代号(不可重复)"
                       min-width="280"
                       sortable>
      </el-table-column>
      <el-table-column prop="name"
                       label="分类名称"
                       min-width="280"
                       sortable>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="315">
        <template scope="scope">
          <el-button size="mini"
                     @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button type="danger"
                     size="mini"
                     @click="handleDel(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger"
                 @click="batchRemove"
                 :disabled="this.sels.length===0">批量删除
      </el-button>
      <el-pagination layout="prev, pager, next"
                     background
                     @current-change="handleCurrentChange"
                     :page-size="pageSize"
                     :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑"
               v-model="editFormVisible"
               :visible.sync="editFormVisible"
               :close-on-click-modal="false">
      <el-form :model="editForm"
               label-width="80px"
               :rules="editFormRules"
               ref="editForm">
        <el-form-item label="代号"
                      prop="code">
          <el-input v-model="editForm.code"
                    auto-complete="off"
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="editForm.name"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click.native="editSubmit"
                   :loading="editLoading">提交
        </el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增"
               v-model="addFormVisible"
               :visible.sync="addFormVisible"
               :close-on-click-modal="false">
      <el-form :model="addForm"
               label-width="120px"
               :rules="addFormRules"
               ref="addForm">
        <el-form-item label="代号(不可重复)"
                      prop="code">
          <el-input v-model="addForm.code"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="addForm.name"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click.native="addSubmit"
                   :loading="addLoading">提交
        </el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  import {
    batchRemoveDivision,
    editDivision,
    getDivisionListPage,
    removeDivision,
    saveDivision
  } from "../../utils/AxiosClient"

  export default {
    data() {
      return {
        filters: {code: null, name: null},
        objectComtent: [],
        total: 0,
        page: 1,
        pageSize: 20,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          code: '',
          name: ''
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入代码', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          id: 0,
          code: '',
          name: ''
        }

      }
    },
    methods: {
      //改变列表当前页时候触发
      handleCurrentChange(val) {
        this.page = val;
        this.getDivision();
      },
      //获取用户列表
      getDivision() {
        let para = this.filters;
        para.page = (this.page - 1) * this.pageSize;
        para.pageSize = this.pageSize;
        this.listLoading = true;
        getDivisionListPage(para).then((res) => {
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

      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        console.log(this.editForm);
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
      },
      //编辑提交按钮
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let para = Object.assign({}, this.editForm);
              editDivision(para).then((res) => {
                this.editLoading = false;
                if (res.data.code !== 200) {
                  this.$message({
                    message: res.data.msg,
                    type: 'error'
                  });
                } else {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.getDivision();
                }
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
              });
            });
          }
        });
      },
      //新增提交按钮
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              let para = Object.assign({}, this.addForm);
              saveDivision(para).then((res) => {
                this.addLoading = false;
                if (res.data.code !== 200) {
                  this.$message({
                    message: res.data.msg,
                    type: 'error'
                  });
                } else {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.getDivision();
                }
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
              });
            });
          }
        });
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let para = {ids: row.id};
          removeDivision(para).then((res) => {
            this.listLoading = false;
            if (res.data.code !== 200) {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            } else {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getDivision();
            }
          });
        }).catch(() => {

        });
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let para = {ids: ids};
          batchRemoveDivision(para).then((res) => {
            this.listLoading = false;
            if (res.data.code !== 200) {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            } else {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getDivision();
            }
          });
        }).catch(() => {

        });
      },
      //选中明细事件
      selsChange: function (sels) {
        console.log("sels:" + sels);
        this.sels = sels;
      },
    }
    ,
    mounted() {
      this.getDivision();
    }
  }

</script>

<style scoped>
</style>
