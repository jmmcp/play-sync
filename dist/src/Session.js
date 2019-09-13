"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Session =
/*#__PURE__*/
function () {
  function Session(creator) {
    _classCallCheck(this, Session);

    this.clients = []; // all clients, including ones without users...

    this.users = [];
    this.creator = creator;
    this.countdownTime = -1;
    this.countdownName = "pause";
    this.countdownRequester = "";
    this.name = ""; // xCwL

    this.timerRunning = false;
  }

  _createClass(Session, [{
    key: "addClient",
    value: function addClient(clientId) {
      this.clients.push(clientId);
    }
  }, {
    key: "removeClient",
    value: function removeClient(clientId) {
      var i = this.clients.indexOf(clientId);

      if (i > -1) {
        this.clients.splice(i, 1);
      }
    }
  }, {
    key: "addUser",
    value: function addUser(user) {
      this.users.push(user);
    }
  }, {
    key: "removeUser",
    value: function removeUser(user) {
      var i = this.users.indexOf(user);

      if (i > -1) {
        this.users.splice(i, 1);
      }
    } // get user for client id

  }, {
    key: "getUser",
    value: function getUser(clientId) {
      return this.users.filter(function (user) {
        return user.id === clientId;
      })[0];
    }
  }]);

  return Session;
}();

var _default = Session;
exports.default = _default;