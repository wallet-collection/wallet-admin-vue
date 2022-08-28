<template>

  <div>
    <el-form :inline="true" :model="query" class="query-form" size="mini">
      <el-form-item class="query-form-item" label="开发者ID">
        <el-input v-model="query.developer_id" placeholder="开发者ID"></el-input>
      </el-form-item>
      <el-form-item class="query-form-item">
        <el-select v-model="query.status" placeholder="状态">
          <el-option label="全部" :value="-1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
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
            label="ID"
            prop="id"
            fixed>
        </el-table-column>
        <el-table-column
            label="名称"
            prop="name"
            fixed>
        </el-table-column>
        <el-table-column
            label="APPID">
          <template slot-scope="scope">
            <span>{{ scope.row.appid }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="密钥"
            prop="secret_key">
        </el-table-column>
        <el-table-column
            label="开发者ID">
          <template slot-scope="scope">
            <span>{{ scope.row.developer_id }}</span>
          </template>
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            label="创建地址的来源"
            prop="create_origin">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            label="创建地址的合约哈希"
            prop="create_init_hash">
        </el-table-column>
        <el-table-column
            label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilterType">{{ scope.row.status | statusFilterName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            width="180"
            label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
            width="180"
            label="最后更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.modified_time | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            fixed="right">
          <template slot-scope="scope">
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
        <el-form-item label="开发者ID" prop="developer_id">
          <el-input v-model="formData.developer_id" :disabled="formName === 'edit'" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="APPID" prop="appid">
          <el-input v-model="formData.appid" :disabled="formName === 'edit'" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密钥" prop="secret_key">
          <el-input v-model="formData.secret_key" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建合约的地址" prop="create_origin">
          <el-input v-model="formData.create_origin" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建地址的合约哈希" prop="create_init_hash">
          <el-input v-model="formData.create_init_hash" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="提现的私钥" prop="withdraw_private_key">
          <el-input v-model.number="formData.withdraw_private_key" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="应用名称" prop="name">
          <el-input v-model.number="formData.block_init" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideForm">取消</el-button>
        <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {appDelete, appList, appSave} from "../../api/system/app";

const formJson = {
  id: "",
  developer_id: "",
  appid: "",
  secret_key: "",
  create_origin: "",
  create_init_hash: "",
  withdraw_private_key: "",
  name: "",
  status: 0,
};
export default {
  computed: {
  },
  data() {
    return {
      query: {
        developer_id: "",
        status: -1,
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
      formRules: {
        lang: [
          {required: true, message: "请选择语言", trigger: "change"}
        ],
        key: [
          {required: true, message: "请输入Key", trigger: "blur"}
        ],
        title: [
          {required: true, message: "请输入标题", trigger: "blur"}
        ],
        content: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ],
        status: [
          {required: true, message: "请选择状态", trigger: "change"}
        ]
      },
      deleteLoading: false,
      syncStatusLoading: false,
    };
  },
  methods: {
    onReset() {
      this.$router.push({
        path: ""
      });
      this.query = {
        developer_id: "",
        status: -1,
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
      appList(this.query)
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
        this.formData = Object.assign({}, row);
      }
      this.formName = "add";
      if (index !== null) {
        this.index = index;
        this.formName = "edit";
      }
    },
    formSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.formLoading = true;
          let data = Object.assign({}, this.formData);
          appSave(data, this.formName).then(response => {
            this.formLoading = false;
            if (response.code) {
              this.$message.error(response.message);
              return false;
            }
            if (this.formName === "add") {
              // 向头部添加数据
              if (response.data && response.data.id) {
                data.id = response.data.id;
                data.create_time = new Date()
                data.modified_time = new Date()
                this.list.unshift(data);
              }
            } else {
              data.modified_time = new Date()
              this.list.splice(this.index, 1, data);
            }
            this.$message.success("操作成功");
            // 刷新表单
            this.resetForm();
            this.hideForm()
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
              appDelete(para)
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
  },
  filters: {
    statusFilterType(status) {
      const statusMap = {
        0: "danger",
        1: "success",
      };
      return statusMap[status];
    },
    statusFilterName(status) {
      const statusMap = {
        0: "禁用",
        1: "正常",
      };
      return statusMap[status];
    },
    syncStatusFilterType(syncStatus) {
      const syncStatusMap = {
        0: "danger",
        1: "success",
      };
      return syncStatusMap[syncStatus];
    },
    syncStatusFilterName(syncStatus) {
      const syncStatusMap = {
        0: "停止",
        1: "已启动",
      };
      return syncStatusMap[syncStatus];
    }
  },
  mounted() {
  },
  created() {
    // 将参数拷贝进查询对象
    let query = this.$route.query;
    this.query = Object.assign(this.query, query);
    this.query.limit = parseInt(this.query.limit);
    this.query.status = parseInt(this.query.status);
    // 加载表格数据
    this.getList();
  }
};
</script>

<style lang="less" scoped>
</style>
