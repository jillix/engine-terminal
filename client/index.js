var $ = require("/jquery");

exports.init = function () {

}

/**
 * initTerminal
 *
 * @name initTerminal
 * @function
 */
exports.redraw = function (str) {
    var self = this;
    str.data(function () {
        // TODO Redraw without reinit
        //exports.init.call(self);
        self._term = $(self._config.container).webTerm(self);
    });
};

/**
 * focus
 *
 * @name focus
 * @function
 */
exports.focus = function () {
    this._term.tab.focus();
};
