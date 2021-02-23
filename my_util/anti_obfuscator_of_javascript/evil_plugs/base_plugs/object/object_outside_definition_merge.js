const _base = require('../base');
const t = _base.t
const BasePlug = require("../base").default;


const visitor = {
    VariableDeclarator(path) {
        const { id, init } = path.node;
        if (!t.isObjectExpression(init)) return;  // 初始值要是一个对象

        let name = id.name;
        let properties = init.properties;
        let all_next_siblings = path.parentPath.getAllNextSiblings();  // 获取当前定义语句后的同级的所有语句
        
        for (let next_sibling of all_next_siblings) {
            // 判断市表达式，且属于一开始声明的对象
            if (!next_sibling.isExpressionStatement()) break;
            let expression = next_sibling.get('expression');
            if (!expression.isAssignmentExpression()) break;
            let { operator, left, right } = expression.node;
            if (operator != '=' || !t.isMemberExpression(left) || !t.isIdentifier(left.object, { name: name })) {
                break;
            }
            // 利用已有的信息，将内容重建一个新的ObjectProperty节点，塞入对象声明里
            properties.push(t.ObjectProperty(left.property, right));
            next_sibling.remove();  // 删除原本的节点
        }
    }
}

exports.default = new BasePlug(
    'Object outside definition merge',
    visitor,
    '对象外部定义成员合并',
)


function demo(){
    const parser = _base.parser;
    const generator = _base.generator;
    var jscode = `
        var h = {};
        h["aaa"] = "hello wolrd";
        h["bbb"] = function (a,b){
        return a | b;
        }
    `;
    let ast = parser.parse(jscode);
    let local_plug = new BasePlug(
        'VariableDeclarator Identifier rename',
        visitor,
        '重命名混淆变量名',
    )
    local_plug.handler(ast)
    console.log(generator(ast)['code']);  // 使用 generator 得到修改节点后的代码
}
demo()