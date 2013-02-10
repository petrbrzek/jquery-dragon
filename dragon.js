// jquery.dragon.js
// ver. 0.1
// Petr Brzek


// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'dragon',
        defaults;

    // The actual plugin constructor
    function Dragon( element, options ) {
        // Pullbar $(this)
        this.$element = $(element);
        this.elementH = this.$element.height();
        this.elementPos = 0;
        this.mouseElPos = 0;
        this.$doc = $(document);
        this.docH = this.$doc.height();

        defaults = {
            limitTop : 0,
            limitBottom : this.docH - this.$element.height()
        };

        this.options = $.extend( {}, defaults, options );
        this.containerTop = this.options.containerTop;
        this.containerBottom = this.options.containerBottom;
        this.limitTop = parseInt(this.options.limitTop, 10);
        if (options.limitBottom !== undefined) {
            this.limitBottom = parseInt(this.docH - this.$element.height() - this.options.limitBottom, 10);
        }
        else {
            this.limitBottom = parseInt(this.options.limitBottom, 10);
        }
        

        // Init
        this.behavior();
    }

    Dragon.prototype.offsetTop = function (el) {
        return el.offset().top;
    };

    Dragon.prototype.off = function (ev) {
        this.$doc.off(ev);
    };

    Dragon.prototype.css = function (el, css, val) {
        return el.css(css, val + 'px');
    };

    Dragon.prototype.behavior = function () {
        var self = this;

        this.$element.on('mousedown', function (ev) {
            ev.preventDefault();
            self.elementPos = ev.pageY - self.offsetTop($(this));

            self.$doc.on('mousemove', function (ev) {
                self.mouseElPos = ev.pageY - self.elementPos;
                // Call borders
                self.borders();
            });

            $(window).on('mouseup blur resize', function () {
                self.off('mousemove');
                self.off('mouseup');
            });

            $(window).on('resize', function () {
                self.docH = self.$doc.height();
                self.limitBottom = parseInt(self.docH - self.$element.height() - self.options.limitBottom, 10);
            });

        });
    };

    Dragon.prototype.borders = function () {
        if (this.mouseElPos > this.limitTop) {
            this.css(this.$element, 'top', this.mouseElPos);
            // containerTop
            this.css(this.containerTop, 'height', this.mouseElPos);
            // containerBottom
            this.css(this.containerBottom, 'top', this.mouseElPos + this.elementH);
            
            if (this.mouseElPos > this.limitBottom) {
                this.css(this.$element, 'top', this.limitBottom);
                // containerTop
                this.css(this.containerTop, 'height', this.limitBottom);
                // containerBottom
                this.css(this.containerBottom, 'top', this.limitBottom + this.elementH);
            }
        }
        else if (this.mouseElPos <= this.limitTop) {
            this.css(this.$element, 'top', this.limitTop);
            this.css(this.containerTop, 'height', this.limitTop);
            this.css(this.containerBottom, 'top', this.limitTop + this.elementH);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Dragon( this, options ));
            }
        });
    };

})( jQuery, window, document );