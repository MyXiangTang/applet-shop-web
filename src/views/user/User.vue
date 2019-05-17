<template>
  <section>
    <!--工具条-->
    <el-col :span="24"
            style="padding-bottom: 0px;padding-top: 50px;">
      <el-form :inline="true"
               :model="filters">
        <el-form-item label="姓名:">
          <el-input v-model="filters.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄:">
          <el-input v-model="filters.age"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码:">
          <el-input v-model="filters.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="filters.email"
          ></el-input>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label="性别">
            <el-radio-group v-model="filters.sex">
              <el-radio-button class="radio"
                               label="男">男
              </el-radio-button>
              <el-radio-button class="radio"
                               label="女">女
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="padding-left: 40px;padding-top: 10px;">
          <el-form-item>
            <el-button type="primary"
                       @click="getUsers">查询
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
    <el-table :data="users"
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
                       label="姓名"
                       width="80"
                       sortable>
      </el-table-column>
      <el-table-column prop="sex"
                       label="性别"
                       width="80"
                       sortable>
      </el-table-column>
      <el-table-column prop="age"
                       label="年龄"
                       width="80"
                       sortable>
      </el-table-column>
      <el-table-column prop="birth"
                       label="生日"
                       width="120"
                       :formatter="formatBirth"
                       sortable>
      </el-table-column>
      <el-table-column prop="password"
                       label="密码"
                       min-width="80">
      </el-table-column>
      <el-table-column prop="email"
                       label="邮箱"
                       min-width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="phone"
                       label="手机号码"
                       min-width="120"
                       sortable>
      </el-table-column>
      <el-table-column label="操作"
                       width="150">
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
        <el-form-item label="姓名"
                      prop="name">
          <el-input v-model="editForm.name"
                    auto-complete="off"
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio"
                      label="男">男
            </el-radio>
            <el-radio class="radio"
                      label="女">女
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age"
                           :min="0"
                           :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="editForm.birth"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
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
               label-width="80px"
               :rules="addFormRules"
               ref="addForm">
        <el-form-item label="姓名"
                      prop="name">
          <el-input v-model="addForm.name"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio"
                      label="男">男
            </el-radio>
            <el-radio class="radio"
                      label="女">女
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="addForm.age"
                           :min="0"
                           :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日" prop="birth">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="addForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
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
  import util from '../../utils/util'
  import {
    getUserListPage,
    saveLoginUser,
    editLoginUser,
    removeLoginUser,
    batchRemoveLoginUser
  } from "../../utils/AxiosClient"

  export default {
    data() {
      return {
        filters: {name: null, sex: null, age: null, phone: null, email: null},
        users: [],
        total: 0,
        page: 1,
        pageSize: 2,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'}
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          phone: '',
          password: '',
          email: ''
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          name: '',
          sex: '男',
          age: 0,
          birth: '',
          phone: '',
          password: '',
          email: ''
        }

      }
    },
    methods: {
      //改变列表当前页时候触发
      handleCurrentChange(val) {
        this.page = val;
        this.getUsers();
      },
      //获取用户列表
      getUsers() {
        let para = this.filters;
        para.page = (this.page - 1) * this.pageSize;
        para.pageSize = this.pageSize;
        this.listLoading = true;
        getUserListPage(para).then((res) => {
            let {msg, code, content} = res.data;
            if (code !== 200) {
              this.$message({
                message: msg,
                type: 'error'
              });
            } else {
              console.log(content);
              this.total = content.total;
              this.users = content.loginUserList;
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
              para.births = (!para.birth || para.birth == '') ? null : util.formatDate.format(new Date(para.birth), 'yyyyMMdd');
              editLoginUser(para).then((res) => {
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
                  this.getUsers();
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
              para.births = (!para.birth || para.birth == '') ? null : util.formatDate.format(new Date(para.birth), 'yyyyMMdd');
              saveLoginUser(para).then((res) => {
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
                  this.getUsers();
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
          removeLoginUser(para).then((res) => {
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
              this.getUsers();
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
          batchRemoveLoginUser(para).then((res) => {
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
              this.getUsers();
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
      formatBirth: function (row, column) {
        if (row.birth && row.birth != "") {
          var date = new Date(row.birth);
          return util.formatDate.format(date, 'yyyy-MM-dd');
        } else {
          return null;
        }

      }
    }
    ,
    mounted() {
      this.getUsers();
    }
  }

</script>

<style scoped>
</style>
