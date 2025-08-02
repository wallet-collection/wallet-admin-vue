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
        <el-input v-model="query.protocol" placeholder="协议（eth，trx，btc）"></el-input>
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
            width="200"
            label="操作"
            fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="text" size="small" @click.native="handleDel(scope.$index, scope.row)">删除
            </el-button>
            <el-button type="text" size="small" @click.native="handleRpc(scope.$index, scope.row)">rpc列表
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
        <el-form-item label="协议（eth，trx，btc）" prop="protocol">
          <el-input v-model="formData.protocol" :disabled="formName === 'edit'" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否同步充值" prop="status">
          <el-radio-group v-model="formData.is_recharge">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="币种合约地址" prop="contract">
          <el-input v-model="formData.contract" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="合约类型，以太坊协议的统一用ERC20（如，ERC20，TRC20，TRC10）" prop="contract_type">
          <el-input v-model="formData.contract_type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="精度" prop="decimals">
          <el-input v-model.number="formData.decimals" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="初始块（默认读取最新块）" prop="block_init">
          <el-input v-model.number="formData.block_init" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="获取最新块的等待时间（毫秒）" prop="block_after_time">
          <el-input v-model.number="formData.block_after_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="交易凭证worker数量" prop="receipt_count">
          <el-input v-model.number="formData.receipt_count" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="获取交易信息的等待时间（毫秒）" prop="receipt_after_time">
          <el-input v-model.number="formData.receipt_after_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="回调的worker数量" prop="call_count">
          <el-input v-model.number="formData.call_count" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="回调的等待时间（毫秒）" prop="call_after_time">
          <el-input v-model.number="formData.call_after_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="回调最大重试次数" prop="call_max_retry">
          <el-input v-model.number="formData.call_max_retry" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认数量" prop="confirms">
          <el-input v-model.number="formData.confirms" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="工具合约地址" prop="create_origin">
          <el-input v-model="formData.create_origin" :disabled="formName === 'edit'" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="工具合约哈希码" prop="create_init_hash">
          <el-input v-model="formData.create_init_hash" :disabled="formName === 'edit'" auto-complete="off"></el-input>
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
        title="引擎rpc列表"
        :visible.sync="rpcVisible"
        :before-close="hideRpc"
        width="85%"
        top="5vh">
      <el-form :inline="true" :model="rpcQuery" class="query-form" size="mini">
        <el-form-item class="query-form-item" label="网络名称">
          <el-input v-model="rpcQuery.network_name" placeholder="网络名称"></el-input>
        </el-form-item>
        <el-form-item class="query-form-item" label="币种符号">
          <el-input v-model="rpcQuery.coin_symbol" placeholder="币种符号"></el-input>
        </el-form-item>
        <el-form-item class="query-form-item">
          <el-select v-model="rpcQuery.status" placeholder="状态">
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="正常" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-refresh" @click="onRpcReset"></el-button>
            <el-button type="primary" icon="search" @click="onRpcSubmit">查询</el-button>
            <el-button type="primary" @click.native="handleRpcForm(null,null)">新增</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-scrollbar class="table-scrollbar" wrap-style="overflow-x: hidden;">
        <el-table
            v-loading="rpcLoading"
            :data="rpcList"
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
              :show-overflow-tooltip="true"
              label="URL"
              prop="url">
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
              width="200"
              label="操作"
              fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native="handleRpcForm(scope.$index, scope.row)">编辑
              </el-button>
              <el-button type="text" size="small" @click.native="handleDelRpc(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>

      <el-pagination
          :page-size="rpcQuery.limit"
          @current-change="handleCurrentChangeRpc"
          layout="prev, pager, next"
          :total="rpcTotal">
      </el-pagination>


      <!--表单-->
      <el-dialog
          :close-on-click-modal="false"
          :title="rpcFormMap[rpcFormName]"
          :visible.sync="rpcFormVisible"
          :before-close="hideRpcForm"
          append-to-body
          top="5vh">
        <el-form :model="rpcFormData" :rules="rpcFormRules" ref="dataRpcForm">
          <el-form-item label="网络名称" prop="network_name">
            <el-input v-model="rpcFormData.network_name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="币种名称" prop="coin_symbol">
            <el-input v-model="rpcFormData.coin_symbol" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="URL地址" prop="url">
            <el-input v-model="rpcFormData.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="rpcFormData.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">正常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="hideRpcForm">取消</el-button>
          <el-button type="primary" @click.native="formRpcSubmit()" :loading="rpcFormLoading">提交</el-button>
        </div>
      </el-dialog>

    </el-dialog>





  </div>

</template>

<script>
import {engineDelete, engineList, engineSave} from "../../api/system/engine";
import {engineRpcDelete, engineRpcList, engineRpcSave} from "../../api/system/engine_rpc";

