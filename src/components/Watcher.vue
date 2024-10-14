<template>
  <div id="app" class="app">
    <div>
      <div id="cpu" :style="'width:'+winw+'px;height:330px;'"></div>
      <div id="mem" :style="'width:'+winw+'px;height:330px;'"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'watcher',
  components: {
  },
  data: function() {
    return {
      stList: [],
      closetitle: 'watcherclose',
      winw: 0,
      cpuChart: {},
      memChart: {}
    }
  },
  created: function() {
    this.winw = document.body.clientWidth * 0.8
  },
  mounted() {
    var that = this
    window.onresize = () => {
      that.winw = document.body.clientWidth * 0.8
      that.cpuChart.resize()
      that.memChart.resize()
    }
    this.paintchart()
  },
  methods: {
    initstarter(e) {
      if (e !== null) {
        this.stList = e.starter
      }
      console.log(e)
    },
    paintchart() {
      console.log('init chart')
      var wathchpoint = 30
      this.cpuChart = echarts.init(document.getElementById('cpu'));
      this.initchart(this.cpuChart, 'cpu')
      var cpuT = []
      var cpuR = []
      var that = this
      this.$ipc.on('addcpudata', function(event, data) {
        var date = new Date();
        cpuT.push([date.getHours(), date.getMinutes(), date.getSeconds()].join(':'))
        cpuR.push(data)
        if (cpuT.length > wathchpoint) {
          cpuT.shift()
          cpuR.shift()
        }
        that.cpuChart.setOption({
          xAxis: {
            data: cpuT
          },
          series: [{
            name: 'usage',
            data: cpuR
          }]
        })
      })
      this.memChart = echarts.init(document.getElementById('mem'));
      this.initchart(this.memChart, 'mem')
      var memT = []
      var memR = []
      this.$ipc.on('addmemdata', function(event, data) {
        if (memT.length > wathchpoint) {
          memT.shift()
          memR.shift()
        }
        var date = new Date();
        memT.push([date.getHours(), date.getMinutes(), date.getSeconds()].join(':'))
        memR.push(data)
        that.memChart.setOption({
          xAxis: {
            data: memT
          },
          series: [{
            name: 'usage',
            data: memR
          }]
        })
      })
    },
    initchart(obj, id) {
      obj.setOption({
        title: {
          text: id
        },
        xAxis: {
          data: [],
          boundaryGap: false
        },
        yAxis: {
          min: 0,
          max: 100,
          offset: -20
        },
        series: [{
          name: 'usage',
          type: 'line',
          data: [],
          areaStyle: {
            color: 'red'
          },
          lineStyle: {
            color: 'black'
          }
        }]
      });
    }
  }
}
</script>
<style lang="stylus" scoped>
.app
  margin-top 30px
</style>
