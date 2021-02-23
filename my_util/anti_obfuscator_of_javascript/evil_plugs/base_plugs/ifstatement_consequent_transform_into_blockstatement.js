// 如果控制流语句主体没有{}，那么加上
const _base = require('./base');
const t = _base.t
const BasePlug = require("./base").default;
const visitor = {
    IfStatement(path){
        if(t.isBlockStatement(path.node.consequent))return;
        path.node.consequent = t.BlockStatement([path.node.consequent])
    }
}

exports.default = new BasePlug(
    'IfStatement consequent transform into BlockStatement',
    visitor,
    'if 语句体是单语句且无括号括起来时添加括号',
)


function demo(){
    const parser = _base.parser;
    const generator = _base.generator;
    var jscode = `
        var i = 0;
        for(; i<10; i++) i += 1;

        while(i<1) i += 1;

        if(i < 1) i += 1;
    `;
    let ast = parser.parse(jscode);
    let local_plug = new BasePlug(
        'IfStatement consequent transform into BlockStatement',
        visitor,
        'if 语句体是单语句且无括号括起来时添加括号',
    )
    local_plug.handler(ast)
    console.log(generator(ast)['code']);  // 使用 generator 得到修改节点后的代码
}
demo()