const formJson = {
  id: "",
  network_name: "",
  coin_symbol: "",
  protocol: "",
  is_recharge: 1,
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
  create_origin: "",
  create_init_hash: "",
};
const rpcFormJson = {
  id: "",
  network_name: "",
  coin_symbol: "",
  url: "",
  status: 0,
}
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
          {required: true, message: "请输入网络名称", trigger: "blur"}
        ],
        coin_symbol: [
          {required: true, message: "请输入币种符号", trigger: "blur"}
        ],
        protocol: [
          {required: true, message: "请输入协议", trigger: "blur"}
        ],
        contract: [
          {required: true, message: "请输入合约地址", trigger: "blur"}
        ],
        contract_type: [
          {required: true, message: "请输入合约类型", trigger: "blur"}
        ],
        decimals: [
          {required: true, message: "请输入精度", trigger: "blur"}
        ],
        block_init: [
          {required: true, message: "请输入初始化区块", trigger: "blur"}
        ],
        block_after_time: [
          {required: true, message: "请输入同步区块时最新块的等待时间", trigger: "blur"}
        ],
        receipt_count: [
          {required: true, message: "请输入票据的worker数量", trigger: "blur"}
        ],
        receipt_after_time: [
          {required: true, message: "请输入获取票据的间隔", trigger: "blur"}
        ],
        call_count: [
          {required: true, message: "请输入回调的worker数量", trigger: "blur"}
        ],
        call_after_time: [
          {required: true, message: "请输入回调的等待时间", trigger: "blur"}
        ],
        call_max_retry: [
          {required: true, message: "请输入回调最多错误次数", trigger: "blur"}
        ],
        confirms: [
          {required: true, message: "请输入确认块", trigger: "blur"}
        ],
        create_origin: [
          {required: true, message: "请输入工具合约的地址", trigger: "blur"}
        ],
        create_init_hash: [
          {required: true, message: "请输入工具合约哈希码", trigger: "blur"}
        ],
        status: [
          {required: true, message: "请选择状态", trigger: "change"}
        ]
      },
      deleteLoading: false,

      rpcVisible: false,
      rpcQuery: {
        network_name: "",
        coin_symbol: "",
        status: -1,
        page: 1,
        limit: 20,
      },
      rpcList: [],
      rpcTotal: 0,
      rpcLoading: true,
      rpcIndex: null,
      rpcFormName: null,
      rpcFormMap: {
        add: "新增",
        edit: "编辑"
      },
      rpcFormLoading: false,
      rpcFormVisible: false,
      rpcFormData: rpcFormJson,
      rpcFormRules: {
        network_name: [
          {required: true, message: "请输入网络名称", trigger: "blur"}
        ],
        coin_symbol: [
          {required: true, message: "请输入币种符号", trigger: "blur"}
        ],
        url: [
          {required: true, message: "请输入URL", trigger: "blur"}
        ],
        status: [
          {required: true, message: "请选择状态", trigger: "change"}
        ]
      },
      rpcDeleteLoading: false,
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
    //
    hideRpc() {
      // 更改值
      this.rpcVisible = !this.rpcVisible;
      return true;
    },
    //
    handleRpc(index, row) {
      this.rpcVisible = true;
      this.rpcQuery.network_name = row.network_name
      this.rpcQuery.coin_symbol = row.coin_symbol
      this.getListRpc()
    },

    onRpcReset() {
      this.$router.push({
        path: ""
      });
      this.rpcQuery = {
        network_name: "",
        coin_symbol: "",
        status: -1,
        page: 1,
        limit: 20,
      };
      this.getListRpc();
    },
    onRpcSubmit() {
      this.$router.push({
        path: "",
        query: this.rpcQuery
      });
      this.getListRpc();
    },
    handleCurrentChangeRpc(val) {
      this.rpcQuery.page = val;
      this.getListRpc();
    },
    getListRpc() {
      this.rpcLoading = true;
      engineRpcList(this.rpcQuery)
          .then(response => {
            this.rpcLoading = false;
            if (response.code) {
              this.$message.error(response.message);
            }
            this.rpcList = response.data.list || [];
            this.rpcTotal = response.data.total || 0;
          })
          .catch(() => {
            this.rpcLoading = false;
            this.rpcList = [];
            this.rpcTotal = 0;
          });
    },

    // 隐藏表单
    hideRpcForm() {
      // 更改值
      this.rpcFormVisible = !this.rpcFormVisible;
      return true;
    },
    // 刷新表单
    resetRpcForm() {
      if (this.$refs["dataRpcForm"]) {
        // 清空验证信息表单
        this.$refs["dataRpcForm"].clearValidate();
        // 刷新表单
        this.$refs["dataRpcForm"].resetFields();
      }
    },
    // 显示表单
    handleRpcForm(index, row) {
      this.rpcFormVisible = true;
      this.rpcFormData = JSON.parse(JSON.stringify(rpcFormJson));
      this.rpcFormData.network_name = this.rpcQuery.network_name
      this.rpcFormData.coin_symbol = this.rpcQuery.coin_symbol
      if (row !== null) {
        this.rpcFormData = Object.assign({}, row);
      }
      this.rpcFormName = "add";
      if (index !== null) {
        this.rpcIndex = index;
        this.rpcFormName = "edit";
      }
    },
    formRpcSubmit() {
      this.$refs["dataRpcForm"].validate(valid => {
        if (valid) {
          this.rpcFormLoading = true;
          let data = Object.assign({}, this.rpcFormData);
          engineRpcSave(data, this.rpcFormName).then(response => {
            this.rpcFormLoading = false;
            if (response.code) {
              this.$message.error(response.message);
              return false;
            }
            if (this.rpcFormName === "add") {
              // 向头部添加数据
              if (response.data && response.data.id) {
                data.id = response.data.id;
                data.create_time = new Date()
                data.modified_time = new Date()
                this.rpcList.unshift(data);
              }
            } else {
              data.modified_time = new Date()
              this.rpcList.splice(this.index, 1, data);
            }
            this.$message.success("操作成功");
            // 刷新表单
            this.resetRpcForm();
            this.hideRpcForm()
          });
        }
      });
    },
    // 删除
    handleDelRpc(index, row) {
      if (row.id) {
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        })
            .then(() => {
              let para = {id: row.id};
              this.rpcDeleteLoading = true;
              engineRpcDelete(para)
                  .then(response => {
                    this.rpcDeleteLoading = false;
                    if (response.code) {
                      this.$message.error(response.message);
                      return false;
                    }
                    this.$message.success("删除成功");
                    // 刷新数据
                    this.rpcList.splice(index, 1);
                  })
                  .catch(() => {
                    this.rpcDeleteLoading = false;
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
