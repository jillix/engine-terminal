/**
 * Client
 * Creates a new `Client` instance.
 *
 * @name Client
 * @function
 * @param {Object} link The link object.
 * @param {Object} clients The clients object.
 * @param {Object} conf The configuration object.
 * @return {undefined}
 */
function Client(link, clients, conf) {
    this.id = link.id;
    this.socket = link.socket;
    this.clients = clients;
    this.type = conf.type;
    this.lnk = link;

    this.on("close", function () {
        this.clients[this.id] = null;
    }.bind(this));

    link.data(function (err, data) {
        if (err) { return this.emit("close"); }
        switch (this.type) {
            case "client":
                // TODO
                break;
            case "session":
                // TODO
                break;
            case "group":
                // TODO
                break;
            default:
                Object.keys(this.clients).forEach(function (c) {
                    this.clients[c].lnk.send(err, data);
                }.bind(this));
                break;
        }


    }.bind(this));
}

/**
 * on
 * Listens for events.
 *
 * @name on
 * @function
 * @return {undefined}
 */
Client.prototype.on = function () {
    this.socket.on.apply(this, arguments);
};

/**
 * init
 * The init function.
 *
 * @name init
 * @function
 * @return {undefined}
 */
exports.init = function () {
    this.clients = {};
    this.on("_clientConnected", engine.flow(this, [{
        call: "_clientConnected"
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
exports._clientConnected = function (link) {
    this.clients[link.id] = new Client(link, this.clients, this._config);
};
