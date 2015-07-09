var $ = require("/jquery");

/**
 * init
 * The init function.
 *
 * @name init
 * @function
 * @return {undefined}
 */
exports.init = function () {
    // Use config.container
    this._term = $(this._config.container).webTerm(this);
};

exports.focus = function () {
    this._term.tab.focus();
};
