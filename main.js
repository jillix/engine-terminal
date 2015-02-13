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
    $("#terminal").webTerm(this);
};
