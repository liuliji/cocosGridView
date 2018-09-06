
cc.Class({
    extends: cc.Component,

    properties: {
        stageLabel: cc.Label,// 当前是第几关的label显示
    },

    onLoad: function () {
        this.node.on('touchend', this.onStartGame.bind(this));
    },

    start() {

    },

    /**
     * 设置关卡信息
     * @param stageNum 关卡数，从0开始
     * @param starNum 当前的星级
     * @param stageInfo 通关条件以及关卡相关的信息
     */
    setStageInfo: function (data) {
        var stageNum = data.stageNum;
        var starNum = data.starNum;
        let stageInfo = data;
        this.stageInfo = stageInfo;
        this._stageNum = stageNum;
        this.stageLabel.string = '第' + (stageNum + 1) + '关';
    },

    // update (dt) {},
});
