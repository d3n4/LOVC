(function($) {
    $.extend_if_has = function(desc, source, array) {
        for (var i=array.length;i--;) {
            if (typeof source[array[i]] != 'undefined') {
                desc[array[i]] = source[array[i]];
            }
        }
        return desc;
    };
    $.fn.dterm = function(eval, options) {
        var op = $.extend_if_has({}, options,
            ['greetings', 'prompt',
                'history', 'clear',
                'exit', 'login',
                'name', 'keypress',
                'keydown', 'onExit',
                'onInit']);

        var term = this.append('<div/>').
            terminal(eval,op);
        if (!options.title) {
            options.title = 'JQuery Terminal Emulator';
        }
        if (options.logoutOnClose) {
            options.close = function(e, ui) {
                term.logout();
                term.clear();
            };
        } else {
            options.close = function(e, ui) {
                term.focus(false);
            };
        }
        var self = this;
        var dialog = this.dialog($.extend(options, {
            resize: function(e, ui) {
                var c = self.find('.ui-dialog-content');
                term.resize(c.width(), c.height());
            },
            open: function(e, ui) {
                term.focus();
            },
            closeOnEscape: false
        }));
        this.terminal = term;
        return this;
    };
})(jQuery);