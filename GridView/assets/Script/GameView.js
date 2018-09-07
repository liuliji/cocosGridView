
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var offset = new cc.Vec2(0, 300);
        // this.scrollView.scrollToOffset(offset, 1.0);
    },

    start() {

    },

    // update (dt) {},
});
