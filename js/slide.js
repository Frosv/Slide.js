/**
 *by frosv
 *多图切换含有缩略图
 *使用绝对定位隐藏显示
 */

(function($) {
  var pluginName = 'slide';
  var defaults = {

    //默认配置
    bigWidth: 800,
    bigNum: 0,
    thumNum: 0,
    autoPlay: 'ture',
    delayTime: 0
  };

  function Plugin(element, options) {
    this.$window = $(window);
    this.$document = $(document);
    this.$element = $(element);
    this.options = $.extend({}, defaults, options); //后面覆盖前面

    this.imgNum = $(this.options.slideBox).find('img').length;
    this.btnName = this.options.slideNum;
    this.imgSrc = $(this.options.slideBox).find('img').map(function() {
      return this.src;
    });
    this.imgLength = $(this.options.picBox).find('ul li').length;
    this.thumLenth = $(this.options.thumBox).find('ul li').length;
    this.thumWidth = $(this.options.thumBox).find('ul li').outerWidth(true);

    this.init();
  };

  Plugin.prototype.init = function() {
    $(this.options.thumBox).find('ul').width(this.thumLenth * this.thumWidth);
    $(this.options.imgTotal).html(this.imgLength);
    var bigNum = this.options.bigNum;
    var thumNum = this.options.thumNum;
    var _this = this;
    $(this.options.thumBox).find('li').on('click', function(event) {
      var numIndex = $(_this.options.thumBox).find('li').index(this);
      bigNum = thumNum = numIndex;
      _this.showBig(bigNum);
      _this.showThum(bigNum);

      bigNum++;
      $(_this.options.nowImg).html(bigNum);

    }).eq(this.options.order).trigger('click');
    this.bindEvent();
    this.autoPlay();


  };

  Plugin.prototype.bindEvent = function() {
    //大图按钮
    var perv = this.options.prev;
    var next = this.options.next;
    //小图按钮
    var thumPrev = this.options.thumPrev;
    var thumNext = this.options.thumNext;
    // console.log(thumPrev);
    // console.log(next);
    var close = this.options.close;

    //改变上下文，将function中的this指向全局this
    //大图按钮事件绑定
    this.$element.on('click', next, $.proxy(this.nextEvent, this));
    this.$element.on('click', perv, $.proxy(this.prevEvent, this));
    //小图按钮事件绑定
    this.$element.on('click', thumNext, $.proxy(this.nextEvent, this));
    this.$element.on('click', thumPrev, $.proxy(this.prevEvent, this));
    //关闭按钮
    this.$element.on('click', close, $.proxy(this.closeEvent, this));
    // this.$element.on('click', close, $.proxy(this.closeEvent, this));
  };

  Plugin.prototype.autoPlay = function() {
    // console.log(this);
    if (this.options.autoPlay == 'ture') {
      // console.log(this);
      var _this = this;
      setInterval(function() {
        // console.log(this);
        var flag = $(_this.options.picBox).find('ul').data('num');
        // console.log(flag);
        _this.showBig(flag);
        _this.showThum(flag);
        flag++;
        // console.log(_this.imgLength);
        if (flag == _this.imgLength) {
          flag = 0;
          // console.log(flag);
        }
        $(_this.options.picBox).find('ul').data('num', flag);
      }, _this.options.interTime);
    }
  };

  Plugin.prototype.prevEvent = function(event) {

    // console.log('prev');
    // var bigNum = $(this.options.nowImg).html();
    var flag = $(this.options.picBox).find('ul');
    var bigNum = $(flag).data('num');
    // console.log(bigNum);
    bigNum--;
    if (bigNum == 0) {
      bigNum = this.imgLength;
    }
    bigNum--;
    this.showBig(bigNum);
    this.showThum(bigNum);
    bigNum++;
    $(flag).data('num', bigNum);
  };

  Plugin.prototype.nextEvent = function() {

    // console.log('next');
    var flag = $(this.options.picBox).find('ul');
    var bigNum = $(flag).data('num');
    if (bigNum == this.imgLength) {
      bigNum = 0
    }
    this.showBig(bigNum);
    this.showThum(bigNum);
    bigNum++;
    $(flag).data('num', bigNum);
  };

  Plugin.prototype.closeEvent = function() {
    // $(this.options.box).css('display', 'none');
  };

  Plugin.prototype.showBig = function(bigNum) {
    // console.log()
    $(this.options.picBox).find('ul li').eq(bigNum).fadeIn(this.options.delayTime).siblings('li').fadeOut(this.options.delayTime);
    $(this.options.thumBox).find('li').eq(bigNum).addClass('on').siblings(this).removeClass('on');
  };

  Plugin.prototype.showThum = function(thumNum) {
    // console.log(thumNum);
    var displayNum = thumNum - this.options.displayThum + 2;
    var displayWidth = -displayNum * this.thumWidth;
    // console.log(displayWidth);

    $(this.options.thumBox).find('ul li').css('float', 'left');
    if (this.thumLenth > this.options.displayThum) {
      if (thumNum < 4) {
        displayWidth = 0;
      } else if (thumNum == this.thumLenth - 1) {
        displayWidth = -(displayNum - 1) * this.thumWidth;
      }

      $(this.options.thumBox).find('ul').stop().animate({ 'left': displayWidth }, this.options.delayTime);
    }
  };

  $.fn[pluginName] = function(options) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function() {
      var $this = $(this),
        data = $this.data('plugin_' + pluginName);

      if (!data) {
        $this.data('plugin_' + pluginName, (data = new Plugin(this, options)));
      }

      if (typeof options === 'string') {
        data[options].apply(data, args);
      }
    });
  };

})(jQuery);

$('#demo1').slide({
  box: "#demo1", //总框架

  picBox: "#picBox", //大图框架
  thumBox: "#thumBox", //小图框架
  pop_div: "#demo2", //弹出框框架(未更新)

  prev: "#prev", //大图左箭头
  next: "#next", //大图右箭头

  thumPrev: "#thumPrev", //小图左箭头
  thumNext: "#thumNext", //小图右箭头

  pop_prev: "#prev2", //弹出框左箭头(未更新)
  pop_next: "#next2", //弹出框右箭头(未更新)

  pop_pic: "#ban_pic2", //弹出框图片框架(未更新)
  pop_xx: ".pop_up_xx", //关闭弹出框按钮(未更新)

  mhc: ".mhc", //朦灰层(未更新)

  autoplay: true, //是否自动播放

  interTime: 5000, //图片自动切换间隔
  delayTime: 400, //切换一张图片时间

  pop_up: true, //大图是否有弹出框(未更新)
  pop_delayTime: 400, //弹出框切换一张图片时间(未更新)

  picdire: true, //大图滚动方向（true为水平方向滚动）(未更新)
  mindire: true, //小图滚动方向（true为水平方向滚动）(未更新)

  order: 0, //当前显示的图片
  displayThum: 5 //小图显示数量
});
