/**
 * Created with JetBrains PhpStorm.
 * User: yansunrong
 * Date: 13-3-30
 * Time: 下午9:58
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports) {
    require("jquery");
    require("jquery.ui");
    var Painter = require("./painter.js").Painter;
    DataEditor = {
        init: function (data) {
            this.data = data;
            this.isAutoRefresh = true;//及时预览开关
            this.container = $('#data-list-ul');
            this.bindEvent();
            this.render();
        },
        render: function () {
            this.generateIndex();
            var me = this;
            var inputTpl = '<li class="level#{level}" data-index="#{index}"><input type="text" placeholder="请输入内容" data-index="#{index}" data-level="#{level}" value="#{text}"/>' +
                '<span class="input-tool"><a class="btn btn-mini move" title="按住我拖拽排序"><i class="icon-move"></i></a>' +
                '<a class="btn btn-mini indent-left" title="减少缩进，也可以使用tab"><i class="icon-indent-left"></i></a>' +
                '<a class="btn btn-mini indent-right" title="增加缩进，也可以使用shift+tab"><i class="icon-indent-right"></i></a>' +
                '</span></li>';
            var html = '';
            $.each(this.data, function (i, item) {
                item.index = i;
                html += me.format(inputTpl, item);
            })
            this.container.html(html);
            //预览
            this.isAutoRefresh && this.preview();
        },
        generateIndex: function () {

        },
        bindEvent: function () {
            var me = this;
            this.container.on('keydown', 'input', $.proxy(this.handleKeyUp, this))
            this.container.on('keyup', 'input', $.proxy(this.handleInputChange, this));
            this.container.on('blur', 'input', function () {
                me.preview()
            });
            this.container.on('click', '.input-tool', $.proxy(this.handleToolBtns, this));
            $('#preview').click($.proxy(this.preview, this))
            this.container.sortable({
                opacity: 0.5,
                axis: "y",
                cursor: "move",
                handle: '.move',
                items: "> li",
                stop: $.proxy(function (event, ui) {
                    this.refreshDomToData();
                    this.render();
                }, this)
            });
            $('#auto-refresh-box').change(function (event) {
                me.isAutoRefresh = $(this).attr("checked") == 'checked';
            });
        },
        handleKeyUp: function (event) {
            var dataIndex = $(event.target).attr('data-index');
            var needRender = false;
            switch (event.keyCode) {
                case 13://新增一行
                    var newIndex = this.addItem(dataIndex);
                    needRender = true;
                    break;
                case 9://缩进
                    var newIndex = this.indent(dataIndex, event.shiftKey);
                    needRender = true;
                    break;
            }
            if (needRender) {
                this.render();
                this.container.find('[data-index="' + newIndex + '"]').focus();
                event.stopPropagation();
                event.preventDefault();
            }
        },
        handleInputChange: function (event) {
            var target = $(event.target);
            var dataIndex = target.attr('data-index');
            this.data[dataIndex].text = target.val();
            this.preview();
        },

        handleToolBtns: function (event) {
            var target = (event.target.tagName.toLowerCase() == 'i') ?
                $(event.target).parent() : $(event.target);
            var dataIndex = target.parent().parent().attr('data-index');
            if (target.hasClass('indent-left')) {
                this.indent(dataIndex, true);
                this.render();
            }
            if (target.hasClass('indent-right')) {
                this.indent(dataIndex);
                this.render();
            }
        },
        refreshDomToData: function () {
            //var inpus = $.makeArray(this.container.find('input'));
            this.data = this.container.find('input').map(function (i, input) {
                var ipt = $(input);
                return {text: ipt.val(), level: ipt.attr("data-level")}
            });
        },
        //在指定索引的位置下方，添加新项，level与前的相同
        addItem: function (index) {
            var currentItem = this.data[index];
            var newItem = {'text': '', level: currentItem.level};
            this.data.splice(++index, 0, newItem);
            return index;
        },
        //缩进当前的item
        indent: function (index, dir) {
            var currentItem = this.data[index];
            if (dir) {
                (currentItem.level > 0) && (--currentItem.level);
            } else {
                currentItem.level++;
            }
            return index;
        },
        //取自tangram的format，用于格式化输出
        format: function (str, data) {
            return str.replace(/#\{(.+?)\}/g, function (match, key) {
                var replacer = data[key];
                // chrome 下 typeof /a/ == 'function'
//                if ('[object Function]' == toString.call(replacer)) {
//                    replacer = replacer(key);
//                }
                return ('undefined' == typeof replacer ? '' : replacer);
            });
        },
        preview: function () {
            $('#holder').html('');
            Painter(this.data);
        }
    }


//    DataEditor.init(list);
    exports.DataEditor = DataEditor;
})