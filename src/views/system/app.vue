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
            width="120"
            label="操作"
            fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="text" size="small" @click.native="handleCollection(scope.$index, scope.row)">扩展配置
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

    <!--表单-->
    <el-dialog
        :close-on-click-modal="false"
        title="应用归集列表"
        :visible.sync="collectionVisible"
        :before-close="hideCollection"
        width="85%"
        top="5vh">
      <el-form :inline="true" :model="collectionQuery" class="query-form" size="mini">
        <el-form-item class="query-form-item" label="appid">
          <el-input v-model="collectionQuery.appid" placeholder="appid"></el-input>
        </el-form-item>
        <el-form-item class="query-form-item" label="网络名称">
          <el-input v-model="collectionQuery.network_name" placeholder="网络名称"></el-input>
        </el-form-item>
        <el-form-item class="query-form-item" label="币种符号">
          <el-input v-model="collectionQuery.coin_symbol" placeholder="币种符号"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-refresh" @click="onCollectionReset"></el-button>
            <el-button type="primary" icon="search" @click="onCollectionSubmit">查询</el-button>
            <el-button type="primary" @click.native="handleCollectionForm(null,null)">新增</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-scrollbar class="table-scrollbar" wrap-style="overflow-x: hidden;">
        <el-table
            v-loading="collectionLoading"
            :data="collectionList"
            style="width: 100%;">
          <el-table-column
              width="60"
              label="ID"
              prop="id"
              fixed>
          </el-table-column>
          <el-table-column
              width="150"
              label="APPID"
              fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.appid }}</span>
            </template>
          </el-table-column>
          <el-table-column
              width="120"
              label="网络名称"
              fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.network_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
              width="120"
              label="币种符号"
              fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.coin_symbol }}</span>
            </template>
          </el-table-column>
          <el-table-column
              :show-overflow-tooltip="true"
              label="归集地址"
              prop="collection_address">
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
              width="60"
              label="操作"
              fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native="handleCollectionForm(scope.$index, scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>


      <!--表单-->
      <el-dialog
          :close-on-click-modal="false"
          :title="collectionFormMap[collectionFormName]"
          :visible.sync="collectionFormVisible"
          :before-close="hideCollectionForm"
          append-to-body
          top="5vh">
        <el-form :model="collectionFormData" :rules="collectionFormRules" ref="dataCollectionForm">
          <el-form-item label="APPID" prop="appid">
            <el-input v-model="collectionFormData.appid" disabled auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="网络名称" prop="network_name">
            <el-input v-model="collectionFormData.network_name" :disabled="collectionFormName === 'edit'" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="币种名称" prop="coin_symbol">
            <el-input v-model="collectionFormData.coin_symbol" :disabled="collectionFormName === 'edit'" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="归集地址" prop="collection_address">
            <el-input v-model="collectionFormData.collection_address" :disabled="collectionFormName === 'edit'" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="归集最大数量（保留精度）" prop="collection_max">
            <el-input v-model="collectionFormData.collection_max" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="归集私钥" prop="collection_private_key">
            <el-input v-model="collectionFormData.collection_private_key" :disabled="collectionFormName === 'edit'" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="提现的私钥" prop="withdraw_private_key">
            <el-input v-model="collectionFormData.withdraw_private_key" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="hideCollectionForm">取消</el-button>
          <el-button type="primary" @click.native="formCollectionSubmit()" :loading="collectionFormLoading">提交</el-button>
        </div>
      </el-dialog>

    </el-dialog>


  </div>

</template>

<script>
import {appList, appSave} from "../../api/system/app";
import {appExtendList, appExtendSave} from "../../api/system/appExtend";

const formJson = {
  id: "",
  developer_id: "",
  appid: "",
  secret_key: "",
  name: "",
  status: 0,
};

