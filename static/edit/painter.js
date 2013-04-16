define(function (require, exports) {
    require('../lib/jquery.js');
    var listToTree = require('./util.js').listToTree;
    /**
     * Created with JetBrains PhpStorm.
     * User: yansunrong
     * Date: 13-3-31
     * Time: 下午2:06
     * To change this template use File | Settings | File Templates.
     */
    Raphael.fn.connection = function (obj1, obj2, line, bg) {
        if (obj1.line && obj1.from && obj1.to) {
            line = obj1;
            obj1 = line.from;
            obj2 = line.to;
        }
        var bb1 = obj1.getBBox(),
            bb2 = obj2.getBBox(),
            p = [
                {x: bb1.x + bb1.width / 2, y: bb1.y - 1},
                {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
                {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
                {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
                {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
                {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
                {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
                {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}
            ],
            d = {}, dis = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 4; j < 8; j++) {
                var dx = Math.abs(p[i].x - p[j].x),
                    dy = Math.abs(p[i].y - p[j].y);
                if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                    dis.push(dx + dy);
                    d[dis[dis.length - 1]] = [i, j];
                }
            }
        }
        if (dis.length == 0) {
            var res = [0, 4];
        } else {
            res = d[Math.min.apply(Math, dis)];
        }
        var x1 = p[res[0]].x,
            y1 = p[res[0]].y,
            x4 = p[res[1]].x,
            y4 = p[res[1]].y;
        dx = Math.max(Math.abs(x1 - x4) / 2, 10);
        dy = Math.max(Math.abs(y1 - y4) / 2, 10);
        var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
            y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
            x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
            y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
        var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
        if (line && line.line) {
            line.bg && line.bg.attr({path: path});
            line.line.attr({path: path});
        } else {
            var color = typeof line == "string" ? line : "#000";
            return {
                bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
                line: this.path(path).attr({stroke: color, fill: "none"}),
                from: obj1,
                to: obj2
            };
        }
    };


    function Painter(list) {
        var dragger = function () {
                $("#currentInput").hide();
                this.ox = (this.type == "rect" || this.type == "text") ? this.attr("x") : this.attr("cx");
                this.oy = (this.type == "rect" || this.type == "text") ? this.attr("y") : this.attr("cy");
                this.animate({"fill-opacity": .2}, 500);
            },
            move = function (dx, dy) {
                var att = (this.type == "rect" || this.type == "text") ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
                this.attr(att);
                this.text && this.text.attr(
                    {
                        x: this.attr("x") + 10,
                        y: this.attr("y") + 15
                    }
                );
                this.rect && this.rect.attr(
                    {
                        x: this.attr("x") - 10,
                        y: this.attr("y") - 15
                    }
                );
                for (var i = connections.length; i--;) {
                    r.connection(connections[i]);
                }
                r.safari();
            },
            up = function () {
                this.animate({"fill-opacity": 1}, 500);
            };

        listToTree(list);
        $("#holder").css({
            "position": "relative",
            "overflow": "auto"
        });


        var root = {"text": "", "level": 0, child: []};

        var firstLevelList = $.grep(list, function (item, i) {
            return (item.level == 1);
        });

        var maxLevel = -1;
        for (var i = 0; i < list.length; i++) {
            maxLevel = Math.max(list[i].level, maxLevel);
        }

        var totalWeight = 0;
        for (var i = 0; i < firstLevelList.length; i++) {
            totalWeight += firstLevelList[i].weight;
            firstLevelList[i].parent = root;
            root.child.push(firstLevelList[i]);
        }
        var height = 50 * totalWeight;
        var r = Raphael("holder", 120 * (maxLevel + 1), height),
            connections = [], rootShape = r.ellipse(10, 200, 10, 10);
        rootShape.attr({
            "fill": "270-#DAEDFF-#9BCDFF",
            "stroke": "#808E92",
            cursor: "move"
        });
        root.shape = rootShape;
        function renderNode(item, start, end) {
            var gapHeight = end - start;
            if (item.level != 0) {
                var shape = r.rect(120 * (item.level), start + (gapHeight / 2), 100, 35, 5);
                item.shape = shape;
                connections.push(r.connection(item.parent.shape, item.shape, "#808080"));
                shape.attr(
                    {
                        "fill": "270-#DAEDFF-#9BCDFF",
                        "stroke": "#808E92",
                        cursor: "move"
                    }
                );
            } else {
                shape = item.shape;
            }


            item.textNode = r.text(shape.attr("x") + 10, shape.attr("y") + 15, item.text);
            item.textNode.attr({
                font: "15px 微软雅黑",
                fill: '#000',
                "text-anchor": "start",
                "title": item.text,
//            "href": "http://baike.baidu.com",
                "target": "_blank",
                cursor: "move"
            });
            shape.text = item.textNode;
            shape.text.rect = shape;
            shape.drag(move, dragger, up);
            shape.text.drag(move, dragger, up);

            shape.text.dblclick(function (event) {
                var pos = $(event.srcElement).parent().position();
                pos.left += 4;
                pos.top += 6;
                $("#currentInput").focus().data("i", item.i).show().val(item.text).css(pos)
            });


            var totalWeight = 0;
            for (var i = 0; i < item.child.length; i++) {
                totalWeight += item.child[i].weight;
            }
            var currentStart = start;
            for (var i = 0; i < item.child.length; i++) {
                var child = item.child[i];
                var endY = currentStart + (child.weight / totalWeight * gapHeight)
                renderNode(child, currentStart, endY);
                currentStart += ((child.weight ) / totalWeight * gapHeight);
            }
        }

        renderNode(root, 20, height - 20);
        var currentInput = $('<input id="currentInput" type="text"/>').appendTo("#holder");
        currentInput
            .css({
                "position": "absolute",
                "width": "80px",
                "display": "none"
            })
            .blur(function (event) {
                var me = $(this);
                list[me.data("i")].text = me.val();
                me.hide()
                $('#holder').html('');
                Painter(list);
                DataEditor.data = list;
                DataEditor.render();
            })
            .keyup(function (event) {
                var me = $(this);
                event.keyCode == 13 && me.blur();
            });
    }
    exports.Painter = Painter;
})