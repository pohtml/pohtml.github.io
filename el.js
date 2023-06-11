addEventListener("DOMContentLoaded", function() {
    function transform(node) {
        if (!node.nodeValue) {
            return
        }
        node.nodeValue = node.nodeValue.replaceAll(/\${(.+?)}/g, function(expression, value) {
            try {
                return eval(value)
            } catch (error) {
                return expression
            }
        })
    }
    
    let elements = document.querySelectorAll("body,body *")
    for (let element of elements) {
        for (let node of element.attributes) {
            transform(node)
        }
        for (let node of element.childNodes) {
            let text = node.nodeType == Node.TEXT_NODE
            if (text && node.nodeValue) {
                transform(node)
            }
        }
    }
    
})