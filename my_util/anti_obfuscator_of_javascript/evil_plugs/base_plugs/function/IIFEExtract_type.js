// 自调用函数TYPE1去除，函数体抽离到父级作用域中，删除函数
const _base = require('../base');
const t = _base.t
const BasePlug = require("../base").default;

function renameDupicateVariable(path, insidePath){
    // 如果发生命名冲突，则重命名函数内部的变量
    insideBinding = Object.keys(insidePath.scope.bindings);
    outsideBinding = Object.keys(path.scope.bindings);
    insideBinding.forEach(insideBindingName => {
        let new_name = insideBindingName
        while(outsideBinding.indexOf(new_name) > -1)
            new_name = '_' + new_name
        insidePath.scope.rename(insideBindingName, new_name)
    });
}

const visitor = {
    // (function (){})(); 格式的IIFE
    FunctionExpression(path) {
        if(path.node.params.length != 0){return;}  // 函数参数非空
        if(path.key != 'callee'){return;}
        if(!t.isCallExpression(path.parentPath)){return;}
        if(!t.isExpressionStatement(path.parentPath.parentPath)){return;}
        
        renameDupicateVariable(path.scope.parent.path, path)
        path.getStatementParent().replaceInline(path.node.body.body)
    },
    // !function (){}() 格式的IIFE
    UnaryExpression(path) {  
        let { operator, argument } = path.node;
        if (operator !== "!" || !t.isCallExpression(argument)) return;
        let { arguments, callee } = argument;
        if (arguments.length != 0 || !t.isFunctionExpression(callee)) return;
        let { id, params, body } = callee;
        if (id != null || params.length != 0 || !t.isBlockStatement(body)) return;
        
        renameDupicateVariable(path, path.get('argument.callee.body'))
        path.replaceWithMultiple(body.body);
    }
}

exports.default = new BasePlug(
    'IIFE Extract',
    visitor,
    '自调用函数函数去除，函数体抽离到父级作用域中，删除函数',
)


function demo() {
    const parser = _base.parser;
    const generator = _base.generator;
    var jscode = `
        var a = 3;
        var b = 4;
        var _a = 0
        !function (){
            var a = 1;
            console.log(a);
            console.log(c);
        }();

        (function (){
            var b = 2;
            console.log(b);
            console.log(c);
        })();
    `;
    let ast = parser.parse(jscode);
    let local_plug = new BasePlug(
        'IIFE body extract to ParentNode body',
        visitor,
        '(function(){})();类型的自调用函数函数去除，函数体抽离到父级作用域中，删除函数',
    )
    local_plug.handler(ast)
    console.log('------------------')
    console.log(generator(ast)['code']);  // 使用 generator 得到修改节点后的代码
}
demo()