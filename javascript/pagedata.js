var get_nodes_by_nodeType = function(nodes,nodeType){
    //nodeType = 1:elem节点 nodeType = 3:文本节点
    var nodes_ = []
    for(i=0;i<nodes.length;i++){
        if(nodes[i].nodeType == nodeType){
            nodes_.push(nodes[i])
        }
    }
    return nodes_
}
//得到elem直接子节点的文本值
var get_text_nodes = function(elem){
    console.log('get_text_nodes')
    text_nodes_ = []
    texts = []
    text_nodes = get_nodes_by_nodeType(elem.childNodes,3)
    for(var i=0;i<text_nodes.length;i++){
        if(text_nodes[i].nodeValue.trim() !== ""){
            text_nodes_.push(text_nodes[i])
            texts.push(text_nodes[i].nodeValue)
        }
    }
    return [text_nodes_,texts]
}

var get_tag_data = function(elem){
    console.log('get_tag_data')
    tag_data = {}
    //得到xpath,style和文本节点的文本
    tag_data.xpath = get_xpath(elem)
    tag_data.style = getComputedStyle(elem).cssText
    tag_data.texts = get_text_nodes(elem)[1]
    console.log(tag_data)
    return tag_data
}

var get_tags_data = function(){
    console.log('get_tags_data')
    tags_data = []
    elems = document.querySelectorAll('*')
    elems = get_top_elems_by_scroll_window(elems)
    console.log(elems)
    for(var j=0;j<elems.length;j++){
        tag_data = get_tag_data(elems[j])
        tags_data.push(tag_data)
    }
    return JSON.stringify(tags_data)
}

var get_baseURI = function(){
    return document.baseURI
}

var get_active_elems = function(){
    elems = query_by_tagnames(['a','input','button','select'])
    elems = get_top_elems_by_scroll_window(elems)
    elems_action_list = []

    for(i=0;i<elems.length;i++){
        xpath = get_xpath(elems[i])

        if(elems[i].tagName == 'A' || elems[i].tagName == 'BUTTON'){

            elems_action_list.push([xpath,'click'])
        }

        if(elems[i].tagName == 'SELECT'){
            elems_action_list.push([xpath,'select'])
        }

        if(elems[i].tagName == 'INPUT'){
            if(elems[i].type == 'text'||elems[i].type == 'password'){
                elems_action_list.push([xpath,'send_keys'])
            }
            if(elems[i].type == 'checkbox'||elems[i].type == 'radio'){
                elems_action_list.push([xpath,'check'])
            }
        }
    }
    return elems_action_list
};