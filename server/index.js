// Dependencies
var Pty = require("pty.js");

function Term(options) {
    this.term = Pty.fork(process.env.SHELL, [], {
        name: options.name || "Browser Term",
        cols: options.cols,
        rows: options.rows,
        cwd: options.cwd || process.env.HOME
    });

    this.term.on("data", function (data) {
        options.link.send(null, {
            type: "data",
            data: data
        });
    });

    this.term.on("close", function() {
        options.link.end();
        t.term.destroy();
    });
}



/**
 * init
 * The init function.
 *
 * @name init
 * @function
 * @return {undefined}
 */
exports.init = function () {
    this.on("_termComunication", engine.flow(this, [{
        call: "createTerm"
    }]));
};

/**
 * _clientConnected
 * This function is called when a client is connected.
 *
 * @name _clientConnected
 * @function
 * @param {Object} link The link object.
 * @return {undefined}
 */
exports.createTerm = function (link) {
    var t = null;
    // Listen for data
    link.data(function (err, data) {
        if (!data) { return; }
        switch (data.type) {
            case "create":
                if (!Array.isArray(data.data)) {
                    data.data = [];
                }

                t = new Term({
                    cols: data.data[0],
                    rows: data.data[1],
                    link: link
                });

                link.send(null, {
                    type: "created"
                  , process: t.term.process
                });
                break;
            case "data":
                t && t.term.write(data.data);
                break;
            case "data":
                t && t.term.resize.call(t.term, data.data);
                break;
        }
    });
};
