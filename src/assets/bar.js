export default {
  grid: {
    top: '10%',
    right: '20%',
    bottom: '15%',
    left: '45%'
  },
  xAxis: {
    data: [
      {value: '新安街道'},
      {value: '新安街道1'},
      {value: '新安街道2'},
      {value: '新安街道3'},
      {value: '新安街道4'},
      {value: '新安街道5'},
      {value: '新安街道6'},
      {value: '新安街道7'},
      {value: '新安街道8'},
      {value: '新安街道9'},
    ],
    axisLabel: {
      color: '#fff'
    },
  },
  yAxis: {
    splitLine: {
      show: false
    },
    axisLabel: {
      color: '#fff'
    }
  },
  series: [
    {
      type: 'bar',
      name: '街道排名',
      data: [
        {name: '新安街道', value: 10},
        {name: '新安街道1', value: 20},
        {name: '新安街道2', value: 30},
        {name: '新安街道3', value: 40},
        {name: '新安街道4', value: 55},
        {name: '新安街道5', value: 100},
        {name: '新安街道6', value: 1000},
        {name: '新安街道7', value: 20},
        {name: '新安街道8', value: 30},
        {name: '新安街道9', value: 66},
      ],
      barWidth: 20,
      itemStyle: {
        color: '#DEAF33'
      }
    },
  ]
}