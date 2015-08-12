// redraw; focus
var Terminal = require("./term");

exports.init = function () {
    var self = this;
    self.targetDOM = document.querySelector(self._config.target || ".web-term");

    if (!self.targetDOM) {
        return self.log("E", "No DOM target found for terminal");
    }

    // Create terminal instance

    var _resizeTimer = null;

    // Resize terminal window on browser window resize
    window.addEventListener("resize", function () {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(function (){
            self.updateSize(self.term);
        }, 100);
    });

    self.socket = self.flow("termData");

    // Initialize ui
    /// Create the window
    self.targetDOM.classList.add("webTerm-window");

    // Create the tab
    self.term = Terminal.call(new Terminal.EventEmitter, {
        cols: self.cols,
        rows: self.rows
    });

    self.socket.error(function(err) {
        self.log('E', err);
        // TODO self._destroy()
    });

    self.socket.data(function(data) {
        switch (data.type) {
            case "created":
            self.term.emit("open tab", self.term);
            self.term.emit("open");
            self.updateSize(self.term);
            break;
            case "data":
                self.term.write(data.data);
            break;
        }
    });

    // Create the terminal
    self.socket.write(null, {
        type: "create",
        data: [self.cols, self.rows]
    });

    self.term.emit("connect");

    // Listen for data

    // Listen for kill event
    self.term.open(self.targetDOM);
    self.term.focus();
    self.term.on("data", function (data) {

        self.socket.write(null, {
            type: "data",
            data: data
        });
    });

    self.targetDOM.onmousedown = function(ev) {
        self.term.focus();
    };

    self.term.emit("load");
    self.term.emit("open");

    // TODO this is a hack
    setTimeout(function() {
        self.updateSize();
    }, 1000);
}

exports.updateSize = function updateSize () {
    var self = this;
    var tSize = textSize(self.targetDOM);
    self.cols = tSize.x;
    self.rows = tSize.y;

    self.cols = tSize.x || Terminal.geometry[0];
    self.rows = tSize.y || Terminal.geometry[1];

    self.socket.write(null, {
        type: "resize",
        data: [self.cols, self.rows]
    });

    self.term.resize(self.cols, self.rows);
};

// Gets the full width and height of a DOM element
// full width/height includes width, padding, border, margin
function getOuterDimensions (elementDOM) {
    var width,
        height;
    var boundingBox = elementDOM.getBoundingClientRect();

    // Get the width and height without margins
    width = boundingBox.width;
    height = boundingBox.height;

    // Add margins to the width and height
    var computed = getComputedStyle(elementDOM);
    width = width + parseInt(computed.marginRight) + parseInt(computed.marginLeft);
    height = height + parseInt(computed.marginTop) + parseInt(computed.marginBottom);

    return {
        width: width,
        height: height
    }
}

function textSize (targetDOM) {
    var self = this;

    var span = document.createElement("span");
    var newContent = document.createTextNode("o");

    span.appendChild(newContent);
    targetDOM.children[0].appendChild(span)

    var charSize = getOuterDimensions(span);
    var targetSize = getOuterDimensions(targetDOM);

    span.remove();

    return {
        x: Math.floor(targetSize.width / charSize.width),
        y: Math.floor(targetSize.height / charSize.height)
    };
};

/**
 * focus
 *
 * @name focus
 * @function
 */
exports.focus = function () {
    this.term.focus();
};
