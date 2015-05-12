// Dependencies
var Pty = require("pty.js");

function Term(options) {
    var self = this;

    self.term = Pty.fork(process.env.SHELL, [], {
        cols: options.cols,
        rows: options.rows,
        cwd: options.cwd || process.env.HOME
    });

    self.term.on("data", function (data) {
        options.link.send(null, {
            type: "data",
            data: data
        });
    });

    self.term.on("close", function() {
        options.link.end();
        self.term.destroy();
    });
}

exports.termData = function (link) {
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
            case "resize":
                t && t.term.resize.apply(t.term, data.data);
                break;
        }
    });
};
