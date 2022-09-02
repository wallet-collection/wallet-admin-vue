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
          <el-button type="primary" icon="search" @click="handleCollection(-1)" :loading="collectionSubLoading">归集全部</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-scrollbar class="table-scrollbar" wrap-style="overflow-x: hidden;">
      <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%;">
        <el-table-column
            width="80"
            label="ID"
            prop="id"
            fixed>
        </el-table-column>
        <el-table-column
            width="120"
            label="网络名称"
            prop="network_name">
        </el-table-column>
        <el-table-column
            width="120"
            label="币种符号"
            prop="coin_symbol">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            label="地址"
            width="400"
            prop="address">
        </el-table-column>
        <el-table-column
            width="120"
            label="余额"
            prop="balance">
        </el-table-column>
        <el-table-column
            label="归集信息"
            prop="info">
        </el-table-column>
        <el-table-column
            width="180"
            label="最后更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.modified_time | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
            width="80"
            label="操作"
            fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="handleCollection(scope.$index)" :loading="collectionSubLoading">归集
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
      listType: false,
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
    async getList() {
      this.loading = true;
      try {
        const res = await addressList(this.query)
        this.loading = false;
        if (res.code) {
          this.$message.error(res.message);
        }
        const list = res.data.list || [];
        if (list.length === 0) {
          return false
        }
        if (this.listType) {
          this.list = this.list.concat(list);
        } else {
          this.list = list
        }
        this.total = res.data.total || 0;
        return true
      }catch (e) {
        this.loading = false;
        this.list = []
        this.total = 0
        return false
      }
    },
    hideCollection() {
      this.collectionVisible = !this.collectionVisible
    },
    handleCollection(index) {
      this.collectionVisible = true
      this.collectionIndex = index
    },
    async collection() {

      if (this.collectionSubLoading) {
        this.$message.error("当前有未归集完成的任务，请稍后....")
        return false
      }

      this.collectionSubLoading = true

      this.$notify({
        title: '警告',
        message: '归集中请勿关闭页面',
        type: 'warning',
        duration: 0
      });

      this.collectionVisible = false

      if (this.collectionIndex >= 0) {
        await this.collectionSubmit(this.collectionIndex, this.list[this.collectionIndex])
      } else {
        await this.collectionAll()
      }

      this.collectionSubLoading = false

    },
    async collectionAll() {

      const list = this.list

      if (list.length === 0) {
        return false
      }

      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        await this.collectionSubmit(i, item)
      }

      this.listType = true
      this.query.page++;
      const res = await this.getList()
      if (res === false) {
        this.$notify({
          title: '提示',
          message: '已归集完成',
          type: 'success',
          duration: 0
        });
        this.listType = false
        return false
      }

      await this.collectionAll()
    },
    async collectionSubmit(index, item) {

      let err = "当前地址没有余额"
      if (item.balance <= 0) {
        item.info = err
        this.list.splice(index, 1, item);
        return false
      }

      let private_key = ""
      if (item.protocol === "eth") {
        private_key = this.privateKeyFrom.ethPrivateKey
      } else if (item.protocol === "trx") {
        private_key = this.privateKeyFrom.trxPrivateKey
      } else if (item.protocol === "btc") {
        private_key = this.privateKeyFrom.btcPrivateKey
      }
      if (!private_key) {
        err = "当前协议没有配置私钥"
        item.info = err
        this.list.splice(index, 1, item);
        return false
      }
      console.log(private_key)
      const res = await addressCollection({
        ...item,
        private_key: private_key
      })

      if (res.code > 0) {
        err = res.message
        item.info = err
        this.list.splice(index, 1, item);
        return false
      }

      item.balance = 0

      item.info = "哈希：" + res.data


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
