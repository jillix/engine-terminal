
// numelle variabilei: link -> stream
// .send -> .write

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
        options.stream.write(null, {
            type: "data",
            data: data
        });
    });

    self.term.on("close", function() {
        options.stream.end();
        self.term.destroy();
    });
}

exports.termData = function (stream) {
    var t = null;
    // Listen for data
    stream.data(function (err, data) {
        if (!data) { return; }
        switch (data.type) {
            case "create":
                if (!Array.isArray(data.data)) {
                data.data = [];
            }

            t = new Term({
                cols: data.data[0],
                rows: data.data[1],
                stream: stream
            });

            stream.write(null, {
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
