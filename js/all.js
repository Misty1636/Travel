// var canvas = document.getElementById('canvas')
// var ctx = canvas.getContext('2d')

// canvas.height = 10;
// canvas.width = 1170;

// function drawDashedLine(pattern) {
//   ctx.beginPath();
//   ctx.lineWidth = 2; 
//   // ctx.setLineDash(pattern);
//   ctx.moveTo(0, 5);
//   ctx.lineTo(1170, 5);
//   ctx.strokeStyle = '#FF6F61';
//   ctx.stroke();
// }
// drawDashedLine([5, 15]);

var hot = document.querySelector('.popular-list')
var zones = document.querySelector('.district-menu')
var zonename = document.querySelector('.district-name')
var list = document.querySelector('.list')
var paginations = document.querySelector('.pagination')
var xhr = new XMLHttpRequest()

xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97','true')
xhr.send()
xhr.onload = function(){
	if(xhr.readyState == 4 && xhr.status == 200){
    xhrdata()
    zones.value = '請選擇行政區' 
	} else{
		alert('請求錯誤')
	}

}


function xhrdata(){ // ajax獲取資料
	var data = JSON.parse(xhr.responseText)
	var array = data.result.records
	var copyarray = []
	for(index in array){ // 複製array
		copyarray[index] = array[index];
	}


	for(var i=0; i<copyarray.length; i++){ // 一前一後比較,相同刪除,只留下不同區域
		for(var j=i+1; j<copyarray.length; j++){
			if(copyarray[i].Zone == copyarray[j].Zone){
				copyarray.splice(j,1)
				j--
			}
		}
	}

	for(var i=0; i<copyarray.length; i++){  //依據資料有多少區增加幾個區
		var str = document.createElement('option')
		str.setAttribute('value',copyarray[i].Zone)
		str.textContent = copyarray[i].Zone
		zones.appendChild(str)
	}
  
  var select = ''  // 讓其他能使用select值

  function updatelist(e){ // select選單change更新資料
    select = e.target.value
    // if(select == '請選擇行政區') return
    current = 1  // change後讓當前頁面回到1
    createlist(select)

  }

  function designatelist(e){ // 點擊按鈕指定區域更新資料
  	e.preventDefault()
  	var nodes = e.target.nodeName
  	if(nodes !== 'A') return
  	var area = e.target.innerText
    zones.value = area  // 直接更改select選單的值
    current = 1 // 點擊後讓當前頁面回到1
    createlist(area)
   
  }
  var current = 1 // 當前頁面從1開始
  var maxpage = '' //最大頁面
   function switchpage(e){  // 分頁點擊更新
   	  e.preventDefault()
      var num = e.target.dataset.num
      var direction = e.target.dataset.direction
      if( num > 0){current = num}  // 判別是否是透過num刷新 ,以防undefined
      console.log('最大頁數'+maxpage)
      console.log(select)
      if( direction == 'prev' && current>1){ current--} // 點擊prev, current-1
      if( direction == 'next' && current < maxpage){ current++} // 點擊next, current+1
      console.log(current)
      createlist(select)
   }
  
  function randomlist(){  //進入畫面隨機渲染任一區域
  	var index = Math.floor((Math.random()*copyarray.length)); 
  	console.log(index)
  	createlist(copyarray[index].Zone)
  }
  randomlist()

  function createlist(item){ // 生成資料
  	 var str = ''
     var name = ''
     var x = 0  // 單區資料筆數
     var copyarray = [] // 儲存此區的資料

     for(var i=0;i<array.length; i++){ //判別比數 和 複製同區資料
     	data = array[i]
     	if(item == array[i].Zone){ 
     		x+=1
     		copyarray.push(data)
     	}
     }
     console.log(copyarray)


     maxpage= Math.ceil(x/4)  // 一頁最多4個, 判別幾頁
     var z = (current-1)*4 // 依當前current決定從第幾筆資料
     var s = 0  // 紀錄資料數量
  	 for(var i=z;i<copyarray.length; i++){
  	 	var free= '<b class="free">'+copyarray[i].Ticketinfo+'</b>'
  	 	if(item == copyarray[i].Zone){
  	 		if(copyarray[i].Ticketinfo !== '免費參觀'){free=''} // 判斷是否有免費參觀
  	 		name = copyarray[i].Zone
  	 		str+= '<div class="item-box"><div class="item-img"><img src="'
  	 		       +copyarray[i].Picture1+'"><div class="site"><span class="sitename">'
  	 		       +copyarray[i].Name+'</span><span>'+copyarray[i].Zone
  	 		       +'</span></div></div><div class="message"><span class="clock">'
  	 		       +copyarray[i].Opentime+'</span><span class="local">'
  	 		       +copyarray[i].Add+'</span><span class="phone"><b>'
  	 		       +copyarray[i].Tel+'</b>'+free+'</span></div></div>'

  	 		s++
  	 		if(s==4){break} // 控制資料數量, 執行4次中斷
  	 	}
  	 }

  	 console.log('限制'+s)
  	 console.log('當前在第'+current)
     var num = ''
     var page= ''
  	 if( maxpage>1){ // 大於一頁產生分頁
  	   for(var i=0;i<maxpage; i++){
  	   	 if( (i+1) == current){ // 判斷當前頁面加active
  	   	   addactive = ' active'
  	   	 } else {
  	   	 	 addactive = ''
  	   	 }
         num+= '<li><a href="#" class="page-num'+addactive+'" data-num='+(i+1)+'>'+(i+1)+'</a></li>'
  	 	 }
       page = '<ul class="pages"><li><a href="#" class="prev" data-direction="prev"><<</a></li>'
  	          +num+'<li><a href="#" class="next" data-direction="next">>></a></li></ul>'
  	 }
  	 if(maxpage>1 && current == maxpage){ // 當前頁面等於最大頁面加disabled隱藏next
	      page = '<ul class="pages"><li><a href="#" class="prev" data-direction="prev"><<</a></li>'
	 	          +num+'<li><a href="#" class="next disabled" data-direction="next">>></a></li></ul>'
  	 }
  	 if(maxpage>1 && current == 1){ // 當前頁面等於1時加disabled隱藏prev
  	 	      page = '<ul class="pages"><li><a href="#" class="prev disabled" data-direction="prev"><<</a></li>'
  	 	 	          +num+'<li><a href="#" class="next" data-direction="next">>></a></li></ul>'
  	 }	
  	 console.log('總共'+x)
  	 console.log('從第幾個'+z)
  	 select = item  // 要給select值,以防透過按鈕沒有正確給予當前區 

  	paginations.innerHTML = page
  	zonename.innerHTML = name
  	list.innerHTML = str
  }

  var header = document.querySelector('.header')

  $(".mobile-link").click(function(e){ // open off canvas
  	e.preventDefault()
    $('.menu').removeClass('close')
	  $('.menu').addClass('open')
	});

	 $(".header").click(function(e){ // 點擊到ul以外區域 close off canvas
	 	  e.preventDefault()
	  	var link = e.target.nodeName
	  	if( link == 'A' || link =='UL' || link =='I') return
		  $('.menu').addClass('close')
		});

  $(".pagination").click(function(e){ // 點擊分頁滾動
  	if(e.target.nodeName !== 'A' ) return
	  $('body, html').animate({
	     scrollTop: $('#datas').offset().top
    }, 800);
	});

	$(".district-menu").change(function(){ // change後滾動
	  $('body, html').animate({
	     scrollTop: $('#datas').offset().top
    }, 800);
	});

  $('.areas').click(function(e) { // 指定區域滾動
    e.preventDefault();
    $('body, html').animate({
	     scrollTop: $($.attr(this, 'href')).offset().top
    }, 800);
  })

  $('.explore').click(function(e) { // 向下探索滾動
    e.preventDefault();
    $('body, html').animate({
	     scrollTop: $($.attr(this, 'href')).offset().top
    }, 1000);
    $('.menu').addClass('close')
  })

  $('.gotop a').click(function(event) { // 回頂端
	  event.preventDefault();
	  $('html,body').animate({
	    scrollTop: 0
	  }, 1000);
	});
  
  $(window).scroll(function(){  // 淡入顯示 
    var scrollPos = $(window).scrollTop()
	  var windowHeight = $(window).height()
	  $('.animated').each(function(){
	  	var thisPos = $(this).offset().top;
	  	if(windowHeight + scrollPos >= thisPos){
	  		$(this).addClass('fadeIn');
	  	}
	  })

	  $('.gotop').each(function(){  // 控制top按紐顯示出現
	  	var thisPos = $(this).offset().top;
	  	if( windowHeight + scrollPos >= thisPos ){
	  		$(this).css("display","block");
	  	} 
	  	if( scrollPos< 150){
	  		$(this).css("display","none");
	  	}
	  })
  })
  
  paginations.addEventListener('click',switchpage)
  hot.addEventListener('click',designatelist);
  zones.addEventListener('change',updatelist)
}

