
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {
        var offset = new cc.Vec2(0, 300);
        // this.scrollView.scrollToOffset(offset, 1.0);
        let gridView = this.scrollView.getComponent('GridView');
        let ary = [];
        for (var i = 0; i < 99; i++) {
            let stage = i;
            ary.push({
                'stageNum': stage,
                'starNum': 3,
            });
        }
        gridView.setDataArray(ary, 'GridViewItem', 'setStageInfo');
    },

    // update (dt) {},
});
