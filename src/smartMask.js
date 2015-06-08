/*!
 *  Project: smarkMask
 *  Description: 智能遮罩
 *  Version : 1.0.0.20150606
 *  Author: Lixinliang
 *  License:
 *  Include: jQuery (http://www.jquery.com/)
 */
!function ( global, factory ) {
    if (typeof define == 'function') {
        define('smartMask', ['jquery'], function () {
        	return factory(jQuery)
        })
    } else {
        global['SmartMask'] = factory(jQuery)
    }
}(this, function ( $ ) {
	var handle = ['show','hide','getTriggerList','setConfig','getConfig'];
	var option = {
		maskClass	: '',
		event		: 'mouseover',
		transition  : true,
		duration 	: 400,
		beforeShow  : function(){},
		afterShow   : function(){},
		beforeHide  : function(){},
		afterHide   : function(){},
		config		: []
	};
	function smarkMask ( conf ) {
		this.maskClass = conf.maskClass;
		this.event = conf.event;
		this.transition = conf.transition;
		this.duration = conf.duration;
		if (!this.transition) {
			this.duration = 0;
		}
		this.easing = conf.easing;
		this.animating = false;
		this.beforeShow = conf.beforeShow;
		this.afterShow = conf.afterShow;
		this.beforeHide = conf.beforeHide;
		this.afterHide = conf.afterHide;
		this.wrap = $(conf.wrap);
		this.offset = this.wrap.offset();
		this.top = 0;
		this.left = 0;
		if (this.wrap.css('position') === 'static') {
			var offset = this.wrap.offsetParent().offset();
			this.top = this.offset.top - offset.top;
			this.left = this.offset.left - offset.left;
		}
		this.width = this.wrap.width();
		this.height = this.wrap.height();
		this.trigger = this.wrap.find($(conf.trigger));
		this.trigger.selector = $(conf.trigger).selector;
		this.place = {
			member : [],
			location : {}
		}
		this.mask = $();
		this.maskIndex = 0;
		this.base = $('<div>').css({
			background:'#000',
			opacity:'0.7',
			position:'absolute',
			display:'none'
		}).addClass(conf.maskClass);
		this.grid = {
			x : [],
			y : []
		}
		this.setConfig(conf.config);
		this.on();
	}
	var prototype = {
		getIndex : function ( trigger ) {
			var ret = -1;
			this.trigger.each(function ( index, each ) {
				if (trigger === each) {
					ret = index;
					return false
				}
			})
			return ret
		},
		show : function ( index ) {
			if (typeof index == 'undefined' || typeof this.index != 'undefined') {
				return
			}
			this.index = index;
			var brother = this.getBrother(index);
			this.mask.css({width:0,height:0});
			this.beforeShow.call(this.trigger.eq(index)[0], index, this.place.location, brother);
			this.setPlaceMember(index);
			this.setPlaceLocation();
			this.showMask();
		},
		hide : function () {
			if (typeof this.index == 'undefined') {
				return
			}
			var index = this.index;
			var brother = this.getBrother(index);
			this.beforeHide.call(this.trigger.eq(index)[0], index, this.place.location, brother);
			this.clearPlace();
			this.hideMask();
		},
		getBrother : function ( index ) {
			var self = this;
			var length = this.trigger.length;
			var ret = [];
			if (this.book[index] >= 0) {
				$(this.config[this.book[index]]).each(function ( index, each ) {
					if (each < length) {
						ret.push(self.trigger.eq(each));
					}
				})
			} else {
				ret.push(this.trigger.eq(index));
			}
			return ret
		},
		setPlaceMember : function ( index ) {
			var self = this;
			function getOffset ( direction ) {
				return Math.round(this.offset()[direction] - self.offset[direction])
				// return Math.floor(this.offset()[direction] - self.offset[direction])
			}
			$(this.getBrother(index)).each(function ( index, each ) {
				self.place.member.push({
					top    : getOffset.call(each, 'top'),
					left   : getOffset.call(each, 'left'),
					width  : each.width(),
					height : each.height()
				})
			})
		},
		setPlaceLocation : function () {
			var top = [this.height];
			var left = [this.width];
			var right = [0];
			var bottom = [0];
			var self = this;
			$(this.place.member).each(function ( index, each ) {
				top.push(each.top);
				left.push(each.left);
				right.push(each.left + each.width);
				bottom.push(each.top + each.height);
				self.grid.x.push(each.left, each.left + each.width);
				self.grid.y.push(each.top, each.top + each.height);
			})
			function min ( list ) {
				return Math.min.apply(null, list)
			}
			function max ( list ) {
				return Math.max.apply(null, list)
			}
			var location = {
				top		: max([min(top),0]),
				left	: max([min(left),0]),
				right	: min([max(right),this.width]),
				bottom	: min([max(bottom),this.height])
			}
			location.width = location.right - location.left;
			location.height = location.bottom - location.top;
			this.place.location = location;
			if (this.place.member.length > 1) {
				this.fixGrid();
			}
		},
		clearPlace : function () {
			this.place.member = [];
		},
		fixGrid : function () {
			function sort( m, n ) {
				return m - n;
			}
			this.grid.x.sort(sort);
			this.grid.y.sort(sort);
			var self = this;
			var gridPiece = [];
			var gridOffset = [];
			gridPiece.length = this.grid.x.length - 1;
			$(gridPiece).each(function ( i ) {
				var temp = [];
				temp.length = self.grid.y.length - 1;
				$(temp).each(function ( j ) {
					temp[j] = true;
				})
				gridPiece[i] = temp;
			})
			function getIndex ( val, axis ) {
				var list = self.grid[axis];
				for (var i = list.length - 1; i >= 0; i--) {
					if (list[i] == val) {
						return i;
					}
				}
				return -1
			}
			$(this.place.member).each(function ( index, each ) {
				gridOffset.push({
					x : {
						min : getIndex(each.left, 'x'),
						max : getIndex(each.left + each.width, 'x')
					},
					y : {
						min : getIndex(each.top, 'y'),
						max : getIndex(each.top + each.height, 'y')
					}
				})
			})
			$(gridOffset).each(function ( index, each ) {
				for (var i = each.y.min, j = each.y.max; i < j; i++) {
					for (var m = each.x.min, n = each.x.max; m < n; m++) {
						gridPiece[i][m] = false;
					}
				}
			})
			$(gridPiece).each(function ( index, each ) {
				var top = self.grid.y[index];
				var left = self.grid.x[0];
				var right = left;
				var bottom = self.grid.y[index+1];
				for (var i = 0; i < each.length; i++) {
					if (each[i]) {
						right = self.grid.x[i+1];
					} else {
						makeGrid(top, bottom, left, right);
						left = self.grid.x[i+1];
						right = left;
					}
				};
				makeGrid(top, bottom, left, right);
			})
			function makeGrid( top, bottom, left, right ) {
				top    = top < 0 ? 0 : top;
				left   = left < 0 ? 0 : left;
				right  = right > self.width ? self.width : right;
				bottom = bottom > self.height ? self.height : bottom;
				self.makeMask(self.top + top, self.left + left, right - left, bottom - top);
			}
		},
		makeMask : function ( top, left, width, height ) {
			if (width === 0 || height === 0) {
				return
			}
			if (this.maskIndex >= this.mask.length) {
				this.mask = this.mask.add(this.base.clone());
				this.wrap.append(this.mask.last());
			}
			this.mask.eq(this.maskIndex).css({top:top,left:left,width:width,height:height});
			this.maskIndex++;
		},
		showMask : function () {
			var self = this;
			var box = this.place.location;
			this.makeMask(this.top, box.left, box.width, box.top);
			this.makeMask(this.top, box.right, this.width-box.right, this.height);
			this.makeMask(this.top + box.bottom, box.left, box.width, this.height-box.bottom);
			this.makeMask(this.top, this.left, box.left, this.height);
			this.animating = true;
			this.mask.first().fadeIn(this.duration, function () {
				var index = self.index;
				var brother = self.getBrother(index);
				self.animating = false;
				self.afterShow.call(self.trigger.eq(index)[0], index, self.place.location, brother);
			});
			this.mask.slice(1).fadeIn(this.duration);
			this.maskIndex = 0;
		},
		hideMask : function () {
			var self = this;
			this.grid = {x:[], y:[]};
			this.animating = true;
			this.mask.first().fadeOut(this.duration, function () {
				var index = self.index;
				var brother = self.getBrother(index);
				self.animating = false;
				self.afterHide.call(self.trigger.eq(index)[0], index, self.place.location, brother);
				self.index = undefined;
			});
			this.mask.slice(1).fadeOut(this.duration);
		},
		on : function () {
			var self = this;
			var visibility = false;
			if (this.event == 'mouseover') {
				this.wrap.on(this.event, this.trigger.selector, function ( e ) {
					if (visibility) {
						return false;
					}
					self.show(self.getIndex(this));
					visibility = true;
				}).on('mouseout', this.trigger, function ( e ) {
					if (!visibility) {
						return false;
					}
					self.hide();
					visibility = false;
				})
			} else if (this.event == 'click' || this.event == 'touch') {
				this.wrap.on(this.event, this.trigger.selector, function ( e ) {
					// if (self.animating) {
					// 	return false
					// }
					if (visibility) {
						visibility = false;
						self.hide();
					} else {
						self.show(self.getIndex(this));
						visibility = true;
					}
				})
			}
		},
		getTriggerList : function () {
			return this.trigger
		},
		setConfig : function ( config ) {
			if ($.isArray(config)) {
				var self = this;
				this.config = config;
				this.book = [];
				var length = this.trigger.length;
				for (var i = 0; i < length; i++) {
					this.book.push(-1);
				}
				$(config).each(function ( index, each ) {
					$(each).each(function ( ignore, value ) {
						if (value < length) {
							self.book[value] = index;
						}
					})
				})
			}
		},
		getConfig : function () {
			return this.config
		}
	}
	for (var i in prototype) {
		smarkMask.prototype[i] = prototype[i];
	}
	return function ( conf ) {
		function error ( sub ) {
			throw new Error('smartMask require a correct ' + sub + ' selector');
		}
		if (!$(conf.wrap).length) {
			error('wrap');
		}
		if (!$(conf.wrap).find($(conf.trigger)).length) {
			error('trigger');
		}
		var plugin = new smarkMask($.extend({}, option, conf));
		var ret = {};
		for (var i = 0, l = handle.length; i < l; i++) {
			ret[handle[i]] = (function ( name ) {
				var ret = plugin[name].apply(plugin, Array.prototype.slice.call(arguments, 1))
				return typeof ret === 'undefined' ? this : ret;
			}).bind(ret, handle[i]);
		}
		ret.plugin = plugin;
		return ret;
	}
})