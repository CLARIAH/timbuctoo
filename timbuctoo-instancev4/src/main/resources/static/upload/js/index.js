(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ExcelImportMock = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],3:[function(require,module,exports){
var pSlice = Array.prototype.slice;
var objectKeys = require('./lib/keys.js');
var isArguments = require('./lib/is_arguments.js');

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}

},{"./lib/is_arguments.js":4,"./lib/keys.js":5}],4:[function(require,module,exports){
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};

},{}],5:[function(require,module,exports){
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

},{}],6:[function(require,module,exports){
var isFunction = require('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":27}],7:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],8:[function(require,module,exports){
/**
 * Indicates that navigation was caused by a call to history.push.
 */
'use strict';

exports.__esModule = true;
var PUSH = 'PUSH';

exports.PUSH = PUSH;
/**
 * Indicates that navigation was caused by a call to history.replace.
 */
var REPLACE = 'REPLACE';

exports.REPLACE = REPLACE;
/**
 * Indicates that navigation was caused by some other action such
 * as using a browser's back/forward buttons and/or manually manipulating
 * the URL in a browser's location bar. This is the default.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
 * for more information.
 */
var POP = 'POP';

exports.POP = POP;
exports['default'] = {
  PUSH: PUSH,
  REPLACE: REPLACE,
  POP: POP
};
},{}],9:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var _slice = Array.prototype.slice;
exports.loopAsync = loopAsync;

function loopAsync(turns, work, callback) {
  var currentTurn = 0,
      isDone = false;
  var sync = false,
      hasNext = false,
      doneArgs = undefined;

  function done() {
    isDone = true;
    if (sync) {
      // Iterate instead of recursing if possible.
      doneArgs = [].concat(_slice.call(arguments));
      return;
    }

    callback.apply(this, arguments);
  }

  function next() {
    if (isDone) {
      return;
    }

    hasNext = true;
    if (sync) {
      // Iterate instead of recursing if possible.
      return;
    }

    sync = true;

    while (!isDone && currentTurn < turns && hasNext) {
      hasNext = false;
      work.call(this, currentTurn++, next, done);
    }

    sync = false;

    if (isDone) {
      // This means the loop finished synchronously.
      callback.apply(this, doneArgs);
      return;
    }

    if (currentTurn >= turns && hasNext) {
      isDone = true;
      callback();
    }
  }

  next();
}
},{}],10:[function(require,module,exports){
(function (process){
/*eslint-disable no-empty */
'use strict';

exports.__esModule = true;
exports.saveState = saveState;
exports.readState = readState;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var KeyPrefix = '@@History/';
var QuotaExceededErrors = ['QuotaExceededError', 'QUOTA_EXCEEDED_ERR'];

var SecurityError = 'SecurityError';

function createKey(key) {
  return KeyPrefix + key;
}

function saveState(key, state) {
  try {
    if (state == null) {
      window.sessionStorage.removeItem(createKey(key));
    } else {
      window.sessionStorage.setItem(createKey(key), JSON.stringify(state));
    }
  } catch (error) {
    if (error.name === SecurityError) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      process.env.NODE_ENV !== 'production' ? _warning2['default'](false, '[history] Unable to save state; sessionStorage is not available due to security settings') : undefined;

      return;
    }

    if (QuotaExceededErrors.indexOf(error.name) >= 0 && window.sessionStorage.length === 0) {
      // Safari "private mode" throws QuotaExceededError.
      process.env.NODE_ENV !== 'production' ? _warning2['default'](false, '[history] Unable to save state; sessionStorage is not available in Safari private mode') : undefined;

      return;
    }

    throw error;
  }
}

function readState(key) {
  var json = undefined;
  try {
    json = window.sessionStorage.getItem(createKey(key));
  } catch (error) {
    if (error.name === SecurityError) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      process.env.NODE_ENV !== 'production' ? _warning2['default'](false, '[history] Unable to read state; sessionStorage is not available due to security settings') : undefined;

      return null;
    }
  }

  if (json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      // Ignore invalid JSON.
    }
  }

  return null;
}
}).call(this,require('_process'))

},{"_process":1,"warning":24}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.addEventListener = addEventListener;
exports.removeEventListener = removeEventListener;
exports.getHashPath = getHashPath;
exports.replaceHashPath = replaceHashPath;
exports.getWindowPath = getWindowPath;
exports.go = go;
exports.getUserConfirmation = getUserConfirmation;
exports.supportsHistory = supportsHistory;
exports.supportsGoWithoutReloadUsingHash = supportsGoWithoutReloadUsingHash;

function addEventListener(node, event, listener) {
  if (node.addEventListener) {
    node.addEventListener(event, listener, false);
  } else {
    node.attachEvent('on' + event, listener);
  }
}

function removeEventListener(node, event, listener) {
  if (node.removeEventListener) {
    node.removeEventListener(event, listener, false);
  } else {
    node.detachEvent('on' + event, listener);
  }
}

function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  return window.location.href.split('#')[1] || '';
}

function replaceHashPath(path) {
  window.location.replace(window.location.pathname + window.location.search + '#' + path);
}

function getWindowPath() {
  return window.location.pathname + window.location.search + window.location.hash;
}

function go(n) {
  if (n) window.history.go(n);
}

function getUserConfirmation(message, callback) {
  callback(window.confirm(message));
}

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/rackt/react-router/issues/586
 */

function supportsHistory() {
  var ua = navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
    return false;
  }
  return window.history && 'pushState' in window.history;
}

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */

function supportsGoWithoutReloadUsingHash() {
  var ua = navigator.userAgent;
  return ua.indexOf('Firefox') === -1;
}
},{}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
exports.canUseDOM = canUseDOM;
},{}],13:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.extractPath = extractPath;
exports.parsePath = parsePath;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function extractPath(string) {
  var match = string.match(/^https?:\/\/[^\/]*/);

  if (match == null) return string;

  return string.substring(match[0].length);
}

function parsePath(path) {
  var pathname = extractPath(path);
  var search = '';
  var hash = '';

  process.env.NODE_ENV !== 'production' ? _warning2['default'](path === pathname, 'A path must be pathname + search + hash only, not a fully qualified URL like "%s"', path) : undefined;

  var hashIndex = pathname.indexOf('#');
  if (hashIndex !== -1) {
    hash = pathname.substring(hashIndex);
    pathname = pathname.substring(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');
  if (searchIndex !== -1) {
    search = pathname.substring(searchIndex);
    pathname = pathname.substring(0, searchIndex);
  }

  if (pathname === '') pathname = '/';

  return {
    pathname: pathname,
    search: search,
    hash: hash
  };
}
}).call(this,require('_process'))

},{"_process":1,"warning":24}],14:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _Actions = require('./Actions');

var _PathUtils = require('./PathUtils');

var _ExecutionEnvironment = require('./ExecutionEnvironment');

var _DOMUtils = require('./DOMUtils');

var _DOMStateStorage = require('./DOMStateStorage');

var _createDOMHistory = require('./createDOMHistory');

var _createDOMHistory2 = _interopRequireDefault(_createDOMHistory);

/**
 * Creates and returns a history object that uses HTML5's history API
 * (pushState, replaceState, and the popstate event) to manage history.
 * This is the recommended method of managing history in browsers because
 * it provides the cleanest URLs.
 *
 * Note: In browsers that do not support the HTML5 history API full
 * page reloads will be used to preserve URLs.
 */
function createBrowserHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Browser history needs a DOM') : _invariant2['default'](false) : undefined;

  var forceRefresh = options.forceRefresh;

  var isSupported = _DOMUtils.supportsHistory();
  var useRefresh = !isSupported || forceRefresh;

  function getCurrentLocation(historyState) {
    try {
      historyState = historyState || window.history.state || {};
    } catch (e) {
      historyState = {};
    }

    var path = _DOMUtils.getWindowPath();
    var _historyState = historyState;
    var key = _historyState.key;

    var state = undefined;
    if (key) {
      state = _DOMStateStorage.readState(key);
    } else {
      state = null;
      key = history.createKey();

      if (isSupported) window.history.replaceState(_extends({}, historyState, { key: key }), null);
    }

    var location = _PathUtils.parsePath(path);

    return history.createLocation(_extends({}, location, { state: state }), undefined, key);
  }

  function startPopStateListener(_ref) {
    var transitionTo = _ref.transitionTo;

    function popStateListener(event) {
      if (event.state === undefined) return; // Ignore extraneous popstate events in WebKit.

      transitionTo(getCurrentLocation(event.state));
    }

    _DOMUtils.addEventListener(window, 'popstate', popStateListener);

    return function () {
      _DOMUtils.removeEventListener(window, 'popstate', popStateListener);
    };
  }

  function finishTransition(location) {
    var basename = location.basename;
    var pathname = location.pathname;
    var search = location.search;
    var hash = location.hash;
    var state = location.state;
    var action = location.action;
    var key = location.key;

    if (action === _Actions.POP) return; // Nothing to do.

    _DOMStateStorage.saveState(key, state);

    var path = (basename || '') + pathname + search + hash;
    var historyState = {
      key: key
    };

    if (action === _Actions.PUSH) {
      if (useRefresh) {
        window.location.href = path;
        return false; // Prevent location update.
      } else {
          window.history.pushState(historyState, null, path);
        }
    } else {
      // REPLACE
      if (useRefresh) {
        window.location.replace(path);
        return false; // Prevent location update.
      } else {
          window.history.replaceState(historyState, null, path);
        }
    }
  }

  var history = _createDOMHistory2['default'](_extends({}, options, {
    getCurrentLocation: getCurrentLocation,
    finishTransition: finishTransition,
    saveState: _DOMStateStorage.saveState
  }));

  var listenerCount = 0,
      stopPopStateListener = undefined;

  function listenBefore(listener) {
    if (++listenerCount === 1) stopPopStateListener = startPopStateListener(history);

    var unlisten = history.listenBefore(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0) stopPopStateListener();
    };
  }

  function listen(listener) {
    if (++listenerCount === 1) stopPopStateListener = startPopStateListener(history);

    var unlisten = history.listen(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0) stopPopStateListener();
    };
  }

  // deprecated
  function registerTransitionHook(hook) {
    if (++listenerCount === 1) stopPopStateListener = startPopStateListener(history);

    history.registerTransitionHook(hook);
  }

  // deprecated
  function unregisterTransitionHook(hook) {
    history.unregisterTransitionHook(hook);

    if (--listenerCount === 0) stopPopStateListener();
  }

  return _extends({}, history, {
    listenBefore: listenBefore,
    listen: listen,
    registerTransitionHook: registerTransitionHook,
    unregisterTransitionHook: unregisterTransitionHook
  });
}

exports['default'] = createBrowserHistory;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./Actions":8,"./DOMStateStorage":10,"./DOMUtils":11,"./ExecutionEnvironment":12,"./PathUtils":13,"./createDOMHistory":15,"_process":1,"invariant":26}],15:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _ExecutionEnvironment = require('./ExecutionEnvironment');

var _DOMUtils = require('./DOMUtils');

var _createHistory = require('./createHistory');

var _createHistory2 = _interopRequireDefault(_createHistory);

function createDOMHistory(options) {
  var history = _createHistory2['default'](_extends({
    getUserConfirmation: _DOMUtils.getUserConfirmation
  }, options, {
    go: _DOMUtils.go
  }));

  function listen(listener) {
    !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'DOM history needs a DOM') : _invariant2['default'](false) : undefined;

    return history.listen(listener);
  }

  return _extends({}, history, {
    listen: listen
  });
}

exports['default'] = createDOMHistory;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./DOMUtils":11,"./ExecutionEnvironment":12,"./createHistory":17,"_process":1,"invariant":26}],16:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _Actions = require('./Actions');

var _PathUtils = require('./PathUtils');

var _ExecutionEnvironment = require('./ExecutionEnvironment');

var _DOMUtils = require('./DOMUtils');

var _DOMStateStorage = require('./DOMStateStorage');

var _createDOMHistory = require('./createDOMHistory');

var _createDOMHistory2 = _interopRequireDefault(_createDOMHistory);

function isAbsolutePath(path) {
  return typeof path === 'string' && path.charAt(0) === '/';
}

function ensureSlash() {
  var path = _DOMUtils.getHashPath();

  if (isAbsolutePath(path)) return true;

  _DOMUtils.replaceHashPath('/' + path);

  return false;
}

function addQueryStringValueToPath(path, key, value) {
  return path + (path.indexOf('?') === -1 ? '?' : '&') + (key + '=' + value);
}

function stripQueryStringValueFromPath(path, key) {
  return path.replace(new RegExp('[?&]?' + key + '=[a-zA-Z0-9]+'), '');
}

function getQueryStringValueFromPath(path, key) {
  var match = path.match(new RegExp('\\?.*?\\b' + key + '=(.+?)\\b'));
  return match && match[1];
}

var DefaultQueryKey = '_k';

function createHashHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Hash history needs a DOM') : _invariant2['default'](false) : undefined;

  var queryKey = options.queryKey;

  if (queryKey === undefined || !!queryKey) queryKey = typeof queryKey === 'string' ? queryKey : DefaultQueryKey;

  function getCurrentLocation() {
    var path = _DOMUtils.getHashPath();

    var key = undefined,
        state = undefined;
    if (queryKey) {
      key = getQueryStringValueFromPath(path, queryKey);
      path = stripQueryStringValueFromPath(path, queryKey);

      if (key) {
        state = _DOMStateStorage.readState(key);
      } else {
        state = null;
        key = history.createKey();
        _DOMUtils.replaceHashPath(addQueryStringValueToPath(path, queryKey, key));
      }
    } else {
      key = state = null;
    }

    var location = _PathUtils.parsePath(path);

    return history.createLocation(_extends({}, location, { state: state }), undefined, key);
  }

  function startHashChangeListener(_ref) {
    var transitionTo = _ref.transitionTo;

    function hashChangeListener() {
      if (!ensureSlash()) return; // Always make sure hashes are preceeded with a /.

      transitionTo(getCurrentLocation());
    }

    ensureSlash();
    _DOMUtils.addEventListener(window, 'hashchange', hashChangeListener);

    return function () {
      _DOMUtils.removeEventListener(window, 'hashchange', hashChangeListener);
    };
  }

  function finishTransition(location) {
    var basename = location.basename;
    var pathname = location.pathname;
    var search = location.search;
    var state = location.state;
    var action = location.action;
    var key = location.key;

    if (action === _Actions.POP) return; // Nothing to do.

    var path = (basename || '') + pathname + search;

    if (queryKey) {
      path = addQueryStringValueToPath(path, queryKey, key);
      _DOMStateStorage.saveState(key, state);
    } else {
      // Drop key and state.
      location.key = location.state = null;
    }

    var currentHash = _DOMUtils.getHashPath();

    if (action === _Actions.PUSH) {
      if (currentHash !== path) {
        window.location.hash = path;
      } else {
        process.env.NODE_ENV !== 'production' ? _warning2['default'](false, 'You cannot PUSH the same path using hash history') : undefined;
      }
    } else if (currentHash !== path) {
      // REPLACE
      _DOMUtils.replaceHashPath(path);
    }
  }

  var history = _createDOMHistory2['default'](_extends({}, options, {
    getCurrentLocation: getCurrentLocation,
    finishTransition: finishTransition,
    saveState: _DOMStateStorage.saveState
  }));

  var listenerCount = 0,
      stopHashChangeListener = undefined;

  function listenBefore(listener) {
    if (++listenerCount === 1) stopHashChangeListener = startHashChangeListener(history);

    var unlisten = history.listenBefore(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0) stopHashChangeListener();
    };
  }

  function listen(listener) {
    if (++listenerCount === 1) stopHashChangeListener = startHashChangeListener(history);

    var unlisten = history.listen(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0) stopHashChangeListener();
    };
  }

  function push(location) {
    process.env.NODE_ENV !== 'production' ? _warning2['default'](queryKey || location.state == null, 'You cannot use state without a queryKey it will be dropped') : undefined;

    history.push(location);
  }

  function replace(location) {
    process.env.NODE_ENV !== 'production' ? _warning2['default'](queryKey || location.state == null, 'You cannot use state without a queryKey it will be dropped') : undefined;

    history.replace(location);
  }

  var goIsSupportedWithoutReload = _DOMUtils.supportsGoWithoutReloadUsingHash();

  function go(n) {
    process.env.NODE_ENV !== 'production' ? _warning2['default'](goIsSupportedWithoutReload, 'Hash history go(n) causes a full page reload in this browser') : undefined;

    history.go(n);
  }

  function createHref(path) {
    return '#' + history.createHref(path);
  }

  // deprecated
  function registerTransitionHook(hook) {
    if (++listenerCount === 1) stopHashChangeListener = startHashChangeListener(history);

    history.registerTransitionHook(hook);
  }

  // deprecated
  function unregisterTransitionHook(hook) {
    history.unregisterTransitionHook(hook);

    if (--listenerCount === 0) stopHashChangeListener();
  }

  // deprecated
  function pushState(state, path) {
    process.env.NODE_ENV !== 'production' ? _warning2['default'](queryKey || state == null, 'You cannot use state without a queryKey it will be dropped') : undefined;

    history.pushState(state, path);
  }

  // deprecated
  function replaceState(state, path) {
    process.env.NODE_ENV !== 'production' ? _warning2['default'](queryKey || state == null, 'You cannot use state without a queryKey it will be dropped') : undefined;

    history.replaceState(state, path);
  }

  return _extends({}, history, {
    listenBefore: listenBefore,
    listen: listen,
    push: push,
    replace: replace,
    go: go,
    createHref: createHref,

    registerTransitionHook: registerTransitionHook, // deprecated - warning is in createHistory
    unregisterTransitionHook: unregisterTransitionHook, // deprecated - warning is in createHistory
    pushState: pushState, // deprecated - warning is in createHistory
    replaceState: replaceState // deprecated - warning is in createHistory
  });
}

exports['default'] = createHashHistory;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./Actions":8,"./DOMStateStorage":10,"./DOMUtils":11,"./ExecutionEnvironment":12,"./PathUtils":13,"./createDOMHistory":15,"_process":1,"invariant":26,"warning":24}],17:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _PathUtils = require('./PathUtils');

var _AsyncUtils = require('./AsyncUtils');

var _Actions = require('./Actions');

var _createLocation2 = require('./createLocation');

var _createLocation3 = _interopRequireDefault(_createLocation2);

var _runTransitionHook = require('./runTransitionHook');

var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

var _deprecate = require('./deprecate');

var _deprecate2 = _interopRequireDefault(_deprecate);

function createRandomKey(length) {
  return Math.random().toString(36).substr(2, length);
}

function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search &&
  //a.action === b.action && // Different action !== location change.
  a.key === b.key && _deepEqual2['default'](a.state, b.state);
}

var DefaultKeyLength = 6;

function createHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var getCurrentLocation = options.getCurrentLocation;
  var finishTransition = options.finishTransition;
  var saveState = options.saveState;
  var go = options.go;
  var getUserConfirmation = options.getUserConfirmation;
  var keyLength = options.keyLength;

  if (typeof keyLength !== 'number') keyLength = DefaultKeyLength;

  var transitionHooks = [];

  function listenBefore(hook) {
    transitionHooks.push(hook);

    return function () {
      transitionHooks = transitionHooks.filter(function (item) {
        return item !== hook;
      });
    };
  }

  var allKeys = [];
  var changeListeners = [];
  var location = undefined;

  function getCurrent() {
    if (pendingLocation && pendingLocation.action === _Actions.POP) {
      return allKeys.indexOf(pendingLocation.key);
    } else if (location) {
      return allKeys.indexOf(location.key);
    } else {
      return -1;
    }
  }

  function updateLocation(newLocation) {
    var current = getCurrent();

    location = newLocation;

    if (location.action === _Actions.PUSH) {
      allKeys = [].concat(allKeys.slice(0, current + 1), [location.key]);
    } else if (location.action === _Actions.REPLACE) {
      allKeys[current] = location.key;
    }

    changeListeners.forEach(function (listener) {
      listener(location);
    });
  }

  function listen(listener) {
    changeListeners.push(listener);

    if (location) {
      listener(location);
    } else {
      var _location = getCurrentLocation();
      allKeys = [_location.key];
      updateLocation(_location);
    }

    return function () {
      changeListeners = changeListeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  function confirmTransitionTo(location, callback) {
    _AsyncUtils.loopAsync(transitionHooks.length, function (index, next, done) {
      _runTransitionHook2['default'](transitionHooks[index], location, function (result) {
        if (result != null) {
          done(result);
        } else {
          next();
        }
      });
    }, function (message) {
      if (getUserConfirmation && typeof message === 'string') {
        getUserConfirmation(message, function (ok) {
          callback(ok !== false);
        });
      } else {
        callback(message !== false);
      }
    });
  }

  var pendingLocation = undefined;

  function transitionTo(nextLocation) {
    if (location && locationsAreEqual(location, nextLocation)) return; // Nothing to do.

    pendingLocation = nextLocation;

    confirmTransitionTo(nextLocation, function (ok) {
      if (pendingLocation !== nextLocation) return; // Transition was interrupted.

      if (ok) {
        // treat PUSH to current path like REPLACE to be consistent with browsers
        if (nextLocation.action === _Actions.PUSH) {
          var prevPath = createPath(location);
          var nextPath = createPath(nextLocation);

          if (nextPath === prevPath && _deepEqual2['default'](location.state, nextLocation.state)) nextLocation.action = _Actions.REPLACE;
        }

        if (finishTransition(nextLocation) !== false) updateLocation(nextLocation);
      } else if (location && nextLocation.action === _Actions.POP) {
        var prevIndex = allKeys.indexOf(location.key);
        var nextIndex = allKeys.indexOf(nextLocation.key);

        if (prevIndex !== -1 && nextIndex !== -1) go(prevIndex - nextIndex); // Restore the URL.
      }
    });
  }

  function push(location) {
    transitionTo(createLocation(location, _Actions.PUSH, createKey()));
  }

  function replace(location) {
    transitionTo(createLocation(location, _Actions.REPLACE, createKey()));
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  function createKey() {
    return createRandomKey(keyLength);
  }

  function createPath(location) {
    if (location == null || typeof location === 'string') return location;

    var pathname = location.pathname;
    var search = location.search;
    var hash = location.hash;

    var result = pathname;

    if (search) result += search;

    if (hash) result += hash;

    return result;
  }

  function createHref(location) {
    return createPath(location);
  }

  function createLocation(location, action) {
    var key = arguments.length <= 2 || arguments[2] === undefined ? createKey() : arguments[2];

    if (typeof action === 'object') {
      process.env.NODE_ENV !== 'production' ? _warning2['default'](false, 'The state (2nd) argument to history.createLocation is deprecated; use a ' + 'location descriptor instead') : undefined;

      if (typeof location === 'string') location = _PathUtils.parsePath(location);

      location = _extends({}, location, { state: action });

      action = key;
      key = arguments[3] || createKey();
    }

    return _createLocation3['default'](location, action, key);
  }

  // deprecated
  function setState(state) {
    if (location) {
      updateLocationState(location, state);
      updateLocation(location);
    } else {
      updateLocationState(getCurrentLocation(), state);
    }
  }

  function updateLocationState(location, state) {
    location.state = _extends({}, location.state, state);
    saveState(location.key, location.state);
  }

  // deprecated
  function registerTransitionHook(hook) {
    if (transitionHooks.indexOf(hook) === -1) transitionHooks.push(hook);
  }

  // deprecated
  function unregisterTransitionHook(hook) {
    transitionHooks = transitionHooks.filter(function (item) {
      return item !== hook;
    });
  }

  // deprecated
  function pushState(state, path) {
    if (typeof path === 'string') path = _PathUtils.parsePath(path);

    push(_extends({ state: state }, path));
  }

  // deprecated
  function replaceState(state, path) {
    if (typeof path === 'string') path = _PathUtils.parsePath(path);

    replace(_extends({ state: state }, path));
  }

  return {
    listenBefore: listenBefore,
    listen: listen,
    transitionTo: transitionTo,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    createKey: createKey,
    createPath: createPath,
    createHref: createHref,
    createLocation: createLocation,

    setState: _deprecate2['default'](setState, 'setState is deprecated; use location.key to save state instead'),
    registerTransitionHook: _deprecate2['default'](registerTransitionHook, 'registerTransitionHook is deprecated; use listenBefore instead'),
    unregisterTransitionHook: _deprecate2['default'](unregisterTransitionHook, 'unregisterTransitionHook is deprecated; use the callback returned from listenBefore instead'),
    pushState: _deprecate2['default'](pushState, 'pushState is deprecated; use push instead'),
    replaceState: _deprecate2['default'](replaceState, 'replaceState is deprecated; use replace instead')
  };
}

exports['default'] = createHistory;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./Actions":8,"./AsyncUtils":9,"./PathUtils":13,"./createLocation":18,"./deprecate":20,"./runTransitionHook":21,"_process":1,"deep-equal":3,"warning":24}],18:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _Actions = require('./Actions');

var _PathUtils = require('./PathUtils');

function createLocation() {
  var location = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
  var action = arguments.length <= 1 || arguments[1] === undefined ? _Actions.POP : arguments[1];
  var key = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var _fourthArg = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  if (typeof location === 'string') location = _PathUtils.parsePath(location);

  if (typeof action === 'object') {
    process.env.NODE_ENV !== 'production' ? _warning2['default'](false, 'The state (2nd) argument to createLocation is deprecated; use a ' + 'location descriptor instead') : undefined;

    location = _extends({}, location, { state: action });

    action = key || _Actions.POP;
    key = _fourthArg;
  }

  var pathname = location.pathname || '/';
  var search = location.search || '';
  var hash = location.hash || '';
  var state = location.state || null;

  return {
    pathname: pathname,
    search: search,
    hash: hash,
    state: state,
    action: action,
    key: key
  };
}

exports['default'] = createLocation;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./Actions":8,"./PathUtils":13,"_process":1,"warning":24}],19:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _PathUtils = require('./PathUtils');

var _Actions = require('./Actions');

var _createHistory = require('./createHistory');

var _createHistory2 = _interopRequireDefault(_createHistory);

function createStateStorage(entries) {
  return entries.filter(function (entry) {
    return entry.state;
  }).reduce(function (memo, entry) {
    memo[entry.key] = entry.state;
    return memo;
  }, {});
}

function createMemoryHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (Array.isArray(options)) {
    options = { entries: options };
  } else if (typeof options === 'string') {
    options = { entries: [options] };
  }

  var history = _createHistory2['default'](_extends({}, options, {
    getCurrentLocation: getCurrentLocation,
    finishTransition: finishTransition,
    saveState: saveState,
    go: go
  }));

  var _options = options;
  var entries = _options.entries;
  var current = _options.current;

  if (typeof entries === 'string') {
    entries = [entries];
  } else if (!Array.isArray(entries)) {
    entries = ['/'];
  }

  entries = entries.map(function (entry) {
    var key = history.createKey();

    if (typeof entry === 'string') return { pathname: entry, key: key };

    if (typeof entry === 'object' && entry) return _extends({}, entry, { key: key });

    !false ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Unable to create history entry from %s', entry) : _invariant2['default'](false) : undefined;
  });

  if (current == null) {
    current = entries.length - 1;
  } else {
    !(current >= 0 && current < entries.length) ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Current index must be >= 0 and < %s, was %s', entries.length, current) : _invariant2['default'](false) : undefined;
  }

  var storage = createStateStorage(entries);

  function saveState(key, state) {
    storage[key] = state;
  }

  function readState(key) {
    return storage[key];
  }

  function getCurrentLocation() {
    var entry = entries[current];
    var basename = entry.basename;
    var pathname = entry.pathname;
    var search = entry.search;

    var path = (basename || '') + pathname + (search || '');

    var key = undefined,
        state = undefined;
    if (entry.key) {
      key = entry.key;
      state = readState(key);
    } else {
      key = history.createKey();
      state = null;
      entry.key = key;
    }

    var location = _PathUtils.parsePath(path);

    return history.createLocation(_extends({}, location, { state: state }), undefined, key);
  }

  function canGo(n) {
    var index = current + n;
    return index >= 0 && index < entries.length;
  }

  function go(n) {
    if (n) {
      if (!canGo(n)) {
        process.env.NODE_ENV !== 'production' ? _warning2['default'](false, 'Cannot go(%s) there is not enough history', n) : undefined;
        return;
      }

      current += n;

      var currentLocation = getCurrentLocation();

      // change action to POP
      history.transitionTo(_extends({}, currentLocation, { action: _Actions.POP }));
    }
  }

  function finishTransition(location) {
    switch (location.action) {
      case _Actions.PUSH:
        current += 1;

        // if we are not on the top of stack
        // remove rest and push new
        if (current < entries.length) entries.splice(current);

        entries.push(location);
        saveState(location.key, location.state);
        break;
      case _Actions.REPLACE:
        entries[current] = location;
        saveState(location.key, location.state);
        break;
    }
  }

  return history;
}

exports['default'] = createMemoryHistory;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./Actions":8,"./PathUtils":13,"./createHistory":17,"_process":1,"invariant":26,"warning":24}],20:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function deprecate(fn, message) {
  return function () {
    process.env.NODE_ENV !== 'production' ? _warning2['default'](false, '[history] ' + message) : undefined;
    return fn.apply(this, arguments);
  };
}

exports['default'] = deprecate;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"_process":1,"warning":24}],21:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function runTransitionHook(hook, location, callback) {
  var result = hook(location, callback);

  if (hook.length < 2) {
    // Assume the hook runs synchronously and automatically
    // call the callback with the return value.
    callback(result);
  } else {
    process.env.NODE_ENV !== 'production' ? _warning2['default'](result === undefined, 'You should not "return" in a transition hook with a callback argument; call the callback instead') : undefined;
  }
}

exports['default'] = runTransitionHook;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"_process":1,"warning":24}],22:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _ExecutionEnvironment = require('./ExecutionEnvironment');

var _PathUtils = require('./PathUtils');

var _runTransitionHook = require('./runTransitionHook');

var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

var _deprecate = require('./deprecate');

var _deprecate2 = _interopRequireDefault(_deprecate);

function useBasename(createHistory) {
  return function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var history = createHistory(options);

    var basename = options.basename;

    var checkedBaseHref = false;

    function checkBaseHref() {
      if (checkedBaseHref) {
        return;
      }

      // Automatically use the value of <base href> in HTML
      // documents as basename if it's not explicitly given.
      if (basename == null && _ExecutionEnvironment.canUseDOM) {
        var base = document.getElementsByTagName('base')[0];
        var baseHref = base && base.getAttribute('href');

        if (baseHref != null) {
          basename = baseHref;

          process.env.NODE_ENV !== 'production' ? _warning2['default'](false, 'Automatically setting basename using <base href> is deprecated and will ' + 'be removed in the next major release. The semantics of <base href> are ' + 'subtly different from basename. Please pass the basename explicitly in ' + 'the options to createHistory') : undefined;
        }
      }

      checkedBaseHref = true;
    }

    function addBasename(location) {
      checkBaseHref();

      if (basename && location.basename == null) {
        if (location.pathname.indexOf(basename) === 0) {
          location.pathname = location.pathname.substring(basename.length);
          location.basename = basename;

          if (location.pathname === '') location.pathname = '/';
        } else {
          location.basename = '';
        }
      }

      return location;
    }

    function prependBasename(location) {
      checkBaseHref();

      if (!basename) return location;

      if (typeof location === 'string') location = _PathUtils.parsePath(location);

      var pname = location.pathname;
      var normalizedBasename = basename.slice(-1) === '/' ? basename : basename + '/';
      var normalizedPathname = pname.charAt(0) === '/' ? pname.slice(1) : pname;
      var pathname = normalizedBasename + normalizedPathname;

      return _extends({}, location, {
        pathname: pathname
      });
    }

    // Override all read methods with basename-aware versions.
    function listenBefore(hook) {
      return history.listenBefore(function (location, callback) {
        _runTransitionHook2['default'](hook, addBasename(location), callback);
      });
    }

    function listen(listener) {
      return history.listen(function (location) {
        listener(addBasename(location));
      });
    }

    // Override all write methods with basename-aware versions.
    function push(location) {
      history.push(prependBasename(location));
    }

    function replace(location) {
      history.replace(prependBasename(location));
    }

    function createPath(location) {
      return history.createPath(prependBasename(location));
    }

    function createHref(location) {
      return history.createHref(prependBasename(location));
    }

    function createLocation(location) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return addBasename(history.createLocation.apply(history, [prependBasename(location)].concat(args)));
    }

    // deprecated
    function pushState(state, path) {
      if (typeof path === 'string') path = _PathUtils.parsePath(path);

      push(_extends({ state: state }, path));
    }

    // deprecated
    function replaceState(state, path) {
      if (typeof path === 'string') path = _PathUtils.parsePath(path);

      replace(_extends({ state: state }, path));
    }

    return _extends({}, history, {
      listenBefore: listenBefore,
      listen: listen,
      push: push,
      replace: replace,
      createPath: createPath,
      createHref: createHref,
      createLocation: createLocation,

      pushState: _deprecate2['default'](pushState, 'pushState is deprecated; use push instead'),
      replaceState: _deprecate2['default'](replaceState, 'replaceState is deprecated; use replace instead')
    });
  };
}

exports['default'] = useBasename;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./ExecutionEnvironment":12,"./PathUtils":13,"./deprecate":20,"./runTransitionHook":21,"_process":1,"warning":24}],23:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _queryString = require('query-string');

var _runTransitionHook = require('./runTransitionHook');

var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

var _PathUtils = require('./PathUtils');

var _deprecate = require('./deprecate');

var _deprecate2 = _interopRequireDefault(_deprecate);

var SEARCH_BASE_KEY = '$searchBase';

function defaultStringifyQuery(query) {
  return _queryString.stringify(query).replace(/%20/g, '+');
}

var defaultParseQueryString = _queryString.parse;

function isNestedObject(object) {
  for (var p in object) {
    if (Object.prototype.hasOwnProperty.call(object, p) && typeof object[p] === 'object' && !Array.isArray(object[p]) && object[p] !== null) return true;
  }return false;
}

/**
 * Returns a new createHistory function that may be used to create
 * history objects that know how to handle URL queries.
 */
function useQueries(createHistory) {
  return function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var history = createHistory(options);

    var stringifyQuery = options.stringifyQuery;
    var parseQueryString = options.parseQueryString;

    if (typeof stringifyQuery !== 'function') stringifyQuery = defaultStringifyQuery;

    if (typeof parseQueryString !== 'function') parseQueryString = defaultParseQueryString;

    function addQuery(location) {
      if (location.query == null) {
        var search = location.search;

        location.query = parseQueryString(search.substring(1));
        location[SEARCH_BASE_KEY] = { search: search, searchBase: '' };
      }

      // TODO: Instead of all the book-keeping here, this should just strip the
      // stringified query from the search.

      return location;
    }

    function appendQuery(location, query) {
      var _extends2;

      var searchBaseSpec = location[SEARCH_BASE_KEY];
      var queryString = query ? stringifyQuery(query) : '';
      if (!searchBaseSpec && !queryString) {
        return location;
      }

      process.env.NODE_ENV !== 'production' ? _warning2['default'](stringifyQuery !== defaultStringifyQuery || !isNestedObject(query), 'useQueries does not stringify nested query objects by default; ' + 'use a custom stringifyQuery function') : undefined;

      if (typeof location === 'string') location = _PathUtils.parsePath(location);

      var searchBase = undefined;
      if (searchBaseSpec && location.search === searchBaseSpec.search) {
        searchBase = searchBaseSpec.searchBase;
      } else {
        searchBase = location.search || '';
      }

      var search = searchBase;
      if (queryString) {
        search += (search ? '&' : '?') + queryString;
      }

      return _extends({}, location, (_extends2 = {
        search: search
      }, _extends2[SEARCH_BASE_KEY] = { search: search, searchBase: searchBase }, _extends2));
    }

    // Override all read methods with query-aware versions.
    function listenBefore(hook) {
      return history.listenBefore(function (location, callback) {
        _runTransitionHook2['default'](hook, addQuery(location), callback);
      });
    }

    function listen(listener) {
      return history.listen(function (location) {
        listener(addQuery(location));
      });
    }

    // Override all write methods with query-aware versions.
    function push(location) {
      history.push(appendQuery(location, location.query));
    }

    function replace(location) {
      history.replace(appendQuery(location, location.query));
    }

    function createPath(location, query) {
      process.env.NODE_ENV !== 'production' ? _warning2['default'](!query, 'the query argument to createPath is deprecated; use a location descriptor instead') : undefined;

      return history.createPath(appendQuery(location, query || location.query));
    }

    function createHref(location, query) {
      process.env.NODE_ENV !== 'production' ? _warning2['default'](!query, 'the query argument to createHref is deprecated; use a location descriptor instead') : undefined;

      return history.createHref(appendQuery(location, query || location.query));
    }

    function createLocation(location) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var fullLocation = history.createLocation.apply(history, [appendQuery(location, location.query)].concat(args));
      if (location.query) {
        fullLocation.query = location.query;
      }
      return addQuery(fullLocation);
    }

    // deprecated
    function pushState(state, path, query) {
      if (typeof path === 'string') path = _PathUtils.parsePath(path);

      push(_extends({ state: state }, path, { query: query }));
    }

    // deprecated
    function replaceState(state, path, query) {
      if (typeof path === 'string') path = _PathUtils.parsePath(path);

      replace(_extends({ state: state }, path, { query: query }));
    }

    return _extends({}, history, {
      listenBefore: listenBefore,
      listen: listen,
      push: push,
      replace: replace,
      createPath: createPath,
      createHref: createHref,
      createLocation: createLocation,

      pushState: _deprecate2['default'](pushState, 'pushState is deprecated; use push instead'),
      replaceState: _deprecate2['default'](replaceState, 'replaceState is deprecated; use replace instead')
    });
  };
}

exports['default'] = useQueries;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./PathUtils":13,"./deprecate":20,"./runTransitionHook":21,"_process":1,"query-string":33,"warning":24}],24:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

if (process.env.NODE_ENV !== 'production') {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))

},{"_process":1}],25:[function(require,module,exports){
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    arguments: true,
    arity: true
};

var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
        var keys = Object.getOwnPropertyNames(sourceComponent);

        /* istanbul ignore else */
        if (isGetOwnPropertySymbolsAvailable) {
            keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
                try {
                    targetComponent[keys[i]] = sourceComponent[keys[i]];
                } catch (error) {

                }
            }
        }
    }

    return targetComponent;
};

},{}],26:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))

},{"_process":1}],27:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],28:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":29}],29:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],30:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],31:[function(require,module,exports){
var getPrototype = require('./_getPrototype'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || objectToString.call(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;

},{"./_getPrototype":28,"./isObjectLike":30}],32:[function(require,module,exports){
var trim = require('trim')
  , forEach = require('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":6,"trim":91}],33:[function(require,module,exports){
'use strict';
var strictUriEncode = require('strict-uri-encode');

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str) {
	if (typeof str !== 'string') {
		return {};
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return {};
	}

	return str.split('&').reduce(function (ret, param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		key = decodeURIComponent(key);

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		if (!ret.hasOwnProperty(key)) {
			ret[key] = val;
		} else if (Array.isArray(ret[key])) {
			ret[key].push(val);
		} else {
			ret[key] = [ret[key], val];
		}

		return ret;
	}, {});
};

exports.stringify = function (obj) {
	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return key;
		}

		if (Array.isArray(val)) {
			return val.slice().sort().map(function (val2) {
				return strictUriEncode(key) + '=' + strictUriEncode(val2);
			}).join('&');
		}

		return strictUriEncode(key) + '=' + strictUriEncode(val);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

},{"strict-uri-encode":87}],34:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports["default"] = undefined;

var _react = require('react');

var _storeShape = require('../utils/storeShape');

var _storeShape2 = _interopRequireDefault(_storeShape);

var _warning = require('../utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var didWarnAboutReceivingStore = false;
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return;
  }
  didWarnAboutReceivingStore = true;

  (0, _warning2["default"])('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/reactjs/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
}

var Provider = function (_Component) {
  _inherits(Provider, _Component);

  Provider.prototype.getChildContext = function getChildContext() {
    return { store: this.store };
  };

  function Provider(props, context) {
    _classCallCheck(this, Provider);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.store = props.store;
    return _this;
  }

  Provider.prototype.render = function render() {
    var children = this.props.children;

    return _react.Children.only(children);
  };

  return Provider;
}(_react.Component);

exports["default"] = Provider;

if (process.env.NODE_ENV !== 'production') {
  Provider.prototype.componentWillReceiveProps = function (nextProps) {
    var store = this.store;
    var nextStore = nextProps.store;

    if (store !== nextStore) {
      warnAboutReceivingStore();
    }
  };
}

Provider.propTypes = {
  store: _storeShape2["default"].isRequired,
  children: _react.PropTypes.element.isRequired
};
Provider.childContextTypes = {
  store: _storeShape2["default"].isRequired
};
}).call(this,require('_process'))

},{"../utils/storeShape":38,"../utils/warning":39,"_process":1,"react":"react"}],35:[function(require,module,exports){
(function (process){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;
exports["default"] = connect;

var _react = require('react');

var _storeShape = require('../utils/storeShape');

var _storeShape2 = _interopRequireDefault(_storeShape);

var _shallowEqual = require('../utils/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _wrapActionCreators = require('../utils/wrapActionCreators');

var _wrapActionCreators2 = _interopRequireDefault(_wrapActionCreators);

var _warning = require('../utils/warning');

var _warning2 = _interopRequireDefault(_warning);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultMapStateToProps = function defaultMapStateToProps(state) {
  return {};
}; // eslint-disable-line no-unused-vars
var defaultMapDispatchToProps = function defaultMapDispatchToProps(dispatch) {
  return { dispatch: dispatch };
};
var defaultMergeProps = function defaultMergeProps(stateProps, dispatchProps, parentProps) {
  return _extends({}, parentProps, stateProps, dispatchProps);
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

var errorObject = { value: null };
function tryCatch(fn, ctx) {
  try {
    return fn.apply(ctx);
  } catch (e) {
    errorObject.value = e;
    return errorObject;
  }
}

// Helps track hot reloading.
var nextVersion = 0;

function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var shouldSubscribe = Boolean(mapStateToProps);
  var mapState = mapStateToProps || defaultMapStateToProps;

  var mapDispatch = undefined;
  if (typeof mapDispatchToProps === 'function') {
    mapDispatch = mapDispatchToProps;
  } else if (!mapDispatchToProps) {
    mapDispatch = defaultMapDispatchToProps;
  } else {
    mapDispatch = (0, _wrapActionCreators2["default"])(mapDispatchToProps);
  }

  var finalMergeProps = mergeProps || defaultMergeProps;
  var _options$pure = options.pure;
  var pure = _options$pure === undefined ? true : _options$pure;
  var _options$withRef = options.withRef;
  var withRef = _options$withRef === undefined ? false : _options$withRef;

  var checkMergedEquals = pure && finalMergeProps !== defaultMergeProps;

  // Helps track hot reloading.
  var version = nextVersion++;

  return function wrapWithConnect(WrappedComponent) {
    var connectDisplayName = 'Connect(' + getDisplayName(WrappedComponent) + ')';

    function checkStateShape(props, methodName) {
      if (!(0, _isPlainObject2["default"])(props)) {
        (0, _warning2["default"])(methodName + '() in ' + connectDisplayName + ' must return a plain object. ' + ('Instead received ' + props + '.'));
      }
    }

    function computeMergedProps(stateProps, dispatchProps, parentProps) {
      var mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps);
      if (process.env.NODE_ENV !== 'production') {
        checkStateShape(mergedProps, 'mergeProps');
      }
      return mergedProps;
    }

    var Connect = function (_Component) {
      _inherits(Connect, _Component);

      Connect.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        return !pure || this.haveOwnPropsChanged || this.hasStoreStateChanged;
      };

      function Connect(props, context) {
        _classCallCheck(this, Connect);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.version = version;
        _this.store = props.store || context.store;

        (0, _invariant2["default"])(_this.store, 'Could not find "store" in either the context or ' + ('props of "' + connectDisplayName + '". ') + 'Either wrap the root component in a <Provider>, ' + ('or explicitly pass "store" as a prop to "' + connectDisplayName + '".'));

        var storeState = _this.store.getState();
        _this.state = { storeState: storeState };
        _this.clearCache();
        return _this;
      }

      Connect.prototype.computeStateProps = function computeStateProps(store, props) {
        if (!this.finalMapStateToProps) {
          return this.configureFinalMapState(store, props);
        }

        var state = store.getState();
        var stateProps = this.doStatePropsDependOnOwnProps ? this.finalMapStateToProps(state, props) : this.finalMapStateToProps(state);

        if (process.env.NODE_ENV !== 'production') {
          checkStateShape(stateProps, 'mapStateToProps');
        }
        return stateProps;
      };

      Connect.prototype.configureFinalMapState = function configureFinalMapState(store, props) {
        var mappedState = mapState(store.getState(), props);
        var isFactory = typeof mappedState === 'function';

        this.finalMapStateToProps = isFactory ? mappedState : mapState;
        this.doStatePropsDependOnOwnProps = this.finalMapStateToProps.length !== 1;

        if (isFactory) {
          return this.computeStateProps(store, props);
        }

        if (process.env.NODE_ENV !== 'production') {
          checkStateShape(mappedState, 'mapStateToProps');
        }
        return mappedState;
      };

      Connect.prototype.computeDispatchProps = function computeDispatchProps(store, props) {
        if (!this.finalMapDispatchToProps) {
          return this.configureFinalMapDispatch(store, props);
        }

        var dispatch = store.dispatch;

        var dispatchProps = this.doDispatchPropsDependOnOwnProps ? this.finalMapDispatchToProps(dispatch, props) : this.finalMapDispatchToProps(dispatch);

        if (process.env.NODE_ENV !== 'production') {
          checkStateShape(dispatchProps, 'mapDispatchToProps');
        }
        return dispatchProps;
      };

      Connect.prototype.configureFinalMapDispatch = function configureFinalMapDispatch(store, props) {
        var mappedDispatch = mapDispatch(store.dispatch, props);
        var isFactory = typeof mappedDispatch === 'function';

        this.finalMapDispatchToProps = isFactory ? mappedDispatch : mapDispatch;
        this.doDispatchPropsDependOnOwnProps = this.finalMapDispatchToProps.length !== 1;

        if (isFactory) {
          return this.computeDispatchProps(store, props);
        }

        if (process.env.NODE_ENV !== 'production') {
          checkStateShape(mappedDispatch, 'mapDispatchToProps');
        }
        return mappedDispatch;
      };

      Connect.prototype.updateStatePropsIfNeeded = function updateStatePropsIfNeeded() {
        var nextStateProps = this.computeStateProps(this.store, this.props);
        if (this.stateProps && (0, _shallowEqual2["default"])(nextStateProps, this.stateProps)) {
          return false;
        }

        this.stateProps = nextStateProps;
        return true;
      };

      Connect.prototype.updateDispatchPropsIfNeeded = function updateDispatchPropsIfNeeded() {
        var nextDispatchProps = this.computeDispatchProps(this.store, this.props);
        if (this.dispatchProps && (0, _shallowEqual2["default"])(nextDispatchProps, this.dispatchProps)) {
          return false;
        }

        this.dispatchProps = nextDispatchProps;
        return true;
      };

      Connect.prototype.updateMergedPropsIfNeeded = function updateMergedPropsIfNeeded() {
        var nextMergedProps = computeMergedProps(this.stateProps, this.dispatchProps, this.props);
        if (this.mergedProps && checkMergedEquals && (0, _shallowEqual2["default"])(nextMergedProps, this.mergedProps)) {
          return false;
        }

        this.mergedProps = nextMergedProps;
        return true;
      };

      Connect.prototype.isSubscribed = function isSubscribed() {
        return typeof this.unsubscribe === 'function';
      };

      Connect.prototype.trySubscribe = function trySubscribe() {
        if (shouldSubscribe && !this.unsubscribe) {
          this.unsubscribe = this.store.subscribe(this.handleChange.bind(this));
          this.handleChange();
        }
      };

      Connect.prototype.tryUnsubscribe = function tryUnsubscribe() {
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      };

      Connect.prototype.componentDidMount = function componentDidMount() {
        this.trySubscribe();
      };

      Connect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (!pure || !(0, _shallowEqual2["default"])(nextProps, this.props)) {
          this.haveOwnPropsChanged = true;
        }
      };

      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
        this.tryUnsubscribe();
        this.clearCache();
      };

      Connect.prototype.clearCache = function clearCache() {
        this.dispatchProps = null;
        this.stateProps = null;
        this.mergedProps = null;
        this.haveOwnPropsChanged = true;
        this.hasStoreStateChanged = true;
        this.haveStatePropsBeenPrecalculated = false;
        this.statePropsPrecalculationError = null;
        this.renderedElement = null;
        this.finalMapDispatchToProps = null;
        this.finalMapStateToProps = null;
      };

      Connect.prototype.handleChange = function handleChange() {
        if (!this.unsubscribe) {
          return;
        }

        var storeState = this.store.getState();
        var prevStoreState = this.state.storeState;
        if (pure && prevStoreState === storeState) {
          return;
        }

        if (pure && !this.doStatePropsDependOnOwnProps) {
          var haveStatePropsChanged = tryCatch(this.updateStatePropsIfNeeded, this);
          if (!haveStatePropsChanged) {
            return;
          }
          if (haveStatePropsChanged === errorObject) {
            this.statePropsPrecalculationError = errorObject.value;
          }
          this.haveStatePropsBeenPrecalculated = true;
        }

        this.hasStoreStateChanged = true;
        this.setState({ storeState: storeState });
      };

      Connect.prototype.getWrappedInstance = function getWrappedInstance() {
        (0, _invariant2["default"])(withRef, 'To access the wrapped instance, you need to specify ' + '{ withRef: true } as the fourth argument of the connect() call.');

        return this.refs.wrappedInstance;
      };

      Connect.prototype.render = function render() {
        var haveOwnPropsChanged = this.haveOwnPropsChanged;
        var hasStoreStateChanged = this.hasStoreStateChanged;
        var haveStatePropsBeenPrecalculated = this.haveStatePropsBeenPrecalculated;
        var statePropsPrecalculationError = this.statePropsPrecalculationError;
        var renderedElement = this.renderedElement;

        this.haveOwnPropsChanged = false;
        this.hasStoreStateChanged = false;
        this.haveStatePropsBeenPrecalculated = false;
        this.statePropsPrecalculationError = null;

        if (statePropsPrecalculationError) {
          throw statePropsPrecalculationError;
        }

        var shouldUpdateStateProps = true;
        var shouldUpdateDispatchProps = true;
        if (pure && renderedElement) {
          shouldUpdateStateProps = hasStoreStateChanged || haveOwnPropsChanged && this.doStatePropsDependOnOwnProps;
          shouldUpdateDispatchProps = haveOwnPropsChanged && this.doDispatchPropsDependOnOwnProps;
        }

        var haveStatePropsChanged = false;
        var haveDispatchPropsChanged = false;
        if (haveStatePropsBeenPrecalculated) {
          haveStatePropsChanged = true;
        } else if (shouldUpdateStateProps) {
          haveStatePropsChanged = this.updateStatePropsIfNeeded();
        }
        if (shouldUpdateDispatchProps) {
          haveDispatchPropsChanged = this.updateDispatchPropsIfNeeded();
        }

        var haveMergedPropsChanged = true;
        if (haveStatePropsChanged || haveDispatchPropsChanged || haveOwnPropsChanged) {
          haveMergedPropsChanged = this.updateMergedPropsIfNeeded();
        } else {
          haveMergedPropsChanged = false;
        }

        if (!haveMergedPropsChanged && renderedElement) {
          return renderedElement;
        }

        if (withRef) {
          this.renderedElement = (0, _react.createElement)(WrappedComponent, _extends({}, this.mergedProps, {
            ref: 'wrappedInstance'
          }));
        } else {
          this.renderedElement = (0, _react.createElement)(WrappedComponent, this.mergedProps);
        }

        return this.renderedElement;
      };

      return Connect;
    }(_react.Component);

    Connect.displayName = connectDisplayName;
    Connect.WrappedComponent = WrappedComponent;
    Connect.contextTypes = {
      store: _storeShape2["default"]
    };
    Connect.propTypes = {
      store: _storeShape2["default"]
    };

    if (process.env.NODE_ENV !== 'production') {
      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
        if (this.version === version) {
          return;
        }

        // We are hot reloading!
        this.version = version;
        this.trySubscribe();
        this.clearCache();
      };
    }

    return (0, _hoistNonReactStatics2["default"])(Connect, WrappedComponent);
  };
}
}).call(this,require('_process'))

},{"../utils/shallowEqual":37,"../utils/storeShape":38,"../utils/warning":39,"../utils/wrapActionCreators":40,"_process":1,"hoist-non-react-statics":25,"invariant":26,"lodash/isPlainObject":31,"react":"react"}],36:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.connect = exports.Provider = undefined;

var _Provider = require('./components/Provider');

var _Provider2 = _interopRequireDefault(_Provider);

var _connect = require('./components/connect');

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports.Provider = _Provider2["default"];
exports.connect = _connect2["default"];
},{"./components/Provider":34,"./components/connect":35}],37:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = shallowEqual;
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}
},{}],38:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _react = require('react');

exports["default"] = _react.PropTypes.shape({
  subscribe: _react.PropTypes.func.isRequired,
  dispatch: _react.PropTypes.func.isRequired,
  getState: _react.PropTypes.func.isRequired
});
},{"react":"react"}],39:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that you can use this stack
    // to find the callsite that caused this warning to fire.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],40:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = wrapActionCreators;

var _redux = require('redux');

function wrapActionCreators(actionCreators) {
  return function (dispatch) {
    return (0, _redux.bindActionCreators)(actionCreators, dispatch);
  };
}
},{"redux":85}],41:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.loopAsync = loopAsync;
exports.mapAsync = mapAsync;
function loopAsync(turns, work, callback) {
  var currentTurn = 0,
      isDone = false;
  var sync = false,
      hasNext = false,
      doneArgs = void 0;

  function done() {
    isDone = true;
    if (sync) {
      // Iterate instead of recursing if possible.
      doneArgs = [].concat(Array.prototype.slice.call(arguments));
      return;
    }

    callback.apply(this, arguments);
  }

  function next() {
    if (isDone) {
      return;
    }

    hasNext = true;
    if (sync) {
      // Iterate instead of recursing if possible.
      return;
    }

    sync = true;

    while (!isDone && currentTurn < turns && hasNext) {
      hasNext = false;
      work.call(this, currentTurn++, next, done);
    }

    sync = false;

    if (isDone) {
      // This means the loop finished synchronously.
      callback.apply(this, doneArgs);
      return;
    }

    if (currentTurn >= turns && hasNext) {
      isDone = true;
      callback();
    }
  }

  next();
}

function mapAsync(array, work, callback) {
  var length = array.length;
  var values = [];

  if (length === 0) return callback(null, values);

  var isDone = false,
      doneCount = 0;

  function done(index, error, value) {
    if (isDone) return;

    if (error) {
      isDone = true;
      callback(error);
    } else {
      values[index] = value;

      isDone = ++doneCount === length;

      if (isDone) callback(null, values);
    }
  }

  array.forEach(function (item, index) {
    work(item, index, function (error, value) {
      done(index, error, value);
    });
  });
}
},{}],42:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _InternalPropTypes = require('./InternalPropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A mixin that adds the "history" instance variable to components.
 */
var History = {

  contextTypes: {
    history: _InternalPropTypes.history
  },

  componentWillMount: function componentWillMount() {
    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'the `History` mixin is deprecated, please access `context.router` with your own `contextTypes`. http://tiny.cc/router-historymixin') : void 0;
    this.history = this.context.history;
  }
};

exports.default = History;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./InternalPropTypes":46,"./routerWarning":75,"_process":1}],43:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Link = require('./Link');

var _Link2 = _interopRequireDefault(_Link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An <IndexLink> is used to link to an <IndexRoute>.
 */
var IndexLink = _react2.default.createClass({
  displayName: 'IndexLink',
  render: function render() {
    return _react2.default.createElement(_Link2.default, _extends({}, this.props, { onlyActiveOnIndex: true }));
  }
});

exports.default = IndexLink;
module.exports = exports['default'];
},{"./Link":48,"react":"react"}],44:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _Redirect = require('./Redirect');

var _Redirect2 = _interopRequireDefault(_Redirect);

var _InternalPropTypes = require('./InternalPropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _React$PropTypes = _react2.default.PropTypes;
var string = _React$PropTypes.string;
var object = _React$PropTypes.object;

/**
 * An <IndexRedirect> is used to redirect from an indexRoute.
 */

var IndexRedirect = _react2.default.createClass({
  displayName: 'IndexRedirect',


  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element, parentRoute) {
      /* istanbul ignore else: sanity check */
      if (parentRoute) {
        parentRoute.indexRoute = _Redirect2.default.createRouteFromReactElement(element);
      } else {
        process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'An <IndexRedirect> does not make sense at the root of your route config') : void 0;
      }
    }
  },

  propTypes: {
    to: string.isRequired,
    query: object,
    state: object,
    onEnter: _InternalPropTypes.falsy,
    children: _InternalPropTypes.falsy
  },

  /* istanbul ignore next: sanity check */
  render: function render() {
    !false ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<IndexRedirect> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
  }
});

exports.default = IndexRedirect;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./InternalPropTypes":46,"./Redirect":51,"./routerWarning":75,"_process":1,"invariant":26,"react":"react"}],45:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = require('./RouteUtils');

var _InternalPropTypes = require('./InternalPropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var func = _react2.default.PropTypes.func;

/**
 * An <IndexRoute> is used to specify its parent's <Route indexRoute> in
 * a JSX route config.
 */

var IndexRoute = _react2.default.createClass({
  displayName: 'IndexRoute',


  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element, parentRoute) {
      /* istanbul ignore else: sanity check */
      if (parentRoute) {
        parentRoute.indexRoute = (0, _RouteUtils.createRouteFromReactElement)(element);
      } else {
        process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'An <IndexRoute> does not make sense at the root of your route config') : void 0;
      }
    }
  },

  propTypes: {
    path: _InternalPropTypes.falsy,
    component: _InternalPropTypes.component,
    components: _InternalPropTypes.components,
    getComponent: func,
    getComponents: func
  },

  /* istanbul ignore next: sanity check */
  render: function render() {
    !false ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<IndexRoute> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
  }
});

exports.default = IndexRoute;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./InternalPropTypes":46,"./RouteUtils":54,"./routerWarning":75,"_process":1,"invariant":26,"react":"react"}],46:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.routes = exports.route = exports.components = exports.component = exports.history = undefined;
exports.falsy = falsy;

var _react = require('react');

var func = _react.PropTypes.func;
var object = _react.PropTypes.object;
var arrayOf = _react.PropTypes.arrayOf;
var oneOfType = _react.PropTypes.oneOfType;
var element = _react.PropTypes.element;
var shape = _react.PropTypes.shape;
var string = _react.PropTypes.string;
function falsy(props, propName, componentName) {
  if (props[propName]) return new Error('<' + componentName + '> should not have a "' + propName + '" prop');
}

var history = exports.history = shape({
  listen: func.isRequired,
  push: func.isRequired,
  replace: func.isRequired,
  go: func.isRequired,
  goBack: func.isRequired,
  goForward: func.isRequired
});

var component = exports.component = oneOfType([func, string]);
var components = exports.components = oneOfType([component, object]);
var route = exports.route = oneOfType([object, element]);
var routes = exports.routes = oneOfType([route, arrayOf(route)]);
},{"react":"react"}],47:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var object = _react2.default.PropTypes.object;

/**
 * The Lifecycle mixin adds the routerWillLeave lifecycle method to a
 * component that may be used to cancel a transition or prompt the user
 * for confirmation.
 *
 * On standard transitions, routerWillLeave receives a single argument: the
 * location we're transitioning to. To cancel the transition, return false.
 * To prompt the user for confirmation, return a prompt message (string).
 *
 * During the beforeunload event (assuming you're using the useBeforeUnload
 * history enhancer), routerWillLeave does not receive a location object
 * because it isn't possible for us to know the location we're transitioning
 * to. In this case routerWillLeave must return a prompt message to prevent
 * the user from closing the window/tab.
 */

var Lifecycle = {

  contextTypes: {
    history: object.isRequired,
    // Nested children receive the route as context, either
    // set by the route component using the RouteContext mixin
    // or by some other ancestor.
    route: object
  },

  propTypes: {
    // Route components receive the route object as a prop.
    route: object
  },

  componentDidMount: function componentDidMount() {
    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'the `Lifecycle` mixin is deprecated, please use `context.router.setRouteLeaveHook(route, hook)`. http://tiny.cc/router-lifecyclemixin') : void 0;
    !this.routerWillLeave ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'The Lifecycle mixin requires you to define a routerWillLeave method') : (0, _invariant2.default)(false) : void 0;

    var route = this.props.route || this.context.route;

    !route ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'The Lifecycle mixin must be used on either a) a <Route component> or ' + 'b) a descendant of a <Route component> that uses the RouteContext mixin') : (0, _invariant2.default)(false) : void 0;

    this._unlistenBeforeLeavingRoute = this.context.history.listenBeforeLeavingRoute(route, this.routerWillLeave);
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this._unlistenBeforeLeavingRoute) this._unlistenBeforeLeavingRoute();
  }
};

exports.default = Lifecycle;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./routerWarning":75,"_process":1,"invariant":26,"react":"react"}],48:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _PropTypes = require('./PropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _React$PropTypes = _react2.default.PropTypes;
var bool = _React$PropTypes.bool;
var object = _React$PropTypes.object;
var string = _React$PropTypes.string;
var func = _React$PropTypes.func;
var oneOfType = _React$PropTypes.oneOfType;


function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

// TODO: De-duplicate against hasAnyProperties in createTransitionManager.
function isEmptyObject(object) {
  for (var p in object) {
    if (Object.prototype.hasOwnProperty.call(object, p)) return false;
  }return true;
}

function createLocationDescriptor(to, _ref) {
  var query = _ref.query;
  var hash = _ref.hash;
  var state = _ref.state;

  if (query || hash || state) {
    return { pathname: to, query: query, hash: hash, state: state };
  }

  return to;
}

/**
 * A <Link> is used to create an <a> element that links to a route.
 * When that route is active, the link gets the value of its
 * activeClassName prop.
 *
 * For example, assuming you have the following route:
 *
 *   <Route path="/posts/:postID" component={Post} />
 *
 * You could use the following component to link to that route:
 *
 *   <Link to={`/posts/${post.id}`} />
 *
 * Links may pass along location state and/or query string parameters
 * in the state/query props, respectively.
 *
 *   <Link ... query={{ show: true }} state={{ the: 'state' }} />
 */
var Link = _react2.default.createClass({
  displayName: 'Link',


  contextTypes: {
    router: _PropTypes.routerShape
  },

  propTypes: {
    to: oneOfType([string, object]),
    query: object,
    hash: string,
    state: object,
    activeStyle: object,
    activeClassName: string,
    onlyActiveOnIndex: bool.isRequired,
    onClick: func,
    target: string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      onlyActiveOnIndex: false,
      style: {}
    };
  },
  handleClick: function handleClick(event) {
    if (this.props.onClick) this.props.onClick(event);

    if (event.defaultPrevented) return;

    !this.context.router ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<Link>s rendered outside of a router context cannot navigate.') : (0, _invariant2.default)(false) : void 0;

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return;

    // If target prop is set (e.g. to "_blank"), let browser handle link.
    /* istanbul ignore if: untestable with Karma */
    if (this.props.target) return;

    event.preventDefault();

    var _props = this.props;
    var to = _props.to;
    var query = _props.query;
    var hash = _props.hash;
    var state = _props.state;

    var location = createLocationDescriptor(to, { query: query, hash: hash, state: state });

    this.context.router.push(location);
  },
  render: function render() {
    var _props2 = this.props;
    var to = _props2.to;
    var query = _props2.query;
    var hash = _props2.hash;
    var state = _props2.state;
    var activeClassName = _props2.activeClassName;
    var activeStyle = _props2.activeStyle;
    var onlyActiveOnIndex = _props2.onlyActiveOnIndex;

    var props = _objectWithoutProperties(_props2, ['to', 'query', 'hash', 'state', 'activeClassName', 'activeStyle', 'onlyActiveOnIndex']);

    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(!(query || hash || state), 'the `query`, `hash`, and `state` props on `<Link>` are deprecated, use `<Link to={{ pathname, query, hash, state }}/>. http://tiny.cc/router-isActivedeprecated') : void 0;

    // Ignore if rendered outside the context of router, simplifies unit testing.
    var router = this.context.router;


    if (router) {
      // If user does not specify a `to` prop, return an empty anchor tag.
      if (to == null) {
        return _react2.default.createElement('a', props);
      }

      var location = createLocationDescriptor(to, { query: query, hash: hash, state: state });
      props.href = router.createHref(location);

      if (activeClassName || activeStyle != null && !isEmptyObject(activeStyle)) {
        if (router.isActive(location, onlyActiveOnIndex)) {
          if (activeClassName) {
            if (props.className) {
              props.className += ' ' + activeClassName;
            } else {
              props.className = activeClassName;
            }
          }

          if (activeStyle) props.style = _extends({}, props.style, activeStyle);
        }
      }
    }

    return _react2.default.createElement('a', _extends({}, props, { onClick: this.handleClick }));
  }
});

exports.default = Link;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./PropTypes":50,"./routerWarning":75,"_process":1,"invariant":26,"react":"react"}],49:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.compilePattern = compilePattern;
exports.matchPattern = matchPattern;
exports.getParamNames = getParamNames;
exports.getParams = getParams;
exports.formatPattern = formatPattern;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function _compilePattern(pattern) {
  var regexpSource = '';
  var paramNames = [];
  var tokens = [];

  var match = void 0,
      lastIndex = 0,
      matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*\*|\*|\(|\)/g;
  while (match = matcher.exec(pattern)) {
    if (match.index !== lastIndex) {
      tokens.push(pattern.slice(lastIndex, match.index));
      regexpSource += escapeRegExp(pattern.slice(lastIndex, match.index));
    }

    if (match[1]) {
      regexpSource += '([^/]+)';
      paramNames.push(match[1]);
    } else if (match[0] === '**') {
      regexpSource += '(.*)';
      paramNames.push('splat');
    } else if (match[0] === '*') {
      regexpSource += '(.*?)';
      paramNames.push('splat');
    } else if (match[0] === '(') {
      regexpSource += '(?:';
    } else if (match[0] === ')') {
      regexpSource += ')?';
    }

    tokens.push(match[0]);

    lastIndex = matcher.lastIndex;
  }

  if (lastIndex !== pattern.length) {
    tokens.push(pattern.slice(lastIndex, pattern.length));
    regexpSource += escapeRegExp(pattern.slice(lastIndex, pattern.length));
  }

  return {
    pattern: pattern,
    regexpSource: regexpSource,
    paramNames: paramNames,
    tokens: tokens
  };
}

var CompiledPatternsCache = Object.create(null);

function compilePattern(pattern) {
  if (!CompiledPatternsCache[pattern]) CompiledPatternsCache[pattern] = _compilePattern(pattern);

  return CompiledPatternsCache[pattern];
}

/**
 * Attempts to match a pattern on the given pathname. Patterns may use
 * the following special characters:
 *
 * - :paramName     Matches a URL segment up to the next /, ?, or #. The
 *                  captured string is considered a "param"
 * - ()             Wraps a segment of the URL that is optional
 * - *              Consumes (non-greedy) all characters up to the next
 *                  character in the pattern, or to the end of the URL if
 *                  there is none
 * - **             Consumes (greedy) all characters up to the next character
 *                  in the pattern, or to the end of the URL if there is none
 *
 *  The function calls callback(error, matched) when finished.
 * The return value is an object with the following properties:
 *
 * - remainingPathname
 * - paramNames
 * - paramValues
 */
function matchPattern(pattern, pathname) {
  // Ensure pattern starts with leading slash for consistency with pathname.
  if (pattern.charAt(0) !== '/') {
    pattern = '/' + pattern;
  }

  var _compilePattern2 = compilePattern(pattern);

  var regexpSource = _compilePattern2.regexpSource;
  var paramNames = _compilePattern2.paramNames;
  var tokens = _compilePattern2.tokens;


  if (pattern.charAt(pattern.length - 1) !== '/') {
    regexpSource += '/?'; // Allow optional path separator at end.
  }

  // Special-case patterns like '*' for catch-all routes.
  if (tokens[tokens.length - 1] === '*') {
    regexpSource += '$';
  }

  var match = pathname.match(new RegExp('^' + regexpSource, 'i'));
  if (match == null) {
    return null;
  }

  var matchedPath = match[0];
  var remainingPathname = pathname.substr(matchedPath.length);

  if (remainingPathname) {
    // Require that the match ends at a path separator, if we didn't match
    // the full path, so any remaining pathname is a new path segment.
    if (matchedPath.charAt(matchedPath.length - 1) !== '/') {
      return null;
    }

    // If there is a remaining pathname, treat the path separator as part of
    // the remaining pathname for properly continuing the match.
    remainingPathname = '/' + remainingPathname;
  }

  return {
    remainingPathname: remainingPathname,
    paramNames: paramNames,
    paramValues: match.slice(1).map(function (v) {
      return v && decodeURIComponent(v);
    })
  };
}

function getParamNames(pattern) {
  return compilePattern(pattern).paramNames;
}

function getParams(pattern, pathname) {
  var match = matchPattern(pattern, pathname);
  if (!match) {
    return null;
  }

  var paramNames = match.paramNames;
  var paramValues = match.paramValues;

  var params = {};

  paramNames.forEach(function (paramName, index) {
    params[paramName] = paramValues[index];
  });

  return params;
}

/**
 * Returns a version of the given pattern with params interpolated. Throws
 * if there is a dynamic segment of the pattern for which there is no param.
 */
function formatPattern(pattern, params) {
  params = params || {};

  var _compilePattern3 = compilePattern(pattern);

  var tokens = _compilePattern3.tokens;

  var parenCount = 0,
      pathname = '',
      splatIndex = 0;

  var token = void 0,
      paramName = void 0,
      paramValue = void 0;
  for (var i = 0, len = tokens.length; i < len; ++i) {
    token = tokens[i];

    if (token === '*' || token === '**') {
      paramValue = Array.isArray(params.splat) ? params.splat[splatIndex++] : params.splat;

      !(paramValue != null || parenCount > 0) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Missing splat #%s for path "%s"', splatIndex, pattern) : (0, _invariant2.default)(false) : void 0;

      if (paramValue != null) pathname += encodeURI(paramValue);
    } else if (token === '(') {
      parenCount += 1;
    } else if (token === ')') {
      parenCount -= 1;
    } else if (token.charAt(0) === ':') {
      paramName = token.substring(1);
      paramValue = params[paramName];

      !(paramValue != null || parenCount > 0) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Missing "%s" parameter for path "%s"', paramName, pattern) : (0, _invariant2.default)(false) : void 0;

      if (paramValue != null) pathname += encodeURIComponent(paramValue);
    } else {
      pathname += token;
    }
  }

  return pathname.replace(/\/+/g, '/');
}
}).call(this,require('_process'))

},{"_process":1,"invariant":26}],50:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.router = exports.routes = exports.route = exports.components = exports.component = exports.location = exports.history = exports.falsy = exports.locationShape = exports.routerShape = undefined;

var _react = require('react');

var _deprecateObjectProperties = require('./deprecateObjectProperties');

var _deprecateObjectProperties2 = _interopRequireDefault(_deprecateObjectProperties);

var _InternalPropTypes = require('./InternalPropTypes');

var InternalPropTypes = _interopRequireWildcard(_InternalPropTypes);

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var func = _react.PropTypes.func;
var object = _react.PropTypes.object;
var shape = _react.PropTypes.shape;
var string = _react.PropTypes.string;
var routerShape = exports.routerShape = shape({
  push: func.isRequired,
  replace: func.isRequired,
  go: func.isRequired,
  goBack: func.isRequired,
  goForward: func.isRequired,
  setRouteLeaveHook: func.isRequired,
  isActive: func.isRequired
});

var locationShape = exports.locationShape = shape({
  pathname: string.isRequired,
  search: string.isRequired,
  state: object,
  action: string.isRequired,
  key: string
});

// Deprecated stuff below:

var falsy = exports.falsy = InternalPropTypes.falsy;
var history = exports.history = InternalPropTypes.history;
var location = exports.location = locationShape;
var component = exports.component = InternalPropTypes.component;
var components = exports.components = InternalPropTypes.components;
var route = exports.route = InternalPropTypes.route;
var routes = exports.routes = InternalPropTypes.routes;
var router = exports.router = routerShape;

if (process.env.NODE_ENV !== 'production') {
  (function () {
    var deprecatePropType = function deprecatePropType(propType, message) {
      return function () {
        process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, message) : void 0;
        return propType.apply(undefined, arguments);
      };
    };

    var deprecateInternalPropType = function deprecateInternalPropType(propType) {
      return deprecatePropType(propType, 'This prop type is not intended for external use, and was previously exported by mistake. These internal prop types are deprecated for external use, and will be removed in a later version.');
    };

    var deprecateRenamedPropType = function deprecateRenamedPropType(propType, name) {
      return deprecatePropType(propType, 'The `' + name + '` prop type is now exported as `' + name + 'Shape` to avoid name conflicts. This export is deprecated and will be removed in a later version.');
    };

    exports.falsy = falsy = deprecateInternalPropType(falsy);
    exports.history = history = deprecateInternalPropType(history);
    exports.component = component = deprecateInternalPropType(component);
    exports.components = components = deprecateInternalPropType(components);
    exports.route = route = deprecateInternalPropType(route);
    exports.routes = routes = deprecateInternalPropType(routes);

    exports.location = location = deprecateRenamedPropType(location, 'location');
    exports.router = router = deprecateRenamedPropType(router, 'router');
  })();
}

var defaultExport = {
  falsy: falsy,
  history: history,
  location: location,
  component: component,
  components: components,
  route: route,
  // For some reason, routes was never here.
  router: router
};

if (process.env.NODE_ENV !== 'production') {
  defaultExport = (0, _deprecateObjectProperties2.default)(defaultExport, 'The default export from `react-router/lib/PropTypes` is deprecated. Please use the named exports instead.');
}

exports.default = defaultExport;
}).call(this,require('_process'))

},{"./InternalPropTypes":46,"./deprecateObjectProperties":66,"./routerWarning":75,"_process":1,"react":"react"}],51:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = require('./RouteUtils');

var _PatternUtils = require('./PatternUtils');

var _InternalPropTypes = require('./InternalPropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _React$PropTypes = _react2.default.PropTypes;
var string = _React$PropTypes.string;
var object = _React$PropTypes.object;

/**
 * A <Redirect> is used to declare another URL path a client should
 * be sent to when they request a given URL.
 *
 * Redirects are placed alongside routes in the route configuration
 * and are traversed in the same manner.
 */

var Redirect = _react2.default.createClass({
  displayName: 'Redirect',


  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element) {
      var route = (0, _RouteUtils.createRouteFromReactElement)(element);

      if (route.from) route.path = route.from;

      route.onEnter = function (nextState, replace) {
        var location = nextState.location;
        var params = nextState.params;


        var pathname = void 0;
        if (route.to.charAt(0) === '/') {
          pathname = (0, _PatternUtils.formatPattern)(route.to, params);
        } else if (!route.to) {
          pathname = location.pathname;
        } else {
          var routeIndex = nextState.routes.indexOf(route);
          var parentPattern = Redirect.getRoutePattern(nextState.routes, routeIndex - 1);
          var pattern = parentPattern.replace(/\/*$/, '/') + route.to;
          pathname = (0, _PatternUtils.formatPattern)(pattern, params);
        }

        replace({
          pathname: pathname,
          query: route.query || location.query,
          state: route.state || location.state
        });
      };

      return route;
    },
    getRoutePattern: function getRoutePattern(routes, routeIndex) {
      var parentPattern = '';

      for (var i = routeIndex; i >= 0; i--) {
        var route = routes[i];
        var pattern = route.path || '';

        parentPattern = pattern.replace(/\/*$/, '/') + parentPattern;

        if (pattern.indexOf('/') === 0) break;
      }

      return '/' + parentPattern;
    }
  },

  propTypes: {
    path: string,
    from: string, // Alias for path
    to: string.isRequired,
    query: object,
    state: object,
    onEnter: _InternalPropTypes.falsy,
    children: _InternalPropTypes.falsy
  },

  /* istanbul ignore next: sanity check */
  render: function render() {
    !false ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<Redirect> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
  }
});

exports.default = Redirect;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./InternalPropTypes":46,"./PatternUtils":49,"./RouteUtils":54,"_process":1,"invariant":26,"react":"react"}],52:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = require('./RouteUtils');

var _InternalPropTypes = require('./InternalPropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _React$PropTypes = _react2.default.PropTypes;
var string = _React$PropTypes.string;
var func = _React$PropTypes.func;

/**
 * A <Route> is used to declare which components are rendered to the
 * page when the URL matches a given pattern.
 *
 * Routes are arranged in a nested tree structure. When a new URL is
 * requested, the tree is searched depth-first to find a route whose
 * path matches the URL.  When one is found, all routes in the tree
 * that lead to it are considered "active" and their components are
 * rendered into the DOM, nested in the same order as in the tree.
 */

var Route = _react2.default.createClass({
  displayName: 'Route',


  statics: {
    createRouteFromReactElement: _RouteUtils.createRouteFromReactElement
  },

  propTypes: {
    path: string,
    component: _InternalPropTypes.component,
    components: _InternalPropTypes.components,
    getComponent: func,
    getComponents: func
  },

  /* istanbul ignore next: sanity check */
  render: function render() {
    !false ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<Route> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
  }
});

exports.default = Route;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./InternalPropTypes":46,"./RouteUtils":54,"_process":1,"invariant":26,"react":"react"}],53:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var object = _react2.default.PropTypes.object;

/**
 * The RouteContext mixin provides a convenient way for route
 * components to set the route in context. This is needed for
 * routes that render elements that want to use the Lifecycle
 * mixin to prevent transitions.
 */

var RouteContext = {

  propTypes: {
    route: object.isRequired
  },

  childContextTypes: {
    route: object.isRequired
  },

  getChildContext: function getChildContext() {
    return {
      route: this.props.route
    };
  },
  componentWillMount: function componentWillMount() {
    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'The `RouteContext` mixin is deprecated. You can provide `this.props.route` on context with your own `contextTypes`. http://tiny.cc/router-routecontextmixin') : void 0;
  }
};

exports.default = RouteContext;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./routerWarning":75,"_process":1,"react":"react"}],54:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.isReactChildren = isReactChildren;
exports.createRouteFromReactElement = createRouteFromReactElement;
exports.createRoutesFromReactChildren = createRoutesFromReactChildren;
exports.createRoutes = createRoutes;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValidChild(object) {
  return object == null || _react2.default.isValidElement(object);
}

function isReactChildren(object) {
  return isValidChild(object) || Array.isArray(object) && object.every(isValidChild);
}

function createRoute(defaultProps, props) {
  return _extends({}, defaultProps, props);
}

function createRouteFromReactElement(element) {
  var type = element.type;
  var route = createRoute(type.defaultProps, element.props);

  if (route.children) {
    var childRoutes = createRoutesFromReactChildren(route.children, route);

    if (childRoutes.length) route.childRoutes = childRoutes;

    delete route.children;
  }

  return route;
}

/**
 * Creates and returns a routes object from the given ReactChildren. JSX
 * provides a convenient way to visualize how routes in the hierarchy are
 * nested.
 *
 *   import { Route, createRoutesFromReactChildren } from 'react-router'
 *
 *   const routes = createRoutesFromReactChildren(
 *     <Route component={App}>
 *       <Route path="home" component={Dashboard}/>
 *       <Route path="news" component={NewsFeed}/>
 *     </Route>
 *   )
 *
 * Note: This method is automatically used when you provide <Route> children
 * to a <Router> component.
 */
function createRoutesFromReactChildren(children, parentRoute) {
  var routes = [];

  _react2.default.Children.forEach(children, function (element) {
    if (_react2.default.isValidElement(element)) {
      // Component classes may have a static create* method.
      if (element.type.createRouteFromReactElement) {
        var route = element.type.createRouteFromReactElement(element, parentRoute);

        if (route) routes.push(route);
      } else {
        routes.push(createRouteFromReactElement(element));
      }
    }
  });

  return routes;
}

/**
 * Creates and returns an array of routes from the given object which
 * may be a JSX route, a plain object route, or an array of either.
 */
function createRoutes(routes) {
  if (isReactChildren(routes)) {
    routes = createRoutesFromReactChildren(routes);
  } else if (routes && !Array.isArray(routes)) {
    routes = [routes];
  }

  return routes;
}
},{"react":"react"}],55:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createHashHistory = require('history/lib/createHashHistory');

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _useQueries = require('history/lib/useQueries');

var _useQueries2 = _interopRequireDefault(_useQueries);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createTransitionManager = require('./createTransitionManager');

var _createTransitionManager2 = _interopRequireDefault(_createTransitionManager);

var _InternalPropTypes = require('./InternalPropTypes');

var _RouterContext = require('./RouterContext');

var _RouterContext2 = _interopRequireDefault(_RouterContext);

var _RouteUtils = require('./RouteUtils');

var _RouterUtils = require('./RouterUtils');

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function isDeprecatedHistory(history) {
  return !history || !history.__v2_compatible__;
}

/* istanbul ignore next: sanity check */
function isUnsupportedHistory(history) {
  // v3 histories expose getCurrentLocation, but aren't currently supported.
  return history && history.getCurrentLocation;
}

var _React$PropTypes = _react2.default.PropTypes;
var func = _React$PropTypes.func;
var object = _React$PropTypes.object;

/**
 * A <Router> is a high-level API for automatically setting up
 * a router that renders a <RouterContext> with all the props
 * it needs each time the URL changes.
 */

var Router = _react2.default.createClass({
  displayName: 'Router',


  propTypes: {
    history: object,
    children: _InternalPropTypes.routes,
    routes: _InternalPropTypes.routes, // alias for children
    render: func,
    createElement: func,
    onError: func,
    onUpdate: func,

    // Deprecated:
    parseQueryString: func,
    stringifyQuery: func,

    // PRIVATE: For client-side rehydration of server match.
    matchContext: object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      render: function render(props) {
        return _react2.default.createElement(_RouterContext2.default, props);
      }
    };
  },
  getInitialState: function getInitialState() {
    return {
      location: null,
      routes: null,
      params: null,
      components: null
    };
  },
  handleError: function handleError(error) {
    if (this.props.onError) {
      this.props.onError.call(this, error);
    } else {
      // Throw errors by default so we don't silently swallow them!
      throw error; // This error probably occurred in getChildRoutes or getComponents.
    }
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    var _props = this.props;
    var parseQueryString = _props.parseQueryString;
    var stringifyQuery = _props.stringifyQuery;

    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(!(parseQueryString || stringifyQuery), '`parseQueryString` and `stringifyQuery` are deprecated. Please create a custom history. http://tiny.cc/router-customquerystring') : void 0;

    var _createRouterObjects = this.createRouterObjects();

    var history = _createRouterObjects.history;
    var transitionManager = _createRouterObjects.transitionManager;
    var router = _createRouterObjects.router;


    this._unlisten = transitionManager.listen(function (error, state) {
      if (error) {
        _this.handleError(error);
      } else {
        _this.setState(state, _this.props.onUpdate);
      }
    });

    this.history = history;
    this.router = router;
  },
  createRouterObjects: function createRouterObjects() {
    var matchContext = this.props.matchContext;

    if (matchContext) {
      return matchContext;
    }

    var history = this.props.history;
    var _props2 = this.props;
    var routes = _props2.routes;
    var children = _props2.children;


    !!isUnsupportedHistory(history) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'You have provided a history object created with history v3.x. ' + 'This version of React Router is not compatible with v3 history ' + 'objects. Please use history v2.x instead.') : (0, _invariant2.default)(false) : void 0;

    if (isDeprecatedHistory(history)) {
      history = this.wrapDeprecatedHistory(history);
    }

    var transitionManager = (0, _createTransitionManager2.default)(history, (0, _RouteUtils.createRoutes)(routes || children));
    var router = (0, _RouterUtils.createRouterObject)(history, transitionManager);
    var routingHistory = (0, _RouterUtils.createRoutingHistory)(history, transitionManager);

    return { history: routingHistory, transitionManager: transitionManager, router: router };
  },
  wrapDeprecatedHistory: function wrapDeprecatedHistory(history) {
    var _props3 = this.props;
    var parseQueryString = _props3.parseQueryString;
    var stringifyQuery = _props3.stringifyQuery;


    var createHistory = void 0;
    if (history) {
      process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'It appears you have provided a deprecated history object to `<Router/>`, please use a history provided by ' + 'React Router with `import { browserHistory } from \'react-router\'` or `import { hashHistory } from \'react-router\'`. ' + 'If you are using a custom history please create it with `useRouterHistory`, see http://tiny.cc/router-usinghistory for details.') : void 0;
      createHistory = function createHistory() {
        return history;
      };
    } else {
      process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, '`Router` no longer defaults the history prop to hash history. Please use the `hashHistory` singleton instead. http://tiny.cc/router-defaulthistory') : void 0;
      createHistory = _createHashHistory2.default;
    }

    return (0, _useQueries2.default)(createHistory)({ parseQueryString: parseQueryString, stringifyQuery: stringifyQuery });
  },


  /* istanbul ignore next: sanity check */
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(nextProps.history === this.props.history, 'You cannot change <Router history>; it will be ignored') : void 0;

    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)((nextProps.routes || nextProps.children) === (this.props.routes || this.props.children), 'You cannot change <Router routes>; it will be ignored') : void 0;
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this._unlisten) this._unlisten();
  },
  render: function render() {
    var _state = this.state;
    var location = _state.location;
    var routes = _state.routes;
    var params = _state.params;
    var components = _state.components;
    var _props4 = this.props;
    var createElement = _props4.createElement;
    var render = _props4.render;

    var props = _objectWithoutProperties(_props4, ['createElement', 'render']);

    if (location == null) return null; // Async match

    // Only forward non-Router-specific props to routing context, as those are
    // the only ones that might be custom routing context props.
    Object.keys(Router.propTypes).forEach(function (propType) {
      return delete props[propType];
    });

    return render(_extends({}, props, {
      history: this.history,
      router: this.router,
      location: location,
      routes: routes,
      params: params,
      components: components,
      createElement: createElement
    }));
  }
});

exports.default = Router;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./InternalPropTypes":46,"./RouteUtils":54,"./RouterContext":56,"./RouterUtils":57,"./createTransitionManager":65,"./routerWarning":75,"_process":1,"history/lib/createHashHistory":16,"history/lib/useQueries":23,"invariant":26,"react":"react"}],56:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _deprecateObjectProperties = require('./deprecateObjectProperties');

var _deprecateObjectProperties2 = _interopRequireDefault(_deprecateObjectProperties);

var _getRouteParams = require('./getRouteParams');

var _getRouteParams2 = _interopRequireDefault(_getRouteParams);

var _RouteUtils = require('./RouteUtils');

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _React$PropTypes = _react2.default.PropTypes;
var array = _React$PropTypes.array;
var func = _React$PropTypes.func;
var object = _React$PropTypes.object;

/**
 * A <RouterContext> renders the component tree for a given router state
 * and sets the history object and the current location in context.
 */

var RouterContext = _react2.default.createClass({
  displayName: 'RouterContext',


  propTypes: {
    history: object,
    router: object.isRequired,
    location: object.isRequired,
    routes: array.isRequired,
    params: object.isRequired,
    components: array.isRequired,
    createElement: func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      createElement: _react2.default.createElement
    };
  },


  childContextTypes: {
    history: object,
    location: object.isRequired,
    router: object.isRequired
  },

  getChildContext: function getChildContext() {
    var _props = this.props;
    var router = _props.router;
    var history = _props.history;
    var location = _props.location;

    if (!router) {
      process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, '`<RouterContext>` expects a `router` rather than a `history`') : void 0;

      router = _extends({}, history, {
        setRouteLeaveHook: history.listenBeforeLeavingRoute
      });
      delete router.listenBeforeLeavingRoute;
    }

    if (process.env.NODE_ENV !== 'production') {
      location = (0, _deprecateObjectProperties2.default)(location, '`context.location` is deprecated, please use a route component\'s `props.location` instead. http://tiny.cc/router-accessinglocation');
    }

    return { history: history, location: location, router: router };
  },
  createElement: function createElement(component, props) {
    return component == null ? null : this.props.createElement(component, props);
  },
  render: function render() {
    var _this = this;

    var _props2 = this.props;
    var history = _props2.history;
    var location = _props2.location;
    var routes = _props2.routes;
    var params = _props2.params;
    var components = _props2.components;

    var element = null;

    if (components) {
      element = components.reduceRight(function (element, components, index) {
        if (components == null) return element; // Don't create new children; use the grandchildren.

        var route = routes[index];
        var routeParams = (0, _getRouteParams2.default)(route, params);
        var props = {
          history: history,
          location: location,
          params: params,
          route: route,
          routeParams: routeParams,
          routes: routes
        };

        if ((0, _RouteUtils.isReactChildren)(element)) {
          props.children = element;
        } else if (element) {
          for (var prop in element) {
            if (Object.prototype.hasOwnProperty.call(element, prop)) props[prop] = element[prop];
          }
        }

        if ((typeof components === 'undefined' ? 'undefined' : _typeof(components)) === 'object') {
          var elements = {};

          for (var key in components) {
            if (Object.prototype.hasOwnProperty.call(components, key)) {
              // Pass through the key as a prop to createElement to allow
              // custom createElement functions to know which named component
              // they're rendering, for e.g. matching up to fetched data.
              elements[key] = _this.createElement(components[key], _extends({
                key: key }, props));
            }
          }

          return elements;
        }

        return _this.createElement(components, props);
      }, element);
    }

    !(element === null || element === false || _react2.default.isValidElement(element)) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'The root route must render a single element') : (0, _invariant2.default)(false) : void 0;

    return element;
  }
});

exports.default = RouterContext;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./RouteUtils":54,"./deprecateObjectProperties":66,"./getRouteParams":68,"./routerWarning":75,"_process":1,"invariant":26,"react":"react"}],57:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createRouterObject = createRouterObject;
exports.createRoutingHistory = createRoutingHistory;

var _deprecateObjectProperties = require('./deprecateObjectProperties');

var _deprecateObjectProperties2 = _interopRequireDefault(_deprecateObjectProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createRouterObject(history, transitionManager) {
  return _extends({}, history, {
    setRouteLeaveHook: transitionManager.listenBeforeLeavingRoute,
    isActive: transitionManager.isActive
  });
}

// deprecated
function createRoutingHistory(history, transitionManager) {
  history = _extends({}, history, transitionManager);

  if (process.env.NODE_ENV !== 'production') {
    history = (0, _deprecateObjectProperties2.default)(history, '`props.history` and `context.history` are deprecated. Please use `context.router`. http://tiny.cc/router-contextchanges');
  }

  return history;
}
}).call(this,require('_process'))

},{"./deprecateObjectProperties":66,"_process":1}],58:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RouterContext = require('./RouterContext');

var _RouterContext2 = _interopRequireDefault(_RouterContext);

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RoutingContext = _react2.default.createClass({
  displayName: 'RoutingContext',
  componentWillMount: function componentWillMount() {
    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, '`RoutingContext` has been renamed to `RouterContext`. Please use `import { RouterContext } from \'react-router\'`. http://tiny.cc/router-routercontext') : void 0;
  },
  render: function render() {
    return _react2.default.createElement(_RouterContext2.default, this.props);
  }
});

exports.default = RoutingContext;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./RouterContext":56,"./routerWarning":75,"_process":1,"react":"react"}],59:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.runEnterHooks = runEnterHooks;
exports.runChangeHooks = runChangeHooks;
exports.runLeaveHooks = runLeaveHooks;

var _AsyncUtils = require('./AsyncUtils');

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTransitionHook(hook, route, asyncArity) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    hook.apply(route, args);

    if (hook.length < asyncArity) {
      var callback = args[args.length - 1];
      // Assume hook executes synchronously and
      // automatically call the callback.
      callback();
    }
  };
}

function getEnterHooks(routes) {
  return routes.reduce(function (hooks, route) {
    if (route.onEnter) hooks.push(createTransitionHook(route.onEnter, route, 3));

    return hooks;
  }, []);
}

function getChangeHooks(routes) {
  return routes.reduce(function (hooks, route) {
    if (route.onChange) hooks.push(createTransitionHook(route.onChange, route, 4));
    return hooks;
  }, []);
}

function runTransitionHooks(length, iter, callback) {
  if (!length) {
    callback();
    return;
  }

  var redirectInfo = void 0;
  function replace(location, deprecatedPathname, deprecatedQuery) {
    if (deprecatedPathname) {
      process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, '`replaceState(state, pathname, query) is deprecated; use `replace(location)` with a location descriptor instead. http://tiny.cc/router-isActivedeprecated') : void 0;
      redirectInfo = {
        pathname: deprecatedPathname,
        query: deprecatedQuery,
        state: location
      };

      return;
    }

    redirectInfo = location;
  }

  (0, _AsyncUtils.loopAsync)(length, function (index, next, done) {
    iter(index, replace, function (error) {
      if (error || redirectInfo) {
        done(error, redirectInfo); // No need to continue.
      } else {
        next();
      }
    });
  }, callback);
}

/**
 * Runs all onEnter hooks in the given array of routes in order
 * with onEnter(nextState, replace, callback) and calls
 * callback(error, redirectInfo) when finished. The first hook
 * to use replace short-circuits the loop.
 *
 * If a hook needs to run asynchronously, it may use the callback
 * function. However, doing so will cause the transition to pause,
 * which could lead to a non-responsive UI if the hook is slow.
 */
function runEnterHooks(routes, nextState, callback) {
  var hooks = getEnterHooks(routes);
  return runTransitionHooks(hooks.length, function (index, replace, next) {
    hooks[index](nextState, replace, next);
  }, callback);
}

/**
 * Runs all onChange hooks in the given array of routes in order
 * with onChange(prevState, nextState, replace, callback) and calls
 * callback(error, redirectInfo) when finished. The first hook
 * to use replace short-circuits the loop.
 *
 * If a hook needs to run asynchronously, it may use the callback
 * function. However, doing so will cause the transition to pause,
 * which could lead to a non-responsive UI if the hook is slow.
 */
function runChangeHooks(routes, state, nextState, callback) {
  var hooks = getChangeHooks(routes);
  return runTransitionHooks(hooks.length, function (index, replace, next) {
    hooks[index](state, nextState, replace, next);
  }, callback);
}

/**
 * Runs all onLeave hooks in the given array of routes in order.
 */
function runLeaveHooks(routes, prevState) {
  for (var i = 0, len = routes.length; i < len; ++i) {
    if (routes[i].onLeave) routes[i].onLeave.call(routes[i], prevState);
  }
}
}).call(this,require('_process'))

},{"./AsyncUtils":41,"./routerWarning":75,"_process":1}],60:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RouterContext = require('./RouterContext');

var _RouterContext2 = _interopRequireDefault(_RouterContext);

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  if (process.env.NODE_ENV !== 'production') {
    middlewares.forEach(function (middleware, index) {
      process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(middleware.renderRouterContext || middleware.renderRouteComponent, 'The middleware specified at index ' + index + ' does not appear to be ' + 'a valid React Router middleware.') : void 0;
    });
  }

  var withContext = middlewares.map(function (middleware) {
    return middleware.renderRouterContext;
  }).filter(Boolean);
  var withComponent = middlewares.map(function (middleware) {
    return middleware.renderRouteComponent;
  }).filter(Boolean);

  var makeCreateElement = function makeCreateElement() {
    var baseCreateElement = arguments.length <= 0 || arguments[0] === undefined ? _react.createElement : arguments[0];
    return function (Component, props) {
      return withComponent.reduceRight(function (previous, renderRouteComponent) {
        return renderRouteComponent(previous, props);
      }, baseCreateElement(Component, props));
    };
  };

  return function (renderProps) {
    return withContext.reduceRight(function (previous, renderRouterContext) {
      return renderRouterContext(previous, renderProps);
    }, _react2.default.createElement(_RouterContext2.default, _extends({}, renderProps, {
      createElement: makeCreateElement(renderProps.createElement)
    })));
  };
};

module.exports = exports['default'];
}).call(this,require('_process'))

},{"./RouterContext":56,"./routerWarning":75,"_process":1,"react":"react"}],61:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createBrowserHistory = require('history/lib/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createRouterHistory = require('./createRouterHistory');

var _createRouterHistory2 = _interopRequireDefault(_createRouterHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createRouterHistory2.default)(_createBrowserHistory2.default);
module.exports = exports['default'];
},{"./createRouterHistory":64,"history/lib/createBrowserHistory":14}],62:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _PatternUtils = require('./PatternUtils');

function routeParamsChanged(route, prevState, nextState) {
  if (!route.path) return false;

  var paramNames = (0, _PatternUtils.getParamNames)(route.path);

  return paramNames.some(function (paramName) {
    return prevState.params[paramName] !== nextState.params[paramName];
  });
}

/**
 * Returns an object of { leaveRoutes, changeRoutes, enterRoutes } determined by
 * the change from prevState to nextState. We leave routes if either
 * 1) they are not in the next state or 2) they are in the next state
 * but their params have changed (i.e. /users/123 => /users/456).
 *
 * leaveRoutes are ordered starting at the leaf route of the tree
 * we're leaving up to the common parent route. enterRoutes are ordered
 * from the top of the tree we're entering down to the leaf route.
 *
 * changeRoutes are any routes that didn't leave or enter during
 * the transition.
 */
function computeChangedRoutes(prevState, nextState) {
  var prevRoutes = prevState && prevState.routes;
  var nextRoutes = nextState.routes;

  var leaveRoutes = void 0,
      changeRoutes = void 0,
      enterRoutes = void 0;
  if (prevRoutes) {
    (function () {
      var parentIsLeaving = false;
      leaveRoutes = prevRoutes.filter(function (route) {
        if (parentIsLeaving) {
          return true;
        } else {
          var isLeaving = nextRoutes.indexOf(route) === -1 || routeParamsChanged(route, prevState, nextState);
          if (isLeaving) parentIsLeaving = true;
          return isLeaving;
        }
      });

      // onLeave hooks start at the leaf route.
      leaveRoutes.reverse();

      enterRoutes = [];
      changeRoutes = [];

      nextRoutes.forEach(function (route) {
        var isNew = prevRoutes.indexOf(route) === -1;
        var paramsChanged = leaveRoutes.indexOf(route) !== -1;

        if (isNew || paramsChanged) enterRoutes.push(route);else changeRoutes.push(route);
      });
    })();
  } else {
    leaveRoutes = [];
    changeRoutes = [];
    enterRoutes = nextRoutes;
  }

  return {
    leaveRoutes: leaveRoutes,
    changeRoutes: changeRoutes,
    enterRoutes: enterRoutes
  };
}

exports.default = computeChangedRoutes;
module.exports = exports['default'];
},{"./PatternUtils":49}],63:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = createMemoryHistory;

var _useQueries = require('history/lib/useQueries');

var _useQueries2 = _interopRequireDefault(_useQueries);

var _useBasename = require('history/lib/useBasename');

var _useBasename2 = _interopRequireDefault(_useBasename);

var _createMemoryHistory = require('history/lib/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMemoryHistory(options) {
  // signatures and type checking differ between `useRoutes` and
  // `createMemoryHistory`, have to create `memoryHistory` first because
  // `useQueries` doesn't understand the signature
  var memoryHistory = (0, _createMemoryHistory2.default)(options);
  var createHistory = function createHistory() {
    return memoryHistory;
  };
  var history = (0, _useQueries2.default)((0, _useBasename2.default)(createHistory))(options);
  history.__v2_compatible__ = true;
  return history;
}
module.exports = exports['default'];
},{"history/lib/createMemoryHistory":19,"history/lib/useBasename":22,"history/lib/useQueries":23}],64:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports.default = function (createHistory) {
  var history = void 0;
  if (canUseDOM) history = (0, _useRouterHistory2.default)(createHistory)();
  return history;
};

var _useRouterHistory = require('./useRouterHistory');

var _useRouterHistory2 = _interopRequireDefault(_useRouterHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

module.exports = exports['default'];
},{"./useRouterHistory":76}],65:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createTransitionManager;

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _computeChangedRoutes2 = require('./computeChangedRoutes');

var _computeChangedRoutes3 = _interopRequireDefault(_computeChangedRoutes2);

var _TransitionUtils = require('./TransitionUtils');

var _isActive2 = require('./isActive');

var _isActive3 = _interopRequireDefault(_isActive2);

var _getComponents = require('./getComponents');

var _getComponents2 = _interopRequireDefault(_getComponents);

var _matchRoutes = require('./matchRoutes');

var _matchRoutes2 = _interopRequireDefault(_matchRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasAnyProperties(object) {
  for (var p in object) {
    if (Object.prototype.hasOwnProperty.call(object, p)) return true;
  }return false;
}

function createTransitionManager(history, routes) {
  var state = {};

  // Signature should be (location, indexOnly), but needs to support (path,
  // query, indexOnly)
  function isActive(location) {
    var indexOnlyOrDeprecatedQuery = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var deprecatedIndexOnly = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    var indexOnly = void 0;
    if (indexOnlyOrDeprecatedQuery && indexOnlyOrDeprecatedQuery !== true || deprecatedIndexOnly !== null) {
      process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, '`isActive(pathname, query, indexOnly) is deprecated; use `isActive(location, indexOnly)` with a location descriptor instead. http://tiny.cc/router-isActivedeprecated') : void 0;
      location = { pathname: location, query: indexOnlyOrDeprecatedQuery };
      indexOnly = deprecatedIndexOnly || false;
    } else {
      location = history.createLocation(location);
      indexOnly = indexOnlyOrDeprecatedQuery;
    }

    return (0, _isActive3.default)(location, indexOnly, state.location, state.routes, state.params);
  }

  var partialNextState = void 0;

  function match(location, callback) {
    if (partialNextState && partialNextState.location === location) {
      // Continue from where we left off.
      finishMatch(partialNextState, callback);
    } else {
      (0, _matchRoutes2.default)(routes, location, function (error, nextState) {
        if (error) {
          callback(error);
        } else if (nextState) {
          finishMatch(_extends({}, nextState, { location: location }), callback);
        } else {
          callback();
        }
      });
    }
  }

  function finishMatch(nextState, callback) {
    var _computeChangedRoutes = (0, _computeChangedRoutes3.default)(state, nextState);

    var leaveRoutes = _computeChangedRoutes.leaveRoutes;
    var changeRoutes = _computeChangedRoutes.changeRoutes;
    var enterRoutes = _computeChangedRoutes.enterRoutes;


    (0, _TransitionUtils.runLeaveHooks)(leaveRoutes, state);

    // Tear down confirmation hooks for left routes
    leaveRoutes.filter(function (route) {
      return enterRoutes.indexOf(route) === -1;
    }).forEach(removeListenBeforeHooksForRoute);

    // change and enter hooks are run in series
    (0, _TransitionUtils.runChangeHooks)(changeRoutes, state, nextState, function (error, redirectInfo) {
      if (error || redirectInfo) return handleErrorOrRedirect(error, redirectInfo);

      (0, _TransitionUtils.runEnterHooks)(enterRoutes, nextState, finishEnterHooks);
    });

    function finishEnterHooks(error, redirectInfo) {
      if (error || redirectInfo) return handleErrorOrRedirect(error, redirectInfo);

      // TODO: Fetch components after state is updated.
      (0, _getComponents2.default)(nextState, function (error, components) {
        if (error) {
          callback(error);
        } else {
          // TODO: Make match a pure function and have some other API
          // for "match and update state".
          callback(null, null, state = _extends({}, nextState, { components: components }));
        }
      });
    }

    function handleErrorOrRedirect(error, redirectInfo) {
      if (error) callback(error);else callback(null, redirectInfo);
    }
  }

  var RouteGuid = 1;

  function getRouteID(route) {
    var create = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    return route.__id__ || create && (route.__id__ = RouteGuid++);
  }

  var RouteHooks = Object.create(null);

  function getRouteHooksForRoutes(routes) {
    return routes.reduce(function (hooks, route) {
      hooks.push.apply(hooks, RouteHooks[getRouteID(route)]);
      return hooks;
    }, []);
  }

  function transitionHook(location, callback) {
    (0, _matchRoutes2.default)(routes, location, function (error, nextState) {
      if (nextState == null) {
        // TODO: We didn't actually match anything, but hang
        // onto error/nextState so we don't have to matchRoutes
        // again in the listen callback.
        callback();
        return;
      }

      // Cache some state here so we don't have to
      // matchRoutes() again in the listen callback.
      partialNextState = _extends({}, nextState, { location: location });

      var hooks = getRouteHooksForRoutes((0, _computeChangedRoutes3.default)(state, partialNextState).leaveRoutes);

      var result = void 0;
      for (var i = 0, len = hooks.length; result == null && i < len; ++i) {
        // Passing the location arg here indicates to
        // the user that this is a transition hook.
        result = hooks[i](location);
      }

      callback(result);
    });
  }

  /* istanbul ignore next: untestable with Karma */
  function beforeUnloadHook() {
    // Synchronously check to see if any route hooks want
    // to prevent the current window/tab from closing.
    if (state.routes) {
      var hooks = getRouteHooksForRoutes(state.routes);

      var message = void 0;
      for (var i = 0, len = hooks.length; typeof message !== 'string' && i < len; ++i) {
        // Passing no args indicates to the user that this is a
        // beforeunload hook. We don't know the next location.
        message = hooks[i]();
      }

      return message;
    }
  }

  var unlistenBefore = void 0,
      unlistenBeforeUnload = void 0;

  function removeListenBeforeHooksForRoute(route) {
    var routeID = getRouteID(route, false);
    if (!routeID) {
      return;
    }

    delete RouteHooks[routeID];

    if (!hasAnyProperties(RouteHooks)) {
      // teardown transition & beforeunload hooks
      if (unlistenBefore) {
        unlistenBefore();
        unlistenBefore = null;
      }

      if (unlistenBeforeUnload) {
        unlistenBeforeUnload();
        unlistenBeforeUnload = null;
      }
    }
  }

  /**
   * Registers the given hook function to run before leaving the given route.
   *
   * During a normal transition, the hook function receives the next location
   * as its only argument and can return either a prompt message (string) to show the user,
   * to make sure they want to leave the page; or `false`, to prevent the transition.
   * Any other return value will have no effect.
   *
   * During the beforeunload event (in browsers) the hook receives no arguments.
   * In this case it must return a prompt message to prevent the transition.
   *
   * Returns a function that may be used to unbind the listener.
   */
  function listenBeforeLeavingRoute(route, hook) {
    // TODO: Warn if they register for a route that isn't currently
    // active. They're probably doing something wrong, like re-creating
    // route objects on every location change.
    var routeID = getRouteID(route);
    var hooks = RouteHooks[routeID];

    if (!hooks) {
      var thereWereNoRouteHooks = !hasAnyProperties(RouteHooks);

      RouteHooks[routeID] = [hook];

      if (thereWereNoRouteHooks) {
        // setup transition & beforeunload hooks
        unlistenBefore = history.listenBefore(transitionHook);

        if (history.listenBeforeUnload) unlistenBeforeUnload = history.listenBeforeUnload(beforeUnloadHook);
      }
    } else {
      if (hooks.indexOf(hook) === -1) {
        process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'adding multiple leave hooks for the same route is deprecated; manage multiple confirmations in your own code instead') : void 0;

        hooks.push(hook);
      }
    }

    return function () {
      var hooks = RouteHooks[routeID];

      if (hooks) {
        var newHooks = hooks.filter(function (item) {
          return item !== hook;
        });

        if (newHooks.length === 0) {
          removeListenBeforeHooksForRoute(route);
        } else {
          RouteHooks[routeID] = newHooks;
        }
      }
    };
  }

  /**
   * This is the API for stateful environments. As the location
   * changes, we update state and call the listener. We can also
   * gracefully handle errors and redirects.
   */
  function listen(listener) {
    // TODO: Only use a single history listener. Otherwise we'll
    // end up with multiple concurrent calls to match.
    return history.listen(function (location) {
      if (state.location === location) {
        listener(null, state);
      } else {
        match(location, function (error, redirectLocation, nextState) {
          if (error) {
            listener(error);
          } else if (redirectLocation) {
            history.replace(redirectLocation);
          } else if (nextState) {
            listener(null, nextState);
          } else {
            process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'Location "%s" did not match any routes', location.pathname + location.search + location.hash) : void 0;
          }
        });
      }
    });
  }

  return {
    isActive: isActive,
    match: match,
    listenBeforeLeavingRoute: listenBeforeLeavingRoute,
    listen: listen
  };
}

//export default useRoutes

module.exports = exports['default'];
}).call(this,require('_process'))

},{"./TransitionUtils":59,"./computeChangedRoutes":62,"./getComponents":67,"./isActive":71,"./matchRoutes":74,"./routerWarning":75,"_process":1}],66:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.canUseMembrane = undefined;

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canUseMembrane = exports.canUseMembrane = false;

// No-op by default.
var deprecateObjectProperties = function deprecateObjectProperties(object) {
  return object;
};

if (process.env.NODE_ENV !== 'production') {
  try {
    if (Object.defineProperty({}, 'x', {
      get: function get() {
        return true;
      }
    }).x) {
      exports.canUseMembrane = canUseMembrane = true;
    }
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */

  if (canUseMembrane) {
    deprecateObjectProperties = function deprecateObjectProperties(object, message) {
      // Wrap the deprecated object in a membrane to warn on property access.
      var membrane = {};

      var _loop = function _loop(prop) {
        if (!Object.prototype.hasOwnProperty.call(object, prop)) {
          return 'continue';
        }

        if (typeof object[prop] === 'function') {
          // Can't use fat arrow here because of use of arguments below.
          membrane[prop] = function () {
            process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, message) : void 0;
            return object[prop].apply(object, arguments);
          };
          return 'continue';
        }

        // These properties are non-enumerable to prevent React dev tools from
        // seeing them and causing spurious warnings when accessing them. In
        // principle this could be done with a proxy, but support for the
        // ownKeys trap on proxies is not universal, even among browsers that
        // otherwise support proxies.
        Object.defineProperty(membrane, prop, {
          get: function get() {
            process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, message) : void 0;
            return object[prop];
          }
        });
      };

      for (var prop in object) {
        var _ret = _loop(prop);

        if (_ret === 'continue') continue;
      }

      return membrane;
    };
  }
}

exports.default = deprecateObjectProperties;
}).call(this,require('_process'))

},{"./routerWarning":75,"_process":1}],67:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _AsyncUtils = require('./AsyncUtils');

var _makeStateWithLocation = require('./makeStateWithLocation');

var _makeStateWithLocation2 = _interopRequireDefault(_makeStateWithLocation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getComponentsForRoute(nextState, route, callback) {
  if (route.component || route.components) {
    callback(null, route.component || route.components);
    return;
  }

  var getComponent = route.getComponent || route.getComponents;
  if (!getComponent) {
    callback();
    return;
  }

  var location = nextState.location;

  var nextStateWithLocation = (0, _makeStateWithLocation2.default)(nextState, location);

  getComponent.call(route, nextStateWithLocation, callback);
}

/**
 * Asynchronously fetches all components needed for the given router
 * state and calls callback(error, components) when finished.
 *
 * Note: This operation may finish synchronously if no routes have an
 * asynchronous getComponents method.
 */
function getComponents(nextState, callback) {
  (0, _AsyncUtils.mapAsync)(nextState.routes, function (route, index, callback) {
    getComponentsForRoute(nextState, route, callback);
  }, callback);
}

exports.default = getComponents;
module.exports = exports['default'];
},{"./AsyncUtils":41,"./makeStateWithLocation":72}],68:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _PatternUtils = require('./PatternUtils');

/**
 * Extracts an object of params the given route cares about from
 * the given params object.
 */
function getRouteParams(route, params) {
  var routeParams = {};

  if (!route.path) return routeParams;

  (0, _PatternUtils.getParamNames)(route.path).forEach(function (p) {
    if (Object.prototype.hasOwnProperty.call(params, p)) {
      routeParams[p] = params[p];
    }
  });

  return routeParams;
}

exports.default = getRouteParams;
module.exports = exports['default'];
},{"./PatternUtils":49}],69:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createHashHistory = require('history/lib/createHashHistory');

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _createRouterHistory = require('./createRouterHistory');

var _createRouterHistory2 = _interopRequireDefault(_createRouterHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createRouterHistory2.default)(_createHashHistory2.default);
module.exports = exports['default'];
},{"./createRouterHistory":64,"history/lib/createHashHistory":16}],70:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.createMemoryHistory = exports.hashHistory = exports.browserHistory = exports.applyRouterMiddleware = exports.formatPattern = exports.useRouterHistory = exports.match = exports.routerShape = exports.locationShape = exports.PropTypes = exports.RoutingContext = exports.RouterContext = exports.createRoutes = exports.useRoutes = exports.RouteContext = exports.Lifecycle = exports.History = exports.Route = exports.Redirect = exports.IndexRoute = exports.IndexRedirect = exports.withRouter = exports.IndexLink = exports.Link = exports.Router = undefined;

var _RouteUtils = require('./RouteUtils');

Object.defineProperty(exports, 'createRoutes', {
  enumerable: true,
  get: function get() {
    return _RouteUtils.createRoutes;
  }
});

var _PropTypes2 = require('./PropTypes');

Object.defineProperty(exports, 'locationShape', {
  enumerable: true,
  get: function get() {
    return _PropTypes2.locationShape;
  }
});
Object.defineProperty(exports, 'routerShape', {
  enumerable: true,
  get: function get() {
    return _PropTypes2.routerShape;
  }
});

var _PatternUtils = require('./PatternUtils');

Object.defineProperty(exports, 'formatPattern', {
  enumerable: true,
  get: function get() {
    return _PatternUtils.formatPattern;
  }
});

var _Router2 = require('./Router');

var _Router3 = _interopRequireDefault(_Router2);

var _Link2 = require('./Link');

var _Link3 = _interopRequireDefault(_Link2);

var _IndexLink2 = require('./IndexLink');

var _IndexLink3 = _interopRequireDefault(_IndexLink2);

var _withRouter2 = require('./withRouter');

var _withRouter3 = _interopRequireDefault(_withRouter2);

var _IndexRedirect2 = require('./IndexRedirect');

var _IndexRedirect3 = _interopRequireDefault(_IndexRedirect2);

var _IndexRoute2 = require('./IndexRoute');

var _IndexRoute3 = _interopRequireDefault(_IndexRoute2);

var _Redirect2 = require('./Redirect');

var _Redirect3 = _interopRequireDefault(_Redirect2);

var _Route2 = require('./Route');

var _Route3 = _interopRequireDefault(_Route2);

var _History2 = require('./History');

var _History3 = _interopRequireDefault(_History2);

var _Lifecycle2 = require('./Lifecycle');

var _Lifecycle3 = _interopRequireDefault(_Lifecycle2);

var _RouteContext2 = require('./RouteContext');

var _RouteContext3 = _interopRequireDefault(_RouteContext2);

var _useRoutes2 = require('./useRoutes');

var _useRoutes3 = _interopRequireDefault(_useRoutes2);

var _RouterContext2 = require('./RouterContext');

var _RouterContext3 = _interopRequireDefault(_RouterContext2);

var _RoutingContext2 = require('./RoutingContext');

var _RoutingContext3 = _interopRequireDefault(_RoutingContext2);

var _PropTypes3 = _interopRequireDefault(_PropTypes2);

var _match2 = require('./match');

var _match3 = _interopRequireDefault(_match2);

var _useRouterHistory2 = require('./useRouterHistory');

var _useRouterHistory3 = _interopRequireDefault(_useRouterHistory2);

var _applyRouterMiddleware2 = require('./applyRouterMiddleware');

var _applyRouterMiddleware3 = _interopRequireDefault(_applyRouterMiddleware2);

var _browserHistory2 = require('./browserHistory');

var _browserHistory3 = _interopRequireDefault(_browserHistory2);

var _hashHistory2 = require('./hashHistory');

var _hashHistory3 = _interopRequireDefault(_hashHistory2);

var _createMemoryHistory2 = require('./createMemoryHistory');

var _createMemoryHistory3 = _interopRequireDefault(_createMemoryHistory2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Router = _Router3.default; /* components */

exports.Link = _Link3.default;
exports.IndexLink = _IndexLink3.default;
exports.withRouter = _withRouter3.default;

/* components (configuration) */

exports.IndexRedirect = _IndexRedirect3.default;
exports.IndexRoute = _IndexRoute3.default;
exports.Redirect = _Redirect3.default;
exports.Route = _Route3.default;

/* mixins */

exports.History = _History3.default;
exports.Lifecycle = _Lifecycle3.default;
exports.RouteContext = _RouteContext3.default;

/* utils */

exports.useRoutes = _useRoutes3.default;
exports.RouterContext = _RouterContext3.default;
exports.RoutingContext = _RoutingContext3.default;
exports.PropTypes = _PropTypes3.default;
exports.match = _match3.default;
exports.useRouterHistory = _useRouterHistory3.default;
exports.applyRouterMiddleware = _applyRouterMiddleware3.default;

/* histories */

exports.browserHistory = _browserHistory3.default;
exports.hashHistory = _hashHistory3.default;
exports.createMemoryHistory = _createMemoryHistory3.default;
},{"./History":42,"./IndexLink":43,"./IndexRedirect":44,"./IndexRoute":45,"./Lifecycle":47,"./Link":48,"./PatternUtils":49,"./PropTypes":50,"./Redirect":51,"./Route":52,"./RouteContext":53,"./RouteUtils":54,"./Router":55,"./RouterContext":56,"./RoutingContext":58,"./applyRouterMiddleware":60,"./browserHistory":61,"./createMemoryHistory":63,"./hashHistory":69,"./match":73,"./useRouterHistory":76,"./useRoutes":77,"./withRouter":78}],71:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = isActive;

var _PatternUtils = require('./PatternUtils');

function deepEqual(a, b) {
  if (a == b) return true;

  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
      return deepEqual(item, b[index]);
    });
  }

  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object') {
    for (var p in a) {
      if (!Object.prototype.hasOwnProperty.call(a, p)) {
        continue;
      }

      if (a[p] === undefined) {
        if (b[p] !== undefined) {
          return false;
        }
      } else if (!Object.prototype.hasOwnProperty.call(b, p)) {
        return false;
      } else if (!deepEqual(a[p], b[p])) {
        return false;
      }
    }

    return true;
  }

  return String(a) === String(b);
}

/**
 * Returns true if the current pathname matches the supplied one, net of
 * leading and trailing slash normalization. This is sufficient for an
 * indexOnly route match.
 */
function pathIsActive(pathname, currentPathname) {
  // Normalize leading slash for consistency. Leading slash on pathname has
  // already been normalized in isActive. See caveat there.
  if (currentPathname.charAt(0) !== '/') {
    currentPathname = '/' + currentPathname;
  }

  // Normalize the end of both path names too. Maybe `/foo/` shouldn't show
  // `/foo` as active, but in this case, we would already have failed the
  // match.
  if (pathname.charAt(pathname.length - 1) !== '/') {
    pathname += '/';
  }
  if (currentPathname.charAt(currentPathname.length - 1) !== '/') {
    currentPathname += '/';
  }

  return currentPathname === pathname;
}

/**
 * Returns true if the given pathname matches the active routes and params.
 */
function routeIsActive(pathname, routes, params) {
  var remainingPathname = pathname,
      paramNames = [],
      paramValues = [];

  // for...of would work here but it's probably slower post-transpilation.
  for (var i = 0, len = routes.length; i < len; ++i) {
    var route = routes[i];
    var pattern = route.path || '';

    if (pattern.charAt(0) === '/') {
      remainingPathname = pathname;
      paramNames = [];
      paramValues = [];
    }

    if (remainingPathname !== null && pattern) {
      var matched = (0, _PatternUtils.matchPattern)(pattern, remainingPathname);
      if (matched) {
        remainingPathname = matched.remainingPathname;
        paramNames = [].concat(paramNames, matched.paramNames);
        paramValues = [].concat(paramValues, matched.paramValues);
      } else {
        remainingPathname = null;
      }

      if (remainingPathname === '') {
        // We have an exact match on the route. Just check that all the params
        // match.
        // FIXME: This doesn't work on repeated params.
        return paramNames.every(function (paramName, index) {
          return String(paramValues[index]) === String(params[paramName]);
        });
      }
    }
  }

  return false;
}

/**
 * Returns true if all key/value pairs in the given query are
 * currently active.
 */
function queryIsActive(query, activeQuery) {
  if (activeQuery == null) return query == null;

  if (query == null) return true;

  return deepEqual(query, activeQuery);
}

/**
 * Returns true if a <Link> to the given pathname/query combination is
 * currently active.
 */
function isActive(_ref, indexOnly, currentLocation, routes, params) {
  var pathname = _ref.pathname;
  var query = _ref.query;

  if (currentLocation == null) return false;

  // TODO: This is a bit ugly. It keeps around support for treating pathnames
  // without preceding slashes as absolute paths, but possibly also works
  // around the same quirks with basenames as in matchRoutes.
  if (pathname.charAt(0) !== '/') {
    pathname = '/' + pathname;
  }

  if (!pathIsActive(pathname, currentLocation.pathname)) {
    // The path check is necessary and sufficient for indexOnly, but otherwise
    // we still need to check the routes.
    if (indexOnly || !routeIsActive(pathname, routes, params)) {
      return false;
    }
  }

  return queryIsActive(query, currentLocation.query);
}
module.exports = exports['default'];
},{"./PatternUtils":49}],72:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = makeStateWithLocation;

var _deprecateObjectProperties = require('./deprecateObjectProperties');

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeStateWithLocation(state, location) {
  if (process.env.NODE_ENV !== 'production' && _deprecateObjectProperties.canUseMembrane) {
    var stateWithLocation = _extends({}, state);

    // I don't use deprecateObjectProperties here because I want to keep the
    // same code path between development and production, in that we just
    // assign extra properties to the copy of the state object in both cases.

    var _loop = function _loop(prop) {
      if (!Object.prototype.hasOwnProperty.call(location, prop)) {
        return 'continue';
      }

      Object.defineProperty(stateWithLocation, prop, {
        get: function get() {
          process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'Accessing location properties directly from the first argument to `getComponent`, `getComponents`, `getChildRoutes`, and `getIndexRoute` is deprecated. That argument is now the router state (`nextState` or `partialNextState`) rather than the location. To access the location, use `nextState.location` or `partialNextState.location`.') : void 0;
          return location[prop];
        }
      });
    };

    for (var prop in location) {
      var _ret = _loop(prop);

      if (_ret === 'continue') continue;
    }

    return stateWithLocation;
  }

  return _extends({}, state, location);
}
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./deprecateObjectProperties":66,"./routerWarning":75,"_process":1}],73:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Actions = require('history/lib/Actions');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _createMemoryHistory = require('./createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _createTransitionManager = require('./createTransitionManager');

var _createTransitionManager2 = _interopRequireDefault(_createTransitionManager);

var _RouteUtils = require('./RouteUtils');

var _RouterUtils = require('./RouterUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * A high-level API to be used for server-side rendering.
 *
 * This function matches a location to a set of routes and calls
 * callback(error, redirectLocation, renderProps) when finished.
 *
 * Note: You probably don't want to use this in a browser unless you're using
 * server-side rendering with async routes.
 */
function match(_ref, callback) {
  var history = _ref.history;
  var routes = _ref.routes;
  var location = _ref.location;

  var options = _objectWithoutProperties(_ref, ['history', 'routes', 'location']);

  !(history || location) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'match needs a history or a location') : (0, _invariant2.default)(false) : void 0;

  history = history ? history : (0, _createMemoryHistory2.default)(options);
  var transitionManager = (0, _createTransitionManager2.default)(history, (0, _RouteUtils.createRoutes)(routes));

  var unlisten = void 0;

  if (location) {
    // Allow match({ location: '/the/path', ... })
    location = history.createLocation(location);
  } else {
    // Pick up the location from the history via synchronous history.listen
    // call if needed.
    unlisten = history.listen(function (historyLocation) {
      location = historyLocation;
    });
  }

  var router = (0, _RouterUtils.createRouterObject)(history, transitionManager);
  history = (0, _RouterUtils.createRoutingHistory)(history, transitionManager);

  transitionManager.match(location, function (error, redirectLocation, nextState) {
    callback(error, redirectLocation && router.createLocation(redirectLocation, _Actions.REPLACE), nextState && _extends({}, nextState, {
      history: history,
      router: router,
      matchContext: { history: history, transitionManager: transitionManager, router: router }
    }));

    // Defer removing the listener to here to prevent DOM histories from having
    // to unwind DOM event listeners unnecessarily, in case callback renders a
    // <Router> and attaches another history listener.
    if (unlisten) {
      unlisten();
    }
  });
}

exports.default = match;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./RouteUtils":54,"./RouterUtils":57,"./createMemoryHistory":63,"./createTransitionManager":65,"_process":1,"history/lib/Actions":8,"invariant":26}],74:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = matchRoutes;

var _AsyncUtils = require('./AsyncUtils');

var _makeStateWithLocation = require('./makeStateWithLocation');

var _makeStateWithLocation2 = _interopRequireDefault(_makeStateWithLocation);

var _PatternUtils = require('./PatternUtils');

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _RouteUtils = require('./RouteUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getChildRoutes(route, location, paramNames, paramValues, callback) {
  if (route.childRoutes) {
    return [null, route.childRoutes];
  }
  if (!route.getChildRoutes) {
    return [];
  }

  var sync = true,
      result = void 0;

  var partialNextState = {
    location: location,
    params: createParams(paramNames, paramValues)
  };

  var partialNextStateWithLocation = (0, _makeStateWithLocation2.default)(partialNextState, location);

  route.getChildRoutes(partialNextStateWithLocation, function (error, childRoutes) {
    childRoutes = !error && (0, _RouteUtils.createRoutes)(childRoutes);
    if (sync) {
      result = [error, childRoutes];
      return;
    }

    callback(error, childRoutes);
  });

  sync = false;
  return result; // Might be undefined.
}

function getIndexRoute(route, location, paramNames, paramValues, callback) {
  if (route.indexRoute) {
    callback(null, route.indexRoute);
  } else if (route.getIndexRoute) {
    var partialNextState = {
      location: location,
      params: createParams(paramNames, paramValues)
    };

    var partialNextStateWithLocation = (0, _makeStateWithLocation2.default)(partialNextState, location);

    route.getIndexRoute(partialNextStateWithLocation, function (error, indexRoute) {
      callback(error, !error && (0, _RouteUtils.createRoutes)(indexRoute)[0]);
    });
  } else if (route.childRoutes) {
    (function () {
      var pathless = route.childRoutes.filter(function (childRoute) {
        return !childRoute.path;
      });

      (0, _AsyncUtils.loopAsync)(pathless.length, function (index, next, done) {
        getIndexRoute(pathless[index], location, paramNames, paramValues, function (error, indexRoute) {
          if (error || indexRoute) {
            var routes = [pathless[index]].concat(Array.isArray(indexRoute) ? indexRoute : [indexRoute]);
            done(error, routes);
          } else {
            next();
          }
        });
      }, function (err, routes) {
        callback(null, routes);
      });
    })();
  } else {
    callback();
  }
}

function assignParams(params, paramNames, paramValues) {
  return paramNames.reduce(function (params, paramName, index) {
    var paramValue = paramValues && paramValues[index];

    if (Array.isArray(params[paramName])) {
      params[paramName].push(paramValue);
    } else if (paramName in params) {
      params[paramName] = [params[paramName], paramValue];
    } else {
      params[paramName] = paramValue;
    }

    return params;
  }, params);
}

function createParams(paramNames, paramValues) {
  return assignParams({}, paramNames, paramValues);
}

function matchRouteDeep(route, location, remainingPathname, paramNames, paramValues, callback) {
  var pattern = route.path || '';

  if (pattern.charAt(0) === '/') {
    remainingPathname = location.pathname;
    paramNames = [];
    paramValues = [];
  }

  // Only try to match the path if the route actually has a pattern, and if
  // we're not just searching for potential nested absolute paths.
  if (remainingPathname !== null && pattern) {
    try {
      var matched = (0, _PatternUtils.matchPattern)(pattern, remainingPathname);
      if (matched) {
        remainingPathname = matched.remainingPathname;
        paramNames = [].concat(paramNames, matched.paramNames);
        paramValues = [].concat(paramValues, matched.paramValues);
      } else {
        remainingPathname = null;
      }
    } catch (error) {
      callback(error);
    }

    // By assumption, pattern is non-empty here, which is the prerequisite for
    // actually terminating a match.
    if (remainingPathname === '') {
      var _ret2 = function () {
        var match = {
          routes: [route],
          params: createParams(paramNames, paramValues)
        };

        getIndexRoute(route, location, paramNames, paramValues, function (error, indexRoute) {
          if (error) {
            callback(error);
          } else {
            if (Array.isArray(indexRoute)) {
              var _match$routes;

              process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(indexRoute.every(function (route) {
                return !route.path;
              }), 'Index routes should not have paths') : void 0;
              (_match$routes = match.routes).push.apply(_match$routes, indexRoute);
            } else if (indexRoute) {
              process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(!indexRoute.path, 'Index routes should not have paths') : void 0;
              match.routes.push(indexRoute);
            }

            callback(null, match);
          }
        });

        return {
          v: void 0
        };
      }();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    }
  }

  if (remainingPathname != null || route.childRoutes) {
    // Either a) this route matched at least some of the path or b)
    // we don't have to load this route's children asynchronously. In
    // either case continue checking for matches in the subtree.
    var onChildRoutes = function onChildRoutes(error, childRoutes) {
      if (error) {
        callback(error);
      } else if (childRoutes) {
        // Check the child routes to see if any of them match.
        matchRoutes(childRoutes, location, function (error, match) {
          if (error) {
            callback(error);
          } else if (match) {
            // A child route matched! Augment the match and pass it up the stack.
            match.routes.unshift(route);
            callback(null, match);
          } else {
            callback();
          }
        }, remainingPathname, paramNames, paramValues);
      } else {
        callback();
      }
    };

    var result = getChildRoutes(route, location, paramNames, paramValues, onChildRoutes);
    if (result) {
      onChildRoutes.apply(undefined, result);
    }
  } else {
    callback();
  }
}

/**
 * Asynchronously matches the given location to a set of routes and calls
 * callback(error, state) when finished. The state object will have the
 * following properties:
 *
 * - routes       An array of routes that matched, in hierarchical order
 * - params       An object of URL parameters
 *
 * Note: This operation may finish synchronously if no routes have an
 * asynchronous getChildRoutes method.
 */
function matchRoutes(routes, location, callback, remainingPathname) {
  var paramNames = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];
  var paramValues = arguments.length <= 5 || arguments[5] === undefined ? [] : arguments[5];

  if (remainingPathname === undefined) {
    // TODO: This is a little bit ugly, but it works around a quirk in history
    // that strips the leading slash from pathnames when using basenames with
    // trailing slashes.
    if (location.pathname.charAt(0) !== '/') {
      location = _extends({}, location, {
        pathname: '/' + location.pathname
      });
    }
    remainingPathname = location.pathname;
  }

  (0, _AsyncUtils.loopAsync)(routes.length, function (index, next, done) {
    matchRouteDeep(routes[index], location, remainingPathname, paramNames, paramValues, function (error, match) {
      if (error || match) {
        done(error, match);
      } else {
        next();
      }
    });
  }, callback);
}
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./AsyncUtils":41,"./PatternUtils":49,"./RouteUtils":54,"./makeStateWithLocation":72,"./routerWarning":75,"_process":1}],75:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = routerWarning;
exports._resetWarned = _resetWarned;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var warned = {};

function routerWarning(falseToWarn, message) {
  // Only issue deprecation warnings once.
  if (message.indexOf('deprecated') !== -1) {
    if (warned[message]) {
      return;
    }

    warned[message] = true;
  }

  message = '[react-router] ' + message;

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  _warning2.default.apply(undefined, [falseToWarn, message].concat(args));
}

function _resetWarned() {
  warned = {};
}
},{"warning":92}],76:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = useRouterHistory;

var _useQueries = require('history/lib/useQueries');

var _useQueries2 = _interopRequireDefault(_useQueries);

var _useBasename = require('history/lib/useBasename');

var _useBasename2 = _interopRequireDefault(_useBasename);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useRouterHistory(createHistory) {
  return function (options) {
    var history = (0, _useQueries2.default)((0, _useBasename2.default)(createHistory))(options);
    history.__v2_compatible__ = true;
    return history;
  };
}
module.exports = exports['default'];
},{"history/lib/useBasename":22,"history/lib/useQueries":23}],77:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _useQueries = require('history/lib/useQueries');

var _useQueries2 = _interopRequireDefault(_useQueries);

var _createTransitionManager = require('./createTransitionManager');

var _createTransitionManager2 = _interopRequireDefault(_createTransitionManager);

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Returns a new createHistory function that may be used to create
 * history objects that know about routing.
 *
 * Enhances history objects with the following methods:
 *
 * - listen((error, nextState) => {})
 * - listenBeforeLeavingRoute(route, (nextLocation) => {})
 * - match(location, (error, redirectLocation, nextState) => {})
 * - isActive(pathname, query, indexOnly=false)
 */
function useRoutes(createHistory) {
  process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, '`useRoutes` is deprecated. Please use `createTransitionManager` instead.') : void 0;

  return function () {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var routes = _ref.routes;

    var options = _objectWithoutProperties(_ref, ['routes']);

    var history = (0, _useQueries2.default)(createHistory)(options);
    var transitionManager = (0, _createTransitionManager2.default)(history, routes);
    return _extends({}, history, transitionManager);
  };
}

exports.default = useRoutes;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./createTransitionManager":65,"./routerWarning":75,"_process":1,"history/lib/useQueries":23}],78:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = withRouter;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _PropTypes = require('./PropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withRouter(WrappedComponent, options) {
  var withRef = options && options.withRef;

  var WithRouter = _react2.default.createClass({
    displayName: 'WithRouter',

    contextTypes: { router: _PropTypes.routerShape },
    propTypes: { router: _PropTypes.routerShape },

    getWrappedInstance: function getWrappedInstance() {
      !withRef ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'To access the wrapped instance, you need to specify ' + '`{ withRef: true }` as the second argument of the withRouter() call.') : (0, _invariant2.default)(false) : void 0;

      return this.wrappedInstance;
    },
    render: function render() {
      var _this = this;

      var router = this.props.router || this.context.router;
      var props = _extends({}, this.props, { router: router });

      if (withRef) {
        props.ref = function (c) {
          _this.wrappedInstance = c;
        };
      }

      return _react2.default.createElement(WrappedComponent, props);
    }
  });

  WithRouter.displayName = 'withRouter(' + getDisplayName(WrappedComponent) + ')';
  WithRouter.WrappedComponent = WrappedComponent;

  return (0, _hoistNonReactStatics2.default)(WithRouter, WrappedComponent);
}
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./PropTypes":50,"_process":1,"hoist-non-react-statics":25,"invariant":26,"react":"react"}],79:[function(require,module,exports){
'use strict';

function thunkMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      return typeof action === 'function' ? action(dispatch, getState) : next(action);
    };
  };
}

module.exports = thunkMiddleware;
},{}],80:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = applyMiddleware;

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
},{"./compose":83}],81:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
},{}],82:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports['default'] = combineReducers;

var _createStore = require('./createStore');

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2['default'])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        (0, _warning2['default'])('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  if (process.env.NODE_ENV !== 'production') {
    var unexpectedKeyCache = {};
  }

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        (0, _warning2['default'])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
}).call(this,require('_process'))

},{"./createStore":84,"./utils/warning":86,"_process":1,"lodash/isPlainObject":31}],83:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  var last = funcs[funcs.length - 1];
  var rest = funcs.slice(0, -1);
  return function () {
    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}
},{}],84:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.ActionTypes = undefined;
exports['default'] = createStore;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2['default'])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2['default']] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2['default']] = observable, _ref2;
}
},{"lodash/isPlainObject":31,"symbol-observable":88}],85:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = require('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = require('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = require('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2['default'])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2['default'];
exports.combineReducers = _combineReducers2['default'];
exports.bindActionCreators = _bindActionCreators2['default'];
exports.applyMiddleware = _applyMiddleware2['default'];
exports.compose = _compose2['default'];
}).call(this,require('_process'))

},{"./applyMiddleware":80,"./bindActionCreators":81,"./combineReducers":82,"./compose":83,"./createStore":84,"./utils/warning":86,"_process":1}],86:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],87:[function(require,module,exports){
'use strict';
module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};

},{}],88:[function(require,module,exports){
module.exports = require('./lib/index');

},{"./lib/index":89}],89:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ponyfill = require('./ponyfill');

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root = undefined; /* global window */

if (typeof global !== 'undefined') {
	root = global;
} else if (typeof window !== 'undefined') {
	root = window;
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./ponyfill":90}],90:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};
},{}],91:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],92:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

if (process.env.NODE_ENV !== 'production') {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))

},{"_process":1}],93:[function(require,module,exports){
var window              = require('global');
var MockXMLHttpRequest  = require('./lib/MockXMLHttpRequest');
var real                = window.XMLHttpRequest;
var mock                = MockXMLHttpRequest;

/**
 * Mock utility
 */
module.exports = {

	XMLHttpRequest: MockXMLHttpRequest,

	/**
	 * Replace the native XHR with the mocked XHR
	 * @returns {exports}
	 */
	setup: function() {
		window.XMLHttpRequest = mock;
		MockXMLHttpRequest.handlers = [];
		return this;
	},

	/**
	 * Replace the mocked XHR with the native XHR and remove any handlers
	 * @returns {exports}
	 */
	teardown: function() {
		MockXMLHttpRequest.handlers = [];
		window.XMLHttpRequest = real;
		return this;
	},

	/**
	 * Mock a request
	 * @param   {string}    [method]
	 * @param   {string}    [url]
	 * @param   {Function}  fn
	 * @returns {exports}
	 */
	mock: function(method, url, fn) {
		var handler;
		if (arguments.length === 3) {
			handler = function(req, res) {
				if (req.method() === method && req.url() === url) {
					return fn(req, res);
				}
				return false;
			};
		} else {
			handler = method;
		}

		MockXMLHttpRequest.addHandler(handler);

		return this;
	},

	/**
	 * Mock a GET request
	 * @param   {String}    url
	 * @param   {Function}  fn
	 * @returns {exports}
	 */
	get: function(url, fn) {
		return this.mock('GET', url, fn);
	},

	/**
	 * Mock a POST request
	 * @param   {String}    url
	 * @param   {Function}  fn
	 * @returns {exports}
	 */
	post: function(url, fn) {
		return this.mock('POST', url, fn);
	},

	/**
	 * Mock a PUT request
	 * @param   {String}    url
	 * @param   {Function}  fn
	 * @returns {exports}
	 */
	put: function(url, fn) {
		return this.mock('PUT', url, fn);
	},

	/**
	 * Mock a PATCH request
	 * @param   {String}    url
	 * @param   {Function}  fn
	 * @returns {exports}
	 */
	patch: function(url, fn) {
		return this.mock('PATCH', url, fn);
	},

	/**
	 * Mock a DELETE request
	 * @param   {String}    url
	 * @param   {Function}  fn
	 * @returns {exports}
	 */
	delete: function(url, fn) {
		return this.mock('DELETE', url, fn);
	}

};

},{"./lib/MockXMLHttpRequest":96,"global":7}],94:[function(require,module,exports){

/**
 * The mocked request data
 * @constructor
 */
function MockRequest(xhr) {
  this._method    = xhr.method;
  this._url       = xhr.url;
  this._headers   = {};
  this.headers(xhr._requestHeaders);
  this.body(xhr.data);
}

/**
 * Get/set the HTTP method
 * @returns {string}
 */
MockRequest.prototype.method = function() {
  return this._method;
};

/**
 * Get/set the HTTP URL
 * @returns {string}
 */
MockRequest.prototype.url = function() {
  return this._url;
};

/**
 * Get/set a HTTP header
 * @param   {string} name
 * @param   {string} [value]
 * @returns {string|undefined|MockRequest}
 */
MockRequest.prototype.header = function(name, value) {
  if (arguments.length === 2) {
    this._headers[name.toLowerCase()] = value;
    return this;
  } else {
    return this._headers[name.toLowerCase()] || null;
  }
};

/**
 * Get/set all of the HTTP headers
 * @param   {Object} [headers]
 * @returns {Object|MockRequest}
 */
MockRequest.prototype.headers = function(headers) {
  if (arguments.length) {
    for (var name in headers) {
      if (headers.hasOwnProperty(name)) {
        this.header(name, headers[name]);
      }
    }
    return this;
  } else {
    return this._headers;
  }
};

/**
 * Get/set the HTTP body
 * @param   {string} [body]
 * @returns {string|MockRequest}
 */
MockRequest.prototype.body = function(body) {
  if (arguments.length) {
    this._body = body;
    return this;
  } else {
    return this._body;
  }
};

module.exports = MockRequest;

},{}],95:[function(require,module,exports){

/**
 * The mocked response data
 * @constructor
 */
function MockResponse() {
  this._status      = 200;
  this._headers     = {};
  this._body        = '';
  this._timeout     = false;
}

/**
 * Get/set the HTTP status
 * @param   {number} [code]
 * @returns {number|MockResponse}
 */
MockResponse.prototype.status = function(code) {
  if (arguments.length) {
    this._status = code;
    return this;
  } else {
    return this._status;
  }
};

/**
 * Get/set a HTTP header
 * @param   {string} name
 * @param   {string} [value]
 * @returns {string|undefined|MockResponse}
 */
MockResponse.prototype.header = function(name, value) {
  if (arguments.length === 2) {
    this._headers[name.toLowerCase()] = value;
    return this;
  } else {
    return this._headers[name.toLowerCase()] || null;
  }
};

/**
 * Get/set all of the HTTP headers
 * @param   {Object} [headers]
 * @returns {Object|MockResponse}
 */
MockResponse.prototype.headers = function(headers) {
  if (arguments.length) {
    for (var name in headers) {
      if (headers.hasOwnProperty(name)) {
        this.header(name, headers[name]);
      }
    }
    return this;
  } else {
    return this._headers;
  }
};

/**
 * Get/set the HTTP body
 * @param   {string} [body]
 * @returns {string|MockResponse}
 */
MockResponse.prototype.body = function(body) {
  if (arguments.length) {
    this._body = body;
    return this;
  } else {
    return this._body;
  }
};

/**
 * Get/set the HTTP timeout
 * @param   {boolean|number} [timeout]
 * @returns {boolean|number|MockResponse}
 */
MockResponse.prototype.timeout = function(timeout) {
  if (arguments.length) {
    this._timeout = timeout;
    return this;
  } else {
    return this._timeout;
  }
};

module.exports = MockResponse;

},{}],96:[function(require,module,exports){
var MockRequest   = require('./MockRequest');
var MockResponse  = require('./MockResponse');

var notImplementedError = new Error('This feature hasn\'t been implmented yet. Please submit an Issue or Pull Request on Github.');

//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
//https://xhr.spec.whatwg.org/
//http://www.w3.org/TR/2006/WD-XMLHttpRequest-20060405/

MockXMLHttpRequest.STATE_UNSENT             = 0;
MockXMLHttpRequest.STATE_OPENED             = 1;
MockXMLHttpRequest.STATE_HEADERS_RECEIVED   = 2;
MockXMLHttpRequest.STATE_LOADING            = 3;
MockXMLHttpRequest.STATE_DONE               = 4;

/**
 * The request handlers
 * @private
 * @type {Array}
 */
MockXMLHttpRequest.handlers = [];

/**
 * Add a request handler
 * @param   {function(MockRequest, MockResponse)} fn
 * @returns {MockXMLHttpRequest}
 */
MockXMLHttpRequest.addHandler = function(fn) {
  MockXMLHttpRequest.handlers.push(fn);
  return this;
};

/**
 * Remove a request handler
 * @param   {function(MockRequest, MockResponse)} fn
 * @returns {MockXMLHttpRequest}
 */
MockXMLHttpRequest.removeHandler = function(fn) {
  throw notImplementedError;
};

/**
 * Handle a request
 * @param   {MockRequest} request
 * @returns {MockResponse|null}
 */
MockXMLHttpRequest.handle = function(request) {

  for (var i=0; i<MockXMLHttpRequest.handlers.length; ++i) {

    //get the generator to create a response to the request
    var response = MockXMLHttpRequest.handlers[i](request, new MockResponse());

    if (response) {
      return response;
    }

  }

  return null;
};

/**
 * Mock XMLHttpRequest
 * @constructor
 */
function MockXMLHttpRequest() {
  this.reset();
  this.timeout = 0;
}

/**
 * Reset the response values
 * @private
 */
MockXMLHttpRequest.prototype.reset = function() {

  this._requestHeaders  = {};
  this._responseHeaders = {};

  this.status       = 0;
  this.statusText   = '';

  this.response     = null;
  this.responseType = null;
  this.responseText = null;
  this.responseXML  = null;

  this.readyState   = MockXMLHttpRequest.STATE_UNSENT;
};

/**
 * Trigger an event
 * @param   {String} event
 * @returns {MockXMLHttpRequest}
 */
MockXMLHttpRequest.prototype.trigger = function(event) {

  if (this.onreadystatechange) {
    this.onreadystatechange();
  }

  if (this['on'+event]) {
    this['on'+event]();
  }

  //iterate over the listeners

  return this;
};

MockXMLHttpRequest.prototype.open = function(method, url, async, user, password) {
  this.reset();
  this.method   = method;
  this.url      = url;
  this.async    = async;
  this.user     = user;
  this.password = password;
  this.data     = null;
  this.readyState = MockXMLHttpRequest.STATE_OPENED;
};

MockXMLHttpRequest.prototype.setRequestHeader = function(name, value) {
  this._requestHeaders[name] = value;
};

MockXMLHttpRequest.prototype.overrideMimeType = function(mime) {
  throw notImplementedError;
};

MockXMLHttpRequest.prototype.send = function(data) {
  var self = this;
  this.data = data;

  self.readyState = MockXMLHttpRequest.STATE_LOADING;

  self._sendTimeout = setTimeout(function() {

    var response = MockXMLHttpRequest.handle(new MockRequest(self));

    if (response && response instanceof MockResponse) {

      var timeout = response.timeout();

      if (timeout) {

        //trigger a timeout event because the request timed out - wait for the timeout time because many libs like jquery and superagent use setTimeout to detect the error type
        self._sendTimeout = setTimeout(function() {
          self.readyState = MockXMLHttpRequest.STATE_DONE;
          self.trigger('timeout');
        }, typeof(timeout) === 'number' ? timeout : self.timeout+1);

      } else {

        //map the response to the XHR object
        self.status             = response.status();
        self._responseHeaders   = response.headers();
        self.responseType       = 'text';
        self.response           = response.body();
        self.responseText       = response.body(); //TODO: detect an object and return JSON, detect XML and return XML
        self.readyState         = MockXMLHttpRequest.STATE_DONE;

        //trigger a load event because the request was received
        self.trigger('load');

      }

    } else {

      //trigger an error because the request was not handled
      self.readyState = MockXMLHttpRequest.STATE_DONE;
      self.trigger('error');

    }

  }, 0);

};

MockXMLHttpRequest.prototype.abort = function() {
  clearTimeout(this._sendTimeout);

  if (this.readyState > MockXMLHttpRequest.STATE_UNSENT && this.readyState < MockXMLHttpRequest.STATE_DONE) {
    this.readyState = MockXMLHttpRequest.STATE_UNSENT;
    this.trigger('abort');
  }

};

MockXMLHttpRequest.prototype.getAllResponseHeaders = function() {

  if (this.readyState < MockXMLHttpRequest.STATE_HEADERS_RECEIVED) {
    return null;
  }

  var headers = '';
  for (var name in this._responseHeaders) {
    if (this._responseHeaders.hasOwnProperty(name)) {
      headers += name+': '+this._responseHeaders[name]+'\r\n';
    }
  }

  return headers;
};

MockXMLHttpRequest.prototype.getResponseHeader = function(name) {

  if (this.readyState < MockXMLHttpRequest.STATE_HEADERS_RECEIVED) {
    return null;
  }

  return this._responseHeaders[name.toLowerCase()] || null;
};

MockXMLHttpRequest.prototype.addEventListener = function(event, listener) {
  throw notImplementedError;
};

MockXMLHttpRequest.prototype.removeEventListener = function(event, listener) {
  throw notImplementedError;
};

module.exports = MockXMLHttpRequest;

},{"./MockRequest":94,"./MockResponse":95}],97:[function(require,module,exports){
"use strict";
var window = require("global/window")
var isFunction = require("is-function")
var parseHeaders = require("parse-headers")
var xtend = require("xtend")

module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    if(typeof options.callback === "undefined"){
        throw new Error("callback argument missing")
    }

    var called = false
    var callback = function cbOnce(err, response, body){
        if(!called){
            called = true
            options.callback(err, response, body)
        }
    }

    function readystatechange() {
        if (xhr.readyState === 4) {
            loadFunc()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else {
            body = xhr.responseText || getXml(xhr)
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    var failureResponse = {
                body: undefined,
                headers: {},
                statusCode: 0,
                method: method,
                url: uri,
                rawRequest: xhr
            }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        return callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        return callback(err, response, response.body)
    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data || null
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer

    if ("json" in options) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            aborted=true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr


}

function getXml(xhr) {
    if (xhr.responseType === "document") {
        return xhr.responseXML
    }
    var firefoxBugTakenEffect = xhr.status === 204 && xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
    if (xhr.responseType === "" && !firefoxBugTakenEffect) {
        return xhr.responseXML
    }

    return null
}

function noop() {}

},{"global/window":7,"is-function":27,"parse-headers":32,"xtend":98}],98:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],99:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = actionsMaker;

var _xhr = require("xhr");

var _xhr2 = _interopRequireDefault(_xhr);

var _mappingToJsonLdRml = require("./util/mappingToJsonLdRml");

var _mappingToJsonLdRml2 = _interopRequireDefault(_mappingToJsonLdRml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint no-shadow: [2, { "allow": ["dispatch"] }]*/
function actionsMaker(navigateTo, dispatch) {
  //bind to variable so an action can trigger other actions
  var actions = {
    onToken: function onToken(token) {
      (0, _xhr2.default)("" + "/v2.1/system/users/me/vres", {
        headers: {
          "Authorization": token
        }
      }, function (err, resp, body) {
        var vreData = JSON.parse(body);
        dispatch({ type: "LOGIN", data: token, vreData: vreData });
        if (vreData.mine) {
          navigateTo("collectionsOverview");
        }
      });
    },
    onLoadMoreClick: function onLoadMoreClick(url, collection) {
      dispatch(function (dispatch, getState) {
        var state = getState();
        var payload = {
          headers: {
            "Authorization": state.userdata.userId
          }
        };
        _xhr2.default.get(url, payload, function (err, resp, body) {
          if (err) {
            dispatch({ type: "COLLECTION_ITEMS_LOADING_ERROR", collection: collection, error: err });
          } else {
            try {
              dispatch({ type: "COLLECTION_ITEMS_LOADING_SUCCEEDED", collection: collection, data: JSON.parse(body) });
            } catch (e) {
              dispatch({ type: "COLLECTION_ITEMS_LOADING_ERROR", collection: collection, error: e });
            }
          }
          dispatch({ type: "COLLECTION_ITEMS_LOADING_FINISHED", collection: collection });
        });
      });
    },
    onUploadFileSelect: function onUploadFileSelect(files) {
      var isReupload = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var file = files[0];
      var formData = new FormData();
      formData.append("file", file);
      dispatch({ type: "START_UPLOAD" });
      dispatch(function (dispatch, getState) {
        var state = getState();
        var payload = {
          body: formData,
          headers: {
            "Authorization": state.userdata.userId
          }
        };
        _xhr2.default.post("" + "/v2.1/bulk-upload", payload, function (err, resp) {
          var location = resp.headers.location;
          _xhr2.default.get(location, { headers: { "Authorization": state.userdata.userId } }, function (err, resp, body) {
            dispatch({ type: "FINISH_UPLOAD", data: JSON.parse(body), uploadedFileName: file.name });
            if (isReupload) {
              actions.onSelectCollection(state.importData.activeCollection);
            } else {
              navigateTo("mapArchetypes");
            }
          });
        });
      });
    },
    onContinueMapping: function onContinueMapping(vreId) {
      dispatch(function (dispatch, getState) {
        var state = getState();
        _xhr2.default.get(state.userdata.myVres[vreId].rmlUri, { headers: { "Authorization": state.userdata.userId } }, function (err, resp, body) {
          dispatch({ type: "FINISH_UPLOAD", data: JSON.parse(body) });
          navigateTo("mapArchetypes");
        });
      });
    },
    /*		onSaveMappings: function () {
          dispatch({type: "SAVE_STARTED"})
          dispatch(function (dispatch, getState) {
            var state = getState();
            var payload = {
              json: mappingToJsonLdRml(state.mappings, state.importData.vre),
              headers: {
                "Authorization": state.userdata.userId
              }
            };
    
            xhr.post(state.importData.saveMappingUrl, payload, function (err, resp) {
              if (err) {
                dispatch({type: "SAVE_HAD_ERROR"})
              } else {
                dispatch({type: "SAVE_SUCCEEDED"})
              }
              dispatch({type: "SAVE_FINISHED"})
            });
          });
        },*/

    onPublishData: function onPublishData() {
      dispatch({ type: "SAVE_STARTED" });
      dispatch({ type: "SAVE_FINISHED" });
      dispatch({ type: "PUBLISH_STARTED" });
      dispatch(function (dispatch, getState) {
        var state = getState();
        var jsonLd = (0, _mappingToJsonLdRml2.default)(state.mappings, state.importData.vre);
        console.log(jsonLd);
        var payload = {
          body: JSON.stringify(jsonLd),
          headers: {
            "Authorization": state.userdata.userId,
            "Content-type": "application/ld+json"
          }
        };

        _xhr2.default.post(state.importData.executeMappingUrl, payload, function (err, resp) {
          if (err) {
            dispatch({ type: "PUBLISH_HAD_ERROR" });
          } else {
            if (JSON.parse(resp.body).success) {
              dispatch({ type: "PUBLISH_SUCCEEDED" });
              actions.onToken(state.userdata.userId);
            } else {
              dispatch({ type: "PUBLISH_HAD_ERROR" });
              actions.onSelectCollection(state.importData.activeCollection);
            }
          }
          dispatch({ type: "PUBLISH_FINISHED" });
        });
      });
    },

    onSelectCollection: function onSelectCollection(collection) {
      dispatch({ type: "SET_ACTIVE_COLLECTION", collection: collection });
      dispatch(function (dispatch, getState) {
        var state = getState();
        var currentSheet = state.importData.sheets.find(function (x) {
          return x.collection === collection;
        });
        if (currentSheet.rows.length === 0 && currentSheet.nextUrl && !currentSheet.isLoading) {
          var payload = {
            headers: {
              "Authorization": state.userdata.userId
            }
          };
          dispatch({ type: "COLLECTION_ITEMS_LOADING" });
          _xhr2.default.get(currentSheet.nextUrl, payload, function (err, resp, body) {
            if (err) {
              dispatch({ type: "COLLECTION_ITEMS_LOADING_ERROR", collection: collection, error: err });
            } else {
              try {
                dispatch({ type: "COLLECTION_ITEMS_LOADING_SUCCEEDED", collection: collection, data: JSON.parse(body) });
              } catch (e) {
                dispatch({ type: "COLLECTION_ITEMS_LOADING_ERROR", collection: collection, error: e });
              }
            }
            dispatch({ type: "COLLECTION_ITEMS_LOADING_FINISHED", collection: collection });
          });
        }
      });
    },

    onMapCollectionArchetype: function onMapCollectionArchetype(collection, value) {
      return dispatch({ type: "MAP_COLLECTION_ARCHETYPE", collection: collection, value: value });
    },

    onConfirmCollectionArchetypeMappings: function onConfirmCollectionArchetypeMappings() {
      dispatch({ type: "CONFIRM_COLLECTION_ARCHETYPE_MAPPINGS" });
      dispatch(function (dispatch, getState) {
        var state = getState();
        actions.onSelectCollection(state.importData.activeCollection);
      });
      navigateTo("mapData");
    },

    onSetFieldMapping: function onSetFieldMapping(collection, propertyField, importedField) {
      return dispatch({ type: "SET_FIELD_MAPPING", collection: collection, propertyField: propertyField, importedField: importedField });
    },

    onClearFieldMapping: function onClearFieldMapping(collection, propertyField, clearIndex) {
      return dispatch({ type: "CLEAR_FIELD_MAPPING", collection: collection, propertyField: propertyField, clearIndex: clearIndex });
    },

    onSetDefaultValue: function onSetDefaultValue(collection, propertyField, value) {
      return dispatch({ type: "SET_DEFAULT_VALUE", collection: collection, propertyField: propertyField, value: value });
    },

    onConfirmFieldMappings: function onConfirmFieldMappings(collection, propertyField) {
      return dispatch({ type: "CONFIRM_FIELD_MAPPINGS", collection: collection, propertyField: propertyField });
    },

    onUnconfirmFieldMappings: function onUnconfirmFieldMappings(collection, propertyField) {
      return dispatch({ type: "UNCONFIRM_FIELD_MAPPINGS", collection: collection, propertyField: propertyField });
    },

    onSetValueMapping: function onSetValueMapping(collection, propertyField, timValue, mapValue) {
      return dispatch({ type: "SET_VALUE_MAPPING", collection: collection, propertyField: propertyField, timValue: timValue, mapValue: mapValue });
    },

    onIgnoreColumnToggle: function onIgnoreColumnToggle(collection, variableName) {
      return dispatch({ type: "TOGGLE_IGNORED_COLUMN", collection: collection, variableName: variableName });
    },

    onAddCustomProperty: function onAddCustomProperty(collection, propertyName, propertyType) {
      return dispatch({ type: "ADD_CUSTOM_PROPERTY", collection: collection, propertyField: propertyName, propertyType: propertyType });
    },

    onRemoveCustomProperty: function onRemoveCustomProperty(collection, propertyName) {
      return dispatch({ type: "REMOVE_CUSTOM_PROPERTY", collection: collection, propertyField: propertyName });
    },

    onCloseMessage: function onCloseMessage(messageId) {
      return dispatch({ type: "TOGGLE_MESSAGE", messageId: messageId });
    }
  };
  return actions;
}

},{"./util/mappingToJsonLdRml":139,"xhr":97}],100:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propertyForm = require("./property-form/property-form");

var _propertyForm2 = _interopRequireDefault(_propertyForm);

var _addProperty = require("./property-form/add-property");

var _addProperty2 = _interopRequireDefault(_addProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CollectionForm = function (_React$Component) {
  _inherits(CollectionForm, _React$Component);

  function CollectionForm() {
    _classCallCheck(this, CollectionForm);

    return _possibleConstructorReturn(this, (CollectionForm.__proto__ || Object.getPrototypeOf(CollectionForm)).apply(this, arguments));
  }

  _createClass(CollectionForm, [{
    key: "render",
    value: function render() {
      var _props = this.props;
      var columns = _props.columns;
      var archetypeFields = _props.archetypeFields;
      var propertyMappings = _props.propertyMappings;
      var customPropertyMappings = _props.customPropertyMappings;
      var collectionName = _props.collectionName;
      var availableArchetypes = _props.availableArchetypes;
      var availableCollectionColumnsPerArchetype = _props.availableCollectionColumnsPerArchetype;
      var targetableVres = _props.targetableVres;
      var _props2 = this.props;
      var _onRemoveCustomProperty = _props2.onRemoveCustomProperty;
      var _onSetFieldMapping = _props2.onSetFieldMapping;
      var _onConfirmFieldMappings = _props2.onConfirmFieldMappings;
      var _onClearFieldMapping = _props2.onClearFieldMapping;
      var _onUnconfirmFieldMappings = _props2.onUnconfirmFieldMappings;
      var _onAddCustomProperty = _props2.onAddCustomProperty;


      var archeTypePropFields = archetypeFields.filter(function (af) {
        return af.type !== "relation";
      });

      var propertyForms = archeTypePropFields.map(function (af, i) {
        return _react2.default.createElement(_propertyForm2.default, { columns: columns, custom: false, key: i, name: af.name, type: af.type,
          propertyMapping: propertyMappings.find(function (m) {
            return m.property === af.name;
          }),
          onSetFieldMapping: function onSetFieldMapping(field, value) {
            return _onSetFieldMapping(collectionName, field, value);
          },
          onConfirmFieldMappings: function onConfirmFieldMappings(field) {
            return _onConfirmFieldMappings(collectionName, field);
          },
          onUnconfirmFieldMappings: function onUnconfirmFieldMappings(field) {
            return _onUnconfirmFieldMappings(collectionName, field);
          },
          onClearFieldMapping: function onClearFieldMapping(field, valueIdx) {
            return _onClearFieldMapping(collectionName, field, valueIdx);
          }
        });
      });

      var customPropertyForms = customPropertyMappings.map(function (customProp, i) {
        return _react2.default.createElement(_propertyForm2.default, { columns: columns, custom: true, key: i, name: customProp.name, type: customProp.type,
          archetypeFields: archetypeFields,
          availableCollectionColumnsPerArchetype: availableCollectionColumnsPerArchetype,
          propertyMapping: propertyMappings.find(function (m) {
            return m.property === customProp.name;
          }),
          onRemoveCustomProperty: function onRemoveCustomProperty(field) {
            return _onRemoveCustomProperty(collectionName, field);
          },
          onSetFieldMapping: function onSetFieldMapping(field, value) {
            return _onSetFieldMapping(collectionName, field, value);
          },
          onClearFieldMapping: function onClearFieldMapping(field, valueIdx) {
            return _onClearFieldMapping(collectionName, field, valueIdx);
          },
          onConfirmFieldMappings: function onConfirmFieldMappings(field) {
            return _onConfirmFieldMappings(collectionName, field);
          },
          onUnconfirmFieldMappings: function onUnconfirmFieldMappings(field) {
            return _onUnconfirmFieldMappings(collectionName, field);
          },
          targetableVres: targetableVres
        });
      });

      return _react2.default.createElement(
        "div",
        { className: "container basic-margin" },
        propertyForms,
        customPropertyForms,
        _react2.default.createElement(_addProperty2.default, {
          archetypeFields: archetypeFields,
          availableArchetypes: availableArchetypes,
          onAddCustomProperty: function onAddCustomProperty(name, type) {
            return _onAddCustomProperty(collectionName, name, type);
          } })
      );
    }
  }]);

  return CollectionForm;
}(_react2.default.Component);

exports.default = CollectionForm;

},{"./property-form/add-property":113,"./property-form/property-form":115,"react":"react"}],101:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CollectionIndex = function (_React$Component) {
  _inherits(CollectionIndex, _React$Component);

  function CollectionIndex() {
    _classCallCheck(this, CollectionIndex);

    return _possibleConstructorReturn(this, (CollectionIndex.__proto__ || Object.getPrototypeOf(CollectionIndex)).apply(this, arguments));
  }

  _createClass(CollectionIndex, [{
    key: "render",
    value: function render() {
      var _props = this.props;
      var collectionTabs = _props.collectionTabs;
      var onSelectCollection = _props.onSelectCollection;


      return _react2.default.createElement(
        "div",
        { className: "container basic-margin" },
        _react2.default.createElement(
          "ul",
          { className: "nav nav-tabs", role: "tablist" },
          collectionTabs.map(function (collectionTab) {
            return _react2.default.createElement(
              "li",
              { key: collectionTab.collectionName, className: (0, _classnames2.default)({ active: collectionTab.active }) },
              _react2.default.createElement(
                "a",
                { onClick: function onClick() {
                    return onSelectCollection(collectionTab.collectionName);
                  },
                  style: { cursor: collectionTab.active ? "default" : "pointer" } },
                collectionTab.archetypeName,
                " ",
                collectionTab.complete ? _react2.default.createElement("span", { className: "glyphicon glyphicon-ok" }) : null,
                _react2.default.createElement(
                  "span",
                  { className: "excel-tab" },
                  _react2.default.createElement("img", { src: "images/icon-excel.svg", className: "excel-icon", alt: "" }),
                  " ",
                  collectionTab.collectionName
                )
              )
            );
          })
        )
      );
    }
  }]);

  return CollectionIndex;
}(_react2.default.Component);

exports.default = CollectionIndex;

},{"classnames":2,"react":"react"}],102:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _uploadButton = require("./upload-button");

var _uploadButton2 = _interopRequireDefault(_uploadButton);

var _datasetCards = require("./dataset-cards");

var _datasetCards2 = _interopRequireDefault(_datasetCards);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CollectionOverview(props) {
  var onUploadFileSelect = props.onUploadFileSelect;
  var userId = props.userId;
  var isUploading = props.isUploading;
  var vres = props.vres;


  var uploadButton = _react2.default.createElement(_uploadButton2.default, {
    classNames: ["btn", "btn-lg", "btn-primary", "pull-right"],
    glyphicon: "glyphicon glyphicon-cloud-upload",
    isUploading: isUploading,
    label: "Upload new dataset",
    onUploadFileSelect: onUploadFileSelect });

  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(
      "div",
      { className: "container" },
      _react2.default.createElement(
        _datasetCards2.default,
        { userId: userId, caption: "My datasets", vres: vres },
        uploadButton
      )
    )
  );
}

exports.default = CollectionOverview;

},{"./dataset-cards":106,"./upload-button":126,"react":"react"}],103:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _headerCell = require("./table/header-cell");

var _headerCell2 = _interopRequireDefault(_headerCell);

var _dataRow = require("./table/data-row");

var _dataRow2 = _interopRequireDefault(_dataRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CollectionTable = function (_React$Component) {
  _inherits(CollectionTable, _React$Component);

  function CollectionTable() {
    _classCallCheck(this, CollectionTable);

    return _possibleConstructorReturn(this, (CollectionTable.__proto__ || Object.getPrototypeOf(CollectionTable)).apply(this, arguments));
  }

  _createClass(CollectionTable, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var onIgnoreColumnToggle = this.props.onIgnoreColumnToggle;
      var _props = this.props;
      var rows = _props.rows;
      var headers = _props.headers;
      var nextUrl = _props.nextUrl;


      return _react2.default.createElement(
        "div",
        { className: "table-responsive" },
        _react2.default.createElement(
          "table",
          { className: "table table-bordered table-obtrusive" },
          _react2.default.createElement(
            "thead",
            null,
            _react2.default.createElement(
              "tr",
              null,
              headers.map(function (header) {
                return _react2.default.createElement(_headerCell2.default, { key: header.name, header: header.name, onIgnoreColumnToggle: onIgnoreColumnToggle,
                  isIgnored: header.isIgnored, isConfirmed: header.isConfirmed });
              })
            )
          ),
          _react2.default.createElement(
            "tbody",
            null,
            rows.map(function (row, i) {
              return _react2.default.createElement(_dataRow2.default, { key: i, row: row });
            })
          )
        ),
        _react2.default.createElement(
          "button",
          { onClick: function onClick() {
              return _this2.props.onLoadMoreClick && _this2.props.onLoadMoreClick(nextUrl);
            },
            disabled: !nextUrl,
            className: "btn btn-default pull-right" },
          "more..."
        )
      );
    }
  }]);

  return CollectionTable;
}(_react2.default.Component);

exports.default = CollectionTable;

},{"./table/data-row":124,"./table/header-cell":125,"react":"react"}],104:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _collectionTable = require("./collection-table");

var _collectionTable2 = _interopRequireDefault(_collectionTable);

var _collectionForm = require("./collection-form");

var _collectionForm2 = _interopRequireDefault(_collectionForm);

var _collectionIndex = require("./collection-index");

var _collectionIndex2 = _interopRequireDefault(_collectionIndex);

var _message = require("./message");

var _message2 = _interopRequireDefault(_message);

var _uploadButton = require("./upload-button");

var _uploadButton2 = _interopRequireDefault(_uploadButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConnectData = function (_React$Component) {
  _inherits(ConnectData, _React$Component);

  function ConnectData() {
    _classCallCheck(this, ConnectData);

    return _possibleConstructorReturn(this, (ConnectData.__proto__ || Object.getPrototypeOf(ConnectData)).apply(this, arguments));
  }

  _createClass(ConnectData, [{
    key: "render",
    value: function render() {
      var _props = this.props;
      var activeCollection = _props.activeCollection;
      var uploadedFileName = _props.uploadedFileName;
      var collectionTabs = _props.collectionTabs;
      var rows = _props.rows;
      var headers = _props.headers;
      var archetypeFields = _props.archetypeFields;
      var availableArchetypes = _props.availableArchetypes;
      var propertyMappings = _props.propertyMappings;
      var customPropertyMappings = _props.customPropertyMappings;
      var availableCollectionColumnsPerArchetype = _props.availableCollectionColumnsPerArchetype;
      var nextUrl = _props.nextUrl;
      var publishing = _props.publishing;
      var publishErrors = _props.publishErrors;
      var showCollectionsAreConnectedMessage = _props.showCollectionsAreConnectedMessage;
      var sheets = _props.sheets;
      var targetableVres = _props.targetableVres;
      var _props2 = this.props;
      var _onIgnoreColumnToggle = _props2.onIgnoreColumnToggle;
      var onSelectCollection = _props2.onSelectCollection;
      var onSetFieldMapping = _props2.onSetFieldMapping;
      var onRemoveCustomProperty = _props2.onRemoveCustomProperty;
      var onConfirmFieldMappings = _props2.onConfirmFieldMappings;
      var onUnconfirmFieldMappings = _props2.onUnconfirmFieldMappings;
      var onAddCustomProperty = _props2.onAddCustomProperty;
      var onClearFieldMapping = _props2.onClearFieldMapping;
      var _onLoadMoreClick = _props2.onLoadMoreClick;
      var onPublishData = _props2.onPublishData;
      var onUploadFileSelect = _props2.onUploadFileSelect;
      var _onCloseMessage = _props2.onCloseMessage;


      var allMappingsAreComplete = collectionTabs.filter(function (tab) {
        return tab.complete;
      }).length === collectionTabs.length;

      var publishFailedMessage = publishErrors ? _react2.default.createElement(
        _message2.default,
        { alertLevel: "danger", dismissible: false },
        _react2.default.createElement(_uploadButton2.default, { classNames: ["btn", "btn-danger", "pull-right", "btn-xs"], label: "Re-upload",
          onUploadFileSelect: onUploadFileSelect }),
        _react2.default.createElement("span", { className: "glyphicon glyphicon-exclamation-sign" }),
        " ",
        "Publish failed. Please fix the mappings or re-upload the data."
      ) : null;

      var collectionsAreConnectedMessage = sheets && showCollectionsAreConnectedMessage ? _react2.default.createElement(
        _message2.default,
        { alertLevel: "info", dismissible: true, onCloseMessage: function onCloseMessage() {
            return _onCloseMessage("showCollectionsAreConnectedMessage");
          } },
        sheets.map(function (sheet) {
          return _react2.default.createElement(
            "em",
            { key: sheet.collection },
            sheet.collection
          );
        }).reduce(function (accu, elem) {
          return accu === null ? [elem] : [].concat(_toConsumableArray(accu), [' and ', elem]);
        }, null),
        " from ",
        _react2.default.createElement(
          "em",
          null,
          uploadedFileName
        ),
        " are connected to the Timbuctoo Archetypes."
      ) : null;

      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(
          "div",
          { className: "container basic-margin" },
          _react2.default.createElement(
            "h2",
            { className: "small-margin" },
            "Upload and connect your dataset"
          ),
          collectionsAreConnectedMessage,
          publishFailedMessage,
          _react2.default.createElement(
            "p",
            null,
            "Connect the excel columns to the properties of the Archetypes"
          )
        ),
        _react2.default.createElement(_collectionIndex2.default, { collectionTabs: collectionTabs, onSelectCollection: onSelectCollection }),
        _react2.default.createElement(_collectionForm2.default, { columns: headers,
          collectionName: activeCollection,
          archetypeFields: archetypeFields,
          availableArchetypes: availableArchetypes,
          availableCollectionColumnsPerArchetype: availableCollectionColumnsPerArchetype,
          propertyMappings: propertyMappings,
          customPropertyMappings: customPropertyMappings,
          onSetFieldMapping: onSetFieldMapping,
          onClearFieldMapping: onClearFieldMapping,
          onRemoveCustomProperty: onRemoveCustomProperty,
          onConfirmFieldMappings: onConfirmFieldMappings,
          onUnconfirmFieldMappings: onUnconfirmFieldMappings,
          onAddCustomProperty: onAddCustomProperty,
          targetableVres: targetableVres }),
        _react2.default.createElement(
          "div",
          { className: "container big-margin" },
          _react2.default.createElement(
            "button",
            { onClick: onPublishData, className: "btn btn-warning btn-lg pull-right", type: "button", disabled: !allMappingsAreComplete || publishing },
            publishing ? "Publishing" : "Publish dataset"
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "container big-margin" },
          _react2.default.createElement(
            "p",
            { className: "from-excel" },
            _react2.default.createElement("img", { src: "images/icon-excel.svg", alt: "" }),
            " ",
            _react2.default.createElement(
              "em",
              null,
              activeCollection
            ),
            " from ",
            uploadedFileName
          ),
          _react2.default.createElement(_collectionTable2.default, {
            rows: rows,
            headers: headers,
            nextUrl: nextUrl,
            onIgnoreColumnToggle: function onIgnoreColumnToggle(header) {
              return _onIgnoreColumnToggle(activeCollection, header);
            },
            onLoadMoreClick: function onLoadMoreClick(url) {
              return _onLoadMoreClick(url, activeCollection);
            } })
        )
      );
    }
  }]);

  return ConnectData;
}(_react2.default.Component);

exports.default = ConnectData;

},{"./collection-form":100,"./collection-index":101,"./collection-table":103,"./message":111,"./upload-button":126,"react":"react"}],105:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _selectField = require("./fields/select-field");

var _selectField2 = _interopRequireDefault(_selectField);

var _message = require("./message");

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConnectToArchetype = function (_React$Component) {
  _inherits(ConnectToArchetype, _React$Component);

  function ConnectToArchetype() {
    _classCallCheck(this, ConnectToArchetype);

    return _possibleConstructorReturn(this, (ConnectToArchetype.__proto__ || Object.getPrototypeOf(ConnectToArchetype)).apply(this, arguments));
  }

  _createClass(ConnectToArchetype, [{
    key: "render",
    value: function render() {
      var _props = this.props;
      var onMapCollectionArchetype = _props.onMapCollectionArchetype;
      var onConfirmCollectionArchetypeMappings = _props.onConfirmCollectionArchetypeMappings;
      var _onCloseMessage = _props.onCloseMessage;
      var sheets = _props.sheets;
      var archetype = _props.archetype;
      var mappings = _props.mappings;
      var showFileIsUploadedMessage = _props.showFileIsUploadedMessage;
      var uploadedFileName = _props.uploadedFileName;


      var collectionsAreMapped = Object.keys(mappings.collections).length > 0 && Object.keys(mappings.collections).map(function (key) {
        return mappings.collections[key].archetypeName;
      }).indexOf(null) < 0;

      var fileIsUploadedMessage = showFileIsUploadedMessage ? _react2.default.createElement(
        _message2.default,
        { alertLevel: "info", dismissible: true, onCloseMessage: function onCloseMessage() {
            return _onCloseMessage("showFileIsUploadedMessage");
          } },
        _react2.default.createElement(
          "em",
          null,
          uploadedFileName
        ),
        " is uploaded."
      ) : null;

      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(
          "div",
          { className: "container basic-margin" },
          _react2.default.createElement(
            "h2",
            { className: "small-margin" },
            "Upload and connect your dataset"
          ),
          fileIsUploadedMessage,
          _react2.default.createElement(
            "p",
            null,
            "We found ",
            sheets.length,
            " collections in the file. Connect the tabs to the Timbuctoo Archetypes."
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "container basic-margin" },
          sheets.map(function (sheet) {
            return _react2.default.createElement(
              "div",
              { className: "row", key: sheet.collection },
              _react2.default.createElement(
                "div",
                { className: "col-md-2" },
                _react2.default.createElement(
                  "span",
                  { className: "from-excel" },
                  _react2.default.createElement("img", { src: "images/icon-excel.svg", alt: "" }),
                  " ",
                  sheet.collection
                )
              ),
              _react2.default.createElement(
                "div",
                { className: "col-md-8" },
                _react2.default.createElement(
                  _selectField2.default,
                  {
                    onChange: function onChange(value) {
                      return onMapCollectionArchetype(sheet.collection, value);
                    },
                    onClear: function onClear() {
                      return onMapCollectionArchetype(sheet.collection, null);
                    },
                    value: mappings.collections[sheet.collection].archetypeName },
                  _react2.default.createElement(
                    "span",
                    { type: "placeholder" },
                    "Connect ",
                    _react2.default.createElement(
                      "em",
                      null,
                      sheet.collection
                    ),
                    " to a Timbuctoo archetype."
                  ),
                  Object.keys(archetype).filter(function (domain) {
                    return domain !== "relations";
                  }).sort().map(function (option) {
                    return _react2.default.createElement(
                      "span",
                      { key: option, value: option },
                      option
                    );
                  })
                )
              ),
              mappings.collections[sheet.collection].archetypeName ? _react2.default.createElement(
                "div",
                { className: "col-sm-1 hi-success", key: sheet.collection },
                _react2.default.createElement("span", { className: "glyphicon glyphicon-ok pull-right" })
              ) : null
            );
          })
        ),
        _react2.default.createElement(
          "div",
          { className: "container basic-margin" },
          _react2.default.createElement(
            "button",
            { onClick: onConfirmCollectionArchetypeMappings, type: "button", className: "btn btn-success", disabled: !collectionsAreMapped },
            "Connect"
          )
        )
      );
    }
  }]);

  return ConnectToArchetype;
}(_react2.default.Component);

exports.default = ConnectToArchetype;

},{"./fields/select-field":108,"./message":111,"react":"react"}],106:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (props) {
  var vres = props.vres;
  var caption = props.caption;
  var userId = props.userId;


  return _react2.default.createElement(
    'div',
    { className: 'container' },
    _react2.default.createElement(
      'div',
      { className: 'basic-margin' },
      props.children,
      _react2.default.createElement(
        'h3',
        null,
        caption
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'big-margin' },
      Object.keys(vres).map(function (vre) {
        return _react2.default.createElement(_datasetCard2.default, { key: vre, userId: userId, vreId: vres[vre].name, caption: vres[vre].name.replace(/^[a-z0-9]+_/, "") });
      })
    )
  );
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _datasetCard = require('./datasetCard.jsx');

var _datasetCard2 = _interopRequireDefault(_datasetCard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./datasetCard.jsx":107,"react":"react"}],107:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TIMBUCTOO_SEARCH_URL = globals && globals.env ? globals.env.TIMBUCTOO_SEARCH_URL : "/";

function DataSetCard(props) {
  return _react2.default.createElement(
    "div",
    { className: "card-dataset" },
    _react2.default.createElement(
      "a",
      { className: "card-dataset btn btn-default explore",
        href: TIMBUCTOO_SEARCH_URL + "?vreId=" + props.vreId, target: "_blank" },
      "Explore",
      _react2.default.createElement("br", null),
      _react2.default.createElement(
        "strong",
        null,
        props.caption
      )
    ),
    props.userId ? _react2.default.createElement(
      "a",
      { className: "card-dataset btn btn-default",
        href: "" + "/static/edit-gui/?vreId=" + props.vreId + "&hsid=" + props.userId, target: "_blank" },
      _react2.default.createElement("span", { className: "glyphicon glyphicon-pencil" }),
      " ",
      "Edit"
    ) : null
  );
}

exports.default = DataSetCard;

},{"react":"react"}],108:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectField = function (_React$Component) {
  _inherits(SelectField, _React$Component);

  function SelectField(props) {
    _classCallCheck(this, SelectField);

    var _this = _possibleConstructorReturn(this, (SelectField.__proto__ || Object.getPrototypeOf(SelectField)).call(this, props));

    _this.state = {
      isOpen: false
    };
    _this.documentClickListener = _this.handleDocumentClick.bind(_this);
    return _this;
  }

  _createClass(SelectField, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener("click", this.documentClickListener, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener("click", this.documentClickListener, false);
    }
  }, {
    key: "toggleSelect",
    value: function toggleSelect() {
      if (this.state.isOpen) {
        this.setState({ isOpen: false });
      } else {
        this.setState({ isOpen: true });
      }
    }
  }, {
    key: "handleDocumentClick",
    value: function handleDocumentClick(ev) {
      var isOpen = this.state.isOpen;

      if (isOpen && !_reactDom2.default.findDOMNode(this).contains(ev.target)) {
        this.setState({
          isOpen: false
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var onChange = _props.onChange;
      var onClear = _props.onClear;
      var value = _props.value;


      var selectedOption = _react2.default.Children.toArray(this.props.children).filter(function (opt) {
        return opt.props.value === value;
      });
      var placeholder = _react2.default.Children.toArray(this.props.children).filter(function (opt) {
        return opt.props.type === "placeholder";
      });
      var otherOptions = _react2.default.Children.toArray(this.props.children).filter(function (opt) {
        return opt.props.value && opt.props.value !== value;
      });

      return _react2.default.createElement(
        "div",
        { className: (0, _classnames2.default)("dropdown", { open: this.state.isOpen }) },
        _react2.default.createElement(
          "button",
          { className: "btn btn-blank dropdown-toggle", onClick: this.toggleSelect.bind(this) },
          selectedOption.length ? selectedOption : placeholder,
          " ",
          _react2.default.createElement("span", { className: "caret" })
        ),
        _react2.default.createElement(
          "ul",
          { className: "dropdown-menu" },
          value ? _react2.default.createElement(
            "li",
            null,
            _react2.default.createElement(
              "a",
              { onClick: function onClick() {
                  onClear();_this2.toggleSelect();
                } },
              "- clear -"
            )
          ) : null,
          otherOptions.map(function (option, i) {
            return _react2.default.createElement(
              "li",
              { key: i },
              _react2.default.createElement(
                "a",
                { style: { cursor: "pointer" }, onClick: function onClick() {
                    onChange(option.props.value);_this2.toggleSelect();
                  } },
                option
              )
            );
          })
        )
      );
    }
  }]);

  return SelectField;
}(_react2.default.Component);

SelectField.propTypes = {
  onChange: _react2.default.PropTypes.func,
  onClear: _react2.default.PropTypes.func,
  value: _react2.default.PropTypes.string
};

exports.default = SelectField;

},{"classnames":2,"react":"react","react-dom":"react-dom"}],109:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _uploadButton = require("./upload-button");

var _uploadButton2 = _interopRequireDefault(_uploadButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// (renames from UploadSplashScreen)
function FirstUpload(props) {
  var onUploadFileSelect = props.onUploadFileSelect;
  var userId = props.userId;
  var isUploading = props.isUploading;


  var sampleSheet = props.exampleSheetUrl ? _react2.default.createElement(
    "p",
    null,
    "Don't have a dataset handy? Here’s an ",
    _react2.default.createElement(
      "a",
      { href: props.exampleSheetUrl },
      "example excel sheet"
    ),
    "."
  ) : null;

  var uploadButton = _react2.default.createElement(_uploadButton2.default, {
    classNames: ["btn", "btn-lg", "btn-primary"],
    glyphicon: "glyphicon glyphicon-cloud-upload",
    isUploading: isUploading,
    label: "Browse",
    onUploadFileSelect: onUploadFileSelect });

  return _react2.default.createElement(
    "div",
    { className: "container" },
    _react2.default.createElement(
      "div",
      { className: "jumbotron first-upload upload-bg" },
      _react2.default.createElement(
        "h2",
        null,
        "Upload your first dataset"
      ),
      sampleSheet,
      userId ? uploadButton : _react2.default.createElement(
        "form",
        { action: "https://secure.huygens.knaw.nl/saml2/login", method: "POST" },
        _react2.default.createElement("input", { name: "hsurl", type: "hidden", value: window.location.href }),
        _react2.default.createElement(
          "p",
          null,
          "Most university accounts will work."
        ),
        _react2.default.createElement(
          "button",
          { className: "btn btn-primary btn-lg", type: "submit" },
          _react2.default.createElement("span", { className: "glyphicon glyphicon-log-in" }),
          " Log in to upload"
        )
      )
    )
  );
}

exports.default = FirstUpload;

},{"./upload-button":126,"react":"react"}],110:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Footer(props) {
  var hiLogo = _react2.default.createElement(
    "div",
    { className: "col-sm-1 col-md-1" },
    _react2.default.createElement("img", { className: "hi-logo", src: "images/logo-huygens-ing.svg" })
  );

  var clariahLogo = _react2.default.createElement(
    "div",
    { className: "col-sm-1 col-md-1" },
    _react2.default.createElement("img", { className: "logo", src: "images/logo-clariah.svg" })
  );

  var footerBody = _react2.default.Children.count(props.children) > 0 ? _react2.default.Children.map(props.children, function (child, i) {
    return _react2.default.createElement(
      "div",
      { className: "white-bar" },
      _react2.default.createElement(
        "div",
        { className: "container" },
        i === _react2.default.Children.count(props.children) - 1 ? _react2.default.createElement(
          "div",
          { className: "row" },
          hiLogo,
          _react2.default.createElement(
            "div",
            { className: "col-sm-10 col-md-10 text-center" },
            child
          ),
          clariahLogo
        ) : _react2.default.createElement(
          "div",
          { className: "row" },
          _react2.default.createElement(
            "div",
            { className: "col-sm-12 col-md-12 text-center" },
            child
          )
        )
      )
    );
  }) : _react2.default.createElement(
    "div",
    { className: "white-bar" },
    _react2.default.createElement(
      "div",
      { className: "container" },
      _react2.default.createElement(
        "div",
        { className: "row" },
        hiLogo,
        _react2.default.createElement("div", { className: "col-sm-10 col-md-10 text-center" }),
        clariahLogo
      )
    )
  );

  return _react2.default.createElement(
    "footer",
    { className: "footer" },
    footerBody
  );
}

exports.default = Footer;

},{"react":"react"}],111:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (props) {
  var dismissible = props.dismissible;
  var alertLevel = props.alertLevel;
  var onCloseMessage = props.onCloseMessage;

  var dismissButton = dismissible ? _react2.default.createElement(
    "button",
    { type: "button", className: "close", onClick: onCloseMessage },
    _react2.default.createElement(
      "span",
      null,
      "×"
    )
  ) : null;

  return _react2.default.createElement(
    "div",
    { className: (0, _classnames2.default)("alert", "alert-" + alertLevel, { "alert-dismissible": dismissible }), role: "alert" },
    dismissButton,
    props.children
  );
};

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"classnames":2,"react":"react"}],112:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _datasetCards = require("./dataset-cards");

var _datasetCards2 = _interopRequireDefault(_datasetCards);

var _footer = require("./footer");

var _footer2 = _interopRequireDefault(_footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FOOTER_HEIGHT = 81;

function Page(props) {
  return _react2.default.createElement(
    "div",
    { className: "page" },
    _react2.default.createElement(
      "div",
      { className: "basic-margin hi-Green container-fluid" },
      _react2.default.createElement(
        "nav",
        { className: "navbar " },
        _react2.default.createElement(
          "div",
          { className: "container" },
          _react2.default.createElement(
            "div",
            { className: "navbar-header" },
            " ",
            _react2.default.createElement(
              "a",
              { className: "navbar-brand", href: "#" },
              _react2.default.createElement("img", { src: "images/logo-timbuctoo.svg", className: "logo", alt: "timbuctoo" })
            ),
            " "
          ),
          _react2.default.createElement(
            "div",
            { id: "navbar", className: "navbar-collapse collapse" },
            _react2.default.createElement(
              "ul",
              { className: "nav navbar-nav navbar-right" },
              props.username ? _react2.default.createElement(
                "li",
                null,
                _react2.default.createElement(
                  "a",
                  { href: props.userlocation || '#' },
                  _react2.default.createElement("span", { className: "glyphicon glyphicon-user" }),
                  " ",
                  props.username
                )
              ) : null
            )
          )
        )
      )
    ),
    _react2.default.createElement(
      "div",
      { style: { marginBottom: FOOTER_HEIGHT + "px" } },
      props.children,
      props.vres && props.showDatasets ? _react2.default.createElement(
        "div",
        { className: "container" },
        _react2.default.createElement(_datasetCards2.default, { caption: "Explore all datasets", vres: props.vres })
      ) : null
    ),
    _react2.default.createElement(_footer2.default, null)
  );
}

exports.default = Page;

},{"./dataset-cards":106,"./footer":110,"react":"react"}],113:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _selectField = require("../fields/select-field");

var _selectField2 = _interopRequireDefault(_selectField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddProperty = function (_React$Component) {
  _inherits(AddProperty, _React$Component);

  function AddProperty(props) {
    _classCallCheck(this, AddProperty);

    var _this = _possibleConstructorReturn(this, (AddProperty.__proto__ || Object.getPrototypeOf(AddProperty)).call(this, props));

    _this.state = {
      newName: "",
      newType: null
    };
    return _this;
  }

  _createClass(AddProperty, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _state = this.state;
      var newName = _state.newName;
      var newType = _state.newType;
      var _props = this.props;
      var onAddCustomProperty = _props.onAddCustomProperty;
      var archetypeFields = _props.archetypeFields;
      var availableArchetypes = _props.availableArchetypes;


      var relationTypeOptions = archetypeFields.filter(function (prop) {
        return prop.type === "relation";
      }).filter(function (prop) {
        return availableArchetypes.indexOf(prop.relation.targetCollection) > -1;
      }).map(function (prop) {
        return _react2.default.createElement(
          "span",
          { key: prop.name, value: prop.name },
          prop.name
        );
      });

      return _react2.default.createElement(
        "div",
        { className: "row small-margin" },
        _react2.default.createElement(
          "div",
          { className: "col-sm-2" },
          newType === "relation" || newType === "relation-to-existing" ? _react2.default.createElement(
            _selectField2.default,
            {
              value: newName,
              onChange: function onChange(value) {
                return _this2.setState({ newName: value });
              },
              onClear: function onClear() {
                return _this2.setState({ newName: "" });
              } },
            _react2.default.createElement(
              "span",
              { type: "placeholder" },
              "Choose a relation type..."
            ),
            relationTypeOptions
          ) : _react2.default.createElement("input", { className: "form-control",
            onChange: function onChange(ev) {
              return _this2.setState({ newName: ev.target.value });
            },
            placeholder: "Property name",
            value: newName,
            disabled: newType !== "text" })
        ),
        _react2.default.createElement(
          "div",
          { className: "col-sm-8" },
          _react2.default.createElement(
            "span",
            null,
            _react2.default.createElement(
              _selectField2.default,
              {
                value: newType,
                onChange: function onChange(value) {
                  return _this2.setState({ newType: value, newName: value === "relation" ? null : newName });
                },
                onClear: function onClear() {
                  return _this2.setState({ newType: null });
                } },
              _react2.default.createElement(
                "span",
                { type: "placeholder" },
                "Choose a type..."
              ),
              _react2.default.createElement(
                "span",
                { value: "text" },
                "Text"
              ),
              _react2.default.createElement(
                "span",
                { value: "relation" },
                "Relation"
              ),
              _react2.default.createElement(
                "span",
                { value: "relation-to-existing" },
                "Relation to existing Timbuctoo collection"
              )
            )
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "col-sm-2" },
          _react2.default.createElement(
            "button",
            { className: "pull-right btn btn-default", disabled: !(newName && newType),
              onClick: function onClick() {
                _this2.setState({ newName: null, newType: null });
                onAddCustomProperty(newName, newType);
              } },
            "Add property"
          )
        )
      );
    }
  }]);

  return AddProperty;
}(_react2.default.Component);

AddProperty.propTypes = {
  importData: _react2.default.PropTypes.object,
  mappings: _react2.default.PropTypes.object,
  onAddCustomProperty: _react2.default.PropTypes.func
};

exports.default = AddProperty;

},{"../fields/select-field":108,"react":"react"}],114:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _selectField = require("../fields/select-field");

var _selectField2 = _interopRequireDefault(_selectField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ColumnSelect = function (_React$Component) {
  _inherits(ColumnSelect, _React$Component);

  function ColumnSelect() {
    _classCallCheck(this, ColumnSelect);

    return _possibleConstructorReturn(this, (ColumnSelect.__proto__ || Object.getPrototypeOf(ColumnSelect)).apply(this, arguments));
  }

  _createClass(ColumnSelect, [{
    key: "render",
    value: function render() {
      var _props = this.props;
      var columns = _props.columns;
      var propertyMapping = _props.propertyMapping;
      var onColumnSelect = _props.onColumnSelect;
      var onClearColumn = _props.onClearColumn;
      var placeholder = _props.placeholder;


      var selectedColumn = propertyMapping && propertyMapping.variable[0] ? propertyMapping.variable[0].variableName : null;

      return propertyMapping && propertyMapping.confirmed ? _react2.default.createElement(
        "div",
        { className: "from-excel pad-6-12" },
        _react2.default.createElement("img", { src: "images/icon-excel.svg", alt: "" }),
        " ",
        selectedColumn
      ) : _react2.default.createElement(
        _selectField2.default,
        { value: selectedColumn,
          onChange: function onChange(column) {
            return onColumnSelect([{ variableName: column }]);
          },
          onClear: function onClear() {
            return onClearColumn(0);
          } },
        _react2.default.createElement(
          "span",
          { type: "placeholder", className: "from-excel" },
          _react2.default.createElement("img", { src: "images/icon-excel.svg", alt: "" }),
          " ",
          placeholder || "Select an excel column"
        ),
        columns.filter(function (col) {
          return col.name === selectedColumn || !col.isConfirmed && !col.isIgnored;
        }).map(function (col) {
          return _react2.default.createElement(
            "span",
            { key: col.name, value: col.name, className: "from-excel" },
            _react2.default.createElement("img", { src: "images/icon-excel.svg", alt: "" }),
            " ",
            col.name
          );
        })
      );
    }
  }]);

  return ColumnSelect;
}(_react2.default.Component);

ColumnSelect.propTypes = {
  collectionData: _react2.default.PropTypes.object,
  mappings: _react2.default.PropTypes.object,
  name: _react2.default.PropTypes.string,
  onClearFieldMapping: _react2.default.PropTypes.func,
  onSetFieldMapping: _react2.default.PropTypes.func
};

exports.default = ColumnSelect;

},{"../fields/select-field":108,"react":"react"}],115:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _text = require("./text");

var _text2 = _interopRequireDefault(_text);

var _relation = require("./relation");

var _relation2 = _interopRequireDefault(_relation);

var _relationToExisting = require("./relation-to-existing");

var _relationToExisting2 = _interopRequireDefault(_relationToExisting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var typeMap = {
  text: function text(props) {
    return _react2.default.createElement(_text2.default, props);
  },
  datable: function datable(props) {
    return _react2.default.createElement(_text2.default, props);
  },
  relation: function relation(props) {
    return _react2.default.createElement(_relation2.default, props);
  },
  "relation-to-existing": function relationToExisting(props) {
    return _react2.default.createElement(_relationToExisting2.default, props);
  }
};

var PropertyForm = function (_React$Component) {
  _inherits(PropertyForm, _React$Component);

  function PropertyForm() {
    _classCallCheck(this, PropertyForm);

    return _possibleConstructorReturn(this, (PropertyForm.__proto__ || Object.getPrototypeOf(PropertyForm)).apply(this, arguments));
  }

  _createClass(PropertyForm, [{
    key: "canConfirm",
    value: function canConfirm(variable) {
      var type = this.props.type;

      if (!variable || variable.length === 0) {
        return false;
      }
      if (type === "relation") {
        return variable[0].variableName && variable[0].targetCollection && variable[0].targetVariableName;
      } else if (type === "relation-to-existing") {
        return variable[0].variableName && variable[0].targetExistingTimbuctooVre;
      }
      return variable.filter(function (m) {
        return m.variableName;
      }).length === variable.length;
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props;
      var name = _props.name;
      var type = _props.type;
      var custom = _props.custom;
      var propertyMapping = _props.propertyMapping;
      var _props2 = this.props;
      var onRemoveCustomProperty = _props2.onRemoveCustomProperty;
      var onConfirmFieldMappings = _props2.onConfirmFieldMappings;
      var onUnconfirmFieldMappings = _props2.onUnconfirmFieldMappings;
      var onSetFieldMapping = _props2.onSetFieldMapping;
      var onClearFieldMapping = _props2.onClearFieldMapping;


      var confirmed = propertyMapping && propertyMapping.confirmed;

      var confirmButton = propertyMapping && this.canConfirm(propertyMapping.variable) && !confirmed ? _react2.default.createElement(
        "button",
        { className: "btn btn-success", onClick: function onClick() {
            return onConfirmFieldMappings(name);
          } },
        "Confirm"
      ) : confirmed ? _react2.default.createElement(
        "button",
        { className: "btn btn-blank", onClick: function onClick() {
            return onUnconfirmFieldMappings(name);
          } },
        _react2.default.createElement("span", { className: "hi-success glyphicon glyphicon-ok" })
      ) : null;

      var formComponent = typeMap[type](_extends({}, this.props, {
        onColumnSelect: function onColumnSelect(value) {
          return onSetFieldMapping(name, value);
        },
        onClearColumn: function onClearColumn(valueIdx) {
          return onClearFieldMapping(name, valueIdx);
        }
      }));

      return _react2.default.createElement(
        "div",
        { className: "row small-margin" },
        _react2.default.createElement(
          "div",
          { className: "col-sm-2 pad-6-12" },
          _react2.default.createElement(
            "strong",
            null,
            name
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "col-sm-2 pad-6-12" },
          _react2.default.createElement(
            "span",
            { className: "pull-right" },
            "(",
            type,
            ")"
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "col-sm-5" },
          formComponent
        ),
        _react2.default.createElement(
          "div",
          { className: "col-sm-1" },
          custom ? _react2.default.createElement(
            "button",
            { className: "btn btn-blank pull-right", type: "button", onClick: function onClick() {
                return onRemoveCustomProperty(name);
              } },
            _react2.default.createElement("span", { className: "glyphicon glyphicon-remove" })
          ) : null
        ),
        _react2.default.createElement(
          "div",
          { className: "col-sm-2 hi-success" },
          _react2.default.createElement(
            "span",
            { className: "pull-right" },
            confirmButton
          )
        )
      );
    }
  }]);

  return PropertyForm;
}(_react2.default.Component);

exports.default = PropertyForm;

},{"./relation":117,"./relation-to-existing":116,"./text":118,"react":"react"}],116:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _columnSelect = require("./column-select");

var _columnSelect2 = _interopRequireDefault(_columnSelect);

var _selectField = require("../fields/select-field");

var _selectField2 = _interopRequireDefault(_selectField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_React$Component) {
  _inherits(Form, _React$Component);

  function Form() {
    _classCallCheck(this, Form);

    return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
  }

  _createClass(Form, [{
    key: "render",
    value: function render() {
      var _props = this.props;
      var _onColumnSelect = _props.onColumnSelect;
      var onClearColumn = _props.onClearColumn;
      var propertyMapping = _props.propertyMapping;
      var targetableVres = _props.targetableVres;


      var relationInfo = propertyMapping && propertyMapping.variable[0] ? propertyMapping.variable[0] : {};

      var sourceColumnProps = _extends({}, this.props, {
        placeholder: "Select a source column...",
        onColumnSelect: function onColumnSelect(value) {
          return _onColumnSelect([_extends({}, relationInfo, { variableName: value[0].variableName })]);
        }
      });

      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(_columnSelect2.default, sourceColumnProps),
        _react2.default.createElement(
          _selectField2.default,
          { value: relationInfo.targetExistingTimbuctooVre || null,
            onChange: function onChange(value) {
              return _onColumnSelect([_extends({}, relationInfo, { targetExistingTimbuctooVre: value })]);
            },
            onClear: function onClear() {
              return onClearColumn(0);
            } },
          _react2.default.createElement(
            "span",
            { type: "placeholder", className: "from-excel" },
            _react2.default.createElement("img", { src: "images/icon-excel.svg", alt: "" }),
            " Select a target dataset..."
          ),
          targetableVres.map(function (dataset) {
            return _react2.default.createElement(
              "span",
              { key: dataset, value: dataset, className: "from-excel" },
              _react2.default.createElement("img", { src: "images/icon-excel.svg", alt: "" }),
              " ",
              dataset
            );
          })
        )
      );
    }
  }]);

  return Form;
}(_react2.default.Component);

Form.propTypes = {
  collectionData: _react2.default.PropTypes.object,
  mappings: _react2.default.PropTypes.object,
  name: _react2.default.PropTypes.string,
  onClearFieldMapping: _react2.default.PropTypes.func,
  onSetFieldMapping: _react2.default.PropTypes.func
};

exports.default = Form;

},{"../fields/select-field":108,"./column-select":114,"react":"react"}],117:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _columnSelect = require("./column-select");

var _columnSelect2 = _interopRequireDefault(_columnSelect);

var _selectField = require("../fields/select-field");

var _selectField2 = _interopRequireDefault(_selectField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_React$Component) {
  _inherits(Form, _React$Component);

  function Form() {
    _classCallCheck(this, Form);

    return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
  }

  _createClass(Form, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var _onColumnSelect = _props.onColumnSelect;
      var onClearColumn = _props.onClearColumn;
      var propertyMapping = _props.propertyMapping;
      var availableCollectionColumnsPerArchetype = _props.availableCollectionColumnsPerArchetype;
      var archetypeFields = _props.archetypeFields;


      var relationInfo = propertyMapping && propertyMapping.variable[0] ? propertyMapping.variable[0] : {};

      var targetArchetypeCollection = archetypeFields.find(function (af) {
        return af.name === _this2.props.name;
      }).relation.targetCollection;
      var targetCollectionColumns = availableCollectionColumnsPerArchetype[targetArchetypeCollection];
      var targetCollections = targetCollectionColumns.map(function (t) {
        return t.collectionName;
      });

      var sourceColumnProps = _extends({}, this.props, {
        placeholder: "Select a source column...",
        onColumnSelect: function onColumnSelect(value) {
          return _onColumnSelect([_extends({}, relationInfo, { variableName: value[0].variableName })]);
        }
      });

      var targetColumnProps = relationInfo.targetCollection ? _extends({}, this.props, {
        placeholder: "Select a target column...",
        propertyMapping: { variable: [{ variableName: relationInfo.targetVariableName }] },
        columns: targetCollectionColumns.find(function (t) {
          return t.collectionName === relationInfo.targetCollection;
        }).columns.map(function (col) {
          return { name: col };
        }),
        onColumnSelect: function onColumnSelect(value) {
          return _onColumnSelect([_extends({}, relationInfo, { targetVariableName: value[0].variableName })]);
        }
      }) : null;

      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(_columnSelect2.default, sourceColumnProps),
        _react2.default.createElement(
          _selectField2.default,
          { value: relationInfo.targetCollection || null,
            onChange: function onChange(value) {
              return _onColumnSelect([_extends({}, relationInfo, { targetCollection: value })]);
            },
            onClear: function onClear() {
              return onClearColumn(0);
            } },
          _react2.default.createElement(
            "span",
            { type: "placeholder", className: "from-excel" },
            _react2.default.createElement("img", { src: "images/icon-excel.svg", alt: "" }),
            " Select a target sheet..."
          ),
          targetCollections.map(function (collection) {
            return _react2.default.createElement(
              "span",
              { key: collection, value: collection, className: "from-excel" },
              _react2.default.createElement("img", { src: "images/icon-excel.svg", alt: "" }),
              " ",
              collection
            );
          })
        ),
        targetColumnProps ? _react2.default.createElement(_columnSelect2.default, targetColumnProps) : null
      );
    }
  }]);

  return Form;
}(_react2.default.Component);

Form.propTypes = {
  collectionData: _react2.default.PropTypes.object,
  mappings: _react2.default.PropTypes.object,
  name: _react2.default.PropTypes.string,
  onClearFieldMapping: _react2.default.PropTypes.func,
  onSetFieldMapping: _react2.default.PropTypes.func
};

exports.default = Form;

},{"../fields/select-field":108,"./column-select":114,"react":"react"}],118:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _columnSelect = require("./column-select");

var _columnSelect2 = _interopRequireDefault(_columnSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_React$Component) {
  _inherits(Form, _React$Component);

  function Form() {
    _classCallCheck(this, Form);

    return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
  }

  _createClass(Form, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(_columnSelect2.default, this.props);
    }
  }]);

  return Form;
}(_react2.default.Component);

Form.propTypes = {
  collectionData: _react2.default.PropTypes.object,
  mappings: _react2.default.PropTypes.object,
  name: _react2.default.PropTypes.string,
  onClearFieldMapping: _react2.default.PropTypes.func,
  onSetFieldMapping: _react2.default.PropTypes.func
};

exports.default = Form;

},{"./column-select":114,"react":"react"}],119:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (appState) {
  return {
    isUploading: appState.importData.isUploading,
    userId: appState.userdata.userId,
    vres: appState.userdata.myVres || {}
  };
};

},{}],120:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Helper function for react-redux connect
function getConfirmedCols(props, variables) {
  var mappings = props.mappings;
  var activeCollection = props.importData.activeCollection;


  return variables.map(function (value, i) {
    return { value: value, index: i };
  }).filter(function (colSpec) {
    return mappings.collections[activeCollection].mappings.filter(function (m) {
      return m.confirmed;
    }).map(function (m) {
      return m.variable.map(function (v) {
        return v.variableName;
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []).indexOf(colSpec.value) > -1;
  }).map(function (colSpec) {
    return colSpec.index;
  });
}

// Helper function for react-redux connect
function mappingsAreComplete(props, sheet) {
  var mappings = props.mappings;


  var confirmedColCount = mappings.collections[sheet.collection].mappings.filter(function (m) {
    return m.confirmed;
  }).map(function (m) {
    return m.variable.map(function (v) {
      return v.variableName;
    });
  }).reduce(function (a, b) {
    return a.concat(b);
  }, []).filter(function (x, idx, self) {
    return self.indexOf(x) === idx;
  }).length;

  return confirmedColCount + mappings.collections[sheet.collection].ignoredColumns.length === sheet.variables.length;
}

function getTargetableVres(mine, vres) {
  var myVres = Object.keys(mine || {}).map(function (key) {
    return mine[key];
  }).filter(function (vre) {
    return vre.published;
  }).map(function (vre) {
    return vre.name;
  });
  var publicVres = Object.keys(vres || {}).map(function (key) {
    return vres[key].name;
  });

  return myVres.concat(publicVres);
}

// Moves to react-redux connect
function transformProps(props) {
  var _props$importData = props.importData;
  var sheets = _props$importData.sheets;
  var activeCollection = _props$importData.activeCollection;
  var uploadedFileName = _props$importData.uploadedFileName;
  var publishErrors = _props$importData.publishErrors;
  var _props$userdata = props.userdata;
  var myVres = _props$userdata.myVres;
  var vres = _props$userdata.vres;
  var mappings = props.mappings;
  var archetype = props.archetype;

  var collectionData = sheets.find(function (sheet) {
    return sheet.collection === activeCollection;
  });
  var rows = collectionData.rows;
  var variables = collectionData.variables;


  var confirmedCols = getConfirmedCols(props, variables);
  var ignoredColumns = mappings.collections[activeCollection].ignoredColumns;


  var availableArchetypes = Object.keys(mappings.collections).map(function (key) {
    return mappings.collections[key].archetypeName;
  });

  return {
    sheets: sheets,
    activeCollection: activeCollection,
    uploadedFileName: uploadedFileName,
    collectionTabs: sheets.map(function (sheet) {
      return {
        collectionName: sheet.collection,
        archetypeName: mappings.collections[sheet.collection].archetypeName,
        active: activeCollection === sheet.collection,
        complete: mappingsAreComplete(props, sheet)
      };
    }),
    rows: rows.map(function (row) {
      return row.map(function (cell, i) {
        return {
          value: cell.value,
          error: cell.error || null,
          ignored: ignoredColumns.indexOf(variables[i]) > -1
        };
      });
    }),
    headers: variables.map(function (variable, i) {
      return {
        name: variable,
        isConfirmed: ignoredColumns.indexOf(i) < 0 && confirmedCols.indexOf(i) > -1,
        isIgnored: ignoredColumns.indexOf(variable) > -1
      };
    }),
    nextUrl: sheets.find(function (sheet) {
      return sheet.collection === activeCollection;
    }).nextUrl,
    archetypeFields: archetype[mappings.collections[activeCollection].archetypeName],
    propertyMappings: mappings.collections[activeCollection].mappings,
    customPropertyMappings: mappings.collections[activeCollection].customProperties,
    availableArchetypes: availableArchetypes,
    publishing: mappings.publishing,
    availableCollectionColumnsPerArchetype: availableArchetypes.map(function (archetypeName) {
      return {
        key: archetypeName,
        values: Object.keys(mappings.collections).filter(function (collectionName) {
          return mappings.collections[collectionName].archetypeName === archetypeName;
        }).map(function (collectionName) {
          return {
            collectionName: collectionName,
            columns: sheets.find(function (sheet) {
              return sheet.collection === collectionName;
            }).variables
          };
        })
      };
    }).reduce(function (archetypeToCollectionColumnMapping, currentArchetypeAndCols) {
      archetypeToCollectionColumnMapping[currentArchetypeAndCols.key] = currentArchetypeAndCols.values;
      return archetypeToCollectionColumnMapping;
    }, {}),
    publishErrors: publishErrors,
    showCollectionsAreConnectedMessage: props.messages.showCollectionsAreConnectedMessage,
    targetableVres: getTargetableVres(myVres, vres)
  };
}

exports.default = transformProps;

},{}],121:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (appState) {
  return {
    mappings: appState.mappings,
    sheets: appState.importData.sheets,
    uploadedFileName: appState.importData.uploadedFileName,
    archetype: appState.archetype,
    onMapCollectionArchetype: appState.onMapCollectionArchetype,
    onConfirmCollectionArchetypeMappings: appState.onConfirmCollectionArchetypeMappings,
    showFileIsUploadedMessage: appState.messages.showFileIsUploadedMessage
  };
};

},{}],122:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (appState) {
  return {
    userId: appState.userdata.userId,
    isUploading: appState.importData.isUploading
  };
};

},{}],123:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _router = require("../../router");

exports.default = function (appState, ownProps) {
  var pathname = ownProps.location.pathname;

  return {
    username: appState.userdata.userId,
    vres: appState.userdata.vres,
    showDatasets: pathname === "/" || pathname === _router.urls.collectionsOverview()
  };
};

},{"../../router":134}],124:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataRow = function (_React$Component) {
  _inherits(DataRow, _React$Component);

  function DataRow() {
    _classCallCheck(this, DataRow);

    return _possibleConstructorReturn(this, (DataRow.__proto__ || Object.getPrototypeOf(DataRow)).apply(this, arguments));
  }

  _createClass(DataRow, [{
    key: "render",
    value: function render() {
      var row = this.props.row;

      return _react2.default.createElement(
        "tr",
        null,
        row.map(function (cell, i) {
          return _react2.default.createElement(
            "td",
            { className: (0, _classnames2.default)({
                ignored: cell.ignored,
                danger: cell.error ? true : false
              }), key: i },
            cell.value,
            cell.error ? _react2.default.createElement("span", { className: "pull-right glyphicon glyphicon-exclamation-sign", style: { cursor: "pointer" }, title: cell.error }) : null
          );
        })
      );
    }
  }]);

  return DataRow;
}(_react2.default.Component);

DataRow.propTypes = {
  row: _react2.default.PropTypes.array
};

exports.default = DataRow;

},{"classnames":2,"react":"react"}],125:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeaderCell = function (_React$Component) {
  _inherits(HeaderCell, _React$Component);

  function HeaderCell() {
    _classCallCheck(this, HeaderCell);

    return _possibleConstructorReturn(this, (HeaderCell.__proto__ || Object.getPrototypeOf(HeaderCell)).apply(this, arguments));
  }

  _createClass(HeaderCell, [{
    key: "render",
    value: function render() {
      var _props = this.props;
      var header = _props.header;
      var isConfirmed = _props.isConfirmed;
      var isIgnored = _props.isIgnored;
      var onIgnoreColumnToggle = _props.onIgnoreColumnToggle;


      return _react2.default.createElement(
        "th",
        { className: (0, _classnames2.default)({
            success: isConfirmed,
            info: !isConfirmed && !isIgnored,
            danger: !isConfirmed && isIgnored
          }) },
        header,
        _react2.default.createElement("a", { style: { cursor: "pointer" }, className: (0, _classnames2.default)("pull-right", "glyphicon", {
            "glyphicon-ok-sign": isConfirmed,
            "glyphicon-question-sign": !isConfirmed && !isIgnored,
            "glyphicon-remove": !isConfirmed && isIgnored
          }), onClick: function onClick() {
            return !isConfirmed ? onIgnoreColumnToggle(header) : null;
          } })
      );
    }
  }]);

  return HeaderCell;
}(_react2.default.Component);

HeaderCell.propTypes = {
  header: _react2.default.PropTypes.string,
  isConfirmed: _react2.default.PropTypes.bool,
  isIgnored: _react2.default.PropTypes.bool,
  onIgnoreColumnToggle: _react2.default.PropTypes.func
};

exports.default = HeaderCell;

},{"classnames":2,"react":"react"}],126:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UploadButton = function (_React$Component) {
  _inherits(UploadButton, _React$Component);

  function UploadButton() {
    _classCallCheck(this, UploadButton);

    return _possibleConstructorReturn(this, (UploadButton.__proto__ || Object.getPrototypeOf(UploadButton)).apply(this, arguments));
  }

  _createClass(UploadButton, [{
    key: "render",
    value: function render() {
      var _props = this.props;
      var classNames = _props.classNames;
      var isUploading = _props.isUploading;
      var onUploadFileSelect = _props.onUploadFileSelect;
      var glyphicon = _props.glyphicon;
      var label = _props.label;

      return _react2.default.createElement(
        "form",
        null,
        _react2.default.createElement(
          "label",
          { className: _classnames2.default.apply(undefined, _toConsumableArray(classNames).concat([{ disabled: isUploading }])) },
          _react2.default.createElement("span", { className: glyphicon }),
          " ",
          isUploading ? "Uploading..." : label,
          _react2.default.createElement("input", {
            disabled: isUploading,
            onChange: function onChange(e) {
              return onUploadFileSelect(e.target.files);
            },
            style: { display: "none" },
            type: "file" })
        )
      );
    }
  }]);

  return UploadButton;
}(_react2.default.Component);

exports.default = UploadButton;

},{"classnames":2,"react":"react"}],127:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _xhr = require("xhr");

var _xhr2 = _interopRequireDefault(_xhr);

var _xhrMock = require("xhr-mock");

var _xhrMock2 = _interopRequireDefault(_xhrMock);

var _servermocks = require("./servermocks");

var _servermocks2 = _interopRequireDefault(_servermocks);

var _router = require("./router");

var _router2 = _interopRequireDefault(_router);

var _actions = require("./actions");

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if ("false" === "true") {
	console.log("Using mock server!");
	var orig = window.XMLHttpRequest;
	_xhrMock2.default.setup(); //mock window.XMLHttpRequest usages
	var mock = window.XMLHttpRequest;
	window.XMLHttpRequest = orig;
	_xhr2.default.XMLHttpRequest = mock;
	_xhr2.default.XDomainRequest = mock;
	(0, _servermocks2.default)(_xhrMock2.default, orig);
}
var actions = (0, _actions2.default)(_router.navigateTo, _store2.default.dispatch.bind(_store2.default));

function checkTokenInUrl(state) {
	var path = window.location.search.substr(1);
	var params = path.split('&');

	for (var i in params) {
		var _params$i$split = params[i].split('=');

		var _params$i$split2 = _slicedToArray(_params$i$split, 2);

		var key = _params$i$split2[0];
		var value = _params$i$split2[1];

		if (key === 'hsid' && !state.userdata.userId) {
			actions.onToken(value);

			break;
		}
	}
}

document.addEventListener("DOMContentLoaded", function () {
	var state = _store2.default.getState();
	checkTokenInUrl(state);
	if (!state.archetype || Object.keys(state.archetype).length === 0) {
		(0, _xhr2.default)("" + "/v2.1/metadata/Admin", function (err, resp) {
			_store2.default.dispatch({ type: "SET_ARCHETYPE_METADATA", data: JSON.parse(resp.body) });
		});
	}
	_reactDom2.default.render(_router2.default, document.getElementById("app"));
});

},{"./actions":99,"./router":134,"./servermocks":135,"./store":136,"react":"react","react-dom":"react-dom","xhr":97,"xhr-mock":93}],128:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case "SET_ARCHETYPE_METADATA":
			return action.data;
	}

	return state;
};

var _persist = require("../util/persist");

var initialState = (0, _persist.getItem)("archetype") || {};

},{"../util/persist":140}],129:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];

	var _ret = function () {
		switch (action.type) {
			case "START_UPLOAD":
				return {
					v: _extends({}, state, { isUploading: true })
				};
			case "FINISH_UPLOAD":
				return {
					v: _extends({}, state, {
						isUploading: false,
						publishErrors: false,
						uploadedFileName: action.uploadedFileName,
						sheets: action.data.collections.map(function (sheet) {
							return {
								collection: sheet.name,
								variables: sheet.variables,
								rows: [],
								nextUrl: sheet.data,
								nextUrlWithErrors: sheet.dataWithErrors
							};
						}),
						activeCollection: action.data.collections[0].name,
						vre: action.data.vre,
						saveMappingUrl: action.data.saveMapping,
						executeMappingUrl: action.data.executeMapping
					})
				};
			case "COLLECTION_ITEMS_LOADING_SUCCEEDED":
				var sheetIdx = findIndex(state.sheets, function (sheet) {
					return sheet.collection === action.collection;
				});
				return {
					v: _extends({}, state, {
						sheets: [].concat(_toConsumableArray(state.sheets.slice(0, sheetIdx)), [_extends({}, state.sheets[sheetIdx], {
							rows: addRows(state.sheets[sheetIdx].rows, action.data.items, state.sheets[sheetIdx].variables),
							nextUrl: action.data._next
						})], _toConsumableArray(state.sheets.slice(sheetIdx + 1)))
					})
				};

			case "COLLECTION_ITEMS_LOADING_FINISHED":
				var result = _extends({}, state);
				result.sheets = result.sheets.slice();
				result.sheets.forEach(function (sheet, i) {
					if (sheet.collection === action.collection) {
						result.sheets[i] = _extends({}, sheet, {
							isLoading: false
						});
					}
				});

				return {
					v: result
				};
			case "SET_ACTIVE_COLLECTION":
				return {
					v: _extends({}, state, { activeCollection: action.collection })
				};
			case "PUBLISH_HAD_ERROR":
				// clear the sheets to force reload
				return {
					v: _extends({}, state, {
						publishErrors: true,
						sheets: state.sheets.map(function (sheet) {
							return _extends({}, sheet, {
								rows: [],
								nextUrl: sheet.nextUrlWithErrors
							});
						})
					})
				};
			case "PUBLISH_SUCCEEDED":
				// clear the sheets to force reload
				return {
					v: _extends({}, state, {
						publishErrors: false,
						sheets: state.sheets.map(function (sheet) {
							return _extends({}, sheet, {
								rows: [],
								nextUrl: sheet.nextUrlWithErrors
							});
						})
					})
				};
		}
	}();

	if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
	return state;
};

var _persist = require("../util/persist");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = (0, _persist.getItem)("importData") || {
	isUploading: false,
	sheets: null,
	activeCollection: null,
	publishErrors: false,
	uploadedFileName: undefined
};

function findIndex(arr, f) {
	var length = arr.length;
	for (var i = 0; i < length; i++) {
		if (f(arr[i], i, arr)) {
			return i;
		}
	}
	return -1;
}

function sheetRowFromDictToArray(rowdict, arrayOfVariableNames, mappingErrors) {
	return arrayOfVariableNames.map(function (name) {
		return {
			value: rowdict[name],
			error: mappingErrors[name] || undefined
		};
	});
}

function addRows(curRows, newRows, arrayOfVariableNames) {
	return curRows.concat(newRows.map(function (item) {
		return sheetRowFromDictToArray(item.values || {}, arrayOfVariableNames, item.errors || {});
	}));
}

},{"../util/persist":140}],130:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _importData = require("./import-data");

var _importData2 = _interopRequireDefault(_importData);

var _archetype = require("./archetype");

var _archetype2 = _interopRequireDefault(_archetype);

var _mappings = require("./mappings");

var _mappings2 = _interopRequireDefault(_mappings);

var _userdata = require("./userdata");

var _userdata2 = _interopRequireDefault(_userdata);

var _messages = require("./messages");

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	messages: _messages2.default,
	importData: _importData2.default,
	archetype: _archetype2.default,
	mappings: _mappings2.default,
	userdata: _userdata2.default
};

},{"./archetype":128,"./import-data":129,"./mappings":131,"./messages":132,"./userdata":133}],131:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case "FINISH_UPLOAD":
      return Object.keys(state.collections).length > 0 ? state : _extends({}, state, { collections: action.data.collections.reduce(scaffoldCollectionMappings, {}) });

    case "MAP_COLLECTION_ARCHETYPE":
      return mapCollectionArchetype(state, action);

    case "CONFIRM_COLLECTION_ARCHETYPE_MAPPINGS":
      return _extends({}, state, { confirmed: true });

    case "SET_FIELD_MAPPING":
      return upsertFieldMapping(state, action);

    case "CLEAR_FIELD_MAPPING":
      return clearFieldMapping(state, action);

    case "SET_DEFAULT_VALUE":
      return setDefaultValue(state, action);

    case "CONFIRM_FIELD_MAPPINGS":
      return setFieldConfirmation(state, action, true);

    case "UNCONFIRM_FIELD_MAPPINGS":
      return setFieldConfirmation(state, action, false);

    case "SET_VALUE_MAPPING":
      return setValueMapping(state, action);

    case "TOGGLE_IGNORED_COLUMN":
      return toggleIgnoredColumn(state, action);

    case "ADD_CUSTOM_PROPERTY":
      return addCustomProperty(state, action);

    case "REMOVE_CUSTOM_PROPERTY":
      return removeCustomProperty(state, action);

    case "PUBLISH_STARTED":
      return _extends({}, state, {
        publishing: true
      });
    case "PUBLISH_FINISHED":
      return _extends({}, state, {
        publishing: false
      });
  }
  return state;
};

var _setIn = require("../util/set-in");

var _setIn2 = _interopRequireDefault(_setIn);

var _getIn = require("../util/get-in");

var _getIn2 = _interopRequireDefault(_getIn);

var _persist = require("../util/persist");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var newVariableDesc = function newVariableDesc(property, variableSpec) {
  return {
    property: property,
    variable: variableSpec,
    defaultValue: [],
    confirmed: false,
    valueMappings: {}
  };
};

function scaffoldCollectionMappings(init, sheet) {
  return _extends(init, _defineProperty({}, sheet.name, {
    archetypeName: null,
    mappings: [],
    ignoredColumns: [],
    customProperties: []
  }));
}

var initialState = (0, _persist.getItem)("mappings") || {
  collections: {},
  confirmed: false,
  publishing: false
};

var getMappingIndex = function getMappingIndex(state, action) {
  return state.collections[action.collection].mappings.map(function (m, i) {
    return { index: i, m: m };
  }).filter(function (mSpec) {
    return mSpec.m.property === action.propertyField;
  }).reduce(function (prev, cur) {
    return cur.index;
  }, -1);
};

var mapCollectionArchetype = function mapCollectionArchetype(state, action) {
  var newCollections = (0, _setIn2.default)([action.collection, "archetypeName"], action.value, state.collections);
  newCollections = (0, _setIn2.default)([action.collection, "mappings"], [], newCollections);

  return _extends({}, state, { collections: newCollections });
};

var upsertFieldMapping = function upsertFieldMapping(state, action) {
  var foundIdx = getMappingIndex(state, action);
  var newCollections = (0, _setIn2.default)([action.collection, "mappings", foundIdx < 0 ? (0, _getIn2.default)([action.collection, "mappings"], state.collections).length : foundIdx], newVariableDesc(action.propertyField, action.importedField), state.collections);

  return _extends({}, state, { collections: newCollections });
};

var clearFieldMapping = function clearFieldMapping(state, action) {
  var foundIdx = getMappingIndex(state, action);
  if (foundIdx < 0) {
    return state;
  }

  var current = (0, _getIn2.default)([action.collection, "mappings", foundIdx, "variable"], state.collections).filter(function (m, i) {
    return i !== action.clearIndex;
  });

  var newCollections = void 0;
  if (current.length > 0) {
    newCollections = (0, _setIn2.default)([action.collection, "mappings", foundIdx, "variable"], current, state.collections);
  } else {
    var newMappings = (0, _getIn2.default)([action.collection, "mappings"], state.collections).filter(function (m, i) {
      return i !== foundIdx;
    });
    newCollections = (0, _setIn2.default)([action.collection, "mappings"], newMappings, state.collections);
  }

  return _extends({}, state, { collections: newCollections });
};

var setDefaultValue = function setDefaultValue(state, action) {
  var foundIdx = getMappingIndex(state, action);
  if (foundIdx > -1) {
    var newCollections = (0, _setIn2.default)([action.collection, "mappings", foundIdx, "defaultValue"], action.value, state.collections);
    return _extends({}, state, { collections: newCollections });
  }

  return state;
};

var setFieldConfirmation = function setFieldConfirmation(state, action, value) {
  var current = ((0, _getIn2.default)([action.collection, "mappings"], state.collections) || []).map(function (vm) {
    return _extends({}, vm, { confirmed: action.propertyField === vm.property ? value : vm.confirmed });
  });
  var newCollections = (0, _setIn2.default)([action.collection, "mappings"], current, state.collections);

  if (value === true) {
    (function () {
      var confirmedVariableNames = current.map(function (m) {
        return m.variable.map(function (v) {
          return v.variableName;
        });
      }).reduce(function (a, b) {
        return a.concat(b);
      });
      var newIgnoredColums = (0, _getIn2.default)([action.collection, "ignoredColumns"], state.collections).filter(function (ic) {
        return confirmedVariableNames.indexOf(ic) < 0;
      });
      newCollections = (0, _setIn2.default)([action.collection, "ignoredColumns"], newIgnoredColums, newCollections);
    })();
  }

  return _extends({}, state, { collections: newCollections });
};

var setValueMapping = function setValueMapping(state, action) {
  var foundIdx = getMappingIndex(state, action);

  if (foundIdx > -1) {
    var newCollections = (0, _setIn2.default)([action.collection, "mappings", foundIdx, "valueMappings", action.timValue], action.mapValue, state.collections);
    return _extends({}, state, { collections: newCollections });
  }
  return state;
};

var toggleIgnoredColumn = function toggleIgnoredColumn(state, action) {
  var current = (0, _getIn2.default)([action.collection, "ignoredColumns"], state.collections);

  if (current.indexOf(action.variableName) < 0) {
    current.push(action.variableName);
  } else {
    current = current.filter(function (c) {
      return c !== action.variableName;
    });
  }

  return _extends({}, state, { collections: (0, _setIn2.default)([action.collection, "ignoredColumns"], current, state.collections) });
};

var addCustomProperty = function addCustomProperty(state, action) {
  var current = (0, _getIn2.default)([action.collection, "customProperties"], state.collections);
  var newCollections = (0, _setIn2.default)([action.collection, "customProperties", current.length], { name: action.propertyField, type: action.propertyType }, state.collections);

  return _extends({}, state, { collections: newCollections });
};

var removeCustomProperty = function removeCustomProperty(state, action) {
  var foundIdx = getMappingIndex(state, action);

  var current = (0, _getIn2.default)([action.collection, "customProperties"], state.collections).filter(function (cp) {
    return cp.name !== action.propertyField;
  });

  var newCollections = (0, _setIn2.default)([action.collection, "customProperties"], current, state.collections);

  if (foundIdx > -1) {
    var newMappings = (0, _getIn2.default)([action.collection, "mappings"], state.collections).filter(function (m, i) {
      return i !== foundIdx;
    });
    newCollections = (0, _setIn2.default)([action.collection, "mappings"], newMappings, newCollections);
  }

  return _extends({}, state, { collections: newCollections });
};

},{"../util/get-in":138,"../util/persist":140,"../util/set-in":141}],132:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case "TOGGLE_MESSAGE":
      var newState = _extends({}, state);
      newState[action.messageId] = !state[action.messageId];
      return newState;
  }

  return state;
};

var initialState = {
  showFileIsUploadedMessage: true,
  showCollectionsAreConnectedMessage: true
};

},{}],133:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case "LOGIN":
      return {
        userId: action.data,
        myVres: action.vreData ? action.vreData.mine : {},
        vres: action.vreData ? action.vreData.public : {}
      };
  }

  return state;
};

var initialState = {
  userId: undefined,
  myVres: undefined,
  vres: {}
};

},{}],134:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.urls = undefined;
exports.navigateTo = navigateTo;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _reactRedux = require("react-redux");

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _actions = require("./actions");

var _actions2 = _interopRequireDefault(_actions);

var _connectData = require("./components/react-redux-connect/connect-data");

var _connectData2 = _interopRequireDefault(_connectData);

var _page = require("./components/react-redux-connect/page");

var _page2 = _interopRequireDefault(_page);

var _firstUpload = require("./components/react-redux-connect/first-upload");

var _firstUpload2 = _interopRequireDefault(_firstUpload);

var _collectionOverview = require("./components/react-redux-connect/collection-overview");

var _collectionOverview2 = _interopRequireDefault(_collectionOverview);

var _connectToArchetype = require("./components/react-redux-connect/connect-to-archetype");

var _connectToArchetype2 = _interopRequireDefault(_connectToArchetype);

var _firstUpload3 = require("./components/firstUpload.jsx");

var _firstUpload4 = _interopRequireDefault(_firstUpload3);

var _page3 = require("./components/page.jsx");

var _page4 = _interopRequireDefault(_page3);

var _collectionOverview3 = require("./components/collection-overview");

var _collectionOverview4 = _interopRequireDefault(_collectionOverview3);

var _connectToArchetype3 = require("./components/connect-to-archetype");

var _connectToArchetype4 = _interopRequireDefault(_connectToArchetype3);

var _connectData3 = require("./components/connect-data");

var _connectData4 = _interopRequireDefault(_connectData3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var urls = {
  mapData: function mapData() {
    return "/mapdata";
  },
  mapArchetypes: function mapArchetypes() {
    return "/maparchetypes";
  },
  collectionsOverview: function collectionsOverview() {
    return "/collections-overview";
  }
};

function navigateTo(key, args) {
  _reactRouter.hashHistory.push(urls[key].apply(null, args));
}

var connectComponent = function connectComponent(stateToProps) {
  return (0, _reactRedux.connect)(stateToProps, function (dispatch) {
    return (0, _actions2.default)(navigateTo, dispatch);
  });
};

var router = _react2.default.createElement(
  _reactRedux.Provider,
  { store: _store2.default },
  _react2.default.createElement(
    _reactRouter.Router,
    { history: _reactRouter.hashHistory },
    _react2.default.createElement(
      _reactRouter.Route,
      { path: "/", component: connectComponent(_page2.default)(_page4.default) },
      _react2.default.createElement(_reactRouter.IndexRoute, { component: connectComponent(_firstUpload2.default)(_firstUpload4.default) }),
      _react2.default.createElement(_reactRouter.Route, { path: urls.collectionsOverview(), components: connectComponent(_collectionOverview2.default)(_collectionOverview4.default) }),
      _react2.default.createElement(_reactRouter.Route, { path: urls.mapArchetypes(), components: connectComponent(_connectToArchetype2.default)(_connectToArchetype4.default) }),
      _react2.default.createElement(_reactRouter.Route, { path: urls.mapData(), components: connectComponent(_connectData2.default)(_connectData4.default) })
    )
  )
);

exports.default = router;
exports.urls = urls;

},{"./actions":99,"./components/collection-overview":102,"./components/connect-data":104,"./components/connect-to-archetype":105,"./components/firstUpload.jsx":109,"./components/page.jsx":112,"./components/react-redux-connect/collection-overview":119,"./components/react-redux-connect/connect-data":120,"./components/react-redux-connect/connect-to-archetype":121,"./components/react-redux-connect/first-upload":122,"./components/react-redux-connect/page":123,"./store":136,"react":"react","react-redux":36,"react-router":70}],135:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setupMocks;
function setupMocks(xhrmock, orig) {
  xhrmock.get("http://test.repository.huygens.knaw.nl/v2.1/metadata/Admin", function (req, resp) {
    return resp.status(200).body("{\n          \"persons\": [\n            {\n              \"name\": \"name\",\n              \"type\": \"text\"\n            },\n            {\n              \"name\": \"hasWritten\",\n              \"type\": \"relation\",\n              \"quicksearch\": \"/v2.1/domain/documents/autocomplete\",\n              \"relation\": {\n                \"direction\": \"OUT\",\n                \"outName\": \"hasWritten\",\n                \"inName\": \"wasWrittenBy\",\n                \"targetCollection\": \"documents\",\n                \"relationCollection\": \"relations\",\n                \"relationTypeId\": \"bba10d37-86cc-4f1f-ba2d-016af2b21aa4\"\n              }\n            },\n            {\n              \"name\": \"isRelatedTo\",\n              \"type\": \"relation\",\n              \"quicksearch\": \"/v2.1/domain/persons/autocomplete\",\n              \"relation\": {\n                \"direction\": \"OUT\",\n                \"outName\": \"isRelatedTo\",\n                \"inName\": \"isRelatedTo\",\n                \"targetCollection\": \"persons\",\n                \"relationCollection\": \"relations\",\n                \"relationTypeId\": \"cba10d37-86cc-4f1f-ba2d-016af2b21aa5\"\n              }\n            }\n          ],\n          \"documents\": [\n            {\n              \"name\": \"name\",\n              \"type\": \"text\"\n            }\n          ]\n        }");
  }).get("http://test.repository.huygens.knaw.nl/v2.1/system/users/me/vres", function (req, resp) {
    console.log("fetch-my-vres");
    return resp.status(200).body("{\n          \"mine\": {\n            \"migrant_steekproef_masterdb (6).xlsx\": {\n              \"name\": \"migrant_steekproef_masterdb (6).xlsx\",\n              \"published\": true\n            },\n            \"testerdetest\": {\n              \"name\": \"testerdetest\",\n              \"published\": false,\n              \"rmlUri\": \"<<The get raw data url that the server provides>>\"\n            }\n          },\n          \"public\": {\n            \"WomenWriters\": {\n              \"name\": \"WomenWriters\"\n            }\n          }\n        }");
  }).post("http://test.repository.huygens.knaw.nl/v2.1/bulk-upload", function (req, resp) {
    console.log("bulk-upload");
    return resp.status(200).header("Location", "<<The get raw data url that the server provides>>");
  }).post("<<The save mapping url that the server provides>>", function (req, resp) {
    console.log("save mapping", req.body());
    return resp.status(204);
  }).post("<<The execute mapping url that the server provides>>", function (req, resp) {
    console.log("execute mapping with failures", req.body());
    return resp.status(200).body(JSON.stringify({
      success: false
    }));
  }).get("<<The get raw data url that the server provides>>", function (req, resp) {
    console.log("get raw data");
    return resp.status(200).body(JSON.stringify({
      vre: "thevrename",
      saveMapping: "<<The save mapping url that the server provides>>",
      executeMapping: "<<The execute mapping url that the server provides>>",
      collections: [{
        name: "mockpersons",
        variables: ["ID", "Voornaam", "tussenvoegsel", "Achternaam", "GeschrevenDocument", "Genoemd in", "Is getrouwd met"],
        data: "<<url for person data>>",
        dataWithErrors: "<<url for person data with errors>>"
      }, {
        name: "mockdocuments",
        variables: ["titel", "datum", "referentie", "url"],
        data: "<<url for document data>>",
        dataWithErrors: "<<url for document data with errors>>"
      }]
    }));
  }).get("<<url for person data>>", function (req, resp) {
    console.log("get person items data");
    return resp.status(200).body(JSON.stringify({
      "_next": "<<more data>>",
      "items": [{
        values: {
          "ID": "1",
          "Voornaam": "Voornaam",
          "tussenvoegsel": "tussenvoegsel",
          "Achternaam": "Achternaam",
          "GeschrevenDocument": "GeschrevenDocument",
          "Genoemd in": "Genoemd in",
          "Is getrouwd met": "Is getrouwd met"
        },
        errors: {}
      }, {
        values: {
          "ID": "2",
          "Voornaam": "Voornaam",
          "tussenvoegsel": "tussenvoegsel",
          "Achternaam": "Achternaam",
          "GeschrevenDocument": "GeschrevenDocument",
          "Genoemd in": "Genoemd in",
          "Is getrouwd met": "Is getrouwd met"
        },
        errors: {}
      }]
    }));
  }).get("<<url for person data with errors>>", function (req, resp) {
    console.log("get person items data with errors");
    return resp.status(200).body(JSON.stringify({
      "_next": "<<more data>>",
      "items": [{
        values: {
          "ID": "1",
          "Voornaam": "Voornaam",
          "tussenvoegsel": "tussenvoegsel",
          "Achternaam": "Achternaam",
          "GeschrevenDocument": "GeschrevenDocument",
          "Genoemd in": "Genoemd in",
          "Is getrouwd met": "Is getrouwd met"
        },
        errors: {
          "Voornaam": "will not do",
          "Achternaam": "also failed"
        }
      }]
    }));
  }).get("<<more data>>", function (req, resp) {
    console.log("get person items data");
    return resp.status(200).body(JSON.stringify({
      "items": [{
        values: {
          "ID": "3",
          "Voornaam": "Voornaam",
          "tussenvoegsel": "tussenvoegsel",
          "Achternaam": "Achternaam",
          "GeschrevenDocument": "GeschrevenDocument",
          "Genoemd in": "Genoemd in",
          "Is getrouwd met": "Is getrouwd met"
        },
        errors: {}
      }, {
        values: {
          "ID": "4",
          "Voornaam": "Voornaam",
          "tussenvoegsel": "tussenvoegsel",
          "Achternaam": "Achternaam",
          "GeschrevenDocument": "GeschrevenDocument",
          "Genoemd in": "Genoemd in",
          "Is getrouwd met": "Is getrouwd met"
        },
        errors: {}
      }]
    }));
  }).get("<<url for document data>>", function (req, resp) {
    console.log("get document items data");
    return resp.status(200).body(JSON.stringify({
      "name": "someCollection",
      "variables": ["tim_id", "var1", "var2"],
      "items": [{
        values: {
          "tim_id": "1",
          "titel": "titel",
          "datum": "datum",
          "referentie": "referentie",
          "url": "url"
        },
        errors: {}
      }, {
        values: {
          "tim_id": "2",
          "titel": "titel",
          "datum": "datum",
          "referentie": "referentie",
          "url": "url"
        },
        errors: {}
      }]
    }));
  }).get("<<url for document data with errors>>", function (req, resp) {
    console.log("get document items data with errors");
    return resp.status(200).body(JSON.stringify({
      "name": "someCollection",
      "variables": ["tim_id", "var1", "var2"],
      "items": []
    }));
  }).mock(function (req, resp) {
    console.error("unmocked request", req.url(), req, resp);
  });
}

},{}],136:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require("redux");

var _reduxThunk = require("redux-thunk");

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _persist = require("./util/persist");

var _reducers = require("./reducers");

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _redux.createStore)((0, _redux.combineReducers)(_reducers2.default), (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default), window.devToolsExtension ? window.devToolsExtension() : function (f) {
  return f;
}));

// window.onbeforeunload = () => persist(store.getState());

exports.default = store;

},{"./reducers":130,"./util/persist":140,"redux":85,"redux-thunk":79}],137:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function deepClone9(obj) {
    var i, len, ret;

    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        ret = [];
        len = obj.length;
        for (i = 0; i < len; i++) {
            ret.push(_typeof(obj[i]) === "object" && obj[i] !== null ? deepClone9(obj[i]) : obj[i]);
        }
    } else {
        ret = {};
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                ret[i] = _typeof(obj[i]) === "object" && obj[i] !== null ? deepClone9(obj[i]) : obj[i];
            }
        }
    }
    return ret;
}

exports.default = deepClone9;

},{}],138:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _cloneDeep = require("./clone-deep");

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _getIn = function _getIn(path, data) {
	return data ? path.length === 0 ? data : _getIn(path, data[path.shift()]) : null;
};

var getIn = function getIn(path, data) {
	return _getIn((0, _cloneDeep2.default)(path), data);
};

exports.default = getIn;

},{"./clone-deep":137}],139:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mappingToJsonLdRml;
function mappingToJsonLdRml(mapping, vre) {
  return {
    "@context": {
      "@vocab": "http://www.w3.org/ns/r2rml#",
      "rml": "http://semweb.mmlab.be/ns/rml#",
      "tim": "http://timbuctoo.com/mapping#",
      "http://www.w3.org/2000/01/rdf-schema#subClassOf": {
        "@type": "@id"
      },
      "predicate": {
        "@type": "@id"
      },
      "termType": {
        "@type": "@id"
      },
      "parentTriplesMap": {
        "@type": "@id"
      },
      "class": {
        "@type": "@id"
      }
    },
    "@graph": Object.keys(mapping.collections).map(function (key) {
      return mapSheet(key, mapping.collections[key], vre);
    })
  };
}

function makeMapName(vre, localName) {
  return "http://timbuctoo.com/mapping/" + vre + "/" + localName;
}

function mapSheet(key, sheet, vre) {
  //FIXME: move logicalSource and subjectMap under the control of the server
  return {
    "@id": makeMapName(vre, key),
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": "http://timbuctoo.com/" + sheet.archetypeName.replace(/s$/, ""),
    "rml:logicalSource": {
      "rml:source": {
        "tim:rawCollection": key,
        "tim:vreName": vre
      }
    },
    "subjectMap": {
      "class": makeMapName(vre, key),
      "template": makeMapName(vre, key) + "/{tim_id}"
    },
    "predicateObjectMap": sheet.mappings.map(makePredicateObjectMap.bind(null, vre))
  };
}

function makePredicateObjectMap(vre, mapping) {
  var property = mapping.property;
  var variable = mapping.variable[0];
  if (variable.targetCollection) {
    return {
      "objectMap": {
        "joinCondition": {
          "child": variable.variableName,
          "parent": variable.targetVariableName
        },
        "parentTriplesMap": makeMapName(vre, variable.targetCollection)
      },
      "predicate": "http://timbuctoo.com/" + property
    };
  } else if (variable.targetExistingTimbuctooVre) {
    return {
      "objectMap": {
        "column": variable.variableName,
        "termType": "http://www.w3.org/ns/r2rml#IRI"
      },
      "predicate": "http://timbuctoo.com/" + property,
      "http://timbuctoo.com/mapping/existingTimbuctooVre": variable.targetExistingTimbuctooVre
    };
  } else {
    return {
      "objectMap": {
        "column": variable.variableName
      },
      "predicate": "http://timbuctoo.com/" + property
    };
  }
}

},{}],140:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var persistDisabled = false;

var persist = function persist(state) {
	if (persistDisabled) {
		return;
	}
	for (var key in state) {
		localStorage.setItem(key, JSON.stringify(state[key]));
	}
};

var getItem = function getItem(key) {
	if (localStorage.getItem(key)) {
		return JSON.parse(localStorage.getItem(key));
	}
	return null;
};

var disablePersist = function disablePersist() {
	localStorage.clear();
	persistDisabled = true;
};
window.disablePersist = disablePersist;

exports.persist = persist;
exports.getItem = getItem;
exports.disablePersist = disablePersist;

},{}],141:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _cloneDeep = require("./clone-deep");

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Do either of these:
//  a) Set a value by reference if deref is not null
//  b) Set a value directly in to data object if deref is null
var setEither = function setEither(data, deref, key, val) {
	(deref || data)[key] = val;
	return data;
};

// Set a nested value in data (not unlike immutablejs, but a clone of data is expected for proper immutability)
var _setIn = function _setIn(path, value, data) {
	var deref = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
	return path.length > 1 ? _setIn(path, value, data, deref ? deref[path.shift()] : data[path.shift()]) : setEither(data, deref, path[0], value);
};

var setIn = function setIn(path, value, data) {
	return _setIn((0, _cloneDeep2.default)(path), value, (0, _cloneDeep2.default)(data));
};

exports.default = setIn;

},{"./clone-deep":137}]},{},[127])(127)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2NsYXNzbmFtZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVlcC1lcXVhbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kZWVwLWVxdWFsL2xpYi9pc19hcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvZGVlcC1lcXVhbC9saWIva2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9mb3ItZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwibm9kZV9tb2R1bGVzL2hpc3RvcnkvbGliL0FjdGlvbnMuanMiLCJub2RlX21vZHVsZXMvaGlzdG9yeS9saWIvQXN5bmNVdGlscy5qcyIsIm5vZGVfbW9kdWxlcy9oaXN0b3J5L2xpYi9ET01TdGF0ZVN0b3JhZ2UuanMiLCJub2RlX21vZHVsZXMvaGlzdG9yeS9saWIvRE9NVXRpbHMuanMiLCJub2RlX21vZHVsZXMvaGlzdG9yeS9saWIvRXhlY3V0aW9uRW52aXJvbm1lbnQuanMiLCJub2RlX21vZHVsZXMvaGlzdG9yeS9saWIvUGF0aFV0aWxzLmpzIiwibm9kZV9tb2R1bGVzL2hpc3RvcnkvbGliL2NyZWF0ZUJyb3dzZXJIaXN0b3J5LmpzIiwibm9kZV9tb2R1bGVzL2hpc3RvcnkvbGliL2NyZWF0ZURPTUhpc3RvcnkuanMiLCJub2RlX21vZHVsZXMvaGlzdG9yeS9saWIvY3JlYXRlSGFzaEhpc3RvcnkuanMiLCJub2RlX21vZHVsZXMvaGlzdG9yeS9saWIvY3JlYXRlSGlzdG9yeS5qcyIsIm5vZGVfbW9kdWxlcy9oaXN0b3J5L2xpYi9jcmVhdGVMb2NhdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9oaXN0b3J5L2xpYi9jcmVhdGVNZW1vcnlIaXN0b3J5LmpzIiwibm9kZV9tb2R1bGVzL2hpc3RvcnkvbGliL2RlcHJlY2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9oaXN0b3J5L2xpYi9ydW5UcmFuc2l0aW9uSG9vay5qcyIsIm5vZGVfbW9kdWxlcy9oaXN0b3J5L2xpYi91c2VCYXNlbmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9oaXN0b3J5L2xpYi91c2VRdWVyaWVzLmpzIiwibm9kZV9tb2R1bGVzL2hpc3Rvcnkvbm9kZV9tb2R1bGVzL3dhcm5pbmcvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9ob2lzdC1ub24tcmVhY3Qtc3RhdGljcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbnZhcmlhbnQvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9pcy1mdW5jdGlvbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFByb3RvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX292ZXJBcmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNQbGFpbk9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL3BhcnNlLWhlYWRlcnMuanMiLCJub2RlX21vZHVsZXMvcXVlcnktc3RyaW5nL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2xpYi9jb21wb25lbnRzL1Byb3ZpZGVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2xpYi9jb21wb25lbnRzL2Nvbm5lY3QuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2xpYi91dGlscy9zaGFsbG93RXF1YWwuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvbGliL3V0aWxzL3N0b3JlU2hhcGUuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvbGliL3V0aWxzL3dhcm5pbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvbGliL3V0aWxzL3dyYXBBY3Rpb25DcmVhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL0FzeW5jVXRpbHMuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi9IaXN0b3J5LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvSW5kZXhMaW5rLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvSW5kZXhSZWRpcmVjdC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL0luZGV4Um91dGUuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi9JbnRlcm5hbFByb3BUeXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL0xpZmVjeWNsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL0xpbmsuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi9QYXR0ZXJuVXRpbHMuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi9Qcm9wVHlwZXMuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi9SZWRpcmVjdC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL1JvdXRlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvUm91dGVDb250ZXh0LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvUm91dGVVdGlscy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL1JvdXRlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL1JvdXRlckNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi9Sb3V0ZXJVdGlscy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL1JvdXRpbmdDb250ZXh0LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvVHJhbnNpdGlvblV0aWxzLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvYXBwbHlSb3V0ZXJNaWRkbGV3YXJlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvYnJvd3Nlckhpc3RvcnkuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi9jb21wdXRlQ2hhbmdlZFJvdXRlcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL2NyZWF0ZU1lbW9yeUhpc3RvcnkuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi9jcmVhdGVSb3V0ZXJIaXN0b3J5LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvY3JlYXRlVHJhbnNpdGlvbk1hbmFnZXIuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi9kZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvZ2V0Q29tcG9uZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL2dldFJvdXRlUGFyYW1zLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvaGFzaEhpc3RvcnkuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL2lzQWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvbWFrZVN0YXRlV2l0aExvY2F0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvbWF0Y2guanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi9tYXRjaFJvdXRlcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvbGliL3JvdXRlcldhcm5pbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2xpYi91c2VSb3V0ZXJIaXN0b3J5LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvdXNlUm91dGVzLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9saWIvd2l0aFJvdXRlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1eC10aHVuay9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVkdXgvbGliL2FwcGx5TWlkZGxld2FyZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1eC9saWIvYmluZEFjdGlvbkNyZWF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4L2xpYi9jb21iaW5lUmVkdWNlcnMuanMiLCJub2RlX21vZHVsZXMvcmVkdXgvbGliL2NvbXBvc2UuanMiLCJub2RlX21vZHVsZXMvcmVkdXgvbGliL2NyZWF0ZVN0b3JlLmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4L2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1eC9saWIvdXRpbHMvd2FybmluZy5qcyIsIm5vZGVfbW9kdWxlcy9zdHJpY3QtdXJpLWVuY29kZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zeW1ib2wtb2JzZXJ2YWJsZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zeW1ib2wtb2JzZXJ2YWJsZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc3ltYm9sLW9ic2VydmFibGUvbGliL3BvbnlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL3RyaW0vaW5kZXguanMiLCJub2RlX21vZHVsZXMvd2FybmluZy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3hoci1tb2NrL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hoci1tb2NrL2xpYi9Nb2NrUmVxdWVzdC5qcyIsIm5vZGVfbW9kdWxlcy94aHItbW9jay9saWIvTW9ja1Jlc3BvbnNlLmpzIiwibm9kZV9tb2R1bGVzL3hoci1tb2NrL2xpYi9Nb2NrWE1MSHR0cFJlcXVlc3QuanMiLCJub2RlX21vZHVsZXMveGhyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3h0ZW5kL2ltbXV0YWJsZS5qcyIsInNyYy9hY3Rpb25zLmpzIiwic3JjL2NvbXBvbmVudHMvY29sbGVjdGlvbi1mb3JtLmpzIiwic3JjL2NvbXBvbmVudHMvY29sbGVjdGlvbi1pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2NvbGxlY3Rpb24tb3ZlcnZpZXcuanMiLCJzcmMvY29tcG9uZW50cy9jb2xsZWN0aW9uLXRhYmxlLmpzIiwic3JjL2NvbXBvbmVudHMvY29ubmVjdC1kYXRhLmpzIiwic3JjL2NvbXBvbmVudHMvY29ubmVjdC10by1hcmNoZXR5cGUuanMiLCJzcmMvY29tcG9uZW50cy9kYXRhc2V0LWNhcmRzLmpzIiwic3JjL2NvbXBvbmVudHMvZGF0YXNldENhcmQuanN4Iiwic3JjL2NvbXBvbmVudHMvZmllbGRzL3NlbGVjdC1maWVsZC5qcyIsInNyYy9jb21wb25lbnRzL2ZpcnN0VXBsb2FkLmpzeCIsInNyYy9jb21wb25lbnRzL2Zvb3Rlci5qcyIsInNyYy9jb21wb25lbnRzL21lc3NhZ2UuanMiLCJzcmMvY29tcG9uZW50cy9wYWdlLmpzeCIsInNyYy9jb21wb25lbnRzL3Byb3BlcnR5LWZvcm0vYWRkLXByb3BlcnR5LmpzIiwic3JjL2NvbXBvbmVudHMvcHJvcGVydHktZm9ybS9jb2x1bW4tc2VsZWN0LmpzIiwic3JjL2NvbXBvbmVudHMvcHJvcGVydHktZm9ybS9wcm9wZXJ0eS1mb3JtLmpzIiwic3JjL2NvbXBvbmVudHMvcHJvcGVydHktZm9ybS9yZWxhdGlvbi10by1leGlzdGluZy5qcyIsInNyYy9jb21wb25lbnRzL3Byb3BlcnR5LWZvcm0vcmVsYXRpb24uanMiLCJzcmMvY29tcG9uZW50cy9wcm9wZXJ0eS1mb3JtL3RleHQuanMiLCJzcmMvY29tcG9uZW50cy9yZWFjdC1yZWR1eC1jb25uZWN0L2NvbGxlY3Rpb24tb3ZlcnZpZXcuanMiLCJzcmMvY29tcG9uZW50cy9yZWFjdC1yZWR1eC1jb25uZWN0L2Nvbm5lY3QtZGF0YS5qcyIsInNyYy9jb21wb25lbnRzL3JlYWN0LXJlZHV4LWNvbm5lY3QvY29ubmVjdC10by1hcmNoZXR5cGUuanMiLCJzcmMvY29tcG9uZW50cy9yZWFjdC1yZWR1eC1jb25uZWN0L2ZpcnN0LXVwbG9hZC5qcyIsInNyYy9jb21wb25lbnRzL3JlYWN0LXJlZHV4LWNvbm5lY3QvcGFnZS5qcyIsInNyYy9jb21wb25lbnRzL3RhYmxlL2RhdGEtcm93LmpzIiwic3JjL2NvbXBvbmVudHMvdGFibGUvaGVhZGVyLWNlbGwuanMiLCJzcmMvY29tcG9uZW50cy91cGxvYWQtYnV0dG9uLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3JlZHVjZXJzL2FyY2hldHlwZS5qcyIsInNyYy9yZWR1Y2Vycy9pbXBvcnQtZGF0YS5qcyIsInNyYy9yZWR1Y2Vycy9pbmRleC5qcyIsInNyYy9yZWR1Y2Vycy9tYXBwaW5ncy5qcyIsInNyYy9yZWR1Y2Vycy9tZXNzYWdlcy5qcyIsInNyYy9yZWR1Y2Vycy91c2VyZGF0YS5qcyIsInNyYy9yb3V0ZXIuanMiLCJzcmMvc2VydmVybW9ja3MuanMiLCJzcmMvc3RvcmUuanMiLCJzcmMvdXRpbC9jbG9uZS1kZWVwLmpzIiwic3JjL3V0aWwvZ2V0LWluLmpzIiwic3JjL3V0aWwvbWFwcGluZ1RvSnNvbkxkUm1sLmpzIiwic3JjL3V0aWwvcGVyc2lzdC5qcyIsInNyYy91dGlsL3NldC1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQy9SQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNuTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQy9OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUM3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBOzs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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eUJBQU0sSUFBTixDQUEzQixDQURhO0FBQUEsQ0FBZDs7a0JBR2UsSyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyohXG4gIENvcHlyaWdodCAoYykgMjAxNiBKZWQgV2F0c29uLlxuICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5cdGZ1bmN0aW9uIGNsYXNzTmFtZXMgKCkge1xuXHRcdHZhciBjbGFzc2VzID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSBjb250aW51ZTtcblxuXHRcdFx0dmFyIGFyZ1R5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycgfHwgYXJnVHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRjbGFzc2VzLnB1c2goY2xhc3NOYW1lcy5hcHBseShudWxsLCBhcmcpKTtcblx0XHRcdH0gZWxzZSBpZiAoYXJnVHlwZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChrZXkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gcmVnaXN0ZXIgYXMgJ2NsYXNzbmFtZXMnLCBjb25zaXN0ZW50IHdpdGggbnBtIHBhY2thZ2UgbmFtZVxuXHRcdGRlZmluZSgnY2xhc3NuYW1lcycsIFtdLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY2xhc3NOYW1lcztcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXM7XG5cdH1cbn0oKSk7XG4iLCJ2YXIgcFNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIG9iamVjdEtleXMgPSByZXF1aXJlKCcuL2xpYi9rZXlzLmpzJyk7XG52YXIgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2xpYi9pc19hcmd1bWVudHMuanMnKTtcblxudmFyIGRlZXBFcXVhbCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQsIG9wdHMpIHtcbiAgaWYgKCFvcHRzKSBvcHRzID0ge307XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoYWN0dWFsIGluc3RhbmNlb2YgRGF0ZSAmJiBleHBlY3RlZCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICByZXR1cm4gYWN0dWFsLmdldFRpbWUoKSA9PT0gZXhwZWN0ZWQuZ2V0VGltZSgpO1xuXG4gIC8vIDcuMy4gT3RoZXIgcGFpcnMgdGhhdCBkbyBub3QgYm90aCBwYXNzIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyxcbiAgLy8gZXF1aXZhbGVuY2UgaXMgZGV0ZXJtaW5lZCBieSA9PS5cbiAgfSBlbHNlIGlmICghYWN0dWFsIHx8ICFleHBlY3RlZCB8fCB0eXBlb2YgYWN0dWFsICE9ICdvYmplY3QnICYmIHR5cGVvZiBleHBlY3RlZCAhPSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBvcHRzLnN0cmljdCA/IGFjdHVhbCA9PT0gZXhwZWN0ZWQgOiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgLy8gNy40LiBGb3IgYWxsIG90aGVyIE9iamVjdCBwYWlycywgaW5jbHVkaW5nIEFycmF5IG9iamVjdHMsIGVxdWl2YWxlbmNlIGlzXG4gIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gIC8vIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLCBlcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnlcbiAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgLy8gYWNjb3VudHMgZm9yIGJvdGggbmFtZWQgYW5kIGluZGV4ZWQgcHJvcGVydGllcyBvbiBBcnJheXMuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQsIG9wdHMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAoeCkge1xuICBpZiAoIXggfHwgdHlwZW9mIHggIT09ICdvYmplY3QnIHx8IHR5cGVvZiB4Lmxlbmd0aCAhPT0gJ251bWJlcicpIHJldHVybiBmYWxzZTtcbiAgaWYgKHR5cGVvZiB4LmNvcHkgIT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIHguc2xpY2UgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHgubGVuZ3RoID4gMCAmJiB0eXBlb2YgeFswXSAhPT0gJ251bWJlcicpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIG9iakVxdWl2KGEsIGIsIG9wdHMpIHtcbiAgdmFyIGksIGtleTtcbiAgaWYgKGlzVW5kZWZpbmVkT3JOdWxsKGEpIHx8IGlzVW5kZWZpbmVkT3JOdWxsKGIpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LlxuICBpZiAoYS5wcm90b3R5cGUgIT09IGIucHJvdG90eXBlKSByZXR1cm4gZmFsc2U7XG4gIC8vfn5+SSd2ZSBtYW5hZ2VkIHRvIGJyZWFrIE9iamVjdC5rZXlzIHRocm91Z2ggc2NyZXd5IGFyZ3VtZW50cyBwYXNzaW5nLlxuICAvLyAgIENvbnZlcnRpbmcgdG8gYXJyYXkgc29sdmVzIHRoZSBwcm9ibGVtLlxuICBpZiAoaXNBcmd1bWVudHMoYSkpIHtcbiAgICBpZiAoIWlzQXJndW1lbnRzKGIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgcmV0dXJuIGRlZXBFcXVhbChhLCBiLCBvcHRzKTtcbiAgfVxuICBpZiAoaXNCdWZmZXIoYSkpIHtcbiAgICBpZiAoIWlzQnVmZmVyKGIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFbaV0gIT09IGJbaV0pIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdHJ5IHtcbiAgICB2YXIga2EgPSBvYmplY3RLZXlzKGEpLFxuICAgICAgICBrYiA9IG9iamVjdEtleXMoYik7XG4gIH0gY2F0Y2ggKGUpIHsvL2hhcHBlbnMgd2hlbiBvbmUgaXMgYSBzdHJpbmcgbGl0ZXJhbCBhbmQgdGhlIG90aGVyIGlzbid0XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoa2V5cyBpbmNvcnBvcmF0ZXNcbiAgLy8gaGFzT3duUHJvcGVydHkpXG4gIGlmIChrYS5sZW5ndGggIT0ga2IubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAga2Euc29ydCgpO1xuICBrYi5zb3J0KCk7XG4gIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT0ga2JbaV0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAvL35+fnBvc3NpYmx5IGV4cGVuc2l2ZSBkZWVwIHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBrZXkgPSBrYVtpXTtcbiAgICBpZiAoIWRlZXBFcXVhbChhW2tleV0sIGJba2V5XSwgb3B0cykpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHlwZW9mIGEgPT09IHR5cGVvZiBiO1xufVxuIiwidmFyIHN1cHBvcnRzQXJndW1lbnRzQ2xhc3MgPSAoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmd1bWVudHMpXG59KSgpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBzdXBwb3J0c0FyZ3VtZW50c0NsYXNzID8gc3VwcG9ydGVkIDogdW5zdXBwb3J0ZWQ7XG5cbmV4cG9ydHMuc3VwcG9ydGVkID0gc3VwcG9ydGVkO1xuZnVuY3Rpb24gc3VwcG9ydGVkKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59O1xuXG5leHBvcnRzLnVuc3VwcG9ydGVkID0gdW5zdXBwb3J0ZWQ7XG5mdW5jdGlvbiB1bnN1cHBvcnRlZChvYmplY3Qpe1xuICByZXR1cm4gb2JqZWN0ICYmXG4gICAgdHlwZW9mIG9iamVjdCA9PSAnb2JqZWN0JyAmJlxuICAgIHR5cGVvZiBvYmplY3QubGVuZ3RoID09ICdudW1iZXInICYmXG4gICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgJ2NhbGxlZScpICYmXG4gICAgIU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChvYmplY3QsICdjYWxsZWUnKSB8fFxuICAgIGZhbHNlO1xufTtcbiIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiBPYmplY3Qua2V5cyA9PT0gJ2Z1bmN0aW9uJ1xuICA/IE9iamVjdC5rZXlzIDogc2hpbTtcblxuZXhwb3J0cy5zaGltID0gc2hpbTtcbmZ1bmN0aW9uIHNoaW0gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSBrZXlzLnB1c2goa2V5KTtcbiAgcmV0dXJuIGtleXM7XG59XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2lzLWZ1bmN0aW9uJylcblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcblxuZnVuY3Rpb24gZm9yRWFjaChsaXN0LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXNGdW5jdGlvbihpdGVyYXRvcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgY29udGV4dCA9IHRoaXNcbiAgICB9XG4gICAgXG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobGlzdCkgPT09ICdbb2JqZWN0IEFycmF5XScpXG4gICAgICAgIGZvckVhY2hBcnJheShsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbiAgICBlbHNlIGlmICh0eXBlb2YgbGlzdCA9PT0gJ3N0cmluZycpXG4gICAgICAgIGZvckVhY2hTdHJpbmcobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG4gICAgZWxzZVxuICAgICAgICBmb3JFYWNoT2JqZWN0KGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoQXJyYXkoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCBpKSkge1xuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVtpXSwgaSwgYXJyYXkpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hTdHJpbmcoc3RyaW5nLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzdHJpbmcubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgLy8gbm8gc3VjaCB0aGluZyBhcyBhIHNwYXJzZSBzdHJpbmcuXG4gICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgc3RyaW5nLmNoYXJBdChpKSwgaSwgc3RyaW5nKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZm9yRWFjaE9iamVjdChvYmplY3QsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmplY3QpIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrKSkge1xuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmplY3Rba10sIGssIG9iamVjdClcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbDtcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpe1xuICAgIG1vZHVsZS5leHBvcnRzID0gc2VsZjtcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7fTtcbn1cbiIsIi8qKlxuICogSW5kaWNhdGVzIHRoYXQgbmF2aWdhdGlvbiB3YXMgY2F1c2VkIGJ5IGEgY2FsbCB0byBoaXN0b3J5LnB1c2guXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbnZhciBQVVNIID0gJ1BVU0gnO1xuXG5leHBvcnRzLlBVU0ggPSBQVVNIO1xuLyoqXG4gKiBJbmRpY2F0ZXMgdGhhdCBuYXZpZ2F0aW9uIHdhcyBjYXVzZWQgYnkgYSBjYWxsIHRvIGhpc3RvcnkucmVwbGFjZS5cbiAqL1xudmFyIFJFUExBQ0UgPSAnUkVQTEFDRSc7XG5cbmV4cG9ydHMuUkVQTEFDRSA9IFJFUExBQ0U7XG4vKipcbiAqIEluZGljYXRlcyB0aGF0IG5hdmlnYXRpb24gd2FzIGNhdXNlZCBieSBzb21lIG90aGVyIGFjdGlvbiBzdWNoXG4gKiBhcyB1c2luZyBhIGJyb3dzZXIncyBiYWNrL2ZvcndhcmQgYnV0dG9ucyBhbmQvb3IgbWFudWFsbHkgbWFuaXB1bGF0aW5nXG4gKiB0aGUgVVJMIGluIGEgYnJvd3NlcidzIGxvY2F0aW9uIGJhci4gVGhpcyBpcyB0aGUgZGVmYXVsdC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvd0V2ZW50SGFuZGxlcnMvb25wb3BzdGF0ZVxuICogZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cbnZhciBQT1AgPSAnUE9QJztcblxuZXhwb3J0cy5QT1AgPSBQT1A7XG5leHBvcnRzWydkZWZhdWx0J10gPSB7XG4gIFBVU0g6IFBVU0gsXG4gIFJFUExBQ0U6IFJFUExBQ0UsXG4gIFBPUDogUE9QXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIF9zbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbmV4cG9ydHMubG9vcEFzeW5jID0gbG9vcEFzeW5jO1xuXG5mdW5jdGlvbiBsb29wQXN5bmModHVybnMsIHdvcmssIGNhbGxiYWNrKSB7XG4gIHZhciBjdXJyZW50VHVybiA9IDAsXG4gICAgICBpc0RvbmUgPSBmYWxzZTtcbiAgdmFyIHN5bmMgPSBmYWxzZSxcbiAgICAgIGhhc05leHQgPSBmYWxzZSxcbiAgICAgIGRvbmVBcmdzID0gdW5kZWZpbmVkO1xuXG4gIGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgaXNEb25lID0gdHJ1ZTtcbiAgICBpZiAoc3luYykge1xuICAgICAgLy8gSXRlcmF0ZSBpbnN0ZWFkIG9mIHJlY3Vyc2luZyBpZiBwb3NzaWJsZS5cbiAgICAgIGRvbmVBcmdzID0gW10uY29uY2F0KF9zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXh0KCkge1xuICAgIGlmIChpc0RvbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBoYXNOZXh0ID0gdHJ1ZTtcbiAgICBpZiAoc3luYykge1xuICAgICAgLy8gSXRlcmF0ZSBpbnN0ZWFkIG9mIHJlY3Vyc2luZyBpZiBwb3NzaWJsZS5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzeW5jID0gdHJ1ZTtcblxuICAgIHdoaWxlICghaXNEb25lICYmIGN1cnJlbnRUdXJuIDwgdHVybnMgJiYgaGFzTmV4dCkge1xuICAgICAgaGFzTmV4dCA9IGZhbHNlO1xuICAgICAgd29yay5jYWxsKHRoaXMsIGN1cnJlbnRUdXJuKyssIG5leHQsIGRvbmUpO1xuICAgIH1cblxuICAgIHN5bmMgPSBmYWxzZTtcblxuICAgIGlmIChpc0RvbmUpIHtcbiAgICAgIC8vIFRoaXMgbWVhbnMgdGhlIGxvb3AgZmluaXNoZWQgc3luY2hyb25vdXNseS5cbiAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGRvbmVBcmdzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudFR1cm4gPj0gdHVybnMgJiYgaGFzTmV4dCkge1xuICAgICAgaXNEb25lID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbmV4dCgpO1xufSIsIi8qZXNsaW50LWRpc2FibGUgbm8tZW1wdHkgKi9cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuc2F2ZVN0YXRlID0gc2F2ZVN0YXRlO1xuZXhwb3J0cy5yZWFkU3RhdGUgPSByZWFkU3RhdGU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF93YXJuaW5nID0gcmVxdWlyZSgnd2FybmluZycpO1xuXG52YXIgX3dhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2FybmluZyk7XG5cbnZhciBLZXlQcmVmaXggPSAnQEBIaXN0b3J5Lyc7XG52YXIgUXVvdGFFeGNlZWRlZEVycm9ycyA9IFsnUXVvdGFFeGNlZWRlZEVycm9yJywgJ1FVT1RBX0VYQ0VFREVEX0VSUiddO1xuXG52YXIgU2VjdXJpdHlFcnJvciA9ICdTZWN1cml0eUVycm9yJztcblxuZnVuY3Rpb24gY3JlYXRlS2V5KGtleSkge1xuICByZXR1cm4gS2V5UHJlZml4ICsga2V5O1xufVxuXG5mdW5jdGlvbiBzYXZlU3RhdGUoa2V5LCBzdGF0ZSkge1xuICB0cnkge1xuICAgIGlmIChzdGF0ZSA9PSBudWxsKSB7XG4gICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShjcmVhdGVLZXkoa2V5KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGNyZWF0ZUtleShrZXkpLCBKU09OLnN0cmluZ2lmeShzdGF0ZSkpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoZXJyb3IubmFtZSA9PT0gU2VjdXJpdHlFcnJvcikge1xuICAgICAgLy8gQmxvY2tpbmcgY29va2llcyBpbiBDaHJvbWUvRmlyZWZveC9TYWZhcmkgdGhyb3dzIFNlY3VyaXR5RXJyb3Igb24gYW55XG4gICAgICAvLyBhdHRlbXB0IHRvIGFjY2VzcyB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuXG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gX3dhcm5pbmcyWydkZWZhdWx0J10oZmFsc2UsICdbaGlzdG9yeV0gVW5hYmxlIHRvIHNhdmUgc3RhdGU7IHNlc3Npb25TdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUgZHVlIHRvIHNlY3VyaXR5IHNldHRpbmdzJykgOiB1bmRlZmluZWQ7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoUXVvdGFFeGNlZWRlZEVycm9ycy5pbmRleE9mKGVycm9yLm5hbWUpID49IDAgJiYgd2luZG93LnNlc3Npb25TdG9yYWdlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gU2FmYXJpIFwicHJpdmF0ZSBtb2RlXCIgdGhyb3dzIFF1b3RhRXhjZWVkZWRFcnJvci5cbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBfd2FybmluZzJbJ2RlZmF1bHQnXShmYWxzZSwgJ1toaXN0b3J5XSBVbmFibGUgdG8gc2F2ZSBzdGF0ZTsgc2Vzc2lvblN0b3JhZ2UgaXMgbm90IGF2YWlsYWJsZSBpbiBTYWZhcmkgcHJpdmF0ZSBtb2RlJykgOiB1bmRlZmluZWQ7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWFkU3RhdGUoa2V5KSB7XG4gIHZhciBqc29uID0gdW5kZWZpbmVkO1xuICB0cnkge1xuICAgIGpzb24gPSB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShjcmVhdGVLZXkoa2V5KSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGVycm9yLm5hbWUgPT09IFNlY3VyaXR5RXJyb3IpIHtcbiAgICAgIC8vIEJsb2NraW5nIGNvb2tpZXMgaW4gQ2hyb21lL0ZpcmVmb3gvU2FmYXJpIHRocm93cyBTZWN1cml0eUVycm9yIG9uIGFueVxuICAgICAgLy8gYXR0ZW1wdCB0byBhY2Nlc3Mgd2luZG93LnNlc3Npb25TdG9yYWdlLlxuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IF93YXJuaW5nMlsnZGVmYXVsdCddKGZhbHNlLCAnW2hpc3RvcnldIFVuYWJsZSB0byByZWFkIHN0YXRlOyBzZXNzaW9uU3RvcmFnZSBpcyBub3QgYXZhaWxhYmxlIGR1ZSB0byBzZWN1cml0eSBzZXR0aW5ncycpIDogdW5kZWZpbmVkO1xuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpZiAoanNvbikge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShqc29uKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gSWdub3JlIGludmFsaWQgSlNPTi5cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmFkZEV2ZW50TGlzdGVuZXIgPSBhZGRFdmVudExpc3RlbmVyO1xuZXhwb3J0cy5yZW1vdmVFdmVudExpc3RlbmVyID0gcmVtb3ZlRXZlbnRMaXN0ZW5lcjtcbmV4cG9ydHMuZ2V0SGFzaFBhdGggPSBnZXRIYXNoUGF0aDtcbmV4cG9ydHMucmVwbGFjZUhhc2hQYXRoID0gcmVwbGFjZUhhc2hQYXRoO1xuZXhwb3J0cy5nZXRXaW5kb3dQYXRoID0gZ2V0V2luZG93UGF0aDtcbmV4cG9ydHMuZ28gPSBnbztcbmV4cG9ydHMuZ2V0VXNlckNvbmZpcm1hdGlvbiA9IGdldFVzZXJDb25maXJtYXRpb247XG5leHBvcnRzLnN1cHBvcnRzSGlzdG9yeSA9IHN1cHBvcnRzSGlzdG9yeTtcbmV4cG9ydHMuc3VwcG9ydHNHb1dpdGhvdXRSZWxvYWRVc2luZ0hhc2ggPSBzdXBwb3J0c0dvV2l0aG91dFJlbG9hZFVzaW5nSGFzaDtcblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcihub2RlLCBldmVudCwgbGlzdGVuZXIpIHtcbiAgaWYgKG5vZGUuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGZhbHNlKTtcbiAgfSBlbHNlIHtcbiAgICBub2RlLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgbGlzdGVuZXIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXIobm9kZSwgZXZlbnQsIGxpc3RlbmVyKSB7XG4gIGlmIChub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgbm9kZS5kZXRhY2hFdmVudCgnb24nICsgZXZlbnQsIGxpc3RlbmVyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRIYXNoUGF0aCgpIHtcbiAgLy8gV2UgY2FuJ3QgdXNlIHdpbmRvdy5sb2NhdGlvbi5oYXNoIGhlcmUgYmVjYXVzZSBpdCdzIG5vdFxuICAvLyBjb25zaXN0ZW50IGFjcm9zcyBicm93c2VycyAtIEZpcmVmb3ggd2lsbCBwcmUtZGVjb2RlIGl0IVxuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVsxXSB8fCAnJztcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUhhc2hQYXRoKHBhdGgpIHtcbiAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2Uod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCArICcjJyArIHBhdGgpO1xufVxuXG5mdW5jdGlvbiBnZXRXaW5kb3dQYXRoKCkge1xuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCArIHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xufVxuXG5mdW5jdGlvbiBnbyhuKSB7XG4gIGlmIChuKSB3aW5kb3cuaGlzdG9yeS5nbyhuKTtcbn1cblxuZnVuY3Rpb24gZ2V0VXNlckNvbmZpcm1hdGlvbihtZXNzYWdlLCBjYWxsYmFjaykge1xuICBjYWxsYmFjayh3aW5kb3cuY29uZmlybShtZXNzYWdlKSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBIVE1MNSBoaXN0b3J5IEFQSSBpcyBzdXBwb3J0ZWQuIFRha2VuIGZyb20gTW9kZXJuaXpyLlxuICpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2Jsb2IvbWFzdGVyL2ZlYXR1cmUtZGV0ZWN0cy9oaXN0b3J5LmpzXG4gKiBjaGFuZ2VkIHRvIGF2b2lkIGZhbHNlIG5lZ2F0aXZlcyBmb3IgV2luZG93cyBQaG9uZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9yYWNrdC9yZWFjdC1yb3V0ZXIvaXNzdWVzLzU4NlxuICovXG5cbmZ1bmN0aW9uIHN1cHBvcnRzSGlzdG9yeSgpIHtcbiAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgaWYgKCh1YS5pbmRleE9mKCdBbmRyb2lkIDIuJykgIT09IC0xIHx8IHVhLmluZGV4T2YoJ0FuZHJvaWQgNC4wJykgIT09IC0xKSAmJiB1YS5pbmRleE9mKCdNb2JpbGUgU2FmYXJpJykgIT09IC0xICYmIHVhLmluZGV4T2YoJ0Nocm9tZScpID09PSAtMSAmJiB1YS5pbmRleE9mKCdXaW5kb3dzIFBob25lJykgPT09IC0xKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB3aW5kb3cuaGlzdG9yeSAmJiAncHVzaFN0YXRlJyBpbiB3aW5kb3cuaGlzdG9yeTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGZhbHNlIGlmIHVzaW5nIGdvKG4pIHdpdGggaGFzaCBoaXN0b3J5IGNhdXNlcyBhIGZ1bGwgcGFnZSByZWxvYWQuXG4gKi9cblxuZnVuY3Rpb24gc3VwcG9ydHNHb1dpdGhvdXRSZWxvYWRVc2luZ0hhc2goKSB7XG4gIHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHJldHVybiB1YS5pbmRleE9mKCdGaXJlZm94JykgPT09IC0xO1xufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbnZhciBjYW5Vc2VET00gPSAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQgJiYgd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xuZXhwb3J0cy5jYW5Vc2VET00gPSBjYW5Vc2VET007IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5leHRyYWN0UGF0aCA9IGV4dHJhY3RQYXRoO1xuZXhwb3J0cy5wYXJzZVBhdGggPSBwYXJzZVBhdGg7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF93YXJuaW5nID0gcmVxdWlyZSgnd2FybmluZycpO1xuXG52YXIgX3dhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2FybmluZyk7XG5cbmZ1bmN0aW9uIGV4dHJhY3RQYXRoKHN0cmluZykge1xuICB2YXIgbWF0Y2ggPSBzdHJpbmcubWF0Y2goL15odHRwcz86XFwvXFwvW15cXC9dKi8pO1xuXG4gIGlmIChtYXRjaCA9PSBudWxsKSByZXR1cm4gc3RyaW5nO1xuXG4gIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKG1hdGNoWzBdLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlUGF0aChwYXRoKSB7XG4gIHZhciBwYXRobmFtZSA9IGV4dHJhY3RQYXRoKHBhdGgpO1xuICB2YXIgc2VhcmNoID0gJyc7XG4gIHZhciBoYXNoID0gJyc7XG5cbiAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IF93YXJuaW5nMlsnZGVmYXVsdCddKHBhdGggPT09IHBhdGhuYW1lLCAnQSBwYXRoIG11c3QgYmUgcGF0aG5hbWUgKyBzZWFyY2ggKyBoYXNoIG9ubHksIG5vdCBhIGZ1bGx5IHF1YWxpZmllZCBVUkwgbGlrZSBcIiVzXCInLCBwYXRoKSA6IHVuZGVmaW5lZDtcblxuICB2YXIgaGFzaEluZGV4ID0gcGF0aG5hbWUuaW5kZXhPZignIycpO1xuICBpZiAoaGFzaEluZGV4ICE9PSAtMSkge1xuICAgIGhhc2ggPSBwYXRobmFtZS5zdWJzdHJpbmcoaGFzaEluZGV4KTtcbiAgICBwYXRobmFtZSA9IHBhdGhuYW1lLnN1YnN0cmluZygwLCBoYXNoSW5kZXgpO1xuICB9XG5cbiAgdmFyIHNlYXJjaEluZGV4ID0gcGF0aG5hbWUuaW5kZXhPZignPycpO1xuICBpZiAoc2VhcmNoSW5kZXggIT09IC0xKSB7XG4gICAgc2VhcmNoID0gcGF0aG5hbWUuc3Vic3RyaW5nKHNlYXJjaEluZGV4KTtcbiAgICBwYXRobmFtZSA9IHBhdGhuYW1lLnN1YnN0cmluZygwLCBzZWFyY2hJbmRleCk7XG4gIH1cblxuICBpZiAocGF0aG5hbWUgPT09ICcnKSBwYXRobmFtZSA9ICcvJztcblxuICByZXR1cm4ge1xuICAgIHBhdGhuYW1lOiBwYXRobmFtZSxcbiAgICBzZWFyY2g6IHNlYXJjaCxcbiAgICBoYXNoOiBoYXNoXG4gIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfaW52YXJpYW50ID0gcmVxdWlyZSgnaW52YXJpYW50Jyk7XG5cbnZhciBfaW52YXJpYW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ludmFyaWFudCk7XG5cbnZhciBfQWN0aW9ucyA9IHJlcXVpcmUoJy4vQWN0aW9ucycpO1xuXG52YXIgX1BhdGhVdGlscyA9IHJlcXVpcmUoJy4vUGF0aFV0aWxzJyk7XG5cbnZhciBfRXhlY3V0aW9uRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL0V4ZWN1dGlvbkVudmlyb25tZW50Jyk7XG5cbnZhciBfRE9NVXRpbHMgPSByZXF1aXJlKCcuL0RPTVV0aWxzJyk7XG5cbnZhciBfRE9NU3RhdGVTdG9yYWdlID0gcmVxdWlyZSgnLi9ET01TdGF0ZVN0b3JhZ2UnKTtcblxudmFyIF9jcmVhdGVET01IaXN0b3J5ID0gcmVxdWlyZSgnLi9jcmVhdGVET01IaXN0b3J5Jyk7XG5cbnZhciBfY3JlYXRlRE9NSGlzdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVET01IaXN0b3J5KTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgaGlzdG9yeSBvYmplY3QgdGhhdCB1c2VzIEhUTUw1J3MgaGlzdG9yeSBBUElcbiAqIChwdXNoU3RhdGUsIHJlcGxhY2VTdGF0ZSwgYW5kIHRoZSBwb3BzdGF0ZSBldmVudCkgdG8gbWFuYWdlIGhpc3RvcnkuXG4gKiBUaGlzIGlzIHRoZSByZWNvbW1lbmRlZCBtZXRob2Qgb2YgbWFuYWdpbmcgaGlzdG9yeSBpbiBicm93c2VycyBiZWNhdXNlXG4gKiBpdCBwcm92aWRlcyB0aGUgY2xlYW5lc3QgVVJMcy5cbiAqXG4gKiBOb3RlOiBJbiBicm93c2VycyB0aGF0IGRvIG5vdCBzdXBwb3J0IHRoZSBIVE1MNSBoaXN0b3J5IEFQSSBmdWxsXG4gKiBwYWdlIHJlbG9hZHMgd2lsbCBiZSB1c2VkIHRvIHByZXNlcnZlIFVSTHMuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJyb3dzZXJIaXN0b3J5KCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG4gICFfRXhlY3V0aW9uRW52aXJvbm1lbnQuY2FuVXNlRE9NID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IF9pbnZhcmlhbnQyWydkZWZhdWx0J10oZmFsc2UsICdCcm93c2VyIGhpc3RvcnkgbmVlZHMgYSBET00nKSA6IF9pbnZhcmlhbnQyWydkZWZhdWx0J10oZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gIHZhciBmb3JjZVJlZnJlc2ggPSBvcHRpb25zLmZvcmNlUmVmcmVzaDtcblxuICB2YXIgaXNTdXBwb3J0ZWQgPSBfRE9NVXRpbHMuc3VwcG9ydHNIaXN0b3J5KCk7XG4gIHZhciB1c2VSZWZyZXNoID0gIWlzU3VwcG9ydGVkIHx8IGZvcmNlUmVmcmVzaDtcblxuICBmdW5jdGlvbiBnZXRDdXJyZW50TG9jYXRpb24oaGlzdG9yeVN0YXRlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGhpc3RvcnlTdGF0ZSA9IGhpc3RvcnlTdGF0ZSB8fCB3aW5kb3cuaGlzdG9yeS5zdGF0ZSB8fCB7fTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBoaXN0b3J5U3RhdGUgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgcGF0aCA9IF9ET01VdGlscy5nZXRXaW5kb3dQYXRoKCk7XG4gICAgdmFyIF9oaXN0b3J5U3RhdGUgPSBoaXN0b3J5U3RhdGU7XG4gICAgdmFyIGtleSA9IF9oaXN0b3J5U3RhdGUua2V5O1xuXG4gICAgdmFyIHN0YXRlID0gdW5kZWZpbmVkO1xuICAgIGlmIChrZXkpIHtcbiAgICAgIHN0YXRlID0gX0RPTVN0YXRlU3RvcmFnZS5yZWFkU3RhdGUoa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUgPSBudWxsO1xuICAgICAga2V5ID0gaGlzdG9yeS5jcmVhdGVLZXkoKTtcblxuICAgICAgaWYgKGlzU3VwcG9ydGVkKSB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoX2V4dGVuZHMoe30sIGhpc3RvcnlTdGF0ZSwgeyBrZXk6IGtleSB9KSwgbnVsbCk7XG4gICAgfVxuXG4gICAgdmFyIGxvY2F0aW9uID0gX1BhdGhVdGlscy5wYXJzZVBhdGgocGF0aCk7XG5cbiAgICByZXR1cm4gaGlzdG9yeS5jcmVhdGVMb2NhdGlvbihfZXh0ZW5kcyh7fSwgbG9jYXRpb24sIHsgc3RhdGU6IHN0YXRlIH0pLCB1bmRlZmluZWQsIGtleSk7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydFBvcFN0YXRlTGlzdGVuZXIoX3JlZikge1xuICAgIHZhciB0cmFuc2l0aW9uVG8gPSBfcmVmLnRyYW5zaXRpb25UbztcblxuICAgIGZ1bmN0aW9uIHBvcFN0YXRlTGlzdGVuZXIoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5zdGF0ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47IC8vIElnbm9yZSBleHRyYW5lb3VzIHBvcHN0YXRlIGV2ZW50cyBpbiBXZWJLaXQuXG5cbiAgICAgIHRyYW5zaXRpb25UbyhnZXRDdXJyZW50TG9jYXRpb24oZXZlbnQuc3RhdGUpKTtcbiAgICB9XG5cbiAgICBfRE9NVXRpbHMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdwb3BzdGF0ZScsIHBvcFN0YXRlTGlzdGVuZXIpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIF9ET01VdGlscy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ3BvcHN0YXRlJywgcG9wU3RhdGVMaXN0ZW5lcik7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmlzaFRyYW5zaXRpb24obG9jYXRpb24pIHtcbiAgICB2YXIgYmFzZW5hbWUgPSBsb2NhdGlvbi5iYXNlbmFtZTtcbiAgICB2YXIgcGF0aG5hbWUgPSBsb2NhdGlvbi5wYXRobmFtZTtcbiAgICB2YXIgc2VhcmNoID0gbG9jYXRpb24uc2VhcmNoO1xuICAgIHZhciBoYXNoID0gbG9jYXRpb24uaGFzaDtcbiAgICB2YXIgc3RhdGUgPSBsb2NhdGlvbi5zdGF0ZTtcbiAgICB2YXIgYWN0aW9uID0gbG9jYXRpb24uYWN0aW9uO1xuICAgIHZhciBrZXkgPSBsb2NhdGlvbi5rZXk7XG5cbiAgICBpZiAoYWN0aW9uID09PSBfQWN0aW9ucy5QT1ApIHJldHVybjsgLy8gTm90aGluZyB0byBkby5cblxuICAgIF9ET01TdGF0ZVN0b3JhZ2Uuc2F2ZVN0YXRlKGtleSwgc3RhdGUpO1xuXG4gICAgdmFyIHBhdGggPSAoYmFzZW5hbWUgfHwgJycpICsgcGF0aG5hbWUgKyBzZWFyY2ggKyBoYXNoO1xuICAgIHZhciBoaXN0b3J5U3RhdGUgPSB7XG4gICAgICBrZXk6IGtleVxuICAgIH07XG5cbiAgICBpZiAoYWN0aW9uID09PSBfQWN0aW9ucy5QVVNIKSB7XG4gICAgICBpZiAodXNlUmVmcmVzaCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGg7XG4gICAgICAgIHJldHVybiBmYWxzZTsgLy8gUHJldmVudCBsb2NhdGlvbiB1cGRhdGUuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShoaXN0b3J5U3RhdGUsIG51bGwsIHBhdGgpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJFUExBQ0VcbiAgICAgIGlmICh1c2VSZWZyZXNoKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHBhdGgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIFByZXZlbnQgbG9jYXRpb24gdXBkYXRlLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoaGlzdG9yeVN0YXRlLCBudWxsLCBwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBoaXN0b3J5ID0gX2NyZWF0ZURPTUhpc3RvcnkyWydkZWZhdWx0J10oX2V4dGVuZHMoe30sIG9wdGlvbnMsIHtcbiAgICBnZXRDdXJyZW50TG9jYXRpb246IGdldEN1cnJlbnRMb2NhdGlvbixcbiAgICBmaW5pc2hUcmFuc2l0aW9uOiBmaW5pc2hUcmFuc2l0aW9uLFxuICAgIHNhdmVTdGF0ZTogX0RPTVN0YXRlU3RvcmFnZS5zYXZlU3RhdGVcbiAgfSkpO1xuXG4gIHZhciBsaXN0ZW5lckNvdW50ID0gMCxcbiAgICAgIHN0b3BQb3BTdGF0ZUxpc3RlbmVyID0gdW5kZWZpbmVkO1xuXG4gIGZ1bmN0aW9uIGxpc3RlbkJlZm9yZShsaXN0ZW5lcikge1xuICAgIGlmICgrK2xpc3RlbmVyQ291bnQgPT09IDEpIHN0b3BQb3BTdGF0ZUxpc3RlbmVyID0gc3RhcnRQb3BTdGF0ZUxpc3RlbmVyKGhpc3RvcnkpO1xuXG4gICAgdmFyIHVubGlzdGVuID0gaGlzdG9yeS5saXN0ZW5CZWZvcmUobGlzdGVuZXIpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHVubGlzdGVuKCk7XG5cbiAgICAgIGlmICgtLWxpc3RlbmVyQ291bnQgPT09IDApIHN0b3BQb3BTdGF0ZUxpc3RlbmVyKCk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgIGlmICgrK2xpc3RlbmVyQ291bnQgPT09IDEpIHN0b3BQb3BTdGF0ZUxpc3RlbmVyID0gc3RhcnRQb3BTdGF0ZUxpc3RlbmVyKGhpc3RvcnkpO1xuXG4gICAgdmFyIHVubGlzdGVuID0gaGlzdG9yeS5saXN0ZW4obGlzdGVuZXIpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHVubGlzdGVuKCk7XG5cbiAgICAgIGlmICgtLWxpc3RlbmVyQ291bnQgPT09IDApIHN0b3BQb3BTdGF0ZUxpc3RlbmVyKCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIGRlcHJlY2F0ZWRcbiAgZnVuY3Rpb24gcmVnaXN0ZXJUcmFuc2l0aW9uSG9vayhob29rKSB7XG4gICAgaWYgKCsrbGlzdGVuZXJDb3VudCA9PT0gMSkgc3RvcFBvcFN0YXRlTGlzdGVuZXIgPSBzdGFydFBvcFN0YXRlTGlzdGVuZXIoaGlzdG9yeSk7XG5cbiAgICBoaXN0b3J5LnJlZ2lzdGVyVHJhbnNpdGlvbkhvb2soaG9vayk7XG4gIH1cblxuICAvLyBkZXByZWNhdGVkXG4gIGZ1bmN0aW9uIHVucmVnaXN0ZXJUcmFuc2l0aW9uSG9vayhob29rKSB7XG4gICAgaGlzdG9yeS51bnJlZ2lzdGVyVHJhbnNpdGlvbkhvb2soaG9vayk7XG5cbiAgICBpZiAoLS1saXN0ZW5lckNvdW50ID09PSAwKSBzdG9wUG9wU3RhdGVMaXN0ZW5lcigpO1xuICB9XG5cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBoaXN0b3J5LCB7XG4gICAgbGlzdGVuQmVmb3JlOiBsaXN0ZW5CZWZvcmUsXG4gICAgbGlzdGVuOiBsaXN0ZW4sXG4gICAgcmVnaXN0ZXJUcmFuc2l0aW9uSG9vazogcmVnaXN0ZXJUcmFuc2l0aW9uSG9vayxcbiAgICB1bnJlZ2lzdGVyVHJhbnNpdGlvbkhvb2s6IHVucmVnaXN0ZXJUcmFuc2l0aW9uSG9va1xuICB9KTtcbn1cblxuZXhwb3J0c1snZGVmYXVsdCddID0gY3JlYXRlQnJvd3Nlckhpc3Rvcnk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9pbnZhcmlhbnQgPSByZXF1aXJlKCdpbnZhcmlhbnQnKTtcblxudmFyIF9pbnZhcmlhbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW52YXJpYW50KTtcblxudmFyIF9FeGVjdXRpb25FbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vRXhlY3V0aW9uRW52aXJvbm1lbnQnKTtcblxudmFyIF9ET01VdGlscyA9IHJlcXVpcmUoJy4vRE9NVXRpbHMnKTtcblxudmFyIF9jcmVhdGVIaXN0b3J5ID0gcmVxdWlyZSgnLi9jcmVhdGVIaXN0b3J5Jyk7XG5cbnZhciBfY3JlYXRlSGlzdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVIaXN0b3J5KTtcblxuZnVuY3Rpb24gY3JlYXRlRE9NSGlzdG9yeShvcHRpb25zKSB7XG4gIHZhciBoaXN0b3J5ID0gX2NyZWF0ZUhpc3RvcnkyWydkZWZhdWx0J10oX2V4dGVuZHMoe1xuICAgIGdldFVzZXJDb25maXJtYXRpb246IF9ET01VdGlscy5nZXRVc2VyQ29uZmlybWF0aW9uXG4gIH0sIG9wdGlvbnMsIHtcbiAgICBnbzogX0RPTVV0aWxzLmdvXG4gIH0pKTtcblxuICBmdW5jdGlvbiBsaXN0ZW4obGlzdGVuZXIpIHtcbiAgICAhX0V4ZWN1dGlvbkVudmlyb25tZW50LmNhblVzZURPTSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBfaW52YXJpYW50MlsnZGVmYXVsdCddKGZhbHNlLCAnRE9NIGhpc3RvcnkgbmVlZHMgYSBET00nKSA6IF9pbnZhcmlhbnQyWydkZWZhdWx0J10oZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIGhpc3RvcnkubGlzdGVuKGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgaGlzdG9yeSwge1xuICAgIGxpc3RlbjogbGlzdGVuXG4gIH0pO1xufVxuXG5leHBvcnRzWydkZWZhdWx0J10gPSBjcmVhdGVET01IaXN0b3J5O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJ3dhcm5pbmcnKTtcblxudmFyIF93YXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dhcm5pbmcpO1xuXG52YXIgX2ludmFyaWFudCA9IHJlcXVpcmUoJ2ludmFyaWFudCcpO1xuXG52YXIgX2ludmFyaWFudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbnZhcmlhbnQpO1xuXG52YXIgX0FjdGlvbnMgPSByZXF1aXJlKCcuL0FjdGlvbnMnKTtcblxudmFyIF9QYXRoVXRpbHMgPSByZXF1aXJlKCcuL1BhdGhVdGlscycpO1xuXG52YXIgX0V4ZWN1dGlvbkVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9FeGVjdXRpb25FbnZpcm9ubWVudCcpO1xuXG52YXIgX0RPTVV0aWxzID0gcmVxdWlyZSgnLi9ET01VdGlscycpO1xuXG52YXIgX0RPTVN0YXRlU3RvcmFnZSA9IHJlcXVpcmUoJy4vRE9NU3RhdGVTdG9yYWdlJyk7XG5cbnZhciBfY3JlYXRlRE9NSGlzdG9yeSA9IHJlcXVpcmUoJy4vY3JlYXRlRE9NSGlzdG9yeScpO1xuXG52YXIgX2NyZWF0ZURPTUhpc3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlRE9NSGlzdG9yeSk7XG5cbmZ1bmN0aW9uIGlzQWJzb2x1dGVQYXRoKHBhdGgpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJyAmJiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufVxuXG5mdW5jdGlvbiBlbnN1cmVTbGFzaCgpIHtcbiAgdmFyIHBhdGggPSBfRE9NVXRpbHMuZ2V0SGFzaFBhdGgoKTtcblxuICBpZiAoaXNBYnNvbHV0ZVBhdGgocGF0aCkpIHJldHVybiB0cnVlO1xuXG4gIF9ET01VdGlscy5yZXBsYWNlSGFzaFBhdGgoJy8nICsgcGF0aCk7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBhZGRRdWVyeVN0cmluZ1ZhbHVlVG9QYXRoKHBhdGgsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHBhdGggKyAocGF0aC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIChrZXkgKyAnPScgKyB2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHN0cmlwUXVlcnlTdHJpbmdWYWx1ZUZyb21QYXRoKHBhdGgsIGtleSkge1xuICByZXR1cm4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1s/Jl0/JyArIGtleSArICc9W2EtekEtWjAtOV0rJyksICcnKTtcbn1cblxuZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmdWYWx1ZUZyb21QYXRoKHBhdGgsIGtleSkge1xuICB2YXIgbWF0Y2ggPSBwYXRoLm1hdGNoKG5ldyBSZWdFeHAoJ1xcXFw/Lio/XFxcXGInICsga2V5ICsgJz0oLis/KVxcXFxiJykpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbMV07XG59XG5cbnZhciBEZWZhdWx0UXVlcnlLZXkgPSAnX2snO1xuXG5mdW5jdGlvbiBjcmVhdGVIYXNoSGlzdG9yeSgpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuICAhX0V4ZWN1dGlvbkVudmlyb25tZW50LmNhblVzZURPTSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBfaW52YXJpYW50MlsnZGVmYXVsdCddKGZhbHNlLCAnSGFzaCBoaXN0b3J5IG5lZWRzIGEgRE9NJykgOiBfaW52YXJpYW50MlsnZGVmYXVsdCddKGZhbHNlKSA6IHVuZGVmaW5lZDtcblxuICB2YXIgcXVlcnlLZXkgPSBvcHRpb25zLnF1ZXJ5S2V5O1xuXG4gIGlmIChxdWVyeUtleSA9PT0gdW5kZWZpbmVkIHx8ICEhcXVlcnlLZXkpIHF1ZXJ5S2V5ID0gdHlwZW9mIHF1ZXJ5S2V5ID09PSAnc3RyaW5nJyA/IHF1ZXJ5S2V5IDogRGVmYXVsdFF1ZXJ5S2V5O1xuXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnRMb2NhdGlvbigpIHtcbiAgICB2YXIgcGF0aCA9IF9ET01VdGlscy5nZXRIYXNoUGF0aCgpO1xuXG4gICAgdmFyIGtleSA9IHVuZGVmaW5lZCxcbiAgICAgICAgc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHF1ZXJ5S2V5KSB7XG4gICAgICBrZXkgPSBnZXRRdWVyeVN0cmluZ1ZhbHVlRnJvbVBhdGgocGF0aCwgcXVlcnlLZXkpO1xuICAgICAgcGF0aCA9IHN0cmlwUXVlcnlTdHJpbmdWYWx1ZUZyb21QYXRoKHBhdGgsIHF1ZXJ5S2V5KTtcblxuICAgICAgaWYgKGtleSkge1xuICAgICAgICBzdGF0ZSA9IF9ET01TdGF0ZVN0b3JhZ2UucmVhZFN0YXRlKGtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZSA9IG51bGw7XG4gICAgICAgIGtleSA9IGhpc3RvcnkuY3JlYXRlS2V5KCk7XG4gICAgICAgIF9ET01VdGlscy5yZXBsYWNlSGFzaFBhdGgoYWRkUXVlcnlTdHJpbmdWYWx1ZVRvUGF0aChwYXRoLCBxdWVyeUtleSwga2V5KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IHN0YXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbG9jYXRpb24gPSBfUGF0aFV0aWxzLnBhcnNlUGF0aChwYXRoKTtcblxuICAgIHJldHVybiBoaXN0b3J5LmNyZWF0ZUxvY2F0aW9uKF9leHRlbmRzKHt9LCBsb2NhdGlvbiwgeyBzdGF0ZTogc3RhdGUgfSksIHVuZGVmaW5lZCwga2V5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0SGFzaENoYW5nZUxpc3RlbmVyKF9yZWYpIHtcbiAgICB2YXIgdHJhbnNpdGlvblRvID0gX3JlZi50cmFuc2l0aW9uVG87XG5cbiAgICBmdW5jdGlvbiBoYXNoQ2hhbmdlTGlzdGVuZXIoKSB7XG4gICAgICBpZiAoIWVuc3VyZVNsYXNoKCkpIHJldHVybjsgLy8gQWx3YXlzIG1ha2Ugc3VyZSBoYXNoZXMgYXJlIHByZWNlZWRlZCB3aXRoIGEgLy5cblxuICAgICAgdHJhbnNpdGlvblRvKGdldEN1cnJlbnRMb2NhdGlvbigpKTtcbiAgICB9XG5cbiAgICBlbnN1cmVTbGFzaCgpO1xuICAgIF9ET01VdGlscy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ2hhc2hjaGFuZ2UnLCBoYXNoQ2hhbmdlTGlzdGVuZXIpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIF9ET01VdGlscy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ2hhc2hjaGFuZ2UnLCBoYXNoQ2hhbmdlTGlzdGVuZXIpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBmaW5pc2hUcmFuc2l0aW9uKGxvY2F0aW9uKSB7XG4gICAgdmFyIGJhc2VuYW1lID0gbG9jYXRpb24uYmFzZW5hbWU7XG4gICAgdmFyIHBhdGhuYW1lID0gbG9jYXRpb24ucGF0aG5hbWU7XG4gICAgdmFyIHNlYXJjaCA9IGxvY2F0aW9uLnNlYXJjaDtcbiAgICB2YXIgc3RhdGUgPSBsb2NhdGlvbi5zdGF0ZTtcbiAgICB2YXIgYWN0aW9uID0gbG9jYXRpb24uYWN0aW9uO1xuICAgIHZhciBrZXkgPSBsb2NhdGlvbi5rZXk7XG5cbiAgICBpZiAoYWN0aW9uID09PSBfQWN0aW9ucy5QT1ApIHJldHVybjsgLy8gTm90aGluZyB0byBkby5cblxuICAgIHZhciBwYXRoID0gKGJhc2VuYW1lIHx8ICcnKSArIHBhdGhuYW1lICsgc2VhcmNoO1xuXG4gICAgaWYgKHF1ZXJ5S2V5KSB7XG4gICAgICBwYXRoID0gYWRkUXVlcnlTdHJpbmdWYWx1ZVRvUGF0aChwYXRoLCBxdWVyeUtleSwga2V5KTtcbiAgICAgIF9ET01TdGF0ZVN0b3JhZ2Uuc2F2ZVN0YXRlKGtleSwgc3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEcm9wIGtleSBhbmQgc3RhdGUuXG4gICAgICBsb2NhdGlvbi5rZXkgPSBsb2NhdGlvbi5zdGF0ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGN1cnJlbnRIYXNoID0gX0RPTVV0aWxzLmdldEhhc2hQYXRoKCk7XG5cbiAgICBpZiAoYWN0aW9uID09PSBfQWN0aW9ucy5QVVNIKSB7XG4gICAgICBpZiAoY3VycmVudEhhc2ggIT09IHBhdGgpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBwYXRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IF93YXJuaW5nMlsnZGVmYXVsdCddKGZhbHNlLCAnWW91IGNhbm5vdCBQVVNIIHRoZSBzYW1lIHBhdGggdXNpbmcgaGFzaCBoaXN0b3J5JykgOiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjdXJyZW50SGFzaCAhPT0gcGF0aCkge1xuICAgICAgLy8gUkVQTEFDRVxuICAgICAgX0RPTVV0aWxzLnJlcGxhY2VIYXNoUGF0aChwYXRoKTtcbiAgICB9XG4gIH1cblxuICB2YXIgaGlzdG9yeSA9IF9jcmVhdGVET01IaXN0b3J5MlsnZGVmYXVsdCddKF9leHRlbmRzKHt9LCBvcHRpb25zLCB7XG4gICAgZ2V0Q3VycmVudExvY2F0aW9uOiBnZXRDdXJyZW50TG9jYXRpb24sXG4gICAgZmluaXNoVHJhbnNpdGlvbjogZmluaXNoVHJhbnNpdGlvbixcbiAgICBzYXZlU3RhdGU6IF9ET01TdGF0ZVN0b3JhZ2Uuc2F2ZVN0YXRlXG4gIH0pKTtcblxuICB2YXIgbGlzdGVuZXJDb3VudCA9IDAsXG4gICAgICBzdG9wSGFzaENoYW5nZUxpc3RlbmVyID0gdW5kZWZpbmVkO1xuXG4gIGZ1bmN0aW9uIGxpc3RlbkJlZm9yZShsaXN0ZW5lcikge1xuICAgIGlmICgrK2xpc3RlbmVyQ291bnQgPT09IDEpIHN0b3BIYXNoQ2hhbmdlTGlzdGVuZXIgPSBzdGFydEhhc2hDaGFuZ2VMaXN0ZW5lcihoaXN0b3J5KTtcblxuICAgIHZhciB1bmxpc3RlbiA9IGhpc3RvcnkubGlzdGVuQmVmb3JlKGxpc3RlbmVyKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB1bmxpc3RlbigpO1xuXG4gICAgICBpZiAoLS1saXN0ZW5lckNvdW50ID09PSAwKSBzdG9wSGFzaENoYW5nZUxpc3RlbmVyKCk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgIGlmICgrK2xpc3RlbmVyQ291bnQgPT09IDEpIHN0b3BIYXNoQ2hhbmdlTGlzdGVuZXIgPSBzdGFydEhhc2hDaGFuZ2VMaXN0ZW5lcihoaXN0b3J5KTtcblxuICAgIHZhciB1bmxpc3RlbiA9IGhpc3RvcnkubGlzdGVuKGxpc3RlbmVyKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB1bmxpc3RlbigpO1xuXG4gICAgICBpZiAoLS1saXN0ZW5lckNvdW50ID09PSAwKSBzdG9wSGFzaENoYW5nZUxpc3RlbmVyKCk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2gobG9jYXRpb24pIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gX3dhcm5pbmcyWydkZWZhdWx0J10ocXVlcnlLZXkgfHwgbG9jYXRpb24uc3RhdGUgPT0gbnVsbCwgJ1lvdSBjYW5ub3QgdXNlIHN0YXRlIHdpdGhvdXQgYSBxdWVyeUtleSBpdCB3aWxsIGJlIGRyb3BwZWQnKSA6IHVuZGVmaW5lZDtcblxuICAgIGhpc3RvcnkucHVzaChsb2NhdGlvbik7XG4gIH1cblxuICBmdW5jdGlvbiByZXBsYWNlKGxvY2F0aW9uKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IF93YXJuaW5nMlsnZGVmYXVsdCddKHF1ZXJ5S2V5IHx8IGxvY2F0aW9uLnN0YXRlID09IG51bGwsICdZb3UgY2Fubm90IHVzZSBzdGF0ZSB3aXRob3V0IGEgcXVlcnlLZXkgaXQgd2lsbCBiZSBkcm9wcGVkJykgOiB1bmRlZmluZWQ7XG5cbiAgICBoaXN0b3J5LnJlcGxhY2UobG9jYXRpb24pO1xuICB9XG5cbiAgdmFyIGdvSXNTdXBwb3J0ZWRXaXRob3V0UmVsb2FkID0gX0RPTVV0aWxzLnN1cHBvcnRzR29XaXRob3V0UmVsb2FkVXNpbmdIYXNoKCk7XG5cbiAgZnVuY3Rpb24gZ28obikge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBfd2FybmluZzJbJ2RlZmF1bHQnXShnb0lzU3VwcG9ydGVkV2l0aG91dFJlbG9hZCwgJ0hhc2ggaGlzdG9yeSBnbyhuKSBjYXVzZXMgYSBmdWxsIHBhZ2UgcmVsb2FkIGluIHRoaXMgYnJvd3NlcicpIDogdW5kZWZpbmVkO1xuXG4gICAgaGlzdG9yeS5nbyhuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUhyZWYocGF0aCkge1xuICAgIHJldHVybiAnIycgKyBoaXN0b3J5LmNyZWF0ZUhyZWYocGF0aCk7XG4gIH1cblxuICAvLyBkZXByZWNhdGVkXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyVHJhbnNpdGlvbkhvb2soaG9vaykge1xuICAgIGlmICgrK2xpc3RlbmVyQ291bnQgPT09IDEpIHN0b3BIYXNoQ2hhbmdlTGlzdGVuZXIgPSBzdGFydEhhc2hDaGFuZ2VMaXN0ZW5lcihoaXN0b3J5KTtcblxuICAgIGhpc3RvcnkucmVnaXN0ZXJUcmFuc2l0aW9uSG9vayhob29rKTtcbiAgfVxuXG4gIC8vIGRlcHJlY2F0ZWRcbiAgZnVuY3Rpb24gdW5yZWdpc3RlclRyYW5zaXRpb25Ib29rKGhvb2spIHtcbiAgICBoaXN0b3J5LnVucmVnaXN0ZXJUcmFuc2l0aW9uSG9vayhob29rKTtcblxuICAgIGlmICgtLWxpc3RlbmVyQ291bnQgPT09IDApIHN0b3BIYXNoQ2hhbmdlTGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8vIGRlcHJlY2F0ZWRcbiAgZnVuY3Rpb24gcHVzaFN0YXRlKHN0YXRlLCBwYXRoKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IF93YXJuaW5nMlsnZGVmYXVsdCddKHF1ZXJ5S2V5IHx8IHN0YXRlID09IG51bGwsICdZb3UgY2Fubm90IHVzZSBzdGF0ZSB3aXRob3V0IGEgcXVlcnlLZXkgaXQgd2lsbCBiZSBkcm9wcGVkJykgOiB1bmRlZmluZWQ7XG5cbiAgICBoaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZSwgcGF0aCk7XG4gIH1cblxuICAvLyBkZXByZWNhdGVkXG4gIGZ1bmN0aW9uIHJlcGxhY2VTdGF0ZShzdGF0ZSwgcGF0aCkge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBfd2FybmluZzJbJ2RlZmF1bHQnXShxdWVyeUtleSB8fCBzdGF0ZSA9PSBudWxsLCAnWW91IGNhbm5vdCB1c2Ugc3RhdGUgd2l0aG91dCBhIHF1ZXJ5S2V5IGl0IHdpbGwgYmUgZHJvcHBlZCcpIDogdW5kZWZpbmVkO1xuXG4gICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUoc3RhdGUsIHBhdGgpO1xuICB9XG5cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBoaXN0b3J5LCB7XG4gICAgbGlzdGVuQmVmb3JlOiBsaXN0ZW5CZWZvcmUsXG4gICAgbGlzdGVuOiBsaXN0ZW4sXG4gICAgcHVzaDogcHVzaCxcbiAgICByZXBsYWNlOiByZXBsYWNlLFxuICAgIGdvOiBnbyxcbiAgICBjcmVhdGVIcmVmOiBjcmVhdGVIcmVmLFxuXG4gICAgcmVnaXN0ZXJUcmFuc2l0aW9uSG9vazogcmVnaXN0ZXJUcmFuc2l0aW9uSG9vaywgLy8gZGVwcmVjYXRlZCAtIHdhcm5pbmcgaXMgaW4gY3JlYXRlSGlzdG9yeVxuICAgIHVucmVnaXN0ZXJUcmFuc2l0aW9uSG9vazogdW5yZWdpc3RlclRyYW5zaXRpb25Ib29rLCAvLyBkZXByZWNhdGVkIC0gd2FybmluZyBpcyBpbiBjcmVhdGVIaXN0b3J5XG4gICAgcHVzaFN0YXRlOiBwdXNoU3RhdGUsIC8vIGRlcHJlY2F0ZWQgLSB3YXJuaW5nIGlzIGluIGNyZWF0ZUhpc3RvcnlcbiAgICByZXBsYWNlU3RhdGU6IHJlcGxhY2VTdGF0ZSAvLyBkZXByZWNhdGVkIC0gd2FybmluZyBpcyBpbiBjcmVhdGVIaXN0b3J5XG4gIH0pO1xufVxuXG5leHBvcnRzWydkZWZhdWx0J10gPSBjcmVhdGVIYXNoSGlzdG9yeTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3dhcm5pbmcgPSByZXF1aXJlKCd3YXJuaW5nJyk7XG5cbnZhciBfd2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93YXJuaW5nKTtcblxudmFyIF9kZWVwRXF1YWwgPSByZXF1aXJlKCdkZWVwLWVxdWFsJyk7XG5cbnZhciBfZGVlcEVxdWFsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZXBFcXVhbCk7XG5cbnZhciBfUGF0aFV0aWxzID0gcmVxdWlyZSgnLi9QYXRoVXRpbHMnKTtcblxudmFyIF9Bc3luY1V0aWxzID0gcmVxdWlyZSgnLi9Bc3luY1V0aWxzJyk7XG5cbnZhciBfQWN0aW9ucyA9IHJlcXVpcmUoJy4vQWN0aW9ucycpO1xuXG52YXIgX2NyZWF0ZUxvY2F0aW9uMiA9IHJlcXVpcmUoJy4vY3JlYXRlTG9jYXRpb24nKTtcblxudmFyIF9jcmVhdGVMb2NhdGlvbjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVMb2NhdGlvbjIpO1xuXG52YXIgX3J1blRyYW5zaXRpb25Ib29rID0gcmVxdWlyZSgnLi9ydW5UcmFuc2l0aW9uSG9vaycpO1xuXG52YXIgX3J1blRyYW5zaXRpb25Ib29rMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3J1blRyYW5zaXRpb25Ib29rKTtcblxudmFyIF9kZXByZWNhdGUgPSByZXF1aXJlKCcuL2RlcHJlY2F0ZScpO1xuXG52YXIgX2RlcHJlY2F0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZXByZWNhdGUpO1xuXG5mdW5jdGlvbiBjcmVhdGVSYW5kb21LZXkobGVuZ3RoKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgbGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gbG9jYXRpb25zQXJlRXF1YWwoYSwgYikge1xuICByZXR1cm4gYS5wYXRobmFtZSA9PT0gYi5wYXRobmFtZSAmJiBhLnNlYXJjaCA9PT0gYi5zZWFyY2ggJiZcbiAgLy9hLmFjdGlvbiA9PT0gYi5hY3Rpb24gJiYgLy8gRGlmZmVyZW50IGFjdGlvbiAhPT0gbG9jYXRpb24gY2hhbmdlLlxuICBhLmtleSA9PT0gYi5rZXkgJiYgX2RlZXBFcXVhbDJbJ2RlZmF1bHQnXShhLnN0YXRlLCBiLnN0YXRlKTtcbn1cblxudmFyIERlZmF1bHRLZXlMZW5ndGggPSA2O1xuXG5mdW5jdGlvbiBjcmVhdGVIaXN0b3J5KCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuICB2YXIgZ2V0Q3VycmVudExvY2F0aW9uID0gb3B0aW9ucy5nZXRDdXJyZW50TG9jYXRpb247XG4gIHZhciBmaW5pc2hUcmFuc2l0aW9uID0gb3B0aW9ucy5maW5pc2hUcmFuc2l0aW9uO1xuICB2YXIgc2F2ZVN0YXRlID0gb3B0aW9ucy5zYXZlU3RhdGU7XG4gIHZhciBnbyA9IG9wdGlvbnMuZ287XG4gIHZhciBnZXRVc2VyQ29uZmlybWF0aW9uID0gb3B0aW9ucy5nZXRVc2VyQ29uZmlybWF0aW9uO1xuICB2YXIga2V5TGVuZ3RoID0gb3B0aW9ucy5rZXlMZW5ndGg7XG5cbiAgaWYgKHR5cGVvZiBrZXlMZW5ndGggIT09ICdudW1iZXInKSBrZXlMZW5ndGggPSBEZWZhdWx0S2V5TGVuZ3RoO1xuXG4gIHZhciB0cmFuc2l0aW9uSG9va3MgPSBbXTtcblxuICBmdW5jdGlvbiBsaXN0ZW5CZWZvcmUoaG9vaykge1xuICAgIHRyYW5zaXRpb25Ib29rcy5wdXNoKGhvb2spO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRyYW5zaXRpb25Ib29rcyA9IHRyYW5zaXRpb25Ib29rcy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0gIT09IGhvb2s7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgdmFyIGFsbEtleXMgPSBbXTtcbiAgdmFyIGNoYW5nZUxpc3RlbmVycyA9IFtdO1xuICB2YXIgbG9jYXRpb24gPSB1bmRlZmluZWQ7XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudCgpIHtcbiAgICBpZiAocGVuZGluZ0xvY2F0aW9uICYmIHBlbmRpbmdMb2NhdGlvbi5hY3Rpb24gPT09IF9BY3Rpb25zLlBPUCkge1xuICAgICAgcmV0dXJuIGFsbEtleXMuaW5kZXhPZihwZW5kaW5nTG9jYXRpb24ua2V5KTtcbiAgICB9IGVsc2UgaWYgKGxvY2F0aW9uKSB7XG4gICAgICByZXR1cm4gYWxsS2V5cy5pbmRleE9mKGxvY2F0aW9uLmtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVMb2NhdGlvbihuZXdMb2NhdGlvbikge1xuICAgIHZhciBjdXJyZW50ID0gZ2V0Q3VycmVudCgpO1xuXG4gICAgbG9jYXRpb24gPSBuZXdMb2NhdGlvbjtcblxuICAgIGlmIChsb2NhdGlvbi5hY3Rpb24gPT09IF9BY3Rpb25zLlBVU0gpIHtcbiAgICAgIGFsbEtleXMgPSBbXS5jb25jYXQoYWxsS2V5cy5zbGljZSgwLCBjdXJyZW50ICsgMSksIFtsb2NhdGlvbi5rZXldKTtcbiAgICB9IGVsc2UgaWYgKGxvY2F0aW9uLmFjdGlvbiA9PT0gX0FjdGlvbnMuUkVQTEFDRSkge1xuICAgICAgYWxsS2V5c1tjdXJyZW50XSA9IGxvY2F0aW9uLmtleTtcbiAgICB9XG5cbiAgICBjaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgIGxpc3RlbmVyKGxvY2F0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgIGNoYW5nZUxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgbGlzdGVuZXIobG9jYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgX2xvY2F0aW9uID0gZ2V0Q3VycmVudExvY2F0aW9uKCk7XG4gICAgICBhbGxLZXlzID0gW19sb2NhdGlvbi5rZXldO1xuICAgICAgdXBkYXRlTG9jYXRpb24oX2xvY2F0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgY2hhbmdlTGlzdGVuZXJzID0gY2hhbmdlTGlzdGVuZXJzLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbSAhPT0gbGlzdGVuZXI7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gY29uZmlybVRyYW5zaXRpb25Ubyhsb2NhdGlvbiwgY2FsbGJhY2spIHtcbiAgICBfQXN5bmNVdGlscy5sb29wQXN5bmModHJhbnNpdGlvbkhvb2tzLmxlbmd0aCwgZnVuY3Rpb24gKGluZGV4LCBuZXh0LCBkb25lKSB7XG4gICAgICBfcnVuVHJhbnNpdGlvbkhvb2syWydkZWZhdWx0J10odHJhbnNpdGlvbkhvb2tzW2luZGV4XSwgbG9jYXRpb24sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgZG9uZShyZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIGlmIChnZXRVc2VyQ29uZmlybWF0aW9uICYmIHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgICBnZXRVc2VyQ29uZmlybWF0aW9uKG1lc3NhZ2UsIGZ1bmN0aW9uIChvaykge1xuICAgICAgICAgIGNhbGxiYWNrKG9rICE9PSBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobWVzc2FnZSAhPT0gZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmFyIHBlbmRpbmdMb2NhdGlvbiA9IHVuZGVmaW5lZDtcblxuICBmdW5jdGlvbiB0cmFuc2l0aW9uVG8obmV4dExvY2F0aW9uKSB7XG4gICAgaWYgKGxvY2F0aW9uICYmIGxvY2F0aW9uc0FyZUVxdWFsKGxvY2F0aW9uLCBuZXh0TG9jYXRpb24pKSByZXR1cm47IC8vIE5vdGhpbmcgdG8gZG8uXG5cbiAgICBwZW5kaW5nTG9jYXRpb24gPSBuZXh0TG9jYXRpb247XG5cbiAgICBjb25maXJtVHJhbnNpdGlvblRvKG5leHRMb2NhdGlvbiwgZnVuY3Rpb24gKG9rKSB7XG4gICAgICBpZiAocGVuZGluZ0xvY2F0aW9uICE9PSBuZXh0TG9jYXRpb24pIHJldHVybjsgLy8gVHJhbnNpdGlvbiB3YXMgaW50ZXJydXB0ZWQuXG5cbiAgICAgIGlmIChvaykge1xuICAgICAgICAvLyB0cmVhdCBQVVNIIHRvIGN1cnJlbnQgcGF0aCBsaWtlIFJFUExBQ0UgdG8gYmUgY29uc2lzdGVudCB3aXRoIGJyb3dzZXJzXG4gICAgICAgIGlmIChuZXh0TG9jYXRpb24uYWN0aW9uID09PSBfQWN0aW9ucy5QVVNIKSB7XG4gICAgICAgICAgdmFyIHByZXZQYXRoID0gY3JlYXRlUGF0aChsb2NhdGlvbik7XG4gICAgICAgICAgdmFyIG5leHRQYXRoID0gY3JlYXRlUGF0aChuZXh0TG9jYXRpb24pO1xuXG4gICAgICAgICAgaWYgKG5leHRQYXRoID09PSBwcmV2UGF0aCAmJiBfZGVlcEVxdWFsMlsnZGVmYXVsdCddKGxvY2F0aW9uLnN0YXRlLCBuZXh0TG9jYXRpb24uc3RhdGUpKSBuZXh0TG9jYXRpb24uYWN0aW9uID0gX0FjdGlvbnMuUkVQTEFDRTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaW5pc2hUcmFuc2l0aW9uKG5leHRMb2NhdGlvbikgIT09IGZhbHNlKSB1cGRhdGVMb2NhdGlvbihuZXh0TG9jYXRpb24pO1xuICAgICAgfSBlbHNlIGlmIChsb2NhdGlvbiAmJiBuZXh0TG9jYXRpb24uYWN0aW9uID09PSBfQWN0aW9ucy5QT1ApIHtcbiAgICAgICAgdmFyIHByZXZJbmRleCA9IGFsbEtleXMuaW5kZXhPZihsb2NhdGlvbi5rZXkpO1xuICAgICAgICB2YXIgbmV4dEluZGV4ID0gYWxsS2V5cy5pbmRleE9mKG5leHRMb2NhdGlvbi5rZXkpO1xuXG4gICAgICAgIGlmIChwcmV2SW5kZXggIT09IC0xICYmIG5leHRJbmRleCAhPT0gLTEpIGdvKHByZXZJbmRleCAtIG5leHRJbmRleCk7IC8vIFJlc3RvcmUgdGhlIFVSTC5cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2gobG9jYXRpb24pIHtcbiAgICB0cmFuc2l0aW9uVG8oY3JlYXRlTG9jYXRpb24obG9jYXRpb24sIF9BY3Rpb25zLlBVU0gsIGNyZWF0ZUtleSgpKSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXBsYWNlKGxvY2F0aW9uKSB7XG4gICAgdHJhbnNpdGlvblRvKGNyZWF0ZUxvY2F0aW9uKGxvY2F0aW9uLCBfQWN0aW9ucy5SRVBMQUNFLCBjcmVhdGVLZXkoKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ29CYWNrKCkge1xuICAgIGdvKC0xKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdvRm9yd2FyZCgpIHtcbiAgICBnbygxKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUtleSgpIHtcbiAgICByZXR1cm4gY3JlYXRlUmFuZG9tS2V5KGtleUxlbmd0aCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQYXRoKGxvY2F0aW9uKSB7XG4gICAgaWYgKGxvY2F0aW9uID09IG51bGwgfHwgdHlwZW9mIGxvY2F0aW9uID09PSAnc3RyaW5nJykgcmV0dXJuIGxvY2F0aW9uO1xuXG4gICAgdmFyIHBhdGhuYW1lID0gbG9jYXRpb24ucGF0aG5hbWU7XG4gICAgdmFyIHNlYXJjaCA9IGxvY2F0aW9uLnNlYXJjaDtcbiAgICB2YXIgaGFzaCA9IGxvY2F0aW9uLmhhc2g7XG5cbiAgICB2YXIgcmVzdWx0ID0gcGF0aG5hbWU7XG5cbiAgICBpZiAoc2VhcmNoKSByZXN1bHQgKz0gc2VhcmNoO1xuXG4gICAgaWYgKGhhc2gpIHJlc3VsdCArPSBoYXNoO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUhyZWYobG9jYXRpb24pIHtcbiAgICByZXR1cm4gY3JlYXRlUGF0aChsb2NhdGlvbik7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVMb2NhdGlvbihsb2NhdGlvbiwgYWN0aW9uKSB7XG4gICAgdmFyIGtleSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IGNyZWF0ZUtleSgpIDogYXJndW1lbnRzWzJdO1xuXG4gICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdvYmplY3QnKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gX3dhcm5pbmcyWydkZWZhdWx0J10oZmFsc2UsICdUaGUgc3RhdGUgKDJuZCkgYXJndW1lbnQgdG8gaGlzdG9yeS5jcmVhdGVMb2NhdGlvbiBpcyBkZXByZWNhdGVkOyB1c2UgYSAnICsgJ2xvY2F0aW9uIGRlc2NyaXB0b3IgaW5zdGVhZCcpIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAodHlwZW9mIGxvY2F0aW9uID09PSAnc3RyaW5nJykgbG9jYXRpb24gPSBfUGF0aFV0aWxzLnBhcnNlUGF0aChsb2NhdGlvbik7XG5cbiAgICAgIGxvY2F0aW9uID0gX2V4dGVuZHMoe30sIGxvY2F0aW9uLCB7IHN0YXRlOiBhY3Rpb24gfSk7XG5cbiAgICAgIGFjdGlvbiA9IGtleTtcbiAgICAgIGtleSA9IGFyZ3VtZW50c1szXSB8fCBjcmVhdGVLZXkoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX2NyZWF0ZUxvY2F0aW9uM1snZGVmYXVsdCddKGxvY2F0aW9uLCBhY3Rpb24sIGtleSk7XG4gIH1cblxuICAvLyBkZXByZWNhdGVkXG4gIGZ1bmN0aW9uIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICB1cGRhdGVMb2NhdGlvblN0YXRlKGxvY2F0aW9uLCBzdGF0ZSk7XG4gICAgICB1cGRhdGVMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwZGF0ZUxvY2F0aW9uU3RhdGUoZ2V0Q3VycmVudExvY2F0aW9uKCksIHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVMb2NhdGlvblN0YXRlKGxvY2F0aW9uLCBzdGF0ZSkge1xuICAgIGxvY2F0aW9uLnN0YXRlID0gX2V4dGVuZHMoe30sIGxvY2F0aW9uLnN0YXRlLCBzdGF0ZSk7XG4gICAgc2F2ZVN0YXRlKGxvY2F0aW9uLmtleSwgbG9jYXRpb24uc3RhdGUpO1xuICB9XG5cbiAgLy8gZGVwcmVjYXRlZFxuICBmdW5jdGlvbiByZWdpc3RlclRyYW5zaXRpb25Ib29rKGhvb2spIHtcbiAgICBpZiAodHJhbnNpdGlvbkhvb2tzLmluZGV4T2YoaG9vaykgPT09IC0xKSB0cmFuc2l0aW9uSG9va3MucHVzaChob29rKTtcbiAgfVxuXG4gIC8vIGRlcHJlY2F0ZWRcbiAgZnVuY3Rpb24gdW5yZWdpc3RlclRyYW5zaXRpb25Ib29rKGhvb2spIHtcbiAgICB0cmFuc2l0aW9uSG9va3MgPSB0cmFuc2l0aW9uSG9va3MuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbSAhPT0gaG9vaztcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGRlcHJlY2F0ZWRcbiAgZnVuY3Rpb24gcHVzaFN0YXRlKHN0YXRlLCBwYXRoKSB7XG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykgcGF0aCA9IF9QYXRoVXRpbHMucGFyc2VQYXRoKHBhdGgpO1xuXG4gICAgcHVzaChfZXh0ZW5kcyh7IHN0YXRlOiBzdGF0ZSB9LCBwYXRoKSk7XG4gIH1cblxuICAvLyBkZXByZWNhdGVkXG4gIGZ1bmN0aW9uIHJlcGxhY2VTdGF0ZShzdGF0ZSwgcGF0aCkge1xuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHBhdGggPSBfUGF0aFV0aWxzLnBhcnNlUGF0aChwYXRoKTtcblxuICAgIHJlcGxhY2UoX2V4dGVuZHMoeyBzdGF0ZTogc3RhdGUgfSwgcGF0aCkpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsaXN0ZW5CZWZvcmU6IGxpc3RlbkJlZm9yZSxcbiAgICBsaXN0ZW46IGxpc3RlbixcbiAgICB0cmFuc2l0aW9uVG86IHRyYW5zaXRpb25UbyxcbiAgICBwdXNoOiBwdXNoLFxuICAgIHJlcGxhY2U6IHJlcGxhY2UsXG4gICAgZ286IGdvLFxuICAgIGdvQmFjazogZ29CYWNrLFxuICAgIGdvRm9yd2FyZDogZ29Gb3J3YXJkLFxuICAgIGNyZWF0ZUtleTogY3JlYXRlS2V5LFxuICAgIGNyZWF0ZVBhdGg6IGNyZWF0ZVBhdGgsXG4gICAgY3JlYXRlSHJlZjogY3JlYXRlSHJlZixcbiAgICBjcmVhdGVMb2NhdGlvbjogY3JlYXRlTG9jYXRpb24sXG5cbiAgICBzZXRTdGF0ZTogX2RlcHJlY2F0ZTJbJ2RlZmF1bHQnXShzZXRTdGF0ZSwgJ3NldFN0YXRlIGlzIGRlcHJlY2F0ZWQ7IHVzZSBsb2NhdGlvbi5rZXkgdG8gc2F2ZSBzdGF0ZSBpbnN0ZWFkJyksXG4gICAgcmVnaXN0ZXJUcmFuc2l0aW9uSG9vazogX2RlcHJlY2F0ZTJbJ2RlZmF1bHQnXShyZWdpc3RlclRyYW5zaXRpb25Ib29rLCAncmVnaXN0ZXJUcmFuc2l0aW9uSG9vayBpcyBkZXByZWNhdGVkOyB1c2UgbGlzdGVuQmVmb3JlIGluc3RlYWQnKSxcbiAgICB1bnJlZ2lzdGVyVHJhbnNpdGlvbkhvb2s6IF9kZXByZWNhdGUyWydkZWZhdWx0J10odW5yZWdpc3RlclRyYW5zaXRpb25Ib29rLCAndW5yZWdpc3RlclRyYW5zaXRpb25Ib29rIGlzIGRlcHJlY2F0ZWQ7IHVzZSB0aGUgY2FsbGJhY2sgcmV0dXJuZWQgZnJvbSBsaXN0ZW5CZWZvcmUgaW5zdGVhZCcpLFxuICAgIHB1c2hTdGF0ZTogX2RlcHJlY2F0ZTJbJ2RlZmF1bHQnXShwdXNoU3RhdGUsICdwdXNoU3RhdGUgaXMgZGVwcmVjYXRlZDsgdXNlIHB1c2ggaW5zdGVhZCcpLFxuICAgIHJlcGxhY2VTdGF0ZTogX2RlcHJlY2F0ZTJbJ2RlZmF1bHQnXShyZXBsYWNlU3RhdGUsICdyZXBsYWNlU3RhdGUgaXMgZGVwcmVjYXRlZDsgdXNlIHJlcGxhY2UgaW5zdGVhZCcpXG4gIH07XG59XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGNyZWF0ZUhpc3Rvcnk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF93YXJuaW5nID0gcmVxdWlyZSgnd2FybmluZycpO1xuXG52YXIgX3dhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2FybmluZyk7XG5cbnZhciBfQWN0aW9ucyA9IHJlcXVpcmUoJy4vQWN0aW9ucycpO1xuXG52YXIgX1BhdGhVdGlscyA9IHJlcXVpcmUoJy4vUGF0aFV0aWxzJyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUxvY2F0aW9uKCkge1xuICB2YXIgbG9jYXRpb24gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyAnLycgOiBhcmd1bWVudHNbMF07XG4gIHZhciBhY3Rpb24gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBfQWN0aW9ucy5QT1AgOiBhcmd1bWVudHNbMV07XG4gIHZhciBrZXkgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyBudWxsIDogYXJndW1lbnRzWzJdO1xuXG4gIHZhciBfZm91cnRoQXJnID0gYXJndW1lbnRzLmxlbmd0aCA8PSAzIHx8IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1szXTtcblxuICBpZiAodHlwZW9mIGxvY2F0aW9uID09PSAnc3RyaW5nJykgbG9jYXRpb24gPSBfUGF0aFV0aWxzLnBhcnNlUGF0aChsb2NhdGlvbik7XG5cbiAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdvYmplY3QnKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IF93YXJuaW5nMlsnZGVmYXVsdCddKGZhbHNlLCAnVGhlIHN0YXRlICgybmQpIGFyZ3VtZW50IHRvIGNyZWF0ZUxvY2F0aW9uIGlzIGRlcHJlY2F0ZWQ7IHVzZSBhICcgKyAnbG9jYXRpb24gZGVzY3JpcHRvciBpbnN0ZWFkJykgOiB1bmRlZmluZWQ7XG5cbiAgICBsb2NhdGlvbiA9IF9leHRlbmRzKHt9LCBsb2NhdGlvbiwgeyBzdGF0ZTogYWN0aW9uIH0pO1xuXG4gICAgYWN0aW9uID0ga2V5IHx8IF9BY3Rpb25zLlBPUDtcbiAgICBrZXkgPSBfZm91cnRoQXJnO1xuICB9XG5cbiAgdmFyIHBhdGhuYW1lID0gbG9jYXRpb24ucGF0aG5hbWUgfHwgJy8nO1xuICB2YXIgc2VhcmNoID0gbG9jYXRpb24uc2VhcmNoIHx8ICcnO1xuICB2YXIgaGFzaCA9IGxvY2F0aW9uLmhhc2ggfHwgJyc7XG4gIHZhciBzdGF0ZSA9IGxvY2F0aW9uLnN0YXRlIHx8IG51bGw7XG5cbiAgcmV0dXJuIHtcbiAgICBwYXRobmFtZTogcGF0aG5hbWUsXG4gICAgc2VhcmNoOiBzZWFyY2gsXG4gICAgaGFzaDogaGFzaCxcbiAgICBzdGF0ZTogc3RhdGUsXG4gICAgYWN0aW9uOiBhY3Rpb24sXG4gICAga2V5OiBrZXlcbiAgfTtcbn1cblxuZXhwb3J0c1snZGVmYXVsdCddID0gY3JlYXRlTG9jYXRpb247XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF93YXJuaW5nID0gcmVxdWlyZSgnd2FybmluZycpO1xuXG52YXIgX3dhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2FybmluZyk7XG5cbnZhciBfaW52YXJpYW50ID0gcmVxdWlyZSgnaW52YXJpYW50Jyk7XG5cbnZhciBfaW52YXJpYW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ludmFyaWFudCk7XG5cbnZhciBfUGF0aFV0aWxzID0gcmVxdWlyZSgnLi9QYXRoVXRpbHMnKTtcblxudmFyIF9BY3Rpb25zID0gcmVxdWlyZSgnLi9BY3Rpb25zJyk7XG5cbnZhciBfY3JlYXRlSGlzdG9yeSA9IHJlcXVpcmUoJy4vY3JlYXRlSGlzdG9yeScpO1xuXG52YXIgX2NyZWF0ZUhpc3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlSGlzdG9yeSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0YXRlU3RvcmFnZShlbnRyaWVzKSB7XG4gIHJldHVybiBlbnRyaWVzLmZpbHRlcihmdW5jdGlvbiAoZW50cnkpIHtcbiAgICByZXR1cm4gZW50cnkuc3RhdGU7XG4gIH0pLnJlZHVjZShmdW5jdGlvbiAobWVtbywgZW50cnkpIHtcbiAgICBtZW1vW2VudHJ5LmtleV0gPSBlbnRyeS5zdGF0ZTtcbiAgICByZXR1cm4gbWVtbztcbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNZW1vcnlIaXN0b3J5KCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgb3B0aW9ucyA9IHsgZW50cmllczogb3B0aW9ucyB9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgIG9wdGlvbnMgPSB7IGVudHJpZXM6IFtvcHRpb25zXSB9O1xuICB9XG5cbiAgdmFyIGhpc3RvcnkgPSBfY3JlYXRlSGlzdG9yeTJbJ2RlZmF1bHQnXShfZXh0ZW5kcyh7fSwgb3B0aW9ucywge1xuICAgIGdldEN1cnJlbnRMb2NhdGlvbjogZ2V0Q3VycmVudExvY2F0aW9uLFxuICAgIGZpbmlzaFRyYW5zaXRpb246IGZpbmlzaFRyYW5zaXRpb24sXG4gICAgc2F2ZVN0YXRlOiBzYXZlU3RhdGUsXG4gICAgZ286IGdvXG4gIH0pKTtcblxuICB2YXIgX29wdGlvbnMgPSBvcHRpb25zO1xuICB2YXIgZW50cmllcyA9IF9vcHRpb25zLmVudHJpZXM7XG4gIHZhciBjdXJyZW50ID0gX29wdGlvbnMuY3VycmVudDtcblxuICBpZiAodHlwZW9mIGVudHJpZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgZW50cmllcyA9IFtlbnRyaWVzXTtcbiAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShlbnRyaWVzKSkge1xuICAgIGVudHJpZXMgPSBbJy8nXTtcbiAgfVxuXG4gIGVudHJpZXMgPSBlbnRyaWVzLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICB2YXIga2V5ID0gaGlzdG9yeS5jcmVhdGVLZXkoKTtcblxuICAgIGlmICh0eXBlb2YgZW50cnkgPT09ICdzdHJpbmcnKSByZXR1cm4geyBwYXRobmFtZTogZW50cnksIGtleToga2V5IH07XG5cbiAgICBpZiAodHlwZW9mIGVudHJ5ID09PSAnb2JqZWN0JyAmJiBlbnRyeSkgcmV0dXJuIF9leHRlbmRzKHt9LCBlbnRyeSwgeyBrZXk6IGtleSB9KTtcblxuICAgICFmYWxzZSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBfaW52YXJpYW50MlsnZGVmYXVsdCddKGZhbHNlLCAnVW5hYmxlIHRvIGNyZWF0ZSBoaXN0b3J5IGVudHJ5IGZyb20gJXMnLCBlbnRyeSkgOiBfaW52YXJpYW50MlsnZGVmYXVsdCddKGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgfSk7XG5cbiAgaWYgKGN1cnJlbnQgPT0gbnVsbCkge1xuICAgIGN1cnJlbnQgPSBlbnRyaWVzLmxlbmd0aCAtIDE7XG4gIH0gZWxzZSB7XG4gICAgIShjdXJyZW50ID49IDAgJiYgY3VycmVudCA8IGVudHJpZXMubGVuZ3RoKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBfaW52YXJpYW50MlsnZGVmYXVsdCddKGZhbHNlLCAnQ3VycmVudCBpbmRleCBtdXN0IGJlID49IDAgYW5kIDwgJXMsIHdhcyAlcycsIGVudHJpZXMubGVuZ3RoLCBjdXJyZW50KSA6IF9pbnZhcmlhbnQyWydkZWZhdWx0J10oZmFsc2UpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIHN0b3JhZ2UgPSBjcmVhdGVTdGF0ZVN0b3JhZ2UoZW50cmllcyk7XG5cbiAgZnVuY3Rpb24gc2F2ZVN0YXRlKGtleSwgc3RhdGUpIHtcbiAgICBzdG9yYWdlW2tleV0gPSBzdGF0ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRTdGF0ZShrZXkpIHtcbiAgICByZXR1cm4gc3RvcmFnZVtrZXldO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudExvY2F0aW9uKCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbY3VycmVudF07XG4gICAgdmFyIGJhc2VuYW1lID0gZW50cnkuYmFzZW5hbWU7XG4gICAgdmFyIHBhdGhuYW1lID0gZW50cnkucGF0aG5hbWU7XG4gICAgdmFyIHNlYXJjaCA9IGVudHJ5LnNlYXJjaDtcblxuICAgIHZhciBwYXRoID0gKGJhc2VuYW1lIHx8ICcnKSArIHBhdGhuYW1lICsgKHNlYXJjaCB8fCAnJyk7XG5cbiAgICB2YXIga2V5ID0gdW5kZWZpbmVkLFxuICAgICAgICBzdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICBpZiAoZW50cnkua2V5KSB7XG4gICAgICBrZXkgPSBlbnRyeS5rZXk7XG4gICAgICBzdGF0ZSA9IHJlYWRTdGF0ZShrZXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXkgPSBoaXN0b3J5LmNyZWF0ZUtleSgpO1xuICAgICAgc3RhdGUgPSBudWxsO1xuICAgICAgZW50cnkua2V5ID0ga2V5O1xuICAgIH1cblxuICAgIHZhciBsb2NhdGlvbiA9IF9QYXRoVXRpbHMucGFyc2VQYXRoKHBhdGgpO1xuXG4gICAgcmV0dXJuIGhpc3RvcnkuY3JlYXRlTG9jYXRpb24oX2V4dGVuZHMoe30sIGxvY2F0aW9uLCB7IHN0YXRlOiBzdGF0ZSB9KSwgdW5kZWZpbmVkLCBrZXkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuR28obikge1xuICAgIHZhciBpbmRleCA9IGN1cnJlbnQgKyBuO1xuICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgZW50cmllcy5sZW5ndGg7XG4gIH1cblxuICBmdW5jdGlvbiBnbyhuKSB7XG4gICAgaWYgKG4pIHtcbiAgICAgIGlmICghY2FuR28obikpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IF93YXJuaW5nMlsnZGVmYXVsdCddKGZhbHNlLCAnQ2Fubm90IGdvKCVzKSB0aGVyZSBpcyBub3QgZW5vdWdoIGhpc3RvcnknLCBuKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50ICs9IG47XG5cbiAgICAgIHZhciBjdXJyZW50TG9jYXRpb24gPSBnZXRDdXJyZW50TG9jYXRpb24oKTtcblxuICAgICAgLy8gY2hhbmdlIGFjdGlvbiB0byBQT1BcbiAgICAgIGhpc3RvcnkudHJhbnNpdGlvblRvKF9leHRlbmRzKHt9LCBjdXJyZW50TG9jYXRpb24sIHsgYWN0aW9uOiBfQWN0aW9ucy5QT1AgfSkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmlzaFRyYW5zaXRpb24obG9jYXRpb24pIHtcbiAgICBzd2l0Y2ggKGxvY2F0aW9uLmFjdGlvbikge1xuICAgICAgY2FzZSBfQWN0aW9ucy5QVVNIOlxuICAgICAgICBjdXJyZW50ICs9IDE7XG5cbiAgICAgICAgLy8gaWYgd2UgYXJlIG5vdCBvbiB0aGUgdG9wIG9mIHN0YWNrXG4gICAgICAgIC8vIHJlbW92ZSByZXN0IGFuZCBwdXNoIG5ld1xuICAgICAgICBpZiAoY3VycmVudCA8IGVudHJpZXMubGVuZ3RoKSBlbnRyaWVzLnNwbGljZShjdXJyZW50KTtcblxuICAgICAgICBlbnRyaWVzLnB1c2gobG9jYXRpb24pO1xuICAgICAgICBzYXZlU3RhdGUobG9jYXRpb24ua2V5LCBsb2NhdGlvbi5zdGF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBfQWN0aW9ucy5SRVBMQUNFOlxuICAgICAgICBlbnRyaWVzW2N1cnJlbnRdID0gbG9jYXRpb247XG4gICAgICAgIHNhdmVTdGF0ZShsb2NhdGlvbi5rZXksIGxvY2F0aW9uLnN0YXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGhpc3Rvcnk7XG59XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGNyZWF0ZU1lbW9yeUhpc3Rvcnk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF93YXJuaW5nID0gcmVxdWlyZSgnd2FybmluZycpO1xuXG52YXIgX3dhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2FybmluZyk7XG5cbmZ1bmN0aW9uIGRlcHJlY2F0ZShmbiwgbWVzc2FnZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBfd2FybmluZzJbJ2RlZmF1bHQnXShmYWxzZSwgJ1toaXN0b3J5XSAnICsgbWVzc2FnZSkgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGRlcHJlY2F0ZTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3dhcm5pbmcgPSByZXF1aXJlKCd3YXJuaW5nJyk7XG5cbnZhciBfd2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93YXJuaW5nKTtcblxuZnVuY3Rpb24gcnVuVHJhbnNpdGlvbkhvb2soaG9vaywgbG9jYXRpb24sIGNhbGxiYWNrKSB7XG4gIHZhciByZXN1bHQgPSBob29rKGxvY2F0aW9uLCBjYWxsYmFjayk7XG5cbiAgaWYgKGhvb2subGVuZ3RoIDwgMikge1xuICAgIC8vIEFzc3VtZSB0aGUgaG9vayBydW5zIHN5bmNocm9ub3VzbHkgYW5kIGF1dG9tYXRpY2FsbHlcbiAgICAvLyBjYWxsIHRoZSBjYWxsYmFjayB3aXRoIHRoZSByZXR1cm4gdmFsdWUuXG4gICAgY2FsbGJhY2socmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gX3dhcm5pbmcyWydkZWZhdWx0J10ocmVzdWx0ID09PSB1bmRlZmluZWQsICdZb3Ugc2hvdWxkIG5vdCBcInJldHVyblwiIGluIGEgdHJhbnNpdGlvbiBob29rIHdpdGggYSBjYWxsYmFjayBhcmd1bWVudDsgY2FsbCB0aGUgY2FsbGJhY2sgaW5zdGVhZCcpIDogdW5kZWZpbmVkO1xuICB9XG59XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHJ1blRyYW5zaXRpb25Ib29rO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJ3dhcm5pbmcnKTtcblxudmFyIF93YXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dhcm5pbmcpO1xuXG52YXIgX0V4ZWN1dGlvbkVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9FeGVjdXRpb25FbnZpcm9ubWVudCcpO1xuXG52YXIgX1BhdGhVdGlscyA9IHJlcXVpcmUoJy4vUGF0aFV0aWxzJyk7XG5cbnZhciBfcnVuVHJhbnNpdGlvbkhvb2sgPSByZXF1aXJlKCcuL3J1blRyYW5zaXRpb25Ib29rJyk7XG5cbnZhciBfcnVuVHJhbnNpdGlvbkhvb2syID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcnVuVHJhbnNpdGlvbkhvb2spO1xuXG52YXIgX2RlcHJlY2F0ZSA9IHJlcXVpcmUoJy4vZGVwcmVjYXRlJyk7XG5cbnZhciBfZGVwcmVjYXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlcHJlY2F0ZSk7XG5cbmZ1bmN0aW9uIHVzZUJhc2VuYW1lKGNyZWF0ZUhpc3RvcnkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG4gICAgdmFyIGhpc3RvcnkgPSBjcmVhdGVIaXN0b3J5KG9wdGlvbnMpO1xuXG4gICAgdmFyIGJhc2VuYW1lID0gb3B0aW9ucy5iYXNlbmFtZTtcblxuICAgIHZhciBjaGVja2VkQmFzZUhyZWYgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrQmFzZUhyZWYoKSB7XG4gICAgICBpZiAoY2hlY2tlZEJhc2VIcmVmKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gQXV0b21hdGljYWxseSB1c2UgdGhlIHZhbHVlIG9mIDxiYXNlIGhyZWY+IGluIEhUTUxcbiAgICAgIC8vIGRvY3VtZW50cyBhcyBiYXNlbmFtZSBpZiBpdCdzIG5vdCBleHBsaWNpdGx5IGdpdmVuLlxuICAgICAgaWYgKGJhc2VuYW1lID09IG51bGwgJiYgX0V4ZWN1dGlvbkVudmlyb25tZW50LmNhblVzZURPTSkge1xuICAgICAgICB2YXIgYmFzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdiYXNlJylbMF07XG4gICAgICAgIHZhciBiYXNlSHJlZiA9IGJhc2UgJiYgYmFzZS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblxuICAgICAgICBpZiAoYmFzZUhyZWYgIT0gbnVsbCkge1xuICAgICAgICAgIGJhc2VuYW1lID0gYmFzZUhyZWY7XG5cbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gX3dhcm5pbmcyWydkZWZhdWx0J10oZmFsc2UsICdBdXRvbWF0aWNhbGx5IHNldHRpbmcgYmFzZW5hbWUgdXNpbmcgPGJhc2UgaHJlZj4gaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCAnICsgJ2JlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZS4gVGhlIHNlbWFudGljcyBvZiA8YmFzZSBocmVmPiBhcmUgJyArICdzdWJ0bHkgZGlmZmVyZW50IGZyb20gYmFzZW5hbWUuIFBsZWFzZSBwYXNzIHRoZSBiYXNlbmFtZSBleHBsaWNpdGx5IGluICcgKyAndGhlIG9wdGlvbnMgdG8gY3JlYXRlSGlzdG9yeScpIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNoZWNrZWRCYXNlSHJlZiA9IHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQmFzZW5hbWUobG9jYXRpb24pIHtcbiAgICAgIGNoZWNrQmFzZUhyZWYoKTtcblxuICAgICAgaWYgKGJhc2VuYW1lICYmIGxvY2F0aW9uLmJhc2VuYW1lID09IG51bGwpIHtcbiAgICAgICAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoYmFzZW5hbWUpID09PSAwKSB7XG4gICAgICAgICAgbG9jYXRpb24ucGF0aG5hbWUgPSBsb2NhdGlvbi5wYXRobmFtZS5zdWJzdHJpbmcoYmFzZW5hbWUubGVuZ3RoKTtcbiAgICAgICAgICBsb2NhdGlvbi5iYXNlbmFtZSA9IGJhc2VuYW1lO1xuXG4gICAgICAgICAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lID09PSAnJykgbG9jYXRpb24ucGF0aG5hbWUgPSAnLyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYXRpb24uYmFzZW5hbWUgPSAnJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbG9jYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcGVuZEJhc2VuYW1lKGxvY2F0aW9uKSB7XG4gICAgICBjaGVja0Jhc2VIcmVmKCk7XG5cbiAgICAgIGlmICghYmFzZW5hbWUpIHJldHVybiBsb2NhdGlvbjtcblxuICAgICAgaWYgKHR5cGVvZiBsb2NhdGlvbiA9PT0gJ3N0cmluZycpIGxvY2F0aW9uID0gX1BhdGhVdGlscy5wYXJzZVBhdGgobG9jYXRpb24pO1xuXG4gICAgICB2YXIgcG5hbWUgPSBsb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgIHZhciBub3JtYWxpemVkQmFzZW5hbWUgPSBiYXNlbmFtZS5zbGljZSgtMSkgPT09ICcvJyA/IGJhc2VuYW1lIDogYmFzZW5hbWUgKyAnLyc7XG4gICAgICB2YXIgbm9ybWFsaXplZFBhdGhuYW1lID0gcG5hbWUuY2hhckF0KDApID09PSAnLycgPyBwbmFtZS5zbGljZSgxKSA6IHBuYW1lO1xuICAgICAgdmFyIHBhdGhuYW1lID0gbm9ybWFsaXplZEJhc2VuYW1lICsgbm9ybWFsaXplZFBhdGhuYW1lO1xuXG4gICAgICByZXR1cm4gX2V4dGVuZHMoe30sIGxvY2F0aW9uLCB7XG4gICAgICAgIHBhdGhuYW1lOiBwYXRobmFtZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gT3ZlcnJpZGUgYWxsIHJlYWQgbWV0aG9kcyB3aXRoIGJhc2VuYW1lLWF3YXJlIHZlcnNpb25zLlxuICAgIGZ1bmN0aW9uIGxpc3RlbkJlZm9yZShob29rKSB7XG4gICAgICByZXR1cm4gaGlzdG9yeS5saXN0ZW5CZWZvcmUoZnVuY3Rpb24gKGxvY2F0aW9uLCBjYWxsYmFjaykge1xuICAgICAgICBfcnVuVHJhbnNpdGlvbkhvb2syWydkZWZhdWx0J10oaG9vaywgYWRkQmFzZW5hbWUobG9jYXRpb24pLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0ZW4obGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBoaXN0b3J5Lmxpc3RlbihmdW5jdGlvbiAobG9jYXRpb24pIHtcbiAgICAgICAgbGlzdGVuZXIoYWRkQmFzZW5hbWUobG9jYXRpb24pKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE92ZXJyaWRlIGFsbCB3cml0ZSBtZXRob2RzIHdpdGggYmFzZW5hbWUtYXdhcmUgdmVyc2lvbnMuXG4gICAgZnVuY3Rpb24gcHVzaChsb2NhdGlvbikge1xuICAgICAgaGlzdG9yeS5wdXNoKHByZXBlbmRCYXNlbmFtZShsb2NhdGlvbikpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcGxhY2UobG9jYXRpb24pIHtcbiAgICAgIGhpc3RvcnkucmVwbGFjZShwcmVwZW5kQmFzZW5hbWUobG9jYXRpb24pKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVQYXRoKGxvY2F0aW9uKSB7XG4gICAgICByZXR1cm4gaGlzdG9yeS5jcmVhdGVQYXRoKHByZXBlbmRCYXNlbmFtZShsb2NhdGlvbikpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUhyZWYobG9jYXRpb24pIHtcbiAgICAgIHJldHVybiBoaXN0b3J5LmNyZWF0ZUhyZWYocHJlcGVuZEJhc2VuYW1lKGxvY2F0aW9uKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlTG9jYXRpb24obG9jYXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFkZEJhc2VuYW1lKGhpc3RvcnkuY3JlYXRlTG9jYXRpb24uYXBwbHkoaGlzdG9yeSwgW3ByZXBlbmRCYXNlbmFtZShsb2NhdGlvbildLmNvbmNhdChhcmdzKSkpO1xuICAgIH1cblxuICAgIC8vIGRlcHJlY2F0ZWRcbiAgICBmdW5jdGlvbiBwdXNoU3RhdGUoc3RhdGUsIHBhdGgpIHtcbiAgICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHBhdGggPSBfUGF0aFV0aWxzLnBhcnNlUGF0aChwYXRoKTtcblxuICAgICAgcHVzaChfZXh0ZW5kcyh7IHN0YXRlOiBzdGF0ZSB9LCBwYXRoKSk7XG4gICAgfVxuXG4gICAgLy8gZGVwcmVjYXRlZFxuICAgIGZ1bmN0aW9uIHJlcGxhY2VTdGF0ZShzdGF0ZSwgcGF0aCkge1xuICAgICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykgcGF0aCA9IF9QYXRoVXRpbHMucGFyc2VQYXRoKHBhdGgpO1xuXG4gICAgICByZXBsYWNlKF9leHRlbmRzKHsgc3RhdGU6IHN0YXRlIH0sIHBhdGgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX2V4dGVuZHMoe30sIGhpc3RvcnksIHtcbiAgICAgIGxpc3RlbkJlZm9yZTogbGlzdGVuQmVmb3JlLFxuICAgICAgbGlzdGVuOiBsaXN0ZW4sXG4gICAgICBwdXNoOiBwdXNoLFxuICAgICAgcmVwbGFjZTogcmVwbGFjZSxcbiAgICAgIGNyZWF0ZVBhdGg6IGNyZWF0ZVBhdGgsXG4gICAgICBjcmVhdGVIcmVmOiBjcmVhdGVIcmVmLFxuICAgICAgY3JlYXRlTG9jYXRpb246IGNyZWF0ZUxvY2F0aW9uLFxuXG4gICAgICBwdXNoU3RhdGU6IF9kZXByZWNhdGUyWydkZWZhdWx0J10ocHVzaFN0YXRlLCAncHVzaFN0YXRlIGlzIGRlcHJlY2F0ZWQ7IHVzZSBwdXNoIGluc3RlYWQnKSxcbiAgICAgIHJlcGxhY2VTdGF0ZTogX2RlcHJlY2F0ZTJbJ2RlZmF1bHQnXShyZXBsYWNlU3RhdGUsICdyZXBsYWNlU3RhdGUgaXMgZGVwcmVjYXRlZDsgdXNlIHJlcGxhY2UgaW5zdGVhZCcpXG4gICAgfSk7XG4gIH07XG59XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHVzZUJhc2VuYW1lO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJ3dhcm5pbmcnKTtcblxudmFyIF93YXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dhcm5pbmcpO1xuXG52YXIgX3F1ZXJ5U3RyaW5nID0gcmVxdWlyZSgncXVlcnktc3RyaW5nJyk7XG5cbnZhciBfcnVuVHJhbnNpdGlvbkhvb2sgPSByZXF1aXJlKCcuL3J1blRyYW5zaXRpb25Ib29rJyk7XG5cbnZhciBfcnVuVHJhbnNpdGlvbkhvb2syID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcnVuVHJhbnNpdGlvbkhvb2spO1xuXG52YXIgX1BhdGhVdGlscyA9IHJlcXVpcmUoJy4vUGF0aFV0aWxzJyk7XG5cbnZhciBfZGVwcmVjYXRlID0gcmVxdWlyZSgnLi9kZXByZWNhdGUnKTtcblxudmFyIF9kZXByZWNhdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVwcmVjYXRlKTtcblxudmFyIFNFQVJDSF9CQVNFX0tFWSA9ICckc2VhcmNoQmFzZSc7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTdHJpbmdpZnlRdWVyeShxdWVyeSkge1xuICByZXR1cm4gX3F1ZXJ5U3RyaW5nLnN0cmluZ2lmeShxdWVyeSkucmVwbGFjZSgvJTIwL2csICcrJyk7XG59XG5cbnZhciBkZWZhdWx0UGFyc2VRdWVyeVN0cmluZyA9IF9xdWVyeVN0cmluZy5wYXJzZTtcblxuZnVuY3Rpb24gaXNOZXN0ZWRPYmplY3Qob2JqZWN0KSB7XG4gIGZvciAodmFyIHAgaW4gb2JqZWN0KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHApICYmIHR5cGVvZiBvYmplY3RbcF0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdFtwXSkgJiYgb2JqZWN0W3BdICE9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgfXJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgbmV3IGNyZWF0ZUhpc3RvcnkgZnVuY3Rpb24gdGhhdCBtYXkgYmUgdXNlZCB0byBjcmVhdGVcbiAqIGhpc3Rvcnkgb2JqZWN0cyB0aGF0IGtub3cgaG93IHRvIGhhbmRsZSBVUkwgcXVlcmllcy5cbiAqL1xuZnVuY3Rpb24gdXNlUXVlcmllcyhjcmVhdGVIaXN0b3J5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuICAgIHZhciBoaXN0b3J5ID0gY3JlYXRlSGlzdG9yeShvcHRpb25zKTtcblxuICAgIHZhciBzdHJpbmdpZnlRdWVyeSA9IG9wdGlvbnMuc3RyaW5naWZ5UXVlcnk7XG4gICAgdmFyIHBhcnNlUXVlcnlTdHJpbmcgPSBvcHRpb25zLnBhcnNlUXVlcnlTdHJpbmc7XG5cbiAgICBpZiAodHlwZW9mIHN0cmluZ2lmeVF1ZXJ5ICE9PSAnZnVuY3Rpb24nKSBzdHJpbmdpZnlRdWVyeSA9IGRlZmF1bHRTdHJpbmdpZnlRdWVyeTtcblxuICAgIGlmICh0eXBlb2YgcGFyc2VRdWVyeVN0cmluZyAhPT0gJ2Z1bmN0aW9uJykgcGFyc2VRdWVyeVN0cmluZyA9IGRlZmF1bHRQYXJzZVF1ZXJ5U3RyaW5nO1xuXG4gICAgZnVuY3Rpb24gYWRkUXVlcnkobG9jYXRpb24pIHtcbiAgICAgIGlmIChsb2NhdGlvbi5xdWVyeSA9PSBudWxsKSB7XG4gICAgICAgIHZhciBzZWFyY2ggPSBsb2NhdGlvbi5zZWFyY2g7XG5cbiAgICAgICAgbG9jYXRpb24ucXVlcnkgPSBwYXJzZVF1ZXJ5U3RyaW5nKHNlYXJjaC5zdWJzdHJpbmcoMSkpO1xuICAgICAgICBsb2NhdGlvbltTRUFSQ0hfQkFTRV9LRVldID0geyBzZWFyY2g6IHNlYXJjaCwgc2VhcmNoQmFzZTogJycgfTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ETzogSW5zdGVhZCBvZiBhbGwgdGhlIGJvb2sta2VlcGluZyBoZXJlLCB0aGlzIHNob3VsZCBqdXN0IHN0cmlwIHRoZVxuICAgICAgLy8gc3RyaW5naWZpZWQgcXVlcnkgZnJvbSB0aGUgc2VhcmNoLlxuXG4gICAgICByZXR1cm4gbG9jYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwZW5kUXVlcnkobG9jYXRpb24sIHF1ZXJ5KSB7XG4gICAgICB2YXIgX2V4dGVuZHMyO1xuXG4gICAgICB2YXIgc2VhcmNoQmFzZVNwZWMgPSBsb2NhdGlvbltTRUFSQ0hfQkFTRV9LRVldO1xuICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gcXVlcnkgPyBzdHJpbmdpZnlRdWVyeShxdWVyeSkgOiAnJztcbiAgICAgIGlmICghc2VhcmNoQmFzZVNwZWMgJiYgIXF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGlvbjtcbiAgICAgIH1cblxuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IF93YXJuaW5nMlsnZGVmYXVsdCddKHN0cmluZ2lmeVF1ZXJ5ICE9PSBkZWZhdWx0U3RyaW5naWZ5UXVlcnkgfHwgIWlzTmVzdGVkT2JqZWN0KHF1ZXJ5KSwgJ3VzZVF1ZXJpZXMgZG9lcyBub3Qgc3RyaW5naWZ5IG5lc3RlZCBxdWVyeSBvYmplY3RzIGJ5IGRlZmF1bHQ7ICcgKyAndXNlIGEgY3VzdG9tIHN0cmluZ2lmeVF1ZXJ5IGZ1bmN0aW9uJykgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh0eXBlb2YgbG9jYXRpb24gPT09ICdzdHJpbmcnKSBsb2NhdGlvbiA9IF9QYXRoVXRpbHMucGFyc2VQYXRoKGxvY2F0aW9uKTtcblxuICAgICAgdmFyIHNlYXJjaEJhc2UgPSB1bmRlZmluZWQ7XG4gICAgICBpZiAoc2VhcmNoQmFzZVNwZWMgJiYgbG9jYXRpb24uc2VhcmNoID09PSBzZWFyY2hCYXNlU3BlYy5zZWFyY2gpIHtcbiAgICAgICAgc2VhcmNoQmFzZSA9IHNlYXJjaEJhc2VTcGVjLnNlYXJjaEJhc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWFyY2hCYXNlID0gbG9jYXRpb24uc2VhcmNoIHx8ICcnO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2VhcmNoID0gc2VhcmNoQmFzZTtcbiAgICAgIGlmIChxdWVyeVN0cmluZykge1xuICAgICAgICBzZWFyY2ggKz0gKHNlYXJjaCA/ICcmJyA6ICc/JykgKyBxdWVyeVN0cmluZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBsb2NhdGlvbiwgKF9leHRlbmRzMiA9IHtcbiAgICAgICAgc2VhcmNoOiBzZWFyY2hcbiAgICAgIH0sIF9leHRlbmRzMltTRUFSQ0hfQkFTRV9LRVldID0geyBzZWFyY2g6IHNlYXJjaCwgc2VhcmNoQmFzZTogc2VhcmNoQmFzZSB9LCBfZXh0ZW5kczIpKTtcbiAgICB9XG5cbiAgICAvLyBPdmVycmlkZSBhbGwgcmVhZCBtZXRob2RzIHdpdGggcXVlcnktYXdhcmUgdmVyc2lvbnMuXG4gICAgZnVuY3Rpb24gbGlzdGVuQmVmb3JlKGhvb2spIHtcbiAgICAgIHJldHVybiBoaXN0b3J5Lmxpc3RlbkJlZm9yZShmdW5jdGlvbiAobG9jYXRpb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIF9ydW5UcmFuc2l0aW9uSG9vazJbJ2RlZmF1bHQnXShob29rLCBhZGRRdWVyeShsb2NhdGlvbiksIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGhpc3RvcnkubGlzdGVuKGZ1bmN0aW9uIChsb2NhdGlvbikge1xuICAgICAgICBsaXN0ZW5lcihhZGRRdWVyeShsb2NhdGlvbikpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gT3ZlcnJpZGUgYWxsIHdyaXRlIG1ldGhvZHMgd2l0aCBxdWVyeS1hd2FyZSB2ZXJzaW9ucy5cbiAgICBmdW5jdGlvbiBwdXNoKGxvY2F0aW9uKSB7XG4gICAgICBoaXN0b3J5LnB1c2goYXBwZW5kUXVlcnkobG9jYXRpb24sIGxvY2F0aW9uLnF1ZXJ5KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVwbGFjZShsb2NhdGlvbikge1xuICAgICAgaGlzdG9yeS5yZXBsYWNlKGFwcGVuZFF1ZXJ5KGxvY2F0aW9uLCBsb2NhdGlvbi5xdWVyeSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVBhdGgobG9jYXRpb24sIHF1ZXJ5KSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gX3dhcm5pbmcyWydkZWZhdWx0J10oIXF1ZXJ5LCAndGhlIHF1ZXJ5IGFyZ3VtZW50IHRvIGNyZWF0ZVBhdGggaXMgZGVwcmVjYXRlZDsgdXNlIGEgbG9jYXRpb24gZGVzY3JpcHRvciBpbnN0ZWFkJykgOiB1bmRlZmluZWQ7XG5cbiAgICAgIHJldHVybiBoaXN0b3J5LmNyZWF0ZVBhdGgoYXBwZW5kUXVlcnkobG9jYXRpb24sIHF1ZXJ5IHx8IGxvY2F0aW9uLnF1ZXJ5KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSHJlZihsb2NhdGlvbiwgcXVlcnkpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBfd2FybmluZzJbJ2RlZmF1bHQnXSghcXVlcnksICd0aGUgcXVlcnkgYXJndW1lbnQgdG8gY3JlYXRlSHJlZiBpcyBkZXByZWNhdGVkOyB1c2UgYSBsb2NhdGlvbiBkZXNjcmlwdG9yIGluc3RlYWQnKSA6IHVuZGVmaW5lZDtcblxuICAgICAgcmV0dXJuIGhpc3RvcnkuY3JlYXRlSHJlZihhcHBlbmRRdWVyeShsb2NhdGlvbiwgcXVlcnkgfHwgbG9jYXRpb24ucXVlcnkpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMb2NhdGlvbihsb2NhdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICB2YXIgZnVsbExvY2F0aW9uID0gaGlzdG9yeS5jcmVhdGVMb2NhdGlvbi5hcHBseShoaXN0b3J5LCBbYXBwZW5kUXVlcnkobG9jYXRpb24sIGxvY2F0aW9uLnF1ZXJ5KV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIGlmIChsb2NhdGlvbi5xdWVyeSkge1xuICAgICAgICBmdWxsTG9jYXRpb24ucXVlcnkgPSBsb2NhdGlvbi5xdWVyeTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhZGRRdWVyeShmdWxsTG9jYXRpb24pO1xuICAgIH1cblxuICAgIC8vIGRlcHJlY2F0ZWRcbiAgICBmdW5jdGlvbiBwdXNoU3RhdGUoc3RhdGUsIHBhdGgsIHF1ZXJ5KSB7XG4gICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSBwYXRoID0gX1BhdGhVdGlscy5wYXJzZVBhdGgocGF0aCk7XG5cbiAgICAgIHB1c2goX2V4dGVuZHMoeyBzdGF0ZTogc3RhdGUgfSwgcGF0aCwgeyBxdWVyeTogcXVlcnkgfSkpO1xuICAgIH1cblxuICAgIC8vIGRlcHJlY2F0ZWRcbiAgICBmdW5jdGlvbiByZXBsYWNlU3RhdGUoc3RhdGUsIHBhdGgsIHF1ZXJ5KSB7XG4gICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSBwYXRoID0gX1BhdGhVdGlscy5wYXJzZVBhdGgocGF0aCk7XG5cbiAgICAgIHJlcGxhY2UoX2V4dGVuZHMoeyBzdGF0ZTogc3RhdGUgfSwgcGF0aCwgeyBxdWVyeTogcXVlcnkgfSkpO1xuICAgIH1cblxuICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgaGlzdG9yeSwge1xuICAgICAgbGlzdGVuQmVmb3JlOiBsaXN0ZW5CZWZvcmUsXG4gICAgICBsaXN0ZW46IGxpc3RlbixcbiAgICAgIHB1c2g6IHB1c2gsXG4gICAgICByZXBsYWNlOiByZXBsYWNlLFxuICAgICAgY3JlYXRlUGF0aDogY3JlYXRlUGF0aCxcbiAgICAgIGNyZWF0ZUhyZWY6IGNyZWF0ZUhyZWYsXG4gICAgICBjcmVhdGVMb2NhdGlvbjogY3JlYXRlTG9jYXRpb24sXG5cbiAgICAgIHB1c2hTdGF0ZTogX2RlcHJlY2F0ZTJbJ2RlZmF1bHQnXShwdXNoU3RhdGUsICdwdXNoU3RhdGUgaXMgZGVwcmVjYXRlZDsgdXNlIHB1c2ggaW5zdGVhZCcpLFxuICAgICAgcmVwbGFjZVN0YXRlOiBfZGVwcmVjYXRlMlsnZGVmYXVsdCddKHJlcGxhY2VTdGF0ZSwgJ3JlcGxhY2VTdGF0ZSBpcyBkZXByZWNhdGVkOyB1c2UgcmVwbGFjZSBpbnN0ZWFkJylcbiAgICB9KTtcbiAgfTtcbn1cblxuZXhwb3J0c1snZGVmYXVsdCddID0gdXNlUXVlcmllcztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB3YXJuaW5nID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGFyZ3MpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiA+IDIgPyBsZW4gLSAyIDogMCk7XG4gICAgZm9yICh2YXIga2V5ID0gMjsga2V5IDwgbGVuOyBrZXkrKykge1xuICAgICAgYXJnc1trZXkgLSAyXSA9IGFyZ3VtZW50c1trZXldO1xuICAgIH1cbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgK1xuICAgICAgICAnbWVzc2FnZSBhcmd1bWVudCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdC5sZW5ndGggPCAxMCB8fCAoL15bc1xcV10qJC8pLnRlc3QoZm9ybWF0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHdhcm5pbmcgZm9ybWF0IHNob3VsZCBiZSBhYmxlIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgJyArXG4gICAgICAgICd3YXJuaW5nLiBQbGVhc2UsIHVzZSBhIG1vcmUgZGVzY3JpcHRpdmUgZm9ybWF0IHRoYW46ICcgKyBmb3JtYXRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgICB9KTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgfSBjYXRjaCh4KSB7fVxuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSwgWWFob28hIEluYy5cbiAqIENvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgTGljZW5zZS4gU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUkVBQ1RfU1RBVElDUyA9IHtcbiAgICBjaGlsZENvbnRleHRUeXBlczogdHJ1ZSxcbiAgICBjb250ZXh0VHlwZXM6IHRydWUsXG4gICAgZGVmYXVsdFByb3BzOiB0cnVlLFxuICAgIGRpc3BsYXlOYW1lOiB0cnVlLFxuICAgIGdldERlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICBtaXhpbnM6IHRydWUsXG4gICAgcHJvcFR5cGVzOiB0cnVlLFxuICAgIHR5cGU6IHRydWVcbn07XG5cbnZhciBLTk9XTl9TVEFUSUNTID0ge1xuICAgIG5hbWU6IHRydWUsXG4gICAgbGVuZ3RoOiB0cnVlLFxuICAgIHByb3RvdHlwZTogdHJ1ZSxcbiAgICBjYWxsZXI6IHRydWUsXG4gICAgYXJndW1lbnRzOiB0cnVlLFxuICAgIGFyaXR5OiB0cnVlXG59O1xuXG52YXIgaXNHZXRPd25Qcm9wZXJ0eVN5bWJvbHNBdmFpbGFibGUgPSB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gJ2Z1bmN0aW9uJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIHNvdXJjZUNvbXBvbmVudCwgY3VzdG9tU3RhdGljcykge1xuICAgIGlmICh0eXBlb2Ygc291cmNlQ29tcG9uZW50ICE9PSAnc3RyaW5nJykgeyAvLyBkb24ndCBob2lzdCBvdmVyIHN0cmluZyAoaHRtbCkgY29tcG9uZW50c1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZUNvbXBvbmVudCk7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKGlzR2V0T3duUHJvcGVydHlTeW1ib2xzQXZhaWxhYmxlKSB7XG4gICAgICAgICAgICBrZXlzID0ga2V5cy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2VDb21wb25lbnQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKCFSRUFDVF9TVEFUSUNTW2tleXNbaV1dICYmICFLTk9XTl9TVEFUSUNTW2tleXNbaV1dICYmICghY3VzdG9tU3RhdGljcyB8fCAhY3VzdG9tU3RhdGljc1trZXlzW2ldXSkpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRDb21wb25lbnRba2V5c1tpXV0gPSBzb3VyY2VDb21wb25lbnRba2V5c1tpXV07XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRDb21wb25lbnQ7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvblxuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24gKGZuKSB7XG4gIHZhciBzdHJpbmcgPSB0b1N0cmluZy5jYWxsKGZuKVxuICByZXR1cm4gc3RyaW5nID09PSAnW29iamVjdCBGdW5jdGlvbl0nIHx8XG4gICAgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyAmJiBzdHJpbmcgIT09ICdbb2JqZWN0IFJlZ0V4cF0nKSB8fFxuICAgICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAvLyBJRTggYW5kIGJlbG93XG4gICAgIChmbiA9PT0gd2luZG93LnNldFRpbWVvdXQgfHxcbiAgICAgIGZuID09PSB3aW5kb3cuYWxlcnQgfHxcbiAgICAgIGZuID09PSB3aW5kb3cuY29uZmlybSB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5wcm9tcHQpKVxufTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBnZXRQcm90b3R5cGUgPSBvdmVyQXJnKE9iamVjdC5nZXRQcm90b3R5cGVPZiwgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRQcm90b3R5cGU7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGluZmVyIHRoZSBgT2JqZWN0YCBjb25zdHJ1Y3Rvci4gKi9cbnZhciBvYmplY3RDdG9yU3RyaW5nID0gZnVuY1RvU3RyaW5nLmNhbGwoT2JqZWN0KTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIHRoYXQgaXMsIGFuIG9iamVjdCBjcmVhdGVkIGJ5IHRoZVxuICogYE9iamVjdGAgY29uc3RydWN0b3Igb3Igb25lIHdpdGggYSBgW1tQcm90b3R5cGVdXWAgb2YgYG51bGxgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC44LjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqIH1cbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QobmV3IEZvbyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoeyAneCc6IDAsICd5JzogMCB9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoT2JqZWN0LmNyZWF0ZShudWxsKSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdExpa2UodmFsdWUpIHx8IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpICE9IG9iamVjdFRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcHJvdG8gPSBnZXRQcm90b3R5cGUodmFsdWUpO1xuICBpZiAocHJvdG8gPT09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2YXIgQ3RvciA9IGhhc093blByb3BlcnR5LmNhbGwocHJvdG8sICdjb25zdHJ1Y3RvcicpICYmIHByb3RvLmNvbnN0cnVjdG9yO1xuICByZXR1cm4gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiZcbiAgICBDdG9yIGluc3RhbmNlb2YgQ3RvciAmJiBmdW5jVG9TdHJpbmcuY2FsbChDdG9yKSA9PSBvYmplY3RDdG9yU3RyaW5nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1BsYWluT2JqZWN0O1xuIiwidmFyIHRyaW0gPSByZXF1aXJlKCd0cmltJylcbiAgLCBmb3JFYWNoID0gcmVxdWlyZSgnZm9yLWVhY2gnKVxuICAsIGlzQXJyYXkgPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgaWYgKCFoZWFkZXJzKVxuICAgIHJldHVybiB7fVxuXG4gIHZhciByZXN1bHQgPSB7fVxuXG4gIGZvckVhY2goXG4gICAgICB0cmltKGhlYWRlcnMpLnNwbGl0KCdcXG4nKVxuICAgICwgZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgaW5kZXggPSByb3cuaW5kZXhPZignOicpXG4gICAgICAgICAgLCBrZXkgPSB0cmltKHJvdy5zbGljZSgwLCBpbmRleCkpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAsIHZhbHVlID0gdHJpbShyb3cuc2xpY2UoaW5kZXggKyAxKSlcblxuICAgICAgICBpZiAodHlwZW9mKHJlc3VsdFtrZXldKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShyZXN1bHRba2V5XSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gWyByZXN1bHRba2V5XSwgdmFsdWUgXVxuICAgICAgICB9XG4gICAgICB9XG4gIClcblxuICByZXR1cm4gcmVzdWx0XG59IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cmljdFVyaUVuY29kZSA9IHJlcXVpcmUoJ3N0cmljdC11cmktZW5jb2RlJyk7XG5cbmV4cG9ydHMuZXh0cmFjdCA9IGZ1bmN0aW9uIChzdHIpIHtcblx0cmV0dXJuIHN0ci5zcGxpdCgnPycpWzFdIHx8ICcnO1xufTtcblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChzdHIpIHtcblx0aWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0c3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKC9eKFxcP3wjfCYpLywgJycpO1xuXG5cdGlmICghc3RyKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0cmV0dXJuIHN0ci5zcGxpdCgnJicpLnJlZHVjZShmdW5jdGlvbiAocmV0LCBwYXJhbSkge1xuXHRcdHZhciBwYXJ0cyA9IHBhcmFtLnJlcGxhY2UoL1xcKy9nLCAnICcpLnNwbGl0KCc9Jyk7XG5cdFx0Ly8gRmlyZWZveCAocHJlIDQwKSBkZWNvZGVzIGAlM0RgIHRvIGA9YFxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvcXVlcnktc3RyaW5nL3B1bGwvMzdcblx0XHR2YXIga2V5ID0gcGFydHMuc2hpZnQoKTtcblx0XHR2YXIgdmFsID0gcGFydHMubGVuZ3RoID4gMCA/IHBhcnRzLmpvaW4oJz0nKSA6IHVuZGVmaW5lZDtcblxuXHRcdGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChrZXkpO1xuXG5cdFx0Ly8gbWlzc2luZyBgPWAgc2hvdWxkIGJlIGBudWxsYDpcblx0XHQvLyBodHRwOi8vdzMub3JnL1RSLzIwMTIvV0QtdXJsLTIwMTIwNTI0LyNjb2xsZWN0LXVybC1wYXJhbWV0ZXJzXG5cdFx0dmFsID0gdmFsID09PSB1bmRlZmluZWQgPyBudWxsIDogZGVjb2RlVVJJQ29tcG9uZW50KHZhbCk7XG5cblx0XHRpZiAoIXJldC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRyZXRba2V5XSA9IHZhbDtcblx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmV0W2tleV0pKSB7XG5cdFx0XHRyZXRba2V5XS5wdXNoKHZhbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldFtrZXldID0gW3JldFtrZXldLCB2YWxdO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sIHt9KTtcbn07XG5cbmV4cG9ydHMuc3RyaW5naWZ5ID0gZnVuY3Rpb24gKG9iaikge1xuXHRyZXR1cm4gb2JqID8gT2JqZWN0LmtleXMob2JqKS5zb3J0KCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcblx0XHR2YXIgdmFsID0gb2JqW2tleV07XG5cblx0XHRpZiAodmFsID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRpZiAodmFsID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4ga2V5O1xuXHRcdH1cblxuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcblx0XHRcdHJldHVybiB2YWwuc2xpY2UoKS5zb3J0KCkubWFwKGZ1bmN0aW9uICh2YWwyKSB7XG5cdFx0XHRcdHJldHVybiBzdHJpY3RVcmlFbmNvZGUoa2V5KSArICc9JyArIHN0cmljdFVyaUVuY29kZSh2YWwyKTtcblx0XHRcdH0pLmpvaW4oJyYnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gc3RyaWN0VXJpRW5jb2RlKGtleSkgKyAnPScgKyBzdHJpY3RVcmlFbmNvZGUodmFsKTtcblx0fSkuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG5cdFx0cmV0dXJuIHgubGVuZ3RoID4gMDtcblx0fSkuam9pbignJicpIDogJyc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB1bmRlZmluZWQ7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3N0b3JlU2hhcGUgPSByZXF1aXJlKCcuLi91dGlscy9zdG9yZVNoYXBlJyk7XG5cbnZhciBfc3RvcmVTaGFwZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdG9yZVNoYXBlKTtcblxudmFyIF93YXJuaW5nID0gcmVxdWlyZSgnLi4vdXRpbHMvd2FybmluZycpO1xuXG52YXIgX3dhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2FybmluZyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBkaWRXYXJuQWJvdXRSZWNlaXZpbmdTdG9yZSA9IGZhbHNlO1xuZnVuY3Rpb24gd2FybkFib3V0UmVjZWl2aW5nU3RvcmUoKSB7XG4gIGlmIChkaWRXYXJuQWJvdXRSZWNlaXZpbmdTdG9yZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBkaWRXYXJuQWJvdXRSZWNlaXZpbmdTdG9yZSA9IHRydWU7XG5cbiAgKDAsIF93YXJuaW5nMltcImRlZmF1bHRcIl0pKCc8UHJvdmlkZXI+IGRvZXMgbm90IHN1cHBvcnQgY2hhbmdpbmcgYHN0b3JlYCBvbiB0aGUgZmx5LiAnICsgJ0l0IGlzIG1vc3QgbGlrZWx5IHRoYXQgeW91IHNlZSB0aGlzIGVycm9yIGJlY2F1c2UgeW91IHVwZGF0ZWQgdG8gJyArICdSZWR1eCAyLnggYW5kIFJlYWN0IFJlZHV4IDIueCB3aGljaCBubyBsb25nZXIgaG90IHJlbG9hZCByZWR1Y2VycyAnICsgJ2F1dG9tYXRpY2FsbHkuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVhY3Rqcy9yZWFjdC1yZWR1eC9yZWxlYXNlcy8nICsgJ3RhZy92Mi4wLjAgZm9yIHRoZSBtaWdyYXRpb24gaW5zdHJ1Y3Rpb25zLicpO1xufVxuXG52YXIgUHJvdmlkZXIgPSBmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICBfaW5oZXJpdHMoUHJvdmlkZXIsIF9Db21wb25lbnQpO1xuXG4gIFByb3ZpZGVyLnByb3RvdHlwZS5nZXRDaGlsZENvbnRleHQgPSBmdW5jdGlvbiBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgcmV0dXJuIHsgc3RvcmU6IHRoaXMuc3RvcmUgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBQcm92aWRlcihwcm9wcywgY29udGV4dCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQcm92aWRlcik7XG5cbiAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfQ29tcG9uZW50LmNhbGwodGhpcywgcHJvcHMsIGNvbnRleHQpKTtcblxuICAgIF90aGlzLnN0b3JlID0gcHJvcHMuc3RvcmU7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgUHJvdmlkZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnByb3BzLmNoaWxkcmVuO1xuXG4gICAgcmV0dXJuIF9yZWFjdC5DaGlsZHJlbi5vbmx5KGNoaWxkcmVuKTtcbiAgfTtcblxuICByZXR1cm4gUHJvdmlkZXI7XG59KF9yZWFjdC5Db21wb25lbnQpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFByb3ZpZGVyO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBQcm92aWRlci5wcm90b3R5cGUuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyA9IGZ1bmN0aW9uIChuZXh0UHJvcHMpIHtcbiAgICB2YXIgc3RvcmUgPSB0aGlzLnN0b3JlO1xuICAgIHZhciBuZXh0U3RvcmUgPSBuZXh0UHJvcHMuc3RvcmU7XG5cbiAgICBpZiAoc3RvcmUgIT09IG5leHRTdG9yZSkge1xuICAgICAgd2FybkFib3V0UmVjZWl2aW5nU3RvcmUoKTtcbiAgICB9XG4gIH07XG59XG5cblByb3ZpZGVyLnByb3BUeXBlcyA9IHtcbiAgc3RvcmU6IF9zdG9yZVNoYXBlMltcImRlZmF1bHRcIl0uaXNSZXF1aXJlZCxcbiAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkXG59O1xuUHJvdmlkZXIuY2hpbGRDb250ZXh0VHlwZXMgPSB7XG4gIHN0b3JlOiBfc3RvcmVTaGFwZTJbXCJkZWZhdWx0XCJdLmlzUmVxdWlyZWRcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBjb25uZWN0O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9zdG9yZVNoYXBlID0gcmVxdWlyZSgnLi4vdXRpbHMvc3RvcmVTaGFwZScpO1xuXG52YXIgX3N0b3JlU2hhcGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RvcmVTaGFwZSk7XG5cbnZhciBfc2hhbGxvd0VxdWFsID0gcmVxdWlyZSgnLi4vdXRpbHMvc2hhbGxvd0VxdWFsJyk7XG5cbnZhciBfc2hhbGxvd0VxdWFsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NoYWxsb3dFcXVhbCk7XG5cbnZhciBfd3JhcEFjdGlvbkNyZWF0b3JzID0gcmVxdWlyZSgnLi4vdXRpbHMvd3JhcEFjdGlvbkNyZWF0b3JzJyk7XG5cbnZhciBfd3JhcEFjdGlvbkNyZWF0b3JzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dyYXBBY3Rpb25DcmVhdG9ycyk7XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJy4uL3V0aWxzL3dhcm5pbmcnKTtcblxudmFyIF93YXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dhcm5pbmcpO1xuXG52YXIgX2lzUGxhaW5PYmplY3QgPSByZXF1aXJlKCdsb2Rhc2gvaXNQbGFpbk9iamVjdCcpO1xuXG52YXIgX2lzUGxhaW5PYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQbGFpbk9iamVjdCk7XG5cbnZhciBfaG9pc3ROb25SZWFjdFN0YXRpY3MgPSByZXF1aXJlKCdob2lzdC1ub24tcmVhY3Qtc3RhdGljcycpO1xuXG52YXIgX2hvaXN0Tm9uUmVhY3RTdGF0aWNzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hvaXN0Tm9uUmVhY3RTdGF0aWNzKTtcblxudmFyIF9pbnZhcmlhbnQgPSByZXF1aXJlKCdpbnZhcmlhbnQnKTtcblxudmFyIF9pbnZhcmlhbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW52YXJpYW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIGRlZmF1bHRNYXBTdGF0ZVRvUHJvcHMgPSBmdW5jdGlvbiBkZWZhdWx0TWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG4gIHJldHVybiB7fTtcbn07IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbnZhciBkZWZhdWx0TWFwRGlzcGF0Y2hUb1Byb3BzID0gZnVuY3Rpb24gZGVmYXVsdE1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuICByZXR1cm4geyBkaXNwYXRjaDogZGlzcGF0Y2ggfTtcbn07XG52YXIgZGVmYXVsdE1lcmdlUHJvcHMgPSBmdW5jdGlvbiBkZWZhdWx0TWVyZ2VQcm9wcyhzdGF0ZVByb3BzLCBkaXNwYXRjaFByb3BzLCBwYXJlbnRQcm9wcykge1xuICByZXR1cm4gX2V4dGVuZHMoe30sIHBhcmVudFByb3BzLCBzdGF0ZVByb3BzLCBkaXNwYXRjaFByb3BzKTtcbn07XG5cbmZ1bmN0aW9uIGdldERpc3BsYXlOYW1lKFdyYXBwZWRDb21wb25lbnQpIHtcbiAgcmV0dXJuIFdyYXBwZWRDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgV3JhcHBlZENvbXBvbmVudC5uYW1lIHx8ICdDb21wb25lbnQnO1xufVxuXG52YXIgZXJyb3JPYmplY3QgPSB7IHZhbHVlOiBudWxsIH07XG5mdW5jdGlvbiB0cnlDYXRjaChmbiwgY3R4KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KGN0eCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvck9iamVjdC52YWx1ZSA9IGU7XG4gICAgcmV0dXJuIGVycm9yT2JqZWN0O1xuICB9XG59XG5cbi8vIEhlbHBzIHRyYWNrIGhvdCByZWxvYWRpbmcuXG52YXIgbmV4dFZlcnNpb24gPSAwO1xuXG5mdW5jdGlvbiBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzLCBtZXJnZVByb3BzKSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAzIHx8IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbM107XG5cbiAgdmFyIHNob3VsZFN1YnNjcmliZSA9IEJvb2xlYW4obWFwU3RhdGVUb1Byb3BzKTtcbiAgdmFyIG1hcFN0YXRlID0gbWFwU3RhdGVUb1Byb3BzIHx8IGRlZmF1bHRNYXBTdGF0ZVRvUHJvcHM7XG5cbiAgdmFyIG1hcERpc3BhdGNoID0gdW5kZWZpbmVkO1xuICBpZiAodHlwZW9mIG1hcERpc3BhdGNoVG9Qcm9wcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG1hcERpc3BhdGNoID0gbWFwRGlzcGF0Y2hUb1Byb3BzO1xuICB9IGVsc2UgaWYgKCFtYXBEaXNwYXRjaFRvUHJvcHMpIHtcbiAgICBtYXBEaXNwYXRjaCA9IGRlZmF1bHRNYXBEaXNwYXRjaFRvUHJvcHM7XG4gIH0gZWxzZSB7XG4gICAgbWFwRGlzcGF0Y2ggPSAoMCwgX3dyYXBBY3Rpb25DcmVhdG9yczJbXCJkZWZhdWx0XCJdKShtYXBEaXNwYXRjaFRvUHJvcHMpO1xuICB9XG5cbiAgdmFyIGZpbmFsTWVyZ2VQcm9wcyA9IG1lcmdlUHJvcHMgfHwgZGVmYXVsdE1lcmdlUHJvcHM7XG4gIHZhciBfb3B0aW9ucyRwdXJlID0gb3B0aW9ucy5wdXJlO1xuICB2YXIgcHVyZSA9IF9vcHRpb25zJHB1cmUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBfb3B0aW9ucyRwdXJlO1xuICB2YXIgX29wdGlvbnMkd2l0aFJlZiA9IG9wdGlvbnMud2l0aFJlZjtcbiAgdmFyIHdpdGhSZWYgPSBfb3B0aW9ucyR3aXRoUmVmID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9vcHRpb25zJHdpdGhSZWY7XG5cbiAgdmFyIGNoZWNrTWVyZ2VkRXF1YWxzID0gcHVyZSAmJiBmaW5hbE1lcmdlUHJvcHMgIT09IGRlZmF1bHRNZXJnZVByb3BzO1xuXG4gIC8vIEhlbHBzIHRyYWNrIGhvdCByZWxvYWRpbmcuXG4gIHZhciB2ZXJzaW9uID0gbmV4dFZlcnNpb24rKztcblxuICByZXR1cm4gZnVuY3Rpb24gd3JhcFdpdGhDb25uZWN0KFdyYXBwZWRDb21wb25lbnQpIHtcbiAgICB2YXIgY29ubmVjdERpc3BsYXlOYW1lID0gJ0Nvbm5lY3QoJyArIGdldERpc3BsYXlOYW1lKFdyYXBwZWRDb21wb25lbnQpICsgJyknO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tTdGF0ZVNoYXBlKHByb3BzLCBtZXRob2ROYW1lKSB7XG4gICAgICBpZiAoISgwLCBfaXNQbGFpbk9iamVjdDJbXCJkZWZhdWx0XCJdKShwcm9wcykpIHtcbiAgICAgICAgKDAsIF93YXJuaW5nMltcImRlZmF1bHRcIl0pKG1ldGhvZE5hbWUgKyAnKCkgaW4gJyArIGNvbm5lY3REaXNwbGF5TmFtZSArICcgbXVzdCByZXR1cm4gYSBwbGFpbiBvYmplY3QuICcgKyAoJ0luc3RlYWQgcmVjZWl2ZWQgJyArIHByb3BzICsgJy4nKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcHV0ZU1lcmdlZFByb3BzKHN0YXRlUHJvcHMsIGRpc3BhdGNoUHJvcHMsIHBhcmVudFByb3BzKSB7XG4gICAgICB2YXIgbWVyZ2VkUHJvcHMgPSBmaW5hbE1lcmdlUHJvcHMoc3RhdGVQcm9wcywgZGlzcGF0Y2hQcm9wcywgcGFyZW50UHJvcHMpO1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgY2hlY2tTdGF0ZVNoYXBlKG1lcmdlZFByb3BzLCAnbWVyZ2VQcm9wcycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1lcmdlZFByb3BzO1xuICAgIH1cblxuICAgIHZhciBDb25uZWN0ID0gZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgICAgIF9pbmhlcml0cyhDb25uZWN0LCBfQ29tcG9uZW50KTtcblxuICAgICAgQ29ubmVjdC5wcm90b3R5cGUuc2hvdWxkQ29tcG9uZW50VXBkYXRlID0gZnVuY3Rpb24gc2hvdWxkQ29tcG9uZW50VXBkYXRlKCkge1xuICAgICAgICByZXR1cm4gIXB1cmUgfHwgdGhpcy5oYXZlT3duUHJvcHNDaGFuZ2VkIHx8IHRoaXMuaGFzU3RvcmVTdGF0ZUNoYW5nZWQ7XG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBDb25uZWN0KHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb25uZWN0KTtcblxuICAgICAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfQ29tcG9uZW50LmNhbGwodGhpcywgcHJvcHMsIGNvbnRleHQpKTtcblxuICAgICAgICBfdGhpcy52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgX3RoaXMuc3RvcmUgPSBwcm9wcy5zdG9yZSB8fCBjb250ZXh0LnN0b3JlO1xuXG4gICAgICAgICgwLCBfaW52YXJpYW50MltcImRlZmF1bHRcIl0pKF90aGlzLnN0b3JlLCAnQ291bGQgbm90IGZpbmQgXCJzdG9yZVwiIGluIGVpdGhlciB0aGUgY29udGV4dCBvciAnICsgKCdwcm9wcyBvZiBcIicgKyBjb25uZWN0RGlzcGxheU5hbWUgKyAnXCIuICcpICsgJ0VpdGhlciB3cmFwIHRoZSByb290IGNvbXBvbmVudCBpbiBhIDxQcm92aWRlcj4sICcgKyAoJ29yIGV4cGxpY2l0bHkgcGFzcyBcInN0b3JlXCIgYXMgYSBwcm9wIHRvIFwiJyArIGNvbm5lY3REaXNwbGF5TmFtZSArICdcIi4nKSk7XG5cbiAgICAgICAgdmFyIHN0b3JlU3RhdGUgPSBfdGhpcy5zdG9yZS5nZXRTdGF0ZSgpO1xuICAgICAgICBfdGhpcy5zdGF0ZSA9IHsgc3RvcmVTdGF0ZTogc3RvcmVTdGF0ZSB9O1xuICAgICAgICBfdGhpcy5jbGVhckNhY2hlKCk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgIH1cblxuICAgICAgQ29ubmVjdC5wcm90b3R5cGUuY29tcHV0ZVN0YXRlUHJvcHMgPSBmdW5jdGlvbiBjb21wdXRlU3RhdGVQcm9wcyhzdG9yZSwgcHJvcHMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpbmFsTWFwU3RhdGVUb1Byb3BzKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJlRmluYWxNYXBTdGF0ZShzdG9yZSwgcHJvcHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgICAgdmFyIHN0YXRlUHJvcHMgPSB0aGlzLmRvU3RhdGVQcm9wc0RlcGVuZE9uT3duUHJvcHMgPyB0aGlzLmZpbmFsTWFwU3RhdGVUb1Byb3BzKHN0YXRlLCBwcm9wcykgOiB0aGlzLmZpbmFsTWFwU3RhdGVUb1Byb3BzKHN0YXRlKTtcblxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIGNoZWNrU3RhdGVTaGFwZShzdGF0ZVByb3BzLCAnbWFwU3RhdGVUb1Byb3BzJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXRlUHJvcHM7XG4gICAgICB9O1xuXG4gICAgICBDb25uZWN0LnByb3RvdHlwZS5jb25maWd1cmVGaW5hbE1hcFN0YXRlID0gZnVuY3Rpb24gY29uZmlndXJlRmluYWxNYXBTdGF0ZShzdG9yZSwgcHJvcHMpIHtcbiAgICAgICAgdmFyIG1hcHBlZFN0YXRlID0gbWFwU3RhdGUoc3RvcmUuZ2V0U3RhdGUoKSwgcHJvcHMpO1xuICAgICAgICB2YXIgaXNGYWN0b3J5ID0gdHlwZW9mIG1hcHBlZFN0YXRlID09PSAnZnVuY3Rpb24nO1xuXG4gICAgICAgIHRoaXMuZmluYWxNYXBTdGF0ZVRvUHJvcHMgPSBpc0ZhY3RvcnkgPyBtYXBwZWRTdGF0ZSA6IG1hcFN0YXRlO1xuICAgICAgICB0aGlzLmRvU3RhdGVQcm9wc0RlcGVuZE9uT3duUHJvcHMgPSB0aGlzLmZpbmFsTWFwU3RhdGVUb1Byb3BzLmxlbmd0aCAhPT0gMTtcblxuICAgICAgICBpZiAoaXNGYWN0b3J5KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29tcHV0ZVN0YXRlUHJvcHMoc3RvcmUsIHByb3BzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgY2hlY2tTdGF0ZVNoYXBlKG1hcHBlZFN0YXRlLCAnbWFwU3RhdGVUb1Byb3BzJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcHBlZFN0YXRlO1xuICAgICAgfTtcblxuICAgICAgQ29ubmVjdC5wcm90b3R5cGUuY29tcHV0ZURpc3BhdGNoUHJvcHMgPSBmdW5jdGlvbiBjb21wdXRlRGlzcGF0Y2hQcm9wcyhzdG9yZSwgcHJvcHMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpbmFsTWFwRGlzcGF0Y2hUb1Byb3BzKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJlRmluYWxNYXBEaXNwYXRjaChzdG9yZSwgcHJvcHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRpc3BhdGNoID0gc3RvcmUuZGlzcGF0Y2g7XG5cbiAgICAgICAgdmFyIGRpc3BhdGNoUHJvcHMgPSB0aGlzLmRvRGlzcGF0Y2hQcm9wc0RlcGVuZE9uT3duUHJvcHMgPyB0aGlzLmZpbmFsTWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoLCBwcm9wcykgOiB0aGlzLmZpbmFsTWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKTtcblxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIGNoZWNrU3RhdGVTaGFwZShkaXNwYXRjaFByb3BzLCAnbWFwRGlzcGF0Y2hUb1Byb3BzJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoUHJvcHM7XG4gICAgICB9O1xuXG4gICAgICBDb25uZWN0LnByb3RvdHlwZS5jb25maWd1cmVGaW5hbE1hcERpc3BhdGNoID0gZnVuY3Rpb24gY29uZmlndXJlRmluYWxNYXBEaXNwYXRjaChzdG9yZSwgcHJvcHMpIHtcbiAgICAgICAgdmFyIG1hcHBlZERpc3BhdGNoID0gbWFwRGlzcGF0Y2goc3RvcmUuZGlzcGF0Y2gsIHByb3BzKTtcbiAgICAgICAgdmFyIGlzRmFjdG9yeSA9IHR5cGVvZiBtYXBwZWREaXNwYXRjaCA9PT0gJ2Z1bmN0aW9uJztcblxuICAgICAgICB0aGlzLmZpbmFsTWFwRGlzcGF0Y2hUb1Byb3BzID0gaXNGYWN0b3J5ID8gbWFwcGVkRGlzcGF0Y2ggOiBtYXBEaXNwYXRjaDtcbiAgICAgICAgdGhpcy5kb0Rpc3BhdGNoUHJvcHNEZXBlbmRPbk93blByb3BzID0gdGhpcy5maW5hbE1hcERpc3BhdGNoVG9Qcm9wcy5sZW5ndGggIT09IDE7XG5cbiAgICAgICAgaWYgKGlzRmFjdG9yeSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbXB1dGVEaXNwYXRjaFByb3BzKHN0b3JlLCBwcm9wcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIGNoZWNrU3RhdGVTaGFwZShtYXBwZWREaXNwYXRjaCwgJ21hcERpc3BhdGNoVG9Qcm9wcycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXBwZWREaXNwYXRjaDtcbiAgICAgIH07XG5cbiAgICAgIENvbm5lY3QucHJvdG90eXBlLnVwZGF0ZVN0YXRlUHJvcHNJZk5lZWRlZCA9IGZ1bmN0aW9uIHVwZGF0ZVN0YXRlUHJvcHNJZk5lZWRlZCgpIHtcbiAgICAgICAgdmFyIG5leHRTdGF0ZVByb3BzID0gdGhpcy5jb21wdXRlU3RhdGVQcm9wcyh0aGlzLnN0b3JlLCB0aGlzLnByb3BzKTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVQcm9wcyAmJiAoMCwgX3NoYWxsb3dFcXVhbDJbXCJkZWZhdWx0XCJdKShuZXh0U3RhdGVQcm9wcywgdGhpcy5zdGF0ZVByb3BzKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhdGVQcm9wcyA9IG5leHRTdGF0ZVByb3BzO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgIENvbm5lY3QucHJvdG90eXBlLnVwZGF0ZURpc3BhdGNoUHJvcHNJZk5lZWRlZCA9IGZ1bmN0aW9uIHVwZGF0ZURpc3BhdGNoUHJvcHNJZk5lZWRlZCgpIHtcbiAgICAgICAgdmFyIG5leHREaXNwYXRjaFByb3BzID0gdGhpcy5jb21wdXRlRGlzcGF0Y2hQcm9wcyh0aGlzLnN0b3JlLCB0aGlzLnByb3BzKTtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGF0Y2hQcm9wcyAmJiAoMCwgX3NoYWxsb3dFcXVhbDJbXCJkZWZhdWx0XCJdKShuZXh0RGlzcGF0Y2hQcm9wcywgdGhpcy5kaXNwYXRjaFByb3BzKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hQcm9wcyA9IG5leHREaXNwYXRjaFByb3BzO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgIENvbm5lY3QucHJvdG90eXBlLnVwZGF0ZU1lcmdlZFByb3BzSWZOZWVkZWQgPSBmdW5jdGlvbiB1cGRhdGVNZXJnZWRQcm9wc0lmTmVlZGVkKCkge1xuICAgICAgICB2YXIgbmV4dE1lcmdlZFByb3BzID0gY29tcHV0ZU1lcmdlZFByb3BzKHRoaXMuc3RhdGVQcm9wcywgdGhpcy5kaXNwYXRjaFByb3BzLCB0aGlzLnByb3BzKTtcbiAgICAgICAgaWYgKHRoaXMubWVyZ2VkUHJvcHMgJiYgY2hlY2tNZXJnZWRFcXVhbHMgJiYgKDAsIF9zaGFsbG93RXF1YWwyW1wiZGVmYXVsdFwiXSkobmV4dE1lcmdlZFByb3BzLCB0aGlzLm1lcmdlZFByb3BzKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWVyZ2VkUHJvcHMgPSBuZXh0TWVyZ2VkUHJvcHM7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcblxuICAgICAgQ29ubmVjdC5wcm90b3R5cGUuaXNTdWJzY3JpYmVkID0gZnVuY3Rpb24gaXNTdWJzY3JpYmVkKCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaXMudW5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbic7XG4gICAgICB9O1xuXG4gICAgICBDb25uZWN0LnByb3RvdHlwZS50cnlTdWJzY3JpYmUgPSBmdW5jdGlvbiB0cnlTdWJzY3JpYmUoKSB7XG4gICAgICAgIGlmIChzaG91bGRTdWJzY3JpYmUgJiYgIXRoaXMudW5zdWJzY3JpYmUpIHtcbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlID0gdGhpcy5zdG9yZS5zdWJzY3JpYmUodGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgQ29ubmVjdC5wcm90b3R5cGUudHJ5VW5zdWJzY3JpYmUgPSBmdW5jdGlvbiB0cnlVbnN1YnNjcmliZSgpIHtcbiAgICAgICAgaWYgKHRoaXMudW5zdWJzY3JpYmUpIHtcbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgdGhpcy51bnN1YnNjcmliZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIENvbm5lY3QucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50ID0gZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMudHJ5U3Vic2NyaWJlKCk7XG4gICAgICB9O1xuXG4gICAgICBDb25uZWN0LnByb3RvdHlwZS5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzID0gZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgaWYgKCFwdXJlIHx8ICEoMCwgX3NoYWxsb3dFcXVhbDJbXCJkZWZhdWx0XCJdKShuZXh0UHJvcHMsIHRoaXMucHJvcHMpKSB7XG4gICAgICAgICAgdGhpcy5oYXZlT3duUHJvcHNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgQ29ubmVjdC5wcm90b3R5cGUuY29tcG9uZW50V2lsbFVubW91bnQgPSBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy50cnlVbnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLmNsZWFyQ2FjaGUoKTtcbiAgICAgIH07XG5cbiAgICAgIENvbm5lY3QucHJvdG90eXBlLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiBjbGVhckNhY2hlKCkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoUHJvcHMgPSBudWxsO1xuICAgICAgICB0aGlzLnN0YXRlUHJvcHMgPSBudWxsO1xuICAgICAgICB0aGlzLm1lcmdlZFByb3BzID0gbnVsbDtcbiAgICAgICAgdGhpcy5oYXZlT3duUHJvcHNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oYXNTdG9yZVN0YXRlQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuaGF2ZVN0YXRlUHJvcHNCZWVuUHJlY2FsY3VsYXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXRlUHJvcHNQcmVjYWxjdWxhdGlvbkVycm9yID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZW5kZXJlZEVsZW1lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmZpbmFsTWFwRGlzcGF0Y2hUb1Byb3BzID0gbnVsbDtcbiAgICAgICAgdGhpcy5maW5hbE1hcFN0YXRlVG9Qcm9wcyA9IG51bGw7XG4gICAgICB9O1xuXG4gICAgICBDb25uZWN0LnByb3RvdHlwZS5oYW5kbGVDaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoKSB7XG4gICAgICAgIGlmICghdGhpcy51bnN1YnNjcmliZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdG9yZVN0YXRlID0gdGhpcy5zdG9yZS5nZXRTdGF0ZSgpO1xuICAgICAgICB2YXIgcHJldlN0b3JlU3RhdGUgPSB0aGlzLnN0YXRlLnN0b3JlU3RhdGU7XG4gICAgICAgIGlmIChwdXJlICYmIHByZXZTdG9yZVN0YXRlID09PSBzdG9yZVN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHB1cmUgJiYgIXRoaXMuZG9TdGF0ZVByb3BzRGVwZW5kT25Pd25Qcm9wcykge1xuICAgICAgICAgIHZhciBoYXZlU3RhdGVQcm9wc0NoYW5nZWQgPSB0cnlDYXRjaCh0aGlzLnVwZGF0ZVN0YXRlUHJvcHNJZk5lZWRlZCwgdGhpcyk7XG4gICAgICAgICAgaWYgKCFoYXZlU3RhdGVQcm9wc0NoYW5nZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGhhdmVTdGF0ZVByb3BzQ2hhbmdlZCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVQcm9wc1ByZWNhbGN1bGF0aW9uRXJyb3IgPSBlcnJvck9iamVjdC52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5oYXZlU3RhdGVQcm9wc0JlZW5QcmVjYWxjdWxhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGFzU3RvcmVTdGF0ZUNoYW5nZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgc3RvcmVTdGF0ZTogc3RvcmVTdGF0ZSB9KTtcbiAgICAgIH07XG5cbiAgICAgIENvbm5lY3QucHJvdG90eXBlLmdldFdyYXBwZWRJbnN0YW5jZSA9IGZ1bmN0aW9uIGdldFdyYXBwZWRJbnN0YW5jZSgpIHtcbiAgICAgICAgKDAsIF9pbnZhcmlhbnQyW1wiZGVmYXVsdFwiXSkod2l0aFJlZiwgJ1RvIGFjY2VzcyB0aGUgd3JhcHBlZCBpbnN0YW5jZSwgeW91IG5lZWQgdG8gc3BlY2lmeSAnICsgJ3sgd2l0aFJlZjogdHJ1ZSB9IGFzIHRoZSBmb3VydGggYXJndW1lbnQgb2YgdGhlIGNvbm5lY3QoKSBjYWxsLicpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlZnMud3JhcHBlZEluc3RhbmNlO1xuICAgICAgfTtcblxuICAgICAgQ29ubmVjdC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICB2YXIgaGF2ZU93blByb3BzQ2hhbmdlZCA9IHRoaXMuaGF2ZU93blByb3BzQ2hhbmdlZDtcbiAgICAgICAgdmFyIGhhc1N0b3JlU3RhdGVDaGFuZ2VkID0gdGhpcy5oYXNTdG9yZVN0YXRlQ2hhbmdlZDtcbiAgICAgICAgdmFyIGhhdmVTdGF0ZVByb3BzQmVlblByZWNhbGN1bGF0ZWQgPSB0aGlzLmhhdmVTdGF0ZVByb3BzQmVlblByZWNhbGN1bGF0ZWQ7XG4gICAgICAgIHZhciBzdGF0ZVByb3BzUHJlY2FsY3VsYXRpb25FcnJvciA9IHRoaXMuc3RhdGVQcm9wc1ByZWNhbGN1bGF0aW9uRXJyb3I7XG4gICAgICAgIHZhciByZW5kZXJlZEVsZW1lbnQgPSB0aGlzLnJlbmRlcmVkRWxlbWVudDtcblxuICAgICAgICB0aGlzLmhhdmVPd25Qcm9wc0NoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNTdG9yZVN0YXRlQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhhdmVTdGF0ZVByb3BzQmVlblByZWNhbGN1bGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGF0ZVByb3BzUHJlY2FsY3VsYXRpb25FcnJvciA9IG51bGw7XG5cbiAgICAgICAgaWYgKHN0YXRlUHJvcHNQcmVjYWxjdWxhdGlvbkVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgc3RhdGVQcm9wc1ByZWNhbGN1bGF0aW9uRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2hvdWxkVXBkYXRlU3RhdGVQcm9wcyA9IHRydWU7XG4gICAgICAgIHZhciBzaG91bGRVcGRhdGVEaXNwYXRjaFByb3BzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHB1cmUgJiYgcmVuZGVyZWRFbGVtZW50KSB7XG4gICAgICAgICAgc2hvdWxkVXBkYXRlU3RhdGVQcm9wcyA9IGhhc1N0b3JlU3RhdGVDaGFuZ2VkIHx8IGhhdmVPd25Qcm9wc0NoYW5nZWQgJiYgdGhpcy5kb1N0YXRlUHJvcHNEZXBlbmRPbk93blByb3BzO1xuICAgICAgICAgIHNob3VsZFVwZGF0ZURpc3BhdGNoUHJvcHMgPSBoYXZlT3duUHJvcHNDaGFuZ2VkICYmIHRoaXMuZG9EaXNwYXRjaFByb3BzRGVwZW5kT25Pd25Qcm9wcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoYXZlU3RhdGVQcm9wc0NoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGhhdmVEaXNwYXRjaFByb3BzQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoaGF2ZVN0YXRlUHJvcHNCZWVuUHJlY2FsY3VsYXRlZCkge1xuICAgICAgICAgIGhhdmVTdGF0ZVByb3BzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoc2hvdWxkVXBkYXRlU3RhdGVQcm9wcykge1xuICAgICAgICAgIGhhdmVTdGF0ZVByb3BzQ2hhbmdlZCA9IHRoaXMudXBkYXRlU3RhdGVQcm9wc0lmTmVlZGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNob3VsZFVwZGF0ZURpc3BhdGNoUHJvcHMpIHtcbiAgICAgICAgICBoYXZlRGlzcGF0Y2hQcm9wc0NoYW5nZWQgPSB0aGlzLnVwZGF0ZURpc3BhdGNoUHJvcHNJZk5lZWRlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhdmVNZXJnZWRQcm9wc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICBpZiAoaGF2ZVN0YXRlUHJvcHNDaGFuZ2VkIHx8IGhhdmVEaXNwYXRjaFByb3BzQ2hhbmdlZCB8fCBoYXZlT3duUHJvcHNDaGFuZ2VkKSB7XG4gICAgICAgICAgaGF2ZU1lcmdlZFByb3BzQ2hhbmdlZCA9IHRoaXMudXBkYXRlTWVyZ2VkUHJvcHNJZk5lZWRlZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhhdmVNZXJnZWRQcm9wc0NoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaGF2ZU1lcmdlZFByb3BzQ2hhbmdlZCAmJiByZW5kZXJlZEVsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gcmVuZGVyZWRFbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpdGhSZWYpIHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVkRWxlbWVudCA9ICgwLCBfcmVhY3QuY3JlYXRlRWxlbWVudCkoV3JhcHBlZENvbXBvbmVudCwgX2V4dGVuZHMoe30sIHRoaXMubWVyZ2VkUHJvcHMsIHtcbiAgICAgICAgICAgIHJlZjogJ3dyYXBwZWRJbnN0YW5jZSdcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlZEVsZW1lbnQgPSAoMCwgX3JlYWN0LmNyZWF0ZUVsZW1lbnQpKFdyYXBwZWRDb21wb25lbnQsIHRoaXMubWVyZ2VkUHJvcHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZWRFbGVtZW50O1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIENvbm5lY3Q7XG4gICAgfShfcmVhY3QuQ29tcG9uZW50KTtcblxuICAgIENvbm5lY3QuZGlzcGxheU5hbWUgPSBjb25uZWN0RGlzcGxheU5hbWU7XG4gICAgQ29ubmVjdC5XcmFwcGVkQ29tcG9uZW50ID0gV3JhcHBlZENvbXBvbmVudDtcbiAgICBDb25uZWN0LmNvbnRleHRUeXBlcyA9IHtcbiAgICAgIHN0b3JlOiBfc3RvcmVTaGFwZTJbXCJkZWZhdWx0XCJdXG4gICAgfTtcbiAgICBDb25uZWN0LnByb3BUeXBlcyA9IHtcbiAgICAgIHN0b3JlOiBfc3RvcmVTaGFwZTJbXCJkZWZhdWx0XCJdXG4gICAgfTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBDb25uZWN0LnByb3RvdHlwZS5jb21wb25lbnRXaWxsVXBkYXRlID0gZnVuY3Rpb24gY29tcG9uZW50V2lsbFVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMudmVyc2lvbiA9PT0gdmVyc2lvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIGFyZSBob3QgcmVsb2FkaW5nIVxuICAgICAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICB0aGlzLnRyeVN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLmNsZWFyQ2FjaGUoKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuICgwLCBfaG9pc3ROb25SZWFjdFN0YXRpY3MyW1wiZGVmYXVsdFwiXSkoQ29ubmVjdCwgV3JhcHBlZENvbXBvbmVudCk7XG4gIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5jb25uZWN0ID0gZXhwb3J0cy5Qcm92aWRlciA9IHVuZGVmaW5lZDtcblxudmFyIF9Qcm92aWRlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9Qcm92aWRlcicpO1xuXG52YXIgX1Byb3ZpZGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1Byb3ZpZGVyKTtcblxudmFyIF9jb25uZWN0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Nvbm5lY3QnKTtcblxudmFyIF9jb25uZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Nvbm5lY3QpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZXhwb3J0cy5Qcm92aWRlciA9IF9Qcm92aWRlcjJbXCJkZWZhdWx0XCJdO1xuZXhwb3J0cy5jb25uZWN0ID0gX2Nvbm5lY3QyW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gc2hhbGxvd0VxdWFsO1xuZnVuY3Rpb24gc2hhbGxvd0VxdWFsKG9iakEsIG9iakIpIHtcbiAgaWYgKG9iakEgPT09IG9iakIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBrZXlzQSA9IE9iamVjdC5rZXlzKG9iakEpO1xuICB2YXIga2V5c0IgPSBPYmplY3Qua2V5cyhvYmpCKTtcblxuICBpZiAoa2V5c0EubGVuZ3RoICE9PSBrZXlzQi5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBUZXN0IGZvciBBJ3Mga2V5cyBkaWZmZXJlbnQgZnJvbSBCLlxuICB2YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzQS5sZW5ndGg7IGkrKykge1xuICAgIGlmICghaGFzT3duLmNhbGwob2JqQiwga2V5c0FbaV0pIHx8IG9iakFba2V5c0FbaV1dICE9PSBvYmpCW2tleXNBW2ldXSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX3JlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gIHN1YnNjcmliZTogX3JlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGRpc3BhdGNoOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZ2V0U3RhdGU6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHdhcm5pbmc7XG4vKipcbiAqIFByaW50cyBhIHdhcm5pbmcgaW4gdGhlIGNvbnNvbGUgaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIFRoZSB3YXJuaW5nIG1lc3NhZ2UuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gd2FybmluZyhtZXNzYWdlKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbiAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBuby1jb25zb2xlICovXG4gIHRyeSB7XG4gICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWVtcHR5ICovXG4gIH0gY2F0Y2ggKGUpIHt9XG4gIC8qIGVzbGludC1lbmFibGUgbm8tZW1wdHkgKi9cbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHdyYXBBY3Rpb25DcmVhdG9ycztcblxudmFyIF9yZWR1eCA9IHJlcXVpcmUoJ3JlZHV4Jyk7XG5cbmZ1bmN0aW9uIHdyYXBBY3Rpb25DcmVhdG9ycyhhY3Rpb25DcmVhdG9ycykge1xuICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoKSB7XG4gICAgcmV0dXJuICgwLCBfcmVkdXguYmluZEFjdGlvbkNyZWF0b3JzKShhY3Rpb25DcmVhdG9ycywgZGlzcGF0Y2gpO1xuICB9O1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5sb29wQXN5bmMgPSBsb29wQXN5bmM7XG5leHBvcnRzLm1hcEFzeW5jID0gbWFwQXN5bmM7XG5mdW5jdGlvbiBsb29wQXN5bmModHVybnMsIHdvcmssIGNhbGxiYWNrKSB7XG4gIHZhciBjdXJyZW50VHVybiA9IDAsXG4gICAgICBpc0RvbmUgPSBmYWxzZTtcbiAgdmFyIHN5bmMgPSBmYWxzZSxcbiAgICAgIGhhc05leHQgPSBmYWxzZSxcbiAgICAgIGRvbmVBcmdzID0gdm9pZCAwO1xuXG4gIGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgaXNEb25lID0gdHJ1ZTtcbiAgICBpZiAoc3luYykge1xuICAgICAgLy8gSXRlcmF0ZSBpbnN0ZWFkIG9mIHJlY3Vyc2luZyBpZiBwb3NzaWJsZS5cbiAgICAgIGRvbmVBcmdzID0gW10uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXh0KCkge1xuICAgIGlmIChpc0RvbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBoYXNOZXh0ID0gdHJ1ZTtcbiAgICBpZiAoc3luYykge1xuICAgICAgLy8gSXRlcmF0ZSBpbnN0ZWFkIG9mIHJlY3Vyc2luZyBpZiBwb3NzaWJsZS5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzeW5jID0gdHJ1ZTtcblxuICAgIHdoaWxlICghaXNEb25lICYmIGN1cnJlbnRUdXJuIDwgdHVybnMgJiYgaGFzTmV4dCkge1xuICAgICAgaGFzTmV4dCA9IGZhbHNlO1xuICAgICAgd29yay5jYWxsKHRoaXMsIGN1cnJlbnRUdXJuKyssIG5leHQsIGRvbmUpO1xuICAgIH1cblxuICAgIHN5bmMgPSBmYWxzZTtcblxuICAgIGlmIChpc0RvbmUpIHtcbiAgICAgIC8vIFRoaXMgbWVhbnMgdGhlIGxvb3AgZmluaXNoZWQgc3luY2hyb25vdXNseS5cbiAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGRvbmVBcmdzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudFR1cm4gPj0gdHVybnMgJiYgaGFzTmV4dCkge1xuICAgICAgaXNEb25lID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbmV4dCgpO1xufVxuXG5mdW5jdGlvbiBtYXBBc3luYyhhcnJheSwgd29yaywgY2FsbGJhY2spIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiBjYWxsYmFjayhudWxsLCB2YWx1ZXMpO1xuXG4gIHZhciBpc0RvbmUgPSBmYWxzZSxcbiAgICAgIGRvbmVDb3VudCA9IDA7XG5cbiAgZnVuY3Rpb24gZG9uZShpbmRleCwgZXJyb3IsIHZhbHVlKSB7XG4gICAgaWYgKGlzRG9uZSkgcmV0dXJuO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBpc0RvbmUgPSB0cnVlO1xuICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZXNbaW5kZXhdID0gdmFsdWU7XG5cbiAgICAgIGlzRG9uZSA9ICsrZG9uZUNvdW50ID09PSBsZW5ndGg7XG5cbiAgICAgIGlmIChpc0RvbmUpIGNhbGxiYWNrKG51bGwsIHZhbHVlcyk7XG4gICAgfVxuICB9XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICB3b3JrKGl0ZW0sIGluZGV4LCBmdW5jdGlvbiAoZXJyb3IsIHZhbHVlKSB7XG4gICAgICBkb25lKGluZGV4LCBlcnJvciwgdmFsdWUpO1xuICAgIH0pO1xuICB9KTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfcm91dGVyV2FybmluZyA9IHJlcXVpcmUoJy4vcm91dGVyV2FybmluZycpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcm91dGVyV2FybmluZyk7XG5cbnZhciBfSW50ZXJuYWxQcm9wVHlwZXMgPSByZXF1aXJlKCcuL0ludGVybmFsUHJvcFR5cGVzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogQSBtaXhpbiB0aGF0IGFkZHMgdGhlIFwiaGlzdG9yeVwiIGluc3RhbmNlIHZhcmlhYmxlIHRvIGNvbXBvbmVudHMuXG4gKi9cbnZhciBIaXN0b3J5ID0ge1xuXG4gIGNvbnRleHRUeXBlczoge1xuICAgIGhpc3Rvcnk6IF9JbnRlcm5hbFByb3BUeXBlcy5oaXN0b3J5XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkoZmFsc2UsICd0aGUgYEhpc3RvcnlgIG1peGluIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSBhY2Nlc3MgYGNvbnRleHQucm91dGVyYCB3aXRoIHlvdXIgb3duIGBjb250ZXh0VHlwZXNgLiBodHRwOi8vdGlueS5jYy9yb3V0ZXItaGlzdG9yeW1peGluJykgOiB2b2lkIDA7XG4gICAgdGhpcy5oaXN0b3J5ID0gdGhpcy5jb250ZXh0Lmhpc3Rvcnk7XG4gIH1cbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEhpc3Rvcnk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9MaW5rID0gcmVxdWlyZSgnLi9MaW5rJyk7XG5cbnZhciBfTGluazIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9MaW5rKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBBbiA8SW5kZXhMaW5rPiBpcyB1c2VkIHRvIGxpbmsgdG8gYW4gPEluZGV4Um91dGU+LlxuICovXG52YXIgSW5kZXhMaW5rID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdJbmRleExpbmsnLFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX0xpbmsyLmRlZmF1bHQsIF9leHRlbmRzKHt9LCB0aGlzLnByb3BzLCB7IG9ubHlBY3RpdmVPbkluZGV4OiB0cnVlIH0pKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEluZGV4TGluaztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcgPSByZXF1aXJlKCcuL3JvdXRlcldhcm5pbmcnKTtcblxudmFyIF9yb3V0ZXJXYXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JvdXRlcldhcm5pbmcpO1xuXG52YXIgX2ludmFyaWFudCA9IHJlcXVpcmUoJ2ludmFyaWFudCcpO1xuXG52YXIgX2ludmFyaWFudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbnZhcmlhbnQpO1xuXG52YXIgX1JlZGlyZWN0ID0gcmVxdWlyZSgnLi9SZWRpcmVjdCcpO1xuXG52YXIgX1JlZGlyZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1JlZGlyZWN0KTtcblxudmFyIF9JbnRlcm5hbFByb3BUeXBlcyA9IHJlcXVpcmUoJy4vSW50ZXJuYWxQcm9wVHlwZXMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIF9SZWFjdCRQcm9wVHlwZXMgPSBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzO1xudmFyIHN0cmluZyA9IF9SZWFjdCRQcm9wVHlwZXMuc3RyaW5nO1xudmFyIG9iamVjdCA9IF9SZWFjdCRQcm9wVHlwZXMub2JqZWN0O1xuXG4vKipcbiAqIEFuIDxJbmRleFJlZGlyZWN0PiBpcyB1c2VkIHRvIHJlZGlyZWN0IGZyb20gYW4gaW5kZXhSb3V0ZS5cbiAqL1xuXG52YXIgSW5kZXhSZWRpcmVjdCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnSW5kZXhSZWRpcmVjdCcsXG5cblxuICBzdGF0aWNzOiB7XG4gICAgY3JlYXRlUm91dGVGcm9tUmVhY3RFbGVtZW50OiBmdW5jdGlvbiBjcmVhdGVSb3V0ZUZyb21SZWFjdEVsZW1lbnQoZWxlbWVudCwgcGFyZW50Um91dGUpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlOiBzYW5pdHkgY2hlY2sgKi9cbiAgICAgIGlmIChwYXJlbnRSb3V0ZSkge1xuICAgICAgICBwYXJlbnRSb3V0ZS5pbmRleFJvdXRlID0gX1JlZGlyZWN0Mi5kZWZhdWx0LmNyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudChlbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX3JvdXRlcldhcm5pbmcyLmRlZmF1bHQpKGZhbHNlLCAnQW4gPEluZGV4UmVkaXJlY3Q+IGRvZXMgbm90IG1ha2Ugc2Vuc2UgYXQgdGhlIHJvb3Qgb2YgeW91ciByb3V0ZSBjb25maWcnKSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgdG86IHN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHF1ZXJ5OiBvYmplY3QsXG4gICAgc3RhdGU6IG9iamVjdCxcbiAgICBvbkVudGVyOiBfSW50ZXJuYWxQcm9wVHlwZXMuZmFsc3ksXG4gICAgY2hpbGRyZW46IF9JbnRlcm5hbFByb3BUeXBlcy5mYWxzeVxuICB9LFxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBzYW5pdHkgY2hlY2sgKi9cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgIWZhbHNlID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfaW52YXJpYW50Mi5kZWZhdWx0KShmYWxzZSwgJzxJbmRleFJlZGlyZWN0PiBlbGVtZW50cyBhcmUgZm9yIHJvdXRlciBjb25maWd1cmF0aW9uIG9ubHkgYW5kIHNob3VsZCBub3QgYmUgcmVuZGVyZWQnKSA6ICgwLCBfaW52YXJpYW50Mi5kZWZhdWx0KShmYWxzZSkgOiB2b2lkIDA7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBJbmRleFJlZGlyZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcm91dGVyV2FybmluZyA9IHJlcXVpcmUoJy4vcm91dGVyV2FybmluZycpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcm91dGVyV2FybmluZyk7XG5cbnZhciBfaW52YXJpYW50ID0gcmVxdWlyZSgnaW52YXJpYW50Jyk7XG5cbnZhciBfaW52YXJpYW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ludmFyaWFudCk7XG5cbnZhciBfUm91dGVVdGlscyA9IHJlcXVpcmUoJy4vUm91dGVVdGlscycpO1xuXG52YXIgX0ludGVybmFsUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9JbnRlcm5hbFByb3BUeXBlcycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgZnVuYyA9IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYztcblxuLyoqXG4gKiBBbiA8SW5kZXhSb3V0ZT4gaXMgdXNlZCB0byBzcGVjaWZ5IGl0cyBwYXJlbnQncyA8Um91dGUgaW5kZXhSb3V0ZT4gaW5cbiAqIGEgSlNYIHJvdXRlIGNvbmZpZy5cbiAqL1xuXG52YXIgSW5kZXhSb3V0ZSA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnSW5kZXhSb3V0ZScsXG5cblxuICBzdGF0aWNzOiB7XG4gICAgY3JlYXRlUm91dGVGcm9tUmVhY3RFbGVtZW50OiBmdW5jdGlvbiBjcmVhdGVSb3V0ZUZyb21SZWFjdEVsZW1lbnQoZWxlbWVudCwgcGFyZW50Um91dGUpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlOiBzYW5pdHkgY2hlY2sgKi9cbiAgICAgIGlmIChwYXJlbnRSb3V0ZSkge1xuICAgICAgICBwYXJlbnRSb3V0ZS5pbmRleFJvdXRlID0gKDAsIF9Sb3V0ZVV0aWxzLmNyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudCkoZWxlbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9yb3V0ZXJXYXJuaW5nMi5kZWZhdWx0KShmYWxzZSwgJ0FuIDxJbmRleFJvdXRlPiBkb2VzIG5vdCBtYWtlIHNlbnNlIGF0IHRoZSByb290IG9mIHlvdXIgcm91dGUgY29uZmlnJykgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHByb3BUeXBlczoge1xuICAgIHBhdGg6IF9JbnRlcm5hbFByb3BUeXBlcy5mYWxzeSxcbiAgICBjb21wb25lbnQ6IF9JbnRlcm5hbFByb3BUeXBlcy5jb21wb25lbnQsXG4gICAgY29tcG9uZW50czogX0ludGVybmFsUHJvcFR5cGVzLmNvbXBvbmVudHMsXG4gICAgZ2V0Q29tcG9uZW50OiBmdW5jLFxuICAgIGdldENvbXBvbmVudHM6IGZ1bmNcbiAgfSxcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogc2FuaXR5IGNoZWNrICovXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICFmYWxzZSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX2ludmFyaWFudDIuZGVmYXVsdCkoZmFsc2UsICc8SW5kZXhSb3V0ZT4gZWxlbWVudHMgYXJlIGZvciByb3V0ZXIgY29uZmlndXJhdGlvbiBvbmx5IGFuZCBzaG91bGQgbm90IGJlIHJlbmRlcmVkJykgOiAoMCwgX2ludmFyaWFudDIuZGVmYXVsdCkoZmFsc2UpIDogdm9pZCAwO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gSW5kZXhSb3V0ZTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMucm91dGVzID0gZXhwb3J0cy5yb3V0ZSA9IGV4cG9ydHMuY29tcG9uZW50cyA9IGV4cG9ydHMuY29tcG9uZW50ID0gZXhwb3J0cy5oaXN0b3J5ID0gdW5kZWZpbmVkO1xuZXhwb3J0cy5mYWxzeSA9IGZhbHN5O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIGZ1bmMgPSBfcmVhY3QuUHJvcFR5cGVzLmZ1bmM7XG52YXIgb2JqZWN0ID0gX3JlYWN0LlByb3BUeXBlcy5vYmplY3Q7XG52YXIgYXJyYXlPZiA9IF9yZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZjtcbnZhciBvbmVPZlR5cGUgPSBfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZTtcbnZhciBlbGVtZW50ID0gX3JlYWN0LlByb3BUeXBlcy5lbGVtZW50O1xudmFyIHNoYXBlID0gX3JlYWN0LlByb3BUeXBlcy5zaGFwZTtcbnZhciBzdHJpbmcgPSBfcmVhY3QuUHJvcFR5cGVzLnN0cmluZztcbmZ1bmN0aW9uIGZhbHN5KHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICBpZiAocHJvcHNbcHJvcE5hbWVdKSByZXR1cm4gbmV3IEVycm9yKCc8JyArIGNvbXBvbmVudE5hbWUgKyAnPiBzaG91bGQgbm90IGhhdmUgYSBcIicgKyBwcm9wTmFtZSArICdcIiBwcm9wJyk7XG59XG5cbnZhciBoaXN0b3J5ID0gZXhwb3J0cy5oaXN0b3J5ID0gc2hhcGUoe1xuICBsaXN0ZW46IGZ1bmMuaXNSZXF1aXJlZCxcbiAgcHVzaDogZnVuYy5pc1JlcXVpcmVkLFxuICByZXBsYWNlOiBmdW5jLmlzUmVxdWlyZWQsXG4gIGdvOiBmdW5jLmlzUmVxdWlyZWQsXG4gIGdvQmFjazogZnVuYy5pc1JlcXVpcmVkLFxuICBnb0ZvcndhcmQ6IGZ1bmMuaXNSZXF1aXJlZFxufSk7XG5cbnZhciBjb21wb25lbnQgPSBleHBvcnRzLmNvbXBvbmVudCA9IG9uZU9mVHlwZShbZnVuYywgc3RyaW5nXSk7XG52YXIgY29tcG9uZW50cyA9IGV4cG9ydHMuY29tcG9uZW50cyA9IG9uZU9mVHlwZShbY29tcG9uZW50LCBvYmplY3RdKTtcbnZhciByb3V0ZSA9IGV4cG9ydHMucm91dGUgPSBvbmVPZlR5cGUoW29iamVjdCwgZWxlbWVudF0pO1xudmFyIHJvdXRlcyA9IGV4cG9ydHMucm91dGVzID0gb25lT2ZUeXBlKFtyb3V0ZSwgYXJyYXlPZihyb3V0ZSldKTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfcm91dGVyV2FybmluZyA9IHJlcXVpcmUoJy4vcm91dGVyV2FybmluZycpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcm91dGVyV2FybmluZyk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9pbnZhcmlhbnQgPSByZXF1aXJlKCdpbnZhcmlhbnQnKTtcblxudmFyIF9pbnZhcmlhbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW52YXJpYW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIG9iamVjdCA9IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMub2JqZWN0O1xuXG4vKipcbiAqIFRoZSBMaWZlY3ljbGUgbWl4aW4gYWRkcyB0aGUgcm91dGVyV2lsbExlYXZlIGxpZmVjeWNsZSBtZXRob2QgdG8gYVxuICogY29tcG9uZW50IHRoYXQgbWF5IGJlIHVzZWQgdG8gY2FuY2VsIGEgdHJhbnNpdGlvbiBvciBwcm9tcHQgdGhlIHVzZXJcbiAqIGZvciBjb25maXJtYXRpb24uXG4gKlxuICogT24gc3RhbmRhcmQgdHJhbnNpdGlvbnMsIHJvdXRlcldpbGxMZWF2ZSByZWNlaXZlcyBhIHNpbmdsZSBhcmd1bWVudDogdGhlXG4gKiBsb2NhdGlvbiB3ZSdyZSB0cmFuc2l0aW9uaW5nIHRvLiBUbyBjYW5jZWwgdGhlIHRyYW5zaXRpb24sIHJldHVybiBmYWxzZS5cbiAqIFRvIHByb21wdCB0aGUgdXNlciBmb3IgY29uZmlybWF0aW9uLCByZXR1cm4gYSBwcm9tcHQgbWVzc2FnZSAoc3RyaW5nKS5cbiAqXG4gKiBEdXJpbmcgdGhlIGJlZm9yZXVubG9hZCBldmVudCAoYXNzdW1pbmcgeW91J3JlIHVzaW5nIHRoZSB1c2VCZWZvcmVVbmxvYWRcbiAqIGhpc3RvcnkgZW5oYW5jZXIpLCByb3V0ZXJXaWxsTGVhdmUgZG9lcyBub3QgcmVjZWl2ZSBhIGxvY2F0aW9uIG9iamVjdFxuICogYmVjYXVzZSBpdCBpc24ndCBwb3NzaWJsZSBmb3IgdXMgdG8ga25vdyB0aGUgbG9jYXRpb24gd2UncmUgdHJhbnNpdGlvbmluZ1xuICogdG8uIEluIHRoaXMgY2FzZSByb3V0ZXJXaWxsTGVhdmUgbXVzdCByZXR1cm4gYSBwcm9tcHQgbWVzc2FnZSB0byBwcmV2ZW50XG4gKiB0aGUgdXNlciBmcm9tIGNsb3NpbmcgdGhlIHdpbmRvdy90YWIuXG4gKi9cblxudmFyIExpZmVjeWNsZSA9IHtcblxuICBjb250ZXh0VHlwZXM6IHtcbiAgICBoaXN0b3J5OiBvYmplY3QuaXNSZXF1aXJlZCxcbiAgICAvLyBOZXN0ZWQgY2hpbGRyZW4gcmVjZWl2ZSB0aGUgcm91dGUgYXMgY29udGV4dCwgZWl0aGVyXG4gICAgLy8gc2V0IGJ5IHRoZSByb3V0ZSBjb21wb25lbnQgdXNpbmcgdGhlIFJvdXRlQ29udGV4dCBtaXhpblxuICAgIC8vIG9yIGJ5IHNvbWUgb3RoZXIgYW5jZXN0b3IuXG4gICAgcm91dGU6IG9iamVjdFxuICB9LFxuXG4gIHByb3BUeXBlczoge1xuICAgIC8vIFJvdXRlIGNvbXBvbmVudHMgcmVjZWl2ZSB0aGUgcm91dGUgb2JqZWN0IGFzIGEgcHJvcC5cbiAgICByb3V0ZTogb2JqZWN0XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX3JvdXRlcldhcm5pbmcyLmRlZmF1bHQpKGZhbHNlLCAndGhlIGBMaWZlY3ljbGVgIG1peGluIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYGNvbnRleHQucm91dGVyLnNldFJvdXRlTGVhdmVIb29rKHJvdXRlLCBob29rKWAuIGh0dHA6Ly90aW55LmNjL3JvdXRlci1saWZlY3ljbGVtaXhpbicpIDogdm9pZCAwO1xuICAgICF0aGlzLnJvdXRlcldpbGxMZWF2ZSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX2ludmFyaWFudDIuZGVmYXVsdCkoZmFsc2UsICdUaGUgTGlmZWN5Y2xlIG1peGluIHJlcXVpcmVzIHlvdSB0byBkZWZpbmUgYSByb3V0ZXJXaWxsTGVhdmUgbWV0aG9kJykgOiAoMCwgX2ludmFyaWFudDIuZGVmYXVsdCkoZmFsc2UpIDogdm9pZCAwO1xuXG4gICAgdmFyIHJvdXRlID0gdGhpcy5wcm9wcy5yb3V0ZSB8fCB0aGlzLmNvbnRleHQucm91dGU7XG5cbiAgICAhcm91dGUgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlLCAnVGhlIExpZmVjeWNsZSBtaXhpbiBtdXN0IGJlIHVzZWQgb24gZWl0aGVyIGEpIGEgPFJvdXRlIGNvbXBvbmVudD4gb3IgJyArICdiKSBhIGRlc2NlbmRhbnQgb2YgYSA8Um91dGUgY29tcG9uZW50PiB0aGF0IHVzZXMgdGhlIFJvdXRlQ29udGV4dCBtaXhpbicpIDogKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlKSA6IHZvaWQgMDtcblxuICAgIHRoaXMuX3VubGlzdGVuQmVmb3JlTGVhdmluZ1JvdXRlID0gdGhpcy5jb250ZXh0Lmhpc3RvcnkubGlzdGVuQmVmb3JlTGVhdmluZ1JvdXRlKHJvdXRlLCB0aGlzLnJvdXRlcldpbGxMZWF2ZSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5fdW5saXN0ZW5CZWZvcmVMZWF2aW5nUm91dGUpIHRoaXMuX3VubGlzdGVuQmVmb3JlTGVhdmluZ1JvdXRlKCk7XG4gIH1cbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IExpZmVjeWNsZTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcgPSByZXF1aXJlKCcuL3JvdXRlcldhcm5pbmcnKTtcblxudmFyIF9yb3V0ZXJXYXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JvdXRlcldhcm5pbmcpO1xuXG52YXIgX2ludmFyaWFudCA9IHJlcXVpcmUoJ2ludmFyaWFudCcpO1xuXG52YXIgX2ludmFyaWFudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbnZhcmlhbnQpO1xuXG52YXIgX1Byb3BUeXBlcyA9IHJlcXVpcmUoJy4vUHJvcFR5cGVzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhvYmosIGtleXMpIHsgdmFyIHRhcmdldCA9IHt9OyBmb3IgKHZhciBpIGluIG9iaikgeyBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTsgdGFyZ2V0W2ldID0gb2JqW2ldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxudmFyIF9SZWFjdCRQcm9wVHlwZXMgPSBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzO1xudmFyIGJvb2wgPSBfUmVhY3QkUHJvcFR5cGVzLmJvb2w7XG52YXIgb2JqZWN0ID0gX1JlYWN0JFByb3BUeXBlcy5vYmplY3Q7XG52YXIgc3RyaW5nID0gX1JlYWN0JFByb3BUeXBlcy5zdHJpbmc7XG52YXIgZnVuYyA9IF9SZWFjdCRQcm9wVHlwZXMuZnVuYztcbnZhciBvbmVPZlR5cGUgPSBfUmVhY3QkUHJvcFR5cGVzLm9uZU9mVHlwZTtcblxuXG5mdW5jdGlvbiBpc0xlZnRDbGlja0V2ZW50KGV2ZW50KSB7XG4gIHJldHVybiBldmVudC5idXR0b24gPT09IDA7XG59XG5cbmZ1bmN0aW9uIGlzTW9kaWZpZWRFdmVudChldmVudCkge1xuICByZXR1cm4gISEoZXZlbnQubWV0YUtleSB8fCBldmVudC5hbHRLZXkgfHwgZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSk7XG59XG5cbi8vIFRPRE86IERlLWR1cGxpY2F0ZSBhZ2FpbnN0IGhhc0FueVByb3BlcnRpZXMgaW4gY3JlYXRlVHJhbnNpdGlvbk1hbmFnZXIuXG5mdW5jdGlvbiBpc0VtcHR5T2JqZWN0KG9iamVjdCkge1xuICBmb3IgKHZhciBwIGluIG9iamVjdCkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwKSkgcmV0dXJuIGZhbHNlO1xuICB9cmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxvY2F0aW9uRGVzY3JpcHRvcih0bywgX3JlZikge1xuICB2YXIgcXVlcnkgPSBfcmVmLnF1ZXJ5O1xuICB2YXIgaGFzaCA9IF9yZWYuaGFzaDtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZTtcblxuICBpZiAocXVlcnkgfHwgaGFzaCB8fCBzdGF0ZSkge1xuICAgIHJldHVybiB7IHBhdGhuYW1lOiB0bywgcXVlcnk6IHF1ZXJ5LCBoYXNoOiBoYXNoLCBzdGF0ZTogc3RhdGUgfTtcbiAgfVxuXG4gIHJldHVybiB0bztcbn1cblxuLyoqXG4gKiBBIDxMaW5rPiBpcyB1c2VkIHRvIGNyZWF0ZSBhbiA8YT4gZWxlbWVudCB0aGF0IGxpbmtzIHRvIGEgcm91dGUuXG4gKiBXaGVuIHRoYXQgcm91dGUgaXMgYWN0aXZlLCB0aGUgbGluayBnZXRzIHRoZSB2YWx1ZSBvZiBpdHNcbiAqIGFjdGl2ZUNsYXNzTmFtZSBwcm9wLlxuICpcbiAqIEZvciBleGFtcGxlLCBhc3N1bWluZyB5b3UgaGF2ZSB0aGUgZm9sbG93aW5nIHJvdXRlOlxuICpcbiAqICAgPFJvdXRlIHBhdGg9XCIvcG9zdHMvOnBvc3RJRFwiIGNvbXBvbmVudD17UG9zdH0gLz5cbiAqXG4gKiBZb3UgY291bGQgdXNlIHRoZSBmb2xsb3dpbmcgY29tcG9uZW50IHRvIGxpbmsgdG8gdGhhdCByb3V0ZTpcbiAqXG4gKiAgIDxMaW5rIHRvPXtgL3Bvc3RzLyR7cG9zdC5pZH1gfSAvPlxuICpcbiAqIExpbmtzIG1heSBwYXNzIGFsb25nIGxvY2F0aW9uIHN0YXRlIGFuZC9vciBxdWVyeSBzdHJpbmcgcGFyYW1ldGVyc1xuICogaW4gdGhlIHN0YXRlL3F1ZXJ5IHByb3BzLCByZXNwZWN0aXZlbHkuXG4gKlxuICogICA8TGluayAuLi4gcXVlcnk9e3sgc2hvdzogdHJ1ZSB9fSBzdGF0ZT17eyB0aGU6ICdzdGF0ZScgfX0gLz5cbiAqL1xudmFyIExpbmsgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0xpbmsnLFxuXG5cbiAgY29udGV4dFR5cGVzOiB7XG4gICAgcm91dGVyOiBfUHJvcFR5cGVzLnJvdXRlclNoYXBlXG4gIH0sXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgdG86IG9uZU9mVHlwZShbc3RyaW5nLCBvYmplY3RdKSxcbiAgICBxdWVyeTogb2JqZWN0LFxuICAgIGhhc2g6IHN0cmluZyxcbiAgICBzdGF0ZTogb2JqZWN0LFxuICAgIGFjdGl2ZVN0eWxlOiBvYmplY3QsXG4gICAgYWN0aXZlQ2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgb25seUFjdGl2ZU9uSW5kZXg6IGJvb2wuaXNSZXF1aXJlZCxcbiAgICBvbkNsaWNrOiBmdW5jLFxuICAgIHRhcmdldDogc3RyaW5nXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9ubHlBY3RpdmVPbkluZGV4OiBmYWxzZSxcbiAgICAgIHN0eWxlOiB7fVxuICAgIH07XG4gIH0sXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2xpY2spIHRoaXMucHJvcHMub25DbGljayhldmVudCk7XG5cbiAgICBpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG4gICAgIXRoaXMuY29udGV4dC5yb3V0ZXIgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlLCAnPExpbms+cyByZW5kZXJlZCBvdXRzaWRlIG9mIGEgcm91dGVyIGNvbnRleHQgY2Fubm90IG5hdmlnYXRlLicpIDogKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlKSA6IHZvaWQgMDtcblxuICAgIGlmIChpc01vZGlmaWVkRXZlbnQoZXZlbnQpIHx8ICFpc0xlZnRDbGlja0V2ZW50KGV2ZW50KSkgcmV0dXJuO1xuXG4gICAgLy8gSWYgdGFyZ2V0IHByb3AgaXMgc2V0IChlLmcuIHRvIFwiX2JsYW5rXCIpLCBsZXQgYnJvd3NlciBoYW5kbGUgbGluay5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWY6IHVudGVzdGFibGUgd2l0aCBLYXJtYSAqL1xuICAgIGlmICh0aGlzLnByb3BzLnRhcmdldCkgcmV0dXJuO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciB0byA9IF9wcm9wcy50bztcbiAgICB2YXIgcXVlcnkgPSBfcHJvcHMucXVlcnk7XG4gICAgdmFyIGhhc2ggPSBfcHJvcHMuaGFzaDtcbiAgICB2YXIgc3RhdGUgPSBfcHJvcHMuc3RhdGU7XG5cbiAgICB2YXIgbG9jYXRpb24gPSBjcmVhdGVMb2NhdGlvbkRlc2NyaXB0b3IodG8sIHsgcXVlcnk6IHF1ZXJ5LCBoYXNoOiBoYXNoLCBzdGF0ZTogc3RhdGUgfSk7XG5cbiAgICB0aGlzLmNvbnRleHQucm91dGVyLnB1c2gobG9jYXRpb24pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgX3Byb3BzMiA9IHRoaXMucHJvcHM7XG4gICAgdmFyIHRvID0gX3Byb3BzMi50bztcbiAgICB2YXIgcXVlcnkgPSBfcHJvcHMyLnF1ZXJ5O1xuICAgIHZhciBoYXNoID0gX3Byb3BzMi5oYXNoO1xuICAgIHZhciBzdGF0ZSA9IF9wcm9wczIuc3RhdGU7XG4gICAgdmFyIGFjdGl2ZUNsYXNzTmFtZSA9IF9wcm9wczIuYWN0aXZlQ2xhc3NOYW1lO1xuICAgIHZhciBhY3RpdmVTdHlsZSA9IF9wcm9wczIuYWN0aXZlU3R5bGU7XG4gICAgdmFyIG9ubHlBY3RpdmVPbkluZGV4ID0gX3Byb3BzMi5vbmx5QWN0aXZlT25JbmRleDtcblxuICAgIHZhciBwcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcHJvcHMyLCBbJ3RvJywgJ3F1ZXJ5JywgJ2hhc2gnLCAnc3RhdGUnLCAnYWN0aXZlQ2xhc3NOYW1lJywgJ2FjdGl2ZVN0eWxlJywgJ29ubHlBY3RpdmVPbkluZGV4J10pO1xuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkoIShxdWVyeSB8fCBoYXNoIHx8IHN0YXRlKSwgJ3RoZSBgcXVlcnlgLCBgaGFzaGAsIGFuZCBgc3RhdGVgIHByb3BzIG9uIGA8TGluaz5gIGFyZSBkZXByZWNhdGVkLCB1c2UgYDxMaW5rIHRvPXt7IHBhdGhuYW1lLCBxdWVyeSwgaGFzaCwgc3RhdGUgfX0vPi4gaHR0cDovL3RpbnkuY2Mvcm91dGVyLWlzQWN0aXZlZGVwcmVjYXRlZCcpIDogdm9pZCAwO1xuXG4gICAgLy8gSWdub3JlIGlmIHJlbmRlcmVkIG91dHNpZGUgdGhlIGNvbnRleHQgb2Ygcm91dGVyLCBzaW1wbGlmaWVzIHVuaXQgdGVzdGluZy5cbiAgICB2YXIgcm91dGVyID0gdGhpcy5jb250ZXh0LnJvdXRlcjtcblxuXG4gICAgaWYgKHJvdXRlcikge1xuICAgICAgLy8gSWYgdXNlciBkb2VzIG5vdCBzcGVjaWZ5IGEgYHRvYCBwcm9wLCByZXR1cm4gYW4gZW1wdHkgYW5jaG9yIHRhZy5cbiAgICAgIGlmICh0byA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnYScsIHByb3BzKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGxvY2F0aW9uID0gY3JlYXRlTG9jYXRpb25EZXNjcmlwdG9yKHRvLCB7IHF1ZXJ5OiBxdWVyeSwgaGFzaDogaGFzaCwgc3RhdGU6IHN0YXRlIH0pO1xuICAgICAgcHJvcHMuaHJlZiA9IHJvdXRlci5jcmVhdGVIcmVmKGxvY2F0aW9uKTtcblxuICAgICAgaWYgKGFjdGl2ZUNsYXNzTmFtZSB8fCBhY3RpdmVTdHlsZSAhPSBudWxsICYmICFpc0VtcHR5T2JqZWN0KGFjdGl2ZVN0eWxlKSkge1xuICAgICAgICBpZiAocm91dGVyLmlzQWN0aXZlKGxvY2F0aW9uLCBvbmx5QWN0aXZlT25JbmRleCkpIHtcbiAgICAgICAgICBpZiAoYWN0aXZlQ2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBpZiAocHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgIHByb3BzLmNsYXNzTmFtZSArPSAnICcgKyBhY3RpdmVDbGFzc05hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwcm9wcy5jbGFzc05hbWUgPSBhY3RpdmVDbGFzc05hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGFjdGl2ZVN0eWxlKSBwcm9wcy5zdHlsZSA9IF9leHRlbmRzKHt9LCBwcm9wcy5zdHlsZSwgYWN0aXZlU3R5bGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdhJywgX2V4dGVuZHMoe30sIHByb3BzLCB7IG9uQ2xpY2s6IHRoaXMuaGFuZGxlQ2xpY2sgfSkpO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gTGluaztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuY29tcGlsZVBhdHRlcm4gPSBjb21waWxlUGF0dGVybjtcbmV4cG9ydHMubWF0Y2hQYXR0ZXJuID0gbWF0Y2hQYXR0ZXJuO1xuZXhwb3J0cy5nZXRQYXJhbU5hbWVzID0gZ2V0UGFyYW1OYW1lcztcbmV4cG9ydHMuZ2V0UGFyYW1zID0gZ2V0UGFyYW1zO1xuZXhwb3J0cy5mb3JtYXRQYXR0ZXJuID0gZm9ybWF0UGF0dGVybjtcblxudmFyIF9pbnZhcmlhbnQgPSByZXF1aXJlKCdpbnZhcmlhbnQnKTtcblxudmFyIF9pbnZhcmlhbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW52YXJpYW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJyk7XG59XG5cbmZ1bmN0aW9uIF9jb21waWxlUGF0dGVybihwYXR0ZXJuKSB7XG4gIHZhciByZWdleHBTb3VyY2UgPSAnJztcbiAgdmFyIHBhcmFtTmFtZXMgPSBbXTtcbiAgdmFyIHRva2VucyA9IFtdO1xuXG4gIHZhciBtYXRjaCA9IHZvaWQgMCxcbiAgICAgIGxhc3RJbmRleCA9IDAsXG4gICAgICBtYXRjaGVyID0gLzooW2EtekEtWl8kXVthLXpBLVowLTlfJF0qKXxcXCpcXCp8XFwqfFxcKHxcXCkvZztcbiAgd2hpbGUgKG1hdGNoID0gbWF0Y2hlci5leGVjKHBhdHRlcm4pKSB7XG4gICAgaWYgKG1hdGNoLmluZGV4ICE9PSBsYXN0SW5kZXgpIHtcbiAgICAgIHRva2Vucy5wdXNoKHBhdHRlcm4uc2xpY2UobGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgcmVnZXhwU291cmNlICs9IGVzY2FwZVJlZ0V4cChwYXR0ZXJuLnNsaWNlKGxhc3RJbmRleCwgbWF0Y2guaW5kZXgpKTtcbiAgICB9XG5cbiAgICBpZiAobWF0Y2hbMV0pIHtcbiAgICAgIHJlZ2V4cFNvdXJjZSArPSAnKFteL10rKSc7XG4gICAgICBwYXJhbU5hbWVzLnB1c2gobWF0Y2hbMV0pO1xuICAgIH0gZWxzZSBpZiAobWF0Y2hbMF0gPT09ICcqKicpIHtcbiAgICAgIHJlZ2V4cFNvdXJjZSArPSAnKC4qKSc7XG4gICAgICBwYXJhbU5hbWVzLnB1c2goJ3NwbGF0Jyk7XG4gICAgfSBlbHNlIGlmIChtYXRjaFswXSA9PT0gJyonKSB7XG4gICAgICByZWdleHBTb3VyY2UgKz0gJyguKj8pJztcbiAgICAgIHBhcmFtTmFtZXMucHVzaCgnc3BsYXQnKTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoWzBdID09PSAnKCcpIHtcbiAgICAgIHJlZ2V4cFNvdXJjZSArPSAnKD86JztcbiAgICB9IGVsc2UgaWYgKG1hdGNoWzBdID09PSAnKScpIHtcbiAgICAgIHJlZ2V4cFNvdXJjZSArPSAnKT8nO1xuICAgIH1cblxuICAgIHRva2Vucy5wdXNoKG1hdGNoWzBdKTtcblxuICAgIGxhc3RJbmRleCA9IG1hdGNoZXIubGFzdEluZGV4O1xuICB9XG5cbiAgaWYgKGxhc3RJbmRleCAhPT0gcGF0dGVybi5sZW5ndGgpIHtcbiAgICB0b2tlbnMucHVzaChwYXR0ZXJuLnNsaWNlKGxhc3RJbmRleCwgcGF0dGVybi5sZW5ndGgpKTtcbiAgICByZWdleHBTb3VyY2UgKz0gZXNjYXBlUmVnRXhwKHBhdHRlcm4uc2xpY2UobGFzdEluZGV4LCBwYXR0ZXJuLmxlbmd0aCkpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwYXR0ZXJuOiBwYXR0ZXJuLFxuICAgIHJlZ2V4cFNvdXJjZTogcmVnZXhwU291cmNlLFxuICAgIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMsXG4gICAgdG9rZW5zOiB0b2tlbnNcbiAgfTtcbn1cblxudmFyIENvbXBpbGVkUGF0dGVybnNDYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbmZ1bmN0aW9uIGNvbXBpbGVQYXR0ZXJuKHBhdHRlcm4pIHtcbiAgaWYgKCFDb21waWxlZFBhdHRlcm5zQ2FjaGVbcGF0dGVybl0pIENvbXBpbGVkUGF0dGVybnNDYWNoZVtwYXR0ZXJuXSA9IF9jb21waWxlUGF0dGVybihwYXR0ZXJuKTtcblxuICByZXR1cm4gQ29tcGlsZWRQYXR0ZXJuc0NhY2hlW3BhdHRlcm5dO1xufVxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIG1hdGNoIGEgcGF0dGVybiBvbiB0aGUgZ2l2ZW4gcGF0aG5hbWUuIFBhdHRlcm5zIG1heSB1c2VcbiAqIHRoZSBmb2xsb3dpbmcgc3BlY2lhbCBjaGFyYWN0ZXJzOlxuICpcbiAqIC0gOnBhcmFtTmFtZSAgICAgTWF0Y2hlcyBhIFVSTCBzZWdtZW50IHVwIHRvIHRoZSBuZXh0IC8sID8sIG9yICMuIFRoZVxuICogICAgICAgICAgICAgICAgICBjYXB0dXJlZCBzdHJpbmcgaXMgY29uc2lkZXJlZCBhIFwicGFyYW1cIlxuICogLSAoKSAgICAgICAgICAgICBXcmFwcyBhIHNlZ21lbnQgb2YgdGhlIFVSTCB0aGF0IGlzIG9wdGlvbmFsXG4gKiAtICogICAgICAgICAgICAgIENvbnN1bWVzIChub24tZ3JlZWR5KSBhbGwgY2hhcmFjdGVycyB1cCB0byB0aGUgbmV4dFxuICogICAgICAgICAgICAgICAgICBjaGFyYWN0ZXIgaW4gdGhlIHBhdHRlcm4sIG9yIHRvIHRoZSBlbmQgb2YgdGhlIFVSTCBpZlxuICogICAgICAgICAgICAgICAgICB0aGVyZSBpcyBub25lXG4gKiAtICoqICAgICAgICAgICAgIENvbnN1bWVzIChncmVlZHkpIGFsbCBjaGFyYWN0ZXJzIHVwIHRvIHRoZSBuZXh0IGNoYXJhY3RlclxuICogICAgICAgICAgICAgICAgICBpbiB0aGUgcGF0dGVybiwgb3IgdG8gdGhlIGVuZCBvZiB0aGUgVVJMIGlmIHRoZXJlIGlzIG5vbmVcbiAqXG4gKiAgVGhlIGZ1bmN0aW9uIGNhbGxzIGNhbGxiYWNrKGVycm9yLCBtYXRjaGVkKSB3aGVuIGZpbmlzaGVkLlxuICogVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogLSByZW1haW5pbmdQYXRobmFtZVxuICogLSBwYXJhbU5hbWVzXG4gKiAtIHBhcmFtVmFsdWVzXG4gKi9cbmZ1bmN0aW9uIG1hdGNoUGF0dGVybihwYXR0ZXJuLCBwYXRobmFtZSkge1xuICAvLyBFbnN1cmUgcGF0dGVybiBzdGFydHMgd2l0aCBsZWFkaW5nIHNsYXNoIGZvciBjb25zaXN0ZW5jeSB3aXRoIHBhdGhuYW1lLlxuICBpZiAocGF0dGVybi5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgIHBhdHRlcm4gPSAnLycgKyBwYXR0ZXJuO1xuICB9XG5cbiAgdmFyIF9jb21waWxlUGF0dGVybjIgPSBjb21waWxlUGF0dGVybihwYXR0ZXJuKTtcblxuICB2YXIgcmVnZXhwU291cmNlID0gX2NvbXBpbGVQYXR0ZXJuMi5yZWdleHBTb3VyY2U7XG4gIHZhciBwYXJhbU5hbWVzID0gX2NvbXBpbGVQYXR0ZXJuMi5wYXJhbU5hbWVzO1xuICB2YXIgdG9rZW5zID0gX2NvbXBpbGVQYXR0ZXJuMi50b2tlbnM7XG5cblxuICBpZiAocGF0dGVybi5jaGFyQXQocGF0dGVybi5sZW5ndGggLSAxKSAhPT0gJy8nKSB7XG4gICAgcmVnZXhwU291cmNlICs9ICcvPyc7IC8vIEFsbG93IG9wdGlvbmFsIHBhdGggc2VwYXJhdG9yIGF0IGVuZC5cbiAgfVxuXG4gIC8vIFNwZWNpYWwtY2FzZSBwYXR0ZXJucyBsaWtlICcqJyBmb3IgY2F0Y2gtYWxsIHJvdXRlcy5cbiAgaWYgKHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0gPT09ICcqJykge1xuICAgIHJlZ2V4cFNvdXJjZSArPSAnJCc7XG4gIH1cblxuICB2YXIgbWF0Y2ggPSBwYXRobmFtZS5tYXRjaChuZXcgUmVnRXhwKCdeJyArIHJlZ2V4cFNvdXJjZSwgJ2knKSk7XG4gIGlmIChtYXRjaCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgbWF0Y2hlZFBhdGggPSBtYXRjaFswXTtcbiAgdmFyIHJlbWFpbmluZ1BhdGhuYW1lID0gcGF0aG5hbWUuc3Vic3RyKG1hdGNoZWRQYXRoLmxlbmd0aCk7XG5cbiAgaWYgKHJlbWFpbmluZ1BhdGhuYW1lKSB7XG4gICAgLy8gUmVxdWlyZSB0aGF0IHRoZSBtYXRjaCBlbmRzIGF0IGEgcGF0aCBzZXBhcmF0b3IsIGlmIHdlIGRpZG4ndCBtYXRjaFxuICAgIC8vIHRoZSBmdWxsIHBhdGgsIHNvIGFueSByZW1haW5pbmcgcGF0aG5hbWUgaXMgYSBuZXcgcGF0aCBzZWdtZW50LlxuICAgIGlmIChtYXRjaGVkUGF0aC5jaGFyQXQobWF0Y2hlZFBhdGgubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSByZW1haW5pbmcgcGF0aG5hbWUsIHRyZWF0IHRoZSBwYXRoIHNlcGFyYXRvciBhcyBwYXJ0IG9mXG4gICAgLy8gdGhlIHJlbWFpbmluZyBwYXRobmFtZSBmb3IgcHJvcGVybHkgY29udGludWluZyB0aGUgbWF0Y2guXG4gICAgcmVtYWluaW5nUGF0aG5hbWUgPSAnLycgKyByZW1haW5pbmdQYXRobmFtZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcmVtYWluaW5nUGF0aG5hbWU6IHJlbWFpbmluZ1BhdGhuYW1lLFxuICAgIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMsXG4gICAgcGFyYW1WYWx1ZXM6IG1hdGNoLnNsaWNlKDEpLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgcmV0dXJuIHYgJiYgZGVjb2RlVVJJQ29tcG9uZW50KHYpO1xuICAgIH0pXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFBhcmFtTmFtZXMocGF0dGVybikge1xuICByZXR1cm4gY29tcGlsZVBhdHRlcm4ocGF0dGVybikucGFyYW1OYW1lcztcbn1cblxuZnVuY3Rpb24gZ2V0UGFyYW1zKHBhdHRlcm4sIHBhdGhuYW1lKSB7XG4gIHZhciBtYXRjaCA9IG1hdGNoUGF0dGVybihwYXR0ZXJuLCBwYXRobmFtZSk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBwYXJhbU5hbWVzID0gbWF0Y2gucGFyYW1OYW1lcztcbiAgdmFyIHBhcmFtVmFsdWVzID0gbWF0Y2gucGFyYW1WYWx1ZXM7XG5cbiAgdmFyIHBhcmFtcyA9IHt9O1xuXG4gIHBhcmFtTmFtZXMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW1OYW1lLCBpbmRleCkge1xuICAgIHBhcmFtc1twYXJhbU5hbWVdID0gcGFyYW1WYWx1ZXNbaW5kZXhdO1xuICB9KTtcblxuICByZXR1cm4gcGFyYW1zO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSB2ZXJzaW9uIG9mIHRoZSBnaXZlbiBwYXR0ZXJuIHdpdGggcGFyYW1zIGludGVycG9sYXRlZC4gVGhyb3dzXG4gKiBpZiB0aGVyZSBpcyBhIGR5bmFtaWMgc2VnbWVudCBvZiB0aGUgcGF0dGVybiBmb3Igd2hpY2ggdGhlcmUgaXMgbm8gcGFyYW0uXG4gKi9cbmZ1bmN0aW9uIGZvcm1hdFBhdHRlcm4ocGF0dGVybiwgcGFyYW1zKSB7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcblxuICB2YXIgX2NvbXBpbGVQYXR0ZXJuMyA9IGNvbXBpbGVQYXR0ZXJuKHBhdHRlcm4pO1xuXG4gIHZhciB0b2tlbnMgPSBfY29tcGlsZVBhdHRlcm4zLnRva2VucztcblxuICB2YXIgcGFyZW5Db3VudCA9IDAsXG4gICAgICBwYXRobmFtZSA9ICcnLFxuICAgICAgc3BsYXRJbmRleCA9IDA7XG5cbiAgdmFyIHRva2VuID0gdm9pZCAwLFxuICAgICAgcGFyYW1OYW1lID0gdm9pZCAwLFxuICAgICAgcGFyYW1WYWx1ZSA9IHZvaWQgMDtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRva2Vucy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHRva2VuID0gdG9rZW5zW2ldO1xuXG4gICAgaWYgKHRva2VuID09PSAnKicgfHwgdG9rZW4gPT09ICcqKicpIHtcbiAgICAgIHBhcmFtVmFsdWUgPSBBcnJheS5pc0FycmF5KHBhcmFtcy5zcGxhdCkgPyBwYXJhbXMuc3BsYXRbc3BsYXRJbmRleCsrXSA6IHBhcmFtcy5zcGxhdDtcblxuICAgICAgIShwYXJhbVZhbHVlICE9IG51bGwgfHwgcGFyZW5Db3VudCA+IDApID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfaW52YXJpYW50Mi5kZWZhdWx0KShmYWxzZSwgJ01pc3Npbmcgc3BsYXQgIyVzIGZvciBwYXRoIFwiJXNcIicsIHNwbGF0SW5kZXgsIHBhdHRlcm4pIDogKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlKSA6IHZvaWQgMDtcblxuICAgICAgaWYgKHBhcmFtVmFsdWUgIT0gbnVsbCkgcGF0aG5hbWUgKz0gZW5jb2RlVVJJKHBhcmFtVmFsdWUpO1xuICAgIH0gZWxzZSBpZiAodG9rZW4gPT09ICcoJykge1xuICAgICAgcGFyZW5Db3VudCArPSAxO1xuICAgIH0gZWxzZSBpZiAodG9rZW4gPT09ICcpJykge1xuICAgICAgcGFyZW5Db3VudCAtPSAxO1xuICAgIH0gZWxzZSBpZiAodG9rZW4uY2hhckF0KDApID09PSAnOicpIHtcbiAgICAgIHBhcmFtTmFtZSA9IHRva2VuLnN1YnN0cmluZygxKTtcbiAgICAgIHBhcmFtVmFsdWUgPSBwYXJhbXNbcGFyYW1OYW1lXTtcblxuICAgICAgIShwYXJhbVZhbHVlICE9IG51bGwgfHwgcGFyZW5Db3VudCA+IDApID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfaW52YXJpYW50Mi5kZWZhdWx0KShmYWxzZSwgJ01pc3NpbmcgXCIlc1wiIHBhcmFtZXRlciBmb3IgcGF0aCBcIiVzXCInLCBwYXJhbU5hbWUsIHBhdHRlcm4pIDogKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlKSA6IHZvaWQgMDtcblxuICAgICAgaWYgKHBhcmFtVmFsdWUgIT0gbnVsbCkgcGF0aG5hbWUgKz0gZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtVmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXRobmFtZSArPSB0b2tlbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGF0aG5hbWUucmVwbGFjZSgvXFwvKy9nLCAnLycpO1xufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMucm91dGVyID0gZXhwb3J0cy5yb3V0ZXMgPSBleHBvcnRzLnJvdXRlID0gZXhwb3J0cy5jb21wb25lbnRzID0gZXhwb3J0cy5jb21wb25lbnQgPSBleHBvcnRzLmxvY2F0aW9uID0gZXhwb3J0cy5oaXN0b3J5ID0gZXhwb3J0cy5mYWxzeSA9IGV4cG9ydHMubG9jYXRpb25TaGFwZSA9IGV4cG9ydHMucm91dGVyU2hhcGUgPSB1bmRlZmluZWQ7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX2RlcHJlY2F0ZU9iamVjdFByb3BlcnRpZXMgPSByZXF1aXJlKCcuL2RlcHJlY2F0ZU9iamVjdFByb3BlcnRpZXMnKTtcblxudmFyIF9kZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlcHJlY2F0ZU9iamVjdFByb3BlcnRpZXMpO1xuXG52YXIgX0ludGVybmFsUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9JbnRlcm5hbFByb3BUeXBlcycpO1xuXG52YXIgSW50ZXJuYWxQcm9wVHlwZXMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfSW50ZXJuYWxQcm9wVHlwZXMpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcgPSByZXF1aXJlKCcuL3JvdXRlcldhcm5pbmcnKTtcblxudmFyIF9yb3V0ZXJXYXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JvdXRlcldhcm5pbmcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgZnVuYyA9IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYztcbnZhciBvYmplY3QgPSBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdDtcbnZhciBzaGFwZSA9IF9yZWFjdC5Qcm9wVHlwZXMuc2hhcGU7XG52YXIgc3RyaW5nID0gX3JlYWN0LlByb3BUeXBlcy5zdHJpbmc7XG52YXIgcm91dGVyU2hhcGUgPSBleHBvcnRzLnJvdXRlclNoYXBlID0gc2hhcGUoe1xuICBwdXNoOiBmdW5jLmlzUmVxdWlyZWQsXG4gIHJlcGxhY2U6IGZ1bmMuaXNSZXF1aXJlZCxcbiAgZ286IGZ1bmMuaXNSZXF1aXJlZCxcbiAgZ29CYWNrOiBmdW5jLmlzUmVxdWlyZWQsXG4gIGdvRm9yd2FyZDogZnVuYy5pc1JlcXVpcmVkLFxuICBzZXRSb3V0ZUxlYXZlSG9vazogZnVuYy5pc1JlcXVpcmVkLFxuICBpc0FjdGl2ZTogZnVuYy5pc1JlcXVpcmVkXG59KTtcblxudmFyIGxvY2F0aW9uU2hhcGUgPSBleHBvcnRzLmxvY2F0aW9uU2hhcGUgPSBzaGFwZSh7XG4gIHBhdGhuYW1lOiBzdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2VhcmNoOiBzdHJpbmcuaXNSZXF1aXJlZCxcbiAgc3RhdGU6IG9iamVjdCxcbiAgYWN0aW9uOiBzdHJpbmcuaXNSZXF1aXJlZCxcbiAga2V5OiBzdHJpbmdcbn0pO1xuXG4vLyBEZXByZWNhdGVkIHN0dWZmIGJlbG93OlxuXG52YXIgZmFsc3kgPSBleHBvcnRzLmZhbHN5ID0gSW50ZXJuYWxQcm9wVHlwZXMuZmFsc3k7XG52YXIgaGlzdG9yeSA9IGV4cG9ydHMuaGlzdG9yeSA9IEludGVybmFsUHJvcFR5cGVzLmhpc3Rvcnk7XG52YXIgbG9jYXRpb24gPSBleHBvcnRzLmxvY2F0aW9uID0gbG9jYXRpb25TaGFwZTtcbnZhciBjb21wb25lbnQgPSBleHBvcnRzLmNvbXBvbmVudCA9IEludGVybmFsUHJvcFR5cGVzLmNvbXBvbmVudDtcbnZhciBjb21wb25lbnRzID0gZXhwb3J0cy5jb21wb25lbnRzID0gSW50ZXJuYWxQcm9wVHlwZXMuY29tcG9uZW50cztcbnZhciByb3V0ZSA9IGV4cG9ydHMucm91dGUgPSBJbnRlcm5hbFByb3BUeXBlcy5yb3V0ZTtcbnZhciByb3V0ZXMgPSBleHBvcnRzLnJvdXRlcyA9IEludGVybmFsUHJvcFR5cGVzLnJvdXRlcztcbnZhciByb3V0ZXIgPSBleHBvcnRzLnJvdXRlciA9IHJvdXRlclNoYXBlO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZXByZWNhdGVQcm9wVHlwZSA9IGZ1bmN0aW9uIGRlcHJlY2F0ZVByb3BUeXBlKHByb3BUeXBlLCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9yb3V0ZXJXYXJuaW5nMi5kZWZhdWx0KShmYWxzZSwgbWVzc2FnZSkgOiB2b2lkIDA7XG4gICAgICAgIHJldHVybiBwcm9wVHlwZS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICB2YXIgZGVwcmVjYXRlSW50ZXJuYWxQcm9wVHlwZSA9IGZ1bmN0aW9uIGRlcHJlY2F0ZUludGVybmFsUHJvcFR5cGUocHJvcFR5cGUpIHtcbiAgICAgIHJldHVybiBkZXByZWNhdGVQcm9wVHlwZShwcm9wVHlwZSwgJ1RoaXMgcHJvcCB0eXBlIGlzIG5vdCBpbnRlbmRlZCBmb3IgZXh0ZXJuYWwgdXNlLCBhbmQgd2FzIHByZXZpb3VzbHkgZXhwb3J0ZWQgYnkgbWlzdGFrZS4gVGhlc2UgaW50ZXJuYWwgcHJvcCB0eXBlcyBhcmUgZGVwcmVjYXRlZCBmb3IgZXh0ZXJuYWwgdXNlLCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGEgbGF0ZXIgdmVyc2lvbi4nKTtcbiAgICB9O1xuXG4gICAgdmFyIGRlcHJlY2F0ZVJlbmFtZWRQcm9wVHlwZSA9IGZ1bmN0aW9uIGRlcHJlY2F0ZVJlbmFtZWRQcm9wVHlwZShwcm9wVHlwZSwgbmFtZSkge1xuICAgICAgcmV0dXJuIGRlcHJlY2F0ZVByb3BUeXBlKHByb3BUeXBlLCAnVGhlIGAnICsgbmFtZSArICdgIHByb3AgdHlwZSBpcyBub3cgZXhwb3J0ZWQgYXMgYCcgKyBuYW1lICsgJ1NoYXBlYCB0byBhdm9pZCBuYW1lIGNvbmZsaWN0cy4gVGhpcyBleHBvcnQgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGEgbGF0ZXIgdmVyc2lvbi4nKTtcbiAgICB9O1xuXG4gICAgZXhwb3J0cy5mYWxzeSA9IGZhbHN5ID0gZGVwcmVjYXRlSW50ZXJuYWxQcm9wVHlwZShmYWxzeSk7XG4gICAgZXhwb3J0cy5oaXN0b3J5ID0gaGlzdG9yeSA9IGRlcHJlY2F0ZUludGVybmFsUHJvcFR5cGUoaGlzdG9yeSk7XG4gICAgZXhwb3J0cy5jb21wb25lbnQgPSBjb21wb25lbnQgPSBkZXByZWNhdGVJbnRlcm5hbFByb3BUeXBlKGNvbXBvbmVudCk7XG4gICAgZXhwb3J0cy5jb21wb25lbnRzID0gY29tcG9uZW50cyA9IGRlcHJlY2F0ZUludGVybmFsUHJvcFR5cGUoY29tcG9uZW50cyk7XG4gICAgZXhwb3J0cy5yb3V0ZSA9IHJvdXRlID0gZGVwcmVjYXRlSW50ZXJuYWxQcm9wVHlwZShyb3V0ZSk7XG4gICAgZXhwb3J0cy5yb3V0ZXMgPSByb3V0ZXMgPSBkZXByZWNhdGVJbnRlcm5hbFByb3BUeXBlKHJvdXRlcyk7XG5cbiAgICBleHBvcnRzLmxvY2F0aW9uID0gbG9jYXRpb24gPSBkZXByZWNhdGVSZW5hbWVkUHJvcFR5cGUobG9jYXRpb24sICdsb2NhdGlvbicpO1xuICAgIGV4cG9ydHMucm91dGVyID0gcm91dGVyID0gZGVwcmVjYXRlUmVuYW1lZFByb3BUeXBlKHJvdXRlciwgJ3JvdXRlcicpO1xuICB9KSgpO1xufVxuXG52YXIgZGVmYXVsdEV4cG9ydCA9IHtcbiAgZmFsc3k6IGZhbHN5LFxuICBoaXN0b3J5OiBoaXN0b3J5LFxuICBsb2NhdGlvbjogbG9jYXRpb24sXG4gIGNvbXBvbmVudDogY29tcG9uZW50LFxuICBjb21wb25lbnRzOiBjb21wb25lbnRzLFxuICByb3V0ZTogcm91dGUsXG4gIC8vIEZvciBzb21lIHJlYXNvbiwgcm91dGVzIHdhcyBuZXZlciBoZXJlLlxuICByb3V0ZXI6IHJvdXRlclxufTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZGVmYXVsdEV4cG9ydCA9ICgwLCBfZGVwcmVjYXRlT2JqZWN0UHJvcGVydGllczIuZGVmYXVsdCkoZGVmYXVsdEV4cG9ydCwgJ1RoZSBkZWZhdWx0IGV4cG9ydCBmcm9tIGByZWFjdC1yb3V0ZXIvbGliL1Byb3BUeXBlc2AgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0aGUgbmFtZWQgZXhwb3J0cyBpbnN0ZWFkLicpO1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0RXhwb3J0OyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX2ludmFyaWFudCA9IHJlcXVpcmUoJ2ludmFyaWFudCcpO1xuXG52YXIgX2ludmFyaWFudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbnZhcmlhbnQpO1xuXG52YXIgX1JvdXRlVXRpbHMgPSByZXF1aXJlKCcuL1JvdXRlVXRpbHMnKTtcblxudmFyIF9QYXR0ZXJuVXRpbHMgPSByZXF1aXJlKCcuL1BhdHRlcm5VdGlscycpO1xuXG52YXIgX0ludGVybmFsUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9JbnRlcm5hbFByb3BUeXBlcycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgX1JlYWN0JFByb3BUeXBlcyA9IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXM7XG52YXIgc3RyaW5nID0gX1JlYWN0JFByb3BUeXBlcy5zdHJpbmc7XG52YXIgb2JqZWN0ID0gX1JlYWN0JFByb3BUeXBlcy5vYmplY3Q7XG5cbi8qKlxuICogQSA8UmVkaXJlY3Q+IGlzIHVzZWQgdG8gZGVjbGFyZSBhbm90aGVyIFVSTCBwYXRoIGEgY2xpZW50IHNob3VsZFxuICogYmUgc2VudCB0byB3aGVuIHRoZXkgcmVxdWVzdCBhIGdpdmVuIFVSTC5cbiAqXG4gKiBSZWRpcmVjdHMgYXJlIHBsYWNlZCBhbG9uZ3NpZGUgcm91dGVzIGluIHRoZSByb3V0ZSBjb25maWd1cmF0aW9uXG4gKiBhbmQgYXJlIHRyYXZlcnNlZCBpbiB0aGUgc2FtZSBtYW5uZXIuXG4gKi9cblxudmFyIFJlZGlyZWN0ID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdSZWRpcmVjdCcsXG5cblxuICBzdGF0aWNzOiB7XG4gICAgY3JlYXRlUm91dGVGcm9tUmVhY3RFbGVtZW50OiBmdW5jdGlvbiBjcmVhdGVSb3V0ZUZyb21SZWFjdEVsZW1lbnQoZWxlbWVudCkge1xuICAgICAgdmFyIHJvdXRlID0gKDAsIF9Sb3V0ZVV0aWxzLmNyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudCkoZWxlbWVudCk7XG5cbiAgICAgIGlmIChyb3V0ZS5mcm9tKSByb3V0ZS5wYXRoID0gcm91dGUuZnJvbTtcblxuICAgICAgcm91dGUub25FbnRlciA9IGZ1bmN0aW9uIChuZXh0U3RhdGUsIHJlcGxhY2UpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gbmV4dFN0YXRlLmxvY2F0aW9uO1xuICAgICAgICB2YXIgcGFyYW1zID0gbmV4dFN0YXRlLnBhcmFtcztcblxuXG4gICAgICAgIHZhciBwYXRobmFtZSA9IHZvaWQgMDtcbiAgICAgICAgaWYgKHJvdXRlLnRvLmNoYXJBdCgwKSA9PT0gJy8nKSB7XG4gICAgICAgICAgcGF0aG5hbWUgPSAoMCwgX1BhdHRlcm5VdGlscy5mb3JtYXRQYXR0ZXJuKShyb3V0ZS50bywgcGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIGlmICghcm91dGUudG8pIHtcbiAgICAgICAgICBwYXRobmFtZSA9IGxvY2F0aW9uLnBhdGhuYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciByb3V0ZUluZGV4ID0gbmV4dFN0YXRlLnJvdXRlcy5pbmRleE9mKHJvdXRlKTtcbiAgICAgICAgICB2YXIgcGFyZW50UGF0dGVybiA9IFJlZGlyZWN0LmdldFJvdXRlUGF0dGVybihuZXh0U3RhdGUucm91dGVzLCByb3V0ZUluZGV4IC0gMSk7XG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBwYXJlbnRQYXR0ZXJuLnJlcGxhY2UoL1xcLyokLywgJy8nKSArIHJvdXRlLnRvO1xuICAgICAgICAgIHBhdGhuYW1lID0gKDAsIF9QYXR0ZXJuVXRpbHMuZm9ybWF0UGF0dGVybikocGF0dGVybiwgcGFyYW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcGxhY2Uoe1xuICAgICAgICAgIHBhdGhuYW1lOiBwYXRobmFtZSxcbiAgICAgICAgICBxdWVyeTogcm91dGUucXVlcnkgfHwgbG9jYXRpb24ucXVlcnksXG4gICAgICAgICAgc3RhdGU6IHJvdXRlLnN0YXRlIHx8IGxvY2F0aW9uLnN0YXRlXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHJvdXRlO1xuICAgIH0sXG4gICAgZ2V0Um91dGVQYXR0ZXJuOiBmdW5jdGlvbiBnZXRSb3V0ZVBhdHRlcm4ocm91dGVzLCByb3V0ZUluZGV4KSB7XG4gICAgICB2YXIgcGFyZW50UGF0dGVybiA9ICcnO1xuXG4gICAgICBmb3IgKHZhciBpID0gcm91dGVJbmRleDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIHJvdXRlID0gcm91dGVzW2ldO1xuICAgICAgICB2YXIgcGF0dGVybiA9IHJvdXRlLnBhdGggfHwgJyc7XG5cbiAgICAgICAgcGFyZW50UGF0dGVybiA9IHBhdHRlcm4ucmVwbGFjZSgvXFwvKiQvLCAnLycpICsgcGFyZW50UGF0dGVybjtcblxuICAgICAgICBpZiAocGF0dGVybi5pbmRleE9mKCcvJykgPT09IDApIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJy8nICsgcGFyZW50UGF0dGVybjtcbiAgICB9XG4gIH0sXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgcGF0aDogc3RyaW5nLFxuICAgIGZyb206IHN0cmluZywgLy8gQWxpYXMgZm9yIHBhdGhcbiAgICB0bzogc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcXVlcnk6IG9iamVjdCxcbiAgICBzdGF0ZTogb2JqZWN0LFxuICAgIG9uRW50ZXI6IF9JbnRlcm5hbFByb3BUeXBlcy5mYWxzeSxcbiAgICBjaGlsZHJlbjogX0ludGVybmFsUHJvcFR5cGVzLmZhbHN5XG4gIH0sXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IHNhbml0eSBjaGVjayAqL1xuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAhZmFsc2UgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlLCAnPFJlZGlyZWN0PiBlbGVtZW50cyBhcmUgZm9yIHJvdXRlciBjb25maWd1cmF0aW9uIG9ubHkgYW5kIHNob3VsZCBub3QgYmUgcmVuZGVyZWQnKSA6ICgwLCBfaW52YXJpYW50Mi5kZWZhdWx0KShmYWxzZSkgOiB2b2lkIDA7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBSZWRpcmVjdDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX2ludmFyaWFudCA9IHJlcXVpcmUoJ2ludmFyaWFudCcpO1xuXG52YXIgX2ludmFyaWFudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbnZhcmlhbnQpO1xuXG52YXIgX1JvdXRlVXRpbHMgPSByZXF1aXJlKCcuL1JvdXRlVXRpbHMnKTtcblxudmFyIF9JbnRlcm5hbFByb3BUeXBlcyA9IHJlcXVpcmUoJy4vSW50ZXJuYWxQcm9wVHlwZXMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIF9SZWFjdCRQcm9wVHlwZXMgPSBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzO1xudmFyIHN0cmluZyA9IF9SZWFjdCRQcm9wVHlwZXMuc3RyaW5nO1xudmFyIGZ1bmMgPSBfUmVhY3QkUHJvcFR5cGVzLmZ1bmM7XG5cbi8qKlxuICogQSA8Um91dGU+IGlzIHVzZWQgdG8gZGVjbGFyZSB3aGljaCBjb21wb25lbnRzIGFyZSByZW5kZXJlZCB0byB0aGVcbiAqIHBhZ2Ugd2hlbiB0aGUgVVJMIG1hdGNoZXMgYSBnaXZlbiBwYXR0ZXJuLlxuICpcbiAqIFJvdXRlcyBhcmUgYXJyYW5nZWQgaW4gYSBuZXN0ZWQgdHJlZSBzdHJ1Y3R1cmUuIFdoZW4gYSBuZXcgVVJMIGlzXG4gKiByZXF1ZXN0ZWQsIHRoZSB0cmVlIGlzIHNlYXJjaGVkIGRlcHRoLWZpcnN0IHRvIGZpbmQgYSByb3V0ZSB3aG9zZVxuICogcGF0aCBtYXRjaGVzIHRoZSBVUkwuICBXaGVuIG9uZSBpcyBmb3VuZCwgYWxsIHJvdXRlcyBpbiB0aGUgdHJlZVxuICogdGhhdCBsZWFkIHRvIGl0IGFyZSBjb25zaWRlcmVkIFwiYWN0aXZlXCIgYW5kIHRoZWlyIGNvbXBvbmVudHMgYXJlXG4gKiByZW5kZXJlZCBpbnRvIHRoZSBET00sIG5lc3RlZCBpbiB0aGUgc2FtZSBvcmRlciBhcyBpbiB0aGUgdHJlZS5cbiAqL1xuXG52YXIgUm91dGUgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1JvdXRlJyxcblxuXG4gIHN0YXRpY3M6IHtcbiAgICBjcmVhdGVSb3V0ZUZyb21SZWFjdEVsZW1lbnQ6IF9Sb3V0ZVV0aWxzLmNyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudFxuICB9LFxuXG4gIHByb3BUeXBlczoge1xuICAgIHBhdGg6IHN0cmluZyxcbiAgICBjb21wb25lbnQ6IF9JbnRlcm5hbFByb3BUeXBlcy5jb21wb25lbnQsXG4gICAgY29tcG9uZW50czogX0ludGVybmFsUHJvcFR5cGVzLmNvbXBvbmVudHMsXG4gICAgZ2V0Q29tcG9uZW50OiBmdW5jLFxuICAgIGdldENvbXBvbmVudHM6IGZ1bmNcbiAgfSxcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogc2FuaXR5IGNoZWNrICovXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICFmYWxzZSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX2ludmFyaWFudDIuZGVmYXVsdCkoZmFsc2UsICc8Um91dGU+IGVsZW1lbnRzIGFyZSBmb3Igcm91dGVyIGNvbmZpZ3VyYXRpb24gb25seSBhbmQgc2hvdWxkIG5vdCBiZSByZW5kZXJlZCcpIDogKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlKSA6IHZvaWQgMDtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFJvdXRlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3JvdXRlcldhcm5pbmcgPSByZXF1aXJlKCcuL3JvdXRlcldhcm5pbmcnKTtcblxudmFyIF9yb3V0ZXJXYXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JvdXRlcldhcm5pbmcpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBvYmplY3QgPSBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm9iamVjdDtcblxuLyoqXG4gKiBUaGUgUm91dGVDb250ZXh0IG1peGluIHByb3ZpZGVzIGEgY29udmVuaWVudCB3YXkgZm9yIHJvdXRlXG4gKiBjb21wb25lbnRzIHRvIHNldCB0aGUgcm91dGUgaW4gY29udGV4dC4gVGhpcyBpcyBuZWVkZWQgZm9yXG4gKiByb3V0ZXMgdGhhdCByZW5kZXIgZWxlbWVudHMgdGhhdCB3YW50IHRvIHVzZSB0aGUgTGlmZWN5Y2xlXG4gKiBtaXhpbiB0byBwcmV2ZW50IHRyYW5zaXRpb25zLlxuICovXG5cbnZhciBSb3V0ZUNvbnRleHQgPSB7XG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgcm91dGU6IG9iamVjdC5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgY2hpbGRDb250ZXh0VHlwZXM6IHtcbiAgICByb3V0ZTogb2JqZWN0LmlzUmVxdWlyZWRcbiAgfSxcblxuICBnZXRDaGlsZENvbnRleHQ6IGZ1bmN0aW9uIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm91dGU6IHRoaXMucHJvcHMucm91dGVcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9yb3V0ZXJXYXJuaW5nMi5kZWZhdWx0KShmYWxzZSwgJ1RoZSBgUm91dGVDb250ZXh0YCBtaXhpbiBpcyBkZXByZWNhdGVkLiBZb3UgY2FuIHByb3ZpZGUgYHRoaXMucHJvcHMucm91dGVgIG9uIGNvbnRleHQgd2l0aCB5b3VyIG93biBgY29udGV4dFR5cGVzYC4gaHR0cDovL3RpbnkuY2Mvcm91dGVyLXJvdXRlY29udGV4dG1peGluJykgOiB2b2lkIDA7XG4gIH1cbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFJvdXRlQ29udGV4dDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZXhwb3J0cy5pc1JlYWN0Q2hpbGRyZW4gPSBpc1JlYWN0Q2hpbGRyZW47XG5leHBvcnRzLmNyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudCA9IGNyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudDtcbmV4cG9ydHMuY3JlYXRlUm91dGVzRnJvbVJlYWN0Q2hpbGRyZW4gPSBjcmVhdGVSb3V0ZXNGcm9tUmVhY3RDaGlsZHJlbjtcbmV4cG9ydHMuY3JlYXRlUm91dGVzID0gY3JlYXRlUm91dGVzO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGlzVmFsaWRDaGlsZChvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsIHx8IF9yZWFjdDIuZGVmYXVsdC5pc1ZhbGlkRWxlbWVudChvYmplY3QpO1xufVxuXG5mdW5jdGlvbiBpc1JlYWN0Q2hpbGRyZW4ob2JqZWN0KSB7XG4gIHJldHVybiBpc1ZhbGlkQ2hpbGQob2JqZWN0KSB8fCBBcnJheS5pc0FycmF5KG9iamVjdCkgJiYgb2JqZWN0LmV2ZXJ5KGlzVmFsaWRDaGlsZCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVJvdXRlKGRlZmF1bHRQcm9wcywgcHJvcHMpIHtcbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUm91dGVGcm9tUmVhY3RFbGVtZW50KGVsZW1lbnQpIHtcbiAgdmFyIHR5cGUgPSBlbGVtZW50LnR5cGU7XG4gIHZhciByb3V0ZSA9IGNyZWF0ZVJvdXRlKHR5cGUuZGVmYXVsdFByb3BzLCBlbGVtZW50LnByb3BzKTtcblxuICBpZiAocm91dGUuY2hpbGRyZW4pIHtcbiAgICB2YXIgY2hpbGRSb3V0ZXMgPSBjcmVhdGVSb3V0ZXNGcm9tUmVhY3RDaGlsZHJlbihyb3V0ZS5jaGlsZHJlbiwgcm91dGUpO1xuXG4gICAgaWYgKGNoaWxkUm91dGVzLmxlbmd0aCkgcm91dGUuY2hpbGRSb3V0ZXMgPSBjaGlsZFJvdXRlcztcblxuICAgIGRlbGV0ZSByb3V0ZS5jaGlsZHJlbjtcbiAgfVxuXG4gIHJldHVybiByb3V0ZTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgcm91dGVzIG9iamVjdCBmcm9tIHRoZSBnaXZlbiBSZWFjdENoaWxkcmVuLiBKU1hcbiAqIHByb3ZpZGVzIGEgY29udmVuaWVudCB3YXkgdG8gdmlzdWFsaXplIGhvdyByb3V0ZXMgaW4gdGhlIGhpZXJhcmNoeSBhcmVcbiAqIG5lc3RlZC5cbiAqXG4gKiAgIGltcG9ydCB7IFJvdXRlLCBjcmVhdGVSb3V0ZXNGcm9tUmVhY3RDaGlsZHJlbiB9IGZyb20gJ3JlYWN0LXJvdXRlcidcbiAqXG4gKiAgIGNvbnN0IHJvdXRlcyA9IGNyZWF0ZVJvdXRlc0Zyb21SZWFjdENoaWxkcmVuKFxuICogICAgIDxSb3V0ZSBjb21wb25lbnQ9e0FwcH0+XG4gKiAgICAgICA8Um91dGUgcGF0aD1cImhvbWVcIiBjb21wb25lbnQ9e0Rhc2hib2FyZH0vPlxuICogICAgICAgPFJvdXRlIHBhdGg9XCJuZXdzXCIgY29tcG9uZW50PXtOZXdzRmVlZH0vPlxuICogICAgIDwvUm91dGU+XG4gKiAgIClcbiAqXG4gKiBOb3RlOiBUaGlzIG1ldGhvZCBpcyBhdXRvbWF0aWNhbGx5IHVzZWQgd2hlbiB5b3UgcHJvdmlkZSA8Um91dGU+IGNoaWxkcmVuXG4gKiB0byBhIDxSb3V0ZXI+IGNvbXBvbmVudC5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlUm91dGVzRnJvbVJlYWN0Q2hpbGRyZW4oY2hpbGRyZW4sIHBhcmVudFJvdXRlKSB7XG4gIHZhciByb3V0ZXMgPSBbXTtcblxuICBfcmVhY3QyLmRlZmF1bHQuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZHJlbiwgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICBpZiAoX3JlYWN0Mi5kZWZhdWx0LmlzVmFsaWRFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgICAvLyBDb21wb25lbnQgY2xhc3NlcyBtYXkgaGF2ZSBhIHN0YXRpYyBjcmVhdGUqIG1ldGhvZC5cbiAgICAgIGlmIChlbGVtZW50LnR5cGUuY3JlYXRlUm91dGVGcm9tUmVhY3RFbGVtZW50KSB7XG4gICAgICAgIHZhciByb3V0ZSA9IGVsZW1lbnQudHlwZS5jcmVhdGVSb3V0ZUZyb21SZWFjdEVsZW1lbnQoZWxlbWVudCwgcGFyZW50Um91dGUpO1xuXG4gICAgICAgIGlmIChyb3V0ZSkgcm91dGVzLnB1c2gocm91dGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm91dGVzLnB1c2goY3JlYXRlUm91dGVGcm9tUmVhY3RFbGVtZW50KGVsZW1lbnQpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiByb3V0ZXM7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiByb3V0ZXMgZnJvbSB0aGUgZ2l2ZW4gb2JqZWN0IHdoaWNoXG4gKiBtYXkgYmUgYSBKU1ggcm91dGUsIGEgcGxhaW4gb2JqZWN0IHJvdXRlLCBvciBhbiBhcnJheSBvZiBlaXRoZXIuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVJvdXRlcyhyb3V0ZXMpIHtcbiAgaWYgKGlzUmVhY3RDaGlsZHJlbihyb3V0ZXMpKSB7XG4gICAgcm91dGVzID0gY3JlYXRlUm91dGVzRnJvbVJlYWN0Q2hpbGRyZW4ocm91dGVzKTtcbiAgfSBlbHNlIGlmIChyb3V0ZXMgJiYgIUFycmF5LmlzQXJyYXkocm91dGVzKSkge1xuICAgIHJvdXRlcyA9IFtyb3V0ZXNdO1xuICB9XG5cbiAgcmV0dXJuIHJvdXRlcztcbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlSGFzaEhpc3RvcnkgPSByZXF1aXJlKCdoaXN0b3J5L2xpYi9jcmVhdGVIYXNoSGlzdG9yeScpO1xuXG52YXIgX2NyZWF0ZUhhc2hIaXN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUhhc2hIaXN0b3J5KTtcblxudmFyIF91c2VRdWVyaWVzID0gcmVxdWlyZSgnaGlzdG9yeS9saWIvdXNlUXVlcmllcycpO1xuXG52YXIgX3VzZVF1ZXJpZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXNlUXVlcmllcyk7XG5cbnZhciBfaW52YXJpYW50ID0gcmVxdWlyZSgnaW52YXJpYW50Jyk7XG5cbnZhciBfaW52YXJpYW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ludmFyaWFudCk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9jcmVhdGVUcmFuc2l0aW9uTWFuYWdlciA9IHJlcXVpcmUoJy4vY3JlYXRlVHJhbnNpdGlvbk1hbmFnZXInKTtcblxudmFyIF9jcmVhdGVUcmFuc2l0aW9uTWFuYWdlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVUcmFuc2l0aW9uTWFuYWdlcik7XG5cbnZhciBfSW50ZXJuYWxQcm9wVHlwZXMgPSByZXF1aXJlKCcuL0ludGVybmFsUHJvcFR5cGVzJyk7XG5cbnZhciBfUm91dGVyQ29udGV4dCA9IHJlcXVpcmUoJy4vUm91dGVyQ29udGV4dCcpO1xuXG52YXIgX1JvdXRlckNvbnRleHQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUm91dGVyQ29udGV4dCk7XG5cbnZhciBfUm91dGVVdGlscyA9IHJlcXVpcmUoJy4vUm91dGVVdGlscycpO1xuXG52YXIgX1JvdXRlclV0aWxzID0gcmVxdWlyZSgnLi9Sb3V0ZXJVdGlscycpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcgPSByZXF1aXJlKCcuL3JvdXRlcldhcm5pbmcnKTtcblxudmFyIF9yb3V0ZXJXYXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JvdXRlcldhcm5pbmcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmZ1bmN0aW9uIGlzRGVwcmVjYXRlZEhpc3RvcnkoaGlzdG9yeSkge1xuICByZXR1cm4gIWhpc3RvcnkgfHwgIWhpc3RvcnkuX192Ml9jb21wYXRpYmxlX187XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBzYW5pdHkgY2hlY2sgKi9cbmZ1bmN0aW9uIGlzVW5zdXBwb3J0ZWRIaXN0b3J5KGhpc3RvcnkpIHtcbiAgLy8gdjMgaGlzdG9yaWVzIGV4cG9zZSBnZXRDdXJyZW50TG9jYXRpb24sIGJ1dCBhcmVuJ3QgY3VycmVudGx5IHN1cHBvcnRlZC5cbiAgcmV0dXJuIGhpc3RvcnkgJiYgaGlzdG9yeS5nZXRDdXJyZW50TG9jYXRpb247XG59XG5cbnZhciBfUmVhY3QkUHJvcFR5cGVzID0gX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcztcbnZhciBmdW5jID0gX1JlYWN0JFByb3BUeXBlcy5mdW5jO1xudmFyIG9iamVjdCA9IF9SZWFjdCRQcm9wVHlwZXMub2JqZWN0O1xuXG4vKipcbiAqIEEgPFJvdXRlcj4gaXMgYSBoaWdoLWxldmVsIEFQSSBmb3IgYXV0b21hdGljYWxseSBzZXR0aW5nIHVwXG4gKiBhIHJvdXRlciB0aGF0IHJlbmRlcnMgYSA8Um91dGVyQ29udGV4dD4gd2l0aCBhbGwgdGhlIHByb3BzXG4gKiBpdCBuZWVkcyBlYWNoIHRpbWUgdGhlIFVSTCBjaGFuZ2VzLlxuICovXG5cbnZhciBSb3V0ZXIgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1JvdXRlcicsXG5cblxuICBwcm9wVHlwZXM6IHtcbiAgICBoaXN0b3J5OiBvYmplY3QsXG4gICAgY2hpbGRyZW46IF9JbnRlcm5hbFByb3BUeXBlcy5yb3V0ZXMsXG4gICAgcm91dGVzOiBfSW50ZXJuYWxQcm9wVHlwZXMucm91dGVzLCAvLyBhbGlhcyBmb3IgY2hpbGRyZW5cbiAgICByZW5kZXI6IGZ1bmMsXG4gICAgY3JlYXRlRWxlbWVudDogZnVuYyxcbiAgICBvbkVycm9yOiBmdW5jLFxuICAgIG9uVXBkYXRlOiBmdW5jLFxuXG4gICAgLy8gRGVwcmVjYXRlZDpcbiAgICBwYXJzZVF1ZXJ5U3RyaW5nOiBmdW5jLFxuICAgIHN0cmluZ2lmeVF1ZXJ5OiBmdW5jLFxuXG4gICAgLy8gUFJJVkFURTogRm9yIGNsaWVudC1zaWRlIHJlaHlkcmF0aW9uIG9mIHNlcnZlciBtYXRjaC5cbiAgICBtYXRjaENvbnRleHQ6IG9iamVjdFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihwcm9wcykge1xuICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX1JvdXRlckNvbnRleHQyLmRlZmF1bHQsIHByb3BzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9jYXRpb246IG51bGwsXG4gICAgICByb3V0ZXM6IG51bGwsXG4gICAgICBwYXJhbXM6IG51bGwsXG4gICAgICBjb21wb25lbnRzOiBudWxsXG4gICAgfTtcbiAgfSxcbiAgaGFuZGxlRXJyb3I6IGZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycm9yKSB7XG4gICAgaWYgKHRoaXMucHJvcHMub25FcnJvcikge1xuICAgICAgdGhpcy5wcm9wcy5vbkVycm9yLmNhbGwodGhpcywgZXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaHJvdyBlcnJvcnMgYnkgZGVmYXVsdCBzbyB3ZSBkb24ndCBzaWxlbnRseSBzd2FsbG93IHRoZW0hXG4gICAgICB0aHJvdyBlcnJvcjsgLy8gVGhpcyBlcnJvciBwcm9iYWJseSBvY2N1cnJlZCBpbiBnZXRDaGlsZFJvdXRlcyBvciBnZXRDb21wb25lbnRzLlxuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBwYXJzZVF1ZXJ5U3RyaW5nID0gX3Byb3BzLnBhcnNlUXVlcnlTdHJpbmc7XG4gICAgdmFyIHN0cmluZ2lmeVF1ZXJ5ID0gX3Byb3BzLnN0cmluZ2lmeVF1ZXJ5O1xuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkoIShwYXJzZVF1ZXJ5U3RyaW5nIHx8IHN0cmluZ2lmeVF1ZXJ5KSwgJ2BwYXJzZVF1ZXJ5U3RyaW5nYCBhbmQgYHN0cmluZ2lmeVF1ZXJ5YCBhcmUgZGVwcmVjYXRlZC4gUGxlYXNlIGNyZWF0ZSBhIGN1c3RvbSBoaXN0b3J5LiBodHRwOi8vdGlueS5jYy9yb3V0ZXItY3VzdG9tcXVlcnlzdHJpbmcnKSA6IHZvaWQgMDtcblxuICAgIHZhciBfY3JlYXRlUm91dGVyT2JqZWN0cyA9IHRoaXMuY3JlYXRlUm91dGVyT2JqZWN0cygpO1xuXG4gICAgdmFyIGhpc3RvcnkgPSBfY3JlYXRlUm91dGVyT2JqZWN0cy5oaXN0b3J5O1xuICAgIHZhciB0cmFuc2l0aW9uTWFuYWdlciA9IF9jcmVhdGVSb3V0ZXJPYmplY3RzLnRyYW5zaXRpb25NYW5hZ2VyO1xuICAgIHZhciByb3V0ZXIgPSBfY3JlYXRlUm91dGVyT2JqZWN0cy5yb3V0ZXI7XG5cblxuICAgIHRoaXMuX3VubGlzdGVuID0gdHJhbnNpdGlvbk1hbmFnZXIubGlzdGVuKGZ1bmN0aW9uIChlcnJvciwgc3RhdGUpIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBfdGhpcy5oYW5kbGVFcnJvcihlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdGhpcy5zZXRTdGF0ZShzdGF0ZSwgX3RoaXMucHJvcHMub25VcGRhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5oaXN0b3J5ID0gaGlzdG9yeTtcbiAgICB0aGlzLnJvdXRlciA9IHJvdXRlcjtcbiAgfSxcbiAgY3JlYXRlUm91dGVyT2JqZWN0czogZnVuY3Rpb24gY3JlYXRlUm91dGVyT2JqZWN0cygpIHtcbiAgICB2YXIgbWF0Y2hDb250ZXh0ID0gdGhpcy5wcm9wcy5tYXRjaENvbnRleHQ7XG5cbiAgICBpZiAobWF0Y2hDb250ZXh0KSB7XG4gICAgICByZXR1cm4gbWF0Y2hDb250ZXh0O1xuICAgIH1cblxuICAgIHZhciBoaXN0b3J5ID0gdGhpcy5wcm9wcy5oaXN0b3J5O1xuICAgIHZhciBfcHJvcHMyID0gdGhpcy5wcm9wcztcbiAgICB2YXIgcm91dGVzID0gX3Byb3BzMi5yb3V0ZXM7XG4gICAgdmFyIGNoaWxkcmVuID0gX3Byb3BzMi5jaGlsZHJlbjtcblxuXG4gICAgISFpc1Vuc3VwcG9ydGVkSGlzdG9yeShoaXN0b3J5KSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX2ludmFyaWFudDIuZGVmYXVsdCkoZmFsc2UsICdZb3UgaGF2ZSBwcm92aWRlZCBhIGhpc3Rvcnkgb2JqZWN0IGNyZWF0ZWQgd2l0aCBoaXN0b3J5IHYzLnguICcgKyAnVGhpcyB2ZXJzaW9uIG9mIFJlYWN0IFJvdXRlciBpcyBub3QgY29tcGF0aWJsZSB3aXRoIHYzIGhpc3RvcnkgJyArICdvYmplY3RzLiBQbGVhc2UgdXNlIGhpc3RvcnkgdjIueCBpbnN0ZWFkLicpIDogKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlKSA6IHZvaWQgMDtcblxuICAgIGlmIChpc0RlcHJlY2F0ZWRIaXN0b3J5KGhpc3RvcnkpKSB7XG4gICAgICBoaXN0b3J5ID0gdGhpcy53cmFwRGVwcmVjYXRlZEhpc3RvcnkoaGlzdG9yeSk7XG4gICAgfVxuXG4gICAgdmFyIHRyYW5zaXRpb25NYW5hZ2VyID0gKDAsIF9jcmVhdGVUcmFuc2l0aW9uTWFuYWdlcjIuZGVmYXVsdCkoaGlzdG9yeSwgKDAsIF9Sb3V0ZVV0aWxzLmNyZWF0ZVJvdXRlcykocm91dGVzIHx8IGNoaWxkcmVuKSk7XG4gICAgdmFyIHJvdXRlciA9ICgwLCBfUm91dGVyVXRpbHMuY3JlYXRlUm91dGVyT2JqZWN0KShoaXN0b3J5LCB0cmFuc2l0aW9uTWFuYWdlcik7XG4gICAgdmFyIHJvdXRpbmdIaXN0b3J5ID0gKDAsIF9Sb3V0ZXJVdGlscy5jcmVhdGVSb3V0aW5nSGlzdG9yeSkoaGlzdG9yeSwgdHJhbnNpdGlvbk1hbmFnZXIpO1xuXG4gICAgcmV0dXJuIHsgaGlzdG9yeTogcm91dGluZ0hpc3RvcnksIHRyYW5zaXRpb25NYW5hZ2VyOiB0cmFuc2l0aW9uTWFuYWdlciwgcm91dGVyOiByb3V0ZXIgfTtcbiAgfSxcbiAgd3JhcERlcHJlY2F0ZWRIaXN0b3J5OiBmdW5jdGlvbiB3cmFwRGVwcmVjYXRlZEhpc3RvcnkoaGlzdG9yeSkge1xuICAgIHZhciBfcHJvcHMzID0gdGhpcy5wcm9wcztcbiAgICB2YXIgcGFyc2VRdWVyeVN0cmluZyA9IF9wcm9wczMucGFyc2VRdWVyeVN0cmluZztcbiAgICB2YXIgc3RyaW5naWZ5UXVlcnkgPSBfcHJvcHMzLnN0cmluZ2lmeVF1ZXJ5O1xuXG5cbiAgICB2YXIgY3JlYXRlSGlzdG9yeSA9IHZvaWQgMDtcbiAgICBpZiAoaGlzdG9yeSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkoZmFsc2UsICdJdCBhcHBlYXJzIHlvdSBoYXZlIHByb3ZpZGVkIGEgZGVwcmVjYXRlZCBoaXN0b3J5IG9iamVjdCB0byBgPFJvdXRlci8+YCwgcGxlYXNlIHVzZSBhIGhpc3RvcnkgcHJvdmlkZWQgYnkgJyArICdSZWFjdCBSb3V0ZXIgd2l0aCBgaW1wb3J0IHsgYnJvd3Nlckhpc3RvcnkgfSBmcm9tIFxcJ3JlYWN0LXJvdXRlclxcJ2Agb3IgYGltcG9ydCB7IGhhc2hIaXN0b3J5IH0gZnJvbSBcXCdyZWFjdC1yb3V0ZXJcXCdgLiAnICsgJ0lmIHlvdSBhcmUgdXNpbmcgYSBjdXN0b20gaGlzdG9yeSBwbGVhc2UgY3JlYXRlIGl0IHdpdGggYHVzZVJvdXRlckhpc3RvcnlgLCBzZWUgaHR0cDovL3RpbnkuY2Mvcm91dGVyLXVzaW5naGlzdG9yeSBmb3IgZGV0YWlscy4nKSA6IHZvaWQgMDtcbiAgICAgIGNyZWF0ZUhpc3RvcnkgPSBmdW5jdGlvbiBjcmVhdGVIaXN0b3J5KCkge1xuICAgICAgICByZXR1cm4gaGlzdG9yeTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX3JvdXRlcldhcm5pbmcyLmRlZmF1bHQpKGZhbHNlLCAnYFJvdXRlcmAgbm8gbG9uZ2VyIGRlZmF1bHRzIHRoZSBoaXN0b3J5IHByb3AgdG8gaGFzaCBoaXN0b3J5LiBQbGVhc2UgdXNlIHRoZSBgaGFzaEhpc3RvcnlgIHNpbmdsZXRvbiBpbnN0ZWFkLiBodHRwOi8vdGlueS5jYy9yb3V0ZXItZGVmYXVsdGhpc3RvcnknKSA6IHZvaWQgMDtcbiAgICAgIGNyZWF0ZUhpc3RvcnkgPSBfY3JlYXRlSGFzaEhpc3RvcnkyLmRlZmF1bHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuICgwLCBfdXNlUXVlcmllczIuZGVmYXVsdCkoY3JlYXRlSGlzdG9yeSkoeyBwYXJzZVF1ZXJ5U3RyaW5nOiBwYXJzZVF1ZXJ5U3RyaW5nLCBzdHJpbmdpZnlRdWVyeTogc3RyaW5naWZ5UXVlcnkgfSk7XG4gIH0sXG5cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogc2FuaXR5IGNoZWNrICovXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkobmV4dFByb3BzLmhpc3RvcnkgPT09IHRoaXMucHJvcHMuaGlzdG9yeSwgJ1lvdSBjYW5ub3QgY2hhbmdlIDxSb3V0ZXIgaGlzdG9yeT47IGl0IHdpbGwgYmUgaWdub3JlZCcpIDogdm9pZCAwO1xuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkoKG5leHRQcm9wcy5yb3V0ZXMgfHwgbmV4dFByb3BzLmNoaWxkcmVuKSA9PT0gKHRoaXMucHJvcHMucm91dGVzIHx8IHRoaXMucHJvcHMuY2hpbGRyZW4pLCAnWW91IGNhbm5vdCBjaGFuZ2UgPFJvdXRlciByb3V0ZXM+OyBpdCB3aWxsIGJlIGlnbm9yZWQnKSA6IHZvaWQgMDtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLl91bmxpc3RlbikgdGhpcy5fdW5saXN0ZW4oKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgdmFyIGxvY2F0aW9uID0gX3N0YXRlLmxvY2F0aW9uO1xuICAgIHZhciByb3V0ZXMgPSBfc3RhdGUucm91dGVzO1xuICAgIHZhciBwYXJhbXMgPSBfc3RhdGUucGFyYW1zO1xuICAgIHZhciBjb21wb25lbnRzID0gX3N0YXRlLmNvbXBvbmVudHM7XG4gICAgdmFyIF9wcm9wczQgPSB0aGlzLnByb3BzO1xuICAgIHZhciBjcmVhdGVFbGVtZW50ID0gX3Byb3BzNC5jcmVhdGVFbGVtZW50O1xuICAgIHZhciByZW5kZXIgPSBfcHJvcHM0LnJlbmRlcjtcblxuICAgIHZhciBwcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcHJvcHM0LCBbJ2NyZWF0ZUVsZW1lbnQnLCAncmVuZGVyJ10pO1xuXG4gICAgaWYgKGxvY2F0aW9uID09IG51bGwpIHJldHVybiBudWxsOyAvLyBBc3luYyBtYXRjaFxuXG4gICAgLy8gT25seSBmb3J3YXJkIG5vbi1Sb3V0ZXItc3BlY2lmaWMgcHJvcHMgdG8gcm91dGluZyBjb250ZXh0LCBhcyB0aG9zZSBhcmVcbiAgICAvLyB0aGUgb25seSBvbmVzIHRoYXQgbWlnaHQgYmUgY3VzdG9tIHJvdXRpbmcgY29udGV4dCBwcm9wcy5cbiAgICBPYmplY3Qua2V5cyhSb3V0ZXIucHJvcFR5cGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wVHlwZSkge1xuICAgICAgcmV0dXJuIGRlbGV0ZSBwcm9wc1twcm9wVHlwZV07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVuZGVyKF9leHRlbmRzKHt9LCBwcm9wcywge1xuICAgICAgaGlzdG9yeTogdGhpcy5oaXN0b3J5LFxuICAgICAgcm91dGVyOiB0aGlzLnJvdXRlcixcbiAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbiAgICAgIHJvdXRlczogcm91dGVzLFxuICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICBjb21wb25lbnRzOiBjb21wb25lbnRzLFxuICAgICAgY3JlYXRlRWxlbWVudDogY3JlYXRlRWxlbWVudFxuICAgIH0pKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFJvdXRlcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfaW52YXJpYW50ID0gcmVxdWlyZSgnaW52YXJpYW50Jyk7XG5cbnZhciBfaW52YXJpYW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ludmFyaWFudCk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9kZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi9kZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzJyk7XG5cbnZhciBfZGVwcmVjYXRlT2JqZWN0UHJvcGVydGllczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzKTtcblxudmFyIF9nZXRSb3V0ZVBhcmFtcyA9IHJlcXVpcmUoJy4vZ2V0Um91dGVQYXJhbXMnKTtcblxudmFyIF9nZXRSb3V0ZVBhcmFtczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRSb3V0ZVBhcmFtcyk7XG5cbnZhciBfUm91dGVVdGlscyA9IHJlcXVpcmUoJy4vUm91dGVVdGlscycpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcgPSByZXF1aXJlKCcuL3JvdXRlcldhcm5pbmcnKTtcblxudmFyIF9yb3V0ZXJXYXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JvdXRlcldhcm5pbmcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgX1JlYWN0JFByb3BUeXBlcyA9IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXM7XG52YXIgYXJyYXkgPSBfUmVhY3QkUHJvcFR5cGVzLmFycmF5O1xudmFyIGZ1bmMgPSBfUmVhY3QkUHJvcFR5cGVzLmZ1bmM7XG52YXIgb2JqZWN0ID0gX1JlYWN0JFByb3BUeXBlcy5vYmplY3Q7XG5cbi8qKlxuICogQSA8Um91dGVyQ29udGV4dD4gcmVuZGVycyB0aGUgY29tcG9uZW50IHRyZWUgZm9yIGEgZ2l2ZW4gcm91dGVyIHN0YXRlXG4gKiBhbmQgc2V0cyB0aGUgaGlzdG9yeSBvYmplY3QgYW5kIHRoZSBjdXJyZW50IGxvY2F0aW9uIGluIGNvbnRleHQuXG4gKi9cblxudmFyIFJvdXRlckNvbnRleHQgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1JvdXRlckNvbnRleHQnLFxuXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgaGlzdG9yeTogb2JqZWN0LFxuICAgIHJvdXRlcjogb2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbG9jYXRpb246IG9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJvdXRlczogYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBwYXJhbXM6IG9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbXBvbmVudHM6IGFycmF5LmlzUmVxdWlyZWQsXG4gICAgY3JlYXRlRWxlbWVudDogZnVuYy5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNyZWF0ZUVsZW1lbnQ6IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50XG4gICAgfTtcbiAgfSxcblxuXG4gIGNoaWxkQ29udGV4dFR5cGVzOiB7XG4gICAgaGlzdG9yeTogb2JqZWN0LFxuICAgIGxvY2F0aW9uOiBvYmplY3QuaXNSZXF1aXJlZCxcbiAgICByb3V0ZXI6IG9iamVjdC5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgZ2V0Q2hpbGRDb250ZXh0OiBmdW5jdGlvbiBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIHJvdXRlciA9IF9wcm9wcy5yb3V0ZXI7XG4gICAgdmFyIGhpc3RvcnkgPSBfcHJvcHMuaGlzdG9yeTtcbiAgICB2YXIgbG9jYXRpb24gPSBfcHJvcHMubG9jYXRpb247XG5cbiAgICBpZiAoIXJvdXRlcikge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkoZmFsc2UsICdgPFJvdXRlckNvbnRleHQ+YCBleHBlY3RzIGEgYHJvdXRlcmAgcmF0aGVyIHRoYW4gYSBgaGlzdG9yeWAnKSA6IHZvaWQgMDtcblxuICAgICAgcm91dGVyID0gX2V4dGVuZHMoe30sIGhpc3RvcnksIHtcbiAgICAgICAgc2V0Um91dGVMZWF2ZUhvb2s6IGhpc3RvcnkubGlzdGVuQmVmb3JlTGVhdmluZ1JvdXRlXG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZSByb3V0ZXIubGlzdGVuQmVmb3JlTGVhdmluZ1JvdXRlO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBsb2NhdGlvbiA9ICgwLCBfZGVwcmVjYXRlT2JqZWN0UHJvcGVydGllczIuZGVmYXVsdCkobG9jYXRpb24sICdgY29udGV4dC5sb2NhdGlvbmAgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBhIHJvdXRlIGNvbXBvbmVudFxcJ3MgYHByb3BzLmxvY2F0aW9uYCBpbnN0ZWFkLiBodHRwOi8vdGlueS5jYy9yb3V0ZXItYWNjZXNzaW5nbG9jYXRpb24nKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBoaXN0b3J5OiBoaXN0b3J5LCBsb2NhdGlvbjogbG9jYXRpb24sIHJvdXRlcjogcm91dGVyIH07XG4gIH0sXG4gIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoY29tcG9uZW50LCBwcm9wcykge1xuICAgIHJldHVybiBjb21wb25lbnQgPT0gbnVsbCA/IG51bGwgOiB0aGlzLnByb3BzLmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50LCBwcm9wcyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgX3Byb3BzMiA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGhpc3RvcnkgPSBfcHJvcHMyLmhpc3Rvcnk7XG4gICAgdmFyIGxvY2F0aW9uID0gX3Byb3BzMi5sb2NhdGlvbjtcbiAgICB2YXIgcm91dGVzID0gX3Byb3BzMi5yb3V0ZXM7XG4gICAgdmFyIHBhcmFtcyA9IF9wcm9wczIucGFyYW1zO1xuICAgIHZhciBjb21wb25lbnRzID0gX3Byb3BzMi5jb21wb25lbnRzO1xuXG4gICAgdmFyIGVsZW1lbnQgPSBudWxsO1xuXG4gICAgaWYgKGNvbXBvbmVudHMpIHtcbiAgICAgIGVsZW1lbnQgPSBjb21wb25lbnRzLnJlZHVjZVJpZ2h0KGZ1bmN0aW9uIChlbGVtZW50LCBjb21wb25lbnRzLCBpbmRleCkge1xuICAgICAgICBpZiAoY29tcG9uZW50cyA9PSBudWxsKSByZXR1cm4gZWxlbWVudDsgLy8gRG9uJ3QgY3JlYXRlIG5ldyBjaGlsZHJlbjsgdXNlIHRoZSBncmFuZGNoaWxkcmVuLlxuXG4gICAgICAgIHZhciByb3V0ZSA9IHJvdXRlc1tpbmRleF07XG4gICAgICAgIHZhciByb3V0ZVBhcmFtcyA9ICgwLCBfZ2V0Um91dGVQYXJhbXMyLmRlZmF1bHQpKHJvdXRlLCBwYXJhbXMpO1xuICAgICAgICB2YXIgcHJvcHMgPSB7XG4gICAgICAgICAgaGlzdG9yeTogaGlzdG9yeSxcbiAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgICAgIHJvdXRlUGFyYW1zOiByb3V0ZVBhcmFtcyxcbiAgICAgICAgICByb3V0ZXM6IHJvdXRlc1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICgoMCwgX1JvdXRlVXRpbHMuaXNSZWFjdENoaWxkcmVuKShlbGVtZW50KSkge1xuICAgICAgICAgIHByb3BzLmNoaWxkcmVuID0gZWxlbWVudDtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBlbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGVsZW1lbnQsIHByb3ApKSBwcm9wc1twcm9wXSA9IGVsZW1lbnRbcHJvcF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCh0eXBlb2YgY29tcG9uZW50cyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoY29tcG9uZW50cykpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHZhciBlbGVtZW50cyA9IHt9O1xuXG4gICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29tcG9uZW50cywga2V5KSkge1xuICAgICAgICAgICAgICAvLyBQYXNzIHRocm91Z2ggdGhlIGtleSBhcyBhIHByb3AgdG8gY3JlYXRlRWxlbWVudCB0byBhbGxvd1xuICAgICAgICAgICAgICAvLyBjdXN0b20gY3JlYXRlRWxlbWVudCBmdW5jdGlvbnMgdG8ga25vdyB3aGljaCBuYW1lZCBjb21wb25lbnRcbiAgICAgICAgICAgICAgLy8gdGhleSdyZSByZW5kZXJpbmcsIGZvciBlLmcuIG1hdGNoaW5nIHVwIHRvIGZldGNoZWQgZGF0YS5cbiAgICAgICAgICAgICAgZWxlbWVudHNba2V5XSA9IF90aGlzLmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50c1trZXldLCBfZXh0ZW5kcyh7XG4gICAgICAgICAgICAgICAga2V5OiBrZXkgfSwgcHJvcHMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RoaXMuY3JlYXRlRWxlbWVudChjb21wb25lbnRzLCBwcm9wcyk7XG4gICAgICB9LCBlbGVtZW50KTtcbiAgICB9XG5cbiAgICAhKGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gZmFsc2UgfHwgX3JlYWN0Mi5kZWZhdWx0LmlzVmFsaWRFbGVtZW50KGVsZW1lbnQpKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX2ludmFyaWFudDIuZGVmYXVsdCkoZmFsc2UsICdUaGUgcm9vdCByb3V0ZSBtdXN0IHJlbmRlciBhIHNpbmdsZSBlbGVtZW50JykgOiAoMCwgX2ludmFyaWFudDIuZGVmYXVsdCkoZmFsc2UpIDogdm9pZCAwO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBSb3V0ZXJDb250ZXh0O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmNyZWF0ZVJvdXRlck9iamVjdCA9IGNyZWF0ZVJvdXRlck9iamVjdDtcbmV4cG9ydHMuY3JlYXRlUm91dGluZ0hpc3RvcnkgPSBjcmVhdGVSb3V0aW5nSGlzdG9yeTtcblxudmFyIF9kZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi9kZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzJyk7XG5cbnZhciBfZGVwcmVjYXRlT2JqZWN0UHJvcGVydGllczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gY3JlYXRlUm91dGVyT2JqZWN0KGhpc3RvcnksIHRyYW5zaXRpb25NYW5hZ2VyKSB7XG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgaGlzdG9yeSwge1xuICAgIHNldFJvdXRlTGVhdmVIb29rOiB0cmFuc2l0aW9uTWFuYWdlci5saXN0ZW5CZWZvcmVMZWF2aW5nUm91dGUsXG4gICAgaXNBY3RpdmU6IHRyYW5zaXRpb25NYW5hZ2VyLmlzQWN0aXZlXG4gIH0pO1xufVxuXG4vLyBkZXByZWNhdGVkXG5mdW5jdGlvbiBjcmVhdGVSb3V0aW5nSGlzdG9yeShoaXN0b3J5LCB0cmFuc2l0aW9uTWFuYWdlcikge1xuICBoaXN0b3J5ID0gX2V4dGVuZHMoe30sIGhpc3RvcnksIHRyYW5zaXRpb25NYW5hZ2VyKTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGhpc3RvcnkgPSAoMCwgX2RlcHJlY2F0ZU9iamVjdFByb3BlcnRpZXMyLmRlZmF1bHQpKGhpc3RvcnksICdgcHJvcHMuaGlzdG9yeWAgYW5kIGBjb250ZXh0Lmhpc3RvcnlgIGFyZSBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIGBjb250ZXh0LnJvdXRlcmAuIGh0dHA6Ly90aW55LmNjL3JvdXRlci1jb250ZXh0Y2hhbmdlcycpO1xuICB9XG5cbiAgcmV0dXJuIGhpc3Rvcnk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfUm91dGVyQ29udGV4dCA9IHJlcXVpcmUoJy4vUm91dGVyQ29udGV4dCcpO1xuXG52YXIgX1JvdXRlckNvbnRleHQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUm91dGVyQ29udGV4dCk7XG5cbnZhciBfcm91dGVyV2FybmluZyA9IHJlcXVpcmUoJy4vcm91dGVyV2FybmluZycpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcm91dGVyV2FybmluZyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBSb3V0aW5nQ29udGV4dCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnUm91dGluZ0NvbnRleHQnLFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9yb3V0ZXJXYXJuaW5nMi5kZWZhdWx0KShmYWxzZSwgJ2BSb3V0aW5nQ29udGV4dGAgaGFzIGJlZW4gcmVuYW1lZCB0byBgUm91dGVyQ29udGV4dGAuIFBsZWFzZSB1c2UgYGltcG9ydCB7IFJvdXRlckNvbnRleHQgfSBmcm9tIFxcJ3JlYWN0LXJvdXRlclxcJ2AuIGh0dHA6Ly90aW55LmNjL3JvdXRlci1yb3V0ZXJjb250ZXh0JykgOiB2b2lkIDA7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfUm91dGVyQ29udGV4dDIuZGVmYXVsdCwgdGhpcy5wcm9wcyk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBSb3V0aW5nQ29udGV4dDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMucnVuRW50ZXJIb29rcyA9IHJ1bkVudGVySG9va3M7XG5leHBvcnRzLnJ1bkNoYW5nZUhvb2tzID0gcnVuQ2hhbmdlSG9va3M7XG5leHBvcnRzLnJ1bkxlYXZlSG9va3MgPSBydW5MZWF2ZUhvb2tzO1xuXG52YXIgX0FzeW5jVXRpbHMgPSByZXF1aXJlKCcuL0FzeW5jVXRpbHMnKTtcblxudmFyIF9yb3V0ZXJXYXJuaW5nID0gcmVxdWlyZSgnLi9yb3V0ZXJXYXJuaW5nJyk7XG5cbnZhciBfcm91dGVyV2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yb3V0ZXJXYXJuaW5nKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gY3JlYXRlVHJhbnNpdGlvbkhvb2soaG9vaywgcm91dGUsIGFzeW5jQXJpdHkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBob29rLmFwcGx5KHJvdXRlLCBhcmdzKTtcblxuICAgIGlmIChob29rLmxlbmd0aCA8IGFzeW5jQXJpdHkpIHtcbiAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcbiAgICAgIC8vIEFzc3VtZSBob29rIGV4ZWN1dGVzIHN5bmNocm9ub3VzbHkgYW5kXG4gICAgICAvLyBhdXRvbWF0aWNhbGx5IGNhbGwgdGhlIGNhbGxiYWNrLlxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldEVudGVySG9va3Mocm91dGVzKSB7XG4gIHJldHVybiByb3V0ZXMucmVkdWNlKGZ1bmN0aW9uIChob29rcywgcm91dGUpIHtcbiAgICBpZiAocm91dGUub25FbnRlcikgaG9va3MucHVzaChjcmVhdGVUcmFuc2l0aW9uSG9vayhyb3V0ZS5vbkVudGVyLCByb3V0ZSwgMykpO1xuXG4gICAgcmV0dXJuIGhvb2tzO1xuICB9LCBbXSk7XG59XG5cbmZ1bmN0aW9uIGdldENoYW5nZUhvb2tzKHJvdXRlcykge1xuICByZXR1cm4gcm91dGVzLnJlZHVjZShmdW5jdGlvbiAoaG9va3MsIHJvdXRlKSB7XG4gICAgaWYgKHJvdXRlLm9uQ2hhbmdlKSBob29rcy5wdXNoKGNyZWF0ZVRyYW5zaXRpb25Ib29rKHJvdXRlLm9uQ2hhbmdlLCByb3V0ZSwgNCkpO1xuICAgIHJldHVybiBob29rcztcbiAgfSwgW10pO1xufVxuXG5mdW5jdGlvbiBydW5UcmFuc2l0aW9uSG9va3MobGVuZ3RoLCBpdGVyLCBjYWxsYmFjaykge1xuICBpZiAoIWxlbmd0aCkge1xuICAgIGNhbGxiYWNrKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHJlZGlyZWN0SW5mbyA9IHZvaWQgMDtcbiAgZnVuY3Rpb24gcmVwbGFjZShsb2NhdGlvbiwgZGVwcmVjYXRlZFBhdGhuYW1lLCBkZXByZWNhdGVkUXVlcnkpIHtcbiAgICBpZiAoZGVwcmVjYXRlZFBhdGhuYW1lKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9yb3V0ZXJXYXJuaW5nMi5kZWZhdWx0KShmYWxzZSwgJ2ByZXBsYWNlU3RhdGUoc3RhdGUsIHBhdGhuYW1lLCBxdWVyeSkgaXMgZGVwcmVjYXRlZDsgdXNlIGByZXBsYWNlKGxvY2F0aW9uKWAgd2l0aCBhIGxvY2F0aW9uIGRlc2NyaXB0b3IgaW5zdGVhZC4gaHR0cDovL3RpbnkuY2Mvcm91dGVyLWlzQWN0aXZlZGVwcmVjYXRlZCcpIDogdm9pZCAwO1xuICAgICAgcmVkaXJlY3RJbmZvID0ge1xuICAgICAgICBwYXRobmFtZTogZGVwcmVjYXRlZFBhdGhuYW1lLFxuICAgICAgICBxdWVyeTogZGVwcmVjYXRlZFF1ZXJ5LFxuICAgICAgICBzdGF0ZTogbG9jYXRpb25cbiAgICAgIH07XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZWRpcmVjdEluZm8gPSBsb2NhdGlvbjtcbiAgfVxuXG4gICgwLCBfQXN5bmNVdGlscy5sb29wQXN5bmMpKGxlbmd0aCwgZnVuY3Rpb24gKGluZGV4LCBuZXh0LCBkb25lKSB7XG4gICAgaXRlcihpbmRleCwgcmVwbGFjZSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgfHwgcmVkaXJlY3RJbmZvKSB7XG4gICAgICAgIGRvbmUoZXJyb3IsIHJlZGlyZWN0SW5mbyk7IC8vIE5vIG5lZWQgdG8gY29udGludWUuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sIGNhbGxiYWNrKTtcbn1cblxuLyoqXG4gKiBSdW5zIGFsbCBvbkVudGVyIGhvb2tzIGluIHRoZSBnaXZlbiBhcnJheSBvZiByb3V0ZXMgaW4gb3JkZXJcbiAqIHdpdGggb25FbnRlcihuZXh0U3RhdGUsIHJlcGxhY2UsIGNhbGxiYWNrKSBhbmQgY2FsbHNcbiAqIGNhbGxiYWNrKGVycm9yLCByZWRpcmVjdEluZm8pIHdoZW4gZmluaXNoZWQuIFRoZSBmaXJzdCBob29rXG4gKiB0byB1c2UgcmVwbGFjZSBzaG9ydC1jaXJjdWl0cyB0aGUgbG9vcC5cbiAqXG4gKiBJZiBhIGhvb2sgbmVlZHMgdG8gcnVuIGFzeW5jaHJvbm91c2x5LCBpdCBtYXkgdXNlIHRoZSBjYWxsYmFja1xuICogZnVuY3Rpb24uIEhvd2V2ZXIsIGRvaW5nIHNvIHdpbGwgY2F1c2UgdGhlIHRyYW5zaXRpb24gdG8gcGF1c2UsXG4gKiB3aGljaCBjb3VsZCBsZWFkIHRvIGEgbm9uLXJlc3BvbnNpdmUgVUkgaWYgdGhlIGhvb2sgaXMgc2xvdy5cbiAqL1xuZnVuY3Rpb24gcnVuRW50ZXJIb29rcyhyb3V0ZXMsIG5leHRTdGF0ZSwgY2FsbGJhY2spIHtcbiAgdmFyIGhvb2tzID0gZ2V0RW50ZXJIb29rcyhyb3V0ZXMpO1xuICByZXR1cm4gcnVuVHJhbnNpdGlvbkhvb2tzKGhvb2tzLmxlbmd0aCwgZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlLCBuZXh0KSB7XG4gICAgaG9va3NbaW5kZXhdKG5leHRTdGF0ZSwgcmVwbGFjZSwgbmV4dCk7XG4gIH0sIGNhbGxiYWNrKTtcbn1cblxuLyoqXG4gKiBSdW5zIGFsbCBvbkNoYW5nZSBob29rcyBpbiB0aGUgZ2l2ZW4gYXJyYXkgb2Ygcm91dGVzIGluIG9yZGVyXG4gKiB3aXRoIG9uQ2hhbmdlKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCByZXBsYWNlLCBjYWxsYmFjaykgYW5kIGNhbGxzXG4gKiBjYWxsYmFjayhlcnJvciwgcmVkaXJlY3RJbmZvKSB3aGVuIGZpbmlzaGVkLiBUaGUgZmlyc3QgaG9va1xuICogdG8gdXNlIHJlcGxhY2Ugc2hvcnQtY2lyY3VpdHMgdGhlIGxvb3AuXG4gKlxuICogSWYgYSBob29rIG5lZWRzIHRvIHJ1biBhc3luY2hyb25vdXNseSwgaXQgbWF5IHVzZSB0aGUgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uLiBIb3dldmVyLCBkb2luZyBzbyB3aWxsIGNhdXNlIHRoZSB0cmFuc2l0aW9uIHRvIHBhdXNlLFxuICogd2hpY2ggY291bGQgbGVhZCB0byBhIG5vbi1yZXNwb25zaXZlIFVJIGlmIHRoZSBob29rIGlzIHNsb3cuXG4gKi9cbmZ1bmN0aW9uIHJ1bkNoYW5nZUhvb2tzKHJvdXRlcywgc3RhdGUsIG5leHRTdGF0ZSwgY2FsbGJhY2spIHtcbiAgdmFyIGhvb2tzID0gZ2V0Q2hhbmdlSG9va3Mocm91dGVzKTtcbiAgcmV0dXJuIHJ1blRyYW5zaXRpb25Ib29rcyhob29rcy5sZW5ndGgsIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZSwgbmV4dCkge1xuICAgIGhvb2tzW2luZGV4XShzdGF0ZSwgbmV4dFN0YXRlLCByZXBsYWNlLCBuZXh0KTtcbiAgfSwgY2FsbGJhY2spO1xufVxuXG4vKipcbiAqIFJ1bnMgYWxsIG9uTGVhdmUgaG9va3MgaW4gdGhlIGdpdmVuIGFycmF5IG9mIHJvdXRlcyBpbiBvcmRlci5cbiAqL1xuZnVuY3Rpb24gcnVuTGVhdmVIb29rcyhyb3V0ZXMsIHByZXZTdGF0ZSkge1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcm91dGVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHJvdXRlc1tpXS5vbkxlYXZlKSByb3V0ZXNbaV0ub25MZWF2ZS5jYWxsKHJvdXRlc1tpXSwgcHJldlN0YXRlKTtcbiAgfVxufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX1JvdXRlckNvbnRleHQgPSByZXF1aXJlKCcuL1JvdXRlckNvbnRleHQnKTtcblxudmFyIF9Sb3V0ZXJDb250ZXh0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1JvdXRlckNvbnRleHQpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcgPSByZXF1aXJlKCcuL3JvdXRlcldhcm5pbmcnKTtcblxudmFyIF9yb3V0ZXJXYXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JvdXRlcldhcm5pbmcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBtaWRkbGV3YXJlcyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIG1pZGRsZXdhcmVzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBtaWRkbGV3YXJlcy5mb3JFYWNoKGZ1bmN0aW9uIChtaWRkbGV3YXJlLCBpbmRleCkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkobWlkZGxld2FyZS5yZW5kZXJSb3V0ZXJDb250ZXh0IHx8IG1pZGRsZXdhcmUucmVuZGVyUm91dGVDb21wb25lbnQsICdUaGUgbWlkZGxld2FyZSBzcGVjaWZpZWQgYXQgaW5kZXggJyArIGluZGV4ICsgJyBkb2VzIG5vdCBhcHBlYXIgdG8gYmUgJyArICdhIHZhbGlkIFJlYWN0IFJvdXRlciBtaWRkbGV3YXJlLicpIDogdm9pZCAwO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHdpdGhDb250ZXh0ID0gbWlkZGxld2FyZXMubWFwKGZ1bmN0aW9uIChtaWRkbGV3YXJlKSB7XG4gICAgcmV0dXJuIG1pZGRsZXdhcmUucmVuZGVyUm91dGVyQ29udGV4dDtcbiAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuICB2YXIgd2l0aENvbXBvbmVudCA9IG1pZGRsZXdhcmVzLm1hcChmdW5jdGlvbiAobWlkZGxld2FyZSkge1xuICAgIHJldHVybiBtaWRkbGV3YXJlLnJlbmRlclJvdXRlQ29tcG9uZW50O1xuICB9KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgdmFyIG1ha2VDcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gbWFrZUNyZWF0ZUVsZW1lbnQoKSB7XG4gICAgdmFyIGJhc2VDcmVhdGVFbGVtZW50ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gX3JlYWN0LmNyZWF0ZUVsZW1lbnQgOiBhcmd1bWVudHNbMF07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChDb21wb25lbnQsIHByb3BzKSB7XG4gICAgICByZXR1cm4gd2l0aENvbXBvbmVudC5yZWR1Y2VSaWdodChmdW5jdGlvbiAocHJldmlvdXMsIHJlbmRlclJvdXRlQ29tcG9uZW50KSB7XG4gICAgICAgIHJldHVybiByZW5kZXJSb3V0ZUNvbXBvbmVudChwcmV2aW91cywgcHJvcHMpO1xuICAgICAgfSwgYmFzZUNyZWF0ZUVsZW1lbnQoQ29tcG9uZW50LCBwcm9wcykpO1xuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChyZW5kZXJQcm9wcykge1xuICAgIHJldHVybiB3aXRoQ29udGV4dC5yZWR1Y2VSaWdodChmdW5jdGlvbiAocHJldmlvdXMsIHJlbmRlclJvdXRlckNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZW5kZXJSb3V0ZXJDb250ZXh0KHByZXZpb3VzLCByZW5kZXJQcm9wcyk7XG4gICAgfSwgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX1JvdXRlckNvbnRleHQyLmRlZmF1bHQsIF9leHRlbmRzKHt9LCByZW5kZXJQcm9wcywge1xuICAgICAgY3JlYXRlRWxlbWVudDogbWFrZUNyZWF0ZUVsZW1lbnQocmVuZGVyUHJvcHMuY3JlYXRlRWxlbWVudClcbiAgICB9KSkpO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2NyZWF0ZUJyb3dzZXJIaXN0b3J5ID0gcmVxdWlyZSgnaGlzdG9yeS9saWIvY3JlYXRlQnJvd3Nlckhpc3RvcnknKTtcblxudmFyIF9jcmVhdGVCcm93c2VySGlzdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVCcm93c2VySGlzdG9yeSk7XG5cbnZhciBfY3JlYXRlUm91dGVySGlzdG9yeSA9IHJlcXVpcmUoJy4vY3JlYXRlUm91dGVySGlzdG9yeScpO1xuXG52YXIgX2NyZWF0ZVJvdXRlckhpc3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlUm91dGVySGlzdG9yeSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfY3JlYXRlUm91dGVySGlzdG9yeTIuZGVmYXVsdCkoX2NyZWF0ZUJyb3dzZXJIaXN0b3J5Mi5kZWZhdWx0KTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9QYXR0ZXJuVXRpbHMgPSByZXF1aXJlKCcuL1BhdHRlcm5VdGlscycpO1xuXG5mdW5jdGlvbiByb3V0ZVBhcmFtc0NoYW5nZWQocm91dGUsIHByZXZTdGF0ZSwgbmV4dFN0YXRlKSB7XG4gIGlmICghcm91dGUucGF0aCkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBwYXJhbU5hbWVzID0gKDAsIF9QYXR0ZXJuVXRpbHMuZ2V0UGFyYW1OYW1lcykocm91dGUucGF0aCk7XG5cbiAgcmV0dXJuIHBhcmFtTmFtZXMuc29tZShmdW5jdGlvbiAocGFyYW1OYW1lKSB7XG4gICAgcmV0dXJuIHByZXZTdGF0ZS5wYXJhbXNbcGFyYW1OYW1lXSAhPT0gbmV4dFN0YXRlLnBhcmFtc1twYXJhbU5hbWVdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCBvZiB7IGxlYXZlUm91dGVzLCBjaGFuZ2VSb3V0ZXMsIGVudGVyUm91dGVzIH0gZGV0ZXJtaW5lZCBieVxuICogdGhlIGNoYW5nZSBmcm9tIHByZXZTdGF0ZSB0byBuZXh0U3RhdGUuIFdlIGxlYXZlIHJvdXRlcyBpZiBlaXRoZXJcbiAqIDEpIHRoZXkgYXJlIG5vdCBpbiB0aGUgbmV4dCBzdGF0ZSBvciAyKSB0aGV5IGFyZSBpbiB0aGUgbmV4dCBzdGF0ZVxuICogYnV0IHRoZWlyIHBhcmFtcyBoYXZlIGNoYW5nZWQgKGkuZS4gL3VzZXJzLzEyMyA9PiAvdXNlcnMvNDU2KS5cbiAqXG4gKiBsZWF2ZVJvdXRlcyBhcmUgb3JkZXJlZCBzdGFydGluZyBhdCB0aGUgbGVhZiByb3V0ZSBvZiB0aGUgdHJlZVxuICogd2UncmUgbGVhdmluZyB1cCB0byB0aGUgY29tbW9uIHBhcmVudCByb3V0ZS4gZW50ZXJSb3V0ZXMgYXJlIG9yZGVyZWRcbiAqIGZyb20gdGhlIHRvcCBvZiB0aGUgdHJlZSB3ZSdyZSBlbnRlcmluZyBkb3duIHRvIHRoZSBsZWFmIHJvdXRlLlxuICpcbiAqIGNoYW5nZVJvdXRlcyBhcmUgYW55IHJvdXRlcyB0aGF0IGRpZG4ndCBsZWF2ZSBvciBlbnRlciBkdXJpbmdcbiAqIHRoZSB0cmFuc2l0aW9uLlxuICovXG5mdW5jdGlvbiBjb21wdXRlQ2hhbmdlZFJvdXRlcyhwcmV2U3RhdGUsIG5leHRTdGF0ZSkge1xuICB2YXIgcHJldlJvdXRlcyA9IHByZXZTdGF0ZSAmJiBwcmV2U3RhdGUucm91dGVzO1xuICB2YXIgbmV4dFJvdXRlcyA9IG5leHRTdGF0ZS5yb3V0ZXM7XG5cbiAgdmFyIGxlYXZlUm91dGVzID0gdm9pZCAwLFxuICAgICAgY2hhbmdlUm91dGVzID0gdm9pZCAwLFxuICAgICAgZW50ZXJSb3V0ZXMgPSB2b2lkIDA7XG4gIGlmIChwcmV2Um91dGVzKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwYXJlbnRJc0xlYXZpbmcgPSBmYWxzZTtcbiAgICAgIGxlYXZlUm91dGVzID0gcHJldlJvdXRlcy5maWx0ZXIoZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgIGlmIChwYXJlbnRJc0xlYXZpbmcpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgaXNMZWF2aW5nID0gbmV4dFJvdXRlcy5pbmRleE9mKHJvdXRlKSA9PT0gLTEgfHwgcm91dGVQYXJhbXNDaGFuZ2VkKHJvdXRlLCBwcmV2U3RhdGUsIG5leHRTdGF0ZSk7XG4gICAgICAgICAgaWYgKGlzTGVhdmluZykgcGFyZW50SXNMZWF2aW5nID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gaXNMZWF2aW5nO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gb25MZWF2ZSBob29rcyBzdGFydCBhdCB0aGUgbGVhZiByb3V0ZS5cbiAgICAgIGxlYXZlUm91dGVzLnJldmVyc2UoKTtcblxuICAgICAgZW50ZXJSb3V0ZXMgPSBbXTtcbiAgICAgIGNoYW5nZVJvdXRlcyA9IFtdO1xuXG4gICAgICBuZXh0Um91dGVzLmZvckVhY2goZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgIHZhciBpc05ldyA9IHByZXZSb3V0ZXMuaW5kZXhPZihyb3V0ZSkgPT09IC0xO1xuICAgICAgICB2YXIgcGFyYW1zQ2hhbmdlZCA9IGxlYXZlUm91dGVzLmluZGV4T2Yocm91dGUpICE9PSAtMTtcblxuICAgICAgICBpZiAoaXNOZXcgfHwgcGFyYW1zQ2hhbmdlZCkgZW50ZXJSb3V0ZXMucHVzaChyb3V0ZSk7ZWxzZSBjaGFuZ2VSb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9IGVsc2Uge1xuICAgIGxlYXZlUm91dGVzID0gW107XG4gICAgY2hhbmdlUm91dGVzID0gW107XG4gICAgZW50ZXJSb3V0ZXMgPSBuZXh0Um91dGVzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsZWF2ZVJvdXRlczogbGVhdmVSb3V0ZXMsXG4gICAgY2hhbmdlUm91dGVzOiBjaGFuZ2VSb3V0ZXMsXG4gICAgZW50ZXJSb3V0ZXM6IGVudGVyUm91dGVzXG4gIH07XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGNvbXB1dGVDaGFuZ2VkUm91dGVzO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlTWVtb3J5SGlzdG9yeTtcblxudmFyIF91c2VRdWVyaWVzID0gcmVxdWlyZSgnaGlzdG9yeS9saWIvdXNlUXVlcmllcycpO1xuXG52YXIgX3VzZVF1ZXJpZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXNlUXVlcmllcyk7XG5cbnZhciBfdXNlQmFzZW5hbWUgPSByZXF1aXJlKCdoaXN0b3J5L2xpYi91c2VCYXNlbmFtZScpO1xuXG52YXIgX3VzZUJhc2VuYW1lMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3VzZUJhc2VuYW1lKTtcblxudmFyIF9jcmVhdGVNZW1vcnlIaXN0b3J5ID0gcmVxdWlyZSgnaGlzdG9yeS9saWIvY3JlYXRlTWVtb3J5SGlzdG9yeScpO1xuXG52YXIgX2NyZWF0ZU1lbW9yeUhpc3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlTWVtb3J5SGlzdG9yeSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGNyZWF0ZU1lbW9yeUhpc3Rvcnkob3B0aW9ucykge1xuICAvLyBzaWduYXR1cmVzIGFuZCB0eXBlIGNoZWNraW5nIGRpZmZlciBiZXR3ZWVuIGB1c2VSb3V0ZXNgIGFuZFxuICAvLyBgY3JlYXRlTWVtb3J5SGlzdG9yeWAsIGhhdmUgdG8gY3JlYXRlIGBtZW1vcnlIaXN0b3J5YCBmaXJzdCBiZWNhdXNlXG4gIC8vIGB1c2VRdWVyaWVzYCBkb2Vzbid0IHVuZGVyc3RhbmQgdGhlIHNpZ25hdHVyZVxuICB2YXIgbWVtb3J5SGlzdG9yeSA9ICgwLCBfY3JlYXRlTWVtb3J5SGlzdG9yeTIuZGVmYXVsdCkob3B0aW9ucyk7XG4gIHZhciBjcmVhdGVIaXN0b3J5ID0gZnVuY3Rpb24gY3JlYXRlSGlzdG9yeSgpIHtcbiAgICByZXR1cm4gbWVtb3J5SGlzdG9yeTtcbiAgfTtcbiAgdmFyIGhpc3RvcnkgPSAoMCwgX3VzZVF1ZXJpZXMyLmRlZmF1bHQpKCgwLCBfdXNlQmFzZW5hbWUyLmRlZmF1bHQpKGNyZWF0ZUhpc3RvcnkpKShvcHRpb25zKTtcbiAgaGlzdG9yeS5fX3YyX2NvbXBhdGlibGVfXyA9IHRydWU7XG4gIHJldHVybiBoaXN0b3J5O1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoY3JlYXRlSGlzdG9yeSkge1xuICB2YXIgaGlzdG9yeSA9IHZvaWQgMDtcbiAgaWYgKGNhblVzZURPTSkgaGlzdG9yeSA9ICgwLCBfdXNlUm91dGVySGlzdG9yeTIuZGVmYXVsdCkoY3JlYXRlSGlzdG9yeSkoKTtcbiAgcmV0dXJuIGhpc3Rvcnk7XG59O1xuXG52YXIgX3VzZVJvdXRlckhpc3RvcnkgPSByZXF1aXJlKCcuL3VzZVJvdXRlckhpc3RvcnknKTtcblxudmFyIF91c2VSb3V0ZXJIaXN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3VzZVJvdXRlckhpc3RvcnkpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgY2FuVXNlRE9NID0gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50ICYmIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVUcmFuc2l0aW9uTWFuYWdlcjtcblxudmFyIF9yb3V0ZXJXYXJuaW5nID0gcmVxdWlyZSgnLi9yb3V0ZXJXYXJuaW5nJyk7XG5cbnZhciBfcm91dGVyV2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yb3V0ZXJXYXJuaW5nKTtcblxudmFyIF9jb21wdXRlQ2hhbmdlZFJvdXRlczIgPSByZXF1aXJlKCcuL2NvbXB1dGVDaGFuZ2VkUm91dGVzJyk7XG5cbnZhciBfY29tcHV0ZUNoYW5nZWRSb3V0ZXMzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29tcHV0ZUNoYW5nZWRSb3V0ZXMyKTtcblxudmFyIF9UcmFuc2l0aW9uVXRpbHMgPSByZXF1aXJlKCcuL1RyYW5zaXRpb25VdGlscycpO1xuXG52YXIgX2lzQWN0aXZlMiA9IHJlcXVpcmUoJy4vaXNBY3RpdmUnKTtcblxudmFyIF9pc0FjdGl2ZTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc0FjdGl2ZTIpO1xuXG52YXIgX2dldENvbXBvbmVudHMgPSByZXF1aXJlKCcuL2dldENvbXBvbmVudHMnKTtcblxudmFyIF9nZXRDb21wb25lbnRzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldENvbXBvbmVudHMpO1xuXG52YXIgX21hdGNoUm91dGVzID0gcmVxdWlyZSgnLi9tYXRjaFJvdXRlcycpO1xuXG52YXIgX21hdGNoUm91dGVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hdGNoUm91dGVzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gaGFzQW55UHJvcGVydGllcyhvYmplY3QpIHtcbiAgZm9yICh2YXIgcCBpbiBvYmplY3QpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcCkpIHJldHVybiB0cnVlO1xuICB9cmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUcmFuc2l0aW9uTWFuYWdlcihoaXN0b3J5LCByb3V0ZXMpIHtcbiAgdmFyIHN0YXRlID0ge307XG5cbiAgLy8gU2lnbmF0dXJlIHNob3VsZCBiZSAobG9jYXRpb24sIGluZGV4T25seSksIGJ1dCBuZWVkcyB0byBzdXBwb3J0IChwYXRoLFxuICAvLyBxdWVyeSwgaW5kZXhPbmx5KVxuICBmdW5jdGlvbiBpc0FjdGl2ZShsb2NhdGlvbikge1xuICAgIHZhciBpbmRleE9ubHlPckRlcHJlY2F0ZWRRdWVyeSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuICAgIHZhciBkZXByZWNhdGVkSW5kZXhPbmx5ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1syXTtcblxuICAgIHZhciBpbmRleE9ubHkgPSB2b2lkIDA7XG4gICAgaWYgKGluZGV4T25seU9yRGVwcmVjYXRlZFF1ZXJ5ICYmIGluZGV4T25seU9yRGVwcmVjYXRlZFF1ZXJ5ICE9PSB0cnVlIHx8IGRlcHJlY2F0ZWRJbmRleE9ubHkgIT09IG51bGwpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX3JvdXRlcldhcm5pbmcyLmRlZmF1bHQpKGZhbHNlLCAnYGlzQWN0aXZlKHBhdGhuYW1lLCBxdWVyeSwgaW5kZXhPbmx5KSBpcyBkZXByZWNhdGVkOyB1c2UgYGlzQWN0aXZlKGxvY2F0aW9uLCBpbmRleE9ubHkpYCB3aXRoIGEgbG9jYXRpb24gZGVzY3JpcHRvciBpbnN0ZWFkLiBodHRwOi8vdGlueS5jYy9yb3V0ZXItaXNBY3RpdmVkZXByZWNhdGVkJykgOiB2b2lkIDA7XG4gICAgICBsb2NhdGlvbiA9IHsgcGF0aG5hbWU6IGxvY2F0aW9uLCBxdWVyeTogaW5kZXhPbmx5T3JEZXByZWNhdGVkUXVlcnkgfTtcbiAgICAgIGluZGV4T25seSA9IGRlcHJlY2F0ZWRJbmRleE9ubHkgfHwgZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2F0aW9uID0gaGlzdG9yeS5jcmVhdGVMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICBpbmRleE9ubHkgPSBpbmRleE9ubHlPckRlcHJlY2F0ZWRRdWVyeTtcbiAgICB9XG5cbiAgICByZXR1cm4gKDAsIF9pc0FjdGl2ZTMuZGVmYXVsdCkobG9jYXRpb24sIGluZGV4T25seSwgc3RhdGUubG9jYXRpb24sIHN0YXRlLnJvdXRlcywgc3RhdGUucGFyYW1zKTtcbiAgfVxuXG4gIHZhciBwYXJ0aWFsTmV4dFN0YXRlID0gdm9pZCAwO1xuXG4gIGZ1bmN0aW9uIG1hdGNoKGxvY2F0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmIChwYXJ0aWFsTmV4dFN0YXRlICYmIHBhcnRpYWxOZXh0U3RhdGUubG9jYXRpb24gPT09IGxvY2F0aW9uKSB7XG4gICAgICAvLyBDb250aW51ZSBmcm9tIHdoZXJlIHdlIGxlZnQgb2ZmLlxuICAgICAgZmluaXNoTWF0Y2gocGFydGlhbE5leHRTdGF0ZSwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICAoMCwgX21hdGNoUm91dGVzMi5kZWZhdWx0KShyb3V0ZXMsIGxvY2F0aW9uLCBmdW5jdGlvbiAoZXJyb3IsIG5leHRTdGF0ZSkge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgIH0gZWxzZSBpZiAobmV4dFN0YXRlKSB7XG4gICAgICAgICAgZmluaXNoTWF0Y2goX2V4dGVuZHMoe30sIG5leHRTdGF0ZSwgeyBsb2NhdGlvbjogbG9jYXRpb24gfSksIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmaW5pc2hNYXRjaChuZXh0U3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIF9jb21wdXRlQ2hhbmdlZFJvdXRlcyA9ICgwLCBfY29tcHV0ZUNoYW5nZWRSb3V0ZXMzLmRlZmF1bHQpKHN0YXRlLCBuZXh0U3RhdGUpO1xuXG4gICAgdmFyIGxlYXZlUm91dGVzID0gX2NvbXB1dGVDaGFuZ2VkUm91dGVzLmxlYXZlUm91dGVzO1xuICAgIHZhciBjaGFuZ2VSb3V0ZXMgPSBfY29tcHV0ZUNoYW5nZWRSb3V0ZXMuY2hhbmdlUm91dGVzO1xuICAgIHZhciBlbnRlclJvdXRlcyA9IF9jb21wdXRlQ2hhbmdlZFJvdXRlcy5lbnRlclJvdXRlcztcblxuXG4gICAgKDAsIF9UcmFuc2l0aW9uVXRpbHMucnVuTGVhdmVIb29rcykobGVhdmVSb3V0ZXMsIHN0YXRlKTtcblxuICAgIC8vIFRlYXIgZG93biBjb25maXJtYXRpb24gaG9va3MgZm9yIGxlZnQgcm91dGVzXG4gICAgbGVhdmVSb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgcmV0dXJuIGVudGVyUm91dGVzLmluZGV4T2Yocm91dGUpID09PSAtMTtcbiAgICB9KS5mb3JFYWNoKHJlbW92ZUxpc3RlbkJlZm9yZUhvb2tzRm9yUm91dGUpO1xuXG4gICAgLy8gY2hhbmdlIGFuZCBlbnRlciBob29rcyBhcmUgcnVuIGluIHNlcmllc1xuICAgICgwLCBfVHJhbnNpdGlvblV0aWxzLnJ1bkNoYW5nZUhvb2tzKShjaGFuZ2VSb3V0ZXMsIHN0YXRlLCBuZXh0U3RhdGUsIGZ1bmN0aW9uIChlcnJvciwgcmVkaXJlY3RJbmZvKSB7XG4gICAgICBpZiAoZXJyb3IgfHwgcmVkaXJlY3RJbmZvKSByZXR1cm4gaGFuZGxlRXJyb3JPclJlZGlyZWN0KGVycm9yLCByZWRpcmVjdEluZm8pO1xuXG4gICAgICAoMCwgX1RyYW5zaXRpb25VdGlscy5ydW5FbnRlckhvb2tzKShlbnRlclJvdXRlcywgbmV4dFN0YXRlLCBmaW5pc2hFbnRlckhvb2tzKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGZpbmlzaEVudGVySG9va3MoZXJyb3IsIHJlZGlyZWN0SW5mbykge1xuICAgICAgaWYgKGVycm9yIHx8IHJlZGlyZWN0SW5mbykgcmV0dXJuIGhhbmRsZUVycm9yT3JSZWRpcmVjdChlcnJvciwgcmVkaXJlY3RJbmZvKTtcblxuICAgICAgLy8gVE9ETzogRmV0Y2ggY29tcG9uZW50cyBhZnRlciBzdGF0ZSBpcyB1cGRhdGVkLlxuICAgICAgKDAsIF9nZXRDb21wb25lbnRzMi5kZWZhdWx0KShuZXh0U3RhdGUsIGZ1bmN0aW9uIChlcnJvciwgY29tcG9uZW50cykge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVE9ETzogTWFrZSBtYXRjaCBhIHB1cmUgZnVuY3Rpb24gYW5kIGhhdmUgc29tZSBvdGhlciBBUElcbiAgICAgICAgICAvLyBmb3IgXCJtYXRjaCBhbmQgdXBkYXRlIHN0YXRlXCIuXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgbnVsbCwgc3RhdGUgPSBfZXh0ZW5kcyh7fSwgbmV4dFN0YXRlLCB7IGNvbXBvbmVudHM6IGNvbXBvbmVudHMgfSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVFcnJvck9yUmVkaXJlY3QoZXJyb3IsIHJlZGlyZWN0SW5mbykge1xuICAgICAgaWYgKGVycm9yKSBjYWxsYmFjayhlcnJvcik7ZWxzZSBjYWxsYmFjayhudWxsLCByZWRpcmVjdEluZm8pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBSb3V0ZUd1aWQgPSAxO1xuXG4gIGZ1bmN0aW9uIGdldFJvdXRlSUQocm91dGUpIHtcbiAgICB2YXIgY3JlYXRlID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHJldHVybiByb3V0ZS5fX2lkX18gfHwgY3JlYXRlICYmIChyb3V0ZS5fX2lkX18gPSBSb3V0ZUd1aWQrKyk7XG4gIH1cblxuICB2YXIgUm91dGVIb29rcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgZnVuY3Rpb24gZ2V0Um91dGVIb29rc0ZvclJvdXRlcyhyb3V0ZXMpIHtcbiAgICByZXR1cm4gcm91dGVzLnJlZHVjZShmdW5jdGlvbiAoaG9va3MsIHJvdXRlKSB7XG4gICAgICBob29rcy5wdXNoLmFwcGx5KGhvb2tzLCBSb3V0ZUhvb2tzW2dldFJvdXRlSUQocm91dGUpXSk7XG4gICAgICByZXR1cm4gaG9va3M7XG4gICAgfSwgW10pO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhbnNpdGlvbkhvb2sobG9jYXRpb24sIGNhbGxiYWNrKSB7XG4gICAgKDAsIF9tYXRjaFJvdXRlczIuZGVmYXVsdCkocm91dGVzLCBsb2NhdGlvbiwgZnVuY3Rpb24gKGVycm9yLCBuZXh0U3RhdGUpIHtcbiAgICAgIGlmIChuZXh0U3RhdGUgPT0gbnVsbCkge1xuICAgICAgICAvLyBUT0RPOiBXZSBkaWRuJ3QgYWN0dWFsbHkgbWF0Y2ggYW55dGhpbmcsIGJ1dCBoYW5nXG4gICAgICAgIC8vIG9udG8gZXJyb3IvbmV4dFN0YXRlIHNvIHdlIGRvbid0IGhhdmUgdG8gbWF0Y2hSb3V0ZXNcbiAgICAgICAgLy8gYWdhaW4gaW4gdGhlIGxpc3RlbiBjYWxsYmFjay5cbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBDYWNoZSBzb21lIHN0YXRlIGhlcmUgc28gd2UgZG9uJ3QgaGF2ZSB0b1xuICAgICAgLy8gbWF0Y2hSb3V0ZXMoKSBhZ2FpbiBpbiB0aGUgbGlzdGVuIGNhbGxiYWNrLlxuICAgICAgcGFydGlhbE5leHRTdGF0ZSA9IF9leHRlbmRzKHt9LCBuZXh0U3RhdGUsIHsgbG9jYXRpb246IGxvY2F0aW9uIH0pO1xuXG4gICAgICB2YXIgaG9va3MgPSBnZXRSb3V0ZUhvb2tzRm9yUm91dGVzKCgwLCBfY29tcHV0ZUNoYW5nZWRSb3V0ZXMzLmRlZmF1bHQpKHN0YXRlLCBwYXJ0aWFsTmV4dFN0YXRlKS5sZWF2ZVJvdXRlcyk7XG5cbiAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gaG9va3MubGVuZ3RoOyByZXN1bHQgPT0gbnVsbCAmJiBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgLy8gUGFzc2luZyB0aGUgbG9jYXRpb24gYXJnIGhlcmUgaW5kaWNhdGVzIHRvXG4gICAgICAgIC8vIHRoZSB1c2VyIHRoYXQgdGhpcyBpcyBhIHRyYW5zaXRpb24gaG9vay5cbiAgICAgICAgcmVzdWx0ID0gaG9va3NbaV0obG9jYXRpb24pO1xuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IHVudGVzdGFibGUgd2l0aCBLYXJtYSAqL1xuICBmdW5jdGlvbiBiZWZvcmVVbmxvYWRIb29rKCkge1xuICAgIC8vIFN5bmNocm9ub3VzbHkgY2hlY2sgdG8gc2VlIGlmIGFueSByb3V0ZSBob29rcyB3YW50XG4gICAgLy8gdG8gcHJldmVudCB0aGUgY3VycmVudCB3aW5kb3cvdGFiIGZyb20gY2xvc2luZy5cbiAgICBpZiAoc3RhdGUucm91dGVzKSB7XG4gICAgICB2YXIgaG9va3MgPSBnZXRSb3V0ZUhvb2tzRm9yUm91dGVzKHN0YXRlLnJvdXRlcyk7XG5cbiAgICAgIHZhciBtZXNzYWdlID0gdm9pZCAwO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGhvb2tzLmxlbmd0aDsgdHlwZW9mIG1lc3NhZ2UgIT09ICdzdHJpbmcnICYmIGkgPCBsZW47ICsraSkge1xuICAgICAgICAvLyBQYXNzaW5nIG5vIGFyZ3MgaW5kaWNhdGVzIHRvIHRoZSB1c2VyIHRoYXQgdGhpcyBpcyBhXG4gICAgICAgIC8vIGJlZm9yZXVubG9hZCBob29rLiBXZSBkb24ndCBrbm93IHRoZSBuZXh0IGxvY2F0aW9uLlxuICAgICAgICBtZXNzYWdlID0gaG9va3NbaV0oKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuICB9XG5cbiAgdmFyIHVubGlzdGVuQmVmb3JlID0gdm9pZCAwLFxuICAgICAgdW5saXN0ZW5CZWZvcmVVbmxvYWQgPSB2b2lkIDA7XG5cbiAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuQmVmb3JlSG9va3NGb3JSb3V0ZShyb3V0ZSkge1xuICAgIHZhciByb3V0ZUlEID0gZ2V0Um91dGVJRChyb3V0ZSwgZmFsc2UpO1xuICAgIGlmICghcm91dGVJRCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlbGV0ZSBSb3V0ZUhvb2tzW3JvdXRlSURdO1xuXG4gICAgaWYgKCFoYXNBbnlQcm9wZXJ0aWVzKFJvdXRlSG9va3MpKSB7XG4gICAgICAvLyB0ZWFyZG93biB0cmFuc2l0aW9uICYgYmVmb3JldW5sb2FkIGhvb2tzXG4gICAgICBpZiAodW5saXN0ZW5CZWZvcmUpIHtcbiAgICAgICAgdW5saXN0ZW5CZWZvcmUoKTtcbiAgICAgICAgdW5saXN0ZW5CZWZvcmUgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodW5saXN0ZW5CZWZvcmVVbmxvYWQpIHtcbiAgICAgICAgdW5saXN0ZW5CZWZvcmVVbmxvYWQoKTtcbiAgICAgICAgdW5saXN0ZW5CZWZvcmVVbmxvYWQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgdGhlIGdpdmVuIGhvb2sgZnVuY3Rpb24gdG8gcnVuIGJlZm9yZSBsZWF2aW5nIHRoZSBnaXZlbiByb3V0ZS5cbiAgICpcbiAgICogRHVyaW5nIGEgbm9ybWFsIHRyYW5zaXRpb24sIHRoZSBob29rIGZ1bmN0aW9uIHJlY2VpdmVzIHRoZSBuZXh0IGxvY2F0aW9uXG4gICAqIGFzIGl0cyBvbmx5IGFyZ3VtZW50IGFuZCBjYW4gcmV0dXJuIGVpdGhlciBhIHByb21wdCBtZXNzYWdlIChzdHJpbmcpIHRvIHNob3cgdGhlIHVzZXIsXG4gICAqIHRvIG1ha2Ugc3VyZSB0aGV5IHdhbnQgdG8gbGVhdmUgdGhlIHBhZ2U7IG9yIGBmYWxzZWAsIHRvIHByZXZlbnQgdGhlIHRyYW5zaXRpb24uXG4gICAqIEFueSBvdGhlciByZXR1cm4gdmFsdWUgd2lsbCBoYXZlIG5vIGVmZmVjdC5cbiAgICpcbiAgICogRHVyaW5nIHRoZSBiZWZvcmV1bmxvYWQgZXZlbnQgKGluIGJyb3dzZXJzKSB0aGUgaG9vayByZWNlaXZlcyBubyBhcmd1bWVudHMuXG4gICAqIEluIHRoaXMgY2FzZSBpdCBtdXN0IHJldHVybiBhIHByb21wdCBtZXNzYWdlIHRvIHByZXZlbnQgdGhlIHRyYW5zaXRpb24uXG4gICAqXG4gICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IG1heSBiZSB1c2VkIHRvIHVuYmluZCB0aGUgbGlzdGVuZXIuXG4gICAqL1xuICBmdW5jdGlvbiBsaXN0ZW5CZWZvcmVMZWF2aW5nUm91dGUocm91dGUsIGhvb2spIHtcbiAgICAvLyBUT0RPOiBXYXJuIGlmIHRoZXkgcmVnaXN0ZXIgZm9yIGEgcm91dGUgdGhhdCBpc24ndCBjdXJyZW50bHlcbiAgICAvLyBhY3RpdmUuIFRoZXkncmUgcHJvYmFibHkgZG9pbmcgc29tZXRoaW5nIHdyb25nLCBsaWtlIHJlLWNyZWF0aW5nXG4gICAgLy8gcm91dGUgb2JqZWN0cyBvbiBldmVyeSBsb2NhdGlvbiBjaGFuZ2UuXG4gICAgdmFyIHJvdXRlSUQgPSBnZXRSb3V0ZUlEKHJvdXRlKTtcbiAgICB2YXIgaG9va3MgPSBSb3V0ZUhvb2tzW3JvdXRlSURdO1xuXG4gICAgaWYgKCFob29rcykge1xuICAgICAgdmFyIHRoZXJlV2VyZU5vUm91dGVIb29rcyA9ICFoYXNBbnlQcm9wZXJ0aWVzKFJvdXRlSG9va3MpO1xuXG4gICAgICBSb3V0ZUhvb2tzW3JvdXRlSURdID0gW2hvb2tdO1xuXG4gICAgICBpZiAodGhlcmVXZXJlTm9Sb3V0ZUhvb2tzKSB7XG4gICAgICAgIC8vIHNldHVwIHRyYW5zaXRpb24gJiBiZWZvcmV1bmxvYWQgaG9va3NcbiAgICAgICAgdW5saXN0ZW5CZWZvcmUgPSBoaXN0b3J5Lmxpc3RlbkJlZm9yZSh0cmFuc2l0aW9uSG9vayk7XG5cbiAgICAgICAgaWYgKGhpc3RvcnkubGlzdGVuQmVmb3JlVW5sb2FkKSB1bmxpc3RlbkJlZm9yZVVubG9hZCA9IGhpc3RvcnkubGlzdGVuQmVmb3JlVW5sb2FkKGJlZm9yZVVubG9hZEhvb2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaG9va3MuaW5kZXhPZihob29rKSA9PT0gLTEpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkoZmFsc2UsICdhZGRpbmcgbXVsdGlwbGUgbGVhdmUgaG9va3MgZm9yIHRoZSBzYW1lIHJvdXRlIGlzIGRlcHJlY2F0ZWQ7IG1hbmFnZSBtdWx0aXBsZSBjb25maXJtYXRpb25zIGluIHlvdXIgb3duIGNvZGUgaW5zdGVhZCcpIDogdm9pZCAwO1xuXG4gICAgICAgIGhvb2tzLnB1c2goaG9vayk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBob29rcyA9IFJvdXRlSG9va3Nbcm91dGVJRF07XG5cbiAgICAgIGlmIChob29rcykge1xuICAgICAgICB2YXIgbmV3SG9va3MgPSBob29rcy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbSAhPT0gaG9vaztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG5ld0hvb2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbkJlZm9yZUhvb2tzRm9yUm91dGUocm91dGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFJvdXRlSG9va3Nbcm91dGVJRF0gPSBuZXdIb29rcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgQVBJIGZvciBzdGF0ZWZ1bCBlbnZpcm9ubWVudHMuIEFzIHRoZSBsb2NhdGlvblxuICAgKiBjaGFuZ2VzLCB3ZSB1cGRhdGUgc3RhdGUgYW5kIGNhbGwgdGhlIGxpc3RlbmVyLiBXZSBjYW4gYWxzb1xuICAgKiBncmFjZWZ1bGx5IGhhbmRsZSBlcnJvcnMgYW5kIHJlZGlyZWN0cy5cbiAgICovXG4gIGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgIC8vIFRPRE86IE9ubHkgdXNlIGEgc2luZ2xlIGhpc3RvcnkgbGlzdGVuZXIuIE90aGVyd2lzZSB3ZSdsbFxuICAgIC8vIGVuZCB1cCB3aXRoIG11bHRpcGxlIGNvbmN1cnJlbnQgY2FsbHMgdG8gbWF0Y2guXG4gICAgcmV0dXJuIGhpc3RvcnkubGlzdGVuKGZ1bmN0aW9uIChsb2NhdGlvbikge1xuICAgICAgaWYgKHN0YXRlLmxvY2F0aW9uID09PSBsb2NhdGlvbikge1xuICAgICAgICBsaXN0ZW5lcihudWxsLCBzdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXRjaChsb2NhdGlvbiwgZnVuY3Rpb24gKGVycm9yLCByZWRpcmVjdExvY2F0aW9uLCBuZXh0U3RhdGUpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyKGVycm9yKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlZGlyZWN0TG9jYXRpb24pIHtcbiAgICAgICAgICAgIGhpc3RvcnkucmVwbGFjZShyZWRpcmVjdExvY2F0aW9uKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG5leHRTdGF0ZSkge1xuICAgICAgICAgICAgbGlzdGVuZXIobnVsbCwgbmV4dFN0YXRlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkoZmFsc2UsICdMb2NhdGlvbiBcIiVzXCIgZGlkIG5vdCBtYXRjaCBhbnkgcm91dGVzJywgbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2ggKyBsb2NhdGlvbi5oYXNoKSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpc0FjdGl2ZTogaXNBY3RpdmUsXG4gICAgbWF0Y2g6IG1hdGNoLFxuICAgIGxpc3RlbkJlZm9yZUxlYXZpbmdSb3V0ZTogbGlzdGVuQmVmb3JlTGVhdmluZ1JvdXRlLFxuICAgIGxpc3RlbjogbGlzdGVuXG4gIH07XG59XG5cbi8vZXhwb3J0IGRlZmF1bHQgdXNlUm91dGVzXG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuY2FuVXNlTWVtYnJhbmUgPSB1bmRlZmluZWQ7XG5cbnZhciBfcm91dGVyV2FybmluZyA9IHJlcXVpcmUoJy4vcm91dGVyV2FybmluZycpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcm91dGVyV2FybmluZyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBjYW5Vc2VNZW1icmFuZSA9IGV4cG9ydHMuY2FuVXNlTWVtYnJhbmUgPSBmYWxzZTtcblxuLy8gTm8tb3AgYnkgZGVmYXVsdC5cbnZhciBkZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVwcmVjYXRlT2JqZWN0UHJvcGVydGllcyhvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHRyeSB7XG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ3gnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSkueCkge1xuICAgICAgZXhwb3J0cy5jYW5Vc2VNZW1icmFuZSA9IGNhblVzZU1lbWJyYW5lID0gdHJ1ZTtcbiAgICB9XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tZW1wdHkgKi9cbiAgfSBjYXRjaCAoZSkge31cbiAgLyogZXNsaW50LWVuYWJsZSBuby1lbXB0eSAqL1xuXG4gIGlmIChjYW5Vc2VNZW1icmFuZSkge1xuICAgIGRlcHJlY2F0ZU9iamVjdFByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzKG9iamVjdCwgbWVzc2FnZSkge1xuICAgICAgLy8gV3JhcCB0aGUgZGVwcmVjYXRlZCBvYmplY3QgaW4gYSBtZW1icmFuZSB0byB3YXJuIG9uIHByb3BlcnR5IGFjY2Vzcy5cbiAgICAgIHZhciBtZW1icmFuZSA9IHt9O1xuXG4gICAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChwcm9wKSB7XG4gICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcCkpIHtcbiAgICAgICAgICByZXR1cm4gJ2NvbnRpbnVlJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0W3Byb3BdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgLy8gQ2FuJ3QgdXNlIGZhdCBhcnJvdyBoZXJlIGJlY2F1c2Ugb2YgdXNlIG9mIGFyZ3VtZW50cyBiZWxvdy5cbiAgICAgICAgICBtZW1icmFuZVtwcm9wXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX3JvdXRlcldhcm5pbmcyLmRlZmF1bHQpKGZhbHNlLCBtZXNzYWdlKSA6IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiBvYmplY3RbcHJvcF0uYXBwbHkob2JqZWN0LCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuICdjb250aW51ZSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGVzZSBwcm9wZXJ0aWVzIGFyZSBub24tZW51bWVyYWJsZSB0byBwcmV2ZW50IFJlYWN0IGRldiB0b29scyBmcm9tXG4gICAgICAgIC8vIHNlZWluZyB0aGVtIGFuZCBjYXVzaW5nIHNwdXJpb3VzIHdhcm5pbmdzIHdoZW4gYWNjZXNzaW5nIHRoZW0uIEluXG4gICAgICAgIC8vIHByaW5jaXBsZSB0aGlzIGNvdWxkIGJlIGRvbmUgd2l0aCBhIHByb3h5LCBidXQgc3VwcG9ydCBmb3IgdGhlXG4gICAgICAgIC8vIG93bktleXMgdHJhcCBvbiBwcm94aWVzIGlzIG5vdCB1bml2ZXJzYWwsIGV2ZW4gYW1vbmcgYnJvd3NlcnMgdGhhdFxuICAgICAgICAvLyBvdGhlcndpc2Ugc3VwcG9ydCBwcm94aWVzLlxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobWVtYnJhbmUsIHByb3AsIHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX3JvdXRlcldhcm5pbmcyLmRlZmF1bHQpKGZhbHNlLCBtZXNzYWdlKSA6IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiBvYmplY3RbcHJvcF07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqZWN0KSB7XG4gICAgICAgIHZhciBfcmV0ID0gX2xvb3AocHJvcCk7XG5cbiAgICAgICAgaWYgKF9yZXQgPT09ICdjb250aW51ZScpIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWVtYnJhbmU7XG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnRzLmRlZmF1bHQgPSBkZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9Bc3luY1V0aWxzID0gcmVxdWlyZSgnLi9Bc3luY1V0aWxzJyk7XG5cbnZhciBfbWFrZVN0YXRlV2l0aExvY2F0aW9uID0gcmVxdWlyZSgnLi9tYWtlU3RhdGVXaXRoTG9jYXRpb24nKTtcblxudmFyIF9tYWtlU3RhdGVXaXRoTG9jYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFrZVN0YXRlV2l0aExvY2F0aW9uKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50c0ZvclJvdXRlKG5leHRTdGF0ZSwgcm91dGUsIGNhbGxiYWNrKSB7XG4gIGlmIChyb3V0ZS5jb21wb25lbnQgfHwgcm91dGUuY29tcG9uZW50cykge1xuICAgIGNhbGxiYWNrKG51bGwsIHJvdXRlLmNvbXBvbmVudCB8fCByb3V0ZS5jb21wb25lbnRzKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgZ2V0Q29tcG9uZW50ID0gcm91dGUuZ2V0Q29tcG9uZW50IHx8IHJvdXRlLmdldENvbXBvbmVudHM7XG4gIGlmICghZ2V0Q29tcG9uZW50KSB7XG4gICAgY2FsbGJhY2soKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbG9jYXRpb24gPSBuZXh0U3RhdGUubG9jYXRpb247XG5cbiAgdmFyIG5leHRTdGF0ZVdpdGhMb2NhdGlvbiA9ICgwLCBfbWFrZVN0YXRlV2l0aExvY2F0aW9uMi5kZWZhdWx0KShuZXh0U3RhdGUsIGxvY2F0aW9uKTtcblxuICBnZXRDb21wb25lbnQuY2FsbChyb3V0ZSwgbmV4dFN0YXRlV2l0aExvY2F0aW9uLCBjYWxsYmFjayk7XG59XG5cbi8qKlxuICogQXN5bmNocm9ub3VzbHkgZmV0Y2hlcyBhbGwgY29tcG9uZW50cyBuZWVkZWQgZm9yIHRoZSBnaXZlbiByb3V0ZXJcbiAqIHN0YXRlIGFuZCBjYWxscyBjYWxsYmFjayhlcnJvciwgY29tcG9uZW50cykgd2hlbiBmaW5pc2hlZC5cbiAqXG4gKiBOb3RlOiBUaGlzIG9wZXJhdGlvbiBtYXkgZmluaXNoIHN5bmNocm9ub3VzbHkgaWYgbm8gcm91dGVzIGhhdmUgYW5cbiAqIGFzeW5jaHJvbm91cyBnZXRDb21wb25lbnRzIG1ldGhvZC5cbiAqL1xuZnVuY3Rpb24gZ2V0Q29tcG9uZW50cyhuZXh0U3RhdGUsIGNhbGxiYWNrKSB7XG4gICgwLCBfQXN5bmNVdGlscy5tYXBBc3luYykobmV4dFN0YXRlLnJvdXRlcywgZnVuY3Rpb24gKHJvdXRlLCBpbmRleCwgY2FsbGJhY2spIHtcbiAgICBnZXRDb21wb25lbnRzRm9yUm91dGUobmV4dFN0YXRlLCByb3V0ZSwgY2FsbGJhY2spO1xuICB9LCBjYWxsYmFjayk7XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGdldENvbXBvbmVudHM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfUGF0dGVyblV0aWxzID0gcmVxdWlyZSgnLi9QYXR0ZXJuVXRpbHMnKTtcblxuLyoqXG4gKiBFeHRyYWN0cyBhbiBvYmplY3Qgb2YgcGFyYW1zIHRoZSBnaXZlbiByb3V0ZSBjYXJlcyBhYm91dCBmcm9tXG4gKiB0aGUgZ2l2ZW4gcGFyYW1zIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gZ2V0Um91dGVQYXJhbXMocm91dGUsIHBhcmFtcykge1xuICB2YXIgcm91dGVQYXJhbXMgPSB7fTtcblxuICBpZiAoIXJvdXRlLnBhdGgpIHJldHVybiByb3V0ZVBhcmFtcztcblxuICAoMCwgX1BhdHRlcm5VdGlscy5nZXRQYXJhbU5hbWVzKShyb3V0ZS5wYXRoKS5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJhbXMsIHApKSB7XG4gICAgICByb3V0ZVBhcmFtc1twXSA9IHBhcmFtc1twXTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiByb3V0ZVBhcmFtcztcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZ2V0Um91dGVQYXJhbXM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfY3JlYXRlSGFzaEhpc3RvcnkgPSByZXF1aXJlKCdoaXN0b3J5L2xpYi9jcmVhdGVIYXNoSGlzdG9yeScpO1xuXG52YXIgX2NyZWF0ZUhhc2hIaXN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUhhc2hIaXN0b3J5KTtcblxudmFyIF9jcmVhdGVSb3V0ZXJIaXN0b3J5ID0gcmVxdWlyZSgnLi9jcmVhdGVSb3V0ZXJIaXN0b3J5Jyk7XG5cbnZhciBfY3JlYXRlUm91dGVySGlzdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVSb3V0ZXJIaXN0b3J5KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9jcmVhdGVSb3V0ZXJIaXN0b3J5Mi5kZWZhdWx0KShfY3JlYXRlSGFzaEhpc3RvcnkyLmRlZmF1bHQpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5jcmVhdGVNZW1vcnlIaXN0b3J5ID0gZXhwb3J0cy5oYXNoSGlzdG9yeSA9IGV4cG9ydHMuYnJvd3Nlckhpc3RvcnkgPSBleHBvcnRzLmFwcGx5Um91dGVyTWlkZGxld2FyZSA9IGV4cG9ydHMuZm9ybWF0UGF0dGVybiA9IGV4cG9ydHMudXNlUm91dGVySGlzdG9yeSA9IGV4cG9ydHMubWF0Y2ggPSBleHBvcnRzLnJvdXRlclNoYXBlID0gZXhwb3J0cy5sb2NhdGlvblNoYXBlID0gZXhwb3J0cy5Qcm9wVHlwZXMgPSBleHBvcnRzLlJvdXRpbmdDb250ZXh0ID0gZXhwb3J0cy5Sb3V0ZXJDb250ZXh0ID0gZXhwb3J0cy5jcmVhdGVSb3V0ZXMgPSBleHBvcnRzLnVzZVJvdXRlcyA9IGV4cG9ydHMuUm91dGVDb250ZXh0ID0gZXhwb3J0cy5MaWZlY3ljbGUgPSBleHBvcnRzLkhpc3RvcnkgPSBleHBvcnRzLlJvdXRlID0gZXhwb3J0cy5SZWRpcmVjdCA9IGV4cG9ydHMuSW5kZXhSb3V0ZSA9IGV4cG9ydHMuSW5kZXhSZWRpcmVjdCA9IGV4cG9ydHMud2l0aFJvdXRlciA9IGV4cG9ydHMuSW5kZXhMaW5rID0gZXhwb3J0cy5MaW5rID0gZXhwb3J0cy5Sb3V0ZXIgPSB1bmRlZmluZWQ7XG5cbnZhciBfUm91dGVVdGlscyA9IHJlcXVpcmUoJy4vUm91dGVVdGlscycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NyZWF0ZVJvdXRlcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9Sb3V0ZVV0aWxzLmNyZWF0ZVJvdXRlcztcbiAgfVxufSk7XG5cbnZhciBfUHJvcFR5cGVzMiA9IHJlcXVpcmUoJy4vUHJvcFR5cGVzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnbG9jYXRpb25TaGFwZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9Qcm9wVHlwZXMyLmxvY2F0aW9uU2hhcGU7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdyb3V0ZXJTaGFwZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9Qcm9wVHlwZXMyLnJvdXRlclNoYXBlO1xuICB9XG59KTtcblxudmFyIF9QYXR0ZXJuVXRpbHMgPSByZXF1aXJlKCcuL1BhdHRlcm5VdGlscycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2Zvcm1hdFBhdHRlcm4nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfUGF0dGVyblV0aWxzLmZvcm1hdFBhdHRlcm47XG4gIH1cbn0pO1xuXG52YXIgX1JvdXRlcjIgPSByZXF1aXJlKCcuL1JvdXRlcicpO1xuXG52YXIgX1JvdXRlcjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Sb3V0ZXIyKTtcblxudmFyIF9MaW5rMiA9IHJlcXVpcmUoJy4vTGluaycpO1xuXG52YXIgX0xpbmszID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfTGluazIpO1xuXG52YXIgX0luZGV4TGluazIgPSByZXF1aXJlKCcuL0luZGV4TGluaycpO1xuXG52YXIgX0luZGV4TGluazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9JbmRleExpbmsyKTtcblxudmFyIF93aXRoUm91dGVyMiA9IHJlcXVpcmUoJy4vd2l0aFJvdXRlcicpO1xuXG52YXIgX3dpdGhSb3V0ZXIzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2l0aFJvdXRlcjIpO1xuXG52YXIgX0luZGV4UmVkaXJlY3QyID0gcmVxdWlyZSgnLi9JbmRleFJlZGlyZWN0Jyk7XG5cbnZhciBfSW5kZXhSZWRpcmVjdDMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9JbmRleFJlZGlyZWN0Mik7XG5cbnZhciBfSW5kZXhSb3V0ZTIgPSByZXF1aXJlKCcuL0luZGV4Um91dGUnKTtcblxudmFyIF9JbmRleFJvdXRlMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0luZGV4Um91dGUyKTtcblxudmFyIF9SZWRpcmVjdDIgPSByZXF1aXJlKCcuL1JlZGlyZWN0Jyk7XG5cbnZhciBfUmVkaXJlY3QzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUmVkaXJlY3QyKTtcblxudmFyIF9Sb3V0ZTIgPSByZXF1aXJlKCcuL1JvdXRlJyk7XG5cbnZhciBfUm91dGUzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUm91dGUyKTtcblxudmFyIF9IaXN0b3J5MiA9IHJlcXVpcmUoJy4vSGlzdG9yeScpO1xuXG52YXIgX0hpc3RvcnkzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfSGlzdG9yeTIpO1xuXG52YXIgX0xpZmVjeWNsZTIgPSByZXF1aXJlKCcuL0xpZmVjeWNsZScpO1xuXG52YXIgX0xpZmVjeWNsZTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9MaWZlY3ljbGUyKTtcblxudmFyIF9Sb3V0ZUNvbnRleHQyID0gcmVxdWlyZSgnLi9Sb3V0ZUNvbnRleHQnKTtcblxudmFyIF9Sb3V0ZUNvbnRleHQzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUm91dGVDb250ZXh0Mik7XG5cbnZhciBfdXNlUm91dGVzMiA9IHJlcXVpcmUoJy4vdXNlUm91dGVzJyk7XG5cbnZhciBfdXNlUm91dGVzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3VzZVJvdXRlczIpO1xuXG52YXIgX1JvdXRlckNvbnRleHQyID0gcmVxdWlyZSgnLi9Sb3V0ZXJDb250ZXh0Jyk7XG5cbnZhciBfUm91dGVyQ29udGV4dDMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Sb3V0ZXJDb250ZXh0Mik7XG5cbnZhciBfUm91dGluZ0NvbnRleHQyID0gcmVxdWlyZSgnLi9Sb3V0aW5nQ29udGV4dCcpO1xuXG52YXIgX1JvdXRpbmdDb250ZXh0MyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1JvdXRpbmdDb250ZXh0Mik7XG5cbnZhciBfUHJvcFR5cGVzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1Byb3BUeXBlczIpO1xuXG52YXIgX21hdGNoMiA9IHJlcXVpcmUoJy4vbWF0Y2gnKTtcblxudmFyIF9tYXRjaDMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXRjaDIpO1xuXG52YXIgX3VzZVJvdXRlckhpc3RvcnkyID0gcmVxdWlyZSgnLi91c2VSb3V0ZXJIaXN0b3J5Jyk7XG5cbnZhciBfdXNlUm91dGVySGlzdG9yeTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91c2VSb3V0ZXJIaXN0b3J5Mik7XG5cbnZhciBfYXBwbHlSb3V0ZXJNaWRkbGV3YXJlMiA9IHJlcXVpcmUoJy4vYXBwbHlSb3V0ZXJNaWRkbGV3YXJlJyk7XG5cbnZhciBfYXBwbHlSb3V0ZXJNaWRkbGV3YXJlMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FwcGx5Um91dGVyTWlkZGxld2FyZTIpO1xuXG52YXIgX2Jyb3dzZXJIaXN0b3J5MiA9IHJlcXVpcmUoJy4vYnJvd3Nlckhpc3RvcnknKTtcblxudmFyIF9icm93c2VySGlzdG9yeTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9icm93c2VySGlzdG9yeTIpO1xuXG52YXIgX2hhc2hIaXN0b3J5MiA9IHJlcXVpcmUoJy4vaGFzaEhpc3RvcnknKTtcblxudmFyIF9oYXNoSGlzdG9yeTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYXNoSGlzdG9yeTIpO1xuXG52YXIgX2NyZWF0ZU1lbW9yeUhpc3RvcnkyID0gcmVxdWlyZSgnLi9jcmVhdGVNZW1vcnlIaXN0b3J5Jyk7XG5cbnZhciBfY3JlYXRlTWVtb3J5SGlzdG9yeTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVNZW1vcnlIaXN0b3J5Mik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuUm91dGVyID0gX1JvdXRlcjMuZGVmYXVsdDsgLyogY29tcG9uZW50cyAqL1xuXG5leHBvcnRzLkxpbmsgPSBfTGluazMuZGVmYXVsdDtcbmV4cG9ydHMuSW5kZXhMaW5rID0gX0luZGV4TGluazMuZGVmYXVsdDtcbmV4cG9ydHMud2l0aFJvdXRlciA9IF93aXRoUm91dGVyMy5kZWZhdWx0O1xuXG4vKiBjb21wb25lbnRzIChjb25maWd1cmF0aW9uKSAqL1xuXG5leHBvcnRzLkluZGV4UmVkaXJlY3QgPSBfSW5kZXhSZWRpcmVjdDMuZGVmYXVsdDtcbmV4cG9ydHMuSW5kZXhSb3V0ZSA9IF9JbmRleFJvdXRlMy5kZWZhdWx0O1xuZXhwb3J0cy5SZWRpcmVjdCA9IF9SZWRpcmVjdDMuZGVmYXVsdDtcbmV4cG9ydHMuUm91dGUgPSBfUm91dGUzLmRlZmF1bHQ7XG5cbi8qIG1peGlucyAqL1xuXG5leHBvcnRzLkhpc3RvcnkgPSBfSGlzdG9yeTMuZGVmYXVsdDtcbmV4cG9ydHMuTGlmZWN5Y2xlID0gX0xpZmVjeWNsZTMuZGVmYXVsdDtcbmV4cG9ydHMuUm91dGVDb250ZXh0ID0gX1JvdXRlQ29udGV4dDMuZGVmYXVsdDtcblxuLyogdXRpbHMgKi9cblxuZXhwb3J0cy51c2VSb3V0ZXMgPSBfdXNlUm91dGVzMy5kZWZhdWx0O1xuZXhwb3J0cy5Sb3V0ZXJDb250ZXh0ID0gX1JvdXRlckNvbnRleHQzLmRlZmF1bHQ7XG5leHBvcnRzLlJvdXRpbmdDb250ZXh0ID0gX1JvdXRpbmdDb250ZXh0My5kZWZhdWx0O1xuZXhwb3J0cy5Qcm9wVHlwZXMgPSBfUHJvcFR5cGVzMy5kZWZhdWx0O1xuZXhwb3J0cy5tYXRjaCA9IF9tYXRjaDMuZGVmYXVsdDtcbmV4cG9ydHMudXNlUm91dGVySGlzdG9yeSA9IF91c2VSb3V0ZXJIaXN0b3J5My5kZWZhdWx0O1xuZXhwb3J0cy5hcHBseVJvdXRlck1pZGRsZXdhcmUgPSBfYXBwbHlSb3V0ZXJNaWRkbGV3YXJlMy5kZWZhdWx0O1xuXG4vKiBoaXN0b3JpZXMgKi9cblxuZXhwb3J0cy5icm93c2VySGlzdG9yeSA9IF9icm93c2VySGlzdG9yeTMuZGVmYXVsdDtcbmV4cG9ydHMuaGFzaEhpc3RvcnkgPSBfaGFzaEhpc3RvcnkzLmRlZmF1bHQ7XG5leHBvcnRzLmNyZWF0ZU1lbW9yeUhpc3RvcnkgPSBfY3JlYXRlTWVtb3J5SGlzdG9yeTMuZGVmYXVsdDsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBpc0FjdGl2ZTtcblxudmFyIF9QYXR0ZXJuVXRpbHMgPSByZXF1aXJlKCcuL1BhdHRlcm5VdGlscycpO1xuXG5mdW5jdGlvbiBkZWVwRXF1YWwoYSwgYikge1xuICBpZiAoYSA9PSBiKSByZXR1cm4gdHJ1ZTtcblxuICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGEpKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYikgJiYgYS5sZW5ndGggPT09IGIubGVuZ3RoICYmIGEuZXZlcnkoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICByZXR1cm4gZGVlcEVxdWFsKGl0ZW0sIGJbaW5kZXhdKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmICgodHlwZW9mIGEgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGEpKSA9PT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKHZhciBwIGluIGEpIHtcbiAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIHApKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoYVtwXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChiW3BdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCFkZWVwRXF1YWwoYVtwXSwgYltwXSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIFN0cmluZyhhKSA9PT0gU3RyaW5nKGIpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgY3VycmVudCBwYXRobmFtZSBtYXRjaGVzIHRoZSBzdXBwbGllZCBvbmUsIG5ldCBvZlxuICogbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2ggbm9ybWFsaXphdGlvbi4gVGhpcyBpcyBzdWZmaWNpZW50IGZvciBhblxuICogaW5kZXhPbmx5IHJvdXRlIG1hdGNoLlxuICovXG5mdW5jdGlvbiBwYXRoSXNBY3RpdmUocGF0aG5hbWUsIGN1cnJlbnRQYXRobmFtZSkge1xuICAvLyBOb3JtYWxpemUgbGVhZGluZyBzbGFzaCBmb3IgY29uc2lzdGVuY3kuIExlYWRpbmcgc2xhc2ggb24gcGF0aG5hbWUgaGFzXG4gIC8vIGFscmVhZHkgYmVlbiBub3JtYWxpemVkIGluIGlzQWN0aXZlLiBTZWUgY2F2ZWF0IHRoZXJlLlxuICBpZiAoY3VycmVudFBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgY3VycmVudFBhdGhuYW1lID0gJy8nICsgY3VycmVudFBhdGhuYW1lO1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBlbmQgb2YgYm90aCBwYXRoIG5hbWVzIHRvby4gTWF5YmUgYC9mb28vYCBzaG91bGRuJ3Qgc2hvd1xuICAvLyBgL2Zvb2AgYXMgYWN0aXZlLCBidXQgaW4gdGhpcyBjYXNlLCB3ZSB3b3VsZCBhbHJlYWR5IGhhdmUgZmFpbGVkIHRoZVxuICAvLyBtYXRjaC5cbiAgaWYgKHBhdGhuYW1lLmNoYXJBdChwYXRobmFtZS5sZW5ndGggLSAxKSAhPT0gJy8nKSB7XG4gICAgcGF0aG5hbWUgKz0gJy8nO1xuICB9XG4gIGlmIChjdXJyZW50UGF0aG5hbWUuY2hhckF0KGN1cnJlbnRQYXRobmFtZS5sZW5ndGggLSAxKSAhPT0gJy8nKSB7XG4gICAgY3VycmVudFBhdGhuYW1lICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiBjdXJyZW50UGF0aG5hbWUgPT09IHBhdGhuYW1lO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gcGF0aG5hbWUgbWF0Y2hlcyB0aGUgYWN0aXZlIHJvdXRlcyBhbmQgcGFyYW1zLlxuICovXG5mdW5jdGlvbiByb3V0ZUlzQWN0aXZlKHBhdGhuYW1lLCByb3V0ZXMsIHBhcmFtcykge1xuICB2YXIgcmVtYWluaW5nUGF0aG5hbWUgPSBwYXRobmFtZSxcbiAgICAgIHBhcmFtTmFtZXMgPSBbXSxcbiAgICAgIHBhcmFtVmFsdWVzID0gW107XG5cbiAgLy8gZm9yLi4ub2Ygd291bGQgd29yayBoZXJlIGJ1dCBpdCdzIHByb2JhYmx5IHNsb3dlciBwb3N0LXRyYW5zcGlsYXRpb24uXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSByb3V0ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgcm91dGUgPSByb3V0ZXNbaV07XG4gICAgdmFyIHBhdHRlcm4gPSByb3V0ZS5wYXRoIHx8ICcnO1xuXG4gICAgaWYgKHBhdHRlcm4uY2hhckF0KDApID09PSAnLycpIHtcbiAgICAgIHJlbWFpbmluZ1BhdGhuYW1lID0gcGF0aG5hbWU7XG4gICAgICBwYXJhbU5hbWVzID0gW107XG4gICAgICBwYXJhbVZhbHVlcyA9IFtdO1xuICAgIH1cblxuICAgIGlmIChyZW1haW5pbmdQYXRobmFtZSAhPT0gbnVsbCAmJiBwYXR0ZXJuKSB7XG4gICAgICB2YXIgbWF0Y2hlZCA9ICgwLCBfUGF0dGVyblV0aWxzLm1hdGNoUGF0dGVybikocGF0dGVybiwgcmVtYWluaW5nUGF0aG5hbWUpO1xuICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgcmVtYWluaW5nUGF0aG5hbWUgPSBtYXRjaGVkLnJlbWFpbmluZ1BhdGhuYW1lO1xuICAgICAgICBwYXJhbU5hbWVzID0gW10uY29uY2F0KHBhcmFtTmFtZXMsIG1hdGNoZWQucGFyYW1OYW1lcyk7XG4gICAgICAgIHBhcmFtVmFsdWVzID0gW10uY29uY2F0KHBhcmFtVmFsdWVzLCBtYXRjaGVkLnBhcmFtVmFsdWVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ1BhdGhuYW1lID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlbWFpbmluZ1BhdGhuYW1lID09PSAnJykge1xuICAgICAgICAvLyBXZSBoYXZlIGFuIGV4YWN0IG1hdGNoIG9uIHRoZSByb3V0ZS4gSnVzdCBjaGVjayB0aGF0IGFsbCB0aGUgcGFyYW1zXG4gICAgICAgIC8vIG1hdGNoLlxuICAgICAgICAvLyBGSVhNRTogVGhpcyBkb2Vzbid0IHdvcmsgb24gcmVwZWF0ZWQgcGFyYW1zLlxuICAgICAgICByZXR1cm4gcGFyYW1OYW1lcy5ldmVyeShmdW5jdGlvbiAocGFyYW1OYW1lLCBpbmRleCkge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcocGFyYW1WYWx1ZXNbaW5kZXhdKSA9PT0gU3RyaW5nKHBhcmFtc1twYXJhbU5hbWVdKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBhbGwga2V5L3ZhbHVlIHBhaXJzIGluIHRoZSBnaXZlbiBxdWVyeSBhcmVcbiAqIGN1cnJlbnRseSBhY3RpdmUuXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5SXNBY3RpdmUocXVlcnksIGFjdGl2ZVF1ZXJ5KSB7XG4gIGlmIChhY3RpdmVRdWVyeSA9PSBudWxsKSByZXR1cm4gcXVlcnkgPT0gbnVsbDtcblxuICBpZiAocXVlcnkgPT0gbnVsbCkgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGRlZXBFcXVhbChxdWVyeSwgYWN0aXZlUXVlcnkpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBhIDxMaW5rPiB0byB0aGUgZ2l2ZW4gcGF0aG5hbWUvcXVlcnkgY29tYmluYXRpb24gaXNcbiAqIGN1cnJlbnRseSBhY3RpdmUuXG4gKi9cbmZ1bmN0aW9uIGlzQWN0aXZlKF9yZWYsIGluZGV4T25seSwgY3VycmVudExvY2F0aW9uLCByb3V0ZXMsIHBhcmFtcykge1xuICB2YXIgcGF0aG5hbWUgPSBfcmVmLnBhdGhuYW1lO1xuICB2YXIgcXVlcnkgPSBfcmVmLnF1ZXJ5O1xuXG4gIGlmIChjdXJyZW50TG9jYXRpb24gPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFRPRE86IFRoaXMgaXMgYSBiaXQgdWdseS4gSXQga2VlcHMgYXJvdW5kIHN1cHBvcnQgZm9yIHRyZWF0aW5nIHBhdGhuYW1lc1xuICAvLyB3aXRob3V0IHByZWNlZGluZyBzbGFzaGVzIGFzIGFic29sdXRlIHBhdGhzLCBidXQgcG9zc2libHkgYWxzbyB3b3Jrc1xuICAvLyBhcm91bmQgdGhlIHNhbWUgcXVpcmtzIHdpdGggYmFzZW5hbWVzIGFzIGluIG1hdGNoUm91dGVzLlxuICBpZiAocGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycpIHtcbiAgICBwYXRobmFtZSA9ICcvJyArIHBhdGhuYW1lO1xuICB9XG5cbiAgaWYgKCFwYXRoSXNBY3RpdmUocGF0aG5hbWUsIGN1cnJlbnRMb2NhdGlvbi5wYXRobmFtZSkpIHtcbiAgICAvLyBUaGUgcGF0aCBjaGVjayBpcyBuZWNlc3NhcnkgYW5kIHN1ZmZpY2llbnQgZm9yIGluZGV4T25seSwgYnV0IG90aGVyd2lzZVxuICAgIC8vIHdlIHN0aWxsIG5lZWQgdG8gY2hlY2sgdGhlIHJvdXRlcy5cbiAgICBpZiAoaW5kZXhPbmx5IHx8ICFyb3V0ZUlzQWN0aXZlKHBhdGhuYW1lLCByb3V0ZXMsIHBhcmFtcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcXVlcnlJc0FjdGl2ZShxdWVyeSwgY3VycmVudExvY2F0aW9uLnF1ZXJ5KTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gbWFrZVN0YXRlV2l0aExvY2F0aW9uO1xuXG52YXIgX2RlcHJlY2F0ZU9iamVjdFByb3BlcnRpZXMgPSByZXF1aXJlKCcuL2RlcHJlY2F0ZU9iamVjdFByb3BlcnRpZXMnKTtcblxudmFyIF9yb3V0ZXJXYXJuaW5nID0gcmVxdWlyZSgnLi9yb3V0ZXJXYXJuaW5nJyk7XG5cbnZhciBfcm91dGVyV2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yb3V0ZXJXYXJuaW5nKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gbWFrZVN0YXRlV2l0aExvY2F0aW9uKHN0YXRlLCBsb2NhdGlvbikge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBfZGVwcmVjYXRlT2JqZWN0UHJvcGVydGllcy5jYW5Vc2VNZW1icmFuZSkge1xuICAgIHZhciBzdGF0ZVdpdGhMb2NhdGlvbiA9IF9leHRlbmRzKHt9LCBzdGF0ZSk7XG5cbiAgICAvLyBJIGRvbid0IHVzZSBkZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzIGhlcmUgYmVjYXVzZSBJIHdhbnQgdG8ga2VlcCB0aGVcbiAgICAvLyBzYW1lIGNvZGUgcGF0aCBiZXR3ZWVuIGRldmVsb3BtZW50IGFuZCBwcm9kdWN0aW9uLCBpbiB0aGF0IHdlIGp1c3RcbiAgICAvLyBhc3NpZ24gZXh0cmEgcHJvcGVydGllcyB0byB0aGUgY29weSBvZiB0aGUgc3RhdGUgb2JqZWN0IGluIGJvdGggY2FzZXMuXG5cbiAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChwcm9wKSB7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChsb2NhdGlvbiwgcHJvcCkpIHtcbiAgICAgICAgcmV0dXJuICdjb250aW51ZSc7XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdGF0ZVdpdGhMb2NhdGlvbiwgcHJvcCwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9yb3V0ZXJXYXJuaW5nMi5kZWZhdWx0KShmYWxzZSwgJ0FjY2Vzc2luZyBsb2NhdGlvbiBwcm9wZXJ0aWVzIGRpcmVjdGx5IGZyb20gdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGBnZXRDb21wb25lbnRgLCBgZ2V0Q29tcG9uZW50c2AsIGBnZXRDaGlsZFJvdXRlc2AsIGFuZCBgZ2V0SW5kZXhSb3V0ZWAgaXMgZGVwcmVjYXRlZC4gVGhhdCBhcmd1bWVudCBpcyBub3cgdGhlIHJvdXRlciBzdGF0ZSAoYG5leHRTdGF0ZWAgb3IgYHBhcnRpYWxOZXh0U3RhdGVgKSByYXRoZXIgdGhhbiB0aGUgbG9jYXRpb24uIFRvIGFjY2VzcyB0aGUgbG9jYXRpb24sIHVzZSBgbmV4dFN0YXRlLmxvY2F0aW9uYCBvciBgcGFydGlhbE5leHRTdGF0ZS5sb2NhdGlvbmAuJykgOiB2b2lkIDA7XG4gICAgICAgICAgcmV0dXJuIGxvY2F0aW9uW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgcHJvcCBpbiBsb2NhdGlvbikge1xuICAgICAgdmFyIF9yZXQgPSBfbG9vcChwcm9wKTtcblxuICAgICAgaWYgKF9yZXQgPT09ICdjb250aW51ZScpIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZVdpdGhMb2NhdGlvbjtcbiAgfVxuXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIGxvY2F0aW9uKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9BY3Rpb25zID0gcmVxdWlyZSgnaGlzdG9yeS9saWIvQWN0aW9ucycpO1xuXG52YXIgX2ludmFyaWFudCA9IHJlcXVpcmUoJ2ludmFyaWFudCcpO1xuXG52YXIgX2ludmFyaWFudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbnZhcmlhbnQpO1xuXG52YXIgX2NyZWF0ZU1lbW9yeUhpc3RvcnkgPSByZXF1aXJlKCcuL2NyZWF0ZU1lbW9yeUhpc3RvcnknKTtcblxudmFyIF9jcmVhdGVNZW1vcnlIaXN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZU1lbW9yeUhpc3RvcnkpO1xuXG52YXIgX2NyZWF0ZVRyYW5zaXRpb25NYW5hZ2VyID0gcmVxdWlyZSgnLi9jcmVhdGVUcmFuc2l0aW9uTWFuYWdlcicpO1xuXG52YXIgX2NyZWF0ZVRyYW5zaXRpb25NYW5hZ2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZVRyYW5zaXRpb25NYW5hZ2VyKTtcblxudmFyIF9Sb3V0ZVV0aWxzID0gcmVxdWlyZSgnLi9Sb3V0ZVV0aWxzJyk7XG5cbnZhciBfUm91dGVyVXRpbHMgPSByZXF1aXJlKCcuL1JvdXRlclV0aWxzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhvYmosIGtleXMpIHsgdmFyIHRhcmdldCA9IHt9OyBmb3IgKHZhciBpIGluIG9iaikgeyBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTsgdGFyZ2V0W2ldID0gb2JqW2ldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuLyoqXG4gKiBBIGhpZ2gtbGV2ZWwgQVBJIHRvIGJlIHVzZWQgZm9yIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIG1hdGNoZXMgYSBsb2NhdGlvbiB0byBhIHNldCBvZiByb3V0ZXMgYW5kIGNhbGxzXG4gKiBjYWxsYmFjayhlcnJvciwgcmVkaXJlY3RMb2NhdGlvbiwgcmVuZGVyUHJvcHMpIHdoZW4gZmluaXNoZWQuXG4gKlxuICogTm90ZTogWW91IHByb2JhYmx5IGRvbid0IHdhbnQgdG8gdXNlIHRoaXMgaW4gYSBicm93c2VyIHVubGVzcyB5b3UncmUgdXNpbmdcbiAqIHNlcnZlci1zaWRlIHJlbmRlcmluZyB3aXRoIGFzeW5jIHJvdXRlcy5cbiAqL1xuZnVuY3Rpb24gbWF0Y2goX3JlZiwgY2FsbGJhY2spIHtcbiAgdmFyIGhpc3RvcnkgPSBfcmVmLmhpc3Rvcnk7XG4gIHZhciByb3V0ZXMgPSBfcmVmLnJvdXRlcztcbiAgdmFyIGxvY2F0aW9uID0gX3JlZi5sb2NhdGlvbjtcblxuICB2YXIgb3B0aW9ucyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2hpc3RvcnknLCAncm91dGVzJywgJ2xvY2F0aW9uJ10pO1xuXG4gICEoaGlzdG9yeSB8fCBsb2NhdGlvbikgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlLCAnbWF0Y2ggbmVlZHMgYSBoaXN0b3J5IG9yIGEgbG9jYXRpb24nKSA6ICgwLCBfaW52YXJpYW50Mi5kZWZhdWx0KShmYWxzZSkgOiB2b2lkIDA7XG5cbiAgaGlzdG9yeSA9IGhpc3RvcnkgPyBoaXN0b3J5IDogKDAsIF9jcmVhdGVNZW1vcnlIaXN0b3J5Mi5kZWZhdWx0KShvcHRpb25zKTtcbiAgdmFyIHRyYW5zaXRpb25NYW5hZ2VyID0gKDAsIF9jcmVhdGVUcmFuc2l0aW9uTWFuYWdlcjIuZGVmYXVsdCkoaGlzdG9yeSwgKDAsIF9Sb3V0ZVV0aWxzLmNyZWF0ZVJvdXRlcykocm91dGVzKSk7XG5cbiAgdmFyIHVubGlzdGVuID0gdm9pZCAwO1xuXG4gIGlmIChsb2NhdGlvbikge1xuICAgIC8vIEFsbG93IG1hdGNoKHsgbG9jYXRpb246ICcvdGhlL3BhdGgnLCAuLi4gfSlcbiAgICBsb2NhdGlvbiA9IGhpc3RvcnkuY3JlYXRlTG9jYXRpb24obG9jYXRpb24pO1xuICB9IGVsc2Uge1xuICAgIC8vIFBpY2sgdXAgdGhlIGxvY2F0aW9uIGZyb20gdGhlIGhpc3RvcnkgdmlhIHN5bmNocm9ub3VzIGhpc3RvcnkubGlzdGVuXG4gICAgLy8gY2FsbCBpZiBuZWVkZWQuXG4gICAgdW5saXN0ZW4gPSBoaXN0b3J5Lmxpc3RlbihmdW5jdGlvbiAoaGlzdG9yeUxvY2F0aW9uKSB7XG4gICAgICBsb2NhdGlvbiA9IGhpc3RvcnlMb2NhdGlvbjtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciByb3V0ZXIgPSAoMCwgX1JvdXRlclV0aWxzLmNyZWF0ZVJvdXRlck9iamVjdCkoaGlzdG9yeSwgdHJhbnNpdGlvbk1hbmFnZXIpO1xuICBoaXN0b3J5ID0gKDAsIF9Sb3V0ZXJVdGlscy5jcmVhdGVSb3V0aW5nSGlzdG9yeSkoaGlzdG9yeSwgdHJhbnNpdGlvbk1hbmFnZXIpO1xuXG4gIHRyYW5zaXRpb25NYW5hZ2VyLm1hdGNoKGxvY2F0aW9uLCBmdW5jdGlvbiAoZXJyb3IsIHJlZGlyZWN0TG9jYXRpb24sIG5leHRTdGF0ZSkge1xuICAgIGNhbGxiYWNrKGVycm9yLCByZWRpcmVjdExvY2F0aW9uICYmIHJvdXRlci5jcmVhdGVMb2NhdGlvbihyZWRpcmVjdExvY2F0aW9uLCBfQWN0aW9ucy5SRVBMQUNFKSwgbmV4dFN0YXRlICYmIF9leHRlbmRzKHt9LCBuZXh0U3RhdGUsIHtcbiAgICAgIGhpc3Rvcnk6IGhpc3RvcnksXG4gICAgICByb3V0ZXI6IHJvdXRlcixcbiAgICAgIG1hdGNoQ29udGV4dDogeyBoaXN0b3J5OiBoaXN0b3J5LCB0cmFuc2l0aW9uTWFuYWdlcjogdHJhbnNpdGlvbk1hbmFnZXIsIHJvdXRlcjogcm91dGVyIH1cbiAgICB9KSk7XG5cbiAgICAvLyBEZWZlciByZW1vdmluZyB0aGUgbGlzdGVuZXIgdG8gaGVyZSB0byBwcmV2ZW50IERPTSBoaXN0b3JpZXMgZnJvbSBoYXZpbmdcbiAgICAvLyB0byB1bndpbmQgRE9NIGV2ZW50IGxpc3RlbmVycyB1bm5lY2Vzc2FyaWx5LCBpbiBjYXNlIGNhbGxiYWNrIHJlbmRlcnMgYVxuICAgIC8vIDxSb3V0ZXI+IGFuZCBhdHRhY2hlcyBhbm90aGVyIGhpc3RvcnkgbGlzdGVuZXIuXG4gICAgaWYgKHVubGlzdGVuKSB7XG4gICAgICB1bmxpc3RlbigpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9IG1hdGNoO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gbWF0Y2hSb3V0ZXM7XG5cbnZhciBfQXN5bmNVdGlscyA9IHJlcXVpcmUoJy4vQXN5bmNVdGlscycpO1xuXG52YXIgX21ha2VTdGF0ZVdpdGhMb2NhdGlvbiA9IHJlcXVpcmUoJy4vbWFrZVN0YXRlV2l0aExvY2F0aW9uJyk7XG5cbnZhciBfbWFrZVN0YXRlV2l0aExvY2F0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21ha2VTdGF0ZVdpdGhMb2NhdGlvbik7XG5cbnZhciBfUGF0dGVyblV0aWxzID0gcmVxdWlyZSgnLi9QYXR0ZXJuVXRpbHMnKTtcblxudmFyIF9yb3V0ZXJXYXJuaW5nID0gcmVxdWlyZSgnLi9yb3V0ZXJXYXJuaW5nJyk7XG5cbnZhciBfcm91dGVyV2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yb3V0ZXJXYXJuaW5nKTtcblxudmFyIF9Sb3V0ZVV0aWxzID0gcmVxdWlyZSgnLi9Sb3V0ZVV0aWxzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGdldENoaWxkUm91dGVzKHJvdXRlLCBsb2NhdGlvbiwgcGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMsIGNhbGxiYWNrKSB7XG4gIGlmIChyb3V0ZS5jaGlsZFJvdXRlcykge1xuICAgIHJldHVybiBbbnVsbCwgcm91dGUuY2hpbGRSb3V0ZXNdO1xuICB9XG4gIGlmICghcm91dGUuZ2V0Q2hpbGRSb3V0ZXMpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICB2YXIgc3luYyA9IHRydWUsXG4gICAgICByZXN1bHQgPSB2b2lkIDA7XG5cbiAgdmFyIHBhcnRpYWxOZXh0U3RhdGUgPSB7XG4gICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgIHBhcmFtczogY3JlYXRlUGFyYW1zKHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzKVxuICB9O1xuXG4gIHZhciBwYXJ0aWFsTmV4dFN0YXRlV2l0aExvY2F0aW9uID0gKDAsIF9tYWtlU3RhdGVXaXRoTG9jYXRpb24yLmRlZmF1bHQpKHBhcnRpYWxOZXh0U3RhdGUsIGxvY2F0aW9uKTtcblxuICByb3V0ZS5nZXRDaGlsZFJvdXRlcyhwYXJ0aWFsTmV4dFN0YXRlV2l0aExvY2F0aW9uLCBmdW5jdGlvbiAoZXJyb3IsIGNoaWxkUm91dGVzKSB7XG4gICAgY2hpbGRSb3V0ZXMgPSAhZXJyb3IgJiYgKDAsIF9Sb3V0ZVV0aWxzLmNyZWF0ZVJvdXRlcykoY2hpbGRSb3V0ZXMpO1xuICAgIGlmIChzeW5jKSB7XG4gICAgICByZXN1bHQgPSBbZXJyb3IsIGNoaWxkUm91dGVzXTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjYWxsYmFjayhlcnJvciwgY2hpbGRSb3V0ZXMpO1xuICB9KTtcblxuICBzeW5jID0gZmFsc2U7XG4gIHJldHVybiByZXN1bHQ7IC8vIE1pZ2h0IGJlIHVuZGVmaW5lZC5cbn1cblxuZnVuY3Rpb24gZ2V0SW5kZXhSb3V0ZShyb3V0ZSwgbG9jYXRpb24sIHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzLCBjYWxsYmFjaykge1xuICBpZiAocm91dGUuaW5kZXhSb3V0ZSkge1xuICAgIGNhbGxiYWNrKG51bGwsIHJvdXRlLmluZGV4Um91dGUpO1xuICB9IGVsc2UgaWYgKHJvdXRlLmdldEluZGV4Um91dGUpIHtcbiAgICB2YXIgcGFydGlhbE5leHRTdGF0ZSA9IHtcbiAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbiAgICAgIHBhcmFtczogY3JlYXRlUGFyYW1zKHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzKVxuICAgIH07XG5cbiAgICB2YXIgcGFydGlhbE5leHRTdGF0ZVdpdGhMb2NhdGlvbiA9ICgwLCBfbWFrZVN0YXRlV2l0aExvY2F0aW9uMi5kZWZhdWx0KShwYXJ0aWFsTmV4dFN0YXRlLCBsb2NhdGlvbik7XG5cbiAgICByb3V0ZS5nZXRJbmRleFJvdXRlKHBhcnRpYWxOZXh0U3RhdGVXaXRoTG9jYXRpb24sIGZ1bmN0aW9uIChlcnJvciwgaW5kZXhSb3V0ZSkge1xuICAgICAgY2FsbGJhY2soZXJyb3IsICFlcnJvciAmJiAoMCwgX1JvdXRlVXRpbHMuY3JlYXRlUm91dGVzKShpbmRleFJvdXRlKVswXSk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAocm91dGUuY2hpbGRSb3V0ZXMpIHtcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHBhdGhsZXNzID0gcm91dGUuY2hpbGRSb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uIChjaGlsZFJvdXRlKSB7XG4gICAgICAgIHJldHVybiAhY2hpbGRSb3V0ZS5wYXRoO1xuICAgICAgfSk7XG5cbiAgICAgICgwLCBfQXN5bmNVdGlscy5sb29wQXN5bmMpKHBhdGhsZXNzLmxlbmd0aCwgZnVuY3Rpb24gKGluZGV4LCBuZXh0LCBkb25lKSB7XG4gICAgICAgIGdldEluZGV4Um91dGUocGF0aGxlc3NbaW5kZXhdLCBsb2NhdGlvbiwgcGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMsIGZ1bmN0aW9uIChlcnJvciwgaW5kZXhSb3V0ZSkge1xuICAgICAgICAgIGlmIChlcnJvciB8fCBpbmRleFJvdXRlKSB7XG4gICAgICAgICAgICB2YXIgcm91dGVzID0gW3BhdGhsZXNzW2luZGV4XV0uY29uY2F0KEFycmF5LmlzQXJyYXkoaW5kZXhSb3V0ZSkgPyBpbmRleFJvdXRlIDogW2luZGV4Um91dGVdKTtcbiAgICAgICAgICAgIGRvbmUoZXJyb3IsIHJvdXRlcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgZnVuY3Rpb24gKGVyciwgcm91dGVzKSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJvdXRlcyk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzaWduUGFyYW1zKHBhcmFtcywgcGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMpIHtcbiAgcmV0dXJuIHBhcmFtTmFtZXMucmVkdWNlKGZ1bmN0aW9uIChwYXJhbXMsIHBhcmFtTmFtZSwgaW5kZXgpIHtcbiAgICB2YXIgcGFyYW1WYWx1ZSA9IHBhcmFtVmFsdWVzICYmIHBhcmFtVmFsdWVzW2luZGV4XTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtc1twYXJhbU5hbWVdKSkge1xuICAgICAgcGFyYW1zW3BhcmFtTmFtZV0ucHVzaChwYXJhbVZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHBhcmFtTmFtZSBpbiBwYXJhbXMpIHtcbiAgICAgIHBhcmFtc1twYXJhbU5hbWVdID0gW3BhcmFtc1twYXJhbU5hbWVdLCBwYXJhbVZhbHVlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYW1zW3BhcmFtTmFtZV0gPSBwYXJhbVZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG4gIH0sIHBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhcmFtcyhwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcykge1xuICByZXR1cm4gYXNzaWduUGFyYW1zKHt9LCBwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcyk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoUm91dGVEZWVwKHJvdXRlLCBsb2NhdGlvbiwgcmVtYWluaW5nUGF0aG5hbWUsIHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzLCBjYWxsYmFjaykge1xuICB2YXIgcGF0dGVybiA9IHJvdXRlLnBhdGggfHwgJyc7XG5cbiAgaWYgKHBhdHRlcm4uY2hhckF0KDApID09PSAnLycpIHtcbiAgICByZW1haW5pbmdQYXRobmFtZSA9IGxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIHBhcmFtTmFtZXMgPSBbXTtcbiAgICBwYXJhbVZhbHVlcyA9IFtdO1xuICB9XG5cbiAgLy8gT25seSB0cnkgdG8gbWF0Y2ggdGhlIHBhdGggaWYgdGhlIHJvdXRlIGFjdHVhbGx5IGhhcyBhIHBhdHRlcm4sIGFuZCBpZlxuICAvLyB3ZSdyZSBub3QganVzdCBzZWFyY2hpbmcgZm9yIHBvdGVudGlhbCBuZXN0ZWQgYWJzb2x1dGUgcGF0aHMuXG4gIGlmIChyZW1haW5pbmdQYXRobmFtZSAhPT0gbnVsbCAmJiBwYXR0ZXJuKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBtYXRjaGVkID0gKDAsIF9QYXR0ZXJuVXRpbHMubWF0Y2hQYXR0ZXJuKShwYXR0ZXJuLCByZW1haW5pbmdQYXRobmFtZSk7XG4gICAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgICByZW1haW5pbmdQYXRobmFtZSA9IG1hdGNoZWQucmVtYWluaW5nUGF0aG5hbWU7XG4gICAgICAgIHBhcmFtTmFtZXMgPSBbXS5jb25jYXQocGFyYW1OYW1lcywgbWF0Y2hlZC5wYXJhbU5hbWVzKTtcbiAgICAgICAgcGFyYW1WYWx1ZXMgPSBbXS5jb25jYXQocGFyYW1WYWx1ZXMsIG1hdGNoZWQucGFyYW1WYWx1ZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtYWluaW5nUGF0aG5hbWUgPSBudWxsO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgfVxuXG4gICAgLy8gQnkgYXNzdW1wdGlvbiwgcGF0dGVybiBpcyBub24tZW1wdHkgaGVyZSwgd2hpY2ggaXMgdGhlIHByZXJlcXVpc2l0ZSBmb3JcbiAgICAvLyBhY3R1YWxseSB0ZXJtaW5hdGluZyBhIG1hdGNoLlxuICAgIGlmIChyZW1haW5pbmdQYXRobmFtZSA9PT0gJycpIHtcbiAgICAgIHZhciBfcmV0MiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG1hdGNoID0ge1xuICAgICAgICAgIHJvdXRlczogW3JvdXRlXSxcbiAgICAgICAgICBwYXJhbXM6IGNyZWF0ZVBhcmFtcyhwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcylcbiAgICAgICAgfTtcblxuICAgICAgICBnZXRJbmRleFJvdXRlKHJvdXRlLCBsb2NhdGlvbiwgcGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMsIGZ1bmN0aW9uIChlcnJvciwgaW5kZXhSb3V0ZSkge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbmRleFJvdXRlKSkge1xuICAgICAgICAgICAgICB2YXIgX21hdGNoJHJvdXRlcztcblxuICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9yb3V0ZXJXYXJuaW5nMi5kZWZhdWx0KShpbmRleFJvdXRlLmV2ZXJ5KGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhcm91dGUucGF0aDtcbiAgICAgICAgICAgICAgfSksICdJbmRleCByb3V0ZXMgc2hvdWxkIG5vdCBoYXZlIHBhdGhzJykgOiB2b2lkIDA7XG4gICAgICAgICAgICAgIChfbWF0Y2gkcm91dGVzID0gbWF0Y2gucm91dGVzKS5wdXNoLmFwcGx5KF9tYXRjaCRyb3V0ZXMsIGluZGV4Um91dGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleFJvdXRlKSB7XG4gICAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyAoMCwgX3JvdXRlcldhcm5pbmcyLmRlZmF1bHQpKCFpbmRleFJvdXRlLnBhdGgsICdJbmRleCByb3V0ZXMgc2hvdWxkIG5vdCBoYXZlIHBhdGhzJykgOiB2b2lkIDA7XG4gICAgICAgICAgICAgIG1hdGNoLnJvdXRlcy5wdXNoKGluZGV4Um91dGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBtYXRjaCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHY6IHZvaWQgMFxuICAgICAgICB9O1xuICAgICAgfSgpO1xuXG4gICAgICBpZiAoKHR5cGVvZiBfcmV0MiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoX3JldDIpKSA9PT0gXCJvYmplY3RcIikgcmV0dXJuIF9yZXQyLnY7XG4gICAgfVxuICB9XG5cbiAgaWYgKHJlbWFpbmluZ1BhdGhuYW1lICE9IG51bGwgfHwgcm91dGUuY2hpbGRSb3V0ZXMpIHtcbiAgICAvLyBFaXRoZXIgYSkgdGhpcyByb3V0ZSBtYXRjaGVkIGF0IGxlYXN0IHNvbWUgb2YgdGhlIHBhdGggb3IgYilcbiAgICAvLyB3ZSBkb24ndCBoYXZlIHRvIGxvYWQgdGhpcyByb3V0ZSdzIGNoaWxkcmVuIGFzeW5jaHJvbm91c2x5LiBJblxuICAgIC8vIGVpdGhlciBjYXNlIGNvbnRpbnVlIGNoZWNraW5nIGZvciBtYXRjaGVzIGluIHRoZSBzdWJ0cmVlLlxuICAgIHZhciBvbkNoaWxkUm91dGVzID0gZnVuY3Rpb24gb25DaGlsZFJvdXRlcyhlcnJvciwgY2hpbGRSb3V0ZXMpIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICB9IGVsc2UgaWYgKGNoaWxkUm91dGVzKSB7XG4gICAgICAgIC8vIENoZWNrIHRoZSBjaGlsZCByb3V0ZXMgdG8gc2VlIGlmIGFueSBvZiB0aGVtIG1hdGNoLlxuICAgICAgICBtYXRjaFJvdXRlcyhjaGlsZFJvdXRlcywgbG9jYXRpb24sIGZ1bmN0aW9uIChlcnJvciwgbWF0Y2gpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAvLyBBIGNoaWxkIHJvdXRlIG1hdGNoZWQhIEF1Z21lbnQgdGhlIG1hdGNoIGFuZCBwYXNzIGl0IHVwIHRoZSBzdGFjay5cbiAgICAgICAgICAgIG1hdGNoLnJvdXRlcy51bnNoaWZ0KHJvdXRlKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG1hdGNoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHJlbWFpbmluZ1BhdGhuYW1lLCBwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgcmVzdWx0ID0gZ2V0Q2hpbGRSb3V0ZXMocm91dGUsIGxvY2F0aW9uLCBwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcywgb25DaGlsZFJvdXRlcyk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgb25DaGlsZFJvdXRlcy5hcHBseSh1bmRlZmluZWQsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBc3luY2hyb25vdXNseSBtYXRjaGVzIHRoZSBnaXZlbiBsb2NhdGlvbiB0byBhIHNldCBvZiByb3V0ZXMgYW5kIGNhbGxzXG4gKiBjYWxsYmFjayhlcnJvciwgc3RhdGUpIHdoZW4gZmluaXNoZWQuIFRoZSBzdGF0ZSBvYmplY3Qgd2lsbCBoYXZlIHRoZVxuICogZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogLSByb3V0ZXMgICAgICAgQW4gYXJyYXkgb2Ygcm91dGVzIHRoYXQgbWF0Y2hlZCwgaW4gaGllcmFyY2hpY2FsIG9yZGVyXG4gKiAtIHBhcmFtcyAgICAgICBBbiBvYmplY3Qgb2YgVVJMIHBhcmFtZXRlcnNcbiAqXG4gKiBOb3RlOiBUaGlzIG9wZXJhdGlvbiBtYXkgZmluaXNoIHN5bmNocm9ub3VzbHkgaWYgbm8gcm91dGVzIGhhdmUgYW5cbiAqIGFzeW5jaHJvbm91cyBnZXRDaGlsZFJvdXRlcyBtZXRob2QuXG4gKi9cbmZ1bmN0aW9uIG1hdGNoUm91dGVzKHJvdXRlcywgbG9jYXRpb24sIGNhbGxiYWNrLCByZW1haW5pbmdQYXRobmFtZSkge1xuICB2YXIgcGFyYW1OYW1lcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gNCB8fCBhcmd1bWVudHNbNF0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzRdO1xuICB2YXIgcGFyYW1WYWx1ZXMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDUgfHwgYXJndW1lbnRzWzVdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1s1XTtcblxuICBpZiAocmVtYWluaW5nUGF0aG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIFRPRE86IFRoaXMgaXMgYSBsaXR0bGUgYml0IHVnbHksIGJ1dCBpdCB3b3JrcyBhcm91bmQgYSBxdWlyayBpbiBoaXN0b3J5XG4gICAgLy8gdGhhdCBzdHJpcHMgdGhlIGxlYWRpbmcgc2xhc2ggZnJvbSBwYXRobmFtZXMgd2hlbiB1c2luZyBiYXNlbmFtZXMgd2l0aFxuICAgIC8vIHRyYWlsaW5nIHNsYXNoZXMuXG4gICAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICBsb2NhdGlvbiA9IF9leHRlbmRzKHt9LCBsb2NhdGlvbiwge1xuICAgICAgICBwYXRobmFtZTogJy8nICsgbG9jYXRpb24ucGF0aG5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZW1haW5pbmdQYXRobmFtZSA9IGxvY2F0aW9uLnBhdGhuYW1lO1xuICB9XG5cbiAgKDAsIF9Bc3luY1V0aWxzLmxvb3BBc3luYykocm91dGVzLmxlbmd0aCwgZnVuY3Rpb24gKGluZGV4LCBuZXh0LCBkb25lKSB7XG4gICAgbWF0Y2hSb3V0ZURlZXAocm91dGVzW2luZGV4XSwgbG9jYXRpb24sIHJlbWFpbmluZ1BhdGhuYW1lLCBwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcywgZnVuY3Rpb24gKGVycm9yLCBtYXRjaCkge1xuICAgICAgaWYgKGVycm9yIHx8IG1hdGNoKSB7XG4gICAgICAgIGRvbmUoZXJyb3IsIG1hdGNoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSwgY2FsbGJhY2spO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5kZWZhdWx0ID0gcm91dGVyV2FybmluZztcbmV4cG9ydHMuX3Jlc2V0V2FybmVkID0gX3Jlc2V0V2FybmVkO1xuXG52YXIgX3dhcm5pbmcgPSByZXF1aXJlKCd3YXJuaW5nJyk7XG5cbnZhciBfd2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93YXJuaW5nKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHdhcm5lZCA9IHt9O1xuXG5mdW5jdGlvbiByb3V0ZXJXYXJuaW5nKGZhbHNlVG9XYXJuLCBtZXNzYWdlKSB7XG4gIC8vIE9ubHkgaXNzdWUgZGVwcmVjYXRpb24gd2FybmluZ3Mgb25jZS5cbiAgaWYgKG1lc3NhZ2UuaW5kZXhPZignZGVwcmVjYXRlZCcpICE9PSAtMSkge1xuICAgIGlmICh3YXJuZWRbbWVzc2FnZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB3YXJuZWRbbWVzc2FnZV0gPSB0cnVlO1xuICB9XG5cbiAgbWVzc2FnZSA9ICdbcmVhY3Qtcm91dGVyXSAnICsgbWVzc2FnZTtcblxuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIF93YXJuaW5nMi5kZWZhdWx0LmFwcGx5KHVuZGVmaW5lZCwgW2ZhbHNlVG9XYXJuLCBtZXNzYWdlXS5jb25jYXQoYXJncykpO1xufVxuXG5mdW5jdGlvbiBfcmVzZXRXYXJuZWQoKSB7XG4gIHdhcm5lZCA9IHt9O1xufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHVzZVJvdXRlckhpc3Rvcnk7XG5cbnZhciBfdXNlUXVlcmllcyA9IHJlcXVpcmUoJ2hpc3RvcnkvbGliL3VzZVF1ZXJpZXMnKTtcblxudmFyIF91c2VRdWVyaWVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3VzZVF1ZXJpZXMpO1xuXG52YXIgX3VzZUJhc2VuYW1lID0gcmVxdWlyZSgnaGlzdG9yeS9saWIvdXNlQmFzZW5hbWUnKTtcblxudmFyIF91c2VCYXNlbmFtZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91c2VCYXNlbmFtZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHVzZVJvdXRlckhpc3RvcnkoY3JlYXRlSGlzdG9yeSkge1xuICByZXR1cm4gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgaGlzdG9yeSA9ICgwLCBfdXNlUXVlcmllczIuZGVmYXVsdCkoKDAsIF91c2VCYXNlbmFtZTIuZGVmYXVsdCkoY3JlYXRlSGlzdG9yeSkpKG9wdGlvbnMpO1xuICAgIGhpc3RvcnkuX192Ml9jb21wYXRpYmxlX18gPSB0cnVlO1xuICAgIHJldHVybiBoaXN0b3J5O1xuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3VzZVF1ZXJpZXMgPSByZXF1aXJlKCdoaXN0b3J5L2xpYi91c2VRdWVyaWVzJyk7XG5cbnZhciBfdXNlUXVlcmllczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91c2VRdWVyaWVzKTtcblxudmFyIF9jcmVhdGVUcmFuc2l0aW9uTWFuYWdlciA9IHJlcXVpcmUoJy4vY3JlYXRlVHJhbnNpdGlvbk1hbmFnZXInKTtcblxudmFyIF9jcmVhdGVUcmFuc2l0aW9uTWFuYWdlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVUcmFuc2l0aW9uTWFuYWdlcik7XG5cbnZhciBfcm91dGVyV2FybmluZyA9IHJlcXVpcmUoJy4vcm91dGVyV2FybmluZycpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcm91dGVyV2FybmluZyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhvYmosIGtleXMpIHsgdmFyIHRhcmdldCA9IHt9OyBmb3IgKHZhciBpIGluIG9iaikgeyBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTsgdGFyZ2V0W2ldID0gb2JqW2ldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuLyoqXG4gKiBSZXR1cm5zIGEgbmV3IGNyZWF0ZUhpc3RvcnkgZnVuY3Rpb24gdGhhdCBtYXkgYmUgdXNlZCB0byBjcmVhdGVcbiAqIGhpc3Rvcnkgb2JqZWN0cyB0aGF0IGtub3cgYWJvdXQgcm91dGluZy5cbiAqXG4gKiBFbmhhbmNlcyBoaXN0b3J5IG9iamVjdHMgd2l0aCB0aGUgZm9sbG93aW5nIG1ldGhvZHM6XG4gKlxuICogLSBsaXN0ZW4oKGVycm9yLCBuZXh0U3RhdGUpID0+IHt9KVxuICogLSBsaXN0ZW5CZWZvcmVMZWF2aW5nUm91dGUocm91dGUsIChuZXh0TG9jYXRpb24pID0+IHt9KVxuICogLSBtYXRjaChsb2NhdGlvbiwgKGVycm9yLCByZWRpcmVjdExvY2F0aW9uLCBuZXh0U3RhdGUpID0+IHt9KVxuICogLSBpc0FjdGl2ZShwYXRobmFtZSwgcXVlcnksIGluZGV4T25seT1mYWxzZSlcbiAqL1xuZnVuY3Rpb24gdXNlUm91dGVzKGNyZWF0ZUhpc3RvcnkpIHtcbiAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkoZmFsc2UsICdgdXNlUm91dGVzYCBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIGBjcmVhdGVUcmFuc2l0aW9uTWFuYWdlcmAgaW5zdGVhZC4nKSA6IHZvaWQgMDtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cbiAgICB2YXIgcm91dGVzID0gX3JlZi5yb3V0ZXM7XG5cbiAgICB2YXIgb3B0aW9ucyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ3JvdXRlcyddKTtcblxuICAgIHZhciBoaXN0b3J5ID0gKDAsIF91c2VRdWVyaWVzMi5kZWZhdWx0KShjcmVhdGVIaXN0b3J5KShvcHRpb25zKTtcbiAgICB2YXIgdHJhbnNpdGlvbk1hbmFnZXIgPSAoMCwgX2NyZWF0ZVRyYW5zaXRpb25NYW5hZ2VyMi5kZWZhdWx0KShoaXN0b3J5LCByb3V0ZXMpO1xuICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgaGlzdG9yeSwgdHJhbnNpdGlvbk1hbmFnZXIpO1xuICB9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSB1c2VSb3V0ZXM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHdpdGhSb3V0ZXI7XG5cbnZhciBfaW52YXJpYW50ID0gcmVxdWlyZSgnaW52YXJpYW50Jyk7XG5cbnZhciBfaW52YXJpYW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ludmFyaWFudCk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9ob2lzdE5vblJlYWN0U3RhdGljcyA9IHJlcXVpcmUoJ2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzJyk7XG5cbnZhciBfaG9pc3ROb25SZWFjdFN0YXRpY3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaG9pc3ROb25SZWFjdFN0YXRpY3MpO1xuXG52YXIgX1Byb3BUeXBlcyA9IHJlcXVpcmUoJy4vUHJvcFR5cGVzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGdldERpc3BsYXlOYW1lKFdyYXBwZWRDb21wb25lbnQpIHtcbiAgcmV0dXJuIFdyYXBwZWRDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgV3JhcHBlZENvbXBvbmVudC5uYW1lIHx8ICdDb21wb25lbnQnO1xufVxuXG5mdW5jdGlvbiB3aXRoUm91dGVyKFdyYXBwZWRDb21wb25lbnQsIG9wdGlvbnMpIHtcbiAgdmFyIHdpdGhSZWYgPSBvcHRpb25zICYmIG9wdGlvbnMud2l0aFJlZjtcblxuICB2YXIgV2l0aFJvdXRlciA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdXaXRoUm91dGVyJyxcblxuICAgIGNvbnRleHRUeXBlczogeyByb3V0ZXI6IF9Qcm9wVHlwZXMucm91dGVyU2hhcGUgfSxcbiAgICBwcm9wVHlwZXM6IHsgcm91dGVyOiBfUHJvcFR5cGVzLnJvdXRlclNoYXBlIH0sXG5cbiAgICBnZXRXcmFwcGVkSW5zdGFuY2U6IGZ1bmN0aW9uIGdldFdyYXBwZWRJbnN0YW5jZSgpIHtcbiAgICAgICF3aXRoUmVmID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfaW52YXJpYW50Mi5kZWZhdWx0KShmYWxzZSwgJ1RvIGFjY2VzcyB0aGUgd3JhcHBlZCBpbnN0YW5jZSwgeW91IG5lZWQgdG8gc3BlY2lmeSAnICsgJ2B7IHdpdGhSZWY6IHRydWUgfWAgYXMgdGhlIHNlY29uZCBhcmd1bWVudCBvZiB0aGUgd2l0aFJvdXRlcigpIGNhbGwuJykgOiAoMCwgX2ludmFyaWFudDIuZGVmYXVsdCkoZmFsc2UpIDogdm9pZCAwO1xuXG4gICAgICByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2U7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciByb3V0ZXIgPSB0aGlzLnByb3BzLnJvdXRlciB8fCB0aGlzLmNvbnRleHQucm91dGVyO1xuICAgICAgdmFyIHByb3BzID0gX2V4dGVuZHMoe30sIHRoaXMucHJvcHMsIHsgcm91dGVyOiByb3V0ZXIgfSk7XG5cbiAgICAgIGlmICh3aXRoUmVmKSB7XG4gICAgICAgIHByb3BzLnJlZiA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgX3RoaXMud3JhcHBlZEluc3RhbmNlID0gYztcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFdyYXBwZWRDb21wb25lbnQsIHByb3BzKTtcbiAgICB9XG4gIH0pO1xuXG4gIFdpdGhSb3V0ZXIuZGlzcGxheU5hbWUgPSAnd2l0aFJvdXRlcignICsgZ2V0RGlzcGxheU5hbWUoV3JhcHBlZENvbXBvbmVudCkgKyAnKSc7XG4gIFdpdGhSb3V0ZXIuV3JhcHBlZENvbXBvbmVudCA9IFdyYXBwZWRDb21wb25lbnQ7XG5cbiAgcmV0dXJuICgwLCBfaG9pc3ROb25SZWFjdFN0YXRpY3MyLmRlZmF1bHQpKFdpdGhSb3V0ZXIsIFdyYXBwZWRDb21wb25lbnQpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiB0aHVua01pZGRsZXdhcmUoX3JlZikge1xuICB2YXIgZGlzcGF0Y2ggPSBfcmVmLmRpc3BhdGNoO1xuICB2YXIgZ2V0U3RhdGUgPSBfcmVmLmdldFN0YXRlO1xuXG4gIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/IGFjdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIDogbmV4dChhY3Rpb24pO1xuICAgIH07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGh1bmtNaWRkbGV3YXJlOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gYXBwbHlNaWRkbGV3YXJlO1xuXG52YXIgX2NvbXBvc2UgPSByZXF1aXJlKCcuL2NvbXBvc2UnKTtcblxudmFyIF9jb21wb3NlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbXBvc2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0b3JlIGVuaGFuY2VyIHRoYXQgYXBwbGllcyBtaWRkbGV3YXJlIHRvIHRoZSBkaXNwYXRjaCBtZXRob2RcbiAqIG9mIHRoZSBSZWR1eCBzdG9yZS4gVGhpcyBpcyBoYW5keSBmb3IgYSB2YXJpZXR5IG9mIHRhc2tzLCBzdWNoIGFzIGV4cHJlc3NpbmdcbiAqIGFzeW5jaHJvbm91cyBhY3Rpb25zIGluIGEgY29uY2lzZSBtYW5uZXIsIG9yIGxvZ2dpbmcgZXZlcnkgYWN0aW9uIHBheWxvYWQuXG4gKlxuICogU2VlIGByZWR1eC10aHVua2AgcGFja2FnZSBhcyBhbiBleGFtcGxlIG9mIHRoZSBSZWR1eCBtaWRkbGV3YXJlLlxuICpcbiAqIEJlY2F1c2UgbWlkZGxld2FyZSBpcyBwb3RlbnRpYWxseSBhc3luY2hyb25vdXMsIHRoaXMgc2hvdWxkIGJlIHRoZSBmaXJzdFxuICogc3RvcmUgZW5oYW5jZXIgaW4gdGhlIGNvbXBvc2l0aW9uIGNoYWluLlxuICpcbiAqIE5vdGUgdGhhdCBlYWNoIG1pZGRsZXdhcmUgd2lsbCBiZSBnaXZlbiB0aGUgYGRpc3BhdGNoYCBhbmQgYGdldFN0YXRlYCBmdW5jdGlvbnNcbiAqIGFzIG5hbWVkIGFyZ3VtZW50cy5cbiAqXG4gKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBtaWRkbGV3YXJlcyBUaGUgbWlkZGxld2FyZSBjaGFpbiB0byBiZSBhcHBsaWVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIHN0b3JlIGVuaGFuY2VyIGFwcGx5aW5nIHRoZSBtaWRkbGV3YXJlLlxuICovXG5mdW5jdGlvbiBhcHBseU1pZGRsZXdhcmUoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBtaWRkbGV3YXJlcyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIG1pZGRsZXdhcmVzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChjcmVhdGVTdG9yZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocmVkdWNlciwgcHJlbG9hZGVkU3RhdGUsIGVuaGFuY2VyKSB7XG4gICAgICB2YXIgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyLCBwcmVsb2FkZWRTdGF0ZSwgZW5oYW5jZXIpO1xuICAgICAgdmFyIF9kaXNwYXRjaCA9IHN0b3JlLmRpc3BhdGNoO1xuICAgICAgdmFyIGNoYWluID0gW107XG5cbiAgICAgIHZhciBtaWRkbGV3YXJlQVBJID0ge1xuICAgICAgICBnZXRTdGF0ZTogc3RvcmUuZ2V0U3RhdGUsXG4gICAgICAgIGRpc3BhdGNoOiBmdW5jdGlvbiBkaXNwYXRjaChhY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gX2Rpc3BhdGNoKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjaGFpbiA9IG1pZGRsZXdhcmVzLm1hcChmdW5jdGlvbiAobWlkZGxld2FyZSkge1xuICAgICAgICByZXR1cm4gbWlkZGxld2FyZShtaWRkbGV3YXJlQVBJKTtcbiAgICAgIH0pO1xuICAgICAgX2Rpc3BhdGNoID0gX2NvbXBvc2UyWydkZWZhdWx0J10uYXBwbHkodW5kZWZpbmVkLCBjaGFpbikoc3RvcmUuZGlzcGF0Y2gpO1xuXG4gICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0b3JlLCB7XG4gICAgICAgIGRpc3BhdGNoOiBfZGlzcGF0Y2hcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gYmluZEFjdGlvbkNyZWF0b3JzO1xuZnVuY3Rpb24gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvciwgZGlzcGF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2goYWN0aW9uQ3JlYXRvci5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG4vKipcbiAqIFR1cm5zIGFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgYXJlIGFjdGlvbiBjcmVhdG9ycywgaW50byBhbiBvYmplY3Qgd2l0aCB0aGVcbiAqIHNhbWUga2V5cywgYnV0IHdpdGggZXZlcnkgZnVuY3Rpb24gd3JhcHBlZCBpbnRvIGEgYGRpc3BhdGNoYCBjYWxsIHNvIHRoZXlcbiAqIG1heSBiZSBpbnZva2VkIGRpcmVjdGx5LiBUaGlzIGlzIGp1c3QgYSBjb252ZW5pZW5jZSBtZXRob2QsIGFzIHlvdSBjYW4gY2FsbFxuICogYHN0b3JlLmRpc3BhdGNoKE15QWN0aW9uQ3JlYXRvcnMuZG9Tb21ldGhpbmcoKSlgIHlvdXJzZWxmIGp1c3QgZmluZS5cbiAqXG4gKiBGb3IgY29udmVuaWVuY2UsIHlvdSBjYW4gYWxzbyBwYXNzIGEgc2luZ2xlIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCxcbiAqIGFuZCBnZXQgYSBmdW5jdGlvbiBpbiByZXR1cm4uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R9IGFjdGlvbkNyZWF0b3JzIEFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgYXJlIGFjdGlvblxuICogY3JlYXRvciBmdW5jdGlvbnMuIE9uZSBoYW5keSB3YXkgdG8gb2J0YWluIGl0IGlzIHRvIHVzZSBFUzYgYGltcG9ydCAqIGFzYFxuICogc3ludGF4LiBZb3UgbWF5IGFsc28gcGFzcyBhIHNpbmdsZSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBkaXNwYXRjaCBUaGUgYGRpc3BhdGNoYCBmdW5jdGlvbiBhdmFpbGFibGUgb24geW91ciBSZWR1eFxuICogc3RvcmUuXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufE9iamVjdH0gVGhlIG9iamVjdCBtaW1pY2tpbmcgdGhlIG9yaWdpbmFsIG9iamVjdCwgYnV0IHdpdGhcbiAqIGV2ZXJ5IGFjdGlvbiBjcmVhdG9yIHdyYXBwZWQgaW50byB0aGUgYGRpc3BhdGNoYCBjYWxsLiBJZiB5b3UgcGFzc2VkIGFcbiAqIGZ1bmN0aW9uIGFzIGBhY3Rpb25DcmVhdG9yc2AsIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBhbHNvIGJlIGEgc2luZ2xlXG4gKiBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbkNyZWF0b3JzLCBkaXNwYXRjaCkge1xuICBpZiAodHlwZW9mIGFjdGlvbkNyZWF0b3JzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGJpbmRBY3Rpb25DcmVhdG9yKGFjdGlvbkNyZWF0b3JzLCBkaXNwYXRjaCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGFjdGlvbkNyZWF0b3JzICE9PSAnb2JqZWN0JyB8fCBhY3Rpb25DcmVhdG9ycyA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignYmluZEFjdGlvbkNyZWF0b3JzIGV4cGVjdGVkIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uLCBpbnN0ZWFkIHJlY2VpdmVkICcgKyAoYWN0aW9uQ3JlYXRvcnMgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgYWN0aW9uQ3JlYXRvcnMpICsgJy4gJyArICdEaWQgeW91IHdyaXRlIFwiaW1wb3J0IEFjdGlvbkNyZWF0b3JzIGZyb21cIiBpbnN0ZWFkIG9mIFwiaW1wb3J0ICogYXMgQWN0aW9uQ3JlYXRvcnMgZnJvbVwiPycpO1xuICB9XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhY3Rpb25DcmVhdG9ycyk7XG4gIHZhciBib3VuZEFjdGlvbkNyZWF0b3JzID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIHZhciBhY3Rpb25DcmVhdG9yID0gYWN0aW9uQ3JlYXRvcnNba2V5XTtcbiAgICBpZiAodHlwZW9mIGFjdGlvbkNyZWF0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGJvdW5kQWN0aW9uQ3JlYXRvcnNba2V5XSA9IGJpbmRBY3Rpb25DcmVhdG9yKGFjdGlvbkNyZWF0b3IsIGRpc3BhdGNoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJvdW5kQWN0aW9uQ3JlYXRvcnM7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gY29tYmluZVJlZHVjZXJzO1xuXG52YXIgX2NyZWF0ZVN0b3JlID0gcmVxdWlyZSgnLi9jcmVhdGVTdG9yZScpO1xuXG52YXIgX2lzUGxhaW5PYmplY3QgPSByZXF1aXJlKCdsb2Rhc2gvaXNQbGFpbk9iamVjdCcpO1xuXG52YXIgX2lzUGxhaW5PYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQbGFpbk9iamVjdCk7XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJy4vdXRpbHMvd2FybmluZycpO1xuXG52YXIgX3dhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2FybmluZyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gZ2V0VW5kZWZpbmVkU3RhdGVFcnJvck1lc3NhZ2Uoa2V5LCBhY3Rpb24pIHtcbiAgdmFyIGFjdGlvblR5cGUgPSBhY3Rpb24gJiYgYWN0aW9uLnR5cGU7XG4gIHZhciBhY3Rpb25OYW1lID0gYWN0aW9uVHlwZSAmJiAnXCInICsgYWN0aW9uVHlwZS50b1N0cmluZygpICsgJ1wiJyB8fCAnYW4gYWN0aW9uJztcblxuICByZXR1cm4gJ0dpdmVuIGFjdGlvbiAnICsgYWN0aW9uTmFtZSArICcsIHJlZHVjZXIgXCInICsga2V5ICsgJ1wiIHJldHVybmVkIHVuZGVmaW5lZC4gJyArICdUbyBpZ25vcmUgYW4gYWN0aW9uLCB5b3UgbXVzdCBleHBsaWNpdGx5IHJldHVybiB0aGUgcHJldmlvdXMgc3RhdGUuJztcbn1cblxuZnVuY3Rpb24gZ2V0VW5leHBlY3RlZFN0YXRlU2hhcGVXYXJuaW5nTWVzc2FnZShpbnB1dFN0YXRlLCByZWR1Y2VycywgYWN0aW9uLCB1bmV4cGVjdGVkS2V5Q2FjaGUpIHtcbiAgdmFyIHJlZHVjZXJLZXlzID0gT2JqZWN0LmtleXMocmVkdWNlcnMpO1xuICB2YXIgYXJndW1lbnROYW1lID0gYWN0aW9uICYmIGFjdGlvbi50eXBlID09PSBfY3JlYXRlU3RvcmUuQWN0aW9uVHlwZXMuSU5JVCA/ICdwcmVsb2FkZWRTdGF0ZSBhcmd1bWVudCBwYXNzZWQgdG8gY3JlYXRlU3RvcmUnIDogJ3ByZXZpb3VzIHN0YXRlIHJlY2VpdmVkIGJ5IHRoZSByZWR1Y2VyJztcblxuICBpZiAocmVkdWNlcktleXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuICdTdG9yZSBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgcmVkdWNlci4gTWFrZSBzdXJlIHRoZSBhcmd1bWVudCBwYXNzZWQgJyArICd0byBjb21iaW5lUmVkdWNlcnMgaXMgYW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgcmVkdWNlcnMuJztcbiAgfVxuXG4gIGlmICghKDAsIF9pc1BsYWluT2JqZWN0MlsnZGVmYXVsdCddKShpbnB1dFN0YXRlKSkge1xuICAgIHJldHVybiAnVGhlICcgKyBhcmd1bWVudE5hbWUgKyAnIGhhcyB1bmV4cGVjdGVkIHR5cGUgb2YgXCInICsge30udG9TdHJpbmcuY2FsbChpbnB1dFN0YXRlKS5tYXRjaCgvXFxzKFthLXp8QS1aXSspLylbMV0gKyAnXCIuIEV4cGVjdGVkIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgJyArICgna2V5czogXCInICsgcmVkdWNlcktleXMuam9pbignXCIsIFwiJykgKyAnXCInKTtcbiAgfVxuXG4gIHZhciB1bmV4cGVjdGVkS2V5cyA9IE9iamVjdC5rZXlzKGlucHV0U3RhdGUpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuICFyZWR1Y2Vycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICF1bmV4cGVjdGVkS2V5Q2FjaGVba2V5XTtcbiAgfSk7XG5cbiAgdW5leHBlY3RlZEtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgdW5leHBlY3RlZEtleUNhY2hlW2tleV0gPSB0cnVlO1xuICB9KTtcblxuICBpZiAodW5leHBlY3RlZEtleXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiAnVW5leHBlY3RlZCAnICsgKHVuZXhwZWN0ZWRLZXlzLmxlbmd0aCA+IDEgPyAna2V5cycgOiAna2V5JykgKyAnICcgKyAoJ1wiJyArIHVuZXhwZWN0ZWRLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiIGZvdW5kIGluICcgKyBhcmd1bWVudE5hbWUgKyAnLiAnKSArICdFeHBlY3RlZCB0byBmaW5kIG9uZSBvZiB0aGUga25vd24gcmVkdWNlciBrZXlzIGluc3RlYWQ6ICcgKyAoJ1wiJyArIHJlZHVjZXJLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiLiBVbmV4cGVjdGVkIGtleXMgd2lsbCBiZSBpZ25vcmVkLicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFJlZHVjZXJTYW5pdHkocmVkdWNlcnMpIHtcbiAgT2JqZWN0LmtleXMocmVkdWNlcnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciByZWR1Y2VyID0gcmVkdWNlcnNba2V5XTtcbiAgICB2YXIgaW5pdGlhbFN0YXRlID0gcmVkdWNlcih1bmRlZmluZWQsIHsgdHlwZTogX2NyZWF0ZVN0b3JlLkFjdGlvblR5cGVzLklOSVQgfSk7XG5cbiAgICBpZiAodHlwZW9mIGluaXRpYWxTdGF0ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVkdWNlciBcIicgKyBrZXkgKyAnXCIgcmV0dXJuZWQgdW5kZWZpbmVkIGR1cmluZyBpbml0aWFsaXphdGlvbi4gJyArICdJZiB0aGUgc3RhdGUgcGFzc2VkIHRvIHRoZSByZWR1Y2VyIGlzIHVuZGVmaW5lZCwgeW91IG11c3QgJyArICdleHBsaWNpdGx5IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5ICcgKyAnbm90IGJlIHVuZGVmaW5lZC4nKTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZSA9ICdAQHJlZHV4L1BST0JFX1VOS05PV05fQUNUSU9OXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNykuc3BsaXQoJycpLmpvaW4oJy4nKTtcbiAgICBpZiAodHlwZW9mIHJlZHVjZXIodW5kZWZpbmVkLCB7IHR5cGU6IHR5cGUgfSkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZHVjZXIgXCInICsga2V5ICsgJ1wiIHJldHVybmVkIHVuZGVmaW5lZCB3aGVuIHByb2JlZCB3aXRoIGEgcmFuZG9tIHR5cGUuICcgKyAoJ0RvblxcJ3QgdHJ5IHRvIGhhbmRsZSAnICsgX2NyZWF0ZVN0b3JlLkFjdGlvblR5cGVzLklOSVQgKyAnIG9yIG90aGVyIGFjdGlvbnMgaW4gXCJyZWR1eC8qXCIgJykgKyAnbmFtZXNwYWNlLiBUaGV5IGFyZSBjb25zaWRlcmVkIHByaXZhdGUuIEluc3RlYWQsIHlvdSBtdXN0IHJldHVybiB0aGUgJyArICdjdXJyZW50IHN0YXRlIGZvciBhbnkgdW5rbm93biBhY3Rpb25zLCB1bmxlc3MgaXQgaXMgdW5kZWZpbmVkLCAnICsgJ2luIHdoaWNoIGNhc2UgeW91IG11c3QgcmV0dXJuIHRoZSBpbml0aWFsIHN0YXRlLCByZWdhcmRsZXNzIG9mIHRoZSAnICsgJ2FjdGlvbiB0eXBlLiBUaGUgaW5pdGlhbCBzdGF0ZSBtYXkgbm90IGJlIHVuZGVmaW5lZC4nKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFR1cm5zIGFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgYXJlIGRpZmZlcmVudCByZWR1Y2VyIGZ1bmN0aW9ucywgaW50byBhIHNpbmdsZVxuICogcmVkdWNlciBmdW5jdGlvbi4gSXQgd2lsbCBjYWxsIGV2ZXJ5IGNoaWxkIHJlZHVjZXIsIGFuZCBnYXRoZXIgdGhlaXIgcmVzdWx0c1xuICogaW50byBhIHNpbmdsZSBzdGF0ZSBvYmplY3QsIHdob3NlIGtleXMgY29ycmVzcG9uZCB0byB0aGUga2V5cyBvZiB0aGUgcGFzc2VkXG4gKiByZWR1Y2VyIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVkdWNlcnMgQW4gb2JqZWN0IHdob3NlIHZhbHVlcyBjb3JyZXNwb25kIHRvIGRpZmZlcmVudFxuICogcmVkdWNlciBmdW5jdGlvbnMgdGhhdCBuZWVkIHRvIGJlIGNvbWJpbmVkIGludG8gb25lLiBPbmUgaGFuZHkgd2F5IHRvIG9idGFpblxuICogaXQgaXMgdG8gdXNlIEVTNiBgaW1wb3J0ICogYXMgcmVkdWNlcnNgIHN5bnRheC4gVGhlIHJlZHVjZXJzIG1heSBuZXZlciByZXR1cm5cbiAqIHVuZGVmaW5lZCBmb3IgYW55IGFjdGlvbi4gSW5zdGVhZCwgdGhleSBzaG91bGQgcmV0dXJuIHRoZWlyIGluaXRpYWwgc3RhdGVcbiAqIGlmIHRoZSBzdGF0ZSBwYXNzZWQgdG8gdGhlbSB3YXMgdW5kZWZpbmVkLCBhbmQgdGhlIGN1cnJlbnQgc3RhdGUgZm9yIGFueVxuICogdW5yZWNvZ25pemVkIGFjdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IEEgcmVkdWNlciBmdW5jdGlvbiB0aGF0IGludm9rZXMgZXZlcnkgcmVkdWNlciBpbnNpZGUgdGhlXG4gKiBwYXNzZWQgb2JqZWN0LCBhbmQgYnVpbGRzIGEgc3RhdGUgb2JqZWN0IHdpdGggdGhlIHNhbWUgc2hhcGUuXG4gKi9cbmZ1bmN0aW9uIGNvbWJpbmVSZWR1Y2VycyhyZWR1Y2Vycykge1xuICB2YXIgcmVkdWNlcktleXMgPSBPYmplY3Qua2V5cyhyZWR1Y2Vycyk7XG4gIHZhciBmaW5hbFJlZHVjZXJzID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmVkdWNlcktleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0gcmVkdWNlcktleXNbaV07XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgaWYgKHR5cGVvZiByZWR1Y2Vyc1trZXldID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAoMCwgX3dhcm5pbmcyWydkZWZhdWx0J10pKCdObyByZWR1Y2VyIHByb3ZpZGVkIGZvciBrZXkgXCInICsga2V5ICsgJ1wiJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiByZWR1Y2Vyc1trZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmaW5hbFJlZHVjZXJzW2tleV0gPSByZWR1Y2Vyc1trZXldO1xuICAgIH1cbiAgfVxuICB2YXIgZmluYWxSZWR1Y2VyS2V5cyA9IE9iamVjdC5rZXlzKGZpbmFsUmVkdWNlcnMpO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdmFyIHVuZXhwZWN0ZWRLZXlDYWNoZSA9IHt9O1xuICB9XG5cbiAgdmFyIHNhbml0eUVycm9yO1xuICB0cnkge1xuICAgIGFzc2VydFJlZHVjZXJTYW5pdHkoZmluYWxSZWR1Y2Vycyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzYW5pdHlFcnJvciA9IGU7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gY29tYmluYXRpb24oKSB7XG4gICAgdmFyIHN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG4gICAgdmFyIGFjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblxuICAgIGlmIChzYW5pdHlFcnJvcikge1xuICAgICAgdGhyb3cgc2FuaXR5RXJyb3I7XG4gICAgfVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciB3YXJuaW5nTWVzc2FnZSA9IGdldFVuZXhwZWN0ZWRTdGF0ZVNoYXBlV2FybmluZ01lc3NhZ2Uoc3RhdGUsIGZpbmFsUmVkdWNlcnMsIGFjdGlvbiwgdW5leHBlY3RlZEtleUNhY2hlKTtcbiAgICAgIGlmICh3YXJuaW5nTWVzc2FnZSkge1xuICAgICAgICAoMCwgX3dhcm5pbmcyWydkZWZhdWx0J10pKHdhcm5pbmdNZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGFzQ2hhbmdlZCA9IGZhbHNlO1xuICAgIHZhciBuZXh0U3RhdGUgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmFsUmVkdWNlcktleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBmaW5hbFJlZHVjZXJLZXlzW2ldO1xuICAgICAgdmFyIHJlZHVjZXIgPSBmaW5hbFJlZHVjZXJzW2tleV07XG4gICAgICB2YXIgcHJldmlvdXNTdGF0ZUZvcktleSA9IHN0YXRlW2tleV07XG4gICAgICB2YXIgbmV4dFN0YXRlRm9yS2V5ID0gcmVkdWNlcihwcmV2aW91c1N0YXRlRm9yS2V5LCBhY3Rpb24pO1xuICAgICAgaWYgKHR5cGVvZiBuZXh0U3RhdGVGb3JLZXkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBnZXRVbmRlZmluZWRTdGF0ZUVycm9yTWVzc2FnZShrZXksIGFjdGlvbik7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgbmV4dFN0YXRlW2tleV0gPSBuZXh0U3RhdGVGb3JLZXk7XG4gICAgICBoYXNDaGFuZ2VkID0gaGFzQ2hhbmdlZCB8fCBuZXh0U3RhdGVGb3JLZXkgIT09IHByZXZpb3VzU3RhdGVGb3JLZXk7XG4gICAgfVxuICAgIHJldHVybiBoYXNDaGFuZ2VkID8gbmV4dFN0YXRlIDogc3RhdGU7XG4gIH07XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGNvbXBvc2U7XG4vKipcbiAqIENvbXBvc2VzIHNpbmdsZS1hcmd1bWVudCBmdW5jdGlvbnMgZnJvbSByaWdodCB0byBsZWZ0LiBUaGUgcmlnaHRtb3N0XG4gKiBmdW5jdGlvbiBjYW4gdGFrZSBtdWx0aXBsZSBhcmd1bWVudHMgYXMgaXQgcHJvdmlkZXMgdGhlIHNpZ25hdHVyZSBmb3JcbiAqIHRoZSByZXN1bHRpbmcgY29tcG9zaXRlIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZ1bmNzIFRoZSBmdW5jdGlvbnMgdG8gY29tcG9zZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiBvYnRhaW5lZCBieSBjb21wb3NpbmcgdGhlIGFyZ3VtZW50IGZ1bmN0aW9uc1xuICogZnJvbSByaWdodCB0byBsZWZ0LiBGb3IgZXhhbXBsZSwgY29tcG9zZShmLCBnLCBoKSBpcyBpZGVudGljYWwgdG8gZG9pbmdcbiAqICguLi5hcmdzKSA9PiBmKGcoaCguLi5hcmdzKSkpLlxuICovXG5cbmZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBmdW5jcyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGZ1bmNzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgaWYgKGZ1bmNzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICByZXR1cm4gYXJnO1xuICAgIH07XG4gIH1cblxuICBpZiAoZnVuY3MubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGZ1bmNzWzBdO1xuICB9XG5cbiAgdmFyIGxhc3QgPSBmdW5jc1tmdW5jcy5sZW5ndGggLSAxXTtcbiAgdmFyIHJlc3QgPSBmdW5jcy5zbGljZSgwLCAtMSk7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHJlc3QucmVkdWNlUmlnaHQoZnVuY3Rpb24gKGNvbXBvc2VkLCBmKSB7XG4gICAgICByZXR1cm4gZihjb21wb3NlZCk7XG4gICAgfSwgbGFzdC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cykpO1xuICB9O1xufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuQWN0aW9uVHlwZXMgPSB1bmRlZmluZWQ7XG5leHBvcnRzWydkZWZhdWx0J10gPSBjcmVhdGVTdG9yZTtcblxudmFyIF9pc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoL2lzUGxhaW5PYmplY3QnKTtcblxudmFyIF9pc1BsYWluT2JqZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzUGxhaW5PYmplY3QpO1xuXG52YXIgX3N5bWJvbE9ic2VydmFibGUgPSByZXF1aXJlKCdzeW1ib2wtb2JzZXJ2YWJsZScpO1xuXG52YXIgX3N5bWJvbE9ic2VydmFibGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3ltYm9sT2JzZXJ2YWJsZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuLyoqXG4gKiBUaGVzZSBhcmUgcHJpdmF0ZSBhY3Rpb24gdHlwZXMgcmVzZXJ2ZWQgYnkgUmVkdXguXG4gKiBGb3IgYW55IHVua25vd24gYWN0aW9ucywgeW91IG11c3QgcmV0dXJuIHRoZSBjdXJyZW50IHN0YXRlLlxuICogSWYgdGhlIGN1cnJlbnQgc3RhdGUgaXMgdW5kZWZpbmVkLCB5b3UgbXVzdCByZXR1cm4gdGhlIGluaXRpYWwgc3RhdGUuXG4gKiBEbyBub3QgcmVmZXJlbmNlIHRoZXNlIGFjdGlvbiB0eXBlcyBkaXJlY3RseSBpbiB5b3VyIGNvZGUuXG4gKi9cbnZhciBBY3Rpb25UeXBlcyA9IGV4cG9ydHMuQWN0aW9uVHlwZXMgPSB7XG4gIElOSVQ6ICdAQHJlZHV4L0lOSVQnXG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBSZWR1eCBzdG9yZSB0aGF0IGhvbGRzIHRoZSBzdGF0ZSB0cmVlLlxuICogVGhlIG9ubHkgd2F5IHRvIGNoYW5nZSB0aGUgZGF0YSBpbiB0aGUgc3RvcmUgaXMgdG8gY2FsbCBgZGlzcGF0Y2goKWAgb24gaXQuXG4gKlxuICogVGhlcmUgc2hvdWxkIG9ubHkgYmUgYSBzaW5nbGUgc3RvcmUgaW4geW91ciBhcHAuIFRvIHNwZWNpZnkgaG93IGRpZmZlcmVudFxuICogcGFydHMgb2YgdGhlIHN0YXRlIHRyZWUgcmVzcG9uZCB0byBhY3Rpb25zLCB5b3UgbWF5IGNvbWJpbmUgc2V2ZXJhbCByZWR1Y2Vyc1xuICogaW50byBhIHNpbmdsZSByZWR1Y2VyIGZ1bmN0aW9uIGJ5IHVzaW5nIGBjb21iaW5lUmVkdWNlcnNgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlZHVjZXIgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG5leHQgc3RhdGUgdHJlZSwgZ2l2ZW5cbiAqIHRoZSBjdXJyZW50IHN0YXRlIHRyZWUgYW5kIHRoZSBhY3Rpb24gdG8gaGFuZGxlLlxuICpcbiAqIEBwYXJhbSB7YW55fSBbcHJlbG9hZGVkU3RhdGVdIFRoZSBpbml0aWFsIHN0YXRlLiBZb3UgbWF5IG9wdGlvbmFsbHkgc3BlY2lmeSBpdFxuICogdG8gaHlkcmF0ZSB0aGUgc3RhdGUgZnJvbSB0aGUgc2VydmVyIGluIHVuaXZlcnNhbCBhcHBzLCBvciB0byByZXN0b3JlIGFcbiAqIHByZXZpb3VzbHkgc2VyaWFsaXplZCB1c2VyIHNlc3Npb24uXG4gKiBJZiB5b3UgdXNlIGBjb21iaW5lUmVkdWNlcnNgIHRvIHByb2R1Y2UgdGhlIHJvb3QgcmVkdWNlciBmdW5jdGlvbiwgdGhpcyBtdXN0IGJlXG4gKiBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzaGFwZSBhcyBgY29tYmluZVJlZHVjZXJzYCBrZXlzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVuaGFuY2VyIFRoZSBzdG9yZSBlbmhhbmNlci4gWW91IG1heSBvcHRpb25hbGx5IHNwZWNpZnkgaXRcbiAqIHRvIGVuaGFuY2UgdGhlIHN0b3JlIHdpdGggdGhpcmQtcGFydHkgY2FwYWJpbGl0aWVzIHN1Y2ggYXMgbWlkZGxld2FyZSxcbiAqIHRpbWUgdHJhdmVsLCBwZXJzaXN0ZW5jZSwgZXRjLiBUaGUgb25seSBzdG9yZSBlbmhhbmNlciB0aGF0IHNoaXBzIHdpdGggUmVkdXhcbiAqIGlzIGBhcHBseU1pZGRsZXdhcmUoKWAuXG4gKlxuICogQHJldHVybnMge1N0b3JlfSBBIFJlZHV4IHN0b3JlIHRoYXQgbGV0cyB5b3UgcmVhZCB0aGUgc3RhdGUsIGRpc3BhdGNoIGFjdGlvbnNcbiAqIGFuZCBzdWJzY3JpYmUgdG8gY2hhbmdlcy5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlU3RvcmUocmVkdWNlciwgcHJlbG9hZGVkU3RhdGUsIGVuaGFuY2VyKSB7XG4gIHZhciBfcmVmMjtcblxuICBpZiAodHlwZW9mIHByZWxvYWRlZFN0YXRlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBlbmhhbmNlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBlbmhhbmNlciA9IHByZWxvYWRlZFN0YXRlO1xuICAgIHByZWxvYWRlZFN0YXRlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbmhhbmNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIGVuaGFuY2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHRoZSBlbmhhbmNlciB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIHJldHVybiBlbmhhbmNlcihjcmVhdGVTdG9yZSkocmVkdWNlciwgcHJlbG9hZGVkU3RhdGUpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiByZWR1Y2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCB0aGUgcmVkdWNlciB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIGN1cnJlbnRSZWR1Y2VyID0gcmVkdWNlcjtcbiAgdmFyIGN1cnJlbnRTdGF0ZSA9IHByZWxvYWRlZFN0YXRlO1xuICB2YXIgY3VycmVudExpc3RlbmVycyA9IFtdO1xuICB2YXIgbmV4dExpc3RlbmVycyA9IGN1cnJlbnRMaXN0ZW5lcnM7XG4gIHZhciBpc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZW5zdXJlQ2FuTXV0YXRlTmV4dExpc3RlbmVycygpIHtcbiAgICBpZiAobmV4dExpc3RlbmVycyA9PT0gY3VycmVudExpc3RlbmVycykge1xuICAgICAgbmV4dExpc3RlbmVycyA9IGN1cnJlbnRMaXN0ZW5lcnMuc2xpY2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVhZHMgdGhlIHN0YXRlIHRyZWUgbWFuYWdlZCBieSB0aGUgc3RvcmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHthbnl9IFRoZSBjdXJyZW50IHN0YXRlIHRyZWUgb2YgeW91ciBhcHBsaWNhdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGdldFN0YXRlKCkge1xuICAgIHJldHVybiBjdXJyZW50U3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNoYW5nZSBsaXN0ZW5lci4gSXQgd2lsbCBiZSBjYWxsZWQgYW55IHRpbWUgYW4gYWN0aW9uIGlzIGRpc3BhdGNoZWQsXG4gICAqIGFuZCBzb21lIHBhcnQgb2YgdGhlIHN0YXRlIHRyZWUgbWF5IHBvdGVudGlhbGx5IGhhdmUgY2hhbmdlZC4gWW91IG1heSB0aGVuXG4gICAqIGNhbGwgYGdldFN0YXRlKClgIHRvIHJlYWQgdGhlIGN1cnJlbnQgc3RhdGUgdHJlZSBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKlxuICAgKiBZb3UgbWF5IGNhbGwgYGRpc3BhdGNoKClgIGZyb20gYSBjaGFuZ2UgbGlzdGVuZXIsIHdpdGggdGhlIGZvbGxvd2luZ1xuICAgKiBjYXZlYXRzOlxuICAgKlxuICAgKiAxLiBUaGUgc3Vic2NyaXB0aW9ucyBhcmUgc25hcHNob3R0ZWQganVzdCBiZWZvcmUgZXZlcnkgYGRpc3BhdGNoKClgIGNhbGwuXG4gICAqIElmIHlvdSBzdWJzY3JpYmUgb3IgdW5zdWJzY3JpYmUgd2hpbGUgdGhlIGxpc3RlbmVycyBhcmUgYmVpbmcgaW52b2tlZCwgdGhpc1xuICAgKiB3aWxsIG5vdCBoYXZlIGFueSBlZmZlY3Qgb24gdGhlIGBkaXNwYXRjaCgpYCB0aGF0IGlzIGN1cnJlbnRseSBpbiBwcm9ncmVzcy5cbiAgICogSG93ZXZlciwgdGhlIG5leHQgYGRpc3BhdGNoKClgIGNhbGwsIHdoZXRoZXIgbmVzdGVkIG9yIG5vdCwgd2lsbCB1c2UgYSBtb3JlXG4gICAqIHJlY2VudCBzbmFwc2hvdCBvZiB0aGUgc3Vic2NyaXB0aW9uIGxpc3QuXG4gICAqXG4gICAqIDIuIFRoZSBsaXN0ZW5lciBzaG91bGQgbm90IGV4cGVjdCB0byBzZWUgYWxsIHN0YXRlIGNoYW5nZXMsIGFzIHRoZSBzdGF0ZVxuICAgKiBtaWdodCBoYXZlIGJlZW4gdXBkYXRlZCBtdWx0aXBsZSB0aW1lcyBkdXJpbmcgYSBuZXN0ZWQgYGRpc3BhdGNoKClgIGJlZm9yZVxuICAgKiB0aGUgbGlzdGVuZXIgaXMgY2FsbGVkLiBJdCBpcywgaG93ZXZlciwgZ3VhcmFudGVlZCB0aGF0IGFsbCBzdWJzY3JpYmVyc1xuICAgKiByZWdpc3RlcmVkIGJlZm9yZSB0aGUgYGRpc3BhdGNoKClgIHN0YXJ0ZWQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgbGF0ZXN0XG4gICAqIHN0YXRlIGJ5IHRoZSB0aW1lIGl0IGV4aXRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBBIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgb24gZXZlcnkgZGlzcGF0Y2guXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0byByZW1vdmUgdGhpcyBjaGFuZ2UgbGlzdGVuZXIuXG4gICAqL1xuICBmdW5jdGlvbiBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGxpc3RlbmVyIHRvIGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgfVxuXG4gICAgdmFyIGlzU3Vic2NyaWJlZCA9IHRydWU7XG5cbiAgICBlbnN1cmVDYW5NdXRhdGVOZXh0TGlzdGVuZXJzKCk7XG4gICAgbmV4dExpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiB1bnN1YnNjcmliZSgpIHtcbiAgICAgIGlmICghaXNTdWJzY3JpYmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaXNTdWJzY3JpYmVkID0gZmFsc2U7XG5cbiAgICAgIGVuc3VyZUNhbk11dGF0ZU5leHRMaXN0ZW5lcnMoKTtcbiAgICAgIHZhciBpbmRleCA9IG5leHRMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICBuZXh0TGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGFuIGFjdGlvbi4gSXQgaXMgdGhlIG9ubHkgd2F5IHRvIHRyaWdnZXIgYSBzdGF0ZSBjaGFuZ2UuXG4gICAqXG4gICAqIFRoZSBgcmVkdWNlcmAgZnVuY3Rpb24sIHVzZWQgdG8gY3JlYXRlIHRoZSBzdG9yZSwgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGVcbiAgICogY3VycmVudCBzdGF0ZSB0cmVlIGFuZCB0aGUgZ2l2ZW4gYGFjdGlvbmAuIEl0cyByZXR1cm4gdmFsdWUgd2lsbFxuICAgKiBiZSBjb25zaWRlcmVkIHRoZSAqKm5leHQqKiBzdGF0ZSBvZiB0aGUgdHJlZSwgYW5kIHRoZSBjaGFuZ2UgbGlzdGVuZXJzXG4gICAqIHdpbGwgYmUgbm90aWZpZWQuXG4gICAqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9ubHkgc3VwcG9ydHMgcGxhaW4gb2JqZWN0IGFjdGlvbnMuIElmIHlvdSB3YW50IHRvXG4gICAqIGRpc3BhdGNoIGEgUHJvbWlzZSwgYW4gT2JzZXJ2YWJsZSwgYSB0aHVuaywgb3Igc29tZXRoaW5nIGVsc2UsIHlvdSBuZWVkIHRvXG4gICAqIHdyYXAgeW91ciBzdG9yZSBjcmVhdGluZyBmdW5jdGlvbiBpbnRvIHRoZSBjb3JyZXNwb25kaW5nIG1pZGRsZXdhcmUuIEZvclxuICAgKiBleGFtcGxlLCBzZWUgdGhlIGRvY3VtZW50YXRpb24gZm9yIHRoZSBgcmVkdXgtdGh1bmtgIHBhY2thZ2UuIEV2ZW4gdGhlXG4gICAqIG1pZGRsZXdhcmUgd2lsbCBldmVudHVhbGx5IGRpc3BhdGNoIHBsYWluIG9iamVjdCBhY3Rpb25zIHVzaW5nIHRoaXMgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uIEEgcGxhaW4gb2JqZWN0IHJlcHJlc2VudGluZyDigJx3aGF0IGNoYW5nZWTigJ0uIEl0IGlzXG4gICAqIGEgZ29vZCBpZGVhIHRvIGtlZXAgYWN0aW9ucyBzZXJpYWxpemFibGUgc28geW91IGNhbiByZWNvcmQgYW5kIHJlcGxheSB1c2VyXG4gICAqIHNlc3Npb25zLCBvciB1c2UgdGhlIHRpbWUgdHJhdmVsbGluZyBgcmVkdXgtZGV2dG9vbHNgLiBBbiBhY3Rpb24gbXVzdCBoYXZlXG4gICAqIGEgYHR5cGVgIHByb3BlcnR5IHdoaWNoIG1heSBub3QgYmUgYHVuZGVmaW5lZGAuIEl0IGlzIGEgZ29vZCBpZGVhIHRvIHVzZVxuICAgKiBzdHJpbmcgY29uc3RhbnRzIGZvciBhY3Rpb24gdHlwZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEZvciBjb252ZW5pZW5jZSwgdGhlIHNhbWUgYWN0aW9uIG9iamVjdCB5b3UgZGlzcGF0Y2hlZC5cbiAgICpcbiAgICogTm90ZSB0aGF0LCBpZiB5b3UgdXNlIGEgY3VzdG9tIG1pZGRsZXdhcmUsIGl0IG1heSB3cmFwIGBkaXNwYXRjaCgpYCB0b1xuICAgKiByZXR1cm4gc29tZXRoaW5nIGVsc2UgKGZvciBleGFtcGxlLCBhIFByb21pc2UgeW91IGNhbiBhd2FpdCkuXG4gICAqL1xuICBmdW5jdGlvbiBkaXNwYXRjaChhY3Rpb24pIHtcbiAgICBpZiAoISgwLCBfaXNQbGFpbk9iamVjdDJbJ2RlZmF1bHQnXSkoYWN0aW9uKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBY3Rpb25zIG11c3QgYmUgcGxhaW4gb2JqZWN0cy4gJyArICdVc2UgY3VzdG9tIG1pZGRsZXdhcmUgZm9yIGFzeW5jIGFjdGlvbnMuJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBhY3Rpb24udHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQWN0aW9ucyBtYXkgbm90IGhhdmUgYW4gdW5kZWZpbmVkIFwidHlwZVwiIHByb3BlcnR5LiAnICsgJ0hhdmUgeW91IG1pc3NwZWxsZWQgYSBjb25zdGFudD8nKTtcbiAgICB9XG5cbiAgICBpZiAoaXNEaXNwYXRjaGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWR1Y2VycyBtYXkgbm90IGRpc3BhdGNoIGFjdGlvbnMuJyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudFJlZHVjZXIoY3VycmVudFN0YXRlLCBhY3Rpb24pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGxpc3RlbmVycyA9IGN1cnJlbnRMaXN0ZW5lcnMgPSBuZXh0TGlzdGVuZXJzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIHRoZSByZWR1Y2VyIGN1cnJlbnRseSB1c2VkIGJ5IHRoZSBzdG9yZSB0byBjYWxjdWxhdGUgdGhlIHN0YXRlLlxuICAgKlxuICAgKiBZb3UgbWlnaHQgbmVlZCB0aGlzIGlmIHlvdXIgYXBwIGltcGxlbWVudHMgY29kZSBzcGxpdHRpbmcgYW5kIHlvdSB3YW50IHRvXG4gICAqIGxvYWQgc29tZSBvZiB0aGUgcmVkdWNlcnMgZHluYW1pY2FsbHkuIFlvdSBtaWdodCBhbHNvIG5lZWQgdGhpcyBpZiB5b3VcbiAgICogaW1wbGVtZW50IGEgaG90IHJlbG9hZGluZyBtZWNoYW5pc20gZm9yIFJlZHV4LlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXh0UmVkdWNlciBUaGUgcmVkdWNlciBmb3IgdGhlIHN0b3JlIHRvIHVzZSBpbnN0ZWFkLlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIHJlcGxhY2VSZWR1Y2VyKG5leHRSZWR1Y2VyKSB7XG4gICAgaWYgKHR5cGVvZiBuZXh0UmVkdWNlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCB0aGUgbmV4dFJlZHVjZXIgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgICB9XG5cbiAgICBjdXJyZW50UmVkdWNlciA9IG5leHRSZWR1Y2VyO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogQWN0aW9uVHlwZXMuSU5JVCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm9wZXJhYmlsaXR5IHBvaW50IGZvciBvYnNlcnZhYmxlL3JlYWN0aXZlIGxpYnJhcmllcy5cbiAgICogQHJldHVybnMge29ic2VydmFibGV9IEEgbWluaW1hbCBvYnNlcnZhYmxlIG9mIHN0YXRlIGNoYW5nZXMuXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgdGhlIG9ic2VydmFibGUgcHJvcG9zYWw6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS96ZW5wYXJzaW5nL2VzLW9ic2VydmFibGVcbiAgICovXG4gIGZ1bmN0aW9uIG9ic2VydmFibGUoKSB7XG4gICAgdmFyIF9yZWY7XG5cbiAgICB2YXIgb3V0ZXJTdWJzY3JpYmUgPSBzdWJzY3JpYmU7XG4gICAgcmV0dXJuIF9yZWYgPSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBtaW5pbWFsIG9ic2VydmFibGUgc3Vic2NyaXB0aW9uIG1ldGhvZC5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYnNlcnZlciBBbnkgb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgYXMgYW4gb2JzZXJ2ZXIuXG4gICAgICAgKiBUaGUgb2JzZXJ2ZXIgb2JqZWN0IHNob3VsZCBoYXZlIGEgYG5leHRgIG1ldGhvZC5cbiAgICAgICAqIEByZXR1cm5zIHtzdWJzY3JpcHRpb259IEFuIG9iamVjdCB3aXRoIGFuIGB1bnN1YnNjcmliZWAgbWV0aG9kIHRoYXQgY2FuXG4gICAgICAgKiBiZSB1c2VkIHRvIHVuc3Vic2NyaWJlIHRoZSBvYnNlcnZhYmxlIGZyb20gdGhlIHN0b3JlLCBhbmQgcHJldmVudCBmdXJ0aGVyXG4gICAgICAgKiBlbWlzc2lvbiBvZiB2YWx1ZXMgZnJvbSB0aGUgb2JzZXJ2YWJsZS5cbiAgICAgICAqL1xuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiBzdWJzY3JpYmUob2JzZXJ2ZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYnNlcnZlciAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCB0aGUgb2JzZXJ2ZXIgdG8gYmUgYW4gb2JqZWN0LicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb2JzZXJ2ZVN0YXRlKCkge1xuICAgICAgICAgIGlmIChvYnNlcnZlci5uZXh0KSB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KGdldFN0YXRlKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9ic2VydmVTdGF0ZSgpO1xuICAgICAgICB2YXIgdW5zdWJzY3JpYmUgPSBvdXRlclN1YnNjcmliZShvYnNlcnZlU3RhdGUpO1xuICAgICAgICByZXR1cm4geyB1bnN1YnNjcmliZTogdW5zdWJzY3JpYmUgfTtcbiAgICAgIH1cbiAgICB9LCBfcmVmW19zeW1ib2xPYnNlcnZhYmxlMlsnZGVmYXVsdCddXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9yZWY7XG4gIH1cblxuICAvLyBXaGVuIGEgc3RvcmUgaXMgY3JlYXRlZCwgYW4gXCJJTklUXCIgYWN0aW9uIGlzIGRpc3BhdGNoZWQgc28gdGhhdCBldmVyeVxuICAvLyByZWR1Y2VyIHJldHVybnMgdGhlaXIgaW5pdGlhbCBzdGF0ZS4gVGhpcyBlZmZlY3RpdmVseSBwb3B1bGF0ZXNcbiAgLy8gdGhlIGluaXRpYWwgc3RhdGUgdHJlZS5cbiAgZGlzcGF0Y2goeyB0eXBlOiBBY3Rpb25UeXBlcy5JTklUIH0pO1xuXG4gIHJldHVybiBfcmVmMiA9IHtcbiAgICBkaXNwYXRjaDogZGlzcGF0Y2gsXG4gICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gICAgZ2V0U3RhdGU6IGdldFN0YXRlLFxuICAgIHJlcGxhY2VSZWR1Y2VyOiByZXBsYWNlUmVkdWNlclxuICB9LCBfcmVmMltfc3ltYm9sT2JzZXJ2YWJsZTJbJ2RlZmF1bHQnXV0gPSBvYnNlcnZhYmxlLCBfcmVmMjtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmNvbXBvc2UgPSBleHBvcnRzLmFwcGx5TWlkZGxld2FyZSA9IGV4cG9ydHMuYmluZEFjdGlvbkNyZWF0b3JzID0gZXhwb3J0cy5jb21iaW5lUmVkdWNlcnMgPSBleHBvcnRzLmNyZWF0ZVN0b3JlID0gdW5kZWZpbmVkO1xuXG52YXIgX2NyZWF0ZVN0b3JlID0gcmVxdWlyZSgnLi9jcmVhdGVTdG9yZScpO1xuXG52YXIgX2NyZWF0ZVN0b3JlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZVN0b3JlKTtcblxudmFyIF9jb21iaW5lUmVkdWNlcnMgPSByZXF1aXJlKCcuL2NvbWJpbmVSZWR1Y2VycycpO1xuXG52YXIgX2NvbWJpbmVSZWR1Y2VyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb21iaW5lUmVkdWNlcnMpO1xuXG52YXIgX2JpbmRBY3Rpb25DcmVhdG9ycyA9IHJlcXVpcmUoJy4vYmluZEFjdGlvbkNyZWF0b3JzJyk7XG5cbnZhciBfYmluZEFjdGlvbkNyZWF0b3JzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2JpbmRBY3Rpb25DcmVhdG9ycyk7XG5cbnZhciBfYXBwbHlNaWRkbGV3YXJlID0gcmVxdWlyZSgnLi9hcHBseU1pZGRsZXdhcmUnKTtcblxudmFyIF9hcHBseU1pZGRsZXdhcmUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXBwbHlNaWRkbGV3YXJlKTtcblxudmFyIF9jb21wb3NlID0gcmVxdWlyZSgnLi9jb21wb3NlJyk7XG5cbnZhciBfY29tcG9zZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb21wb3NlKTtcblxudmFyIF93YXJuaW5nID0gcmVxdWlyZSgnLi91dGlscy93YXJuaW5nJyk7XG5cbnZhciBfd2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93YXJuaW5nKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG4vKlxuKiBUaGlzIGlzIGEgZHVtbXkgZnVuY3Rpb24gdG8gY2hlY2sgaWYgdGhlIGZ1bmN0aW9uIG5hbWUgaGFzIGJlZW4gYWx0ZXJlZCBieSBtaW5pZmljYXRpb24uXG4qIElmIHRoZSBmdW5jdGlvbiBoYXMgYmVlbiBtaW5pZmllZCBhbmQgTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJywgd2FybiB0aGUgdXNlci5cbiovXG5mdW5jdGlvbiBpc0NydXNoZWQoKSB7fVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0eXBlb2YgaXNDcnVzaGVkLm5hbWUgPT09ICdzdHJpbmcnICYmIGlzQ3J1c2hlZC5uYW1lICE9PSAnaXNDcnVzaGVkJykge1xuICAoMCwgX3dhcm5pbmcyWydkZWZhdWx0J10pKCdZb3UgYXJlIGN1cnJlbnRseSB1c2luZyBtaW5pZmllZCBjb2RlIG91dHNpZGUgb2YgTk9ERV9FTlYgPT09IFxcJ3Byb2R1Y3Rpb25cXCcuICcgKyAnVGhpcyBtZWFucyB0aGF0IHlvdSBhcmUgcnVubmluZyBhIHNsb3dlciBkZXZlbG9wbWVudCBidWlsZCBvZiBSZWR1eC4gJyArICdZb3UgY2FuIHVzZSBsb29zZS1lbnZpZnkgKGh0dHBzOi8vZ2l0aHViLmNvbS96ZXJ0b3NoL2xvb3NlLWVudmlmeSkgZm9yIGJyb3dzZXJpZnkgJyArICdvciBEZWZpbmVQbHVnaW4gZm9yIHdlYnBhY2sgKGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzAwMzAwMzEpICcgKyAndG8gZW5zdXJlIHlvdSBoYXZlIHRoZSBjb3JyZWN0IGNvZGUgZm9yIHlvdXIgcHJvZHVjdGlvbiBidWlsZC4nKTtcbn1cblxuZXhwb3J0cy5jcmVhdGVTdG9yZSA9IF9jcmVhdGVTdG9yZTJbJ2RlZmF1bHQnXTtcbmV4cG9ydHMuY29tYmluZVJlZHVjZXJzID0gX2NvbWJpbmVSZWR1Y2VyczJbJ2RlZmF1bHQnXTtcbmV4cG9ydHMuYmluZEFjdGlvbkNyZWF0b3JzID0gX2JpbmRBY3Rpb25DcmVhdG9yczJbJ2RlZmF1bHQnXTtcbmV4cG9ydHMuYXBwbHlNaWRkbGV3YXJlID0gX2FwcGx5TWlkZGxld2FyZTJbJ2RlZmF1bHQnXTtcbmV4cG9ydHMuY29tcG9zZSA9IF9jb21wb3NlMlsnZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHdhcm5pbmc7XG4vKipcbiAqIFByaW50cyBhIHdhcm5pbmcgaW4gdGhlIGNvbnNvbGUgaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIFRoZSB3YXJuaW5nIG1lc3NhZ2UuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gd2FybmluZyhtZXNzYWdlKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbiAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBuby1jb25zb2xlICovXG4gIHRyeSB7XG4gICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCBpZiB5b3UgZW5hYmxlXG4gICAgLy8gXCJicmVhayBvbiBhbGwgZXhjZXB0aW9uc1wiIGluIHlvdXIgY29uc29sZSxcbiAgICAvLyBpdCB3b3VsZCBwYXVzZSB0aGUgZXhlY3V0aW9uIGF0IHRoaXMgbGluZS5cbiAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tZW1wdHkgKi9cbiAgfSBjYXRjaCAoZSkge31cbiAgLyogZXNsaW50LWVuYWJsZSBuby1lbXB0eSAqL1xufSIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cikge1xuXHRyZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnKCkqXS9nLCBmdW5jdGlvbiAoYykge1xuXHRcdHJldHVybiAnJScgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG5cdH0pO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvaW5kZXgnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9wb255ZmlsbCA9IHJlcXVpcmUoJy4vcG9ueWZpbGwnKTtcblxudmFyIF9wb255ZmlsbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wb255ZmlsbCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIHJvb3QgPSB1bmRlZmluZWQ7IC8qIGdsb2JhbCB3aW5kb3cgKi9cblxuaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG5cdHJvb3QgPSBnbG9iYWw7XG59IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdHJvb3QgPSB3aW5kb3c7XG59XG5cbnZhciByZXN1bHQgPSAoMCwgX3BvbnlmaWxsMlsnZGVmYXVsdCddKShyb290KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHJlc3VsdDsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBzeW1ib2xPYnNlcnZhYmxlUG9ueWZpbGw7XG5mdW5jdGlvbiBzeW1ib2xPYnNlcnZhYmxlUG9ueWZpbGwocm9vdCkge1xuXHR2YXIgcmVzdWx0O1xuXHR2YXIgX1N5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5cdGlmICh0eXBlb2YgX1N5bWJvbCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGlmIChfU3ltYm9sLm9ic2VydmFibGUpIHtcblx0XHRcdHJlc3VsdCA9IF9TeW1ib2wub2JzZXJ2YWJsZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gX1N5bWJvbCgnb2JzZXJ2YWJsZScpO1xuXHRcdFx0X1N5bWJvbC5vYnNlcnZhYmxlID0gcmVzdWx0O1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXN1bHQgPSAnQEBvYnNlcnZhYmxlJztcblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59OyIsIlxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdHJpbTtcblxuZnVuY3Rpb24gdHJpbShzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbn1cblxuZXhwb3J0cy5sZWZ0ID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKTtcbn07XG5cbmV4cG9ydHMucmlnaHQgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xccyokLywgJycpO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB3YXJuaW5nID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGFyZ3MpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiA+IDIgPyBsZW4gLSAyIDogMCk7XG4gICAgZm9yICh2YXIga2V5ID0gMjsga2V5IDwgbGVuOyBrZXkrKykge1xuICAgICAgYXJnc1trZXkgLSAyXSA9IGFyZ3VtZW50c1trZXldO1xuICAgIH1cbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgK1xuICAgICAgICAnbWVzc2FnZSBhcmd1bWVudCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdC5sZW5ndGggPCAxMCB8fCAoL15bc1xcV10qJC8pLnRlc3QoZm9ybWF0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHdhcm5pbmcgZm9ybWF0IHNob3VsZCBiZSBhYmxlIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgJyArXG4gICAgICAgICd3YXJuaW5nLiBQbGVhc2UsIHVzZSBhIG1vcmUgZGVzY3JpcHRpdmUgZm9ybWF0IHRoYW46ICcgKyBmb3JtYXRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgICB9KTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgfSBjYXRjaCh4KSB7fVxuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nO1xuIiwidmFyIHdpbmRvdyAgICAgICAgICAgICAgPSByZXF1aXJlKCdnbG9iYWwnKTtcbnZhciBNb2NrWE1MSHR0cFJlcXVlc3QgID0gcmVxdWlyZSgnLi9saWIvTW9ja1hNTEh0dHBSZXF1ZXN0Jyk7XG52YXIgcmVhbCAgICAgICAgICAgICAgICA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdDtcbnZhciBtb2NrICAgICAgICAgICAgICAgID0gTW9ja1hNTEh0dHBSZXF1ZXN0O1xuXG4vKipcbiAqIE1vY2sgdXRpbGl0eVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuXHRYTUxIdHRwUmVxdWVzdDogTW9ja1hNTEh0dHBSZXF1ZXN0LFxuXG5cdC8qKlxuXHQgKiBSZXBsYWNlIHRoZSBuYXRpdmUgWEhSIHdpdGggdGhlIG1vY2tlZCBYSFJcblx0ICogQHJldHVybnMge2V4cG9ydHN9XG5cdCAqL1xuXHRzZXR1cDogZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LlhNTEh0dHBSZXF1ZXN0ID0gbW9jaztcblx0XHRNb2NrWE1MSHR0cFJlcXVlc3QuaGFuZGxlcnMgPSBbXTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvKipcblx0ICogUmVwbGFjZSB0aGUgbW9ja2VkIFhIUiB3aXRoIHRoZSBuYXRpdmUgWEhSIGFuZCByZW1vdmUgYW55IGhhbmRsZXJzXG5cdCAqIEByZXR1cm5zIHtleHBvcnRzfVxuXHQgKi9cblx0dGVhcmRvd246IGZ1bmN0aW9uKCkge1xuXHRcdE1vY2tYTUxIdHRwUmVxdWVzdC5oYW5kbGVycyA9IFtdO1xuXHRcdHdpbmRvdy5YTUxIdHRwUmVxdWVzdCA9IHJlYWw7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0LyoqXG5cdCAqIE1vY2sgYSByZXF1ZXN0XG5cdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICAgIFttZXRob2RdXG5cdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICAgIFt1cmxdXG5cdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIGZuXG5cdCAqIEByZXR1cm5zIHtleHBvcnRzfVxuXHQgKi9cblx0bW9jazogZnVuY3Rpb24obWV0aG9kLCB1cmwsIGZuKSB7XG5cdFx0dmFyIGhhbmRsZXI7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcblx0XHRcdGhhbmRsZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRcdFx0XHRpZiAocmVxLm1ldGhvZCgpID09PSBtZXRob2QgJiYgcmVxLnVybCgpID09PSB1cmwpIHtcblx0XHRcdFx0XHRyZXR1cm4gZm4ocmVxLCByZXMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGhhbmRsZXIgPSBtZXRob2Q7XG5cdFx0fVxuXG5cdFx0TW9ja1hNTEh0dHBSZXF1ZXN0LmFkZEhhbmRsZXIoaGFuZGxlcik7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvKipcblx0ICogTW9jayBhIEdFVCByZXF1ZXN0XG5cdCAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgIHVybFxuXHQgKiBAcGFyYW0gICB7RnVuY3Rpb259ICBmblxuXHQgKiBAcmV0dXJucyB7ZXhwb3J0c31cblx0ICovXG5cdGdldDogZnVuY3Rpb24odXJsLCBmbikge1xuXHRcdHJldHVybiB0aGlzLm1vY2soJ0dFVCcsIHVybCwgZm4pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBNb2NrIGEgUE9TVCByZXF1ZXN0XG5cdCAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgIHVybFxuXHQgKiBAcGFyYW0gICB7RnVuY3Rpb259ICBmblxuXHQgKiBAcmV0dXJucyB7ZXhwb3J0c31cblx0ICovXG5cdHBvc3Q6IGZ1bmN0aW9uKHVybCwgZm4pIHtcblx0XHRyZXR1cm4gdGhpcy5tb2NrKCdQT1NUJywgdXJsLCBmbik7XG5cdH0sXG5cblx0LyoqXG5cdCAqIE1vY2sgYSBQVVQgcmVxdWVzdFxuXHQgKiBAcGFyYW0gICB7U3RyaW5nfSAgICB1cmxcblx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgZm5cblx0ICogQHJldHVybnMge2V4cG9ydHN9XG5cdCAqL1xuXHRwdXQ6IGZ1bmN0aW9uKHVybCwgZm4pIHtcblx0XHRyZXR1cm4gdGhpcy5tb2NrKCdQVVQnLCB1cmwsIGZuKTtcblx0fSxcblxuXHQvKipcblx0ICogTW9jayBhIFBBVENIIHJlcXVlc3Rcblx0ICogQHBhcmFtICAge1N0cmluZ30gICAgdXJsXG5cdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIGZuXG5cdCAqIEByZXR1cm5zIHtleHBvcnRzfVxuXHQgKi9cblx0cGF0Y2g6IGZ1bmN0aW9uKHVybCwgZm4pIHtcblx0XHRyZXR1cm4gdGhpcy5tb2NrKCdQQVRDSCcsIHVybCwgZm4pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBNb2NrIGEgREVMRVRFIHJlcXVlc3Rcblx0ICogQHBhcmFtICAge1N0cmluZ30gICAgdXJsXG5cdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIGZuXG5cdCAqIEByZXR1cm5zIHtleHBvcnRzfVxuXHQgKi9cblx0ZGVsZXRlOiBmdW5jdGlvbih1cmwsIGZuKSB7XG5cdFx0cmV0dXJuIHRoaXMubW9jaygnREVMRVRFJywgdXJsLCBmbik7XG5cdH1cblxufTtcbiIsIlxuLyoqXG4gKiBUaGUgbW9ja2VkIHJlcXVlc3QgZGF0YVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE1vY2tSZXF1ZXN0KHhocikge1xuICB0aGlzLl9tZXRob2QgICAgPSB4aHIubWV0aG9kO1xuICB0aGlzLl91cmwgICAgICAgPSB4aHIudXJsO1xuICB0aGlzLl9oZWFkZXJzICAgPSB7fTtcbiAgdGhpcy5oZWFkZXJzKHhoci5fcmVxdWVzdEhlYWRlcnMpO1xuICB0aGlzLmJvZHkoeGhyLmRhdGEpO1xufVxuXG4vKipcbiAqIEdldC9zZXQgdGhlIEhUVFAgbWV0aG9kXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5Nb2NrUmVxdWVzdC5wcm90b3R5cGUubWV0aG9kID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9tZXRob2Q7XG59O1xuXG4vKipcbiAqIEdldC9zZXQgdGhlIEhUVFAgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5Nb2NrUmVxdWVzdC5wcm90b3R5cGUudXJsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl91cmw7XG59O1xuXG4vKipcbiAqIEdldC9zZXQgYSBIVFRQIGhlYWRlclxuICogQHBhcmFtICAge3N0cmluZ30gbmFtZVxuICogQHBhcmFtICAge3N0cmluZ30gW3ZhbHVlXVxuICogQHJldHVybnMge3N0cmluZ3x1bmRlZmluZWR8TW9ja1JlcXVlc3R9XG4gKi9cbk1vY2tSZXF1ZXN0LnByb3RvdHlwZS5oZWFkZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIHRoaXMuX2hlYWRlcnNbbmFtZS50b0xvd2VyQ2FzZSgpXSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLl9oZWFkZXJzW25hbWUudG9Mb3dlckNhc2UoKV0gfHwgbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBHZXQvc2V0IGFsbCBvZiB0aGUgSFRUUCBoZWFkZXJzXG4gKiBAcGFyYW0gICB7T2JqZWN0fSBbaGVhZGVyc11cbiAqIEByZXR1cm5zIHtPYmplY3R8TW9ja1JlcXVlc3R9XG4gKi9cbk1vY2tSZXF1ZXN0LnByb3RvdHlwZS5oZWFkZXJzID0gZnVuY3Rpb24oaGVhZGVycykge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIG5hbWUgaW4gaGVhZGVycykge1xuICAgICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgdGhpcy5oZWFkZXIobmFtZSwgaGVhZGVyc1tuYW1lXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLl9oZWFkZXJzO1xuICB9XG59O1xuXG4vKipcbiAqIEdldC9zZXQgdGhlIEhUVFAgYm9keVxuICogQHBhcmFtICAge3N0cmluZ30gW2JvZHldXG4gKiBAcmV0dXJucyB7c3RyaW5nfE1vY2tSZXF1ZXN0fVxuICovXG5Nb2NrUmVxdWVzdC5wcm90b3R5cGUuYm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9ib2R5ID0gYm9keTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5fYm9keTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2NrUmVxdWVzdDtcbiIsIlxuLyoqXG4gKiBUaGUgbW9ja2VkIHJlc3BvbnNlIGRhdGFcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBNb2NrUmVzcG9uc2UoKSB7XG4gIHRoaXMuX3N0YXR1cyAgICAgID0gMjAwO1xuICB0aGlzLl9oZWFkZXJzICAgICA9IHt9O1xuICB0aGlzLl9ib2R5ICAgICAgICA9ICcnO1xuICB0aGlzLl90aW1lb3V0ICAgICA9IGZhbHNlO1xufVxuXG4vKipcbiAqIEdldC9zZXQgdGhlIEhUVFAgc3RhdHVzXG4gKiBAcGFyYW0gICB7bnVtYmVyfSBbY29kZV1cbiAqIEByZXR1cm5zIHtudW1iZXJ8TW9ja1Jlc3BvbnNlfVxuICovXG5Nb2NrUmVzcG9uc2UucHJvdG90eXBlLnN0YXR1cyA9IGZ1bmN0aW9uKGNvZGUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9zdGF0dXMgPSBjb2RlO1xuICAgIHJldHVybiB0aGlzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLl9zdGF0dXM7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0L3NldCBhIEhUVFAgaGVhZGVyXG4gKiBAcGFyYW0gICB7c3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0gICB7c3RyaW5nfSBbdmFsdWVdXG4gKiBAcmV0dXJucyB7c3RyaW5nfHVuZGVmaW5lZHxNb2NrUmVzcG9uc2V9XG4gKi9cbk1vY2tSZXNwb25zZS5wcm90b3R5cGUuaGVhZGVyID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICB0aGlzLl9oZWFkZXJzW25hbWUudG9Mb3dlckNhc2UoKV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5faGVhZGVyc1tuYW1lLnRvTG93ZXJDYXNlKCldIHx8IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0L3NldCBhbGwgb2YgdGhlIEhUVFAgaGVhZGVyc1xuICogQHBhcmFtICAge09iamVjdH0gW2hlYWRlcnNdXG4gKiBAcmV0dXJucyB7T2JqZWN0fE1vY2tSZXNwb25zZX1cbiAqL1xuTW9ja1Jlc3BvbnNlLnByb3RvdHlwZS5oZWFkZXJzID0gZnVuY3Rpb24oaGVhZGVycykge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIG5hbWUgaW4gaGVhZGVycykge1xuICAgICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgdGhpcy5oZWFkZXIobmFtZSwgaGVhZGVyc1tuYW1lXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLl9oZWFkZXJzO1xuICB9XG59O1xuXG4vKipcbiAqIEdldC9zZXQgdGhlIEhUVFAgYm9keVxuICogQHBhcmFtICAge3N0cmluZ30gW2JvZHldXG4gKiBAcmV0dXJucyB7c3RyaW5nfE1vY2tSZXNwb25zZX1cbiAqL1xuTW9ja1Jlc3BvbnNlLnByb3RvdHlwZS5ib2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2JvZHkgPSBib2R5O1xuICAgIHJldHVybiB0aGlzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLl9ib2R5O1xuICB9XG59O1xuXG4vKipcbiAqIEdldC9zZXQgdGhlIEhUVFAgdGltZW91dFxuICogQHBhcmFtICAge2Jvb2xlYW58bnVtYmVyfSBbdGltZW91dF1cbiAqIEByZXR1cm5zIHtib29sZWFufG51bWJlcnxNb2NrUmVzcG9uc2V9XG4gKi9cbk1vY2tSZXNwb25zZS5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl90aW1lb3V0ID0gdGltZW91dDtcbiAgICByZXR1cm4gdGhpcztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5fdGltZW91dDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2NrUmVzcG9uc2U7XG4iLCJ2YXIgTW9ja1JlcXVlc3QgICA9IHJlcXVpcmUoJy4vTW9ja1JlcXVlc3QnKTtcbnZhciBNb2NrUmVzcG9uc2UgID0gcmVxdWlyZSgnLi9Nb2NrUmVzcG9uc2UnKTtcblxudmFyIG5vdEltcGxlbWVudGVkRXJyb3IgPSBuZXcgRXJyb3IoJ1RoaXMgZmVhdHVyZSBoYXNuXFwndCBiZWVuIGltcGxtZW50ZWQgeWV0LiBQbGVhc2Ugc3VibWl0IGFuIElzc3VlIG9yIFB1bGwgUmVxdWVzdCBvbiBHaXRodWIuJyk7XG5cbi8vaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1hNTEh0dHBSZXF1ZXN0XG4vL2h0dHBzOi8veGhyLnNwZWMud2hhdHdnLm9yZy9cbi8vaHR0cDovL3d3dy53My5vcmcvVFIvMjAwNi9XRC1YTUxIdHRwUmVxdWVzdC0yMDA2MDQwNS9cblxuTW9ja1hNTEh0dHBSZXF1ZXN0LlNUQVRFX1VOU0VOVCAgICAgICAgICAgICA9IDA7XG5Nb2NrWE1MSHR0cFJlcXVlc3QuU1RBVEVfT1BFTkVEICAgICAgICAgICAgID0gMTtcbk1vY2tYTUxIdHRwUmVxdWVzdC5TVEFURV9IRUFERVJTX1JFQ0VJVkVEICAgPSAyO1xuTW9ja1hNTEh0dHBSZXF1ZXN0LlNUQVRFX0xPQURJTkcgICAgICAgICAgICA9IDM7XG5Nb2NrWE1MSHR0cFJlcXVlc3QuU1RBVEVfRE9ORSAgICAgICAgICAgICAgID0gNDtcblxuLyoqXG4gKiBUaGUgcmVxdWVzdCBoYW5kbGVyc1xuICogQHByaXZhdGVcbiAqIEB0eXBlIHtBcnJheX1cbiAqL1xuTW9ja1hNTEh0dHBSZXF1ZXN0LmhhbmRsZXJzID0gW107XG5cbi8qKlxuICogQWRkIGEgcmVxdWVzdCBoYW5kbGVyXG4gKiBAcGFyYW0gICB7ZnVuY3Rpb24oTW9ja1JlcXVlc3QsIE1vY2tSZXNwb25zZSl9IGZuXG4gKiBAcmV0dXJucyB7TW9ja1hNTEh0dHBSZXF1ZXN0fVxuICovXG5Nb2NrWE1MSHR0cFJlcXVlc3QuYWRkSGFuZGxlciA9IGZ1bmN0aW9uKGZuKSB7XG4gIE1vY2tYTUxIdHRwUmVxdWVzdC5oYW5kbGVycy5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhIHJlcXVlc3QgaGFuZGxlclxuICogQHBhcmFtICAge2Z1bmN0aW9uKE1vY2tSZXF1ZXN0LCBNb2NrUmVzcG9uc2UpfSBmblxuICogQHJldHVybnMge01vY2tYTUxIdHRwUmVxdWVzdH1cbiAqL1xuTW9ja1hNTEh0dHBSZXF1ZXN0LnJlbW92ZUhhbmRsZXIgPSBmdW5jdGlvbihmbikge1xuICB0aHJvdyBub3RJbXBsZW1lbnRlZEVycm9yO1xufTtcblxuLyoqXG4gKiBIYW5kbGUgYSByZXF1ZXN0XG4gKiBAcGFyYW0gICB7TW9ja1JlcXVlc3R9IHJlcXVlc3RcbiAqIEByZXR1cm5zIHtNb2NrUmVzcG9uc2V8bnVsbH1cbiAqL1xuTW9ja1hNTEh0dHBSZXF1ZXN0LmhhbmRsZSA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcblxuICBmb3IgKHZhciBpPTA7IGk8TW9ja1hNTEh0dHBSZXF1ZXN0LmhhbmRsZXJzLmxlbmd0aDsgKytpKSB7XG5cbiAgICAvL2dldCB0aGUgZ2VuZXJhdG9yIHRvIGNyZWF0ZSBhIHJlc3BvbnNlIHRvIHRoZSByZXF1ZXN0XG4gICAgdmFyIHJlc3BvbnNlID0gTW9ja1hNTEh0dHBSZXF1ZXN0LmhhbmRsZXJzW2ldKHJlcXVlc3QsIG5ldyBNb2NrUmVzcG9uc2UoKSk7XG5cbiAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBNb2NrIFhNTEh0dHBSZXF1ZXN0XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gTW9ja1hNTEh0dHBSZXF1ZXN0KCkge1xuICB0aGlzLnJlc2V0KCk7XG4gIHRoaXMudGltZW91dCA9IDA7XG59XG5cbi8qKlxuICogUmVzZXQgdGhlIHJlc3BvbnNlIHZhbHVlc1xuICogQHByaXZhdGVcbiAqL1xuTW9ja1hNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuXG4gIHRoaXMuX3JlcXVlc3RIZWFkZXJzICA9IHt9O1xuICB0aGlzLl9yZXNwb25zZUhlYWRlcnMgPSB7fTtcblxuICB0aGlzLnN0YXR1cyAgICAgICA9IDA7XG4gIHRoaXMuc3RhdHVzVGV4dCAgID0gJyc7XG5cbiAgdGhpcy5yZXNwb25zZSAgICAgPSBudWxsO1xuICB0aGlzLnJlc3BvbnNlVHlwZSA9IG51bGw7XG4gIHRoaXMucmVzcG9uc2VUZXh0ID0gbnVsbDtcbiAgdGhpcy5yZXNwb25zZVhNTCAgPSBudWxsO1xuXG4gIHRoaXMucmVhZHlTdGF0ZSAgID0gTW9ja1hNTEh0dHBSZXF1ZXN0LlNUQVRFX1VOU0VOVDtcbn07XG5cbi8qKlxuICogVHJpZ2dlciBhbiBldmVudFxuICogQHBhcmFtICAge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm5zIHtNb2NrWE1MSHR0cFJlcXVlc3R9XG4gKi9cbk1vY2tYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgaWYgKHRoaXMub25yZWFkeXN0YXRlY2hhbmdlKSB7XG4gICAgdGhpcy5vbnJlYWR5c3RhdGVjaGFuZ2UoKTtcbiAgfVxuXG4gIGlmICh0aGlzWydvbicrZXZlbnRdKSB7XG4gICAgdGhpc1snb24nK2V2ZW50XSgpO1xuICB9XG5cbiAgLy9pdGVyYXRlIG92ZXIgdGhlIGxpc3RlbmVyc1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuTW9ja1hNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24obWV0aG9kLCB1cmwsIGFzeW5jLCB1c2VyLCBwYXNzd29yZCkge1xuICB0aGlzLnJlc2V0KCk7XG4gIHRoaXMubWV0aG9kICAgPSBtZXRob2Q7XG4gIHRoaXMudXJsICAgICAgPSB1cmw7XG4gIHRoaXMuYXN5bmMgICAgPSBhc3luYztcbiAgdGhpcy51c2VyICAgICA9IHVzZXI7XG4gIHRoaXMucGFzc3dvcmQgPSBwYXNzd29yZDtcbiAgdGhpcy5kYXRhICAgICA9IG51bGw7XG4gIHRoaXMucmVhZHlTdGF0ZSA9IE1vY2tYTUxIdHRwUmVxdWVzdC5TVEFURV9PUEVORUQ7XG59O1xuXG5Nb2NrWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNldFJlcXVlc3RIZWFkZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB0aGlzLl9yZXF1ZXN0SGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xufTtcblxuTW9ja1hNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5vdmVycmlkZU1pbWVUeXBlID0gZnVuY3Rpb24obWltZSkge1xuICB0aHJvdyBub3RJbXBsZW1lbnRlZEVycm9yO1xufTtcblxuTW9ja1hNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24oZGF0YSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgc2VsZi5yZWFkeVN0YXRlID0gTW9ja1hNTEh0dHBSZXF1ZXN0LlNUQVRFX0xPQURJTkc7XG5cbiAgc2VsZi5fc2VuZFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIHJlc3BvbnNlID0gTW9ja1hNTEh0dHBSZXF1ZXN0LmhhbmRsZShuZXcgTW9ja1JlcXVlc3Qoc2VsZikpO1xuXG4gICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlIGluc3RhbmNlb2YgTW9ja1Jlc3BvbnNlKSB7XG5cbiAgICAgIHZhciB0aW1lb3V0ID0gcmVzcG9uc2UudGltZW91dCgpO1xuXG4gICAgICBpZiAodGltZW91dCkge1xuXG4gICAgICAgIC8vdHJpZ2dlciBhIHRpbWVvdXQgZXZlbnQgYmVjYXVzZSB0aGUgcmVxdWVzdCB0aW1lZCBvdXQgLSB3YWl0IGZvciB0aGUgdGltZW91dCB0aW1lIGJlY2F1c2UgbWFueSBsaWJzIGxpa2UganF1ZXJ5IGFuZCBzdXBlcmFnZW50IHVzZSBzZXRUaW1lb3V0IHRvIGRldGVjdCB0aGUgZXJyb3IgdHlwZVxuICAgICAgICBzZWxmLl9zZW5kVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VsZi5yZWFkeVN0YXRlID0gTW9ja1hNTEh0dHBSZXF1ZXN0LlNUQVRFX0RPTkU7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCd0aW1lb3V0Jyk7XG4gICAgICAgIH0sIHR5cGVvZih0aW1lb3V0KSA9PT0gJ251bWJlcicgPyB0aW1lb3V0IDogc2VsZi50aW1lb3V0KzEpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vbWFwIHRoZSByZXNwb25zZSB0byB0aGUgWEhSIG9iamVjdFxuICAgICAgICBzZWxmLnN0YXR1cyAgICAgICAgICAgICA9IHJlc3BvbnNlLnN0YXR1cygpO1xuICAgICAgICBzZWxmLl9yZXNwb25zZUhlYWRlcnMgICA9IHJlc3BvbnNlLmhlYWRlcnMoKTtcbiAgICAgICAgc2VsZi5yZXNwb25zZVR5cGUgICAgICAgPSAndGV4dCc7XG4gICAgICAgIHNlbGYucmVzcG9uc2UgICAgICAgICAgID0gcmVzcG9uc2UuYm9keSgpO1xuICAgICAgICBzZWxmLnJlc3BvbnNlVGV4dCAgICAgICA9IHJlc3BvbnNlLmJvZHkoKTsgLy9UT0RPOiBkZXRlY3QgYW4gb2JqZWN0IGFuZCByZXR1cm4gSlNPTiwgZGV0ZWN0IFhNTCBhbmQgcmV0dXJuIFhNTFxuICAgICAgICBzZWxmLnJlYWR5U3RhdGUgICAgICAgICA9IE1vY2tYTUxIdHRwUmVxdWVzdC5TVEFURV9ET05FO1xuXG4gICAgICAgIC8vdHJpZ2dlciBhIGxvYWQgZXZlbnQgYmVjYXVzZSB0aGUgcmVxdWVzdCB3YXMgcmVjZWl2ZWRcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdsb2FkJyk7XG5cbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIC8vdHJpZ2dlciBhbiBlcnJvciBiZWNhdXNlIHRoZSByZXF1ZXN0IHdhcyBub3QgaGFuZGxlZFxuICAgICAgc2VsZi5yZWFkeVN0YXRlID0gTW9ja1hNTEh0dHBSZXF1ZXN0LlNUQVRFX0RPTkU7XG4gICAgICBzZWxmLnRyaWdnZXIoJ2Vycm9yJyk7XG5cbiAgICB9XG5cbiAgfSwgMCk7XG5cbn07XG5cbk1vY2tYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgY2xlYXJUaW1lb3V0KHRoaXMuX3NlbmRUaW1lb3V0KTtcblxuICBpZiAodGhpcy5yZWFkeVN0YXRlID4gTW9ja1hNTEh0dHBSZXF1ZXN0LlNUQVRFX1VOU0VOVCAmJiB0aGlzLnJlYWR5U3RhdGUgPCBNb2NrWE1MSHR0cFJlcXVlc3QuU1RBVEVfRE9ORSkge1xuICAgIHRoaXMucmVhZHlTdGF0ZSA9IE1vY2tYTUxIdHRwUmVxdWVzdC5TVEFURV9VTlNFTlQ7XG4gICAgdGhpcy50cmlnZ2VyKCdhYm9ydCcpO1xuICB9XG5cbn07XG5cbk1vY2tYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzID0gZnVuY3Rpb24oKSB7XG5cbiAgaWYgKHRoaXMucmVhZHlTdGF0ZSA8IE1vY2tYTUxIdHRwUmVxdWVzdC5TVEFURV9IRUFERVJTX1JFQ0VJVkVEKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgaGVhZGVycyA9ICcnO1xuICBmb3IgKHZhciBuYW1lIGluIHRoaXMuX3Jlc3BvbnNlSGVhZGVycykge1xuICAgIGlmICh0aGlzLl9yZXNwb25zZUhlYWRlcnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGhlYWRlcnMgKz0gbmFtZSsnOiAnK3RoaXMuX3Jlc3BvbnNlSGVhZGVyc1tuYW1lXSsnXFxyXFxuJztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaGVhZGVycztcbn07XG5cbk1vY2tYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuZ2V0UmVzcG9uc2VIZWFkZXIgPSBmdW5jdGlvbihuYW1lKSB7XG5cbiAgaWYgKHRoaXMucmVhZHlTdGF0ZSA8IE1vY2tYTUxIdHRwUmVxdWVzdC5TVEFURV9IRUFERVJTX1JFQ0VJVkVEKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fcmVzcG9uc2VIZWFkZXJzW25hbWUudG9Mb3dlckNhc2UoKV0gfHwgbnVsbDtcbn07XG5cbk1vY2tYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICB0aHJvdyBub3RJbXBsZW1lbnRlZEVycm9yO1xufTtcblxuTW9ja1hNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gIHRocm93IG5vdEltcGxlbWVudGVkRXJyb3I7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vY2tYTUxIdHRwUmVxdWVzdDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIHdpbmRvdyA9IHJlcXVpcmUoXCJnbG9iYWwvd2luZG93XCIpXG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoXCJpcy1mdW5jdGlvblwiKVxudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoXCJwYXJzZS1oZWFkZXJzXCIpXG52YXIgeHRlbmQgPSByZXF1aXJlKFwieHRlbmRcIilcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVYSFJcbmNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCB8fCBub29wXG5jcmVhdGVYSFIuWERvbWFpblJlcXVlc3QgPSBcIndpdGhDcmVkZW50aWFsc1wiIGluIChuZXcgY3JlYXRlWEhSLlhNTEh0dHBSZXF1ZXN0KCkpID8gY3JlYXRlWEhSLlhNTEh0dHBSZXF1ZXN0IDogd2luZG93LlhEb21haW5SZXF1ZXN0XG5cbmZvckVhY2hBcnJheShbXCJnZXRcIiwgXCJwdXRcIiwgXCJwb3N0XCIsIFwicGF0Y2hcIiwgXCJoZWFkXCIsIFwiZGVsZXRlXCJdLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBjcmVhdGVYSFJbbWV0aG9kID09PSBcImRlbGV0ZVwiID8gXCJkZWxcIiA6IG1ldGhvZF0gPSBmdW5jdGlvbih1cmksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICAgIG9wdGlvbnMgPSBpbml0UGFyYW1zKHVyaSwgb3B0aW9ucywgY2FsbGJhY2spXG4gICAgICAgIG9wdGlvbnMubWV0aG9kID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgICAgICAgcmV0dXJuIF9jcmVhdGVYSFIob3B0aW9ucylcbiAgICB9XG59KVxuXG5mdW5jdGlvbiBmb3JFYWNoQXJyYXkoYXJyYXksIGl0ZXJhdG9yKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRvcihhcnJheVtpXSlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzRW1wdHkob2JqKXtcbiAgICBmb3IodmFyIGkgaW4gb2JqKXtcbiAgICAgICAgaWYob2JqLmhhc093blByb3BlcnR5KGkpKSByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gaW5pdFBhcmFtcyh1cmksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHBhcmFtcyA9IHVyaVxuXG4gICAgaWYgKGlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBvcHRpb25zXG4gICAgICAgIGlmICh0eXBlb2YgdXJpID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSB7dXJpOnVyaX1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmFtcyA9IHh0ZW5kKG9wdGlvbnMsIHt1cmk6IHVyaX0pXG4gICAgfVxuXG4gICAgcGFyYW1zLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICByZXR1cm4gcGFyYW1zXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVhIUih1cmksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgb3B0aW9ucyA9IGluaXRQYXJhbXModXJpLCBvcHRpb25zLCBjYWxsYmFjaylcbiAgICByZXR1cm4gX2NyZWF0ZVhIUihvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlWEhSKG9wdGlvbnMpIHtcbiAgICBpZih0eXBlb2Ygb3B0aW9ucy5jYWxsYmFjayA9PT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImNhbGxiYWNrIGFyZ3VtZW50IG1pc3NpbmdcIilcbiAgICB9XG5cbiAgICB2YXIgY2FsbGVkID0gZmFsc2VcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiBjYk9uY2UoZXJyLCByZXNwb25zZSwgYm9keSl7XG4gICAgICAgIGlmKCFjYWxsZWQpe1xuICAgICAgICAgICAgY2FsbGVkID0gdHJ1ZVxuICAgICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayhlcnIsIHJlc3BvbnNlLCBib2R5KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVhZHlzdGF0ZWNoYW5nZSgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICBsb2FkRnVuYygpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCb2R5KCkge1xuICAgICAgICAvLyBDaHJvbWUgd2l0aCByZXF1ZXN0VHlwZT1ibG9iIHRocm93cyBlcnJvcnMgYXJyb3VuZCB3aGVuIGV2ZW4gdGVzdGluZyBhY2Nlc3MgdG8gcmVzcG9uc2VUZXh0XG4gICAgICAgIHZhciBib2R5ID0gdW5kZWZpbmVkXG5cbiAgICAgICAgaWYgKHhoci5yZXNwb25zZSkge1xuICAgICAgICAgICAgYm9keSA9IHhoci5yZXNwb25zZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYm9keSA9IHhoci5yZXNwb25zZVRleHQgfHwgZ2V0WG1sKHhocilcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0pzb24pIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYm9keVxuICAgIH1cblxuICAgIHZhciBmYWlsdXJlUmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgYm9keTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDAsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmksXG4gICAgICAgICAgICAgICAgcmF3UmVxdWVzdDogeGhyXG4gICAgICAgICAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvckZ1bmMoZXZ0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXIpXG4gICAgICAgIGlmKCEoZXZ0IGluc3RhbmNlb2YgRXJyb3IpKXtcbiAgICAgICAgICAgIGV2dCA9IG5ldyBFcnJvcihcIlwiICsgKGV2dCB8fCBcIlVua25vd24gWE1MSHR0cFJlcXVlc3QgRXJyb3JcIikgKVxuICAgICAgICB9XG4gICAgICAgIGV2dC5zdGF0dXNDb2RlID0gMFxuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXZ0LCBmYWlsdXJlUmVzcG9uc2UpXG4gICAgfVxuXG4gICAgLy8gd2lsbCBsb2FkIHRoZSBkYXRhICYgcHJvY2VzcyB0aGUgcmVzcG9uc2UgaW4gYSBzcGVjaWFsIHJlc3BvbnNlIG9iamVjdFxuICAgIGZ1bmN0aW9uIGxvYWRGdW5jKCkge1xuICAgICAgICBpZiAoYWJvcnRlZCkgcmV0dXJuXG4gICAgICAgIHZhciBzdGF0dXNcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRUaW1lcilcbiAgICAgICAgaWYob3B0aW9ucy51c2VYRFIgJiYgeGhyLnN0YXR1cz09PXVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy9JRTggQ09SUyBHRVQgc3VjY2Vzc2Z1bCByZXNwb25zZSBkb2Vzbid0IGhhdmUgYSBzdGF0dXMgZmllbGQsIGJ1dCBib2R5IGlzIGZpbmVcbiAgICAgICAgICAgIHN0YXR1cyA9IDIwMFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdHVzID0gKHhoci5zdGF0dXMgPT09IDEyMjMgPyAyMDQgOiB4aHIuc3RhdHVzKVxuICAgICAgICB9XG4gICAgICAgIHZhciByZXNwb25zZSA9IGZhaWx1cmVSZXNwb25zZVxuICAgICAgICB2YXIgZXJyID0gbnVsbFxuXG4gICAgICAgIGlmIChzdGF0dXMgIT09IDApe1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgYm9keTogZ2V0Qm9keSgpLFxuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IHN0YXR1cyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgICAgICB1cmw6IHVyaSxcbiAgICAgICAgICAgICAgICByYXdSZXF1ZXN0OiB4aHJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMpeyAvL3JlbWVtYmVyIHhociBjYW4gaW4gZmFjdCBiZSBYRFIgZm9yIENPUlMgaW4gSUVcbiAgICAgICAgICAgICAgICByZXNwb25zZS5oZWFkZXJzID0gcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVyciA9IG5ldyBFcnJvcihcIkludGVybmFsIFhNTEh0dHBSZXF1ZXN0IEVycm9yXCIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgcmVzcG9uc2UsIHJlc3BvbnNlLmJvZHkpXG4gICAgfVxuXG4gICAgdmFyIHhociA9IG9wdGlvbnMueGhyIHx8IG51bGxcblxuICAgIGlmICgheGhyKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmNvcnMgfHwgb3B0aW9ucy51c2VYRFIpIHtcbiAgICAgICAgICAgIHhociA9IG5ldyBjcmVhdGVYSFIuWERvbWFpblJlcXVlc3QoKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHhociA9IG5ldyBjcmVhdGVYSFIuWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGtleVxuICAgIHZhciBhYm9ydGVkXG4gICAgdmFyIHVyaSA9IHhoci51cmwgPSBvcHRpb25zLnVyaSB8fCBvcHRpb25zLnVybFxuICAgIHZhciBtZXRob2QgPSB4aHIubWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgXCJHRVRcIlxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5IHx8IG9wdGlvbnMuZGF0YSB8fCBudWxsXG4gICAgdmFyIGhlYWRlcnMgPSB4aHIuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fVxuICAgIHZhciBzeW5jID0gISFvcHRpb25zLnN5bmNcbiAgICB2YXIgaXNKc29uID0gZmFsc2VcbiAgICB2YXIgdGltZW91dFRpbWVyXG5cbiAgICBpZiAoXCJqc29uXCIgaW4gb3B0aW9ucykge1xuICAgICAgICBpc0pzb24gPSB0cnVlXG4gICAgICAgIGhlYWRlcnNbXCJhY2NlcHRcIl0gfHwgaGVhZGVyc1tcIkFjY2VwdFwiXSB8fCAoaGVhZGVyc1tcIkFjY2VwdFwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiKSAvL0Rvbid0IG92ZXJyaWRlIGV4aXN0aW5nIGFjY2VwdCBoZWFkZXIgZGVjbGFyZWQgYnkgdXNlclxuICAgICAgICBpZiAobWV0aG9kICE9PSBcIkdFVFwiICYmIG1ldGhvZCAhPT0gXCJIRUFEXCIpIHtcbiAgICAgICAgICAgIGhlYWRlcnNbXCJjb250ZW50LXR5cGVcIl0gfHwgaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSB8fCAoaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiKSAvL0Rvbid0IG92ZXJyaWRlIGV4aXN0aW5nIGFjY2VwdCBoZWFkZXIgZGVjbGFyZWQgYnkgdXNlclxuICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuanNvbilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSByZWFkeXN0YXRlY2hhbmdlXG4gICAgeGhyLm9ubG9hZCA9IGxvYWRGdW5jXG4gICAgeGhyLm9uZXJyb3IgPSBlcnJvckZ1bmNcbiAgICAvLyBJRTkgbXVzdCBoYXZlIG9ucHJvZ3Jlc3MgYmUgc2V0IHRvIGEgdW5pcXVlIGZ1bmN0aW9uLlxuICAgIHhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBJRSBtdXN0IGRpZVxuICAgIH1cbiAgICB4aHIub250aW1lb3V0ID0gZXJyb3JGdW5jXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmksICFzeW5jLCBvcHRpb25zLnVzZXJuYW1lLCBvcHRpb25zLnBhc3N3b3JkKVxuICAgIC8vaGFzIHRvIGJlIGFmdGVyIG9wZW5cbiAgICBpZighc3luYykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gISFvcHRpb25zLndpdGhDcmVkZW50aWFsc1xuICAgIH1cbiAgICAvLyBDYW5ub3Qgc2V0IHRpbWVvdXQgd2l0aCBzeW5jIHJlcXVlc3RcbiAgICAvLyBub3Qgc2V0dGluZyB0aW1lb3V0IG9uIHRoZSB4aHIgb2JqZWN0LCBiZWNhdXNlIG9mIG9sZCB3ZWJraXRzIGV0Yy4gbm90IGhhbmRsaW5nIHRoYXQgY29ycmVjdGx5XG4gICAgLy8gYm90aCBucG0ncyByZXF1ZXN0IGFuZCBqcXVlcnkgMS54IHVzZSB0aGlzIGtpbmQgb2YgdGltZW91dCwgc28gdGhpcyBpcyBiZWluZyBjb25zaXN0ZW50XG4gICAgaWYgKCFzeW5jICYmIG9wdGlvbnMudGltZW91dCA+IDAgKSB7XG4gICAgICAgIHRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGFib3J0ZWQ9dHJ1ZS8vSUU5IG1heSBzdGlsbCBjYWxsIHJlYWR5c3RhdGVjaGFuZ2VcbiAgICAgICAgICAgIHhoci5hYm9ydChcInRpbWVvdXRcIilcbiAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKFwiWE1MSHR0cFJlcXVlc3QgdGltZW91dFwiKVxuICAgICAgICAgICAgZS5jb2RlID0gXCJFVElNRURPVVRcIlxuICAgICAgICAgICAgZXJyb3JGdW5jKGUpXG4gICAgICAgIH0sIG9wdGlvbnMudGltZW91dCApXG4gICAgfVxuXG4gICAgaWYgKHhoci5zZXRSZXF1ZXN0SGVhZGVyKSB7XG4gICAgICAgIGZvcihrZXkgaW4gaGVhZGVycyl7XG4gICAgICAgICAgICBpZihoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmhlYWRlcnMgJiYgIWlzRW1wdHkob3B0aW9ucy5oZWFkZXJzKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJIZWFkZXJzIGNhbm5vdCBiZSBzZXQgb24gYW4gWERvbWFpblJlcXVlc3Qgb2JqZWN0XCIpXG4gICAgfVxuXG4gICAgaWYgKFwicmVzcG9uc2VUeXBlXCIgaW4gb3B0aW9ucykge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gb3B0aW9ucy5yZXNwb25zZVR5cGVcbiAgICB9XG5cbiAgICBpZiAoXCJiZWZvcmVTZW5kXCIgaW4gb3B0aW9ucyAmJlxuICAgICAgICB0eXBlb2Ygb3B0aW9ucy5iZWZvcmVTZW5kID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgb3B0aW9ucy5iZWZvcmVTZW5kKHhocilcbiAgICB9XG5cbiAgICB4aHIuc2VuZChib2R5KVxuXG4gICAgcmV0dXJuIHhoclxuXG5cbn1cblxuZnVuY3Rpb24gZ2V0WG1sKHhocikge1xuICAgIGlmICh4aHIucmVzcG9uc2VUeXBlID09PSBcImRvY3VtZW50XCIpIHtcbiAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZVhNTFxuICAgIH1cbiAgICB2YXIgZmlyZWZveEJ1Z1Rha2VuRWZmZWN0ID0geGhyLnN0YXR1cyA9PT0gMjA0ICYmIHhoci5yZXNwb25zZVhNTCAmJiB4aHIucmVzcG9uc2VYTUwuZG9jdW1lbnRFbGVtZW50Lm5vZGVOYW1lID09PSBcInBhcnNlcmVycm9yXCJcbiAgICBpZiAoeGhyLnJlc3BvbnNlVHlwZSA9PT0gXCJcIiAmJiAhZmlyZWZveEJ1Z1Rha2VuRWZmZWN0KSB7XG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VYTUxcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxufVxuXG5mdW5jdGlvbiBub29wKCkge31cbiIsIm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kXG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgdGFyZ2V0ID0ge31cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0XG59XG4iLCIvKmVzbGludCBuby1zaGFkb3c6IFsyLCB7IFwiYWxsb3dcIjogW1wiZGlzcGF0Y2hcIl0gfV0qL1xuaW1wb3J0IHhociBmcm9tIFwieGhyXCI7XG5pbXBvcnQgbWFwcGluZ1RvSnNvbkxkUm1sIGZyb20gXCIuL3V0aWwvbWFwcGluZ1RvSnNvbkxkUm1sXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFjdGlvbnNNYWtlcihuYXZpZ2F0ZVRvLCBkaXNwYXRjaCkge1xuICAvL2JpbmQgdG8gdmFyaWFibGUgc28gYW4gYWN0aW9uIGNhbiB0cmlnZ2VyIG90aGVyIGFjdGlvbnNcbiAgbGV0IGFjdGlvbnMgPSB7XG4gICAgb25Ub2tlbjogZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICB4aHIocHJvY2Vzcy5lbnYuc2VydmVyICsgXCIvdjIuMS9zeXN0ZW0vdXNlcnMvbWUvdnJlc1wiLCB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogdG9rZW5cbiAgICAgICAgfVxuICAgICAgfSwgKGVyciwgcmVzcCwgYm9keSkgPT4ge1xuICAgICAgICBjb25zdCB2cmVEYXRhID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiTE9HSU5cIiwgZGF0YTogdG9rZW4sIHZyZURhdGE6IHZyZURhdGF9KTtcbiAgICAgICAgaWYgKHZyZURhdGEubWluZSkge1xuICAgICAgICAgIG5hdmlnYXRlVG8oXCJjb2xsZWN0aW9uc092ZXJ2aWV3XCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIG9uTG9hZE1vcmVDbGljazogZnVuY3Rpb24gKHVybCwgY29sbGVjdGlvbikge1xuICAgICAgZGlzcGF0Y2goKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZSgpO1xuICAgICAgICB2YXIgcGF5bG9hZCA9IHtcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogc3RhdGUudXNlcmRhdGEudXNlcklkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIuZ2V0KHVybCwgcGF5bG9hZCwgZnVuY3Rpb24gKGVyciwgcmVzcCwgYm9keSkge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIkNPTExFQ1RJT05fSVRFTVNfTE9BRElOR19FUlJPUlwiLCBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLCBlcnJvcjogZXJyIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIkNPTExFQ1RJT05fSVRFTVNfTE9BRElOR19TVUNDRUVERURcIiwgY29sbGVjdGlvbjogY29sbGVjdGlvbiwgZGF0YTogSlNPTi5wYXJzZShib2R5KX0pO1xuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIkNPTExFQ1RJT05fSVRFTVNfTE9BRElOR19FUlJPUlwiLCBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLCBlcnJvcjogZSB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBkaXNwYXRjaCh7dHlwZTogXCJDT0xMRUNUSU9OX0lURU1TX0xPQURJTkdfRklOSVNIRURcIiwgY29sbGVjdGlvbjogY29sbGVjdGlvbn0pXG4gICAgICAgIH0pO1xuICAgICAgfSlcblxuICAgIH0sXG4gICAgb25VcGxvYWRGaWxlU2VsZWN0OiBmdW5jdGlvbiAoZmlsZXMsIGlzUmV1cGxvYWQgPSBmYWxzZSkge1xuICAgICAgbGV0IGZpbGUgPSBmaWxlc1swXTtcbiAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZmlsZVwiLCBmaWxlKTtcbiAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIlNUQVJUX1VQTE9BRFwifSlcbiAgICAgIGRpc3BhdGNoKGZ1bmN0aW9uIChkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoKTtcbiAgICAgICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6IHN0YXRlLnVzZXJkYXRhLnVzZXJJZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLnBvc3QocHJvY2Vzcy5lbnYuc2VydmVyICsgXCIvdjIuMS9idWxrLXVwbG9hZFwiLCBwYXlsb2FkLCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgbGV0IGxvY2F0aW9uID0gcmVzcC5oZWFkZXJzLmxvY2F0aW9uO1xuICAgICAgICAgIHhoci5nZXQobG9jYXRpb24sIHtoZWFkZXJzOiB7XCJBdXRob3JpemF0aW9uXCI6IHN0YXRlLnVzZXJkYXRhLnVzZXJJZH19LCBmdW5jdGlvbiAoZXJyLCByZXNwLCBib2R5KSB7XG4gICAgICAgICAgICBkaXNwYXRjaCh7dHlwZTogXCJGSU5JU0hfVVBMT0FEXCIsIGRhdGE6IEpTT04ucGFyc2UoYm9keSksIHVwbG9hZGVkRmlsZU5hbWU6IGZpbGUubmFtZX0pO1xuICAgICAgICAgICAgaWYgKGlzUmV1cGxvYWQpIHtcbiAgICAgICAgICAgICAgYWN0aW9ucy5vblNlbGVjdENvbGxlY3Rpb24oc3RhdGUuaW1wb3J0RGF0YS5hY3RpdmVDb2xsZWN0aW9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5hdmlnYXRlVG8oXCJtYXBBcmNoZXR5cGVzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgb25Db250aW51ZU1hcHBpbmc6IGZ1bmN0aW9uICh2cmVJZCkge1xuICAgICAgZGlzcGF0Y2goZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKCk7XG4gICAgICAgIHhoci5nZXQoc3RhdGUudXNlcmRhdGEubXlWcmVzW3ZyZUlkXS5ybWxVcmksIHtoZWFkZXJzOiB7XCJBdXRob3JpemF0aW9uXCI6IHN0YXRlLnVzZXJkYXRhLnVzZXJJZH19LCBmdW5jdGlvbiAoZXJyLCByZXNwLCBib2R5KSB7XG4gICAgICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiRklOSVNIX1VQTE9BRFwiLCBkYXRhOiBKU09OLnBhcnNlKGJvZHkpfSk7XG4gICAgICAgICAgbmF2aWdhdGVUbyhcIm1hcEFyY2hldHlwZXNcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcbi8qXHRcdG9uU2F2ZU1hcHBpbmdzOiBmdW5jdGlvbiAoKSB7XG4gICAgICBkaXNwYXRjaCh7dHlwZTogXCJTQVZFX1NUQVJURURcIn0pXG4gICAgICBkaXNwYXRjaChmdW5jdGlvbiAoZGlzcGF0Y2gsIGdldFN0YXRlKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKCk7XG4gICAgICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgICAgIGpzb246IG1hcHBpbmdUb0pzb25MZFJtbChzdGF0ZS5tYXBwaW5ncywgc3RhdGUuaW1wb3J0RGF0YS52cmUpLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBzdGF0ZS51c2VyZGF0YS51c2VySWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgeGhyLnBvc3Qoc3RhdGUuaW1wb3J0RGF0YS5zYXZlTWFwcGluZ1VybCwgcGF5bG9hZCwgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIlNBVkVfSEFEX0VSUk9SXCJ9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXNwYXRjaCh7dHlwZTogXCJTQVZFX1NVQ0NFRURFRFwifSlcbiAgICAgICAgICB9XG4gICAgICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiU0FWRV9GSU5JU0hFRFwifSlcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LCovXG5cbiAgICBvblB1Ymxpc2hEYXRhOiBmdW5jdGlvbiAoKXtcbiAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIlNBVkVfU1RBUlRFRFwifSk7XG4gICAgICBkaXNwYXRjaCh7dHlwZTogXCJTQVZFX0ZJTklTSEVEXCJ9KTtcbiAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIlBVQkxJU0hfU1RBUlRFRFwifSk7XG4gICAgICBkaXNwYXRjaChmdW5jdGlvbiAoZGlzcGF0Y2gsIGdldFN0YXRlKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKCk7XG4gICAgICAgIHZhciBqc29uTGQgPSBtYXBwaW5nVG9Kc29uTGRSbWwoc3RhdGUubWFwcGluZ3MsIHN0YXRlLmltcG9ydERhdGEudnJlKTtcbiAgICAgICAgY29uc29sZS5sb2coanNvbkxkKTtcbiAgICAgICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoanNvbkxkKSxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogc3RhdGUudXNlcmRhdGEudXNlcklkLFxuICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9sZCtqc29uXCJcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgeGhyLnBvc3Qoc3RhdGUuaW1wb3J0RGF0YS5leGVjdXRlTWFwcGluZ1VybCwgcGF5bG9hZCwgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIlBVQkxJU0hfSEFEX0VSUk9SXCJ9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoSlNPTi5wYXJzZShyZXNwLmJvZHkpLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiUFVCTElTSF9TVUNDRUVERURcIn0pO1xuICAgICAgICAgICAgICBhY3Rpb25zLm9uVG9rZW4oc3RhdGUudXNlcmRhdGEudXNlcklkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIlBVQkxJU0hfSEFEX0VSUk9SXCJ9KTtcbiAgICAgICAgICAgICAgYWN0aW9ucy5vblNlbGVjdENvbGxlY3Rpb24oc3RhdGUuaW1wb3J0RGF0YS5hY3RpdmVDb2xsZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiUFVCTElTSF9GSU5JU0hFRFwifSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9uU2VsZWN0Q29sbGVjdGlvbjogKGNvbGxlY3Rpb24pID0+IHtcbiAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIlNFVF9BQ1RJVkVfQ09MTEVDVElPTlwiLCBjb2xsZWN0aW9uOiBjb2xsZWN0aW9ufSk7XG4gICAgICBkaXNwYXRjaChmdW5jdGlvbiAoZGlzcGF0Y2gsIGdldFN0YXRlKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKCk7XG4gICAgICAgIHZhciBjdXJyZW50U2hlZXQgPSBzdGF0ZS5pbXBvcnREYXRhLnNoZWV0cy5maW5kKHggPT4geC5jb2xsZWN0aW9uID09PSBjb2xsZWN0aW9uKTtcbiAgICAgICAgaWYgKGN1cnJlbnRTaGVldC5yb3dzLmxlbmd0aCA9PT0gMCAmJiBjdXJyZW50U2hlZXQubmV4dFVybCAmJiAhY3VycmVudFNoZWV0LmlzTG9hZGluZykge1xuICAgICAgICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogc3RhdGUudXNlcmRhdGEudXNlcklkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBkaXNwYXRjaCh7dHlwZTogXCJDT0xMRUNUSU9OX0lURU1TX0xPQURJTkdcIiB9KVxuICAgICAgICAgIHhoci5nZXQoY3VycmVudFNoZWV0Lm5leHRVcmwsIHBheWxvYWQsIGZ1bmN0aW9uIChlcnIsIHJlc3AsIGJvZHkpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiQ09MTEVDVElPTl9JVEVNU19MT0FESU5HX0VSUk9SXCIsIGNvbGxlY3Rpb246IGNvbGxlY3Rpb24sIGVycm9yOiBlcnIgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiQ09MTEVDVElPTl9JVEVNU19MT0FESU5HX1NVQ0NFRURFRFwiLCBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLCBkYXRhOiBKU09OLnBhcnNlKGJvZHkpfSk7XG4gICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIkNPTExFQ1RJT05fSVRFTVNfTE9BRElOR19FUlJPUlwiLCBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLCBlcnJvcjogZSB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXNwYXRjaCh7dHlwZTogXCJDT0xMRUNUSU9OX0lURU1TX0xPQURJTkdfRklOSVNIRURcIiwgY29sbGVjdGlvbjogY29sbGVjdGlvbn0pXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvbk1hcENvbGxlY3Rpb25BcmNoZXR5cGU6IChjb2xsZWN0aW9uLCB2YWx1ZSkgPT5cbiAgICAgIGRpc3BhdGNoKHt0eXBlOiBcIk1BUF9DT0xMRUNUSU9OX0FSQ0hFVFlQRVwiLCBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLCB2YWx1ZTogdmFsdWV9KSxcblxuICAgIG9uQ29uZmlybUNvbGxlY3Rpb25BcmNoZXR5cGVNYXBwaW5nczogKCkgPT4ge1xuICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiQ09ORklSTV9DT0xMRUNUSU9OX0FSQ0hFVFlQRV9NQVBQSU5HU1wifSlcbiAgICAgIGRpc3BhdGNoKGZ1bmN0aW9uIChkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcbiAgICAgICAgbGV0IHN0YXRlID0gZ2V0U3RhdGUoKTtcbiAgICAgICAgYWN0aW9ucy5vblNlbGVjdENvbGxlY3Rpb24oc3RhdGUuaW1wb3J0RGF0YS5hY3RpdmVDb2xsZWN0aW9uKTtcbiAgICAgIH0pXG4gICAgICBuYXZpZ2F0ZVRvKFwibWFwRGF0YVwiKTtcbiAgICB9LFxuXG4gICAgb25TZXRGaWVsZE1hcHBpbmc6IChjb2xsZWN0aW9uLCBwcm9wZXJ0eUZpZWxkLCBpbXBvcnRlZEZpZWxkKSA9PlxuICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiU0VUX0ZJRUxEX01BUFBJTkdcIiwgY29sbGVjdGlvbjogY29sbGVjdGlvbiwgcHJvcGVydHlGaWVsZDogcHJvcGVydHlGaWVsZCwgaW1wb3J0ZWRGaWVsZDogaW1wb3J0ZWRGaWVsZH0pLFxuXG4gICAgb25DbGVhckZpZWxkTWFwcGluZzogKGNvbGxlY3Rpb24sIHByb3BlcnR5RmllbGQsIGNsZWFySW5kZXgpID0+XG4gICAgICBkaXNwYXRjaCh7dHlwZTogXCJDTEVBUl9GSUVMRF9NQVBQSU5HXCIsIGNvbGxlY3Rpb246IGNvbGxlY3Rpb24sIHByb3BlcnR5RmllbGQ6IHByb3BlcnR5RmllbGQsIGNsZWFySW5kZXg6IGNsZWFySW5kZXh9KSxcblxuICAgIG9uU2V0RGVmYXVsdFZhbHVlOiAoY29sbGVjdGlvbiwgcHJvcGVydHlGaWVsZCwgdmFsdWUpID0+XG4gICAgICBkaXNwYXRjaCh7dHlwZTogXCJTRVRfREVGQVVMVF9WQUxVRVwiLCBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLCBwcm9wZXJ0eUZpZWxkOiBwcm9wZXJ0eUZpZWxkLCB2YWx1ZTogdmFsdWV9KSxcblxuICAgIG9uQ29uZmlybUZpZWxkTWFwcGluZ3M6IChjb2xsZWN0aW9uLCBwcm9wZXJ0eUZpZWxkKSA9PlxuICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiQ09ORklSTV9GSUVMRF9NQVBQSU5HU1wiLCBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLCBwcm9wZXJ0eUZpZWxkOiBwcm9wZXJ0eUZpZWxkfSksXG5cbiAgICBvblVuY29uZmlybUZpZWxkTWFwcGluZ3M6IChjb2xsZWN0aW9uLCBwcm9wZXJ0eUZpZWxkKSA9PlxuICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiVU5DT05GSVJNX0ZJRUxEX01BUFBJTkdTXCIsIGNvbGxlY3Rpb246IGNvbGxlY3Rpb24sIHByb3BlcnR5RmllbGQ6IHByb3BlcnR5RmllbGR9KSxcblxuICAgIG9uU2V0VmFsdWVNYXBwaW5nOiAoY29sbGVjdGlvbiwgcHJvcGVydHlGaWVsZCwgdGltVmFsdWUsIG1hcFZhbHVlKSA9PlxuICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiU0VUX1ZBTFVFX01BUFBJTkdcIiwgY29sbGVjdGlvbjogY29sbGVjdGlvbiwgcHJvcGVydHlGaWVsZDogcHJvcGVydHlGaWVsZCwgdGltVmFsdWU6IHRpbVZhbHVlLCBtYXBWYWx1ZTogbWFwVmFsdWV9KSxcblxuICAgIG9uSWdub3JlQ29sdW1uVG9nZ2xlOiAoY29sbGVjdGlvbiwgdmFyaWFibGVOYW1lKSA9PlxuICAgICAgZGlzcGF0Y2goe3R5cGU6IFwiVE9HR0xFX0lHTk9SRURfQ09MVU1OXCIsIGNvbGxlY3Rpb246IGNvbGxlY3Rpb24sIHZhcmlhYmxlTmFtZTogdmFyaWFibGVOYW1lfSksXG5cbiAgICBvbkFkZEN1c3RvbVByb3BlcnR5OiAoY29sbGVjdGlvbiwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVR5cGUpID0+XG4gICAgICBkaXNwYXRjaCh7dHlwZTogXCJBRERfQ1VTVE9NX1BST1BFUlRZXCIsIGNvbGxlY3Rpb246IGNvbGxlY3Rpb24sIHByb3BlcnR5RmllbGQ6IHByb3BlcnR5TmFtZSwgcHJvcGVydHlUeXBlOiBwcm9wZXJ0eVR5cGV9KSxcblxuICAgIG9uUmVtb3ZlQ3VzdG9tUHJvcGVydHk6IChjb2xsZWN0aW9uLCBwcm9wZXJ0eU5hbWUpID0+XG4gICAgICBkaXNwYXRjaCh7dHlwZTogXCJSRU1PVkVfQ1VTVE9NX1BST1BFUlRZXCIsIGNvbGxlY3Rpb246IGNvbGxlY3Rpb24sIHByb3BlcnR5RmllbGQ6IHByb3BlcnR5TmFtZX0pLFxuXG4gICAgb25DbG9zZU1lc3NhZ2U6IChtZXNzYWdlSWQpID0+XG4gICAgICBkaXNwYXRjaCh7dHlwZTogXCJUT0dHTEVfTUVTU0FHRVwiLCBtZXNzYWdlSWQ6IG1lc3NhZ2VJZH0pXG4gIH07XG4gIHJldHVybiBhY3Rpb25zO1xufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFByb3BlcnR5Rm9ybSBmcm9tIFwiLi9wcm9wZXJ0eS1mb3JtL3Byb3BlcnR5LWZvcm1cIjtcbmltcG9ydCBBZGRQcm9wZXJ0eSBmcm9tIFwiLi9wcm9wZXJ0eS1mb3JtL2FkZC1wcm9wZXJ0eVwiO1xuXG5jbGFzcyBDb2xsZWN0aW9uRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbHVtbnMsXG4gICAgICBhcmNoZXR5cGVGaWVsZHMsXG4gICAgICBwcm9wZXJ0eU1hcHBpbmdzLFxuICAgICAgY3VzdG9tUHJvcGVydHlNYXBwaW5ncyxcbiAgICAgIGNvbGxlY3Rpb25OYW1lLFxuICAgICAgYXZhaWxhYmxlQXJjaGV0eXBlcyxcbiAgICAgIGF2YWlsYWJsZUNvbGxlY3Rpb25Db2x1bW5zUGVyQXJjaGV0eXBlLFxuICAgICAgdGFyZ2V0YWJsZVZyZXNcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHtcbiAgICAgIG9uUmVtb3ZlQ3VzdG9tUHJvcGVydHksXG4gICAgICBvblNldEZpZWxkTWFwcGluZyxcbiAgICAgIG9uQ29uZmlybUZpZWxkTWFwcGluZ3MsXG4gICAgICBvbkNsZWFyRmllbGRNYXBwaW5nLFxuICAgICAgb25VbmNvbmZpcm1GaWVsZE1hcHBpbmdzLFxuICAgICAgb25BZGRDdXN0b21Qcm9wZXJ0eVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgYXJjaGVUeXBlUHJvcEZpZWxkcyA9IGFyY2hldHlwZUZpZWxkcy5maWx0ZXIoKGFmKSA9PiBhZi50eXBlICE9PSBcInJlbGF0aW9uXCIpO1xuXG4gICAgY29uc3QgcHJvcGVydHlGb3JtcyA9IGFyY2hlVHlwZVByb3BGaWVsZHNcbiAgICAgIC5tYXAoKGFmLCBpKSA9PiAoXG4gICAgICAgIDxQcm9wZXJ0eUZvcm0gY29sdW1ucz17Y29sdW1uc30gY3VzdG9tPXtmYWxzZX0ga2V5PXtpfSBuYW1lPXthZi5uYW1lfSB0eXBlPXthZi50eXBlfVxuICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TWFwcGluZz17cHJvcGVydHlNYXBwaW5ncy5maW5kKChtKSA9PiBtLnByb3BlcnR5ID09PSBhZi5uYW1lKX1cbiAgICAgICAgICAgICAgICAgICAgICBvblNldEZpZWxkTWFwcGluZz17KGZpZWxkLCB2YWx1ZSkgPT4gb25TZXRGaWVsZE1hcHBpbmcoY29sbGVjdGlvbk5hbWUsIGZpZWxkLCB2YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgb25Db25maXJtRmllbGRNYXBwaW5ncz17KGZpZWxkKSA9PiBvbkNvbmZpcm1GaWVsZE1hcHBpbmdzKGNvbGxlY3Rpb25OYW1lLCBmaWVsZCl9XG4gICAgICAgICAgICAgICAgICAgICAgb25VbmNvbmZpcm1GaWVsZE1hcHBpbmdzPXsoZmllbGQpID0+IG9uVW5jb25maXJtRmllbGRNYXBwaW5ncyhjb2xsZWN0aW9uTmFtZSwgZmllbGQpfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xlYXJGaWVsZE1hcHBpbmc9eyhmaWVsZCwgdmFsdWVJZHgpID0+IG9uQ2xlYXJGaWVsZE1hcHBpbmcoY29sbGVjdGlvbk5hbWUsIGZpZWxkLCB2YWx1ZUlkeCkgfVxuICAgICAgICAvPlxuICAgICAgKSk7XG5cbiAgICBjb25zdCBjdXN0b21Qcm9wZXJ0eUZvcm1zID0gY3VzdG9tUHJvcGVydHlNYXBwaW5nc1xuICAgICAgLm1hcCgoY3VzdG9tUHJvcCwgaSkgPT4gKFxuICAgICAgICA8UHJvcGVydHlGb3JtIGNvbHVtbnM9e2NvbHVtbnN9IGN1c3RvbT17dHJ1ZX0ga2V5PXtpfSBuYW1lPXtjdXN0b21Qcm9wLm5hbWV9IHR5cGU9e2N1c3RvbVByb3AudHlwZX1cbiAgICAgICAgICAgICAgICAgICAgICBhcmNoZXR5cGVGaWVsZHM9e2FyY2hldHlwZUZpZWxkc31cbiAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVDb2xsZWN0aW9uQ29sdW1uc1BlckFyY2hldHlwZT17YXZhaWxhYmxlQ29sbGVjdGlvbkNvbHVtbnNQZXJBcmNoZXR5cGV9XG4gICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlNYXBwaW5nPXtwcm9wZXJ0eU1hcHBpbmdzLmZpbmQoKG0pID0+IG0ucHJvcGVydHkgPT09IGN1c3RvbVByb3AubmFtZSl9XG4gICAgICAgICAgICAgICAgICAgICAgb25SZW1vdmVDdXN0b21Qcm9wZXJ0eT17KGZpZWxkKSA9PiBvblJlbW92ZUN1c3RvbVByb3BlcnR5KGNvbGxlY3Rpb25OYW1lLCBmaWVsZCl9XG4gICAgICAgICAgICAgICAgICAgICAgb25TZXRGaWVsZE1hcHBpbmc9eyhmaWVsZCwgdmFsdWUpID0+IG9uU2V0RmllbGRNYXBwaW5nKGNvbGxlY3Rpb25OYW1lLCBmaWVsZCwgdmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xlYXJGaWVsZE1hcHBpbmc9eyhmaWVsZCwgdmFsdWVJZHgpID0+IG9uQ2xlYXJGaWVsZE1hcHBpbmcoY29sbGVjdGlvbk5hbWUsIGZpZWxkLCB2YWx1ZUlkeCkgfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ29uZmlybUZpZWxkTWFwcGluZ3M9eyhmaWVsZCkgPT4gb25Db25maXJtRmllbGRNYXBwaW5ncyhjb2xsZWN0aW9uTmFtZSwgZmllbGQpfVxuICAgICAgICAgICAgICAgICAgICAgIG9uVW5jb25maXJtRmllbGRNYXBwaW5ncz17KGZpZWxkKSA9PiBvblVuY29uZmlybUZpZWxkTWFwcGluZ3MoY29sbGVjdGlvbk5hbWUsIGZpZWxkKX1cbiAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRhYmxlVnJlcz17dGFyZ2V0YWJsZVZyZXN9XG4gICAgICAgIC8+XG4gICAgICApKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBiYXNpYy1tYXJnaW5cIj5cbiAgICAgICAge3Byb3BlcnR5Rm9ybXN9XG4gICAgICAgIHtjdXN0b21Qcm9wZXJ0eUZvcm1zfVxuICAgICAgICA8QWRkUHJvcGVydHlcbiAgICAgICAgICBhcmNoZXR5cGVGaWVsZHM9e2FyY2hldHlwZUZpZWxkc31cbiAgICAgICAgICBhdmFpbGFibGVBcmNoZXR5cGVzPXthdmFpbGFibGVBcmNoZXR5cGVzfVxuICAgICAgICAgIG9uQWRkQ3VzdG9tUHJvcGVydHk9eyhuYW1lLCB0eXBlKSA9PiBvbkFkZEN1c3RvbVByb3BlcnR5KGNvbGxlY3Rpb25OYW1lLCBuYW1lLCB0eXBlKX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29sbGVjdGlvbkZvcm07IiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IGN4IGZyb20gXCJjbGFzc25hbWVzXCI7XG5cbmNsYXNzIENvbGxlY3Rpb25JbmRleCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY29sbGVjdGlvblRhYnMsIG9uU2VsZWN0Q29sbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBiYXNpYy1tYXJnaW5cIj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdiBuYXYtdGFic1wiIHJvbGU9XCJ0YWJsaXN0XCI+XG4gICAgICAgICAge2NvbGxlY3Rpb25UYWJzLm1hcCgoY29sbGVjdGlvblRhYikgPT4gKFxuICAgICAgICAgICAgPGxpIGtleT17Y29sbGVjdGlvblRhYi5jb2xsZWN0aW9uTmFtZX0gY2xhc3NOYW1lPXtjeCh7YWN0aXZlOiBjb2xsZWN0aW9uVGFiLmFjdGl2ZX0pfT5cbiAgICAgICAgICAgICAgPGEgb25DbGljaz17KCkgPT4gb25TZWxlY3RDb2xsZWN0aW9uKGNvbGxlY3Rpb25UYWIuY29sbGVjdGlvbk5hbWUpfVxuICAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjogY29sbGVjdGlvblRhYi5hY3RpdmUgPyBcImRlZmF1bHRcIiA6IFwicG9pbnRlclwifX0+XG4gICAgICAgICAgICAgICAge2NvbGxlY3Rpb25UYWIuYXJjaGV0eXBlTmFtZX17XCIgXCJ9XG4gICAgICAgICAgICAgICAge2NvbGxlY3Rpb25UYWIuY29tcGxldGUgPyA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLW9rXCIgLz4gOiBudWxsfVxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImV4Y2VsLXRhYlwiPjxpbWcgc3JjPVwiaW1hZ2VzL2ljb24tZXhjZWwuc3ZnXCIgY2xhc3NOYW1lPVwiZXhjZWwtaWNvblwiIGFsdD1cIlwiLz4ge2NvbGxlY3Rpb25UYWIuY29sbGVjdGlvbk5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQ29sbGVjdGlvbkluZGV4OyIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBVcGxvYWRCdXR0b24gZnJvbSBcIi4vdXBsb2FkLWJ1dHRvblwiO1xuaW1wb3J0IERhdGFzZXRDYXJkcyBmcm9tIFwiLi9kYXRhc2V0LWNhcmRzXCJcblxuZnVuY3Rpb24gQ29sbGVjdGlvbk92ZXJ2aWV3KHByb3BzKSB7XG4gIGNvbnN0IHsgb25VcGxvYWRGaWxlU2VsZWN0LCB1c2VySWQsIGlzVXBsb2FkaW5nLCB2cmVzIH0gPSBwcm9wcztcblxuICBjb25zdCB1cGxvYWRCdXR0b24gPSAoXG4gICAgPFVwbG9hZEJ1dHRvblxuICAgICAgY2xhc3NOYW1lcz17W1wiYnRuXCIsIFwiYnRuLWxnXCIsIFwiYnRuLXByaW1hcnlcIiwgXCJwdWxsLXJpZ2h0XCJdfVxuICAgICAgZ2x5cGhpY29uPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1jbG91ZC11cGxvYWRcIlxuICAgICAgaXNVcGxvYWRpbmc9e2lzVXBsb2FkaW5nfVxuICAgICAgbGFiZWw9XCJVcGxvYWQgbmV3IGRhdGFzZXRcIlxuICAgICAgb25VcGxvYWRGaWxlU2VsZWN0PXtvblVwbG9hZEZpbGVTZWxlY3R9IC8+XG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPERhdGFzZXRDYXJkcyB1c2VySWQ9e3VzZXJJZH0gY2FwdGlvbj1cIk15IGRhdGFzZXRzXCIgdnJlcz17dnJlc30+XG4gICAgICAgICAge3VwbG9hZEJ1dHRvbn1cbiAgICAgICAgPC9EYXRhc2V0Q2FyZHM+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29sbGVjdGlvbk92ZXJ2aWV3OyIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBIZWFkZXJDZWxsIGZyb20gXCIuL3RhYmxlL2hlYWRlci1jZWxsXCI7XG5pbXBvcnQgRGF0YVJvdyBmcm9tIFwiLi90YWJsZS9kYXRhLXJvd1wiO1xuXG5jbGFzcyBDb2xsZWN0aW9uVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBvbklnbm9yZUNvbHVtblRvZ2dsZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IHJvd3MsIGhlYWRlcnMsIG5leHRVcmwgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YWJsZS1yZXNwb25zaXZlXCI+XG4gICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZSB0YWJsZS1ib3JkZXJlZCB0YWJsZS1vYnRydXNpdmVcIj5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgIHtoZWFkZXJzLm1hcCgoaGVhZGVyKSA9PiAoXG4gICAgICAgICAgICAgICAgPEhlYWRlckNlbGwga2V5PXtoZWFkZXIubmFtZX0gaGVhZGVyPXtoZWFkZXIubmFtZX0gb25JZ25vcmVDb2x1bW5Ub2dnbGU9e29uSWdub3JlQ29sdW1uVG9nZ2xlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzSWdub3JlZD17aGVhZGVyLmlzSWdub3JlZH0gaXNDb25maXJtZWQ9e2hlYWRlci5pc0NvbmZpcm1lZH0gLz5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAge3Jvd3MubWFwKChyb3csIGkpID0+IDxEYXRhUm93IGtleT17aX0gcm93PXtyb3d9IC8+KX1cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub25Mb2FkTW9yZUNsaWNrICYmIHRoaXMucHJvcHMub25Mb2FkTW9yZUNsaWNrKG5leHRVcmwpfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXshbmV4dFVybH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgcHVsbC1yaWdodFwiPm1vcmUuLi48L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29sbGVjdGlvblRhYmxlOyIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBDb2xsZWN0aW9uVGFibGUgZnJvbSBcIi4vY29sbGVjdGlvbi10YWJsZVwiO1xuaW1wb3J0IENvbGxlY3Rpb25Gb3JtIGZyb20gXCIuL2NvbGxlY3Rpb24tZm9ybVwiO1xuaW1wb3J0IENvbGxlY3Rpb25JbmRleCBmcm9tIFwiLi9jb2xsZWN0aW9uLWluZGV4XCI7XG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwiLi9tZXNzYWdlXCI7XG5pbXBvcnQgVXBsb2FkQnV0dG9uIGZyb20gXCIuL3VwbG9hZC1idXR0b25cIjtcblxuY2xhc3MgQ29ubmVjdERhdGEgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBhY3RpdmVDb2xsZWN0aW9uLFxuICAgICAgdXBsb2FkZWRGaWxlTmFtZSxcbiAgICAgIGNvbGxlY3Rpb25UYWJzLFxuICAgICAgcm93cyxcbiAgICAgIGhlYWRlcnMsXG4gICAgICBhcmNoZXR5cGVGaWVsZHMsXG4gICAgICBhdmFpbGFibGVBcmNoZXR5cGVzLFxuICAgICAgcHJvcGVydHlNYXBwaW5ncyxcbiAgICAgIGN1c3RvbVByb3BlcnR5TWFwcGluZ3MsXG4gICAgICBhdmFpbGFibGVDb2xsZWN0aW9uQ29sdW1uc1BlckFyY2hldHlwZSxcbiAgICAgIG5leHRVcmwsXG4gICAgICBwdWJsaXNoaW5nLFxuICAgICAgcHVibGlzaEVycm9ycyxcbiAgICAgIHNob3dDb2xsZWN0aW9uc0FyZUNvbm5lY3RlZE1lc3NhZ2UsXG4gICAgICBzaGVldHMsXG4gICAgICB0YXJnZXRhYmxlVnJlc1xuXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7XG4gICAgICBvbklnbm9yZUNvbHVtblRvZ2dsZSxcbiAgICAgIG9uU2VsZWN0Q29sbGVjdGlvbixcbiAgICAgIG9uU2V0RmllbGRNYXBwaW5nLFxuICAgICAgb25SZW1vdmVDdXN0b21Qcm9wZXJ0eSxcbiAgICAgIG9uQ29uZmlybUZpZWxkTWFwcGluZ3MsXG4gICAgICBvblVuY29uZmlybUZpZWxkTWFwcGluZ3MsXG4gICAgICBvbkFkZEN1c3RvbVByb3BlcnR5LFxuICAgICAgb25DbGVhckZpZWxkTWFwcGluZyxcbiAgICAgIG9uTG9hZE1vcmVDbGljayxcbiAgICAgIG9uUHVibGlzaERhdGEsXG4gICAgICBvblVwbG9hZEZpbGVTZWxlY3QsXG4gICAgICBvbkNsb3NlTWVzc2FnZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgYWxsTWFwcGluZ3NBcmVDb21wbGV0ZSA9IGNvbGxlY3Rpb25UYWJzLmZpbHRlcigodGFiKSA9PiB0YWIuY29tcGxldGUpLmxlbmd0aCA9PT0gY29sbGVjdGlvblRhYnMubGVuZ3RoO1xuXG4gICAgY29uc3QgcHVibGlzaEZhaWxlZE1lc3NhZ2UgPSBwdWJsaXNoRXJyb3JzID8gKFxuICAgICAgPE1lc3NhZ2UgYWxlcnRMZXZlbD1cImRhbmdlclwiIGRpc21pc3NpYmxlPXtmYWxzZX0+XG4gICAgICAgIDxVcGxvYWRCdXR0b24gY2xhc3NOYW1lcz17W1wiYnRuXCIsIFwiYnRuLWRhbmdlclwiLCBcInB1bGwtcmlnaHRcIiwgXCJidG4teHNcIl19IGxhYmVsPVwiUmUtdXBsb2FkXCJcbiAgICAgICAgICAgICAgICAgICAgICBvblVwbG9hZEZpbGVTZWxlY3Q9e29uVXBsb2FkRmlsZVNlbGVjdH0gLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1leGNsYW1hdGlvbi1zaWduXCIgLz57XCIgXCJ9XG4gICAgICAgIFB1Ymxpc2ggZmFpbGVkLiBQbGVhc2UgZml4IHRoZSBtYXBwaW5ncyBvciByZS11cGxvYWQgdGhlIGRhdGEuXG4gICAgICA8L01lc3NhZ2U+XG4gICAgKSA6IG51bGw7XG5cbiAgICBjb25zdCBjb2xsZWN0aW9uc0FyZUNvbm5lY3RlZE1lc3NhZ2UgPSBzaGVldHMgJiYgc2hvd0NvbGxlY3Rpb25zQXJlQ29ubmVjdGVkTWVzc2FnZSA/XG4gICAgICA8TWVzc2FnZSBhbGVydExldmVsPVwiaW5mb1wiIGRpc21pc3NpYmxlPXt0cnVlfSBvbkNsb3NlTWVzc2FnZT17KCkgPT4gb25DbG9zZU1lc3NhZ2UoXCJzaG93Q29sbGVjdGlvbnNBcmVDb25uZWN0ZWRNZXNzYWdlXCIpfT5cbiAgICAgICAge3NoZWV0cy5tYXAoKHNoZWV0KSA9PiA8ZW0ga2V5PXtzaGVldC5jb2xsZWN0aW9ufT57c2hlZXQuY29sbGVjdGlvbn08L2VtPilcbiAgICAgICAgICAucmVkdWNlKChhY2N1LCBlbGVtKSA9PiBhY2N1ID09PSBudWxsID8gW2VsZW1dIDogWy4uLmFjY3UsICcgYW5kICcsIGVsZW1dLCBudWxsKVxuICAgICAgICB9IGZyb20gPGVtPnt1cGxvYWRlZEZpbGVOYW1lfTwvZW0+IGFyZSBjb25uZWN0ZWQgdG8gdGhlIFRpbWJ1Y3RvbyBBcmNoZXR5cGVzLlxuICAgICAgPC9NZXNzYWdlPiA6IG51bGw7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgYmFzaWMtbWFyZ2luXCI+XG4gICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInNtYWxsLW1hcmdpblwiPlVwbG9hZCBhbmQgY29ubmVjdCB5b3VyIGRhdGFzZXQ8L2gyPlxuICAgICAgICAgIHtjb2xsZWN0aW9uc0FyZUNvbm5lY3RlZE1lc3NhZ2V9XG4gICAgICAgICAge3B1Ymxpc2hGYWlsZWRNZXNzYWdlfVxuICAgICAgICAgIDxwPkNvbm5lY3QgdGhlIGV4Y2VsIGNvbHVtbnMgdG8gdGhlIHByb3BlcnRpZXMgb2YgdGhlIEFyY2hldHlwZXM8L3A+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxDb2xsZWN0aW9uSW5kZXggY29sbGVjdGlvblRhYnM9e2NvbGxlY3Rpb25UYWJzfSBvblNlbGVjdENvbGxlY3Rpb249e29uU2VsZWN0Q29sbGVjdGlvbn0gLz5cblxuICAgICAgICA8Q29sbGVjdGlvbkZvcm0gY29sdW1ucz17aGVhZGVyc31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25OYW1lPXthY3RpdmVDb2xsZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjaGV0eXBlRmllbGRzPXthcmNoZXR5cGVGaWVsZHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVBcmNoZXR5cGVzPXthdmFpbGFibGVBcmNoZXR5cGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlQ29sbGVjdGlvbkNvbHVtbnNQZXJBcmNoZXR5cGU9e2F2YWlsYWJsZUNvbGxlY3Rpb25Db2x1bW5zUGVyQXJjaGV0eXBlfVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlNYXBwaW5ncz17cHJvcGVydHlNYXBwaW5nc31cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVByb3BlcnR5TWFwcGluZ3M9e2N1c3RvbVByb3BlcnR5TWFwcGluZ3N9XG4gICAgICAgICAgICAgICAgICAgICAgICBvblNldEZpZWxkTWFwcGluZz17b25TZXRGaWVsZE1hcHBpbmd9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsZWFyRmllbGRNYXBwaW5nPXtvbkNsZWFyRmllbGRNYXBwaW5nfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25SZW1vdmVDdXN0b21Qcm9wZXJ0eT17b25SZW1vdmVDdXN0b21Qcm9wZXJ0eX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29uZmlybUZpZWxkTWFwcGluZ3M9e29uQ29uZmlybUZpZWxkTWFwcGluZ3N9XG4gICAgICAgICAgICAgICAgICAgICAgICBvblVuY29uZmlybUZpZWxkTWFwcGluZ3M9e29uVW5jb25maXJtRmllbGRNYXBwaW5nc31cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQWRkQ3VzdG9tUHJvcGVydHk9e29uQWRkQ3VzdG9tUHJvcGVydHl9XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRhYmxlVnJlcz17dGFyZ2V0YWJsZVZyZXN9IC8+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgYmlnLW1hcmdpblwiPlxuICAgICAgICAgIDxidXR0b24gb25DbGljaz17b25QdWJsaXNoRGF0YX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi13YXJuaW5nIGJ0bi1sZyBwdWxsLXJpZ2h0XCIgdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPXshYWxsTWFwcGluZ3NBcmVDb21wbGV0ZSB8fCBwdWJsaXNoaW5nfT5cbiAgICAgICAgICAgIHtwdWJsaXNoaW5nID8gXCJQdWJsaXNoaW5nXCIgOiAgXCJQdWJsaXNoIGRhdGFzZXRcIn1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgYmlnLW1hcmdpblwiPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImZyb20tZXhjZWxcIj5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiaW1hZ2VzL2ljb24tZXhjZWwuc3ZnXCIgYWx0PVwiXCIvPntcIiBcIn1cbiAgICAgICAgICAgIDxlbT57YWN0aXZlQ29sbGVjdGlvbn08L2VtPiBmcm9tIHt1cGxvYWRlZEZpbGVOYW1lfVxuICAgICAgICAgIDwvcD5cblxuICAgICAgICAgIDxDb2xsZWN0aW9uVGFibGVcbiAgICAgICAgICAgIHJvd3M9e3Jvd3N9XG4gICAgICAgICAgICBoZWFkZXJzPXtoZWFkZXJzfVxuICAgICAgICAgICAgbmV4dFVybD17bmV4dFVybH1cbiAgICAgICAgICAgIG9uSWdub3JlQ29sdW1uVG9nZ2xlPXsoaGVhZGVyKSA9PiBvbklnbm9yZUNvbHVtblRvZ2dsZShhY3RpdmVDb2xsZWN0aW9uLCBoZWFkZXIpfVxuICAgICAgICAgICAgb25Mb2FkTW9yZUNsaWNrPXsodXJsKSA9PiBvbkxvYWRNb3JlQ2xpY2sodXJsLCBhY3RpdmVDb2xsZWN0aW9uKX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29ubmVjdERhdGE7IiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFNlbGVjdEZpZWxkIGZyb20gXCIuL2ZpZWxkcy9zZWxlY3QtZmllbGRcIjtcbmltcG9ydCBNZXNzYWdlIGZyb20gXCIuL21lc3NhZ2VcIjtcblxuY2xhc3MgQ29ubmVjdFRvQXJjaGV0eXBlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgb25NYXBDb2xsZWN0aW9uQXJjaGV0eXBlLCBvbkNvbmZpcm1Db2xsZWN0aW9uQXJjaGV0eXBlTWFwcGluZ3MsIG9uQ2xvc2VNZXNzYWdlLFxuICAgICAgc2hlZXRzLCBhcmNoZXR5cGUsIG1hcHBpbmdzLCBzaG93RmlsZUlzVXBsb2FkZWRNZXNzYWdlLCB1cGxvYWRlZEZpbGVOYW1lIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgY29sbGVjdGlvbnNBcmVNYXBwZWQgPSBPYmplY3Qua2V5cyhtYXBwaW5ncy5jb2xsZWN0aW9ucykubGVuZ3RoID4gMCAmJlxuICAgICAgT2JqZWN0LmtleXMobWFwcGluZ3MuY29sbGVjdGlvbnMpLm1hcCgoa2V5KSA9PiBtYXBwaW5ncy5jb2xsZWN0aW9uc1trZXldLmFyY2hldHlwZU5hbWUpLmluZGV4T2YobnVsbCkgPCAwO1xuXG4gICAgY29uc3QgZmlsZUlzVXBsb2FkZWRNZXNzYWdlID0gc2hvd0ZpbGVJc1VwbG9hZGVkTWVzc2FnZSA/IChcbiAgICAgIDxNZXNzYWdlIGFsZXJ0TGV2ZWw9XCJpbmZvXCIgZGlzbWlzc2libGU9e3RydWV9IG9uQ2xvc2VNZXNzYWdlPXsoKSA9PiBvbkNsb3NlTWVzc2FnZShcInNob3dGaWxlSXNVcGxvYWRlZE1lc3NhZ2VcIil9PlxuICAgICAgICA8ZW0+e3VwbG9hZGVkRmlsZU5hbWV9PC9lbT4gaXMgdXBsb2FkZWQuXG4gICAgICA8L01lc3NhZ2U+XG4gICAgKSA6IG51bGw7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgYmFzaWMtbWFyZ2luXCI+XG4gICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInNtYWxsLW1hcmdpblwiPlVwbG9hZCBhbmQgY29ubmVjdCB5b3VyIGRhdGFzZXQ8L2gyPlxuICAgICAgICAgIHtmaWxlSXNVcGxvYWRlZE1lc3NhZ2V9XG4gICAgICAgICAgPHA+V2UgZm91bmQge3NoZWV0cy5sZW5ndGh9IGNvbGxlY3Rpb25zIGluIHRoZSBmaWxlLiBDb25uZWN0IHRoZSB0YWJzIHRvIHRoZSBUaW1idWN0b28gQXJjaGV0eXBlcy48L3A+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyIGJhc2ljLW1hcmdpblwiPlxuICAgICAgICAgIHtzaGVldHMubWFwKChzaGVldCkgPT4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBrZXk9e3NoZWV0LmNvbGxlY3Rpb259PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0yXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZnJvbS1leGNlbFwiPlxuICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJpbWFnZXMvaWNvbi1leGNlbC5zdmdcIiBhbHQ9XCJcIi8+IHtzaGVldC5jb2xsZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtOFwiPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RGaWVsZFxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZSkgPT4gb25NYXBDb2xsZWN0aW9uQXJjaGV0eXBlKHNoZWV0LmNvbGxlY3Rpb24sIHZhbHVlKX1cbiAgICAgICAgICAgICAgICAgIG9uQ2xlYXI9eygpID0+IG9uTWFwQ29sbGVjdGlvbkFyY2hldHlwZShzaGVldC5jb2xsZWN0aW9uLCBudWxsKSB9XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17bWFwcGluZ3MuY29sbGVjdGlvbnNbc2hlZXQuY29sbGVjdGlvbl0uYXJjaGV0eXBlTmFtZX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHR5cGU9XCJwbGFjZWhvbGRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgIENvbm5lY3QgPGVtPntzaGVldC5jb2xsZWN0aW9ufTwvZW0+IHRvIGEgVGltYnVjdG9vIGFyY2hldHlwZS5cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICB7T2JqZWN0LmtleXMoYXJjaGV0eXBlKS5maWx0ZXIoKGRvbWFpbikgPT4gZG9tYWluICE9PSBcInJlbGF0aW9uc1wiKS5zb3J0KCkubWFwKChvcHRpb24pID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e29wdGlvbn0gdmFsdWU9e29wdGlvbn0+e29wdGlvbn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvU2VsZWN0RmllbGQ+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB7IG1hcHBpbmdzLmNvbGxlY3Rpb25zW3NoZWV0LmNvbGxlY3Rpb25dLmFyY2hldHlwZU5hbWUgPyAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0xIGhpLXN1Y2Nlc3NcIiBrZXk9e3NoZWV0LmNvbGxlY3Rpb259PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLW9rIHB1bGwtcmlnaHRcIi8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cblxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBiYXNpYy1tYXJnaW5cIj5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ29uZmlybUNvbGxlY3Rpb25BcmNoZXR5cGVNYXBwaW5nc30gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc3VjY2Vzc1wiIGRpc2FibGVkPXshY29sbGVjdGlvbnNBcmVNYXBwZWR9PlxuICAgICAgICAgICAgQ29ubmVjdFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb25uZWN0VG9BcmNoZXR5cGU7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBEYXRhU2V0Q2FyZCBmcm9tICcuL2RhdGFzZXRDYXJkLmpzeCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHByb3BzKSB7XG4gIGNvbnN0IHsgdnJlcywgY2FwdGlvbiwgdXNlcklkIH0gPSBwcm9wcztcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2ljLW1hcmdpblwiPlxuICAgICAgICB7cHJvcHMuY2hpbGRyZW59XG4gICAgICAgIDxoMz57Y2FwdGlvbn08L2gzPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJpZy1tYXJnaW5cIj5cbiAgICAgICAgeyBPYmplY3Qua2V5cyh2cmVzKS5tYXAoKHZyZSkgPT4gPERhdGFTZXRDYXJkIGtleT17dnJlfSB1c2VySWQ9e3VzZXJJZH0gdnJlSWQ9e3ZyZXNbdnJlXS5uYW1lfSBjYXB0aW9uPXt2cmVzW3ZyZV0ubmFtZS5yZXBsYWNlKC9eW2EtejAtOV0rXy8sIFwiXCIpfSAvPikgfVxuICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufTsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jb25zdCBUSU1CVUNUT09fU0VBUkNIX1VSTCA9IGdsb2JhbHMgJiYgZ2xvYmFscy5lbnYgP1xuICBnbG9iYWxzLmVudi5USU1CVUNUT09fU0VBUkNIX1VSTCA6IFwiL1wiO1xuICBcbmZ1bmN0aW9uIERhdGFTZXRDYXJkKHByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWRhdGFzZXRcIj5cbiAgICAgIDxhIGNsYXNzTmFtZT1cImNhcmQtZGF0YXNldCBidG4gYnRuLWRlZmF1bHQgZXhwbG9yZVwiXG4gICAgICAgICBocmVmPXtgJHtUSU1CVUNUT09fU0VBUkNIX1VSTH0/dnJlSWQ9JHtwcm9wcy52cmVJZH1gfSB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgICAgRXhwbG9yZTxiciAvPlxuICAgICAgICA8c3Ryb25nPlxuICAgICAgICAgICAge3Byb3BzLmNhcHRpb259XG4gICAgICAgIDwvc3Ryb25nPlxuICAgICAgPC9hPlxuICAgICAge3Byb3BzLnVzZXJJZFxuICAgICAgICA/ICg8YSBjbGFzc05hbWU9XCJjYXJkLWRhdGFzZXQgYnRuIGJ0bi1kZWZhdWx0XCJcbiAgICAgICAgICAgICAgaHJlZj17YCR7cHJvY2Vzcy5lbnYuc2VydmVyfS9zdGF0aWMvZWRpdC1ndWkvP3ZyZUlkPSR7cHJvcHMudnJlSWR9JmhzaWQ9JHtwcm9wcy51c2VySWR9YH0gdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBlbmNpbFwiIC8+e1wiIFwifVxuICAgICAgICAgICAgRWRpdFxuICAgICAgICAgIDwvYT4pXG4gICAgICAgIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YVNldENhcmQ7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xuaW1wb3J0IGN4IGZyb20gXCJjbGFzc25hbWVzXCI7XG5cbmNsYXNzIFNlbGVjdEZpZWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNPcGVuOiBmYWxzZVxuICAgIH07XG4gICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSB0aGlzLmhhbmRsZURvY3VtZW50Q2xpY2suYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciwgZmFsc2UpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyLCBmYWxzZSk7XG4gIH1cblxuICB0b2dnbGVTZWxlY3QoKSB7XG4gICAgaWYodGhpcy5zdGF0ZS5pc09wZW4pIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2lzT3BlbjogZmFsc2V9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNPcGVuOiB0cnVlfSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRG9jdW1lbnRDbGljayhldikge1xuICAgIGNvbnN0IHsgaXNPcGVuIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmIChpc09wZW4gJiYgIVJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpLmNvbnRhaW5zKGV2LnRhcmdldCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpc09wZW46IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBvbkNoYW5nZSwgb25DbGVhciwgdmFsdWUgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBzZWxlY3RlZE9wdGlvbiA9IFJlYWN0LkNoaWxkcmVuLnRvQXJyYXkodGhpcy5wcm9wcy5jaGlsZHJlbikuZmlsdGVyKChvcHQpID0+IG9wdC5wcm9wcy52YWx1ZSA9PT0gdmFsdWUpO1xuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gUmVhY3QuQ2hpbGRyZW4udG9BcnJheSh0aGlzLnByb3BzLmNoaWxkcmVuKS5maWx0ZXIoKG9wdCkgPT4gb3B0LnByb3BzLnR5cGUgPT09IFwicGxhY2Vob2xkZXJcIik7XG4gICAgY29uc3Qgb3RoZXJPcHRpb25zID0gUmVhY3QuQ2hpbGRyZW4udG9BcnJheSh0aGlzLnByb3BzLmNoaWxkcmVuKS5maWx0ZXIoKG9wdCkgPT4gb3B0LnByb3BzLnZhbHVlICYmIG9wdC5wcm9wcy52YWx1ZSAhPT0gdmFsdWUpO1xuXG4gICAgcmV0dXJuIChcblxuICAgICAgPGRpdiBjbGFzc05hbWU9e2N4KFwiZHJvcGRvd25cIiwge29wZW46IHRoaXMuc3RhdGUuaXNPcGVufSl9PlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tYmxhbmsgZHJvcGRvd24tdG9nZ2xlXCIgb25DbGljaz17dGhpcy50b2dnbGVTZWxlY3QuYmluZCh0aGlzKX0+XG4gICAgICAgICAge3NlbGVjdGVkT3B0aW9uLmxlbmd0aCA/IHNlbGVjdGVkT3B0aW9uIDogcGxhY2Vob2xkZXJ9IDxzcGFuIGNsYXNzTmFtZT1cImNhcmV0XCIgLz5cbiAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICB7IHZhbHVlID8gKFxuICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICA8YSBvbkNsaWNrPXsoKSA9PiB7IG9uQ2xlYXIoKTsgdGhpcy50b2dnbGVTZWxlY3QoKTt9fT5cbiAgICAgICAgICAgICAgICAtIGNsZWFyIC1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7b3RoZXJPcHRpb25zLm1hcCgob3B0aW9uLCBpKSA9PiAoXG4gICAgICAgICAgICA8bGkga2V5PXtpfT5cbiAgICAgICAgICAgICAgPGEgc3R5bGU9e3tjdXJzb3I6IFwicG9pbnRlclwifX0gb25DbGljaz17KCkgPT4geyBvbkNoYW5nZShvcHRpb24ucHJvcHMudmFsdWUpOyB0aGlzLnRvZ2dsZVNlbGVjdCgpOyB9fT57b3B0aW9ufTwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblNlbGVjdEZpZWxkLnByb3BUeXBlcyA9IHtcbiAgb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICBvbkNsZWFyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdEZpZWxkO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFVwbG9hZEJ1dHRvbiBmcm9tIFwiLi91cGxvYWQtYnV0dG9uXCI7XG5cbi8vIChyZW5hbWVzIGZyb20gVXBsb2FkU3BsYXNoU2NyZWVuKVxuZnVuY3Rpb24gRmlyc3RVcGxvYWQocHJvcHMpIHtcbiAgY29uc3QgeyBvblVwbG9hZEZpbGVTZWxlY3QsIHVzZXJJZCwgaXNVcGxvYWRpbmcgfSA9IHByb3BzO1xuXG4gIGNvbnN0IHNhbXBsZVNoZWV0ID0gcHJvcHMuZXhhbXBsZVNoZWV0VXJsID9cbiAgICA8cD5Eb24ndCBoYXZlIGEgZGF0YXNldCBoYW5keT8gSGVyZeKAmXMgYW4gPGEgaHJlZj17cHJvcHMuZXhhbXBsZVNoZWV0VXJsfT5leGFtcGxlIGV4Y2VsIHNoZWV0PC9hPi48L3A+IDogbnVsbDtcblxuICBjb25zdCB1cGxvYWRCdXR0b24gPSAoXG4gICAgPFVwbG9hZEJ1dHRvblxuICAgICAgY2xhc3NOYW1lcz17W1wiYnRuXCIsIFwiYnRuLWxnXCIsIFwiYnRuLXByaW1hcnlcIl19XG4gICAgICBnbHlwaGljb249XCJnbHlwaGljb24gZ2x5cGhpY29uLWNsb3VkLXVwbG9hZFwiXG4gICAgICBpc1VwbG9hZGluZz17aXNVcGxvYWRpbmd9XG4gICAgICBsYWJlbD1cIkJyb3dzZVwiXG4gICAgICBvblVwbG9hZEZpbGVTZWxlY3Q9e29uVXBsb2FkRmlsZVNlbGVjdH0gLz5cbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImp1bWJvdHJvbiBmaXJzdC11cGxvYWQgdXBsb2FkLWJnXCI+XG4gICAgICAgIDxoMj5VcGxvYWQgeW91ciBmaXJzdCBkYXRhc2V0PC9oMj5cbiAgICAgICAgICAge3NhbXBsZVNoZWV0fVxuICAgICAgICAgICB7dXNlcklkID8gdXBsb2FkQnV0dG9uIDogKFxuICAgICAgICAgICA8Zm9ybSBhY3Rpb249XCJodHRwczovL3NlY3VyZS5odXlnZW5zLmtuYXcubmwvc2FtbDIvbG9naW5cIiBtZXRob2Q9XCJQT1NUXCI+XG4gICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJoc3VybFwiICB0eXBlPVwiaGlkZGVuXCIgdmFsdWU9e3dpbmRvdy5sb2NhdGlvbi5ocmVmfSAvPlxuICAgICAgICAgICAgIDxwPk1vc3QgdW5pdmVyc2l0eSBhY2NvdW50cyB3aWxsIHdvcmsuPC9wPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tbGdcIiB0eXBlPVwic3VibWl0XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1sb2ctaW5cIiAvPiBMb2cgaW4gdG8gdXBsb2FkXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICA8L2Zvcm0+KSB9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRmlyc3RVcGxvYWQ7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmZ1bmN0aW9uIEZvb3Rlcihwcm9wcykge1xuICBjb25zdCBoaUxvZ28gPSAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMSBjb2wtbWQtMVwiPlxuICAgICAgPGltZyBjbGFzc05hbWU9XCJoaS1sb2dvXCIgc3JjPVwiaW1hZ2VzL2xvZ28taHV5Z2Vucy1pbmcuc3ZnXCIgLz5cbiAgICA8L2Rpdj5cbiAgKTtcblxuICBjb25zdCBjbGFyaWFoTG9nbyA9IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0xIGNvbC1tZC0xXCI+XG4gICAgICA8aW1nIGNsYXNzTmFtZT1cImxvZ29cIiBzcmM9XCJpbWFnZXMvbG9nby1jbGFyaWFoLnN2Z1wiIC8+XG4gICAgPC9kaXY+XG4gICk7XG5cbiAgY29uc3QgZm9vdGVyQm9keSA9IFJlYWN0LkNoaWxkcmVuLmNvdW50KHByb3BzLmNoaWxkcmVuKSA+IDAgP1xuICAgIFJlYWN0LkNoaWxkcmVuLm1hcChwcm9wcy5jaGlsZHJlbiwgKGNoaWxkLCBpKSA9PiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndoaXRlLWJhclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIHtpID09PSBSZWFjdC5DaGlsZHJlbi5jb3VudChwcm9wcy5jaGlsZHJlbikgLSAxXG4gICAgICAgICAgICA/ICg8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPntoaUxvZ299PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMTAgY29sLW1kLTEwIHRleHQtY2VudGVyXCI+e2NoaWxkfTwvZGl2PntjbGFyaWFoTG9nb308L2Rpdj4pXG4gICAgICAgICAgICA6ICg8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPjxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTEyIGNvbC1tZC0xMiB0ZXh0LWNlbnRlclwiPntjaGlsZH08L2Rpdj48L2Rpdj4pXG4gICAgICAgICAgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICkpIDogKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aGl0ZS1iYXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAge2hpTG9nb31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTEwIGNvbC1tZC0xMCB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7Y2xhcmlhaExvZ299XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuXG4gIHJldHVybiAoXG4gICAgPGZvb3RlciBjbGFzc05hbWU9XCJmb290ZXJcIj5cbiAgICAgIHtmb290ZXJCb2R5fVxuICAgIDwvZm9vdGVyPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvb3RlcjsiLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgY3ggZnJvbSBcImNsYXNzbmFtZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocHJvcHMpIHtcbiAgY29uc3QgeyBkaXNtaXNzaWJsZSwgYWxlcnRMZXZlbCwgb25DbG9zZU1lc3NhZ2V9ID0gcHJvcHM7XG4gIGNvbnN0IGRpc21pc3NCdXR0b24gPSBkaXNtaXNzaWJsZVxuICAgID8gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlTWVzc2FnZX0+PHNwYW4+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj5cbiAgICA6IG51bGw7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y3goXCJhbGVydFwiLCBgYWxlcnQtJHthbGVydExldmVsfWAsIHtcImFsZXJ0LWRpc21pc3NpYmxlXCI6IGRpc21pc3NpYmxlfSl9IHJvbGU9XCJhbGVydFwiPlxuICAgICAge2Rpc21pc3NCdXR0b259XG4gICAgICB7cHJvcHMuY2hpbGRyZW59XG4gICAgPC9kaXY+XG4gIClcbn07IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBEYXRhc2V0Q2FyZHMgZnJvbSBcIi4vZGF0YXNldC1jYXJkc1wiO1xuaW1wb3J0IEZvb3RlciBmcm9tIFwiLi9mb290ZXJcIjtcblxuY29uc3QgRk9PVEVSX0hFSUdIVCA9IDgxO1xuXG5mdW5jdGlvbiBQYWdlKHByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJwYWdlXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2ljLW1hcmdpbiBoaS1HcmVlbiBjb250YWluZXItZmx1aWRcIj5cbiAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJuYXZiYXIgXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWhlYWRlclwiPiA8YSBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiI1wiPjxpbWcgc3JjPVwiaW1hZ2VzL2xvZ28tdGltYnVjdG9vLnN2Z1wiIGNsYXNzTmFtZT1cImxvZ29cIiBhbHQ9XCJ0aW1idWN0b29cIi8+PC9hPiA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJuYXZiYXJcIiBjbGFzc05hbWU9XCJuYXZiYXItY29sbGFwc2UgY29sbGFwc2VcIj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodFwiPlxuICAgICAgICAgICAgICAgIHtwcm9wcy51c2VybmFtZSA/IDxsaT48YSBocmVmPXtwcm9wcy51c2VybG9jYXRpb24gfHwgJyMnfT48c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXVzZXJcIi8+IHtwcm9wcy51c2VybmFtZX08L2E+PC9saT4gOiBudWxsfVxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvbmF2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2ICBzdHlsZT17e21hcmdpbkJvdHRvbTogYCR7Rk9PVEVSX0hFSUdIVH1weGB9fT5cbiAgICAgICAge3Byb3BzLmNoaWxkcmVufVxuICAgICAgICB7cHJvcHMudnJlcyAmJiBwcm9wcy5zaG93RGF0YXNldHMgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxEYXRhc2V0Q2FyZHMgY2FwdGlvbj1cIkV4cGxvcmUgYWxsIGRhdGFzZXRzXCIgdnJlcz17cHJvcHMudnJlc30gLz5cbiAgICAgICAgICA8L2Rpdj4pIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgICAgPEZvb3RlciAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQYWdlO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFNlbGVjdEZpZWxkIGZyb20gXCIuLi9maWVsZHMvc2VsZWN0LWZpZWxkXCI7XG5cbmNsYXNzIEFkZFByb3BlcnR5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBuZXdOYW1lOiBcIlwiLFxuICAgICAgbmV3VHlwZTogbnVsbFxuICAgIH07XG4gIH1cblxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IG5ld05hbWUsIG5ld1R5cGUgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgeyBvbkFkZEN1c3RvbVByb3BlcnR5LCBhcmNoZXR5cGVGaWVsZHMsIGF2YWlsYWJsZUFyY2hldHlwZXMgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCByZWxhdGlvblR5cGVPcHRpb25zID0gYXJjaGV0eXBlRmllbGRzXG4gICAgICAuZmlsdGVyKChwcm9wKSA9PiBwcm9wLnR5cGUgPT09IFwicmVsYXRpb25cIilcbiAgICAgIC5maWx0ZXIoKHByb3ApID0+IGF2YWlsYWJsZUFyY2hldHlwZXMuaW5kZXhPZihwcm9wLnJlbGF0aW9uLnRhcmdldENvbGxlY3Rpb24pID4gLTEpXG4gICAgICAubWFwKChwcm9wKSA9PiA8c3BhbiBrZXk9e3Byb3AubmFtZX0gdmFsdWU9e3Byb3AubmFtZX0+e3Byb3AubmFtZX08L3NwYW4+KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBzbWFsbC1tYXJnaW5cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMlwiPlxuICAgICAgICAgIHtuZXdUeXBlID09PSBcInJlbGF0aW9uXCIgfHwgbmV3VHlwZSA9PT0gXCJyZWxhdGlvbi10by1leGlzdGluZ1wiXG4gICAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgPFNlbGVjdEZpZWxkXG4gICAgICAgICAgICAgICAgdmFsdWU9e25ld05hbWV9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZSkgPT4gdGhpcy5zZXRTdGF0ZSh7bmV3TmFtZTogdmFsdWV9KX1cbiAgICAgICAgICAgICAgICBvbkNsZWFyPXsoKSA9PiB0aGlzLnNldFN0YXRlKHtuZXdOYW1lOiBcIlwifSl9PlxuICAgICAgICAgICAgICAgIDxzcGFuIHR5cGU9XCJwbGFjZWhvbGRlclwiPkNob29zZSBhIHJlbGF0aW9uIHR5cGUuLi48L3NwYW4+XG4gICAgICAgICAgICAgICAge3JlbGF0aW9uVHlwZU9wdGlvbnN9XG4gICAgICAgICAgICAgIDwvU2VsZWN0RmllbGQ+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2KSA9PiB0aGlzLnNldFN0YXRlKHtuZXdOYW1lOiBldi50YXJnZXQudmFsdWV9KX1cbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlByb3BlcnR5IG5hbWVcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtuZXdOYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtuZXdUeXBlICE9PSBcInRleHRcIn0vPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLThcIiA+XG4gICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8U2VsZWN0RmllbGRcbiAgICAgICAgICAgICAgdmFsdWU9e25ld1R5cGV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUpID0+IHRoaXMuc2V0U3RhdGUoe25ld1R5cGU6IHZhbHVlLCBuZXdOYW1lOiB2YWx1ZSA9PT0gXCJyZWxhdGlvblwiID8gbnVsbCA6IG5ld05hbWV9KX1cbiAgICAgICAgICAgICAgb25DbGVhcj17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7bmV3VHlwZTogbnVsbH0pfT5cbiAgICAgICAgICAgICAgPHNwYW4gdHlwZT1cInBsYWNlaG9sZGVyXCI+Q2hvb3NlIGEgdHlwZS4uLjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gdmFsdWU9XCJ0ZXh0XCI+VGV4dDwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gdmFsdWU9XCJyZWxhdGlvblwiPlJlbGF0aW9uPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiB2YWx1ZT1cInJlbGF0aW9uLXRvLWV4aXN0aW5nXCI+UmVsYXRpb24gdG8gZXhpc3RpbmcgVGltYnVjdG9vIGNvbGxlY3Rpb248L3NwYW4+XG4gICAgICAgICAgICA8L1NlbGVjdEZpZWxkPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMlwiPlxuXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0IGJ0biBidG4tZGVmYXVsdFwiIGRpc2FibGVkPXshKG5ld05hbWUgJiYgbmV3VHlwZSl9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe25ld05hbWU6IG51bGwsIG5ld1R5cGU6IG51bGx9KTtcbiAgICAgICAgICAgICAgICAgICAgb25BZGRDdXN0b21Qcm9wZXJ0eShuZXdOYW1lLCBuZXdUeXBlKTtcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgQWRkIHByb3BlcnR5XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbkFkZFByb3BlcnR5LnByb3BUeXBlcyA9IHtcbiAgaW1wb3J0RGF0YTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgbWFwcGluZ3M6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIG9uQWRkQ3VzdG9tUHJvcGVydHk6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBZGRQcm9wZXJ0eTtcbiIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBTZWxlY3RGaWVsZCBmcm9tIFwiLi4vZmllbGRzL3NlbGVjdC1maWVsZFwiO1xuXG5cbmNsYXNzIENvbHVtblNlbGVjdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjb2x1bW5zLCBwcm9wZXJ0eU1hcHBpbmcsIG9uQ29sdW1uU2VsZWN0LCBvbkNsZWFyQ29sdW1uLCBwbGFjZWhvbGRlciB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHNlbGVjdGVkQ29sdW1uID0gcHJvcGVydHlNYXBwaW5nICYmIHByb3BlcnR5TWFwcGluZy52YXJpYWJsZVswXSA/IHByb3BlcnR5TWFwcGluZy52YXJpYWJsZVswXS52YXJpYWJsZU5hbWUgOiBudWxsO1xuXG4gICAgcmV0dXJuIHByb3BlcnR5TWFwcGluZyAmJiBwcm9wZXJ0eU1hcHBpbmcuY29uZmlybWVkID8gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcm9tLWV4Y2VsIHBhZC02LTEyXCIgPjxpbWcgc3JjPVwiaW1hZ2VzL2ljb24tZXhjZWwuc3ZnXCIgYWx0PVwiXCIvPiB7c2VsZWN0ZWRDb2x1bW59PC9kaXY+XG4gICAgKSA6IChcbiAgICAgIDxTZWxlY3RGaWVsZCB2YWx1ZT17c2VsZWN0ZWRDb2x1bW59XG4gICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhjb2x1bW4pID0+IG9uQ29sdW1uU2VsZWN0KFt7dmFyaWFibGVOYW1lOiBjb2x1bW59XSl9XG4gICAgICAgICAgICAgICAgICAgb25DbGVhcj17KCkgPT4gb25DbGVhckNvbHVtbigwKX0+XG4gICAgICAgIDxzcGFuIHR5cGU9XCJwbGFjZWhvbGRlclwiIGNsYXNzTmFtZT1cImZyb20tZXhjZWxcIj48aW1nIHNyYz1cImltYWdlcy9pY29uLWV4Y2VsLnN2Z1wiIGFsdD1cIlwiLz4ge3BsYWNlaG9sZGVyIHx8IFwiU2VsZWN0IGFuIGV4Y2VsIGNvbHVtblwifTwvc3Bhbj5cbiAgICAgICAge2NvbHVtbnMuZmlsdGVyKChjb2wpID0+IGNvbC5uYW1lID09PSBzZWxlY3RlZENvbHVtbiB8fCAoIWNvbC5pc0NvbmZpcm1lZCAmJiAhY29sLmlzSWdub3JlZCkgKS5tYXAoKGNvbCkgPT4gKFxuICAgICAgICAgIDxzcGFuIGtleT17Y29sLm5hbWV9IHZhbHVlPXtjb2wubmFtZX0gY2xhc3NOYW1lPVwiZnJvbS1leGNlbFwiPjxpbWcgc3JjPVwiaW1hZ2VzL2ljb24tZXhjZWwuc3ZnXCIgYWx0PVwiXCIvPiB7Y29sLm5hbWV9PC9zcGFuPlxuICAgICAgICApKX1cbiAgICAgIDwvU2VsZWN0RmllbGQ+XG4gICAgKTtcbiAgfVxufVxuXG5Db2x1bW5TZWxlY3QucHJvcFR5cGVzID0ge1xuICBjb2xsZWN0aW9uRGF0YTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgbWFwcGluZ3M6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIG9uQ2xlYXJGaWVsZE1hcHBpbmc6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICBvblNldEZpZWxkTWFwcGluZzogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvbHVtblNlbGVjdDtcbiIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IFRleHQgZnJvbSBcIi4vdGV4dFwiO1xuaW1wb3J0IFJlbGF0aW9uIGZyb20gXCIuL3JlbGF0aW9uXCI7XG5pbXBvcnQgUmVsYXRpb25Ub0V4aXN0aW5nIGZyb20gXCIuL3JlbGF0aW9uLXRvLWV4aXN0aW5nXCI7XG5cbmNvbnN0IHR5cGVNYXAgPSB7XG4gIHRleHQ6IChwcm9wcykgPT4gPFRleHQgey4uLnByb3BzfSAvPixcbiAgZGF0YWJsZTogKHByb3BzKSA9PiA8VGV4dCB7Li4ucHJvcHN9IC8+LFxuICByZWxhdGlvbjogKHByb3BzKSA9PiA8UmVsYXRpb24gey4uLnByb3BzfSAvPixcbiAgXCJyZWxhdGlvbi10by1leGlzdGluZ1wiOiAocHJvcHMpID0+IDxSZWxhdGlvblRvRXhpc3Rpbmcgey4uLnByb3BzfSAvPlxufTtcblxuY2xhc3MgUHJvcGVydHlGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBjYW5Db25maXJtKHZhcmlhYmxlKSB7XG4gICAgY29uc3QgeyB0eXBlIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmICghdmFyaWFibGUgfHwgdmFyaWFibGUubGVuZ3RoID09PSAwKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmICh0eXBlID09PSBcInJlbGF0aW9uXCIpIHtcbiAgICAgIHJldHVybiB2YXJpYWJsZVswXS52YXJpYWJsZU5hbWUgJiYgdmFyaWFibGVbMF0udGFyZ2V0Q29sbGVjdGlvbiAmJiB2YXJpYWJsZVswXS50YXJnZXRWYXJpYWJsZU5hbWU7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInJlbGF0aW9uLXRvLWV4aXN0aW5nXCIpIHtcbiAgICAgIHJldHVybiB2YXJpYWJsZVswXS52YXJpYWJsZU5hbWUgJiYgdmFyaWFibGVbMF0udGFyZ2V0RXhpc3RpbmdUaW1idWN0b29WcmU7XG4gICAgfVxuICAgIHJldHVybiB2YXJpYWJsZS5maWx0ZXIoKG0pID0+IG0udmFyaWFibGVOYW1lKS5sZW5ndGggPT09IHZhcmlhYmxlLmxlbmd0aDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IG5hbWUsIHR5cGUsIGN1c3RvbSwgcHJvcGVydHlNYXBwaW5nIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgb25SZW1vdmVDdXN0b21Qcm9wZXJ0eSwgb25Db25maXJtRmllbGRNYXBwaW5ncyxcbiAgICAgIG9uVW5jb25maXJtRmllbGRNYXBwaW5ncywgb25TZXRGaWVsZE1hcHBpbmcsIG9uQ2xlYXJGaWVsZE1hcHBpbmcgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBjb25maXJtZWQgPSBwcm9wZXJ0eU1hcHBpbmcgJiYgcHJvcGVydHlNYXBwaW5nLmNvbmZpcm1lZDtcblxuICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBwcm9wZXJ0eU1hcHBpbmcgJiYgdGhpcy5jYW5Db25maXJtKHByb3BlcnR5TWFwcGluZy52YXJpYWJsZSkgJiYgIWNvbmZpcm1lZCA/XG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tc3VjY2Vzc1wiIG9uQ2xpY2s9eygpID0+IG9uQ29uZmlybUZpZWxkTWFwcGluZ3MobmFtZSl9PkNvbmZpcm08L2J1dHRvbj4gOiBjb25maXJtZWQgP1xuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWJsYW5rXCIgb25DbGljaz17KCkgPT4gb25VbmNvbmZpcm1GaWVsZE1hcHBpbmdzKG5hbWUpfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGktc3VjY2VzcyBnbHlwaGljb24gZ2x5cGhpY29uLW9rXCIgLz48L2J1dHRvbj4gOiBudWxsO1xuXG4gICAgY29uc3QgZm9ybUNvbXBvbmVudCA9IHR5cGVNYXBbdHlwZV0oe1xuICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgIG9uQ29sdW1uU2VsZWN0OiAodmFsdWUpID0+IG9uU2V0RmllbGRNYXBwaW5nKG5hbWUsIHZhbHVlKSxcbiAgICAgIG9uQ2xlYXJDb2x1bW46ICh2YWx1ZUlkeCkgPT4gb25DbGVhckZpZWxkTWFwcGluZyhuYW1lLCB2YWx1ZUlkeClcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBzbWFsbC1tYXJnaW5cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMiBwYWQtNi0xMlwiPjxzdHJvbmc+e25hbWV9PC9zdHJvbmc+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTIgcGFkLTYtMTJcIiA+PHNwYW4gY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPih7dHlwZX0pPC9zcGFuPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS01XCI+XG4gICAgICAgICAge2Zvcm1Db21wb25lbnR9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0xXCI+XG4gICAgICAgICAgeyBjdXN0b21cbiAgICAgICAgICAgID8gKDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibGFuayBwdWxsLXJpZ2h0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IG9uUmVtb3ZlQ3VzdG9tUHJvcGVydHkobmFtZSl9PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIi8+XG4gICAgICAgICAgPC9idXR0b24+KVxuICAgICAgICAgICAgOiBudWxsIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTIgaGktc3VjY2Vzc1wiPlxuXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPlxuICAgICAgICAgICAge2NvbmZpcm1CdXR0b259XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvcGVydHlGb3JtOyIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBDb2x1bW5TZWxlY3QgZnJvbSBcIi4vY29sdW1uLXNlbGVjdFwiO1xuaW1wb3J0IFNlbGVjdEZpZWxkIGZyb20gXCIuLi9maWVsZHMvc2VsZWN0LWZpZWxkXCI7XG5cblxuY2xhc3MgRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBvbkNvbHVtblNlbGVjdCwgb25DbGVhckNvbHVtbiwgcHJvcGVydHlNYXBwaW5nLCB0YXJnZXRhYmxlVnJlcyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHJlbGF0aW9uSW5mbyA9IHByb3BlcnR5TWFwcGluZyAmJiBwcm9wZXJ0eU1hcHBpbmcudmFyaWFibGVbMF1cbiAgICAgID8gcHJvcGVydHlNYXBwaW5nLnZhcmlhYmxlWzBdXG4gICAgICA6IHt9O1xuXG4gICAgY29uc3Qgc291cmNlQ29sdW1uUHJvcHMgPSB7XG4gICAgICAuLi50aGlzLnByb3BzLFxuICAgICAgcGxhY2Vob2xkZXI6IFwiU2VsZWN0IGEgc291cmNlIGNvbHVtbi4uLlwiLFxuICAgICAgb25Db2x1bW5TZWxlY3Q6ICh2YWx1ZSkgPT4gb25Db2x1bW5TZWxlY3QoW3suLi5yZWxhdGlvbkluZm8sIHZhcmlhYmxlTmFtZTogdmFsdWVbMF0udmFyaWFibGVOYW1lfV0pXG4gICAgfTtcblxuXG5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8Q29sdW1uU2VsZWN0IHsuLi5zb3VyY2VDb2x1bW5Qcm9wc30gLz5cbiAgICAgICAgPFNlbGVjdEZpZWxkIHZhbHVlPXtyZWxhdGlvbkluZm8udGFyZ2V0RXhpc3RpbmdUaW1idWN0b29WcmUgfHwgbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUpID0+IG9uQ29sdW1uU2VsZWN0KFt7Li4ucmVsYXRpb25JbmZvLCB0YXJnZXRFeGlzdGluZ1RpbWJ1Y3Rvb1ZyZTogdmFsdWV9XSl9XG4gICAgICAgICAgICAgICAgICAgICBvbkNsZWFyPXsoKSA9PiBvbkNsZWFyQ29sdW1uKDApfT5cblxuICAgICAgICAgIDxzcGFuIHR5cGU9XCJwbGFjZWhvbGRlclwiIGNsYXNzTmFtZT1cImZyb20tZXhjZWxcIj48aW1nIHNyYz1cImltYWdlcy9pY29uLWV4Y2VsLnN2Z1wiIGFsdD1cIlwiLz4gU2VsZWN0IGEgdGFyZ2V0IGRhdGFzZXQuLi48L3NwYW4+XG4gICAgICAgICAge3RhcmdldGFibGVWcmVzLm1hcCgoZGF0YXNldCkgPT4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtkYXRhc2V0fSB2YWx1ZT17ZGF0YXNldH0gY2xhc3NOYW1lPVwiZnJvbS1leGNlbFwiPjxpbWcgc3JjPVwiaW1hZ2VzL2ljb24tZXhjZWwuc3ZnXCIgYWx0PVwiXCIvPiB7ZGF0YXNldH08L3NwYW4+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvU2VsZWN0RmllbGQ+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuRm9ybS5wcm9wVHlwZXMgPSB7XG4gIGNvbGxlY3Rpb25EYXRhOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBtYXBwaW5nczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgbmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgb25DbGVhckZpZWxkTWFwcGluZzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gIG9uU2V0RmllbGRNYXBwaW5nOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRm9ybTtcbiIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBDb2x1bW5TZWxlY3QgZnJvbSBcIi4vY29sdW1uLXNlbGVjdFwiO1xuaW1wb3J0IFNlbGVjdEZpZWxkIGZyb20gXCIuLi9maWVsZHMvc2VsZWN0LWZpZWxkXCI7XG5cblxuY2xhc3MgRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBvbkNvbHVtblNlbGVjdCwgb25DbGVhckNvbHVtbiwgcHJvcGVydHlNYXBwaW5nLCBhdmFpbGFibGVDb2xsZWN0aW9uQ29sdW1uc1BlckFyY2hldHlwZSwgYXJjaGV0eXBlRmllbGRzIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgcmVsYXRpb25JbmZvID0gcHJvcGVydHlNYXBwaW5nICYmIHByb3BlcnR5TWFwcGluZy52YXJpYWJsZVswXVxuICAgICAgPyBwcm9wZXJ0eU1hcHBpbmcudmFyaWFibGVbMF1cbiAgICAgIDoge307XG5cbiAgICBjb25zdCB0YXJnZXRBcmNoZXR5cGVDb2xsZWN0aW9uID0gYXJjaGV0eXBlRmllbGRzLmZpbmQoKGFmKSA9PiBhZi5uYW1lID09PSB0aGlzLnByb3BzLm5hbWUpLnJlbGF0aW9uLnRhcmdldENvbGxlY3Rpb247XG4gICAgY29uc3QgdGFyZ2V0Q29sbGVjdGlvbkNvbHVtbnMgPSBhdmFpbGFibGVDb2xsZWN0aW9uQ29sdW1uc1BlckFyY2hldHlwZVt0YXJnZXRBcmNoZXR5cGVDb2xsZWN0aW9uXTtcbiAgICBjb25zdCB0YXJnZXRDb2xsZWN0aW9ucyA9IHRhcmdldENvbGxlY3Rpb25Db2x1bW5zLm1hcCgodCkgPT4gdC5jb2xsZWN0aW9uTmFtZSk7XG5cbiAgICBjb25zdCBzb3VyY2VDb2x1bW5Qcm9wcyA9IHtcbiAgICAgIC4uLnRoaXMucHJvcHMsXG4gICAgICBwbGFjZWhvbGRlcjogXCJTZWxlY3QgYSBzb3VyY2UgY29sdW1uLi4uXCIsXG4gICAgICBvbkNvbHVtblNlbGVjdDogKHZhbHVlKSA9PiBvbkNvbHVtblNlbGVjdChbey4uLnJlbGF0aW9uSW5mbywgdmFyaWFibGVOYW1lOiB2YWx1ZVswXS52YXJpYWJsZU5hbWV9XSlcbiAgICB9O1xuXG4gICAgY29uc3QgdGFyZ2V0Q29sdW1uUHJvcHMgPSByZWxhdGlvbkluZm8udGFyZ2V0Q29sbGVjdGlvbiA/IHtcbiAgICAgIC4uLnRoaXMucHJvcHMsXG4gICAgICBwbGFjZWhvbGRlcjogXCJTZWxlY3QgYSB0YXJnZXQgY29sdW1uLi4uXCIsXG4gICAgICBwcm9wZXJ0eU1hcHBpbmc6IHt2YXJpYWJsZTogW3t2YXJpYWJsZU5hbWU6IHJlbGF0aW9uSW5mby50YXJnZXRWYXJpYWJsZU5hbWUgfV19LFxuICAgICAgY29sdW1uczogdGFyZ2V0Q29sbGVjdGlvbkNvbHVtbnMuZmluZCgodCkgPT4gdC5jb2xsZWN0aW9uTmFtZSA9PT0gcmVsYXRpb25JbmZvLnRhcmdldENvbGxlY3Rpb24pLmNvbHVtbnNcbiAgICAgICAgLm1hcCgoY29sKSA9PiAoe25hbWU6IGNvbH0pKSxcbiAgICAgIG9uQ29sdW1uU2VsZWN0OiAodmFsdWUpID0+IG9uQ29sdW1uU2VsZWN0KFt7Li4ucmVsYXRpb25JbmZvLCB0YXJnZXRWYXJpYWJsZU5hbWU6IHZhbHVlWzBdLnZhcmlhYmxlTmFtZX1dKVxuICAgIH0gOiBudWxsO1xuXG5cblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxDb2x1bW5TZWxlY3Qgey4uLnNvdXJjZUNvbHVtblByb3BzfSAvPlxuICAgICAgICA8U2VsZWN0RmllbGQgdmFsdWU9e3JlbGF0aW9uSW5mby50YXJnZXRDb2xsZWN0aW9uIHx8IG51bGx9XG4gICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBvbkNvbHVtblNlbGVjdChbey4uLnJlbGF0aW9uSW5mbywgdGFyZ2V0Q29sbGVjdGlvbjogdmFsdWV9XSl9XG4gICAgICAgICAgICAgICAgICAgICBvbkNsZWFyPXsoKSA9PiBvbkNsZWFyQ29sdW1uKDApfT5cblxuICAgICAgICAgIDxzcGFuIHR5cGU9XCJwbGFjZWhvbGRlclwiIGNsYXNzTmFtZT1cImZyb20tZXhjZWxcIj48aW1nIHNyYz1cImltYWdlcy9pY29uLWV4Y2VsLnN2Z1wiIGFsdD1cIlwiLz4gU2VsZWN0IGEgdGFyZ2V0IHNoZWV0Li4uPC9zcGFuPlxuICAgICAgICAgIHt0YXJnZXRDb2xsZWN0aW9ucy5tYXAoKGNvbGxlY3Rpb24pID0+IChcbiAgICAgICAgICAgIDxzcGFuIGtleT17Y29sbGVjdGlvbn0gdmFsdWU9e2NvbGxlY3Rpb259IGNsYXNzTmFtZT1cImZyb20tZXhjZWxcIj48aW1nIHNyYz1cImltYWdlcy9pY29uLWV4Y2VsLnN2Z1wiIGFsdD1cIlwiLz4ge2NvbGxlY3Rpb259PC9zcGFuPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L1NlbGVjdEZpZWxkPlxuICAgICAgICB7dGFyZ2V0Q29sdW1uUHJvcHNcbiAgICAgICAgICA/IDxDb2x1bW5TZWxlY3Qgey4uLnRhcmdldENvbHVtblByb3BzfSAvPlxuICAgICAgICAgIDogbnVsbFxuICAgICAgICB9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuRm9ybS5wcm9wVHlwZXMgPSB7XG4gIGNvbGxlY3Rpb25EYXRhOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBtYXBwaW5nczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgbmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgb25DbGVhckZpZWxkTWFwcGluZzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gIG9uU2V0RmllbGRNYXBwaW5nOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRm9ybTtcbiIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBDb2x1bW5TZWxlY3QgZnJvbSBcIi4vY29sdW1uLXNlbGVjdFwiO1xuXG5cbmNsYXNzIEZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8Q29sdW1uU2VsZWN0IHsuLi50aGlzLnByb3BzfSAvPlxuICB9XG59XG5cbkZvcm0ucHJvcFR5cGVzID0ge1xuICBjb2xsZWN0aW9uRGF0YTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgbWFwcGluZ3M6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIG9uQ2xlYXJGaWVsZE1hcHBpbmc6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICBvblNldEZpZWxkTWFwcGluZzogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm07XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhcHBTdGF0ZSkge1xuICByZXR1cm4ge1xuICAgIGlzVXBsb2FkaW5nOiBhcHBTdGF0ZS5pbXBvcnREYXRhLmlzVXBsb2FkaW5nLFxuICAgIHVzZXJJZDogYXBwU3RhdGUudXNlcmRhdGEudXNlcklkLFxuICAgIHZyZXM6IGFwcFN0YXRlLnVzZXJkYXRhLm15VnJlcyB8fCB7fVxuICB9XG59IiwiLy8gSGVscGVyIGZ1bmN0aW9uIGZvciByZWFjdC1yZWR1eCBjb25uZWN0XG5mdW5jdGlvbiBnZXRDb25maXJtZWRDb2xzKHByb3BzLCB2YXJpYWJsZXMpIHtcbiAgY29uc3QgeyBtYXBwaW5ncywgaW1wb3J0RGF0YTogeyBhY3RpdmVDb2xsZWN0aW9uIH0gfSA9IHByb3BzO1xuXG4gIHJldHVybiB2YXJpYWJsZXNcbiAgICAubWFwKCh2YWx1ZSwgaSkgPT4gKHt2YWx1ZTogdmFsdWUsIGluZGV4OiBpfSkpXG4gICAgLmZpbHRlcigoY29sU3BlYykgPT4gbWFwcGluZ3MuY29sbGVjdGlvbnNbYWN0aXZlQ29sbGVjdGlvbl0ubWFwcGluZ3NcbiAgICAgIC5maWx0ZXIoKG0pID0+IG0uY29uZmlybWVkKVxuICAgICAgLm1hcCgobSkgPT4gbS52YXJpYWJsZS5tYXAoKHYpID0+IHYudmFyaWFibGVOYW1lKSlcbiAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSlcbiAgICAgIC5pbmRleE9mKGNvbFNwZWMudmFsdWUpID4gLTFcbiAgICApLm1hcCgoY29sU3BlYykgPT4gY29sU3BlYy5pbmRleCk7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbiBmb3IgcmVhY3QtcmVkdXggY29ubmVjdFxuZnVuY3Rpb24gbWFwcGluZ3NBcmVDb21wbGV0ZShwcm9wcywgc2hlZXQpIHtcbiAgY29uc3QgeyBtYXBwaW5ncyB9ID0gcHJvcHM7XG5cbiAgY29uc3QgY29uZmlybWVkQ29sQ291bnQgPSBtYXBwaW5ncy5jb2xsZWN0aW9uc1tzaGVldC5jb2xsZWN0aW9uXS5tYXBwaW5nc1xuICAgIC5maWx0ZXIoKG0pID0+IG0uY29uZmlybWVkKVxuICAgIC5tYXAoKG0pID0+IG0udmFyaWFibGUubWFwKCh2KSA9PiB2LnZhcmlhYmxlTmFtZSkpXG4gICAgLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYiksIFtdKVxuICAgIC5maWx0ZXIoKHgsIGlkeCwgc2VsZikgPT4gc2VsZi5pbmRleE9mKHgpID09PSBpZHgpXG4gICAgLmxlbmd0aDtcblxuICByZXR1cm4gY29uZmlybWVkQ29sQ291bnQgKyBtYXBwaW5ncy5jb2xsZWN0aW9uc1tzaGVldC5jb2xsZWN0aW9uXS5pZ25vcmVkQ29sdW1ucy5sZW5ndGggPT09IHNoZWV0LnZhcmlhYmxlcy5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGdldFRhcmdldGFibGVWcmVzKG1pbmUsIHZyZXMpIHtcbiAgY29uc3QgbXlWcmVzID0gT2JqZWN0LmtleXMobWluZSB8fCB7fSlcbiAgICAubWFwKChrZXkpID0+IG1pbmVba2V5XSlcbiAgICAuZmlsdGVyKCh2cmUpID0+IHZyZS5wdWJsaXNoZWQpXG4gICAgLm1hcCgodnJlKSA9PiB2cmUubmFtZSk7XG4gIGNvbnN0IHB1YmxpY1ZyZXMgPSBPYmplY3Qua2V5cyh2cmVzIHx8IHt9KVxuICAgIC5tYXAoKGtleSkgPT4gdnJlc1trZXldLm5hbWUpO1xuXG4gIHJldHVybiBteVZyZXMuY29uY2F0KHB1YmxpY1ZyZXMpO1xufVxuXG4vLyBNb3ZlcyB0byByZWFjdC1yZWR1eCBjb25uZWN0XG5mdW5jdGlvbiB0cmFuc2Zvcm1Qcm9wcyhwcm9wcykge1xuXG4gIGNvbnN0IHtcbiAgICBpbXBvcnREYXRhOiB7IHNoZWV0cywgYWN0aXZlQ29sbGVjdGlvbiwgdXBsb2FkZWRGaWxlTmFtZSwgcHVibGlzaEVycm9ycyB9LFxuICAgIHVzZXJkYXRhOiB7IG15VnJlcywgdnJlcyB9LFxuICAgIG1hcHBpbmdzLFxuICAgIGFyY2hldHlwZVxuICB9ID0gcHJvcHM7XG4gIGNvbnN0IGNvbGxlY3Rpb25EYXRhID0gc2hlZXRzLmZpbmQoKHNoZWV0KSA9PiBzaGVldC5jb2xsZWN0aW9uID09PSBhY3RpdmVDb2xsZWN0aW9uKTtcbiAgY29uc3QgeyByb3dzLCB2YXJpYWJsZXMgfSA9IGNvbGxlY3Rpb25EYXRhO1xuXG4gIGNvbnN0IGNvbmZpcm1lZENvbHMgPSBnZXRDb25maXJtZWRDb2xzKHByb3BzLCB2YXJpYWJsZXMpO1xuICBjb25zdCB7IGlnbm9yZWRDb2x1bW5zIH0gPSBtYXBwaW5ncy5jb2xsZWN0aW9uc1thY3RpdmVDb2xsZWN0aW9uXTtcblxuICBjb25zdCBhdmFpbGFibGVBcmNoZXR5cGVzID0gT2JqZWN0LmtleXMobWFwcGluZ3MuY29sbGVjdGlvbnMpLm1hcCgoa2V5KSA9PiBtYXBwaW5ncy5jb2xsZWN0aW9uc1trZXldLmFyY2hldHlwZU5hbWUpO1xuXG4gIHJldHVybiB7XG4gICAgc2hlZXRzOiBzaGVldHMsXG4gICAgYWN0aXZlQ29sbGVjdGlvbjogYWN0aXZlQ29sbGVjdGlvbixcbiAgICB1cGxvYWRlZEZpbGVOYW1lOiB1cGxvYWRlZEZpbGVOYW1lLFxuICAgIGNvbGxlY3Rpb25UYWJzOiBzaGVldHMubWFwKChzaGVldCkgPT4gKHtcbiAgICAgIGNvbGxlY3Rpb25OYW1lOiBzaGVldC5jb2xsZWN0aW9uLFxuICAgICAgYXJjaGV0eXBlTmFtZTogbWFwcGluZ3MuY29sbGVjdGlvbnNbc2hlZXQuY29sbGVjdGlvbl0uYXJjaGV0eXBlTmFtZSxcbiAgICAgIGFjdGl2ZTogYWN0aXZlQ29sbGVjdGlvbiA9PT0gc2hlZXQuY29sbGVjdGlvbixcbiAgICAgIGNvbXBsZXRlOiBtYXBwaW5nc0FyZUNvbXBsZXRlKHByb3BzLCBzaGVldClcbiAgICB9KSksXG4gICAgcm93czogcm93cy5tYXAoKHJvdykgPT4gcm93Lm1hcCgoY2VsbCwgaSkgPT4gKHtcbiAgICAgIHZhbHVlOiBjZWxsLnZhbHVlLFxuICAgICAgZXJyb3I6IGNlbGwuZXJyb3IgfHwgbnVsbCxcbiAgICAgIGlnbm9yZWQ6IGlnbm9yZWRDb2x1bW5zLmluZGV4T2YodmFyaWFibGVzW2ldKSA+IC0xXG4gICAgfSkpKSxcbiAgICBoZWFkZXJzOiB2YXJpYWJsZXMubWFwKCh2YXJpYWJsZSwgaSkgPT4gKHtcbiAgICAgIG5hbWU6IHZhcmlhYmxlLFxuICAgICAgaXNDb25maXJtZWQ6IGlnbm9yZWRDb2x1bW5zLmluZGV4T2YoaSkgPCAwICYmIGNvbmZpcm1lZENvbHMuaW5kZXhPZihpKSA+IC0xLFxuICAgICAgaXNJZ25vcmVkOiBpZ25vcmVkQ29sdW1ucy5pbmRleE9mKHZhcmlhYmxlKSA+IC0xXG4gICAgfSkpLFxuICAgIG5leHRVcmw6IHNoZWV0cy5maW5kKChzaGVldCkgPT4gc2hlZXQuY29sbGVjdGlvbiA9PT0gYWN0aXZlQ29sbGVjdGlvbikubmV4dFVybCxcbiAgICBhcmNoZXR5cGVGaWVsZHM6IGFyY2hldHlwZVttYXBwaW5ncy5jb2xsZWN0aW9uc1thY3RpdmVDb2xsZWN0aW9uXS5hcmNoZXR5cGVOYW1lXSxcbiAgICBwcm9wZXJ0eU1hcHBpbmdzOiBtYXBwaW5ncy5jb2xsZWN0aW9uc1thY3RpdmVDb2xsZWN0aW9uXS5tYXBwaW5ncyxcbiAgICBjdXN0b21Qcm9wZXJ0eU1hcHBpbmdzOiBtYXBwaW5ncy5jb2xsZWN0aW9uc1thY3RpdmVDb2xsZWN0aW9uXS5jdXN0b21Qcm9wZXJ0aWVzLFxuICAgIGF2YWlsYWJsZUFyY2hldHlwZXM6IGF2YWlsYWJsZUFyY2hldHlwZXMsXG4gICAgcHVibGlzaGluZzogbWFwcGluZ3MucHVibGlzaGluZyxcbiAgICBhdmFpbGFibGVDb2xsZWN0aW9uQ29sdW1uc1BlckFyY2hldHlwZTogYXZhaWxhYmxlQXJjaGV0eXBlcy5tYXAoKGFyY2hldHlwZU5hbWUpID0+ICh7XG4gICAgICBrZXk6IGFyY2hldHlwZU5hbWUsXG4gICAgICB2YWx1ZXM6IE9iamVjdC5rZXlzKG1hcHBpbmdzLmNvbGxlY3Rpb25zKVxuICAgICAgICAuZmlsdGVyKChjb2xsZWN0aW9uTmFtZSkgPT4gbWFwcGluZ3MuY29sbGVjdGlvbnNbY29sbGVjdGlvbk5hbWVdLmFyY2hldHlwZU5hbWUgPT09IGFyY2hldHlwZU5hbWUpXG4gICAgICAgIC5tYXAoKGNvbGxlY3Rpb25OYW1lKSA9PiAoe1xuICAgICAgICAgIGNvbGxlY3Rpb25OYW1lOiBjb2xsZWN0aW9uTmFtZSxcbiAgICAgICAgICBjb2x1bW5zOiBzaGVldHMuZmluZCgoc2hlZXQpID0+IHNoZWV0LmNvbGxlY3Rpb24gPT09IGNvbGxlY3Rpb25OYW1lKS52YXJpYWJsZXNcbiAgICAgICAgfSkpXG4gICAgfSkpLnJlZHVjZSgoYXJjaGV0eXBlVG9Db2xsZWN0aW9uQ29sdW1uTWFwcGluZywgY3VycmVudEFyY2hldHlwZUFuZENvbHMpID0+IHtcbiAgICAgIGFyY2hldHlwZVRvQ29sbGVjdGlvbkNvbHVtbk1hcHBpbmdbY3VycmVudEFyY2hldHlwZUFuZENvbHMua2V5XSA9IGN1cnJlbnRBcmNoZXR5cGVBbmRDb2xzLnZhbHVlcztcbiAgICAgIHJldHVybiBhcmNoZXR5cGVUb0NvbGxlY3Rpb25Db2x1bW5NYXBwaW5nO1xuICAgIH0sIHt9KSxcbiAgICBwdWJsaXNoRXJyb3JzOiBwdWJsaXNoRXJyb3JzLFxuICAgIHNob3dDb2xsZWN0aW9uc0FyZUNvbm5lY3RlZE1lc3NhZ2U6ICBwcm9wcy5tZXNzYWdlcy5zaG93Q29sbGVjdGlvbnNBcmVDb25uZWN0ZWRNZXNzYWdlLFxuICAgIHRhcmdldGFibGVWcmVzOiBnZXRUYXJnZXRhYmxlVnJlcyhteVZyZXMsIHZyZXMpXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zZm9ybVByb3BzOyIsImV4cG9ydCBkZWZhdWx0IChhcHBTdGF0ZSkgPT4gKHtcbiAgbWFwcGluZ3M6IGFwcFN0YXRlLm1hcHBpbmdzLFxuICBzaGVldHM6IGFwcFN0YXRlLmltcG9ydERhdGEuc2hlZXRzLFxuICB1cGxvYWRlZEZpbGVOYW1lOiBhcHBTdGF0ZS5pbXBvcnREYXRhLnVwbG9hZGVkRmlsZU5hbWUsXG4gIGFyY2hldHlwZTogYXBwU3RhdGUuYXJjaGV0eXBlLFxuICBvbk1hcENvbGxlY3Rpb25BcmNoZXR5cGU6IGFwcFN0YXRlLm9uTWFwQ29sbGVjdGlvbkFyY2hldHlwZSxcbiAgb25Db25maXJtQ29sbGVjdGlvbkFyY2hldHlwZU1hcHBpbmdzOiBhcHBTdGF0ZS5vbkNvbmZpcm1Db2xsZWN0aW9uQXJjaGV0eXBlTWFwcGluZ3MsXG4gIHNob3dGaWxlSXNVcGxvYWRlZE1lc3NhZ2U6IGFwcFN0YXRlLm1lc3NhZ2VzLnNob3dGaWxlSXNVcGxvYWRlZE1lc3NhZ2Vcbn0pOyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGFwcFN0YXRlKSB7XG4gcmV0dXJuIHtcbiAgIHVzZXJJZDogYXBwU3RhdGUudXNlcmRhdGEudXNlcklkLFxuICAgaXNVcGxvYWRpbmc6IGFwcFN0YXRlLmltcG9ydERhdGEuaXNVcGxvYWRpbmdcbiB9XG59IiwiaW1wb3J0IHsgdXJscyB9IGZyb20gXCIuLi8uLi9yb3V0ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgKGFwcFN0YXRlLCBvd25Qcm9wcykgPT4ge1xuICBjb25zdCB7IGxvY2F0aW9uOiB7IHBhdGhuYW1lIH0gfSA9IG93blByb3BzO1xuICByZXR1cm4ge1xuICAgIHVzZXJuYW1lOiBhcHBTdGF0ZS51c2VyZGF0YS51c2VySWQsXG4gICAgdnJlczogYXBwU3RhdGUudXNlcmRhdGEudnJlcyxcbiAgICBzaG93RGF0YXNldHM6IHBhdGhuYW1lID09PSBcIi9cIiB8fCBwYXRobmFtZSA9PT0gdXJscy5jb2xsZWN0aW9uc092ZXJ2aWV3KClcbiAgfTtcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBjeCBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuXG5jbGFzcyBEYXRhUm93IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyByb3cgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDx0cj5cbiAgICAgICAge3Jvdy5tYXAoKGNlbGwsIGkpID0+IChcbiAgICAgICAgICA8dGQgY2xhc3NOYW1lPXtjeCh7XG4gICAgICAgICAgICBpZ25vcmVkOiBjZWxsLmlnbm9yZWQsXG4gICAgICAgICAgICBkYW5nZXI6IGNlbGwuZXJyb3IgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgICB9KX0ga2V5PXtpfT5cbiAgICAgICAgICAgIHtjZWxsLnZhbHVlfVxuICAgICAgICAgICAge2NlbGwuZXJyb3IgPyA8c3BhbiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0IGdseXBoaWNvbiBnbHlwaGljb24tZXhjbGFtYXRpb24tc2lnblwiIHN0eWxlPXt7Y3Vyc29yOiBcInBvaW50ZXJcIn19IHRpdGxlPXtjZWxsLmVycm9yfSAvPiA6IG51bGx9XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgKSl9XG4gICAgICA8L3RyPlxuICAgICk7XG4gIH1cbn1cblxuRGF0YVJvdy5wcm9wVHlwZXMgPSB7XG4gIHJvdzogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRGF0YVJvdzsiLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgY3ggZnJvbSBcImNsYXNzbmFtZXNcIjtcblxuY2xhc3MgSGVhZGVyQ2VsbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgaGVhZGVyLCBpc0NvbmZpcm1lZCwgaXNJZ25vcmVkLCBvbklnbm9yZUNvbHVtblRvZ2dsZSB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8dGggY2xhc3NOYW1lPXtjeCh7XG4gICAgICAgIHN1Y2Nlc3M6IGlzQ29uZmlybWVkLFxuICAgICAgICBpbmZvOiAhaXNDb25maXJtZWQgJiYgIWlzSWdub3JlZCxcbiAgICAgICAgZGFuZ2VyOiAhaXNDb25maXJtZWQgJiYgaXNJZ25vcmVkXG4gICAgICB9KX0+XG4gICAgICAgIHtoZWFkZXJ9XG4gICAgICAgIDxhIHN0eWxlPXt7Y3Vyc29yOiBcInBvaW50ZXJcIn19IGNsYXNzTmFtZT17Y3goXCJwdWxsLXJpZ2h0XCIsIFwiZ2x5cGhpY29uXCIsIHtcbiAgICAgICAgICBcImdseXBoaWNvbi1vay1zaWduXCI6IGlzQ29uZmlybWVkLFxuICAgICAgICAgIFwiZ2x5cGhpY29uLXF1ZXN0aW9uLXNpZ25cIjogIWlzQ29uZmlybWVkICYmICFpc0lnbm9yZWQsXG4gICAgICAgICAgXCJnbHlwaGljb24tcmVtb3ZlXCI6ICFpc0NvbmZpcm1lZCAmJiBpc0lnbm9yZWRcbiAgICAgICAgfSl9IG9uQ2xpY2s9eygpID0+ICFpc0NvbmZpcm1lZCA/IG9uSWdub3JlQ29sdW1uVG9nZ2xlKGhlYWRlcikgOiBudWxsIH0gPlxuICAgICAgICA8L2E+XG4gICAgICA8L3RoPlxuICAgICk7XG4gIH1cbn1cblxuSGVhZGVyQ2VsbC5wcm9wVHlwZXMgPSB7XG4gIGhlYWRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgaXNDb25maXJtZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBpc0lnbm9yZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBvbklnbm9yZUNvbHVtblRvZ2dsZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEhlYWRlckNlbGw7IiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IGN4IGZyb20gXCJjbGFzc25hbWVzXCI7XG5cbmNsYXNzIFVwbG9hZEJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY2xhc3NOYW1lcywgaXNVcGxvYWRpbmcsIG9uVXBsb2FkRmlsZVNlbGVjdCwgZ2x5cGhpY29uLCBsYWJlbCB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGZvcm0+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9e2N4KC4uLmNsYXNzTmFtZXMsIHtkaXNhYmxlZDogaXNVcGxvYWRpbmd9KX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtnbHlwaGljb259Pjwvc3Bhbj5cbiAgICAgICAgICB7XCIgXCJ9XG4gICAgICAgICAge2lzVXBsb2FkaW5nID8gXCJVcGxvYWRpbmcuLi5cIiA6IGxhYmVsIH1cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGRpc2FibGVkPXtpc1VwbG9hZGluZ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IG9uVXBsb2FkRmlsZVNlbGVjdChlLnRhcmdldC5maWxlcyl9XG4gICAgICAgICAgICBzdHlsZT17e2Rpc3BsYXk6IFwibm9uZVwifX1cbiAgICAgICAgICAgIHR5cGU9XCJmaWxlXCIgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvZm9ybT5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFVwbG9hZEJ1dHRvbjsiLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xuaW1wb3J0IHN0b3JlIGZyb20gXCIuL3N0b3JlXCI7XG5pbXBvcnQgeGhyIGZyb20gXCJ4aHJcIjtcbmltcG9ydCB4aHJtb2NrIGZyb20gXCJ4aHItbW9ja1wiO1xuaW1wb3J0IHNldHVwTW9ja3MgZnJvbSBcIi4vc2VydmVybW9ja3NcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4vcm91dGVyXCI7XG5pbXBvcnQgYWN0aW9uc01ha2VyIGZyb20gXCIuL2FjdGlvbnNcIjtcbmltcG9ydCB7IG5hdmlnYXRlVG8gfSBmcm9tIFwiLi9yb3V0ZXJcIjtcblxuXG5pZiAocHJvY2Vzcy5lbnYuVVNFX01PQ0sgPT09IFwidHJ1ZVwiKSB7XG5cdGNvbnNvbGUubG9nKFwiVXNpbmcgbW9jayBzZXJ2ZXIhXCIpXG5cdHZhciBvcmlnID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xuXHR4aHJtb2NrLnNldHVwKCk7IC8vbW9jayB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgdXNhZ2VzXG5cdHZhciBtb2NrID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xuXHR3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPSBvcmlnO1xuXHR4aHIuWE1MSHR0cFJlcXVlc3QgPSBtb2NrO1xuXHR4aHIuWERvbWFpblJlcXVlc3QgPSBtb2NrO1xuXHRzZXR1cE1vY2tzKHhocm1vY2ssIG9yaWcpO1xufVxubGV0IGFjdGlvbnMgPSBhY3Rpb25zTWFrZXIobmF2aWdhdGVUbywgc3RvcmUuZGlzcGF0Y2guYmluZChzdG9yZSkpO1xuXG5mdW5jdGlvbiBjaGVja1Rva2VuSW5Vcmwoc3RhdGUpIHtcblx0bGV0IHBhdGggPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKTtcblx0bGV0IHBhcmFtcyA9IHBhdGguc3BsaXQoJyYnKTtcblxuXHRmb3IobGV0IGkgaW4gcGFyYW1zKSB7XG5cdFx0bGV0IFtrZXksIHZhbHVlXSA9IHBhcmFtc1tpXS5zcGxpdCgnPScpO1xuXHRcdGlmKGtleSA9PT0gJ2hzaWQnICYmICFzdGF0ZS51c2VyZGF0YS51c2VySWQpIHtcblx0XHRcdGFjdGlvbnMub25Ub2tlbih2YWx1ZSk7XG5cblxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcblx0bGV0IHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcblx0Y2hlY2tUb2tlbkluVXJsKHN0YXRlKTtcblx0aWYgKCFzdGF0ZS5hcmNoZXR5cGUgfHwgT2JqZWN0LmtleXMoc3RhdGUuYXJjaGV0eXBlKS5sZW5ndGggPT09IDApIHtcblx0XHR4aHIocHJvY2Vzcy5lbnYuc2VydmVyICsgXCIvdjIuMS9tZXRhZGF0YS9BZG1pblwiLCAoZXJyLCByZXNwKSA9PiB7XG5cdFx0XHRzdG9yZS5kaXNwYXRjaCh7dHlwZTogXCJTRVRfQVJDSEVUWVBFX01FVEFEQVRBXCIsIGRhdGE6IEpTT04ucGFyc2UocmVzcC5ib2R5KX0pO1xuXHRcdH0pO1xuXHR9XG5cdFJlYWN0RE9NLnJlbmRlcihcblx0XHRyb3V0ZXIsXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcHBcIilcblx0KVxufSk7XG4iLCJpbXBvcnQgeyBnZXRJdGVtIH0gZnJvbSBcIi4uL3V0aWwvcGVyc2lzdFwiO1xuXG5jb25zdCBpbml0aWFsU3RhdGUgPSBnZXRJdGVtKFwiYXJjaGV0eXBlXCIpIHx8IHt9O1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0YXRlPWluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblx0XHRjYXNlIFwiU0VUX0FSQ0hFVFlQRV9NRVRBREFUQVwiOlxuXHRcdFx0cmV0dXJuIGFjdGlvbi5kYXRhO1xuXHR9XG5cblx0cmV0dXJuIHN0YXRlO1xufSIsImltcG9ydCB7IGdldEl0ZW0gfSBmcm9tIFwiLi4vdXRpbC9wZXJzaXN0XCI7XG5cbmNvbnN0IGluaXRpYWxTdGF0ZSA9IGdldEl0ZW0oXCJpbXBvcnREYXRhXCIpIHx8IHtcblx0aXNVcGxvYWRpbmc6IGZhbHNlLFxuXHRzaGVldHM6IG51bGwsXG5cdGFjdGl2ZUNvbGxlY3Rpb246IG51bGwsXG5cdHB1Ymxpc2hFcnJvcnM6IGZhbHNlLFxuXHR1cGxvYWRlZEZpbGVOYW1lOiB1bmRlZmluZWRcbn07XG5cbmZ1bmN0aW9uIGZpbmRJbmRleChhcnIsIGYpIHtcblx0bGV0IGxlbmd0aCA9IGFyci5sZW5ndGg7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZihhcnJbaV0sIGksIGFycikpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuXHRyZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIHNoZWV0Um93RnJvbURpY3RUb0FycmF5KHJvd2RpY3QsIGFycmF5T2ZWYXJpYWJsZU5hbWVzLCBtYXBwaW5nRXJyb3JzKSB7XG5cdHJldHVybiBhcnJheU9mVmFyaWFibGVOYW1lcy5tYXAobmFtZSA9PiAoe1xuXHRcdHZhbHVlOiByb3dkaWN0W25hbWVdLFxuXHRcdGVycm9yOiBtYXBwaW5nRXJyb3JzW25hbWVdIHx8IHVuZGVmaW5lZFxuXHR9KSk7XG59XG5cbmZ1bmN0aW9uIGFkZFJvd3MoY3VyUm93cywgbmV3Um93cywgYXJyYXlPZlZhcmlhYmxlTmFtZXMpIHtcblx0cmV0dXJuIGN1clJvd3MuY29uY2F0KFxuXHRcdG5ld1Jvd3MubWFwKGl0ZW0gPT4gc2hlZXRSb3dGcm9tRGljdFRvQXJyYXkoaXRlbS52YWx1ZXMgfHwge30sIGFycmF5T2ZWYXJpYWJsZU5hbWVzLCBpdGVtLmVycm9ycyB8fCB7fSkpXG5cdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0YXRlPWluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XG5cdHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblx0XHRjYXNlIFwiU1RBUlRfVVBMT0FEXCI6XG5cdFx0XHRyZXR1cm4gey4uLnN0YXRlLCBpc1VwbG9hZGluZzogdHJ1ZX07XG5cdFx0Y2FzZSBcIkZJTklTSF9VUExPQURcIjpcblx0XHRcdHJldHVybiB7Li4uc3RhdGUsXG5cdFx0XHRcdGlzVXBsb2FkaW5nOiBmYWxzZSxcblx0XHRcdFx0cHVibGlzaEVycm9yczogZmFsc2UsXG5cdFx0XHRcdHVwbG9hZGVkRmlsZU5hbWU6IGFjdGlvbi51cGxvYWRlZEZpbGVOYW1lLFxuXHRcdFx0XHRzaGVldHM6IGFjdGlvbi5kYXRhLmNvbGxlY3Rpb25zLm1hcChzaGVldCA9PiAoe1xuXHRcdFx0XHRcdGNvbGxlY3Rpb246IHNoZWV0Lm5hbWUsXG5cdFx0XHRcdFx0dmFyaWFibGVzOiBzaGVldC52YXJpYWJsZXMsXG5cdFx0XHRcdFx0cm93czogW10sXG5cdFx0XHRcdFx0bmV4dFVybDogc2hlZXQuZGF0YSxcblx0XHRcdFx0XHRuZXh0VXJsV2l0aEVycm9yczogc2hlZXQuZGF0YVdpdGhFcnJvcnNcblx0XHRcdFx0fSkpLFxuXHRcdFx0XHRhY3RpdmVDb2xsZWN0aW9uOiBhY3Rpb24uZGF0YS5jb2xsZWN0aW9uc1swXS5uYW1lLFxuXHRcdFx0XHR2cmU6IGFjdGlvbi5kYXRhLnZyZSxcblx0XHRcdFx0c2F2ZU1hcHBpbmdVcmw6IGFjdGlvbi5kYXRhLnNhdmVNYXBwaW5nLFxuXHRcdFx0XHRleGVjdXRlTWFwcGluZ1VybDogYWN0aW9uLmRhdGEuZXhlY3V0ZU1hcHBpbmdcblx0XHRcdH07XG5cdFx0Y2FzZSBcIkNPTExFQ1RJT05fSVRFTVNfTE9BRElOR19TVUNDRUVERURcIjpcblx0XHRcdGxldCBzaGVldElkeCA9IGZpbmRJbmRleChzdGF0ZS5zaGVldHMsIHNoZWV0ID0+IHNoZWV0LmNvbGxlY3Rpb24gPT09IGFjdGlvbi5jb2xsZWN0aW9uKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdC4uLnN0YXRlLFxuXHRcdFx0XHRzaGVldHM6IFtcblx0XHRcdFx0XHQuLi5zdGF0ZS5zaGVldHMuc2xpY2UoMCwgc2hlZXRJZHgpLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC4uLnN0YXRlLnNoZWV0c1tzaGVldElkeF0sXG5cdFx0XHRcdFx0XHRyb3dzOiBhZGRSb3dzKHN0YXRlLnNoZWV0c1tzaGVldElkeF0ucm93cywgYWN0aW9uLmRhdGEuaXRlbXMsIHN0YXRlLnNoZWV0c1tzaGVldElkeF0udmFyaWFibGVzKSxcblx0XHRcdFx0XHRcdG5leHRVcmw6IGFjdGlvbi5kYXRhLl9uZXh0XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQuLi5zdGF0ZS5zaGVldHMuc2xpY2Uoc2hlZXRJZHggKyAxKVxuXHRcdFx0XHRdXG5cdFx0XHR9O1xuXG5cdFx0Y2FzZSBcIkNPTExFQ1RJT05fSVRFTVNfTE9BRElOR19GSU5JU0hFRFwiOlxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gey4uLnN0YXRlfTtcblx0XHRcdHJlc3VsdC5zaGVldHMgPSByZXN1bHQuc2hlZXRzLnNsaWNlKCk7XG5cdFx0XHRyZXN1bHQuc2hlZXRzXG5cdFx0XHRcdC5mb3JFYWNoKChzaGVldCwgaSkgPT4ge1xuXHRcdFx0XHRcdGlmIChzaGVldC5jb2xsZWN0aW9uID09PSBhY3Rpb24uY29sbGVjdGlvbikge1xuXHRcdFx0XHRcdFx0cmVzdWx0LnNoZWV0c1tpXSA9IHtcblx0XHRcdFx0XHRcdFx0Li4uc2hlZXQsXG5cdFx0XHRcdFx0XHRcdGlzTG9hZGluZzogZmFsc2Vcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRjYXNlIFwiU0VUX0FDVElWRV9DT0xMRUNUSU9OXCI6XG5cdFx0XHRyZXR1cm4gey4uLnN0YXRlLCBhY3RpdmVDb2xsZWN0aW9uOiBhY3Rpb24uY29sbGVjdGlvbn07XG5cdFx0Y2FzZSBcIlBVQkxJU0hfSEFEX0VSUk9SXCI6XG5cdFx0XHQvLyBjbGVhciB0aGUgc2hlZXRzIHRvIGZvcmNlIHJlbG9hZFxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Li4uc3RhdGUsXG5cdFx0XHRcdHB1Ymxpc2hFcnJvcnM6IHRydWUsXG5cdFx0XHRcdHNoZWV0czogc3RhdGUuc2hlZXRzLm1hcCgoc2hlZXQpID0+ICh7XG5cdFx0XHRcdFx0Li4uc2hlZXQsXG5cdFx0XHRcdFx0cm93czogW10sXG5cdFx0XHRcdFx0bmV4dFVybDogc2hlZXQubmV4dFVybFdpdGhFcnJvcnNcblx0XHRcdFx0fSkpXG5cdFx0XHR9O1xuXHRcdGNhc2UgXCJQVUJMSVNIX1NVQ0NFRURFRFwiOlxuXHRcdFx0Ly8gY2xlYXIgdGhlIHNoZWV0cyB0byBmb3JjZSByZWxvYWRcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdC4uLnN0YXRlLFxuXHRcdFx0XHRwdWJsaXNoRXJyb3JzOiBmYWxzZSxcblx0XHRcdFx0c2hlZXRzOiBzdGF0ZS5zaGVldHMubWFwKChzaGVldCkgPT4gKHtcblx0XHRcdFx0XHQuLi5zaGVldCxcblx0XHRcdFx0XHRyb3dzOiBbXSxcblx0XHRcdFx0XHRuZXh0VXJsOiBzaGVldC5uZXh0VXJsV2l0aEVycm9yc1xuXHRcdFx0XHR9KSlcblx0XHRcdH07XG5cdH1cblxuXHRyZXR1cm4gc3RhdGU7XG59XG4iLCJpbXBvcnQgaW1wb3J0RGF0YSBmcm9tIFwiLi9pbXBvcnQtZGF0YVwiO1xuaW1wb3J0IGFyY2hldHlwZSBmcm9tIFwiLi9hcmNoZXR5cGVcIjtcbmltcG9ydCBtYXBwaW5ncyBmcm9tIFwiLi9tYXBwaW5nc1wiO1xuaW1wb3J0IHVzZXJkYXRhIGZyb20gXCIuL3VzZXJkYXRhXCI7XG5pbXBvcnQgbWVzc2FnZXMgZnJvbSBcIi4vbWVzc2FnZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRtZXNzYWdlczogbWVzc2FnZXMsXG5cdGltcG9ydERhdGE6IGltcG9ydERhdGEsXG5cdGFyY2hldHlwZTogYXJjaGV0eXBlLFxuXHRtYXBwaW5nczogbWFwcGluZ3MsXG5cdHVzZXJkYXRhOiB1c2VyZGF0YVxufTtcbiIsImltcG9ydCBzZXRJbiBmcm9tIFwiLi4vdXRpbC9zZXQtaW5cIjtcbmltcG9ydCBnZXRJbiBmcm9tIFwiLi4vdXRpbC9nZXQtaW5cIjtcbmltcG9ydCB7IGdldEl0ZW0gfSBmcm9tIFwiLi4vdXRpbC9wZXJzaXN0XCI7XG5cbmNvbnN0IG5ld1ZhcmlhYmxlRGVzYyA9IChwcm9wZXJ0eSwgdmFyaWFibGVTcGVjKSA9PiAoe1xuICBwcm9wZXJ0eTogcHJvcGVydHksXG4gIHZhcmlhYmxlOiB2YXJpYWJsZVNwZWMsXG4gIGRlZmF1bHRWYWx1ZTogW10sXG4gIGNvbmZpcm1lZDogZmFsc2UsXG4gIHZhbHVlTWFwcGluZ3M6IHt9XG59KTtcblxuZnVuY3Rpb24gc2NhZmZvbGRDb2xsZWN0aW9uTWFwcGluZ3MoaW5pdCwgc2hlZXQpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oaW5pdCwge1xuICAgIFtzaGVldC5uYW1lXToge1xuICAgICAgYXJjaGV0eXBlTmFtZTogbnVsbCxcbiAgICAgIG1hcHBpbmdzOiBbXSxcbiAgICAgIGlnbm9yZWRDb2x1bW5zOiBbXSxcbiAgICAgIGN1c3RvbVByb3BlcnRpZXM6IFtdXG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgaW5pdGlhbFN0YXRlID0gZ2V0SXRlbShcIm1hcHBpbmdzXCIpIHx8IHtcbiAgY29sbGVjdGlvbnM6IHt9LFxuICBjb25maXJtZWQ6IGZhbHNlLFxuICBwdWJsaXNoaW5nOiBmYWxzZVxufTtcblxuY29uc3QgZ2V0TWFwcGluZ0luZGV4ID0gKHN0YXRlLCBhY3Rpb24pID0+XG4gIHN0YXRlLmNvbGxlY3Rpb25zW2FjdGlvbi5jb2xsZWN0aW9uXS5tYXBwaW5nc1xuICAgIC5tYXAoKG0sIGkpID0+ICh7aW5kZXg6IGksIG06IG19KSlcbiAgICAuZmlsdGVyKChtU3BlYykgPT4gbVNwZWMubS5wcm9wZXJ0eSA9PT0gYWN0aW9uLnByb3BlcnR5RmllbGQpXG4gICAgLnJlZHVjZSgocHJldiwgY3VyKSA9PiBjdXIuaW5kZXgsIC0xKTtcblxuY29uc3QgbWFwQ29sbGVjdGlvbkFyY2hldHlwZSA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGxldCBuZXdDb2xsZWN0aW9ucyA9IHNldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJhcmNoZXR5cGVOYW1lXCJdLCBhY3Rpb24udmFsdWUsIHN0YXRlLmNvbGxlY3Rpb25zKTtcbiAgbmV3Q29sbGVjdGlvbnMgPSBzZXRJbihbYWN0aW9uLmNvbGxlY3Rpb24sIFwibWFwcGluZ3NcIl0sIFtdLCBuZXdDb2xsZWN0aW9ucyk7XG5cbiAgcmV0dXJuIHsuLi5zdGF0ZSwgY29sbGVjdGlvbnM6IG5ld0NvbGxlY3Rpb25zfTtcbn07XG5cbmNvbnN0IHVwc2VydEZpZWxkTWFwcGluZyA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IGZvdW5kSWR4ID0gZ2V0TWFwcGluZ0luZGV4KHN0YXRlLCBhY3Rpb24pO1xuICBjb25zdCBuZXdDb2xsZWN0aW9ucyA9IHNldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJtYXBwaW5nc1wiLCBmb3VuZElkeCA8IDAgPyBnZXRJbihbYWN0aW9uLmNvbGxlY3Rpb24sIFwibWFwcGluZ3NcIl0sIHN0YXRlLmNvbGxlY3Rpb25zKS5sZW5ndGggOiBmb3VuZElkeF0sXG4gICAgbmV3VmFyaWFibGVEZXNjKGFjdGlvbi5wcm9wZXJ0eUZpZWxkLCBhY3Rpb24uaW1wb3J0ZWRGaWVsZCksIHN0YXRlLmNvbGxlY3Rpb25zKTtcblxuXG4gIHJldHVybiB7Li4uc3RhdGUsIGNvbGxlY3Rpb25zOiBuZXdDb2xsZWN0aW9uc307XG59O1xuXG5jb25zdCBjbGVhckZpZWxkTWFwcGluZyA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IGZvdW5kSWR4ID0gZ2V0TWFwcGluZ0luZGV4KHN0YXRlLCBhY3Rpb24pO1xuICBpZiAoZm91bmRJZHggPCAwKSB7IHJldHVybiBzdGF0ZTsgfVxuXG4gIGNvbnN0IGN1cnJlbnQgPSBnZXRJbihbYWN0aW9uLmNvbGxlY3Rpb24sIFwibWFwcGluZ3NcIiwgZm91bmRJZHgsIFwidmFyaWFibGVcIl0sIHN0YXRlLmNvbGxlY3Rpb25zKVxuICAgIC5maWx0ZXIoKG0sIGkpID0+IGkgIT09IGFjdGlvbi5jbGVhckluZGV4KTtcblxuICBsZXQgbmV3Q29sbGVjdGlvbnM7XG4gIGlmIChjdXJyZW50Lmxlbmd0aCA+IDApIHtcbiAgICBuZXdDb2xsZWN0aW9ucyA9IHNldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJtYXBwaW5nc1wiLCBmb3VuZElkeCwgXCJ2YXJpYWJsZVwiXSwgY3VycmVudCwgc3RhdGUuY29sbGVjdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG5ld01hcHBpbmdzID0gZ2V0SW4oW2FjdGlvbi5jb2xsZWN0aW9uLCBcIm1hcHBpbmdzXCJdLCBzdGF0ZS5jb2xsZWN0aW9ucylcbiAgICAgIC5maWx0ZXIoKG0sIGkpID0+IGkgIT09IGZvdW5kSWR4KTtcbiAgICBuZXdDb2xsZWN0aW9ucyA9IHNldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJtYXBwaW5nc1wiXSwgbmV3TWFwcGluZ3MsIHN0YXRlLmNvbGxlY3Rpb25zKTtcbiAgfVxuXG5cbiAgcmV0dXJuIHsuLi5zdGF0ZSwgY29sbGVjdGlvbnM6IG5ld0NvbGxlY3Rpb25zfTtcbn07XG5cbmNvbnN0IHNldERlZmF1bHRWYWx1ZSA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IGZvdW5kSWR4ID0gZ2V0TWFwcGluZ0luZGV4KHN0YXRlLCBhY3Rpb24pO1xuICBpZiAoZm91bmRJZHggPiAtMSkge1xuICAgIGNvbnN0IG5ld0NvbGxlY3Rpb25zID0gc2V0SW4oW2FjdGlvbi5jb2xsZWN0aW9uLCBcIm1hcHBpbmdzXCIsIGZvdW5kSWR4LCBcImRlZmF1bHRWYWx1ZVwiXSwgYWN0aW9uLnZhbHVlLCBzdGF0ZS5jb2xsZWN0aW9ucyk7XG4gICAgcmV0dXJuIHsuLi5zdGF0ZSwgY29sbGVjdGlvbnM6IG5ld0NvbGxlY3Rpb25zfTtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn07XG5cbmNvbnN0IHNldEZpZWxkQ29uZmlybWF0aW9uID0gKHN0YXRlLCBhY3Rpb24sIHZhbHVlKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnQgPSAoZ2V0SW4oW2FjdGlvbi5jb2xsZWN0aW9uLCBcIm1hcHBpbmdzXCJdLCBzdGF0ZS5jb2xsZWN0aW9ucykgfHwgW10pXG4gICAgLm1hcCgodm0pID0+ICh7Li4udm0sIGNvbmZpcm1lZDogYWN0aW9uLnByb3BlcnR5RmllbGQgPT09IHZtLnByb3BlcnR5ID8gdmFsdWUgOiB2bS5jb25maXJtZWR9KSk7XG4gIGxldCBuZXdDb2xsZWN0aW9ucyA9IHNldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJtYXBwaW5nc1wiXSwgY3VycmVudCwgc3RhdGUuY29sbGVjdGlvbnMpO1xuXG4gIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgIGNvbnN0IGNvbmZpcm1lZFZhcmlhYmxlTmFtZXMgPSBjdXJyZW50Lm1hcCgobSkgPT4gbS52YXJpYWJsZS5tYXAoKHYpID0+IHYudmFyaWFibGVOYW1lKSkucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiKSk7XG4gICAgY29uc3QgbmV3SWdub3JlZENvbHVtcyA9IGdldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJpZ25vcmVkQ29sdW1uc1wiXSwgc3RhdGUuY29sbGVjdGlvbnMpXG4gICAgICAuZmlsdGVyKChpYykgPT4gY29uZmlybWVkVmFyaWFibGVOYW1lcy5pbmRleE9mKGljKSA8IDApO1xuICAgIG5ld0NvbGxlY3Rpb25zID0gc2V0SW4oW2FjdGlvbi5jb2xsZWN0aW9uLCBcImlnbm9yZWRDb2x1bW5zXCJdLCBuZXdJZ25vcmVkQ29sdW1zLCBuZXdDb2xsZWN0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gey4uLnN0YXRlLCBjb2xsZWN0aW9uczogbmV3Q29sbGVjdGlvbnN9O1xufTtcblxuY29uc3Qgc2V0VmFsdWVNYXBwaW5nID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgZm91bmRJZHggPSBnZXRNYXBwaW5nSW5kZXgoc3RhdGUsIGFjdGlvbik7XG5cbiAgaWYgKGZvdW5kSWR4ID4gLTEpIHtcbiAgICBjb25zdCBuZXdDb2xsZWN0aW9ucyA9IHNldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJtYXBwaW5nc1wiLCBmb3VuZElkeCwgXCJ2YWx1ZU1hcHBpbmdzXCIsIGFjdGlvbi50aW1WYWx1ZV0sXG4gICAgICBhY3Rpb24ubWFwVmFsdWUsIHN0YXRlLmNvbGxlY3Rpb25zKTtcbiAgICByZXR1cm4gey4uLnN0YXRlLCBjb2xsZWN0aW9uczogbmV3Q29sbGVjdGlvbnN9O1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn07XG5cbmNvbnN0IHRvZ2dsZUlnbm9yZWRDb2x1bW4gPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBsZXQgY3VycmVudCA9IGdldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJpZ25vcmVkQ29sdW1uc1wiXSwgc3RhdGUuY29sbGVjdGlvbnMpO1xuXG4gIGlmIChjdXJyZW50LmluZGV4T2YoYWN0aW9uLnZhcmlhYmxlTmFtZSkgPCAwKSB7XG4gICAgY3VycmVudC5wdXNoKGFjdGlvbi52YXJpYWJsZU5hbWUpO1xuICB9IGVsc2Uge1xuICAgIGN1cnJlbnQgPSBjdXJyZW50LmZpbHRlcigoYykgPT4gYyAhPT0gYWN0aW9uLnZhcmlhYmxlTmFtZSk7XG4gIH1cblxuICByZXR1cm4gey4uLnN0YXRlLCBjb2xsZWN0aW9uczogc2V0SW4oW2FjdGlvbi5jb2xsZWN0aW9uLCBcImlnbm9yZWRDb2x1bW5zXCJdLCBjdXJyZW50LCBzdGF0ZS5jb2xsZWN0aW9ucykgfTtcbn07XG5cbmNvbnN0IGFkZEN1c3RvbVByb3BlcnR5ID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgY3VycmVudCA9IGdldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJjdXN0b21Qcm9wZXJ0aWVzXCJdLCBzdGF0ZS5jb2xsZWN0aW9ucyk7XG4gIGNvbnN0IG5ld0NvbGxlY3Rpb25zID0gc2V0SW4oW2FjdGlvbi5jb2xsZWN0aW9uLCBcImN1c3RvbVByb3BlcnRpZXNcIiwgY3VycmVudC5sZW5ndGhdLCB7bmFtZTogYWN0aW9uLnByb3BlcnR5RmllbGQsIHR5cGU6IGFjdGlvbi5wcm9wZXJ0eVR5cGV9LCBzdGF0ZS5jb2xsZWN0aW9ucyk7XG5cbiAgcmV0dXJuIHsuLi5zdGF0ZSwgY29sbGVjdGlvbnM6IG5ld0NvbGxlY3Rpb25zfTtcbn07XG5cbmNvbnN0IHJlbW92ZUN1c3RvbVByb3BlcnR5ID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgZm91bmRJZHggPSBnZXRNYXBwaW5nSW5kZXgoc3RhdGUsIGFjdGlvbik7XG5cbiAgY29uc3QgY3VycmVudCA9IGdldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJjdXN0b21Qcm9wZXJ0aWVzXCJdLCBzdGF0ZS5jb2xsZWN0aW9ucylcbiAgICAuZmlsdGVyKChjcCkgPT4gY3AubmFtZSAhPT0gYWN0aW9uLnByb3BlcnR5RmllbGQpO1xuXG4gIGxldCBuZXdDb2xsZWN0aW9ucyA9IHNldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJjdXN0b21Qcm9wZXJ0aWVzXCJdLCBjdXJyZW50LCBzdGF0ZS5jb2xsZWN0aW9ucyk7XG5cbiAgaWYgKGZvdW5kSWR4ID4gLTEpIHtcbiAgICBjb25zdCBuZXdNYXBwaW5ncyA9IGdldEluKFthY3Rpb24uY29sbGVjdGlvbiwgXCJtYXBwaW5nc1wiXSwgc3RhdGUuY29sbGVjdGlvbnMpXG4gICAgICAuZmlsdGVyKChtLCBpKSA9PiBpICE9PSBmb3VuZElkeCk7XG4gICAgbmV3Q29sbGVjdGlvbnMgPSBzZXRJbihbYWN0aW9uLmNvbGxlY3Rpb24sIFwibWFwcGluZ3NcIl0sIG5ld01hcHBpbmdzLCBuZXdDb2xsZWN0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gey4uLnN0YXRlLCBjb2xsZWN0aW9uczogbmV3Q29sbGVjdGlvbnN9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc3RhdGU9aW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgXCJGSU5JU0hfVVBMT0FEXCI6XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoc3RhdGUuY29sbGVjdGlvbnMpLmxlbmd0aCA+IDAgP1xuICAgICAgICBzdGF0ZSA6XG4gICAgICAgIHsuLi5zdGF0ZSwgY29sbGVjdGlvbnM6IGFjdGlvbi5kYXRhLmNvbGxlY3Rpb25zLnJlZHVjZShzY2FmZm9sZENvbGxlY3Rpb25NYXBwaW5ncywge30pfTtcblxuICAgIGNhc2UgXCJNQVBfQ09MTEVDVElPTl9BUkNIRVRZUEVcIjpcbiAgICAgIHJldHVybiBtYXBDb2xsZWN0aW9uQXJjaGV0eXBlKHN0YXRlLCBhY3Rpb24pO1xuXG4gICAgY2FzZSBcIkNPTkZJUk1fQ09MTEVDVElPTl9BUkNIRVRZUEVfTUFQUElOR1NcIjpcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIGNvbmZpcm1lZDogdHJ1ZX07XG5cbiAgICBjYXNlIFwiU0VUX0ZJRUxEX01BUFBJTkdcIjpcbiAgICAgIHJldHVybiB1cHNlcnRGaWVsZE1hcHBpbmcoc3RhdGUsIGFjdGlvbik7XG5cbiAgICBjYXNlIFwiQ0xFQVJfRklFTERfTUFQUElOR1wiOlxuICAgICAgcmV0dXJuIGNsZWFyRmllbGRNYXBwaW5nKHN0YXRlLCBhY3Rpb24pO1xuXG4gICAgY2FzZSBcIlNFVF9ERUZBVUxUX1ZBTFVFXCI6XG4gICAgICByZXR1cm4gc2V0RGVmYXVsdFZhbHVlKHN0YXRlLCBhY3Rpb24pO1xuXG4gICAgY2FzZSBcIkNPTkZJUk1fRklFTERfTUFQUElOR1NcIjpcbiAgICAgIHJldHVybiBzZXRGaWVsZENvbmZpcm1hdGlvbihzdGF0ZSwgYWN0aW9uLCB0cnVlKTtcblxuICAgIGNhc2UgXCJVTkNPTkZJUk1fRklFTERfTUFQUElOR1NcIjpcbiAgICAgIHJldHVybiBzZXRGaWVsZENvbmZpcm1hdGlvbihzdGF0ZSwgYWN0aW9uLCBmYWxzZSk7XG5cbiAgICBjYXNlIFwiU0VUX1ZBTFVFX01BUFBJTkdcIjpcbiAgICAgIHJldHVybiBzZXRWYWx1ZU1hcHBpbmcoc3RhdGUsIGFjdGlvbik7XG5cbiAgICBjYXNlIFwiVE9HR0xFX0lHTk9SRURfQ09MVU1OXCI6XG4gICAgICByZXR1cm4gdG9nZ2xlSWdub3JlZENvbHVtbihzdGF0ZSwgYWN0aW9uKTtcblxuICAgIGNhc2UgXCJBRERfQ1VTVE9NX1BST1BFUlRZXCI6XG4gICAgICByZXR1cm4gYWRkQ3VzdG9tUHJvcGVydHkoc3RhdGUsIGFjdGlvbik7XG5cbiAgICBjYXNlIFwiUkVNT1ZFX0NVU1RPTV9QUk9QRVJUWVwiOlxuICAgICAgcmV0dXJuIHJlbW92ZUN1c3RvbVByb3BlcnR5KHN0YXRlLCBhY3Rpb24pO1xuXG4gICAgY2FzZSBcIlBVQkxJU0hfU1RBUlRFRFwiOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHB1Ymxpc2hpbmc6IHRydWVcbiAgICAgIH07XG4gICAgY2FzZSBcIlBVQkxJU0hfRklOSVNIRURcIjpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBwdWJsaXNoaW5nOiBmYWxzZVxuICAgICAgfTtcbiAgfVxuICByZXR1cm4gc3RhdGU7XG59XG4iLCJjb25zdCBpbml0aWFsU3RhdGUgPSB7XG4gIHNob3dGaWxlSXNVcGxvYWRlZE1lc3NhZ2U6IHRydWUsXG4gIHNob3dDb2xsZWN0aW9uc0FyZUNvbm5lY3RlZE1lc3NhZ2U6IHRydWVcbn07XG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc3RhdGU9aW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgXCJUT0dHTEVfTUVTU0FHRVwiOlxuICAgICAgY29uc3QgbmV3U3RhdGUgPSB7Li4uc3RhdGV9O1xuICAgICAgbmV3U3RhdGVbYWN0aW9uLm1lc3NhZ2VJZF0gPSAhc3RhdGVbYWN0aW9uLm1lc3NhZ2VJZF1cbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn0iLCJjb25zdCBpbml0aWFsU3RhdGUgPSB7XG4gIHVzZXJJZDogdW5kZWZpbmVkLFxuICBteVZyZXM6IHVuZGVmaW5lZCxcbiAgdnJlczoge31cbn07XG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc3RhdGU9aW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgXCJMT0dJTlwiOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXNlcklkOiBhY3Rpb24uZGF0YSxcbiAgICAgICAgbXlWcmVzOiBhY3Rpb24udnJlRGF0YSA/IGFjdGlvbi52cmVEYXRhLm1pbmUgOiB7fSxcbiAgICAgICAgdnJlczogYWN0aW9uLnZyZURhdGEgPyBhY3Rpb24udnJlRGF0YS5wdWJsaWMgOiB7fVxuICAgICAgfTtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBSb3V0ZXIsIFJvdXRlLCBoYXNoSGlzdG9yeSwgSW5kZXhSb3V0ZSB9IGZyb20gJ3JlYWN0LXJvdXRlcidcbmltcG9ydCB7IFByb3ZpZGVyLCBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCJcbmltcG9ydCBzdG9yZSBmcm9tIFwiLi9zdG9yZVwiO1xuaW1wb3J0IGFjdGlvbnMgZnJvbSBcIi4vYWN0aW9uc1wiO1xuXG5pbXBvcnQgc3RhdGVUb01hcERhdGFQcm9wcyBmcm9tIFwiLi9jb21wb25lbnRzL3JlYWN0LXJlZHV4LWNvbm5lY3QvY29ubmVjdC1kYXRhXCI7XG5pbXBvcnQgc3RhdGVUb1BhZ2VQcm9wcyBmcm9tIFwiLi9jb21wb25lbnRzL3JlYWN0LXJlZHV4LWNvbm5lY3QvcGFnZVwiO1xuaW1wb3J0IHN0YXRlVG9GaXJzdFVwbG9hZFByb3BzIGZyb20gXCIuL2NvbXBvbmVudHMvcmVhY3QtcmVkdXgtY29ubmVjdC9maXJzdC11cGxvYWRcIjtcbmltcG9ydCBzdGF0ZVRvQ29sbGVjdGlvbk92ZXJ2aWV3IGZyb20gXCIuL2NvbXBvbmVudHMvcmVhY3QtcmVkdXgtY29ubmVjdC9jb2xsZWN0aW9uLW92ZXJ2aWV3XCI7XG5pbXBvcnQgc3RhdGVUb01hcEFyY2hldHlwZXMgZnJvbSBcIi4vY29tcG9uZW50cy9yZWFjdC1yZWR1eC1jb25uZWN0L2Nvbm5lY3QtdG8tYXJjaGV0eXBlXCI7XG5cbmltcG9ydCBGaXJzdFVwbG9hZCBmcm9tIFwiLi9jb21wb25lbnRzL2ZpcnN0VXBsb2FkLmpzeFwiO1xuaW1wb3J0IFBhZ2UgZnJvbSBcIi4vY29tcG9uZW50cy9wYWdlLmpzeFwiO1xuaW1wb3J0IENvbGxlY3Rpb25PdmVydmlldyBmcm9tIFwiLi9jb21wb25lbnRzL2NvbGxlY3Rpb24tb3ZlcnZpZXdcIjtcbmltcG9ydCBDb25uZWN0VG9BcmNoZXR5cGUgZnJvbSBcIi4vY29tcG9uZW50cy9jb25uZWN0LXRvLWFyY2hldHlwZVwiO1xuaW1wb3J0IENvbm5lY3REYXRhIGZyb20gXCIuL2NvbXBvbmVudHMvY29ubmVjdC1kYXRhXCI7XG5cblxudmFyIHVybHMgPSB7XG4gIG1hcERhdGEoKSB7XG4gICAgcmV0dXJuIFwiL21hcGRhdGFcIjtcbiAgfSxcbiAgbWFwQXJjaGV0eXBlcygpIHtcbiAgICByZXR1cm4gXCIvbWFwYXJjaGV0eXBlc1wiO1xuICB9LFxuICBjb2xsZWN0aW9uc092ZXJ2aWV3KCkge1xuICAgIHJldHVybiBcIi9jb2xsZWN0aW9ucy1vdmVydmlld1wiO1xuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGVUbyhrZXksIGFyZ3MpIHtcbiAgaGFzaEhpc3RvcnkucHVzaCh1cmxzW2tleV0uYXBwbHkobnVsbCwgYXJncykpO1xufVxuXG5jb25zdCBjb25uZWN0Q29tcG9uZW50ID0gKHN0YXRlVG9Qcm9wcykgPT4gY29ubmVjdChzdGF0ZVRvUHJvcHMsIGRpc3BhdGNoID0+IGFjdGlvbnMobmF2aWdhdGVUbywgZGlzcGF0Y2gpKTtcblxuY29uc3Qgcm91dGVyID0gKFxuICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICA8Um91dGVyIGhpc3Rvcnk9e2hhc2hIaXN0b3J5fT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL1wiIGNvbXBvbmVudD17Y29ubmVjdENvbXBvbmVudChzdGF0ZVRvUGFnZVByb3BzKShQYWdlKX0+XG4gICAgICAgIDxJbmRleFJvdXRlIGNvbXBvbmVudD17Y29ubmVjdENvbXBvbmVudChzdGF0ZVRvRmlyc3RVcGxvYWRQcm9wcykoRmlyc3RVcGxvYWQpfS8+XG4gICAgICAgIDxSb3V0ZSBwYXRoPXt1cmxzLmNvbGxlY3Rpb25zT3ZlcnZpZXcoKX0gY29tcG9uZW50cz17Y29ubmVjdENvbXBvbmVudChzdGF0ZVRvQ29sbGVjdGlvbk92ZXJ2aWV3KShDb2xsZWN0aW9uT3ZlcnZpZXcpfSAvPlxuICAgICAgICA8Um91dGUgcGF0aD17dXJscy5tYXBBcmNoZXR5cGVzKCl9IGNvbXBvbmVudHM9e2Nvbm5lY3RDb21wb25lbnQoc3RhdGVUb01hcEFyY2hldHlwZXMpKENvbm5lY3RUb0FyY2hldHlwZSl9IC8+XG4gICAgICAgIDxSb3V0ZSBwYXRoPXt1cmxzLm1hcERhdGEoKX0gY29tcG9uZW50cz17Y29ubmVjdENvbXBvbmVudChzdGF0ZVRvTWFwRGF0YVByb3BzKShDb25uZWN0RGF0YSl9IC8+XG4gICAgICA8L1JvdXRlPlxuICAgIDwvUm91dGVyPlxuICA8L1Byb3ZpZGVyPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xuZXhwb3J0IHsgdXJscyB9OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldHVwTW9ja3MoeGhybW9jaywgb3JpZykge1xuICB4aHJtb2NrXG4gICAgLmdldChcImh0dHA6Ly90ZXN0LnJlcG9zaXRvcnkuaHV5Z2Vucy5rbmF3Lm5sL3YyLjEvbWV0YWRhdGEvQWRtaW5cIiwgZnVuY3Rpb24gKHJlcSwgcmVzcCkge1xuICAgICAgcmV0dXJuIHJlc3BcbiAgICAgICAgLnN0YXR1cygyMDApXG4gICAgICAgIC5ib2R5KGB7XG4gICAgICAgICAgXCJwZXJzb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImhhc1dyaXR0ZW5cIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicmVsYXRpb25cIixcbiAgICAgICAgICAgICAgXCJxdWlja3NlYXJjaFwiOiBcIi92Mi4xL2RvbWFpbi9kb2N1bWVudHMvYXV0b2NvbXBsZXRlXCIsXG4gICAgICAgICAgICAgIFwicmVsYXRpb25cIjoge1xuICAgICAgICAgICAgICAgIFwiZGlyZWN0aW9uXCI6IFwiT1VUXCIsXG4gICAgICAgICAgICAgICAgXCJvdXROYW1lXCI6IFwiaGFzV3JpdHRlblwiLFxuICAgICAgICAgICAgICAgIFwiaW5OYW1lXCI6IFwid2FzV3JpdHRlbkJ5XCIsXG4gICAgICAgICAgICAgICAgXCJ0YXJnZXRDb2xsZWN0aW9uXCI6IFwiZG9jdW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgXCJyZWxhdGlvbkNvbGxlY3Rpb25cIjogXCJyZWxhdGlvbnNcIixcbiAgICAgICAgICAgICAgICBcInJlbGF0aW9uVHlwZUlkXCI6IFwiYmJhMTBkMzctODZjYy00ZjFmLWJhMmQtMDE2YWYyYjIxYWE0XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNSZWxhdGVkVG9cIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicmVsYXRpb25cIixcbiAgICAgICAgICAgICAgXCJxdWlja3NlYXJjaFwiOiBcIi92Mi4xL2RvbWFpbi9wZXJzb25zL2F1dG9jb21wbGV0ZVwiLFxuICAgICAgICAgICAgICBcInJlbGF0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICBcImRpcmVjdGlvblwiOiBcIk9VVFwiLFxuICAgICAgICAgICAgICAgIFwib3V0TmFtZVwiOiBcImlzUmVsYXRlZFRvXCIsXG4gICAgICAgICAgICAgICAgXCJpbk5hbWVcIjogXCJpc1JlbGF0ZWRUb1wiLFxuICAgICAgICAgICAgICAgIFwidGFyZ2V0Q29sbGVjdGlvblwiOiBcInBlcnNvbnNcIixcbiAgICAgICAgICAgICAgICBcInJlbGF0aW9uQ29sbGVjdGlvblwiOiBcInJlbGF0aW9uc1wiLFxuICAgICAgICAgICAgICAgIFwicmVsYXRpb25UeXBlSWRcIjogXCJjYmExMGQzNy04NmNjLTRmMWYtYmEyZC0wMTZhZjJiMjFhYTVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBcImRvY3VtZW50c1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9YCk7XG4gICAgfSlcbiAgICAuZ2V0KFwiaHR0cDovL3Rlc3QucmVwb3NpdG9yeS5odXlnZW5zLmtuYXcubmwvdjIuMS9zeXN0ZW0vdXNlcnMvbWUvdnJlc1wiLCBmdW5jdGlvbihyZXEsIHJlc3ApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZmV0Y2gtbXktdnJlc1wiKTtcbiAgICAgIHJldHVybiByZXNwXG4gICAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgICAuYm9keShge1xuICAgICAgICAgIFwibWluZVwiOiB7XG4gICAgICAgICAgICBcIm1pZ3JhbnRfc3RlZWtwcm9lZl9tYXN0ZXJkYiAoNikueGxzeFwiOiB7XG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1pZ3JhbnRfc3RlZWtwcm9lZl9tYXN0ZXJkYiAoNikueGxzeFwiLFxuICAgICAgICAgICAgICBcInB1Ymxpc2hlZFwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ0ZXN0ZXJkZXRlc3RcIjoge1xuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0ZXN0ZXJkZXRlc3RcIixcbiAgICAgICAgICAgICAgXCJwdWJsaXNoZWRcIjogZmFsc2UsXG4gICAgICAgICAgICAgIFwicm1sVXJpXCI6IFwiPDxUaGUgZ2V0IHJhdyBkYXRhIHVybCB0aGF0IHRoZSBzZXJ2ZXIgcHJvdmlkZXM+PlwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInB1YmxpY1wiOiB7XG4gICAgICAgICAgICBcIldvbWVuV3JpdGVyc1wiOiB7XG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIldvbWVuV3JpdGVyc1wiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9YCk7XG4gICAgfSlcbiAgICAucG9zdChcImh0dHA6Ly90ZXN0LnJlcG9zaXRvcnkuaHV5Z2Vucy5rbmF3Lm5sL3YyLjEvYnVsay11cGxvYWRcIiwgZnVuY3Rpb24gKHJlcSwgcmVzcCkge1xuICAgICAgY29uc29sZS5sb2coXCJidWxrLXVwbG9hZFwiKTtcbiAgICAgIHJldHVybiByZXNwXG4gICAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgICAuaGVhZGVyKFwiTG9jYXRpb25cIiwgXCI8PFRoZSBnZXQgcmF3IGRhdGEgdXJsIHRoYXQgdGhlIHNlcnZlciBwcm92aWRlcz4+XCIpO1xuICAgIH0pXG4gICAgLnBvc3QoXCI8PFRoZSBzYXZlIG1hcHBpbmcgdXJsIHRoYXQgdGhlIHNlcnZlciBwcm92aWRlcz4+XCIsIGZ1bmN0aW9uIChyZXEsIHJlc3ApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwic2F2ZSBtYXBwaW5nXCIsIHJlcS5ib2R5KCkpO1xuICAgICAgcmV0dXJuIHJlc3BcbiAgICAgICAgLnN0YXR1cygyMDQpO1xuICAgIH0pXG4gICAgLnBvc3QoXCI8PFRoZSBleGVjdXRlIG1hcHBpbmcgdXJsIHRoYXQgdGhlIHNlcnZlciBwcm92aWRlcz4+XCIsIGZ1bmN0aW9uIChyZXEsIHJlc3ApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZXhlY3V0ZSBtYXBwaW5nIHdpdGggZmFpbHVyZXNcIiwgcmVxLmJvZHkoKSk7XG4gICAgICByZXR1cm4gcmVzcFxuICAgICAgICAuc3RhdHVzKDIwMClcbiAgICAgICAgLmJvZHkoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICAgIH0pKTtcbiAgICB9KVxuICAgIC5nZXQoXCI8PFRoZSBnZXQgcmF3IGRhdGEgdXJsIHRoYXQgdGhlIHNlcnZlciBwcm92aWRlcz4+XCIsIGZ1bmN0aW9uIChyZXEsIHJlc3ApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IHJhdyBkYXRhXCIpO1xuICAgICAgcmV0dXJuIHJlc3BcbiAgICAgICAgLnN0YXR1cygyMDApXG4gICAgICAgIC5ib2R5KEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICB2cmU6IFwidGhldnJlbmFtZVwiLFxuICAgICAgICAgIHNhdmVNYXBwaW5nOiBcIjw8VGhlIHNhdmUgbWFwcGluZyB1cmwgdGhhdCB0aGUgc2VydmVyIHByb3ZpZGVzPj5cIixcbiAgICAgICAgICBleGVjdXRlTWFwcGluZzogXCI8PFRoZSBleGVjdXRlIG1hcHBpbmcgdXJsIHRoYXQgdGhlIHNlcnZlciBwcm92aWRlcz4+XCIsXG4gICAgICAgICAgY29sbGVjdGlvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJtb2NrcGVyc29uc1wiLFxuICAgICAgICAgICAgICB2YXJpYWJsZXM6IFtcIklEXCIsIFwiVm9vcm5hYW1cIiwgXCJ0dXNzZW52b2Vnc2VsXCIsIFwiQWNodGVybmFhbVwiLCBcIkdlc2NocmV2ZW5Eb2N1bWVudFwiLCBcIkdlbm9lbWQgaW5cIiwgXCJJcyBnZXRyb3V3ZCBtZXRcIl0sXG4gICAgICAgICAgICAgIGRhdGE6IFwiPDx1cmwgZm9yIHBlcnNvbiBkYXRhPj5cIixcbiAgICAgICAgICAgICAgZGF0YVdpdGhFcnJvcnM6IFwiPDx1cmwgZm9yIHBlcnNvbiBkYXRhIHdpdGggZXJyb3JzPj5cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJtb2NrZG9jdW1lbnRzXCIsXG4gICAgICAgICAgICAgIHZhcmlhYmxlczogW1widGl0ZWxcIiwgXCJkYXR1bVwiLCBcInJlZmVyZW50aWVcIiwgXCJ1cmxcIl0sXG4gICAgICAgICAgICAgIGRhdGE6IFwiPDx1cmwgZm9yIGRvY3VtZW50IGRhdGE+PlwiLFxuICAgICAgICAgICAgICBkYXRhV2l0aEVycm9yczogXCI8PHVybCBmb3IgZG9jdW1lbnQgZGF0YSB3aXRoIGVycm9ycz4+XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pKTtcbiAgICB9KVxuICAgIC5nZXQoXCI8PHVybCBmb3IgcGVyc29uIGRhdGE+PlwiLCBmdW5jdGlvbiAocmVxLCByZXNwKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImdldCBwZXJzb24gaXRlbXMgZGF0YVwiKTtcbiAgICAgIHJldHVybiByZXNwXG4gICAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgICAuYm9keShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgXCJfbmV4dFwiOiBcIjw8bW9yZSBkYXRhPj5cIixcbiAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFsdWVzOiB7XG4gICAgICAgICAgICAgICAgICBcIklEXCI6IFwiMVwiLFxuICAgICAgICAgICAgICAgICAgXCJWb29ybmFhbVwiOiBcIlZvb3JuYWFtXCIsXG4gICAgICAgICAgICAgICAgICBcInR1c3NlbnZvZWdzZWxcIjogXCJ0dXNzZW52b2Vnc2VsXCIsXG4gICAgICAgICAgICAgICAgICBcIkFjaHRlcm5hYW1cIjogXCJBY2h0ZXJuYWFtXCIsXG4gICAgICAgICAgICAgICAgICBcIkdlc2NocmV2ZW5Eb2N1bWVudFwiOiBcIkdlc2NocmV2ZW5Eb2N1bWVudFwiLFxuICAgICAgICAgICAgICAgICAgXCJHZW5vZW1kIGluXCI6IFwiR2Vub2VtZCBpblwiLFxuICAgICAgICAgICAgICAgICAgXCJJcyBnZXRyb3V3ZCBtZXRcIjogXCJJcyBnZXRyb3V3ZCBtZXRcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yczoge31cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbHVlczoge1xuICAgICAgICAgICAgICAgICAgXCJJRFwiOiBcIjJcIixcbiAgICAgICAgICAgICAgICAgIFwiVm9vcm5hYW1cIjogXCJWb29ybmFhbVwiLFxuICAgICAgICAgICAgICAgICAgXCJ0dXNzZW52b2Vnc2VsXCI6IFwidHVzc2Vudm9lZ3NlbFwiLFxuICAgICAgICAgICAgICAgICAgXCJBY2h0ZXJuYWFtXCI6IFwiQWNodGVybmFhbVwiLFxuICAgICAgICAgICAgICAgICAgXCJHZXNjaHJldmVuRG9jdW1lbnRcIjogXCJHZXNjaHJldmVuRG9jdW1lbnRcIixcbiAgICAgICAgICAgICAgICAgIFwiR2Vub2VtZCBpblwiOiBcIkdlbm9lbWQgaW5cIixcbiAgICAgICAgICAgICAgICAgIFwiSXMgZ2V0cm91d2QgbWV0XCI6IFwiSXMgZ2V0cm91d2QgbWV0XCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcnM6IHt9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSkpO1xuICAgIH0pXG4gICAgLmdldChcIjw8dXJsIGZvciBwZXJzb24gZGF0YSB3aXRoIGVycm9ycz4+XCIsIGZ1bmN0aW9uIChyZXEsIHJlc3ApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IHBlcnNvbiBpdGVtcyBkYXRhIHdpdGggZXJyb3JzXCIpO1xuICAgICAgcmV0dXJuIHJlc3BcbiAgICAgICAgLnN0YXR1cygyMDApXG4gICAgICAgIC5ib2R5KEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBcIl9uZXh0XCI6IFwiPDxtb3JlIGRhdGE+PlwiLFxuICAgICAgICAgIFwiaXRlbXNcIjogW3tcbiAgICAgICAgICAgIHZhbHVlczoge1xuICAgICAgICAgICAgICBcIklEXCI6IFwiMVwiLFxuICAgICAgICAgICAgICBcIlZvb3JuYWFtXCI6IFwiVm9vcm5hYW1cIixcbiAgICAgICAgICAgICAgXCJ0dXNzZW52b2Vnc2VsXCI6IFwidHVzc2Vudm9lZ3NlbFwiLFxuICAgICAgICAgICAgICBcIkFjaHRlcm5hYW1cIjogXCJBY2h0ZXJuYWFtXCIsXG4gICAgICAgICAgICAgIFwiR2VzY2hyZXZlbkRvY3VtZW50XCI6IFwiR2VzY2hyZXZlbkRvY3VtZW50XCIsXG4gICAgICAgICAgICAgIFwiR2Vub2VtZCBpblwiOiBcIkdlbm9lbWQgaW5cIixcbiAgICAgICAgICAgICAgXCJJcyBnZXRyb3V3ZCBtZXRcIjogXCJJcyBnZXRyb3V3ZCBtZXRcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcnM6IHtcbiAgICAgICAgICAgICAgXCJWb29ybmFhbVwiOiBcIndpbGwgbm90IGRvXCIsXG4gICAgICAgICAgICAgIFwiQWNodGVybmFhbVwiOiBcImFsc28gZmFpbGVkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XVxuICAgICAgICB9KSk7XG4gICAgfSlcbiAgICAuZ2V0KFwiPDxtb3JlIGRhdGE+PlwiLCBmdW5jdGlvbiAocmVxLCByZXNwKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImdldCBwZXJzb24gaXRlbXMgZGF0YVwiKTtcbiAgICAgIHJldHVybiByZXNwXG4gICAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgICAuYm9keShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZhbHVlczoge1xuICAgICAgICAgICAgICAgIFwiSURcIjogXCIzXCIsXG4gICAgICAgICAgICAgICAgXCJWb29ybmFhbVwiOiBcIlZvb3JuYWFtXCIsXG4gICAgICAgICAgICAgICAgXCJ0dXNzZW52b2Vnc2VsXCI6IFwidHVzc2Vudm9lZ3NlbFwiLFxuICAgICAgICAgICAgICAgIFwiQWNodGVybmFhbVwiOiBcIkFjaHRlcm5hYW1cIixcbiAgICAgICAgICAgICAgICBcIkdlc2NocmV2ZW5Eb2N1bWVudFwiOiBcIkdlc2NocmV2ZW5Eb2N1bWVudFwiLFxuICAgICAgICAgICAgICAgIFwiR2Vub2VtZCBpblwiOiBcIkdlbm9lbWQgaW5cIixcbiAgICAgICAgICAgICAgICBcIklzIGdldHJvdXdkIG1ldFwiOiBcIklzIGdldHJvdXdkIG1ldFwiLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBlcnJvcnM6IHt9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YWx1ZXM6IHtcbiAgICAgICAgICAgICAgICBcIklEXCI6IFwiNFwiLFxuICAgICAgICAgICAgICAgIFwiVm9vcm5hYW1cIjogXCJWb29ybmFhbVwiLFxuICAgICAgICAgICAgICAgIFwidHVzc2Vudm9lZ3NlbFwiOiBcInR1c3NlbnZvZWdzZWxcIixcbiAgICAgICAgICAgICAgICBcIkFjaHRlcm5hYW1cIjogXCJBY2h0ZXJuYWFtXCIsXG4gICAgICAgICAgICAgICAgXCJHZXNjaHJldmVuRG9jdW1lbnRcIjogXCJHZXNjaHJldmVuRG9jdW1lbnRcIixcbiAgICAgICAgICAgICAgICBcIkdlbm9lbWQgaW5cIjogXCJHZW5vZW1kIGluXCIsXG4gICAgICAgICAgICAgICAgXCJJcyBnZXRyb3V3ZCBtZXRcIjogXCJJcyBnZXRyb3V3ZCBtZXRcIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZXJyb3JzOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSkpO1xuICAgIH0pXG4gICAgLmdldChcIjw8dXJsIGZvciBkb2N1bWVudCBkYXRhPj5cIiwgZnVuY3Rpb24gKHJlcSwgcmVzcCkge1xuICAgICAgY29uc29sZS5sb2coXCJnZXQgZG9jdW1lbnQgaXRlbXMgZGF0YVwiKTtcbiAgICAgIHJldHVybiByZXNwXG4gICAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgICAuYm9keShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJzb21lQ29sbGVjdGlvblwiLFxuICAgICAgICAgICAgXCJ2YXJpYWJsZXNcIjogW1widGltX2lkXCIsIFwidmFyMVwiLCBcInZhcjJcIl0sXG4gICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbHVlczoge1xuICAgICAgICAgICAgICAgICAgXCJ0aW1faWRcIjogXCIxXCIsXG4gICAgICAgICAgICAgICAgICBcInRpdGVsXCI6IFwidGl0ZWxcIixcbiAgICAgICAgICAgICAgICAgIFwiZGF0dW1cIjogXCJkYXR1bVwiLFxuICAgICAgICAgICAgICAgICAgXCJyZWZlcmVudGllXCI6IFwicmVmZXJlbnRpZVwiLFxuICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogXCJ1cmxcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yczoge31cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbHVlczoge1xuICAgICAgICAgICAgICAgICAgXCJ0aW1faWRcIjogXCIyXCIsXG4gICAgICAgICAgICAgICAgICBcInRpdGVsXCI6IFwidGl0ZWxcIixcbiAgICAgICAgICAgICAgICAgIFwiZGF0dW1cIjogXCJkYXR1bVwiLFxuICAgICAgICAgICAgICAgICAgXCJyZWZlcmVudGllXCI6IFwicmVmZXJlbnRpZVwiLFxuICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogXCJ1cmxcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yczoge31cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KSk7XG4gICAgfSlcbiAgICAuZ2V0KFwiPDx1cmwgZm9yIGRvY3VtZW50IGRhdGEgd2l0aCBlcnJvcnM+PlwiLCBmdW5jdGlvbiAocmVxLCByZXNwKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImdldCBkb2N1bWVudCBpdGVtcyBkYXRhIHdpdGggZXJyb3JzXCIpO1xuICAgICAgcmV0dXJuIHJlc3BcbiAgICAgICAgLnN0YXR1cygyMDApXG4gICAgICAgIC5ib2R5KEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJzb21lQ29sbGVjdGlvblwiLFxuICAgICAgICAgIFwidmFyaWFibGVzXCI6IFtcInRpbV9pZFwiLCBcInZhcjFcIiwgXCJ2YXIyXCJdLFxuICAgICAgICAgIFwiaXRlbXNcIjogW11cbiAgICAgICAgfSkpO1xuICAgIH0pXG4gICAgLm1vY2soZnVuY3Rpb24gKHJlcSwgcmVzcCkge1xuICAgICAgY29uc29sZS5lcnJvcihcInVubW9ja2VkIHJlcXVlc3RcIiwgcmVxLnVybCgpLCByZXEsIHJlc3ApO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlLCBjb21iaW5lUmVkdWNlcnMsIGNvbXBvc2V9IGZyb20gXCJyZWR1eFwiO1xuaW1wb3J0IHRodW5rTWlkZGxld2FyZSBmcm9tIFwicmVkdXgtdGh1bmtcIjtcblxuaW1wb3J0IHsgcGVyc2lzdCB9IGZyb20gXCIuL3V0aWwvcGVyc2lzdFwiO1xuaW1wb3J0IHJlZHVjZXJzIGZyb20gXCIuL3JlZHVjZXJzXCI7XG5cbmxldCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxuICBjb21iaW5lUmVkdWNlcnMocmVkdWNlcnMpLFxuICBjb21wb3NlKFxuICAgIGFwcGx5TWlkZGxld2FyZShcbiAgICAgIHRodW5rTWlkZGxld2FyZVxuICAgICksXG4gICAgd2luZG93LmRldlRvb2xzRXh0ZW5zaW9uID8gd2luZG93LmRldlRvb2xzRXh0ZW5zaW9uKCkgOiBmID0+IGZcbiAgKVxuKTtcblxuLy8gd2luZG93Lm9uYmVmb3JldW5sb2FkID0gKCkgPT4gcGVyc2lzdChzdG9yZS5nZXRTdGF0ZSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgc3RvcmU7XG4iLCJmdW5jdGlvbiBkZWVwQ2xvbmU5KG9iaikge1xuICAgIHZhciBpLCBsZW4sIHJldDtcblxuICAgIGlmICh0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiIHx8IG9iaiA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgcmV0ID0gW107XG4gICAgICAgIGxlbiA9IG9iai5sZW5ndGg7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgcmV0LnB1c2goICh0eXBlb2Ygb2JqW2ldID09PSBcIm9iamVjdFwiICYmIG9ialtpXSAhPT0gbnVsbCkgPyBkZWVwQ2xvbmU5KG9ialtpXSkgOiBvYmpbaV0gKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldCA9IHt9O1xuICAgICAgICBmb3IgKGkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgcmV0W2ldID0gKHR5cGVvZiBvYmpbaV0gPT09IFwib2JqZWN0XCIgJiYgb2JqW2ldICE9PSBudWxsKSA/IGRlZXBDbG9uZTkob2JqW2ldKSA6IG9ialtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWVwQ2xvbmU5OyIsImltcG9ydCBjbG9uZSBmcm9tIFwiLi9jbG9uZS1kZWVwXCI7XG5cbmNvbnN0IF9nZXRJbiA9IChwYXRoLCBkYXRhKSA9PlxuXHRkYXRhID9cblx0XHRwYXRoLmxlbmd0aCA9PT0gMCA/IGRhdGEgOiBfZ2V0SW4ocGF0aCwgZGF0YVtwYXRoLnNoaWZ0KCldKSA6XG5cdFx0bnVsbDtcblxuXG5cbmNvbnN0IGdldEluID0gKHBhdGgsIGRhdGEpID0+XG5cdF9nZXRJbihjbG9uZShwYXRoKSwgZGF0YSk7XG5cblxuZXhwb3J0IGRlZmF1bHQgZ2V0SW47IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFwcGluZ1RvSnNvbkxkUm1sKG1hcHBpbmcsIHZyZSkge1xuICByZXR1cm4ge1xuICBcdFwiQGNvbnRleHRcIjoge1xuICBcdFx0XCJAdm9jYWJcIjogXCJodHRwOi8vd3d3LnczLm9yZy9ucy9yMnJtbCNcIixcbiAgXHRcdFwicm1sXCI6IFwiaHR0cDovL3NlbXdlYi5tbWxhYi5iZS9ucy9ybWwjXCIsXG4gIFx0XHRcInRpbVwiOiBcImh0dHA6Ly90aW1idWN0b28uY29tL21hcHBpbmcjXCIsXG4gICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNzdWJDbGFzc09mXCI6IHtcbiAgICAgICAgXCJAdHlwZVwiOiBcIkBpZFwiXG4gICAgICB9LFxuICBcdFx0XCJwcmVkaWNhdGVcIjoge1xuICBcdFx0XHRcIkB0eXBlXCI6IFwiQGlkXCJcbiAgXHRcdH0sXG4gICAgICBcInRlcm1UeXBlXCI6IHtcbiAgICAgICAgXCJAdHlwZVwiOiBcIkBpZFwiXG4gICAgICB9LFxuICAgICAgXCJwYXJlbnRUcmlwbGVzTWFwXCI6IHtcbiAgICAgICAgXCJAdHlwZVwiOiBcIkBpZFwiXG4gICAgICB9LFxuICAgICAgXCJjbGFzc1wiOiB7XG4gICAgICAgIFwiQHR5cGVcIjogXCJAaWRcIlxuICAgICAgfVxuICBcdH0sXG4gIFx0XCJAZ3JhcGhcIjogT2JqZWN0LmtleXMobWFwcGluZy5jb2xsZWN0aW9ucykubWFwKGtleSA9PiBtYXBTaGVldChrZXksIG1hcHBpbmcuY29sbGVjdGlvbnNba2V5XSwgdnJlKSlcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWFrZU1hcE5hbWUodnJlLCBsb2NhbE5hbWUpIHtcbiAgcmV0dXJuIGBodHRwOi8vdGltYnVjdG9vLmNvbS9tYXBwaW5nLyR7dnJlfS8ke2xvY2FsTmFtZX1gO1xufVxuXG5mdW5jdGlvbiBtYXBTaGVldChrZXksIHNoZWV0LCB2cmUpIHtcbiAgLy9GSVhNRTogbW92ZSBsb2dpY2FsU291cmNlIGFuZCBzdWJqZWN0TWFwIHVuZGVyIHRoZSBjb250cm9sIG9mIHRoZSBzZXJ2ZXJcbiAgcmV0dXJuIHtcbiAgICBcIkBpZFwiOiBtYWtlTWFwTmFtZSh2cmUsIGtleSksXG4gICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjc3ViQ2xhc3NPZlwiOiBgaHR0cDovL3RpbWJ1Y3Rvby5jb20vJHtzaGVldC5hcmNoZXR5cGVOYW1lLnJlcGxhY2UoL3MkLywgXCJcIil9YCxcbiAgICBcInJtbDpsb2dpY2FsU291cmNlXCI6IHtcblx0XHRcdFwicm1sOnNvdXJjZVwiOiB7XG5cdFx0XHRcdFwidGltOnJhd0NvbGxlY3Rpb25cIjoga2V5LFxuXHRcdFx0XHRcInRpbTp2cmVOYW1lXCI6IHZyZVxuXHRcdFx0fVxuXHRcdH0sXG4gICAgXCJzdWJqZWN0TWFwXCI6IHtcblx0XHRcdFwiY2xhc3NcIjogbWFrZU1hcE5hbWUodnJlLCBrZXkpLFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOiBgJHttYWtlTWFwTmFtZSh2cmUsIGtleSl9L3t0aW1faWR9YFxuXHRcdH0sXG4gICAgXCJwcmVkaWNhdGVPYmplY3RNYXBcIjogc2hlZXQubWFwcGluZ3MubWFwKG1ha2VQcmVkaWNhdGVPYmplY3RNYXAuYmluZChudWxsLCB2cmUpKVxuICB9O1xufVxuXG5mdW5jdGlvbiBtYWtlUHJlZGljYXRlT2JqZWN0TWFwKHZyZSwgbWFwcGluZykge1xuICBsZXQgcHJvcGVydHkgPSBtYXBwaW5nLnByb3BlcnR5O1xuICBsZXQgdmFyaWFibGUgPSBtYXBwaW5nLnZhcmlhYmxlWzBdO1xuICBpZiAodmFyaWFibGUudGFyZ2V0Q29sbGVjdGlvbikge1xuICAgIHJldHVybiB7XG4gICAgICBcIm9iamVjdE1hcFwiOiB7XG4gICAgICAgIFwiam9pbkNvbmRpdGlvblwiOiB7XG4gICAgICAgICAgXCJjaGlsZFwiOiB2YXJpYWJsZS52YXJpYWJsZU5hbWUsXG4gICAgICAgICAgXCJwYXJlbnRcIjogdmFyaWFibGUudGFyZ2V0VmFyaWFibGVOYW1lXG4gICAgICAgIH0sXG4gICAgICAgIFwicGFyZW50VHJpcGxlc01hcFwiOiBtYWtlTWFwTmFtZSh2cmUsIHZhcmlhYmxlLnRhcmdldENvbGxlY3Rpb24pXG4gICAgICB9LFxuICAgICAgXCJwcmVkaWNhdGVcIjogYGh0dHA6Ly90aW1idWN0b28uY29tLyR7cHJvcGVydHl9YFxuICAgIH1cbiAgfSBlbHNlIGlmICh2YXJpYWJsZS50YXJnZXRFeGlzdGluZ1RpbWJ1Y3Rvb1ZyZSkge1xuICAgIHJldHVybiB7XG4gICAgICBcIm9iamVjdE1hcFwiOiB7XG4gICAgICAgIFwiY29sdW1uXCI6IHZhcmlhYmxlLnZhcmlhYmxlTmFtZSxcbiAgICAgICAgXCJ0ZXJtVHlwZVwiOiBcImh0dHA6Ly93d3cudzMub3JnL25zL3Iycm1sI0lSSVwiXG4gICAgICB9LFxuICAgICAgXCJwcmVkaWNhdGVcIjogYGh0dHA6Ly90aW1idWN0b28uY29tLyR7cHJvcGVydHl9YCxcbiAgICAgIFwiaHR0cDovL3RpbWJ1Y3Rvby5jb20vbWFwcGluZy9leGlzdGluZ1RpbWJ1Y3Rvb1ZyZVwiOiB2YXJpYWJsZS50YXJnZXRFeGlzdGluZ1RpbWJ1Y3Rvb1ZyZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgXCJvYmplY3RNYXBcIjoge1xuICAgICAgICBcImNvbHVtblwiOiB2YXJpYWJsZS52YXJpYWJsZU5hbWVcbiAgICAgIH0sXG4gICAgICBcInByZWRpY2F0ZVwiOiBgaHR0cDovL3RpbWJ1Y3Rvby5jb20vJHtwcm9wZXJ0eX1gXG4gICAgfVxuICB9XG59XG4iLCJsZXQgcGVyc2lzdERpc2FibGVkID0gZmFsc2U7XG5cbmNvbnN0IHBlcnNpc3QgPSAoc3RhdGUpID0+IHtcblx0aWYgKCBwZXJzaXN0RGlzYWJsZWQgKSB7IHJldHVybjsgfVxuXHRmb3IgKGxldCBrZXkgaW4gc3RhdGUpIHtcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHN0YXRlW2tleV0pKTtcblx0fVxufTtcblxuY29uc3QgZ2V0SXRlbSA9IChrZXkpID0+IHtcblx0aWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpIHtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcblx0fVxuXHRyZXR1cm4gbnVsbDtcbn07XG5cbmNvbnN0IGRpc2FibGVQZXJzaXN0ID0gKCkgPT4ge1xuXHRsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcblx0cGVyc2lzdERpc2FibGVkID0gdHJ1ZTtcbn07XG53aW5kb3cuZGlzYWJsZVBlcnNpc3QgPSBkaXNhYmxlUGVyc2lzdDtcblxuZXhwb3J0IHsgcGVyc2lzdCwgZ2V0SXRlbSwgZGlzYWJsZVBlcnNpc3QgfTtcbiIsImltcG9ydCBjbG9uZSBmcm9tIFwiLi9jbG9uZS1kZWVwXCI7XG5cbi8vIERvIGVpdGhlciBvZiB0aGVzZTpcbi8vICBhKSBTZXQgYSB2YWx1ZSBieSByZWZlcmVuY2UgaWYgZGVyZWYgaXMgbm90IG51bGxcbi8vICBiKSBTZXQgYSB2YWx1ZSBkaXJlY3RseSBpbiB0byBkYXRhIG9iamVjdCBpZiBkZXJlZiBpcyBudWxsXG5jb25zdCBzZXRFaXRoZXIgPSAoZGF0YSwgZGVyZWYsIGtleSwgdmFsKSA9PiB7XG5cdChkZXJlZiB8fCBkYXRhKVtrZXldID0gdmFsO1xuXHRyZXR1cm4gZGF0YTtcbn07XG5cbi8vIFNldCBhIG5lc3RlZCB2YWx1ZSBpbiBkYXRhIChub3QgdW5saWtlIGltbXV0YWJsZWpzLCBidXQgYSBjbG9uZSBvZiBkYXRhIGlzIGV4cGVjdGVkIGZvciBwcm9wZXIgaW1tdXRhYmlsaXR5KVxuY29uc3QgX3NldEluID0gKHBhdGgsIHZhbHVlLCBkYXRhLCBkZXJlZiA9IG51bGwpID0+XG5cdHBhdGgubGVuZ3RoID4gMSA/XG5cdFx0X3NldEluKHBhdGgsIHZhbHVlLCBkYXRhLCBkZXJlZiA/IGRlcmVmW3BhdGguc2hpZnQoKV0gOiBkYXRhW3BhdGguc2hpZnQoKV0pIDpcblx0XHRzZXRFaXRoZXIoZGF0YSwgZGVyZWYsIHBhdGhbMF0sIHZhbHVlKTtcblxuY29uc3Qgc2V0SW4gPSAocGF0aCwgdmFsdWUsIGRhdGEpID0+XG5cdF9zZXRJbihjbG9uZShwYXRoKSwgdmFsdWUsIGNsb25lKGRhdGEpKTtcblxuZXhwb3J0IGRlZmF1bHQgc2V0SW47Il19
