"use strict";

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _randomatic = _interopRequireDefault(require("randomatic"));

var _Session = _interopRequireDefault(require("./src/Session"));

var _User = _interopRequireDefault(require("./src/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require('dotenv').config();

var app = (0, _express.default)();

var server = _http.default.createServer(app);

var io = (0, _socket.default)(server);
var sessions = {};
var clientsInSessions = {}; // client.id : sessionid

io.on('connection', function (client) {
  client.on('new-session', function (data) {
    // make that new session
    client.emit('new-session-created', newSession(client.id));
  });
  client.on('session-page-reached', function (sessionid) {
    // does the session exist in the master object?
    client.emit('session-exists', sessionid in sessions);

    if (sessionid in sessions) {
      client.join(sessionid);
      clientsInSessions[client.id] = sessionid;
      getSessionOfClient(client.id).addClient(client.id); //console.log(clientsInSessions);
    }
  }); // 'yes, your username is legit and you are now a real member of a session'
  // 'everyone in the session: this user just joined'

  client.on('username-out', function (username) {
    var user = new _User.default(username, client.id);
    var sesh = getSessionOfClient(client.id);
    sesh.addUser(user);
    client.emit('username-in', username);
    sendSessionUpdate(sesh.name);
    client.to(sesh.name).emit('message', "User ".concat(user.name, " joined"));
    var log = "User ".concat(user.name, " connected to room ").concat(sesh.name);
    console.log(log, "(total clients: ".concat(sesh.clients.length, ")"));
  });
  client.on('pause-requested', function (_) {
    // TODO: pause-requested
    var sesh = getSessionOfClient(client.id);

    if (sesh != undefined && !sesh.timerRunning) {
      var senderName = getSessionOfClient(client.id).name;
      sendTimerToRoom(senderName, 'pause');
    }
  });
  client.on('play-requested', function (_) {
    // TODO: resume-requested
    var sesh = getSessionOfClient(client.id);

    if (sesh != undefined && !sesh.timerRunning) {
      var senderName = getSessionOfClient(client.id).name;
      sendTimerToRoom(senderName, 'play');
    }
  });
  client.on('timestamp-in', function (_) {// TODO: timestamp-in
  });
  client.on('disconnect', function (_) {
    if (client.id in clientsInSessions) {
      var sesh = getSessionOfClient(client.id);

      if (sesh != undefined) {
        var u = sesh.getUser(client.id);
        var log = u != undefined ? "User ".concat(u.name, " dc'd from room ").concat(sesh.name) : "User-less client ".concat(client.id, " dc'd from room ").concat(sesh.name);
        console.log(log, "(total clients: ".concat(sesh.clients.length, ")"));
        sesh.removeUser(u);
        sesh.removeClient(client.id);
        delete clientsInSessions[client.id];

        if (sesh.clients.length === 0) {
          console.log("No clients on session ".concat(sesh.name, ", destroying."));
          destroySession(sesh.name);
        } //console.log(clientsInSessions);

      }
    }
  });
});

function newSession(creatorId) {
  var session = new _Session.default(creatorId);

  var nameGen = function nameGen(_) {
    // for now lets do 4 characters in two cases
    // that's like... 24*2*4! or something
    return (0, _randomatic.default)('Aa', 4);
  };

  session.name = nameGen();

  while (session.name in sessions) {
    // ensure unique
    session.name = nameGen();
  }

  sessions[session.name] = session;
  return session;
}

function sendSessionUpdate(sessionName) {
  io.to(sessionName).emit('session-update', sessions[sessionName]);
} // takes either a string or a Session


function destroySession(s) {
  var seshId = _typeof(s) === _Session.default ? s.name : s;
  delete sessions[seshId];
}

function getSessionOfClient(clientId) {
  return sessions[clientsInSessions[clientId]];
}

function sendTimerToRoom(_x, _x2, _x3) {
  return _sendTimerToRoom.apply(this, arguments);
}

function _sendTimerToRoom() {
  _sendTimerToRoom = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(room, countdownName, userName) {
    var setTimerRunning, sendCount, delay;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            setTimerRunning = function setTimerRunning(t) {
              return new Promise(function (resolve, reject) {
                sessions[room].timerRunning = t;
                resolve();
              });
            };

            sendCount = function sendCount(count) {
              return new Promise(function (resolve, reject) {
                if (!(room in sessions)) {
                  reject();
                  return;
                }

                sessions[room].countdownTime = count;
                sessions[room].countdownName = countdownName;
                sessions[room].countdownRequester = userName;
                io.to(room).emit('timer-update', sessions[room]);
                resolve();
              });
            };

            delay = function delay() {
              return new Promise(function (resolve) {
                return setTimeout(resolve, 1000);
              });
            }; // this could be a for loop, but this kind of looks pretty.


            setTimerRunning(true) //.then(_ => sendCount(5)).then(delay)
            //.then(_ => sendCount(4)).then(delay)
            .then(function (_) {
              return sendCount(3);
            }).then(delay).then(function (_) {
              return sendCount(2);
            }).then(delay).then(function (_) {
              return sendCount(1);
            }).then(delay).then(function (_) {
              return sendCount(0);
            }).then(delay).then(function (_) {
              return sendCount(-1);
            }).then(function (_) {
              return setTimerRunning(false);
            }).catch(function (reason) {// it's likely that a room was closed
              // in the middle of a timer for it.
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _sendTimerToRoom.apply(this, arguments);
}

server.listen(process.env.SOCKET_PORT, function (_) {
  var rhost = server.address().address;
  var rport = server.address().port;
  console.log("socket listening on ", rhost + ":" + rport);
});