export default defineAppConfig({
  pages: [
    'pages/stalls/index',
    'pages/booking/index',
    'pages/cart/index',
    'pages/queue/index',
    'pages/mine/index',
    'pages/vendor-dashboard/index',
    'pages/group-buy/index',
    'pages/navigation/index',
    'pages/review/index',
    'pages/booking-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF6B35',
    navigationBarTitleText: '集市熟客',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FFF8F3'
  },
  tabBar: {
    color: '#A39E97',
    selectedColor: '#FF6B35',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/stalls/index',
        text: '今日摊位'
      },
      {
        pagePath: 'pages/booking/index',
        text: '预订'
      },
      {
        pagePath: 'pages/cart/index',
        text: '商品篮'
      },
      {
        pagePath: 'pages/queue/index',
        text: '叫号'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
