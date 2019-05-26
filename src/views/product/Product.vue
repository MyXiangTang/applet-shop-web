<template>
  <section>
    <!--工具条-->
    <el-col :span="24"
            style="padding-bottom: 0px;padding-top: 50px;">
      <el-form :inline="true"
               :model="filters">
        <el-form-item label="代号:">
          <el-input v-model="filters.code"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称:">
          <el-input v-model="filters.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="长名称:">
          <el-input v-model="filters.longName"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品分类:">
          <!--<el-input v-model="filters.divisionId"-->
          <!--&gt;</el-input>-->
          <template>
            <el-select
              v-model="filters.divisionId"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="searchDivision"
              :blur="getDivision"
              :loading="divisionLoading">
              <el-option
                v-for="item in divisions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-col :span="24" style="padding-left: 40px;padding-top: 10px;">
          <el-form-item>
            <el-button type="primary"
                       @click="getProduct">查询
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
                       width="30">
      </el-table-column>
      <el-table-column type="index"
                       width="30">
      </el-table-column>
      <el-table-column prop="code"
                       label="代号(不可重复)"
                       min-width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="name"
                       label="名称"
                       min-width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="longName"
                       label="长名称"
                       min-width="150"
                       sortable>
      </el-table-column>
      <el-table-column prop="divisionId"
                       label="商品分类"
                       min-width="120"
                       :formatter="formatDivision"
                       sortable>
      </el-table-column>
      <el-table-column prop="pricelist"
                       label="吊牌价"
                       min-width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="imgUrl"
                       label="图片名称"
                       min-width="120"
                       sortable>
      </el-table-column>
      <el-table-column label="图片" min-width="90">
        <template scope="scope">
          <img alt="暂无商品图片" style="width:90px;height:90px" :src="'api/'+scope.row.imgUrl"/>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="150">
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
        <el-form-item label="长名称"
                      prop="longName">
          <el-input v-model="editForm.longName"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类"
                      prop="divisionId">
          <!--<el-input v-model="editForm.divisionId"-->
          <!--auto-complete="off"></el-input>-->
          <template>
            <el-select
              v-model="editForm.divisionId"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="searchDivision"
              :blur="getDivision"
              :loading="divisionLoading">
              <el-option
                v-for="item in divisions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="吊牌价"
                      prop="pricelist">
          <el-input v-model="editForm.pricelist"
                    auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="图片名称"-->
        <!--prop="imgUrl">-->
        <!--<el-input v-model="editForm.imgUrl"-->
        <!--auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <label class="el-form-item__label" style="width: 80px;">上传图片</label>
        <el-upload
          class="upload-demo"
          :limit=1
          list-type="picture-card"
          action="/api/file/upload"
          :before-upload="beforeAddUpload"
          :on-success="successEditUpload"
          :on-remove="removeEditUpload"
          :file-list="editfileList"
          ref="upload"
          style="margin-left:80px;">
          <i class="el-icon-upload"></i>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1mb！</div>
        </el-upload>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click.native="editCancel">取消</el-button>
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
        <el-form-item label="长名称"
                      prop="longName">
          <el-input v-model="addForm.longName"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类"
                      prop="divisionId">
          <!--<el-input v-model="addForm.divisionId"-->
          <!--auto-complete="off"></el-input>-->
          <template>
            <el-select
              v-model="addForm.divisionId"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="searchDivision"
              :blur="getDivision"
              :loading="divisionLoading">
              <el-option
                v-for="item in divisions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="吊牌价"
                      prop="pricelist">
          <el-input v-model="addForm.pricelist"
                    auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="图片名称"-->
        <!--prop="imgUrl">-->
        <!--<el-input v-model="addForm.imgUrl"-->
        <!--auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <label class="el-form-item__label" style="width: 120px;">上传图片</label>
        <el-upload
          class="upload-demo"
          :limit=1
          list-type="picture-card"
          action="/api/file/upload"
          :before-upload="beforeAddUpload"
          :on-success="successAddUpload"
          :on-remove="removeAddUpload"
          :file-list="addfileList"
          style="margin-left:80px;">
          <i class="el-icon-upload"></i>
          <div style="padding-left: 40px" class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1mb！</div>
        </el-upload>
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
    batchRemoveProduct,
    editProduct,
    getProductListPage,
    removeProduct,
    saveProduct,
    getDivisionListPage
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
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          longName: [
            {required: true, message: '请输入商品长名称', trigger: 'blur'}
          ],
          divisionId: [
            {required: true, message: '请选择商品分类', trigger: 'blur'}
          ],
          pricelist: [
            {required: true, message: '请输入商品吊牌价', trigger: 'blur'}
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          code: '',
          name: '',
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入商品代码', trigger: 'blur'}
          ],
          longName: [
            {required: true, message: '请输入商品长名称', trigger: 'blur'}
          ],
          divisionId: [
            {required: true, message: '请选择商品分类', trigger: 'blur'}
          ],
          pricelist: [
            {required: true, message: '请输入商品吊牌价', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          id: 0,
          code: '',
          name: '',
        },
        //新增界面上传图片
        addfileList: [],
        editfileList: [],
        divisionLoading: false,
        origDivisions: [],
        divisions: [],
      }
    },
    methods: {
      //改变列表当前页时候触发
      handleCurrentChange(val) {
        this.page = val;
        this.getProduct();
      },
      //获取用户列表
      getProduct() {
        let para = this.filters;
        para.page = (this.page - 1) * this.pageSize;
        para.pageSize = this.pageSize;
        this.listLoading = true;
        getProductListPage(para).then((res) => {
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
        this.editfileList = [];
        setTimeout(() => {
          this.editFormVisible = true;
          this.editForm = Object.assign({}, row);
          console.log(this.editForm);
          this.editForm.divisionId = parseInt(row.divisionId);
          //显示图片
          this.editfileList = [{
            name: row.imgUrl,
            url: 'api/' + row.imgUrl
          }]
        }, 200)
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
      },
      //编辑取消按钮
      editCancel: function () {
        this.editFormVisible = false;
        this.editfileList = [];
      },
      //编辑提交按钮
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let para = Object.assign({}, this.editForm);
              editProduct(para).then((res) => {
                this.editLoading = false;
                this.editfileList = [];
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
                  this.getProduct();
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
              saveProduct(para).then((res) => {
                this.addLoading = false;
                console.log(this.addfileList)
                //清空新增界面显示图片
                this.addfileList = [];
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
                  this.getProduct();
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
          removeProduct(para).then((res) => {
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
              this.getProduct();
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
          batchRemoveProduct(para).then((res) => {
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
              this.getProduct();
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
      //上传前触发
      beforeAddUpload: function (file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 1;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!');
        }
        console.log(this.addfileList)
        return isJPG && isLt2M;
      },
      //新增上传成功
      successAddUpload: function (response, file, fileList) {
        this.addForm.imgUrl = response.msg;
      },
      //编辑上传成功
      successEditUpload: function (response, file, fileList) {
        this.editForm.imgUrl = response.msg;
      },
      //新增移除相片
      removeAddUpload: function (file, fileList) {
        console.log(this.addfileList)
        this.addForm.imgUrl = null;
        //TO-DO 删除服务器相片
      },
      //编辑移除相片
      removeEditUpload: function (file, fileList) {
        console.log(this.addfileList)
        this.editForm.imgUrl = null;
        //TO-DO 删除服务器相片
      },
      //动态查询商品分类
      searchDivision: function (query) {
        if (query !== '') {
          this.divisions = [];
          this.divisionLoading = true;
          setTimeout(() => {
            this.divisionLoading = false;
            for (let foritem of this.origDivisions) {
              if (foritem.name.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                this.divisions.push(foritem)
              }
            }
          }, 200)
        }
      },
      //重新获取商品分类
      getDivision: function () {
        this.divisions = this.origDivisions;
      },
      //初始化商品分类
      initDivision: function () {
        let para = {page: 0, pageSize: 100000}
        getDivisionListPage(para).then((res) => {
          let {msg, code, content} = res.data;
          if (code !== 200) {
            this.$message({
              message: msg,
              type: 'error'
            });
          } else {
            this.origDivisions = content.content;
            this.divisions = content.content;
          }
        })
      },
      //转列表商品分类显示
      formatDivision: function (row, column) {
        if (row.divisionId && row.divisionId != "") {
          for (let divisions of this.origDivisions) {
            if (divisions.id == row.divisionId) {
              return divisions.name;
            }
          }
        } else {
          return null;
        }
      }
    }
    ,
    mounted() {
      this.getProduct();
      this.initDivision();
    }
  }

</script>

<style scoped>
</style>
