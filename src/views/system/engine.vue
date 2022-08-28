<template>

  <div>
    <el-form :inline="true" :model="query" class="query-form" size="mini">
      <el-form-item class="query-form-item" label="网络名称">
        <el-input v-model="query.network_name" placeholder="网络名称"></el-input>
      </el-form-item>
      <el-form-item class="query-form-item" label="币种符号">
        <el-input v-model="query.coin_symbol" placeholder="币种符号"></el-input>
      </el-form-item>
      <el-form-item class="query-form-item" label="协议">
        <el-input v-model="query.protocol" placeholder="协议"></el-input>
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
            label="网络名称"
            fixed>
          <template slot-scope="scope">
            <span>{{ scope.row.network_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="币种符号"
            fixed>
          <template slot-scope="scope">
            <span>{{ scope.row.coin_symbol }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="协议"
            prop="protocol"
            fixed>
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            label="合约地址"
            prop="contract">
        </el-table-column>
        <el-table-column
            label="合约类型"
            prop="contract_type">
        </el-table-column>
        <el-table-column
            label="合约精度"
            prop="decimals">
        </el-table-column>
        <el-table-column
            label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilterType">{{ scope.row.status | statusFilterName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="启动状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.sync_status | syncStatusFilterType">{{ scope.row.sync_status | syncStatusFilterName }}</el-tag>
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
            <el-button type="text" size="small" @click.native="handleSyncStatus(scope.$index, scope.row, 1)">启动
            </el-button>
            <el-button type="text" size="small" @click.native="handleSyncStatus(scope.$index, scope.row, 0)">停止
            </el-button>
            <el-button type="text" size="small" @click.native="handleSyncStatus(scope.$index, scope.row, -1)">重启
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
        <el-form-item label="网络名称" prop="network_name">
          <el-input v-model="formData.network_name" :disabled="formName === 'edit'" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="币种名称" prop="coin_symbol">
          <el-input v-model="formData.coin_symbol" :disabled="formName === 'edit'" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="协议" prop="protocol">
          <el-input v-model="formData.protocol" :disabled="formName === 'edit'" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="合约地址" prop="contract">
          <el-input v-model="formData.contract" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="合约类型" prop="contract_type">
          <el-input v-model="formData.contract_type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="精度" prop="decimals">
          <el-input v-model.number="formData.decimals" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="初始块（默认读取最新块）" prop="block_init">
          <el-input v-model.number="formData.block_init" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="获取最新块的等待时间" prop="block_after_time">
          <el-input v-model.number="formData.block_after_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="交易凭证worker数量" prop="receipt_count">
          <el-input v-model.number="formData.receipt_count" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="获取交易信息的等待时间" prop="receipt_after_time">
          <el-input v-model.number="formData.receipt_after_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="回调的worker数量" prop="call_count">
          <el-input v-model.number="formData.call_count" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="回调的等待时间" prop="call_after_time">
          <el-input v-model.number="formData.call_after_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="回调最大重试次数" prop="call_max_retry">
          <el-input v-model.number="formData.call_max_retry" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认数量" prop="confirms">
          <el-input v-model.number="formData.confirms" auto-complete="off"></el-input>
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
import {engineDelete, engineList, engineSave, engineSyncStatus} from "../../api/system/engine";

const formJson = {
  id: "",
  network_name: "",
  coin_symbol: "",
  protocol: "",
  contract: "",
  contract_type: "",
  decimals: 0,
  block_init: 0,
  block_after_time: 0,
  receipt_count: 0,
  receipt_after_time: 0,
  call_count: 0,
  call_after_time: 0,
  call_max_retry: 0,
  confirms: 0,
  status: 0,
};
export default {
  computed: {
  },
  data() {
    return {
      query: {
        network_name: "",
        coin_symbol: "",
        protocol: "",
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
        network_name: [
          {required: true, message: "请选择语言", trigger: "blur"}
        ],
        coin_symbol: [
          {required: true, message: "请输入Key", trigger: "blur"}
        ],
        protocol: [
          {required: true, message: "请输入标题", trigger: "blur"}
        ],
        contract: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ],
        contract_type: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ],
        decimals: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ],
        block_init: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ],
        block_after_time: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ],
        receipt_count: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ],
        receipt_after_time: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ],
        call_count: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ],
        call_after_time: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ],
        call_max_retry: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ],
        confirms: [
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
        network_name: "",
        coin_symbol: "",
        protocol: "",
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
      engineList(this.query)
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
          engineSave(data, this.formName).then(response => {
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
              engineDelete(para)
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
    // 更新状态
    handleSyncStatus(index, row, syncStatus) {
      if (row.id) {
        this.$confirm("确认更新当前引擎状态?", "提示", {
          type: "warning"
        })
            .then(() => {
              let para = {id: row.id,sync_status: syncStatus};
              this.syncStatusLoading = true;
              engineSyncStatus(para)
                  .then(response => {
                    this.syncStatusLoading = false;
                    if (response.code) {
                      this.$message.error(response.message);
                      return false;
                    }
                    this.$message.success("更新成功");
                    // 刷新数据
                    row.sync_status = syncStatus !== 0 ? 1 : 0
                    this.list.splice(index, row);
                  })
                  .catch(() => {
                    this.syncStatusLoading = false;
                  });
            })
            .catch(() => {
              this.$message.error("取消更新");
            });
      }
    }
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