const collectionFormJson = {
  id: "",
  appid: "",
  network_name: "",
  coin_symbol: "",
  collection_address: "",
  collection_max: "",
  collection_private_key: "",
  withdraw_private_key: "",
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
        developer_id: [
          {required: true, message: "请输入开发者ID", trigger: "blur"}
        ],
        appid: [
          {required: true, message: "请输入appid", trigger: "blur"}
        ],
        secret_key: [
          {required: true, message: "请输入密钥", trigger: "blur"}
        ],
        name: [
          {required: true, message: "请输入应用名称", trigger: "blur"}
        ],
        status: [
          {required: true, message: "请选择状态", trigger: "change"}
        ]
      },

      collectionVisible: false,
      collectionQuery: {
        appid: "",
        network_name: "",
        coin_symbol: "",
      },
      collectionList: [],
      collectionTotal: 0,
      collectionLoading: true,
      collectionIndex: null,
      collectionFormName: null,
      collectionFormMap: {
        add: "新增",
        edit: "编辑"
      },
      collectionFormLoading: false,
      collectionFormVisible: false,
      collectionFormData: collectionFormJson,
      collectionFormRules: {
        network_name: [
          {required: true, message: "请输入网络名称", trigger: "blur"}
        ],
        coin_symbol: [
          {required: true, message: "请输入币种符号", trigger: "blur"}
        ],
        collection_address: [
          {required: true, message: "请输入归集地址", trigger: "blur"}
        ],
      },
      collectionDeleteLoading: false,
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

    //
    hideCollection() {
      // 更改值
      this.collectionVisible = !this.collectionVisible;
      return true;
    },
    //
    handleCollection(index, row) {
      this.collectionVisible = true;
      this.collectionQuery.appid = row.appid
      this.getListCollection()
    },

    onCollectionReset() {
      this.$router.push({
        path: ""
      });
      this.collectionQuery = {
        appid: this.collectionQuery.appid,
        network_name: "",
        coin_symbol: "",
      };
      this.getListCollection();
    },
    onCollectionSubmit() {
      this.$router.push({
        path: "",
        query: this.collectionQuery
      });
      this.getListCollection();
    },
    getListCollection() {
      this.collectionLoading = true;
      appExtendList(this.collectionQuery)
          .then(response => {
            this.collectionLoading = false;
            if (response.code) {
              this.$message.error(response.message);
            }
            this.collectionList = response.data.list || [];
            this.collectionTotal = response.data.total || 0;
          })
          .catch(() => {
            this.collectionLoading = false;
            this.collectionList = [];
            this.collectionTotal = 0;
          });
    },

    // 隐藏表单
    hideCollectionForm() {
      // 更改值
      this.collectionFormVisible = !this.collectionFormVisible;
      return true;
    },
    // 刷新表单
    resetCollectionForm() {
      if (this.$refs["dataCollectionForm"]) {
        // 清空验证信息表单
        this.$refs["dataCollectionForm"].clearValidate();
        // 刷新表单
        this.$refs["dataCollectionForm"].resetFields();
      }
    },
    // 显示表单
    handleCollectionForm(index, row) {
      this.collectionFormVisible = true;
      this.collectionFormData = JSON.parse(JSON.stringify(collectionFormJson));
      this.collectionFormData.appid = this.collectionQuery.appid
      if (row !== null) {
        this.collectionFormData = Object.assign({}, row);
      }
      this.collectionFormName = "add";
      if (index !== null) {
        this.collectionIndex = index;
        this.collectionFormName = "edit";
      }
    },
    formCollectionSubmit() {
      this.$refs["dataCollectionForm"].validate(valid => {
        if (valid) {
          this.collectionFormLoading = true;
          let data = Object.assign({}, this.collectionFormData);
          appExtendSave(data, this.collectionFormName).then(response => {
            this.collectionFormLoading = false;
            if (response.code) {
              this.$message.error(response.message);
              return false;
            }
            if (this.collectionFormName === "add") {
              // 向头部添加数据
              if (response.data && response.data.id) {
                data.id = response.data.id;
                data.create_time = new Date()
                data.modified_time = new Date()
                this.collectionList.unshift(data);
              }
            } else {
              data.modified_time = new Date()
              this.collectionList.splice(this.collectionIndex, 1, data);
            }
            this.$message.success("操作成功");
            // 刷新表单
            this.resetCollectionForm();
            this.hideCollectionForm()
          });
        }
      });
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
