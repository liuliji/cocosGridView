/**
 * !#en Enum for direction type.
 * !#zh 过渡类型
 * @enum GridView.Direction
 */
let Direction = cc.Enum({
    /**
     * !#en The vertical type.
     * !#zh 垂直滚动
     * @property {Number} VERTICAL
     */
    VERTICAL: 0,

    /**
     * !#en The horizontal type.
     * !#zh 水平滚动
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        _scrollView: cc.ScrollView,// 滚动视图
        /**
         * !#en direction type
         * !#zh 滚动视图的方向
         * @property {GridView.Direction} direction
         * @default GridView.Direction.VERTICAL
         */

        direction: {
            default: Direction.VERTICAL,
            type: Direction,
            notify() {
                // 在属性面板中，当方向修改的时候，调用该方法
                this._directionChanged();
            }
        },
        gridItemPrefab: cc.Prefab,// 每一关的按钮
        /**
         * !#en view of scrollView
         * !#zh 滚动视图里面的view
         */
        view: cc.Node,
        scrollContent: cc.Node,// 滚动式图的content

        xMax: {
            default: 1,// 水平最多放几个
            visible: true,// 是否可见
            // notify() {
            //     this._updateState();
            // }
        },
        yMax: {
            default: 1,// 垂直最多放几个
            visible: false,// 是否可见
            // notify() {
            //     this._updateState();
            // }
        },
        _yRealCount: 0,// y轴实际上存放了几个
    },

    onLoad() {
        this.onLoadStageConfig();
        let ary = [];
        for (var i = 0; i < 99; i++) {
            let stage = i;
            ary.push({
                'stageNum': stage,
                'starNum': 3,
            });
        }
        this.setDataArray(ary, 'GridViewItem', 'setStageInfo');
    },

    /**
     * 属性面板中，当方向修改的时候，调用该方法，
     * 用来控制x和y的最大显示
     */
    _directionChanged() {
        if (!this.target) {
            this.target = this.node;
        }
        // this._applyTarget();
        // this._updateState();
        cc.log('调用了该方法');
        if (this.direction == Direction.VERTICAL) {
            cc.Class.attr(this, "xMax", {
                visible: true,
            })
            cc.Class.attr(this, "yMax", {
                visible: false,
            })
        } else {
            cc.Class.attr(this, "xMax", {
                visible: false,
            })
            cc.Class.attr(this, "yMax", {
                visible: true,
            })
        }
    },


    //
    _updateState: function () {

    },


    // 关卡模式的配置
    onLoadStageConfig: function () {
        this.btnArray = [];// 保存按钮的数组
        this.stageInfoArray = [];// 用来保存数据的数组
        /** 
         * 这几个值，用来计算按钮的位置，以及实现复用功能
         */
        this.btnHeight = this.gridItemPrefab.data.height;// 按钮的高度
        this.btnWidth = this.gridItemPrefab.data.width;// 按钮的宽度
        this._scrollView = this.node.getComponent(cc.ScrollView);// 获取当前的scrollView
        this.svHeight = this.node.height;// 滚动视图的高度
        this.startY = this.svHeight / 2;// 滚动视图的content的初始内容
        if (this.direction == Direction.VERTICAL) {// vertical
            this.yMax = Math.ceil(this.view.height / this.btnHeight);
            this._yRealCount = this.yMax + 2;
        } else {// horizontal
            this.xMax = Math.ceil(this.view.width / this.btnWidth);
            this._yRealCount = this.xMax + 2;
        }
        // let events = this._scrollView.scrollEvents
        // var sv = this._scrollView;
        // this._scrollView.scrollEvents.push({
        //     component: "GridView",
        //     customEventData: "",
        //     handler: "onScrollingCb",
        //     target: sv.node,
        // });


    },

    /**
     * 设置数据数组
     * @param array 数据数组
     * @param componentName item上挂载的用来处理逻辑的脚本名字
     * @param funcName  对应的处理方法的名字
     */
    setDataArray: function (array, componentName, funcName) {
        if (!array) {
            return;
        }
        // 关卡模式，每一关的配置
        this.stageInfoArray = array;

        /**
         * 这里讲一下服用的逻辑：
         * 一个页面横向最多放4个按钮，纵向最多放5个，这是基本条件。
         * 然后，为了复用，多创建1行，也就是5 + 2 行。
         * 同时，还要判断按钮的数量，如果小于4 x (5 + 2)的话，就不需要考虑复用了，
         * 直接就有多少创建多少个。
         * 如果多余这个数值，就只创建 4 x (5 + 2) 个，这样的话，当滑动的时候，
         * 页面最多实际上能显示 4 x (5 + 2) 个，因为滑动的时候，会有半个的情况。
         */
        var sum = this.xMax * this._yRealCount;
        if (this.stageInfoArray.length < this.xMax * this._yRealCount) {
            sum = this.stageInfoArray.length;
        }
        var lineNum = 0;// 行数，表示当前创建到了第几行
        for (var i = 0; i < sum; i++) {
            let button = cc.instantiate(this.gridItemPrefab);
            let com = button.getComponent(componentName);// 根据名称，获取组件
            com.__cbFunc = null;// 回调方法
            let proto = com.__proto__;
            if (proto[funcName]) {
                com.__cbFunc = proto[funcName];
                com.__cbFunc(this.stageInfoArray[i]);
            }
            // this.btnArray.push(button);
            this.btnArray.push(com);
            let x = button.width * (i % this.xMax + 0.5) - this.scrollContent.width * this.scrollContent.anchorX;
            let y = -button.height * (0.5 + lineNum);
            button.setPosition(x, y);
            this.scrollContent.addChild(button);
            if ((i + 1) % this.xMax == 0) {// 该换行了
                lineNum += 1;
            }
        }
        this.scrollContent.height = this.btnHeight * Math.ceil(this.stageInfoArray.length / this.xMax);
    },

    // 监听滚动视图的滚动回调
    onScrollingCb: function (target, event) {
        // scrollView事件枚举类型地址：  http://docs.cocos.com/creator/api/zh/enums/ScrollView.EventType.html
        if (this.direction === Direction.VERTICAL) {
            var stageCount = this.stageInfoArray.length;
            /**
             * 如果复用的时候最多摆放的按钮数大等于关卡数，表示当前关卡比较少，
             * 是按照关卡数进行创建按钮的，所以，这个时候，不需要复用，
             * 所以什么都不处理
             */
            if (this.xMax * this._yRealCount >= stageCount) {
                return;
            }
            this.scrollContent.y;// 根据y值来判断
            // 移动到最底部了，就不再复用了
            if (this.scrollContent.y + this.startY + this.btnHeight > this.scrollContent.height) {
                return;
            }
            // 移动到了顶部，也不进行复用
            if (this.scrollContent.y < this.startY) {
                return;
            }
            var deltY = (this.scrollContent.y - this.startY);// y轴滑动的相对距离
            var deltLine = Math.floor(deltY / this.btnHeight);// 相对移动了多少行
            var canShowNumber = this.xMax * (this.yMax + deltLine);// 滑动过程中，实际上可以展示到多少个关卡

            var stageNumber = this.stageInfoArray.length;// 总共有多少的关卡
            var realNumber = 0;// 实际上展示出来的按钮数
            if (stageNumber > canShowNumber) {// 可以展示多少个和总共有多少个比较，谁小用谁
                realNumber = canShowNumber;
            } else {
                realNumber = stageNumber;
            }

            for (var i = 0; i < this._yRealCount; i++) {
                for (var j = 0; j < this.xMax; j++) {
                    let btnId = i * this.xMax + j;// 按钮在数组中的固定的Id
                    let stageId;// 表示当前是第几个按钮，同时，对应自己该关的数据的Id
                    let y;// y轴的坐标

                    var yuShu = 0;// 余数
                    var beiShu = 0;// 倍数

                    yuShu = deltLine % this._yRealCount;
                    beiShu = Math.floor(deltLine / this._yRealCount);

                    if (i < yuShu) {
                        var line = 0;
                        // stageId = line * this.xMax + j;
                        // y = -(line + 0.5) * this.btnHeight;
                        y = -((beiShu + 1) * this._yRealCount + i + 0.5) * this.btnHeight;
                        stageId = ((beiShu + 1) * this._yRealCount + i) * this.xMax + j;
                    } else {
                        y = -(beiShu * this._yRealCount + i + 0.5) * this.btnHeight;
                        stageId = (beiShu * this._yRealCount + i) * this.xMax + j;
                    }
                    if (stageId >= stageCount) {// 表示已经到了最后关，那么就不移动按钮了
                        continue;
                    }
                    // 设置按钮的y轴坐标
                    // let btn = this.btnArray[btnId];
                    let com = this.btnArray[btnId];
                    if (!com) {
                        continue;
                    }
                    if (com.node) {
                        com.node.setPositionY(y);
                    }
                    let info = this.stageInfoArray[stageId];
                    // 设置数据
                    let stageInfo = this.stageInfoArray[stageId];
                    if (com.__cbFunc) {
                        com.__cbFunc(stageInfo);
                    }
                }
            }
        }

    },


    // // 滚动到当前的关卡位置
    // scrollToCurrentStage: function() {
    //     setTimeout(() => {
    //         var stageCount = this.stageInfoArray.length;
    //         var playedCount = this.stageAry.length;
    //         var lines = Math.ceil(stageCount / this.xMax);
    //         var playedLines = 0;
    //         if (playedCount == stageCount) {
    //             playedLines == lines;
    //         } else {
    //             playedLines = Math.ceil(playedCount / 4 + 1);
    //         }
    //         if (playedLines <= this.yMax) {// 前几关，不动
    //             return;
    //         } else if (lines - playedLines > this.yMax / 2) {// 正常滚动
    //             let y = (playedLines - this.yMax / 2) * this.btnHeight;
    //             var offset = new cc.Vec2(0, y);
    //             this._scrollView.scrollToOffset(offset, 1.0);
    //         } else {// 直接滚动到底部
    //             this._scrollView.scrollToBottom(1.0);
    //         }
    //     }, 500);

    // },

    start() {

    },

    // 关闭按钮
    onClose: function () {

    },

    update(dt) {
    },
});
