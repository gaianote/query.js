var get_top_elems = function(elems_list){
    //判断元素是否为最高层元素
    var isTop = function(elem){
        //当元素未在屏幕中显示时，rect的参数都为0，所以选择的为显示在屏幕上的内容（遮罩层未显示时，由中心点无法选择到他）
        var rect = elem.getBoundingClientRect()
        //元素的中心坐标(x,y)
        x = rect.left + (rect.right - rect.left)/2
        y = rect.top + (rect.bottom - rect.top)/2
        get_top_elem = function(x,y){
            if(document.elementsFromPoint){
              elems = document.elementsFromPoint(x,y)
            }
            if(document.msElementsFromPoint){
              elems = document.msElementsFromPoint(x,y)
            }
            for(var i = 0;i<elems.length;i++){
                if(elems[i].offsetHeight>0 && elems[i].offsetHeight>0){
                    return elems[i]
                }
            }
        }
        //得到的最高层元素是否为传入的元素的子节点或传入的元素本身，返回布尔值
        return elem.contains(get_top_elem(x,y))
    }
    var new_elems = []
    for(var i = 0;i<elems_list.length;i++){
        if(isTop(elems_list[i])){
            new_elems.push(elems_list[i])
        }
    }
    return new_elems
}

var get_scroll_elems = function(){
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
  console.log(scroll_elems)
  return get_top_elems(scroll_elems)
}

var get_top_elems_by_scroll_window = function(elems){
  scroll_elems = get_scroll_elems()
  result_elems_list = []
  if(scroll_elems.length == 0){
    return get_top_elems(elems)
  }
  //最后一个滚动元素滚动
  scroll_elem = scroll_elems.pop()
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






var wait_page_load = function(){
  console.log('fuck')
  window.onload = function(){console.log('window.onload')}
  document.addEventListener("readystatechange",function(){
  console.log(document.readyState)
    if(document.readyState == "complete"){
      return true
    }
  })
  //如果页面没有加载完成
  if(document.readyState != 'complete'){
    return false
  }
  frames = query_by_tagnames(['frame','iframe'])
  console.log(frames)
  //如果页面里的frame没有加载完成
  for(i=0;i<frames.length;i++){
    if(frames[i].contentDocument.readyState != 'complete'){
      return false
    }
  }
  return true
}

var scroll_to_window = function(elem){
    scroll_elems = get_scroll_elems()
    result_elems_list = []
    //如果没有滚动条出现，直接返回true
    if(scroll_elems.length == 0){
      return true
    }
    //最后一个滚动元素滚动
    //scroll_elem = scroll_elems.pop()
    scroll_elem = get_top_elems(scroll_elems).pop()
    scroll_times = 200

    //如果elem在windows内并处于顶层，返回true，否则向下滚动20*i px
    for(var i = 0; i <= scroll_times; i++){
        scroll_elem.scrollTop = 20*i
        if (get_top_elems([elem]).length == 1){
          return true
        }
    }
    scroll_elem.scrollTop = 0
    //html滚动
    scroll_elem = document.documentElement
    scroll_times = 200
    for(var i = 0; i <= scroll_times; i++){
        scroll_elem.scrollTop = 20*i
        if (get_top_elems([elem]).length == 1){
          return true
        }
    }
    scroll_elem.scrollTop = 0

}