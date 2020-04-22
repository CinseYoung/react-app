/*移动端:active伪类无效的解决方法*/
document.body.addEventListener('touchstart', function() {
    //...空函数即可
})

/*iOS 10中禁止用户缩放页面*/
window.onload = function() {
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault()
        }
    })
    var lastTouchEnd = 0
    document.addEventListener('touchend', function(event) {
        var now = (new Date()).getTime()
        if (now - lastTouchEnd <= 300) {
            event.preventDefault()
        }
        lastTouchEnd = now
    }, false)

    //预留出状态栏的高度
    /*var userAgent = navigator.userAgent;
    if (!(userAgent.indexOf("Android") > -1 || userAgent.indexOf("Linux") > -1)) {
        document.body.style.marginTop = "20px";
    }*/
}