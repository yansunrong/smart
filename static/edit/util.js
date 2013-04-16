define(function (require, exports) {
    /**
     * Created with JetBrains PhpStorm.
     * User: yansunrong
     * Date: 13-4-13
     * Time: 下午3:40
     * To change this template use File | Settings | File Templates.
     */
    /**
     *
     * list是一个列表，其中level表示级别，但是level不一定是连续的。
     * 比如level1后面，直接出现level3,怎么办？只要是level比当前行小，就是添加。
     *
     */
    /**
     *
     * @param list
     *
     * var list = [
     {text: '文字1', level: 1},
     {text: '文字1.1', level: 2},
     {text: '文字1.2', level: 2},
     {text: '文字1.3', level: 2},
     {text: '文字2', level: 1},
     {text: '文字2.1', level: 2},
     {text: '文字2.2', level: 2},
     {text: '文字2.2.1', level: 3},
     {text: '文字3', level: 1},
     ]

     * @return
     *     {
 *      1:[2:[{3:[]},{4:[]},{5:[]}],
 *      6:[]
 *      }
     */
    function listToTree(list) {
//    var result = [];
//    var prev = list[0];
//    var parent = result;
//    for (var i = 0; i < list.length; i++) {
//        var item = list[i];
//        result.push();
//
//        if (item.level < prev.level) {
//            if (prev[child]) {
//                prev.child = [];
//            }
//            prev.child.push(item);
//        }
//        if (item.level == prev.level) {
//            prev.parent.child.push(item);
//        }
//    }
        var maxLevel = -1;
        for (var i = 0; i < list.length; i++) {
            list[i].child = [];
            maxLevel = Math.max(list[i].level, maxLevel);
            list[i].weight = 1;
            list[i].i = i;
        }

        for (var i = maxLevel; i > 0; i--) {
            for (var j = list.length - 1; j >= 0; j--) {
                if (list[j].level == i) {//给它找个父亲，向上找一个level比它小的
                    var prev = list[j - 1];
                    for (var k = j - 1; k >= 0; k--) {
                        if (list[k].level < list[j].level) {
                            list[j].parent = list[k];
                            list[k].child.unshift(list[j]);
                            break;
                        }
                    }

                    if (list[j].child.length > 0) {
                    }

                }
            }
        }
        for (var i = maxLevel; i > 0; i--) {
            for (var j = list.length - 1; j >= 0; j--) {
                if (list[j].level == i) {//给它找个父亲，向上找一个level比它小的
                    if (list[j].child.length) {
                        for (var k = 0; k < list[j].child.length; k++) {
                            list[j].weight += list[j].child[k].weight;
                        }
                        list[j].weight--;
                    }
                }
            }
        }
//    console.log(list);
    }

    if (false) {
        var list = [
            {text: '文字1', level: 1},
            {text: '文字1.1', level: 2},
            {text: '文字1.2', level: 2},
            {text: '文字1.2.1', level: 3},
            {text: '文字1.2.2', level: 3},
            {text: '文字1.2.3', level: 3},
            {text: '文字2', level: 1},
            {text: '文字2.1', level: 2},
            {text: '文字2.2', level: 2},
            {text: '文字2.2.1', level: 3},
            {text: '文字3', level: 1}
        ]
        listToTree(list);

        for (var i = 0; i < list.length; i++) {
            console.log(list[i]);
        }
//console.log(list);

    }

    exports.listToTree = listToTree;
})