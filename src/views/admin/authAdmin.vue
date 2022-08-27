<template>

  <div>
    <el-form :inline="true" :model="query" class="query-form" size="mini">
      <el-form-item class="query-form-item">
        <el-input v-model="query.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item class="query-form-item">
        <el-select v-model="query.status" placeholder="状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="禁用" value="0"></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="未验证" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button type="primary" icon="el-icon-refresh" @click="onReset"></el-button>
          <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click.native="handleForm(null,null)">新增</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-scrollbar class="table-scrollbar" wrap-style="overflow-x: hidden;">
      <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%;">
        <el-table-column
            label="用户 ID"
            prop="id"
            fixed>
        </el-table-column>
        <el-table-column
            label="用户名"
            prop="username"
            fixed>
        </el-table-column>
        <el-table-column
            label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilterType">{{ scope.row.status | statusFilterName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="登录时间"
            with="180">
          <template slot-scope="scope">
            <span>{{ scope.row.last_login_time | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="登录IP">
          <template slot-scope="scope">
            <span>{{ scope.row.last_login_ip }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="handleAuth(scope.row.id)">授权</el-button>
            <el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="text" size="small" @click.native="handleDel(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-pagination
        :page-size="query.limit"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="total">
    </el-pagination>

    <!--表单-->
    <el-dialog
        :close-on-click-modal="false"
        :title="formMap[formName]"
        :visible.sync="formVisible"
        :before-close="hideForm"
        width="85%"
        top="5vh">
      <el-form :model="formData" :rules="formRules" ref="dataForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="formData.checkPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">未验证</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideForm">取消</el-button>
        <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--授权界面-->
    <el-dialog
        top="2vh"
        title="授权"
        :visible.sync="authFormVisible"
        :close-on-click-modal="false">
      <el-tree
          style="max-height: 70vh;overflow-y: auto;"
          :data="authList"
          show-checkbox=""
          default-expand-all=""
          node-key="id"
          ref="tree"
          :props="defaultProps"
          :default-checked-keys="authDefaultCheckedKeys">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="authFormVisible = !authFormVisible">取消</el-button>
        <el-button type="primary" @click.native="authSubmit()" :loading="authLoading">提交
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import {
  authAdminList,
  authAdminSave,
  authAdminDelete, authList, auth
} from "../../api/auth/authAdmin";

const formJson = {
  id: "",
  password: "",
  username: "",
  checkPassword: "",
  status: 1,
};
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      query: {
        username: "",
        status: "",
        page: 1,
        limit: 20,
      },
      list: [],
      total: 0,
      loading: true,
      index: null,
      formName: null,
      formMap: {
        add: "新增",
        edit: "编辑"
      },
      formLoading: false,
      formVisible: false,
      formData: formJson,
      formRules: {},
      addRules: {
        username: [
          {required: true, message: "请输入姓名", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {validator: validatePass, trigger: "blur"}
        ],
        checkPassword: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur"
          },
          {validator: validatePass2, trigger: "blur"}
        ],
        status: [
          {required: true, message: "请选择状态", trigger: "change"}
        ]
      },
      editRules: {
        username: [
          {required: true, message: "请输入姓名", trigger: "blur"}
        ],
        status: [
          {required: true, message: "请选择状态", trigger: "change"}
        ]
      },
      deleteLoading: false,
      authList: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      authLoading: false,
      authFormVisible: false,
      authFormData: {
        admin_id: "",
        auth_rules: []
      },
      authDefaultCheckedKeys: [],
    };
  },
  methods: {
    onReset() {
      this.$router.push({
        path: ""
      });
      this.query = {
        username: "",
        status: "",
        page: 1,
        limit: 20,
      };
      this.getList();
    },
    onSubmit() {
      this.$router.push({
        path: "",
        query: this.query
      });
      this.getList();
    },
    handleCurrentChange(val) {
      this.query.page = val;
      this.getList();
    },
    getList() {
      this.loading = true;
      authAdminList(this.query)
          .then(response => {
            this.loading = false;
            if (response.code) {
              this.$message.error(response.message);
            }
            this.list = response.data.list || [];
            this.total = response.data.total || 0;
          })
          .catch(() => {
            this.loading = false;
            this.list = [];
            this.total = 0;
          });
    },
    // 隐藏表单
    hideForm() {
      // 更改值
      this.formVisible = !this.formVisible;
      return true;
    },
    // 刷新表单
    resetForm() {
      if (this.$refs["dataForm"]) {
        // 清空验证信息表单
        this.$refs["dataForm"].clearValidate();
        // 刷新表单
        this.$refs["dataForm"].resetFields();
      }
    },
    // 显示表单
    handleForm(index, row) {
      this.formVisible = true;
      this.formData = JSON.parse(JSON.stringify(formJson));
      if (row !== null) {
        row.password = ""
        row.checkPassword = ""
        this.formData = Object.assign({}, row);
      }
      this.formName = "add";
      this.formRules = this.addRules;
      if (index !== null) {
        this.index = index;
        this.formName = "edit";
        this.formRules = this.editRules;
      }
    },
    formSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.formLoading = true;
          let data = Object.assign({}, this.formData);
          authAdminSave(data, this.formName).then(response => {
            this.formLoading = false;
            if (response.code) {
              this.$message.error(response.message);
              return false;
            }
            this.$message.success("操作成功");
            this.formVisible = false;
            if (this.formName === "add") {
              // 向头部添加数据
              if (response.data && response.data.id) {
                data.id = response.data.id;
                this.list.unshift(data);
              }
            } else {
              this.list.splice(this.index, 1, data);
            }
            // 刷新表单
            this.resetForm();
          });
        }
      });
    },
    // 删除
    handleDel(index, row) {
      if (row.id) {
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        })
            .then(() => {
              let para = {id: row.id};
              this.deleteLoading = true;
              authAdminDelete(para)
                  .then(response => {
                    this.deleteLoading = false;
                    if (response.code) {
                      this.$message.error(response.message);
                      return false;
                    }
                    this.$message.success("删除成功");
                    // 刷新数据
                    this.list.splice(index, 1);
                  })
                  .catch(() => {
                    this.deleteLoading = false;
                  });
            })
            .catch(() => {
              this.$message.error("取消删除");
            });
      }
    },
    // 显示授权界面
    handleAuth(adminId) {
      this.authFormData.admin_id = adminId;
      this.authFormData.auth_rules = [];
      this.authList = [];
      authList({ admin_id: adminId })
          .then(response => {
            if (response.code) {
              this.authFormVisible = false;
              this.$message({
                message: response.message,
                type: "error"
              });
              return;
            }
            this.authFormVisible = true;
            this.authList = response.data.list || [];
            const checkedKeys = response.data.checkedKeys || [];
            let tempCheckedKeys = [];
            let id = null;
            let node = null;
            let getTreeNode = function(arr, id) {
              for (let i in arr) {
                let tempNode = arr[i];
                if (tempNode.id === id) {
                  // 找到了，就不找了
                  node = tempNode;
                }
                // 如果还有子节点，再继续找
                getTreeNode(tempNode.children, id);
              }
            };
            for (let i in checkedKeys) {
              id = checkedKeys[i];
              getTreeNode(this.authList, id);
              if (node && node.children.length <= 0) {
                // 如果下面没有子节点，则加入
                tempCheckedKeys.push(id);
              }
            }
            this.authDefaultCheckedKeys = [];
            this.authDefaultCheckedKeys = tempCheckedKeys;
            // this.$refs.tree.setCheckedKeys(tempCheckedKeys);
          })
          .catch(() => {});
    },
    authSubmit() {
      this.authLoading = true;
      let getNodeParents = function(node) {
        let arr = [];
        let id = node.data.id || null;
        if (id) {
          arr.push(node.data.id);
        }
        if (node.parent) {
          arr = arr.concat(getNodeParents(node.parent));
        }
        return arr;
      };
      let checkedKeys = this.$refs.tree.getCheckedKeys();
      let arr = [];
      for (let checkedKey of checkedKeys) {
        let node = this.$refs.tree.getNode(checkedKey);
        arr = arr.concat(getNodeParents(node));
      }
      let setArr = new Set(arr);
      this.authFormData.auth_rules = [...setArr];
      if (!this.authFormData) {
        this.$alert("请至少选择一个权限", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      auth(this.authFormData)
          .then(response => {
            this.authLoading = false;
            if (response.code) {
              this.$message.error(response.message);
              return false;
            }
            this.$message.success("授权成功");
            // 刷新表单
            this.authFormVisible = false;
          })
          .catch(() => {
            this.authLoading = false;
          });
    },
  },
  filters: {
    statusFilterType(status) {
      const statusMap = {
        0: "gray",
        1: "success",
        2: "danger"
      };
      return statusMap[status];
    },
    statusFilterName(status) {
      const statusMap = {
        0: "禁用",
        1: "正常",
        2: "未验证"
      };
      return statusMap[status];
    }
  },
  mounted() {
  },
  created() {
    // 将参数拷贝进查询对象
    let query = this.$route.query;
    this.query = Object.assign(this.query, query);
    this.query.limit = parseInt(this.query.limit);
    // 加载表格数据
    this.getList();
  }
};
</script>

<style lang="less" scoped>

</style>
