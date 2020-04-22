// 连续点击返回按键，退出app 
(function(){
  var backClick = 0  // 退出点击次数，默认为0
  var time = new Date()   // 2s内再次点击就退出
  // 监听返回按钮
  document.addEventListener('backbutton', function() {
    var exitAppel = document.querySelector('#exitApp')
    var url = location.href.split('/www/')[1]
    setTimeout(function(){
      backClick = 0
      time = new Date()
      exitAppel.style.cssText = 'display: none;'
    },2010)
    // var urlList = location.href
    if(url=='index.html#/login'||url=='index.html#/'||url=='index.html#'){  // 处于app首页,满足退出app操作
      if(backClick > 0){  // 不为0时
        navigator.app.exitApp();  // app退出
        exitAppel.style.cssText = 'display: none;'
      }else{
        // 提示信息
        exitAppel.style.cssText = 'display: block;'
        // 小于2s,退出程序
        if(new Date( ) - time < 2000) {
          backClick++
        }else{
          // 大于2s，重置时间戳
          backClick = 0
          time = new Date()
          exitAppel.style.cssText = 'display: none;'
        }
      }
      return
    }
    history.back()  // 不满足退出操作，，返回上一页
  }, false)
})();