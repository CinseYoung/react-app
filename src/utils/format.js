function _pathZero(num) {
	num = num.toString()
	return num.length <= 1 ? `0${num}` : `${num}`
}
//FormatDate("yyyy-MM-dd hh:mm:ss", new Date());
function FormatDate(fmt, context) {
	let o = {
		"M+": context.getMonth() + 1,                 //月份
		"d+": context.getDate(),                    //日
		"h+": context.getHours(),                   //小时
		"m+": context.getMinutes(),                 //分
		"s+": context.getSeconds()                  //秒
	};

	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, context.getFullYear().toString())
	}

	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			fmt = fmt.replace(RegExp.$1, _pathZero(o[k]))
		}
	}
	return fmt
}

//TimestampToTime(1569056602165);
function TimestampToTime(timestamp){
  let date = new Date(timestamp)
  let Y = date.getFullYear() + '-'
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
  let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' '
  let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':'
  let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':'
  let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds())
  return Y+M+D+h+m+s
}

export { FormatDate, TimestampToTime }
