//获取xpath
var get_xpath = function(element) {
    if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
        return '//*[@id=\"' + element.id + '\"]';
    }
    //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
    if (element == document.documentElement) {//递归到body处，结束递归
        return '/html';
    }
    if (element == document.body) {//递归到body处，结束递归
        return '/html/' + element.tagName.toLowerCase();
    }
    var ix = 1,//在nodelist中的位置，且每次点击初始化
         siblings = element.parentNode.childNodes;//同级的子元素

    for (var i = 0, l = siblings.length; i < l; i++) {
        var sibling = siblings[i];
        //如果这个元素是siblings数组中的元素，则执行递归操作
        if (sibling == element) {
            return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
            //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
        } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
            ix++;
        }
    }
};

var query_by_xpath = function(STR_XPATH) {
  var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
  var xnodes = [];
  var xres;
  while (xres = xresult.iterateNext()) {
      xnodes.push(xres);
  }

  return xnodes;
}

var query_by_css = function(css_sector) {
  var xnodes = document.querySelectorAll(css_sector)
  return xnodes;
}

//query_by_tagnames(["a","button","span"])
var  query_by_tagnames = function(tagnames){
    new_elems = []
    for(i=0;i<tagnames.length;i++){
      elems = document.querySelectorAll(tagnames[i])
      for(j=0;j<elems.length;j++){
        new_elems.push(elems[j])
      }
    }
    return new_elems
}


