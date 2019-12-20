<template>
  <div class="container">
    <div class="head">
      <img class="img-title" src="./assets/imgTitleBg.png" alt="" />
      <img class="img-logo" src="./assets/imgLogo.png" alt="" />
      <img class="img-logo2" src="./assets/imgLogo2.png" alt="" />
      <div class="text">
        <div>自然是深圳数据综合看板</div>
        <div>Shenzhen data comprehensive Kanban</div>
      </div>
      <div class="time">
        <img class="icon-time" src="./assets/iconTime.png" alt="">
        <span @click="show = !show">{{time}}</span>
      </div>
    </div>
    <div class="body">
      <div class="tips">
        <div v-for="item in changeData" :key="item.id" :class="`tip tip${item.id}`">
          <span>{{item.name}}</span>
          <transition>
            <span v-show="item.show">+{{item.changeValue}}</span>
          </transition>
        </div>
      </div>
      <div class="charts">
        <div class="map">
          <v-chart
            ref="chart"
            :options="mapOptions" 
          />
        </div>
        <div class="bar">
          <div class="first-area" v-if="firstStreet">
            <div class="title">{{firstStreet.area.name}}</div>
            <div class="info">
              <span>{{firstStreet.name}}</span>
              <span>{{firstStreet.count}}</span>
              <span>票</span>
            </div>
            <div class="info">
              <span>票数占比</span>
              <span>{{firstStreet.p}}</span>
              <span>%</span>
            </div>
          </div>
          <v-chart
            ref="bar"
            :options="barOptions"
          />
        </div>
      </div>

      <div class="data">
        <div class="data-block">
          <div class="title">
            <span>放置地点汇总</span>
            <span>Place summary</span>
          </div>
          <div class="list">
            <div class="item-place" v-for="item in locationList" :key="item.id">
              <span>{{item.name}}</span>
              <span>{{item.count}}</span>
              <span>票</span>
            </div>
          </div>
        </div>

        <div class="data-block">
          <div class="title">
            <span>区域排名</span>
            <span>Place summary</span>
          </div>
          <div class="list">
            <div class="item-area" v-for="(item, index) in areaList" :key="item.id">
              <span>{{index + 1}}</span>
              <span>{{item.name}}</span>
              <span>{{item.value}}</span>
              <div>
                <span :style="{width: item.width}"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ECharts from 'vue-echarts'
import moment from 'moment';
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/visualMap'
import 'echarts-gl'
import addressData from './assets/addressData.json';
import mapOptions from './assets/map';
import barOptions from './assets/bar';

ECharts.registerMap('shenzhen', addressData)
ECharts.registerMap('shenzhen1', addressData)

export default {
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      mapOptions,
      barOptions,
      time: '',
      show: false,
      changeData: [],

      locationList: [],
      areaList: [],
      streetList: []
    }
  },
  computed: {
    firstStreet() {
      if(this.streetList.length) {
        const first = this.streetList[0]
        const total = this.streetList.reduce((p, c) => p + c.count , 0)

        first.p = parseInt(first.count / total * 100)
        first.area = this.areaList.find(i => first.code.indexOf(i.id) > -1)
        return first
      }
    },
  },
  mounted() {
    this.initTime();
    this.getData();
  },
  methods: {
    getData() {
      this.formatChangeData(() => {
        setInterval(this.formatChangeData, 3000);
      });
    },
    formatChangeData(cb) {
      const prevData = this.areaList;

      axios.get('/api/location/count').then(res => {
        const {locations, areas} = res.data.data
        const streetList = [];

        this.locationList = locations.sort((a, b) => b.count - a.count);
        
        const areaList = areas.map(item => {
          const streets = item.districts.map(s => ({
            name: s.name,
            value: s.location ? s.location.concat(s.value) : [],
            count: s.count,
            code: s.code
          }))

          streetList.push(...streets)
          return {
            id: item.code,
            name: item.name,
            value: item.count
          }
        }).sort((a, b) => b.value - a.value)

        areaList.map(i => {
          const first = areaList[0];

          i.width = first.value ? `${(i.value/first.value)*100}%` : '0'
          return i;
        });

        this.mapOptions.series[1].data = this.streetList = streetList.sort((a, b) => b.count - a.count)
        this.mapOptions.series[0].data = this.areaList = areaList

        const ten = this.streetList.slice(0, 10);

        this.barOptions = {
          ...this.barOptions,
          xAxis: {
            data: ten.map(i => ({
              value: i.name
            })),
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              color: '#fff',
            },
          },
          series: [
            {
              type: 'bar',
              name: '街道排名',
              barWidth: 20,
              barGap: '150%',
              itemStyle: {
                color: '#DEAF33'
              },
              data: ten.map(i => ({
                name: i.name,
                value: i.count
              }))
            }
          ]
        }

        if(cb) {
          cb()
        } else {
          const changeData = this.areaList.map(item => {
            const matched = prevData.find(t => t.id === item.id);
            const changeValue = item.value - matched.value;

            if(changeValue > 0) {
              const data = {
                ...item,
                changeValue,
                show: true
              };
              setTimeout(() => {
                data.show = false;
              }, 1100)
              return data;
            } else {
              return {
                ...item,
                changeValue: 0,
                show: false
              }
            }
          });
          changeData.push({
            id: 100,
            name: '龙岗区',
          })

          this.changeData = changeData;
        }
      })
    },
    initTime() {
      this.time = moment().format('YYYY-MM-DD hh:mm:ss');
      setInterval(() => {
        this.time = moment().format('YYYY-MM-DD hh:mm:ss');
      }, 1000)
    },
  }
}
</script>


