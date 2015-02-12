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
    this.ws = this.link("_clientConnected").send().data(function (err, data) {
        this.emit("data", err, data);
    }.bind(this));
};
