/*
    The MIT License (MIT)
    Copyright (c) 2014 Dirk Groenen
    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
*/

(function($){
    $.fn.viewportChecker = function(useroptions){
        // Define options and extend with user
        var options = {
            classToAdd: 'visible',
            classToRemove : 'invisible',
            classToAddForFullView : 'full-visible',
            removeClassAfterAnimation: false,
            offset: 100,
            repeat: false,
            invertBottomOffset: true,
            callbackFunction: function(elem, action){},
            scrollHorizontal: false,
            scrollBox: window
        };
        $.extend(options, useroptions);

        // Cache the given element and height of the browser
        var $elem = this,
            boxSize = {height: $(options.scrollBox).height(), width: $(options.scrollBox).width()};

        /*
         * Main method that checks the elements and adds or removes the class(es)
         */
        this.checkElements = function(){
            var viewportStart, viewportEnd;

            // Set some vars to check with
            if (!options.scrollHorizontal){
                viewportStart = Math.max(
                    $('html').scrollTop(),
                    $('body').scrollTop(),
                    $(window).scrollTop()
                );
                viewportEnd = (viewportStart + boxSize.height);
            }
            else{
                viewportStart = Math.max(
                    $('html').scrollLeft(),
                    $('body').scrollLeft(),
                    $(window).scrollLeft()
                );
                viewportEnd = (viewportStart + boxSize.width);
            }

            // Loop through all given dom elements
            $elem.each(function(){
                var $obj = $(this),
                    objOptions = {},
                    attrOptions = {};

                //  Get any individual attribution data
                if ($obj.data('vp-add-class'))
                    attrOptions.classToAdd = $obj.data('vp-add-class');
                if ($obj.data('vp-remove-class'))
                    attrOptions.classToRemove = $obj.data('vp-remove-class');
                if ($obj.data('vp-add-class-full-view'))
                    attrOptions.classToAddForFullView = $obj.data('vp-add-class-full-view');
                if ($obj.data('vp-keep-add-class'))
                    attrOptions.removeClassAfterAnimation = $obj.data('vp-remove-after-animation');
                if ($obj.data('vp-offset'))
                    attrOptions.offset = $obj.data('vp-offset');
                if ($obj.data('vp-repeat'))
                    attrOptions.repeat = $obj.data('vp-repeat');
                if ($obj.data('vp-scrollHorizontal'))
                    attrOptions.scrollHorizontal = $obj.data('vp-scrollHorizontal');
                if ($obj.data('vp-invertBottomOffset'))
                    attrOptions.scrollHorizontal = $obj.data('vp-invertBottomOffset');

                // Extend objOptions with data attributes and default options
                $.extend(objOptions, options);
                $.extend(objOptions, attrOptions);

                // If class already exists; quit
                if ($obj.data('vp-animated') && !objOptions.repeat){
                    return;
                }

                // Check if the offset is percentage based
                if (String(objOptions.offset).indexOf("%") > 0)
                    objOptions.offset = (parseInt(objOptions.offset) / 100) * boxSize.height;

                // Get the raw start and end positions
                var rawStart = (!objOptions.scrollHorizontal) ? $obj.offset().top : $obj.offset().left,
                    rawEnd = (!objOptions.scrollHorizontal) ? rawStart + $obj.height() : rawStart + $obj.width();

                // Add the defined offset
                var elemStart = Math.round( rawStart ) + objOptions.offset,
                    elemEnd = (!objOptions.scrollHorizontal) ? elemStart + $obj.height() : elemStart + $obj.width();

                if (objOptions.invertBottomOffset)
                    elemEnd -= (objOptions.offset * 2);

                // Add class if in viewport
                if ((elemStart < viewportEnd) && (elemEnd > viewportStart)){

                    // Remove class
                    $obj.removeClass(objOptions.classToRemove);
                    $obj.addClass(objOptions.classToAdd);

                    // Do the callback function. Callback wil send the jQuery object as parameter
                    objOptions.callbackFunction($obj, "add");

                    // Check if full element is in view
                    if (rawEnd <= viewportEnd && rawStart >= viewportStart)
                        $obj.addClass(objOptions.classToAddForFullView);
                    else
                        $obj.removeClass(objOptions.classToAddForFullView);

                    // Set element as already animated
                    $obj.data('vp-animated', true);

                    if (objOptions.removeClassAfterAnimation) {
                        $obj.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                            $obj.removeClass(objOptions.classToAdd);
                        });
                    }

                // Remove class if not in viewport and repeat is true
                } else if ($obj.hasClass(objOptions.classToAdd) && (objOptions.repeat)){
                    $obj.removeClass(objOptions.classToAdd + " " + objOptions.classToAddForFullView);

                    // Do the callback function.
                    objOptions.callbackFunction($obj, "remove");

                    // Remove already-animated-flag
                    $obj.data('vp-animated', false);
                }
            });

        };

        /**
         * Binding the correct event listener is still a tricky thing.
         * People have expierenced sloppy scrolling when both scroll and touch
         * events are added, but to make sure devices with both scroll and touch
         * are handles too we always have to add the window.scroll event
         *
         * @see  https://github.com/dirkgroenen/jQuery-viewport-checker/issues/25
         * @see  https://github.com/dirkgroenen/jQuery-viewport-checker/issues/27
         */

        // Select the correct events
        if( 'ontouchstart' in window || 'onmsgesturechange' in window ){
            // Device with touchscreen
            $(document).bind("touchmove MSPointerMove pointermove", this.checkElements);
        }

        // Always load on window load
        $(options.scrollBox).bind("load scroll", this.checkElements);

        // On resize change the height var
        $(window).resize(function(e){
            boxSize = {height: $(options.scrollBox).height(), width: $(options.scrollBox).width()};
            $elem.checkElements();
        });

        // trigger inital check if elements already visible
        this.checkElements();

        // Default jquery plugin behaviour
        return this;
    };
})(jQuery);
;
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function (root, jQuery) {
            if (jQuery === undefined) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
})(function ($) {
    $.fn.tilt = function (options) {

        /**
         * RequestAnimationFrame
         */
        var requestTick = function requestTick() {
            if (this.ticking) return;
            requestAnimationFrame(updateTransforms.bind(this));
            this.ticking = true;
        };

        /**
         * Bind mouse movement evens on instance
         */
        var bindEvents = function bindEvents() {
            var _this = this;
            $(this).on('mousemove', mouseMove);
            $(this).on('mouseenter', mouseEnter);
            if (this.settings.reset) $(this).on('mouseleave', mouseLeave);
            if (this.settings.glare) $(window).on('resize', updateGlareSize.bind(_this));
        };

        /**
         * Set transition only on mouse leave and mouse enter so it doesn't influence mouse move transforms
         */
        var setTransition = function setTransition() {
            var _this2 = this;

            if (this.timeout !== undefined) clearTimeout(this.timeout);
            $(this).css({ 'transition': this.settings.speed + 'ms ' + this.settings.easing });
            if (this.settings.glare) this.glareElement.css({ 'transition': 'opacity ' + this.settings.speed + 'ms ' + this.settings.easing });
            this.timeout = setTimeout(function () {
                $(_this2).css({ 'transition': '' });
                if (_this2.settings.glare) _this2.glareElement.css({ 'transition': '' });
            }, this.settings.speed);
        };

        /**
         * When user mouse enters tilt element
         */
        var mouseEnter = function mouseEnter(event) {
            this.ticking = false;
            $(this).css({ 'will-change': 'transform' });
            setTransition.call(this);

            // Trigger change event
            $(this).trigger("tilt.mouseEnter");
        };

        /**
         * Return the x,y position of the mouse on the tilt element
         * @returns {{x: *, y: *}}
         */
        var getMousePositions = function getMousePositions(event) {
            if (typeof event === "undefined") {
                event = {
                    pageX: $(this).offset().left + $(this).outerWidth() / 2,
                    pageY: $(this).offset().top + $(this).outerHeight() / 2
                };
            }
            return { x: event.pageX, y: event.pageY };
        };

        /**
         * When user mouse moves over the tilt element
         */
        var mouseMove = function mouseMove(event) {
            this.mousePositions = getMousePositions(event);
            requestTick.call(this);
        };

        /**
         * When user mouse leaves tilt element
         */
        var mouseLeave = function mouseLeave() {
            setTransition.call(this);
            this.reset = true;
            requestTick.call(this);

            // Trigger change event
            $(this).trigger("tilt.mouseLeave");
        };

        /**
         * Get tilt values
         *
         * @returns {{x: tilt value, y: tilt value}}
         */
        var getValues = function getValues() {
            var width = $(this).outerWidth();
            var height = $(this).outerHeight();
            var left = $(this).offset().left;
            var top = $(this).offset().top;
            var percentageX = (this.mousePositions.x - left) / width;
            var percentageY = (this.mousePositions.y - top) / height;
            // x or y position inside instance / width of instance = percentage of position inside instance * the max tilt value
            var tiltX = (this.settings.maxTilt / 2 - percentageX * this.settings.maxTilt).toFixed(2);
            var tiltY = (percentageY * this.settings.maxTilt - this.settings.maxTilt / 2).toFixed(2);
            // angle
            var angle = Math.atan2(this.mousePositions.x - (left + width / 2), -(this.mousePositions.y - (top + height / 2))) * (180 / Math.PI);
            // Return x & y tilt values
            return { tiltX: tiltX, tiltY: tiltY, 'percentageX': percentageX * 100, 'percentageY': percentageY * 100, angle: angle };
        };

        /**
         * Update tilt transforms on mousemove
         */
        var updateTransforms = function updateTransforms() {
            this.transforms = getValues.call(this);

            if (this.reset) {
                this.reset = false;
                $(this).css('transform', 'perspective(' + this.settings.perspective + 'px) rotateX(0deg) rotateY(0deg)');

                // Rotate glare if enabled
                if (this.settings.glare) {
                    this.glareElement.css('transform', 'rotate(180deg) translate(-50%, -50%)');
                    this.glareElement.css('opacity', '0');
                }

                return;
            } else {
                $(this).css('transform', 'perspective(' + this.settings.perspective + 'px) rotateX(' + (this.settings.disableAxis === 'x' ? 0 : this.transforms.tiltY) + 'deg) rotateY(' + (this.settings.disableAxis === 'y' ? 0 : this.transforms.tiltX) + 'deg) scale3d(' + this.settings.scale + ',' + this.settings.scale + ',' + this.settings.scale + ')');

                // Rotate glare if enabled
                if (this.settings.glare) {
                    this.glareElement.css('transform', 'rotate(' + this.transforms.angle + 'deg) translate(-50%, -50%)');
                    this.glareElement.css('opacity', '' + this.transforms.percentageY * this.settings.maxGlare / 100);
                }
            }

            // Trigger change event
            $(this).trigger("change", [this.transforms]);

            this.ticking = false;
        };

        /**
         * Prepare elements
         */
        var prepareGlare = function prepareGlare() {
            var glarePrerender = this.settings.glarePrerender;

            // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
            if (!glarePrerender)
                // Create glare element
                $(this).append('<div class="js-tilt-glare"><div class="js-tilt-glare-inner"></div></div>');

            // Store glare selector if glare is enabled
            this.glareElementWrapper = $(this).find(".js-tilt-glare");
            this.glareElement = $(this).find(".js-tilt-glare-inner");

            // Remember? We assume all css is already set, so just return
            if (glarePrerender) return;

            // Abstracted re-usable glare styles
            var stretch = {
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%'
            };

            // Style glare wrapper
            this.glareElementWrapper.css(stretch).css({
                'overflow': 'hidden',
                'pointer-events': 'none'
            });

            // Style glare element
            this.glareElement.css({
                'position': 'absolute',
                'top': '50%',
                'left': '50%',
                'background-image': 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
                'width': '' + $(this).outerWidth() * 2,
                'height': '' + $(this).outerWidth() * 2,
                'transform': 'rotate(180deg) translate(-50%, -50%)',
                'transform-origin': '0% 0%',
                'opacity': '0'
            });
        };

        /**
         * Update glare on resize
         */
        var updateGlareSize = function updateGlareSize() {
            this.glareElement.css({
                'width': '' + $(this).outerWidth() * 2,
                'height': '' + $(this).outerWidth() * 2
            });
        };

        /**
         * Public methods
         */
        $.fn.tilt.destroy = function () {
            $(this).each(function () {
                $(this).find('.js-tilt-glare').remove();
                $(this).css({ 'will-change': '', 'transform': '' });
                $(this).off('mousemove mouseenter mouseleave');
            });
        };

        $.fn.tilt.getValues = function () {
            var results = [];
            $(this).each(function () {
                this.mousePositions = getMousePositions.call(this);
                results.push(getValues.call(this));
            });
            return results;
        };

        $.fn.tilt.reset = function () {
            $(this).each(function () {
                var _this3 = this;

                this.mousePositions = getMousePositions.call(this);
                this.settings = $(this).data('settings');
                mouseLeave.call(this);
                setTimeout(function () {
                    _this3.reset = false;
                }, this.settings.transition);
            });
        };

        /**
         * Loop every instance
         */
        return this.each(function () {
            var _this4 = this;

            /**
             * Default settings merged with user settings
             * Can be set trough data attributes or as parameter.
             * @type {*}
             */
            this.settings = $.extend({
                maxTilt: $(this).is('[data-tilt-max]') ? $(this).data('tilt-max') : 20,
                perspective: $(this).is('[data-tilt-perspective]') ? $(this).data('tilt-perspective') : 300,
                easing: $(this).is('[data-tilt-easing]') ? $(this).data('tilt-easing') : 'cubic-bezier(.03,.98,.52,.99)',
                scale: $(this).is('[data-tilt-scale]') ? $(this).data('tilt-scale') : '1',
                speed: $(this).is('[data-tilt-speed]') ? $(this).data('tilt-speed') : '400',
                transition: $(this).is('[data-tilt-transition]') ? $(this).data('tilt-transition') : true,
                disableAxis: $(this).is('[data-tilt-disable-axis]') ? $(this).data('tilt-disable-axis') : null,
                axis: $(this).is('[data-tilt-axis]') ? $(this).data('tilt-axis') : null,
                reset: $(this).is('[data-tilt-reset]') ? $(this).data('tilt-reset') : true,
                glare: $(this).is('[data-tilt-glare]') ? $(this).data('tilt-glare') : false,
                maxGlare: $(this).is('[data-tilt-maxglare]') ? $(this).data('tilt-maxglare') : 1
            }, options);

            // Add deprecation warning & set disableAxis to deprecated axis setting
            if (this.settings.axis !== null) {
                console.warn('Tilt.js: the axis setting has been renamed to disableAxis. See https://github.com/gijsroge/tilt.js/pull/26 for more information');
                this.settings.disableAxis = this.settings.axis;
            }

            this.init = function () {
                // Store settings
                $(_this4).data('settings', _this4.settings);

                // Prepare element
                if (_this4.settings.glare) prepareGlare.call(_this4);

                // Bind events
                bindEvents.call(_this4);
            };

            // Init
            this.init();
        });
    };

    /**
     * Auto load
     */
    $('[data-tilt]').tilt();

    return true;
});
//# sourceMappingURL=tilt.jquery.js.map
;
jQuery(document).ready(function($) {
    // function cookie() {
    //     if ($.cookie('color') === 'purp') {
    //       $( 'body' ).addClass( 'purp' );
    //     }
    //     else if  ($.cookie('color') === 'yellow') {
    //       $( 'body' ).addClass( 'yellow' );
    //     }
    //     else if ($.cookie('color') === 'gray') {
    //       $( 'body' ).addClass( 'gray' );
    //     }
    // }
    // cookie();

    function effects() {
        $(".purp-btn").click(function(){
            $( 'body' ).removeClass('yellow gray cp_open').addClass( 'purp' );
            $.removeCookie('color', { path: '/' });
            $.cookie('color', 'purp', { path: '/' });
        });
        $(".yellow-btn").click(function(){
            $( 'body' ).removeClass('purp gray cp_open').addClass( 'yellow' );
            $.removeCookie('color', { path: '/' });
            $.cookie('color', 'yellow', { path: '/' });
        });
        $(".gray-btn").click(function(){
            $( 'body' ).removeClass('yellow purp cp_open').addClass( 'gray' );
            $.removeCookie('color', { path: '/' });
            $.cookie('color', 'gray', { path: '/' });
        });
        $(".reset-btn").click(function(){
            $( 'body' ).removeClass('yellow purp gray cp_open');
            $.removeCookie('color', { path: '/' });
        });

        $("#cp_icon_trigger").click(function(){
            $( 'body' ).addClass('cp_open');
        });
        $("#cp_backdrop").click(function(){
            $( 'body' ).removeClass('cp_open');
        });

        $(".showbtn").click(function(){
            var target = $(this).data('target');
            $(target).slideToggle();
        });
        $(".switchtogg").click(function(){
            var text = $(this).text();
            $(this).text(text == "Show more" ? "Show less" : "Show more");
            $('#webskills .skillbar,#designskills .skillbar').toggleClass('visible no_trans');
        });
        $(".menu-toggle").click(function(){
            $("body").toggleClass('menu-open');
        });
        $(".ceebounce").hover(
            function () {
                $('.ceebounce_head').removeClass('out').addClass('over');
            },
            function () {
                $('.ceebounce_head').removeClass('over').addClass('out');
            }
        );
    }
    effects();

    var isMobile = window.matchMedia("only screen and (max-width: 767px)");

    if (isMobile.matches) {
            $('.anim_parent').children().removeClass("hider");
            $('.anim,.anim_left,.anim_right,.anim_up').removeClass("hider");
    }
    else{
            // scroll_animations();
        }

    $(document).keydown(function(e) {
         var url = false;
         if (e.which == 37) {  // Left arrow key code
            url = $('.nav-box.previous a').attr('href');    }
         else if (e.which == 39) {  // Right arrow key code
            url = $('.nav-box.next a').attr('href');    }
         if (url) { window.location = url;   }
    });

    if ($("body").hasClass("page-id-507")) {
         $('.skillbar.vis').viewportChecker({
             classToAdd: 'visible',
             classToRemove: 'no_trans',
             removeClassAfterAnimation: false,
             offset: '0%',
             invertBottomOffset: true,
             repeat: false,
             callbackFunction: function(elem, action){},
             scrollHorizontal: false
         });
    }

    // Tilt.js Init
    function tiltInit(){
        var tilt = $('.js-tilt').tilt({
            maxTilt:        20,
            perspective:    900,   // Transform perspective, the lower the more extreme the tilt gets.
            easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
            scale:          1,      // 2 = 200%, 1.5 = 150%, etc..
            speed:          1000,    // Speed of the enter/exit transition.
            transition:     true,   // Set a transition on enter/exit.
            disableAxis:    null,   // What axis should be disabled. Can be X or Y.
            reset:          true,   // If the tilt effect has to be reset on exit.
            glare:          false,  // Enables glare effect
            maxGlare:       1       // From 0 - 1.
        });
    }

    // Tilt.js Init for Safari bug (without transitions)
    function tiltInitSafari(){
        var tilt = $('.js-tilt').tilt({
            maxTilt:        20,
            perspective:    900,   // Transform perspective, the lower the more extreme the tilt gets.
            easing:         "linear",    // Easing on enter/exit.
            scale:          1,      // 2 = 200%, 1.5 = 150%, etc..
            speed:          0,    // Speed of the enter/exit transition.
            transition:     false,   // Set a transition on enter/exit.
            disableAxis:    null,   // What axis should be disabled. Can be X or Y.
            reset:          false,   // If the tilt effect has to be reset on exit.
            glare:          false,  // Enables glare effect
            maxGlare:       1       // From 0 - 1.
        });
    }
    // Testing if is Safari or not 
    function isSafari(){
        if ( /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {

            //console.log('Its Safari');

            var body = $('body');
            $(body).addClass('browser_safari');
            tiltInitSafari();

        } else{

            tiltInit();
            // console.log('Its not Safari');

        }
    }
    isSafari();

    function mobileTouchHover(){
        $('body').on('touchstart', function() {});
    }
    mobileTouchHover();

});

( function() {
	var isWebkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
	    isOpera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
	    isIe     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( isWebkit || isOpera || isIe ) && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var id = location.hash.substring( 1 ),
				element;

			if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
				return;
			}

			element = document.getElementById( id );

			if ( element ) {
				if ( ! ( /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
})();
;