<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body, .container {
  height: 100%;
  font-family: '微软雅黑';
}
.container {
  background-image: url(./assets/imgBg.png);
  background-size: 100%;
  display: flex;
  flex-direction: column;
}
.head {
  height: 156px;
  .img-title {
    width: 100%;
    height: 156px;
    display: block;
  }
  .img-logo {
    position: absolute;
    top: 10px;
    left: 40px;
    width: 136px;
  }
  .img-logo2 {
    position: absolute;
    top: 10px;
    left: 210px;
    width: 136px;
  }
  .text {
    color: #fff;
    flex: 1;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-top: 10px;
    div:first-child {
      font-size: 40px;
      margin-bottom: 5px;
    }
    div:nth-child(2) {
      font-size: 24px;
    }
  }
  .time {
    position: absolute;
    top: 13px;
    right: 40px;
    background-color: #0B2E53;
    padding: 10px 20px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    min-width: 300px;
    box-sizing: border-box;
    img {
      width: 22px;
      margin-right: 10px;
    }
    span {
      font-size: 22px;
      color:rgba(81,146,199,1);
    }
  }
}
.body {
  display: flex;
  flex: 1;
  padding-right: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  .tips {
    .tip {
      position: absolute;
      z-index: 1000;
      font-weight: bold;
      font-size: 16px;
      display: flex;
      align-items: center;
    }
    .tip {
      span:last-child {
        position: absolute;
        top: -40px;
        left: 10px;;
        // display: block;
        margin-left: 5px;
        font-size: 24px;
        color: #fff;
      }
    }
    .tip.tip440311 {
      left: 17%;
      top: 13%;
    }
    .tip.tip440306 {
      top: 30%;
      left: 11%;
    }
    .tip.tip440309 {
      top: 25%;
      left: 23%;
    }
    .tip.tip440305 {
      top: 48%;
      left: 17%;
    }
    .tip.tip440307 {
      top: 20%;
      left: 40%;
    }
    .tip.tip440310 {
      top: 25%;
      left: 47%;
    }
    .tip.tip440308 {
      top: 40%;
      left: 41%;
    }
    .tip.tip100 {
      top: 45%;
      left: 58%;
    }
    .tip.tip440304 {
      top: 46%;
      left: 25%;
    }
    .tip.tip440303 {
      top: 43%;
      left:32%;
    }
  }
  
  .charts {
    flex: 1;
    .map {
      width: 100%;
      height: 72%;
    }
    .bar {
      width: 100%;
      height: 28%;
      position: relative;
      .first-area {
        font-size: 14px;
        padding: 45px 25px 25px 20px;
        position: absolute;
        bottom: 0%;
        left: 18%;
        color: #fff;
        background-image: url(./assets/imgAreaBg.png);
        background-size: 100% 100%;
        background-position: 0 0;
        .title {
          position: absolute;
          width: 126px;
          line-height: 36px;
          text-align: center;
          background-image: url(./assets/imgAreaTitleBg.png);
          background-position: 0 0;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
        }
        .info {
          margin-bottom: 35px;
          span:first-child {
            margin-right: 45px;
          }
        }
        .info:nth-child(2) {
          span:nth-child(2) {
            font-size: 24px;
            font-weight:bold;
            color: #EFD42B;
            margin-right: 5px;
          }
        }
        .info:nth-child(3) {
          margin-bottom: 0;
          span:nth-child(2) {
            font-size: 24px;
            font-weight:bold;
            color: #52C7F1;
            margin-right: 5px;
          }
        }
      }
    }
    .echarts {
      width: 100%;
      height: 100%;
    }
  }
  .data {
    width: 28%;
    color: #fff;
    .data-block {
      margin-bottom: 45px;
    }
    .title {
      font-size: 20px;
      margin-bottom: 10px;
      padding-left: 10px;
      span:first-child {
        margin-right: 20px;
      }
      span:nth-child(2) {
        color: #8292A9;
      }
    }
    .list {
      background-image: url(./assets/imgDataBg.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: 0 0;
      padding: 30px 25px;
      .item-place {
        display: flex;
        align-items: flex-end;
        line-height: 1;
        margin-bottom: 13px;
        span:nth-child(1) {
          flex: 1;
        }
        span:nth-child(1), span:nth-child(3) {
          font-size: 14px;
        }
        span:nth-child(2) {
          font-size: 24px;
          margin-right: 3px;
          // font-weight: bold;
        }
      }
      .item-place:last-child {
        margin-bottom: 0;
      }
      .item-area {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-bottom: 10px;
        span:nth-child(1) {
          margin-right: 20px;
        }
        span:nth-child(2) {
          width: 90px;
        }
        span:nth-child(3) {
          width: 100px;
        }
        div {
          flex: 1;
          span {
            display: block;
            height: 10px;
            background:linear-gradient(90deg,rgba(217,106,26,1) 0%,rgba(227,222,68,1) 100%);
            border-radius:6px;
          }
        }
      }
      .item-area:last-child {
        margin-bottom: 0;
      }
      .item-area:nth-child(n+4) {
        div{
          span {
            background:linear-gradient(90deg,rgba(135,55,226,1) 0%,rgba(49,156,224,1) 100%);
            border-radius:6px;
          }
        }
      }
    }
  }
}
.v-enter {
  opacity: 0;
  transform: translateY(15px);
}
.v-enter-active {
  transition: 1s;
}
.v-leave-active {
  opacity: 0;
  transition: 0.8s;
}
</style>