diff_text_style = function(parentNode,textNode){
    span = document.createElement('diff-span')
    span.style.cssText = "background-color:rgba(255,255,0,0.3);color:#c30;border:2px dashed #f90;box-shadow:0 2px 5px rgba(0,0,0,0.4)"
    span.innerText = textNode.nodeValue
    parentNode.replaceChild(span,textNode)
}
