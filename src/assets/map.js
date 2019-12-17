export default {
  visualMap: [
    {
      min: 1,
      max: 200,
      text:['High','Low'],
      realtime: false,
      calculable: true,
      inRange: {
          color: ['#247CD6', '#E09825', '#B93730']
      },
      seriesIndex: 0,
      textStyle: {
        color: '#fff'
      }
    }
  ],
  geo: {
    map: 'shenzhen',
    label: {
      show: false,
    },
    itemStyle: {
      borderWidth: 0.1,
    },
    emphasis: {
      label: {
        show: false
      }
    },
    z: 10,
    top: '5%',
    right: '5%',
    bottom: '10%',
    left: '15%',
  },
  series: [
    {
      name: '自然深圳',
      type: 'map',
      data: [],
      geoIndex: 0,
    },
    {
      name: '街道散点图',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: [
        // 宝安区
        {name: '新安', value: [113.895604, 22.568923, 100]},
        {name: '西乡', value: [113.883902, 22.580936, 130]},
        {name: '福永', value: [113.823149, 22.671102, 200]},
        {name: '福海', value: [113.80566, 22.678651, 200]},
        {name: '沙井', value: [113.811797, 22.732713, 200]},
        {name: '松岗', value: [113.848267, 22.764575, 30]},
        {name: '石岩', value: [113.94603, 22.687349, 30]},
        // 福田区
        {name: '福保', value: [114.055029, 22.525075, 1]},
        {name: '福保', value: [114.071486, 22.530315, 12]},
        {name: '华富', value: [114.071486, 22.530315, 13]},
        {name: '莲花', value: [114.051744, 22.550473, 4]},
        {name: '梅林', value: [114.057075, 22.57079, 5]},
        {name: '南园', value: [114.101186, 22.54436, 33]},
        {name: '沙头', value: [114.049222, 22.535045, 3]},
        {name: '香蜜湖', value: [114.02395, 22.542644, 0]},
        {name: '园岭', value: [114.101403, 22.556215, 34]},
      ],
      geoIndex: 0,
      symbolSize: function (val) {
        return val[2] / 10;
      },
      showEffectOn: 'render',
      rippleEffect: {
          brushType: 'stroke'
      },
      hoverAnimation: true,
      itemStyle: {
          normal: {
              color: '#FFE466',
              shadowBlur: 10,
              shadowColor: '#333'
          }
      },
      z: 11
    },
    {
      name: '阴影',
      map: 'shenzhen1',
      type: 'map',
      z: 5,
      top: '5%',
      right: '5%',
      bottom: '5.5%',
      left: '14.5%',
      itemStyle: {
        borderWidth: 0,
        areaColor: '#122C45',
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowBlur: 16,
        shadowOffsetY: 15,
      },
    },
  ]
}
