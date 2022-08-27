<template>
  <div class="overview-body">

    <div class="main-title">总数据</div>

    <div class="card-list">

      <el-card class="box-card box-card-ii" shadow="hover">
        <div class="text item">
          <span>总注册用户：</span>
          <span style="color: #455369;">{{info.list_sum.new_member || 0}}</span>
        </div>
      </el-card>

      <el-card class="box-card box-card-ii" shadow="hover">
        <div class="text item">
          <span>总收入：</span>
          <span style="color: #455369;">{{info.list_sum.profit || 0}}</span>
        </div>
      </el-card>

      <el-card class="box-card box-card-ii" shadow="hover">
        <div class="text item">
          <span>总提现：</span>
          <span style="color: #455369;">{{info.list_sum.withdraw || 0}}</span>
        </div>
      </el-card>

      <el-card class="box-card box-card-ii" shadow="hover">
        <div class="text item">
          <span>总充值：</span>
          <span style="color: #455369;">{{info.list_sum.recharge || 0}}</span>
        </div>
      </el-card>

    </div>

    <div class="main-title">
      数据图表
      <i style="color: #1c82e8; cursor: pointer;font-size: 15px;" class="el-icon-refresh-right" @click="init"></i>
    </div>

    <statistics-chart :chart-data="chartData" v-loading="listLoading"></statistics-chart>

  </div>
</template>

<script>
import StatisticsChart from "../../components/StatisticsChart";
import {statisticsToday,statisticsList} from "../../api/statistics/statistics";
export default {
  name: "statistics",
  components: {
    StatisticsChart
  },
  computed: {
  },
  data() {
    return {
      loading: false,
      info: {
        list: {},
        list_sum: {},
      },
      listLoading: false,
      chartData: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getStatisticsToday()
      this.getStatisticsList()
    },
    getStatisticsToday() {
      if (this.loading) {
        return false
      }
      this.loading = true
      statisticsToday()
          .then(res => {
            this.loading = false
            if (res.code !== 0) {
              this.$message.error(this.$t('http.code.' + res.code))
              return false
            }
            this.info = res.data
          })
          .catch(() => {
            this.loading = false
          })
    },
    getStatisticsList() {
      if (this.listLoading) {
        return false
      }
      this.listLoading = true
      statisticsList({
        page: 1,
        limit: 30
      })
          .then(res => {
            this.listLoading = false
            if (res.code !== 0) {
              this.$message.error(this.$t('http.code.' + res.code))
              return false
            }
            const chartData = res.data.list || []
            this.chartData = chartData.reverse()
          })
          .catch(() => {
            this.listLoading = false
          })
    }
  }
}
</script>

<style lang="less" scoped>
.overview-body {
  padding: 52px 60px 56px;
}
.box-card {
  width: 100%;
  margin-bottom: 30px;
}
.box-card-ii {
  cursor: pointer;
  transition: all .15s;
  margin-left: 5px;
  &:first-child {
    margin-left: 0;
  }
}
.card-list {
  width: 100%;
  display: flex;
  justify-content: space-between;
  transition: all .15s;
}
.text {
  font-size: 16px;
  color: #768ba8;
}

.item {
  padding: 5px 0;
  display: flex;
  align-items: center;
  white-space:nowrap;
}

.main-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 25px;
  color: #455369;
}

@media screen and (max-width: 1170px) {
  .overview-body {
    width: 100vw;
    padding: 30px 10px 10px 10px;
  }
  .card-list {
    width: 100%;
    flex-wrap: wrap;
    padding: 0 30px;
  }
  .box-card-ii {
    width: 48%;
  }
}

@media screen and (max-width: 760px) {
  .text {
    font-size: 14px;
  }
  .card-list {
    padding: 0 0;
  }
  .box-card-ii {
    margin-left: 0;
    width: 100%;
  }
}

</style>
