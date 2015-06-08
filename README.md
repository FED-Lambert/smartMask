# smartMask, a hollowed mask maker

> *smartMask* 是基于[jQuery]的实现镂空遮罩的插件

### <a name="top"></a>目录
* [简介(Intro)](#intro)
* [示例(Demo)](#demo)
* [依赖(Require)](#require)
* [使用方法(Usage)](#usage)
* [参数列表(Config)](#config)
* [方法列表(API)](#api)
* [回调函数(Callback)](#callback)
* [已知问题(Issues)](#known-issues)
* [License](#license)


### <a name="intro"></a>简介(Intro) [[⬆]](#top)
smartMask是基于[jQuery]的实现镂空遮罩的插件，支持各种不规律的镂空组合。

### <a name="demo"></a>示例(Demo) [[⬆]](#top)
[Demo]

### <a name="require"></a>依赖(Require) [[⬆]](#top)
[jQuery]


### <a name="usage"></a>使用方法(Usage) [[⬆]](#top)
````
new SmartMask({
	// options
});
````
````
new SmartMask({
	wrap 	: '.wrapper',
	trigger : '.trigger'
});
````
````
new SmartMask({
	wrap 	: '.wrapper',
	trigger : '.trigger',
	config  : [
		// define the trigger group
	],
	afterShow : function(){
		// do something
	}
});
````


### <a name="config"></a>参数列表(Config) [[⬆]](#top)
|   参数(args)  |     说明(desc)    | 默认值(default) |  可填值(allowed) |
|--------------|-------------------|----------------|-----------------|
| wrap         | 父容器             | null(*)        |  selector       |
| trigger      | 触发遮罩层的元素     | null(*) 	    |  selector       |
| config       | 遮罩组合            | null           | Array           |
| maskClass    | 遮罩元素类名        | null           | String          |
| event        | 遮罩触发类型        | 'mouseover'    | 'mouseover'|'click'|'touch'|
| transition   | 是否使用过渡效果     | true           | true|false      |
| duration     | 过渡时长           | 400            | Number    	      |
| beforeShow   | 出现遮罩前的回调函数 | null           | Function        |
| afterShow    | 出现遮罩后的回调函数 | null           | Function        |
| beforeHide   | 隐藏遮罩前的回调函数 | null           | Function        |
| afterHide    | 隐藏遮罩前的回调函数 | null           | Function        |


### <a name="api"></a>方法列表(API) [[⬆]](#top)
|    方法(API)   |   说明(desc)  |   参数(args)   |
|---------------|---------------|---------------|
| show          | 触发第n个触发器 | Number(*)     |
| hide          | 隐藏全部遮罩    | null			|
| getTriggerList| 显示触发器列表 	| null          |
| setConfig     | 设置遮罩组合 	| null          |
| getConfig     | 显示遮罩组合 	| null          |


### <a name="callback"></a>回调函数(Callback) [[⬆]](#top)
|  回调函数(callback) |              说明(desc)              						|    参数(args)    		 |
|-------------------|-----------------------------------------------------------|------------------------|
| beforeShow   		| 显示遮罩前时触发，参数：触发器序号、遮罩组合定位信息、遮罩组合数组。 | index、location、member |
| afterShow    		| 显示遮罩后时触发，参数：同上。             						| index、location、member |
| beforeHide 		| 关闭遮罩前时触发，参数：同上。									| index、location、member |
| afterHide 		| 关闭遮罩后时触发，参数：同上。									| index、location、member |

### <a name="known-issues"></a>已知问题(Issues) [[⬆]](#top)


### <a name="license"></a>License [[⬆]](#top)
Released under [MIT] LICENSE


---
[jQuery]: http://www.jquery.com/
[Demo]: https://fed-lambert.github.io/smartMask/demo.html
[MIT]: http://rem.mit-license.org/