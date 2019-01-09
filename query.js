/*
Your browser must support es6
*/
"use strict";

var query_by_innerText = function(innerText){
/*
筛选出innerText值 == innerText的elem列表
*/
  var elems = document.querySelectorAll('*')
  var include_innerText_elems_list = []
  //找包含文本的元素
  for(var i=0;i<elems.length;i++){
      var elems_innerText = elems[i].innerText && elems[i].innerText.replace(/(^\s*)|(\s*$)/g,"") // 去除elem字符串前后的空格
      if (elems_innerText == innerText){
        include_innerText_elems_list.push(elems[i])
      }
  }
  return include_innerText_elems_list
}

var get_top_elems = function(elems_list){
/*
从参数elems_list筛选出位于页面元素最高层并位于浏览器内的新elems列表
1. 使用getBoundingClientRect 得到elem的坐标
2. 使用elementsFromPoint得到位于该坐标的所有元素 =〉 (由上层到最下层排列)div.form-group, form#form_login, div.loginContent, div.login, div.globalBg, body, html
3. 由该坐标位置最上层的可见元素与elem对比，如果最上层的可见元素是elem自身或者elem的子元素,则该元素位于最上层，如果是遮罩层(显然不是子元素)返回false
*/
  //判断元素是否为最高层元素
  var isTop = function(elem){

      // 得到元素的中心点坐标
      var rect = elem.getBoundingClientRect()
      var x = rect.left + (rect.right - rect.left)/2
      var y = rect.top + (rect.bottom - rect.top)/2
      // elementsFromPoint：得到该点的最顶层元素，如果坐标不再浏览器显示范围内(30,-200)，则返回 []，这是判断是否显示在浏览器的核心
      var top_elem = document.elementsFromPoint(x,y)[0]
      // console.log(top_elem,x,y)
      // return elem.contains(top_elem)
      return elem == top_elem
  }
  // get top elem list
  var new_elems = []
  for(var i = 0;i<elems_list.length;i++){
      if(isTop(elems_list[i])){
          new_elems.push(elems_list[i])
      }
  }
  return new_elems
}


var query_by_placeholder = function(elems,innerText){
  include_innerText_elems_list = []
  for(var i=0;i<elems.length;i++){
    if(elems[i].placeholder == innerText){include_innerText_elems_list.push(elems[i])}
  }
  console.log('query_by_placeholder:',include_innerText_elems_list)
  return include_innerText_elems_list
}

var query_input = function(elems,innerText){
    elem_list = query_by_placeholder(elems,innerText)
    if(elem_list){
        return elem_list
    }
    include_innerText_elems_list = []


}

var get_scroll_elems = function(){
/*
得到页面所有的滚动元素
*/
  var all_elems = document.querySelectorAll("*")
  var scroll_elems = []
  var isScroll = function (el) {
               // test targets
               var elems = el ? [el] : [document.documentElement, document.body];
               var scrollX = false, scrollY = false;
               for (var i = 0; i < elems.length; i++) {
                   var o = elems[i];
                   // test horizontal
                   var sl = o.scrollLeft;
                   o.scrollLeft += (sl > 0) ? -1 : 1;
                   o.scrollLeft !== sl && (scrollX = scrollX || true);
                   o.scrollLeft = sl;
                   // test vertical
                   var st = o.scrollTop;
                   o.scrollTop += (st > 0) ? -1 : 1;
                   o.scrollTop !== st && (scrollY = scrollY || true);
                   o.scrollTop = st;
               }
               // ret
               return {
                   scrollX: scrollX,
                   scrollY: scrollY
               };
           };

  for(var j = 0; j < all_elems.length; j++){
      if (isScroll(all_elems[j]).scrollY){
          scroll_elems.push(all_elems[j])
      }
  }
  return scroll_elems
}

