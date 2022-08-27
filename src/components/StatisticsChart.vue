<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>


export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // 解析数据
    splitData(raw) {
      let categoryData = [];
      let list = {}
      let new_member = []
      let profit = []
      let withdraw = []
      let recharge = []
      for (let i = 0; i < raw.length; i++) {
        const u_date = this.$options.filters.parseTime(raw[i]["u_date"], '{y}-{m}-{d}')
        if (!categoryData.includes(u_date)) {
          categoryData.push(u_date);
        }
        list[raw[i]["scene"] + u_date] = raw[i]
      }
      for (let categoryDatum of categoryData) {
        let new_memberItem = list["new_member" + categoryDatum]
        new_member.push(new_memberItem ? new_memberItem.value : 0)

        let profitItem = list["profit" + categoryDatum]
        profit.push(profitItem ? profitItem.value : 0)

        let withdrawItem = list["withdraw" + categoryDatum]
        withdraw.push(withdrawItem ? withdrawItem.value : 0)

        let rechargeItem = list["recharge" + categoryDatum]
        recharge.push(rechargeItem ? rechargeItem.value : 0)

      }
      return {
        categoryData: categoryData,
        series: [
          {
            name: "新增用户",
            data: new_member,
          },
          {
            name: "收入",
            data: profit,
          },
          {
            name: "提现",
            data: withdraw,
          },
          {
            name: "充值",
            data: recharge,
          },
        ],
      };
    },
    initChart() {
      this.chart = window.echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(chartData) {
      const data = this.splitData(chartData)
      this.chart.setOption({
        xAxis: {
          data: data.categoryData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: data.series.map(item => item.name)
        },
        series: data.series.map(item => ({
          name: item.name,
          smooth: true,
          type: 'line',
          data: item.data,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        })),
      })
    },
  }
}
</script>