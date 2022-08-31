<template>

  <div>
    <el-form :inline="true" :model="query" class="query-form" size="mini">
      <el-form-item class="query-form-item" label="网络名称">
        <el-input v-model="query.network_name" placeholder="网络名称"></el-input>
      </el-form-item>
      <el-form-item class="query-form-item" label="币种符号">
        <el-input v-model="query.coin_symbol" placeholder="币种符号"></el-input>
      </el-form-item>
      <el-form-item class="query-form-item" label="地址">
        <el-input v-model="query.address" placeholder="地址"></el-input>
      </el-form-item>
      <el-form-item class="query-form-item" label="APPID">
        <el-input v-model="query.appid" placeholder="APPID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button type="primary" icon="el-icon-refresh" @click="onReset"></el-button>
          <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button type="primary" icon="search" @click="handleCollection(-1)">归集全部</el-button>
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
            label="APPID">
          <template slot-scope="scope">
            <span>{{ scope.row.appid }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="网络名称"
            prop="network_name">
        </el-table-column>
        <el-table-column
            label="币种符号"
            prop="coin_symbol">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            label="地址"
            prop="address">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            label="私钥"
            prop="private_key">
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
            <el-button type="text" size="small" @click.native="handleCollection(scope.$index)">归集
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
        title="归集私钥配置"
        :visible.sync="collectionVisible"
        :before-close="hideCollection"
        width="85%"
        top="5vh">
      <el-form :model="privateKeyFrom">
        <el-form-item label="以太坊协议私钥" prop="ethPrivateKey">
          <el-input v-model="privateKeyFrom.ethPrivateKey" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="波场协议" prop="trxPrivateKey">
          <el-input v-model="privateKeyFrom.trxPrivateKey" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="比特币协议" prop="btcPrivateKey">
          <el-input v-model="privateKeyFrom.btcPrivateKey" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideCollection">取消</el-button>
        <el-button type="primary" @click.native="collection" :loading="collectionSubLoading">确认归集</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import {addressCollection, addressList} from "../../api/address/address";

export default {
  computed: {
  },
  data() {
    return {
      query: {
        network_name: "",
        coin_symbol: "",
        address: "",
        appid: "",
        page: 1,
        limit: 20,
      },
      list: [],
      total: 0,
      loading: true,
      privateKeyFrom: {
        ethPrivateKey: "61774dacba914e5675eef6c616df85c61d7c8917f56ee77f547a140f8f982d31",
        trxPrivateKey: "7a6c1448dc53ad9aada301c2992bf0d40792f8d00a368dac9f916acc89b42a64",
        btcPrivateKey: "",
      },
      collectionIndex: -1,
      collectionVisible: false,
      collectionSubLoading: false,
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
        address: "",
        appid: "",
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
      addressList(this.query)
          .then(res => {
            this.loading = false;
            if (res.code) {
              this.$message.error(res.message);
            }
            this.list = res.data.list || [];
            this.total = res.data.total || 0;
          })
          .catch(() => {
            this.loading = false;
            this.list = [];
            this.total = 0;
          });
    },
    hideCollection() {
      this.collectionVisible = !this.collectionVisible
    },
    handleCollection(index) {
      this.collectionVisible = true
      this.collectionIndex = index
    },
    collection() {
      if (this.collectionIndex >= 0) {
        this.collectionSubmit(this.collectionIndex, this.list[this.collectionIndex])
      } else {
        this.collectionAll()
      }
    },
    async collectionAll() {

      const list = this.list

      this.collectionSubLoading = true

      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        await this.collectionSubmit(i, item)
      }

      this.collectionSubLoading = false

      await this.getList()

      await this.collectionAll()
    },
    async collectionSubmit(index, item) {

      let private_key = ""
      if (item.protocol === "eth") {
        private_key = this.privateKeyFrom.ethPrivateKey
      } else if (item.protocol === "trx") {
        private_key = this.privateKeyFrom.trxPrivateKey
      } else if (item.protocol === "btc") {
        private_key = this.privateKeyFrom.btcPrivateKey
      }
      if (!private_key) {
        return
      }
      console.log(private_key)
      const res = await addressCollection({
        ...item,
        private_key: private_key
      })

      if (res.code > 0) {
        return
      }

      item.balance = 0

      item.txid = res.data


      this.list.splice(index, 1, item);

    },
  },
  filters: {
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