//选择肉眼可见的elem
var query = function(query_type,selector,cross = 'x'){



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

  var query_by_xpath = function(STR_XPATH) {
      var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
      var xnodes = [];
      var xres;
      while (xres = xresult.iterateNext()) {
          xnodes.push(xres);
      }

      return xnodes;
  }
  var query_by_innerText = function(elems,innerText){
      var include_innerText_elems_list = []
      console.log(elems)
      //找包含文本的元素
      for(var i=0;i<elems.length;i++){
          elems_innerText = []
          for(j=0;j<elems[i].childNodes.length;j++){
            if(elems[i].childNodes[j].nodeType == 3 && elems[i].childNodes[j].nodeValue.trim() != ''){
              elems_innerText.push(elems[i].childNodes[j].nodeValue.trim())
            }
          }
          if (elems_innerText.indexOf(innerText) != -1){
            include_innerText_elems_list.push(elems[i])
          }
      }
      return include_innerText_elems_list
  }


  var query_input = function(elems,innerText){
    //有时候innerText是placeholder
    var query_by_placeholder = function(elems,innerText){
      include_innerText_elems_list = []
      for(var i=0;i<elems.length;i++){
        if(elems[i].placeholder == innerText){include_innerText_elems_list.push(elems[i])}
      }
      console.log('query_by_placeholder:',include_innerText_elems_list)
      return include_innerText_elems_list
    }

    //通过兄弟元素的innerText确定元素(用于input等没有innerText的元素)
    var query_by_brother_innerText = function(elems,innerText){
        include_innerText_elems_list = []
        for(var i=0;i<elems.length;i++){
                brothers = elems[i].parentNode.children
                for(var j=0;j<brothers.length;j++){
                  brother_innerText = brothers[j].innerText.replace(/(^\s*)|(\s*$)/g,"") // 去除elem字符串前后的空格
                  if (brother_innerText == innerText){
                    include_innerText_elems_list.push(elems[i])
                    break
                  }
                }
        }
        console.log('query_by_brother_innerText:',elems,innerText,include_innerText_elems_list)
        return include_innerText_elems_list
    }
    //通过父元素兄弟元素的innerText确定元素(用于input等没有innerText的元素)
    var query_by_parent_brother_innerText = function(elems,innerText){
        include_innerText_elems_list = []
        for(var i=0;i<elems.length;i++){
                parent_brothers = elems[i].parentNode.parentNode.children
                for(var j=0;j<parent_brothers.length;j++){
                  parent_brother_innerText = parent_brothers[j].innerText.replace(/(^\s*)|(\s*$)/g,"") // 去除elem字符串前后的空格
                  if (parent_brother_innerText == innerText){
                    console.log('query_by_parent_brother_innerText:',include_innerText_elems_list)
                    include_innerText_elems_list.push(elems[i])
                    break
                  }
                }
        }
        console.log('query_by_parent_brother_innerText:',include_innerText_elems_list)
        //如果完全匹配无法匹配的话，尝试片段匹配
        if(include_innerText_elems_list.length == 0){
          for(var i=0;i<elems.length;i++){
                          parent_brothers = elems[i].parentNode.parentNode.children
                          //筛选出父亲兄弟元素符合要求的元素，有一个符合就push元素并中断内层for，避免重复push该元素
                          for(var j=0;j<parent_brothers.length;j++){
                            parent_brother_innerText = parent_brothers[j].innerText.replace(/(^\s*)|(\s*$)/g,"") // 去除elem字符串前后的空格
                            if (parent_brother_innerText.search(innerText) != -1){
                              include_innerText_elems_list.push(elems[i])
                              break
                            }
                          }
                  }
        }
        console.log('query_by_parent_brother_innerText:',elems,innerText,include_innerText_elems_list)
        return include_innerText_elems_list
    }
    //如果传入的selector是个字符串
    if(innerText.constructor == String){
      result_elems = query_by_placeholder(elems,innerText)
      if(result_elems.length == 0){result_elems = query_by_brother_innerText(elems,innerText)}
      if(result_elems.length == 0){result_elems = query_by_parent_brother_innerText(elems,innerText)}
      return result_elems
    }

    //目前支持根据parent_brother_innerText进行选择
    if(innerText.constructor == Array){
      for(var i=0;i<innerText.length;i++){
        //通过循环，不断缩小elems的范围：["a","b"]=>包含a的所有input=>在a中包含b的所有input
        elems = query_by_parent_brother_innerText(elems,innerText[i])
      }
      return elems
    }

  }

  //query_by_tagnames(["a","button","span"])
  query_by_tagnames = function(tagnames){
    new_elems = []
    for(i=0;i<tagnames.length;i++){
      elems = document.querySelectorAll(tagnames[i])
      for(j=0;j<elems.length;j++){
        new_elems.push(elems[j])
      }
    }
    return new_elems
  }

  var new_query_by_innerText = function(elems,innerText){
      var include_innerText_elems_list = []
      //找包含文本的元素
      for(var i=0;i<elems.length;i++){
          elems_innerText = ''
          elems_innerText = elems[i].innerText.replace(/(^\s*)|(\s*$)/g,"") // 去除elem字符串前后的空格
          if (elems_innerText == innerText){
            include_innerText_elems_list.push(elems[i])
          }
      }
      return include_innerText_elems_list
  }

  /*  ------------------删选出对人类可见的元素-------------------*/
  var get_visible_elems = function(elems){
    visible_elems = []
    //找包含文本的元素
    for(var i=0;i<elems.length;i++){
      visibility = getComputedStyle(elems[i]).visibility
      if (elems[i].offsetWidth > 0 && elems[i].offsetHeight > 0 && visibility != 'hidden'){
        visible_elems.push(elems[i])
      }
    }
    return visible_elems
  }
  var get_top_elems = function(elems_list){
      //判断元素是否为最高层元素
      var isTop = function(elem){
          //当元素display= none时，rect的参数都为0，所以选择的为显示在屏幕上的内容（遮罩层未显示时，由中心点无法选择到他）
          var rect = elem.getBoundingClientRect()
          //元素的中心坐标(x,y)
          x = rect.left + (rect.right - rect.left)/2
          y = rect.top + (rect.bottom - rect.top)/2
          get_top_elem = function(x,y){
              if(document.elementsFromPoint){
                //x=0，y=0 时 也不会选中display= none的元素。当出现滚动条时，x,y为位于视窗外的元素，也不会被选中
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


  var scroll_window = function(elems){
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
  //根据表头寻找？tagname是要寻找的元素的tagname
  query_by_thead = function(tagname,text){
    text_elems = query_by_tagnames(['*']);


    text_elem = query_by_innerText(text_elems,text)[0];
    if (text_elem == undefined) return []
    console.log(text_elem)
    range = [text_elem.getBoundingClientRect().left,text_elem.getBoundingClientRect().right,text_elem.getBoundingClientRect().y]
    console.log(range[0],range[1])
    sel_elems = query_by_tagnames([tagname])
    sel_elems = get_top_elems(sel_elems)

    elems_box = []
    for(i=0;i<sel_elems.length;i++){
      left = sel_elems[i].getBoundingClientRect().left
      right = sel_elems[i].getBoundingClientRect().right
      y = sel_elems[i].getBoundingClientRect().y
      console.log(left,right)
      if((range[0]<=left&&left<=range[1])||(range[0]<=right&&right<=range[1])){

        if(y > range[2]){
          elems_box.push(sel_elems[i])
        }

      }
    }
    return elems_box

  }
  //处理传入的selector,以便于支持python传入数组等
  selector = JSON.parse(selector)




  if(query_type == 'click'){elems = query_by_tagnames(['*']);elems = query_by_innerText(elems,selector);}
  if(query_type == 'input'){elems = query_by_tagnames(['input']);elems = query_input(elems,selector)}
  if(query_type == 'select'){elems = query_by_tagnames(['select']);elems = query_input(elems,selector)}
  //开放css和xpath直接定位方法
  if(query_type == 'xpath'){elems = query_by_xpath(selector)}
  if(query_type == 'css'){elems = document.querySelectorAll(selector)}

  if(cross == 'y'){elems = query_by_thead(query_type,selector)}
  //筛选可见的，置于顶层的
  elems = get_visible_elems(elems)
  //elems = get_top_elems(elems)
  elems = scroll_window(elems)


  return elems
}