var get_top_elems_by_scroll_window = function(elems){
/*
滚动页面得到顶层元素
*/
  var scroll_elems = get_scroll_elems()
  var result_elems_list = []
  if(scroll_elems.length == 0){
    return get_top_elems(elems)
  }
  //最后一个滚动元素滚动
  var scroll_elem = scroll_elems.pop()
  var scroll_times = Math.floor(scroll_elem.scrollHeight/scroll_elem.offsetHeight)
  for(var i = 0; i <= scroll_times; i++){
      scroll_elem.scrollTop = scroll_elem.offsetHeight*i
      var _elems = get_top_elems(elems)
      for(var j = 0; j < _elems.length; j++){
          if (result_elems_list.indexOf(_elems[j]) == -1){
              result_elems_list.push(_elems[j])
          }
      }
  }
  scroll_elem.scrollTop = 0
  //html滚动
  scroll_elem = document.documentElement
  scroll_times = Math.floor(scroll_elem.scrollHeight/scroll_elem.offsetHeight)
  for(var i = 0; i <= scroll_times; i++){
      scroll_elem.scrollTop = scroll_elem.offsetHeight*i
      _elems = get_top_elems(elems)
      for(var j = 0; j < _elems.length; j++){
          if (result_elems_list.indexOf(_elems[j]) == -1){
              result_elems_list.push(_elems[j])
          }
      }
  }
  scroll_elem.scrollTop = 0
  return result_elems_list
}
var query = function(innerText = null,action_type = 'click',scroll = true,cross = null){
    if(action_type == 'click'){var elems = query_by_innerText(innerText)}
    if(action_type == 'input'){var elems = query_input(innerText,cross = 'left')}
    if(action_type == 'select'){var elems = document.querySelectorAll('select');elems = query_input(elems,innerText)}


    scroll ? elems = get_top_elems_by_scroll_window(elems) : elems = get_top_elems(elems)

    return elems
}




var query_input = function(innerText,cross = 'placeholder'){

/*
query_input 根据文字与位置关系得到input
1. 如果cross == placeholder 返回palceholder为 cross 的输入框
2. 使用query_by_innerText得到文字的位置
3. 根据文字的位置返回距离文字最近的input的位置
4. cross = 'left';'right','bottom' => 输入框在文字的左边；右边和下边
*/
    var text_elems = query_by_innerText(innerText)
    var input_elems_list = []
    if(cross == 'placeholder'){
        var elems = document.querySelectorAll('input')
        for(var i=0;i<elems.length;i++){
            if(elems[i].getAttribute('placeholder') == innerText){
                input_elems_list.push(elems[i])
            }
        }
        return input_elems_list
    }

    // 每一个Text 的最标点，并返回最近的一个input
    for(var i=0;i<text_elems.length;i++){
        // 得到文字的中心点坐标
        var rect = text_elems[i].getBoundingClientRect()
        var x = rect.left + (rect.right - rect.left)/2
        var y = rect.top + (rect.bottom - rect.top)/2
        // 计算平移的次数，每次平移10个像素
        var left = Math.floor(x/10)
        var right = Math.floor((window.screen.availWidth - x)/10)
        var top = Math.floor(y/10)
        var bottom = Math.floor((window.screen.availHeight - y)/10)


        if(cross == 'left'){
            var target_x = x
            for(var i =0;i<left;i++){
                target_x -= 10
                var elem = document.elementsFromPoint(target_x,y)[0]
                if(elem.getAttribute('type') == 'text' || elem.getAttribute('type') == 'password' || elem.getAttribute('type') == 'search'){
                    input_elems_list.push(elem)
                    break
                }
            }
        }
        if(cross == 'right'){
            var target_x = x
            for(var i =0;i<right;i++){
                target_x += 10
                var elem = document.elementsFromPoint(target_x,y)[0]
                if(elem.getAttribute('type') == 'text' || elem.getAttribute('type') == 'password' || elem.getAttribute('type') == 'search'){
                    input_elems_list.push(elem)
                    break
                }
            }
        }
        if(cross == 'bottom'){

            var target_y = y
            for(var i =0;i<bottom;i++){
                target_y += 10
                var elem = document.elementsFromPoint(x,target_y)[0]
                console.log(elem)
                if(elem.getAttribute('type') == 'text' || elem.getAttribute('type') == 'password' || elem.getAttribute('type') == 'search'){
                    input_elems_list.push(elem)
                    break
                }
            }
        }
    }
return input_elems_list
}