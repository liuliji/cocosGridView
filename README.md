# cocosGridView
a gridView in  cocos creator
使用方式：
I. UI操作：
1. 在使用的时候，首先在页面中创建一个scrollView控件，然后，把GridView的脚本拖拽到scrollView控件上面。
2. 给scrollView添加一个scroll Event，将这个事件指定到GridView的onScrollingCb方法，该方法用来监听scrollView的滚动。
3. 将scorllView控件的view子节点拖拽到GridView的View属性上，将scrollView的content节点拖拽到GridView的scroll Content属性上面。
4. 在GridView的属性面板上指定Direction，该属性表示滚动视图的滚动方向。
5. 设置xMax或者yMax属性，表示水平最多或者垂直最多放几个item子控件。
6. 只有当Direction为VERTICAL的时候，才可以设置xMax，Direction为HORIZONTAL的时候，才可以设置yMax。
7. 将item的prefab拖拽到Grid Item Prefab属性上。
8. 至此，就完成了控件上面的设置。

II. 代码使用：
1. 在使用的时候，调用gridView的setDataArray方法，初始化数据，该方法需要传入3个字段：
    第一个字段 array 为数组类型，表示要传入的数据的数组；
    第二个字段 componentName 为字符串类型，表示调用item的哪个脚本；
    第三个字段 funcName 为字符串类型，表示脚本上的方法名字；
2. 如果想要让滚动视图滚动到指定位置，要调用scrollView的滚动方法。