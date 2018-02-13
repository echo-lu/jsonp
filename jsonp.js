(function(window,document) {
    var count = 0;
    var JSONP = function(config) {
        this.url = config.url;

            this.options = config.data || {};
            this.fn = config.callback;

        this.getJSONP();
    };
    JSONP.prototype = {
        // 时间戳，避免浏览器缓存
        now:function() {
            return (new Date()).getTime();
        },
        // 删除节点
        removeElem:function(elem) {
            var parent = elem.parentNode;
            if(parent && parent.nodeType !== 11) {
                parent.removeChild(elem);
            }
        },
        // 拼接url参数
        parseParam:function() {
            var param="",data = this.options;
            if("string" === typeof data) {
                param = data;
            }else if("object" === typeof data) {
                for(var item in data) {
                    param += "&" + item + "=" + encodeURIComponent(data[item]);
                }
            }
            param += "&_stamp=" + this.now();
            return param;
        },

        getJSONP:function() {
            var id = (this.options.name || '__jp') + (count++);
            this.url += "?";
            this.url +=  this.parseParam();
            this.url = this.url.replace('?&', '?');
            if(this.fn) {
                this.url += "&callback=" + this.fn;
            }
            // 创建一个script元素
            var script = document.createElement("script");
            script.type = "text/javascript";
            // 设置要远程的url
            script.src = this.url;
            // 设置id，为了后面可以删除这个元素
            script.id = id;
            var _this = this;
             // 把传进来的函数重新组装，并把它设置为全局函数，远程就是调用这个函数
            window[id] = function(json) {
                // 执行这个函数后，要销毁这个函数
                window[id] = undefined;
                // 获取这个script的元素
                var elem = document.getElementById(id);
                // 删除head里面插入的script，这三步都是为了不影响污染整个DOM啊
                _this.removeElem(elem);
                // 执行传入的的函数
                _this.fn(json);
            };

            // 在head里面插入script元素
            var head = document.getElementsByTagName("head");
            if(head && head[0]) {
                head[0].appendChild(script);
            }
        }

    };
    window.JSONP = JSONP;
}(window,document));