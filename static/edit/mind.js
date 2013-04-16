/**
 * Created with JetBrains PhpStorm.
 * User: yansunrong
 * Date: 13-4-14
 * Time: 下午8:53
 * To change this template use File | Settings | File Templates.
 */
define(function (require) {
    var Painter = require("./painter.js").Painter;
    var list = [
        {text: '文字1', level: 1},
        {text: '文字1.1', level: 2},
        {text: '文字1.2', level: 2},
        {text: '文字1.2.1', level: 3},
        {text: '文字1.2.2', level: 3},
        {text: '文字1.2.3', level: 3},
        {text: '文字1.2.3.1', level: 4},
        {text: '文字1.2.3.2', level: 4},
        {text: '文字1.2.3.2.1', level: 5},
        {text: '文字1.2.3.2.2', level: 5},
        {text: '文字2', level: 1},
        {text: '文字2.1', level: 2},
        {text: '文字2.2', level: 2},
        {text: '文字2.2.1', level: 3},
        {text: '文字3', level: 1}
    ]
    Painter(list);
});