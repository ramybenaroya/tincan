var v = '__VERSION__';

function Tincan(otherWindow, otherOrigin, context) {
	this._context = context || window;
	this._otherWindow = otherWindow;
	this._otherOrigin = otherOrigin;
	this._uid = Math.random();
	this._counter = 0;
	this._answer = this._onMessage.bind(this);
	this._sessions = {};
	window.addEventListener('message', this._answer);
}

Tincan.prototype._onMessage = function(event) {
	var message = event.data;
	var result;
	var error;
	var f;
	var doesOriginMatch = this._doesOriginMatch(event.origin);
	var didFinish = false;
	var that = this;
	if (!doesOriginMatch || !message || !message.id || message.v !== v) {
		return;
	}
	if (message.f) {
		f = new Function(message.f.replace('function', 'return function'))();
		try {
			if (f.length > 0) {
				f.call(that.context, done, fail);
			} else {
				result = f.call(that.context);
				done(result);
			}
		} catch (e) {
			error = {
				message: e.message,
				stack: e.stack.toString()
			};
			fail(error);
		}
	} else {
		if (this._sessions[message.id]) {
			if (message.hasOwnProperty('result') && this._sessions[message.id].success) {
				this._sessions[message.id].success(message.result);
			} else if (message.hasOwnProperty('error') && this._sessions[message.id].fail) {
				error = new Error(message.error.message);
				error.stack = message.error.stack;
				this._sessions[message.id].fail(message.error);
			}
			this._sessions[message.id] = null;
			delete this._sessions[message.id];
		}
	}

	function done(result, error) {
		if (didFinish) {
			return;
		}
		didFinish = true;
		var messageBack = {
			id: message.id,
			v: v
		};
		if (error) {
			messageBack.error = error;
		} else {
			messageBack.result = result;
		}
		that._otherWindow.postMessage(messageBack, that._otherOrigin);
	}

	function fail(error) {
		return done(
			null,
			error
				? {
						message: error.message,
						stack: error.stack
					}
				: null
		);
	}
};

Tincan.prototype.talk = function(f, success, fail) {
	var id = ++this._counter + this._uid;
	var message = {
		id: id,
		v: v,
		f: f.toString()
	};
	this._sessions[id] = {
		success: success,
		fail: fail
	};
	this._otherWindow.postMessage(message, this._otherOrigin);
};

Tincan.prototype._doesOriginMatch = function(origin) {
	return (
		origin === this._otherOrigin ||
		(this._otherOrigin === '*' && (window.location.origin === origin || origin === 'null'))
	);
};

Tincan.prototype.destroy = function() {
	window.removeEventListener('message', this._answer);
	this._otherWindow = this._otherOrigin = this._uid = this._counter = this._answer = this._sessions = null;
};

module.exports = Tincan;
