var $ = require("/jquery");
var Terminal = require("./term");

// Web Term plugin
$.fn.webTerm = function (mod) {
    var $self = this;
    var term = new Terminal.EventEmitter;
    var inherits = Terminal.inherits;

    term.updateSize = function () {
        var tSize = $(".terminal").textSize();
        term.w.cols = tSize.x || Terminal.geometry[0];
        term.w.rows = tSize.y || Terminal.geometry[1];

        term.socket.send(null, {
            type: "resize",
            data: [term.w.cols, term.w.rows]
        });

        term.tab.resize(term.w.cols, term.w.rows);
    };

    var _resizeTimer = null;
    $(window).on("resize", function () {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(term.updateSize, 100);
    });

    function openTerm() {
        term.socket = mod.link("_termComunication").send();

        // Initialize ui
        /// Create the window
        var win = term.w = new Terminal.EventEmitter;
        win.$ = $self;
        win.$.addClass("webTerm-window");

        win.bind = function () {
            win.$.on("mousedown", function(ev) {
                term.tab.focus();
            });
        };

        var $bar = $("<div>").addClass("bar");
        var $button = $("<div>").addClass("grip");
        var $title = $("<div>").addClass("title");

        $self.append($bar);
        $bar.append($title);

        /// Create the tab
        var tab = term.tab = Terminal.call(term, {
            cols: win.cols,
            rows: win.rows
        });

        term.socket.data(function(err, data) {
            if (err) return self._destroy();
            switch (data.type) {
                case "created":
                    $title.text(data.process);
                    term.emit("open tab", term);
                    term.emit("open");
                    term.updateSize();
                    break;
                case "data":
                    tab.write(data.data);
                    break;
            }
        });

        // Create the terminal
        term.socket.send(null, {
            type: "create",
            data: [win.cols, win.rows]
        });

        term.emit("connect");

        // Listen for data

        // Listen for kill event
        tab.open(win.$.get(0));
        tab.focus();
        tab.on("data", function (data) {
            term.socket.send({
                type: "data",
                data: data
            });
        });

        win.bind();

        term.emit("load");
        term.emit("open");
        term.updateSize();
    }

    // Open the terminal
    openTerm();
};
