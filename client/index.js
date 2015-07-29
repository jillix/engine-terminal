// redraw; focus
var Terminal = require("./term");

exports.init = function () {
    var self = this;
    var targetDOM = document.querySelector(self._config.target || ".web-term");
    if (!targetDOM) {
        return self.log("E", "No DOM target found for terminal");
    }

    // Create terminal instance
    self.term = new Terminal.EventEmitter;

    var _resizeTimer = null;

    window.onresize = function () {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(function (){
            updateSize(term);
        }, 100);
    }

    // old code; question about code variants
    // window.addEventListener("resize", function () {
    //     clearTimeout(_resizeTimer);
    //     _resizeTimer = setTimeout(function (){
    //         updateSize(term);
    //     }, 100);
    // });
    //
    // $(window).on("resize", function () {
    //     clearTimeout(_resizeTimer);
    //     _resizeTimer = setTimeout(function (){
    //         updateSize(term);
    //     }, 100);
    // });

    var term = self.term;

    term.socket = mod.flow("termData");

    // Initialize ui
    /// Create the window
    targetDOM.classList.add("webTerm-window");

    term.bind = function () {
        targetDOM.onmousedown (function(ev) {
            term.tab.focus();
        })
        // old code;
        // targetDOM.on("mousedown", function(ev) {
        //     term.tab.focus();
        // });
    };

    // TODO ask Johnny what is this about
    // var $bar = $("<div>").addClass("bar");
    // var $button = $("<div>").addClass("grip");
    // var $title = $("<div>").addClass("title");
    //
    // $self.append($bar);
    // $bar.append($title);

    // Create the tab
    var tab = term.tab = Terminal.call(term, {
        cols: term.cols,
        rows: term.rows
    });

    term.socket.data(function(err, data) {
        if (err) return self._destroy();
        switch (data.type) {
            case "created":
                $title.text(data.process);
            term.emit("open tab", term);
            term.emit("open");
            self.updateSize();
            break;
            case "data":
                tab.write(data.data);
            break;
        }
    });

    // Create the terminal
    term.socket.write(null, {
        type: "create",
        data: [term.cols, term.rows]
    });

    term.emit("connect");

    // Listen for data

    // Listen for kill event
    tab.open(targetDOM);
    tab.focus();
    tab.on("data", function (data) {

        term.socket.write(null, {
            type: "data",
            data: data
        });
    });

    term.bind();

    term.emit("load");
    term.emit("open");

    // TODO this is a hack
    setTimeout(function() {
        updateSize();
    }, 1000);
}

function updateSize (term) {
    var tSize = textSize(targetDOM);
    // TODO This is a hack
    tSize.y += 3;
    tSize.x += 8;
    term.cols = tSize.x || Terminal.geometry[0];
    term.rows = tSize.y || Terminal.geometry[1];

    term.socket.write(null, {
        type: "resize",
        data: [term.cols, term.rows]
    });

    term.tab.resize(term.cols, term.rows);
};

function textSize (targetDOM) {
    var self = this;

    var span = document.createElement("span");
    var newContent = document.createTextNode("foo");

    newDiv.appendChild(newContent);

    targetDOM.children().first().append(span);
    var charSize = {
        width: span.outerWidth() / 3
        , height: span.outerHeight()
    };
    span.remove();

    // old code
    // var $span = $("<span>", { text: "foo" });
    // targetDOM.children().first().append($span);
    // var charSize = {
    //     width: $span.outerWidth() / 3
    //     , height: $span.outerHeight()
    // };
    // $span.remove();

    return {
        x: Math.floor($self.width() / charSize.width)
      , y: Math.floor($self.height() / charSize.height)
    };
};

/**
 * initTerminal
 *
 * @name initTerminal
 * @function
 */
// exports.redraw = function (str) {
//     var self = this;
//     str.data(function () {
//         // TODO Redraw without reinit
//         //exports.init.call(self);
//         self._term = $(self._config.container).webTerm(self);
//     });
// };

/**
 * focus
 *
 * @name focus
 * @function
 */
exports.focus = function () {
    this.term.tab.focus();
};
