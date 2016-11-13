System.registerDynamic('node_modules/rxjs/util/ObjectUnsubscribedError.js', [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     * An error thrown when an action is invalid because the object has been
     * unsubscribed.
     *
     * @see {@link Subject}
     * @see {@link BehaviorSubject}
     *
     * @class ObjectUnsubscribedError
     */
    var ObjectUnsubscribedError = function (_super) {
        __extends(ObjectUnsubscribedError, _super);
        function ObjectUnsubscribedError() {
            var err = _super.call(this, 'object unsubscribed');
            this.name = err.name = 'ObjectUnsubscribedError';
            this.stack = err.stack;
            this.message = err.message;
        }
        return ObjectUnsubscribedError;
    }(Error);
    exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/SubjectSubscription.js", ["./Subscription"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscription_1 = $__require("./Subscription");
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var SubjectSubscription = function (_super) {
        __extends(SubjectSubscription, _super);
        function SubjectSubscription(subject, subscriber) {
            _super.call(this);
            this.subject = subject;
            this.subscriber = subscriber;
            this.closed = false;
        }
        SubjectSubscription.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.closed = true;
            var subject = this.subject;
            var observers = subject.observers;
            this.subject = null;
            if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
                return;
            }
            var subscriberIndex = observers.indexOf(this.subscriber);
            if (subscriberIndex !== -1) {
                observers.splice(subscriberIndex, 1);
            }
        };
        return SubjectSubscription;
    }(Subscription_1.Subscription);
    exports.SubjectSubscription = SubjectSubscription;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/Subject.js', ['./Observable', './Subscriber', './Subscription', './util/ObjectUnsubscribedError', './SubjectSubscription', './symbol/rxSubscriber'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Observable_1 = $__require('./Observable');
    var Subscriber_1 = $__require('./Subscriber');
    var Subscription_1 = $__require('./Subscription');
    var ObjectUnsubscribedError_1 = $__require('./util/ObjectUnsubscribedError');
    var SubjectSubscription_1 = $__require('./SubjectSubscription');
    var rxSubscriber_1 = $__require('./symbol/rxSubscriber');
    /**
     * @class SubjectSubscriber<T>
     */
    var SubjectSubscriber = function (_super) {
        __extends(SubjectSubscriber, _super);
        function SubjectSubscriber(destination) {
            _super.call(this, destination);
            this.destination = destination;
        }
        return SubjectSubscriber;
    }(Subscriber_1.Subscriber);
    exports.SubjectSubscriber = SubjectSubscriber;
    /**
     * @class Subject<T>
     */
    var Subject = function (_super) {
        __extends(Subject, _super);
        function Subject() {
            _super.call(this);
            this.observers = [];
            this.closed = false;
            this.isStopped = false;
            this.hasError = false;
            this.thrownError = null;
        }
        Subject.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
            return new SubjectSubscriber(this);
        };
        Subject.prototype.lift = function (operator) {
            var subject = new AnonymousSubject(this, this);
            subject.operator = operator;
            return subject;
        };
        Subject.prototype.next = function (value) {
            if (this.closed) {
                throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
            }
            if (!this.isStopped) {
                var observers = this.observers;
                var len = observers.length;
                var copy = observers.slice();
                for (var i = 0; i < len; i++) {
                    copy[i].next(value);
                }
            }
        };
        Subject.prototype.error = function (err) {
            if (this.closed) {
                throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
            }
            this.hasError = true;
            this.thrownError = err;
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].error(err);
            }
            this.observers.length = 0;
        };
        Subject.prototype.complete = function () {
            if (this.closed) {
                throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
            }
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].complete();
            }
            this.observers.length = 0;
        };
        Subject.prototype.unsubscribe = function () {
            this.isStopped = true;
            this.closed = true;
            this.observers = null;
        };
        Subject.prototype._subscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
            } else if (this.hasError) {
                subscriber.error(this.thrownError);
                return Subscription_1.Subscription.EMPTY;
            } else if (this.isStopped) {
                subscriber.complete();
                return Subscription_1.Subscription.EMPTY;
            } else {
                this.observers.push(subscriber);
                return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
            }
        };
        Subject.prototype.asObservable = function () {
            var observable = new Observable_1.Observable();
            observable.source = this;
            return observable;
        };
        Subject.create = function (destination, source) {
            return new AnonymousSubject(destination, source);
        };
        return Subject;
    }(Observable_1.Observable);
    exports.Subject = Subject;
    /**
     * @class AnonymousSubject<T>
     */
    var AnonymousSubject = function (_super) {
        __extends(AnonymousSubject, _super);
        function AnonymousSubject(destination, source) {
            _super.call(this);
            this.destination = destination;
            this.source = source;
        }
        AnonymousSubject.prototype.next = function (value) {
            var destination = this.destination;
            if (destination && destination.next) {
                destination.next(value);
            }
        };
        AnonymousSubject.prototype.error = function (err) {
            var destination = this.destination;
            if (destination && destination.error) {
                this.destination.error(err);
            }
        };
        AnonymousSubject.prototype.complete = function () {
            var destination = this.destination;
            if (destination && destination.complete) {
                this.destination.complete();
            }
        };
        AnonymousSubject.prototype._subscribe = function (subscriber) {
            var source = this.source;
            if (source) {
                return this.source.subscribe(subscriber);
            } else {
                return Subscription_1.Subscription.EMPTY;
            }
        };
        return AnonymousSubject;
    }(Subject);
    exports.AnonymousSubject = AnonymousSubject;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/observable/FromEventObservable.js', ['../Observable', '../util/tryCatch', '../util/isFunction', '../util/errorObject', '../Subscription'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Observable_1 = $__require('../Observable');
    var tryCatch_1 = $__require('../util/tryCatch');
    var isFunction_1 = $__require('../util/isFunction');
    var errorObject_1 = $__require('../util/errorObject');
    var Subscription_1 = $__require('../Subscription');
    function isNodeStyleEventEmmitter(sourceObj) {
        return !!sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
    }
    function isJQueryStyleEventEmitter(sourceObj) {
        return !!sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
    }
    function isNodeList(sourceObj) {
        return !!sourceObj && sourceObj.toString() === '[object NodeList]';
    }
    function isHTMLCollection(sourceObj) {
        return !!sourceObj && sourceObj.toString() === '[object HTMLCollection]';
    }
    function isEventTarget(sourceObj) {
        return !!sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    var FromEventObservable = function (_super) {
        __extends(FromEventObservable, _super);
        function FromEventObservable(sourceObj, eventName, selector, options) {
            _super.call(this);
            this.sourceObj = sourceObj;
            this.eventName = eventName;
            this.selector = selector;
            this.options = options;
        }
        /* tslint:enable:max-line-length */
        /**
         * Creates an Observable that emits events of a specific type coming from the
         * given event target.
         *
         * <span class="informal">Creates an Observable from DOM events, or Node
         * EventEmitter events or others.</span>
         *
         * <img src="./img/fromEvent.png" width="100%">
         *
         * Creates an Observable by attaching an event listener to an "event target",
         * which may be an object with `addEventListener` and `removeEventListener`,
         * a Node.js EventEmitter, a jQuery style EventEmitter, a NodeList from the
         * DOM, or an HTMLCollection from the DOM. The event handler is attached when
         * the output Observable is subscribed, and removed when the Subscription is
         * unsubscribed.
         *
         * @example <caption>Emits clicks happening on the DOM document</caption>
         * var clicks = Rx.Observable.fromEvent(document, 'click');
         * clicks.subscribe(x => console.log(x));
         *
         * @see {@link from}
         * @see {@link fromEventPattern}
         *
         * @param {EventTargetLike} target The DOMElement, event target, Node.js
         * EventEmitter, NodeList or HTMLCollection to attach the event handler to.
         * @param {string} eventName The event name of interest, being emitted by the
         * `target`.
         * @parm {EventListenerOptions} [options] Options to pass through to addEventListener
         * @param {SelectorMethodSignature<T>} [selector] An optional function to
         * post-process results. It takes the arguments from the event handler and
         * should return a single value.
         * @return {Observable<T>}
         * @static true
         * @name fromEvent
         * @owner Observable
         */
        FromEventObservable.create = function (target, eventName, options, selector) {
            if (isFunction_1.isFunction(options)) {
                selector = options;
                options = undefined;
            }
            return new FromEventObservable(target, eventName, selector, options);
        };
        FromEventObservable.setupSubscription = function (sourceObj, eventName, handler, subscriber, options) {
            var unsubscribe;
            if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
                for (var i = 0, len = sourceObj.length; i < len; i++) {
                    FromEventObservable.setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
                }
            } else if (isEventTarget(sourceObj)) {
                var source_1 = sourceObj;
                sourceObj.addEventListener(eventName, handler, options);
                unsubscribe = function () {
                    return source_1.removeEventListener(eventName, handler);
                };
            } else if (isJQueryStyleEventEmitter(sourceObj)) {
                var source_2 = sourceObj;
                sourceObj.on(eventName, handler);
                unsubscribe = function () {
                    return source_2.off(eventName, handler);
                };
            } else if (isNodeStyleEventEmmitter(sourceObj)) {
                var source_3 = sourceObj;
                sourceObj.addListener(eventName, handler);
                unsubscribe = function () {
                    return source_3.removeListener(eventName, handler);
                };
            }
            subscriber.add(new Subscription_1.Subscription(unsubscribe));
        };
        FromEventObservable.prototype._subscribe = function (subscriber) {
            var sourceObj = this.sourceObj;
            var eventName = this.eventName;
            var options = this.options;
            var selector = this.selector;
            var handler = selector ? function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var result = tryCatch_1.tryCatch(selector).apply(void 0, args);
                if (result === errorObject_1.errorObject) {
                    subscriber.error(errorObject_1.errorObject.e);
                } else {
                    subscriber.next(result);
                }
            } : function (e) {
                return subscriber.next(e);
            };
            FromEventObservable.setupSubscription(sourceObj, eventName, handler, subscriber, options);
        };
        return FromEventObservable;
    }(Observable_1.Observable);
    exports.FromEventObservable = FromEventObservable;
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/observable/fromEvent.js", ["./FromEventObservable"], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var FromEventObservable_1 = $__require("./FromEventObservable");
  exports.fromEvent = FromEventObservable_1.FromEventObservable.create;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/observable/fromEvent.js', ['../../Observable', '../../observable/fromEvent'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var fromEvent_1 = $__require('../../observable/fromEvent');
  Observable_1.Observable.fromEvent = fromEvent_1.fromEvent;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/observable/PromiseObservable.js', ['../util/root', '../Observable'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var root_1 = $__require('../util/root');
    var Observable_1 = $__require('../Observable');
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    var PromiseObservable = function (_super) {
        __extends(PromiseObservable, _super);
        function PromiseObservable(promise, scheduler) {
            _super.call(this);
            this.promise = promise;
            this.scheduler = scheduler;
        }
        /**
         * Converts a Promise to an Observable.
         *
         * <span class="informal">Returns an Observable that just emits the Promise's
         * resolved value, then completes.</span>
         *
         * Converts an ES2015 Promise or a Promises/A+ spec compliant Promise to an
         * Observable. If the Promise resolves with a value, the output Observable
         * emits that resolved value as a `next`, and then completes. If the Promise
         * is rejected, then the output Observable emits the corresponding Error.
         *
         * @example <caption>Convert the Promise returned by Fetch to an Observable</caption>
         * var result = Rx.Observable.fromPromise(fetch('http://myserver.com/'));
         * result.subscribe(x => console.log(x), e => console.error(e));
         *
         * @see {@link bindCallback}
         * @see {@link from}
         *
         * @param {Promise<T>} promise The promise to be converted.
         * @param {Scheduler} [scheduler] An optional Scheduler to use for scheduling
         * the delivery of the resolved value (or the rejection).
         * @return {Observable<T>} An Observable which wraps the Promise.
         * @static true
         * @name fromPromise
         * @owner Observable
         */
        PromiseObservable.create = function (promise, scheduler) {
            return new PromiseObservable(promise, scheduler);
        };
        PromiseObservable.prototype._subscribe = function (subscriber) {
            var _this = this;
            var promise = this.promise;
            var scheduler = this.scheduler;
            if (scheduler == null) {
                if (this._isScalar) {
                    if (!subscriber.closed) {
                        subscriber.next(this.value);
                        subscriber.complete();
                    }
                } else {
                    promise.then(function (value) {
                        _this.value = value;
                        _this._isScalar = true;
                        if (!subscriber.closed) {
                            subscriber.next(value);
                            subscriber.complete();
                        }
                    }, function (err) {
                        if (!subscriber.closed) {
                            subscriber.error(err);
                        }
                    }).then(null, function (err) {
                        // escape the promise trap, throw unhandled errors
                        root_1.root.setTimeout(function () {
                            throw err;
                        });
                    });
                }
            } else {
                if (this._isScalar) {
                    if (!subscriber.closed) {
                        return scheduler.schedule(dispatchNext, 0, { value: this.value, subscriber: subscriber });
                    }
                } else {
                    promise.then(function (value) {
                        _this.value = value;
                        _this._isScalar = true;
                        if (!subscriber.closed) {
                            subscriber.add(scheduler.schedule(dispatchNext, 0, { value: value, subscriber: subscriber }));
                        }
                    }, function (err) {
                        if (!subscriber.closed) {
                            subscriber.add(scheduler.schedule(dispatchError, 0, { err: err, subscriber: subscriber }));
                        }
                    }).then(null, function (err) {
                        // escape the promise trap, throw unhandled errors
                        root_1.root.setTimeout(function () {
                            throw err;
                        });
                    });
                }
            }
        };
        return PromiseObservable;
    }(Observable_1.Observable);
    exports.PromiseObservable = PromiseObservable;
    function dispatchNext(arg) {
        var value = arg.value,
            subscriber = arg.subscriber;
        if (!subscriber.closed) {
            subscriber.next(value);
            subscriber.complete();
        }
    }
    function dispatchError(arg) {
        var err = arg.err,
            subscriber = arg.subscriber;
        if (!subscriber.closed) {
            subscriber.error(err);
        }
    }
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/observable/fromPromise.js", ["./PromiseObservable"], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var PromiseObservable_1 = $__require("./PromiseObservable");
  exports.fromPromise = PromiseObservable_1.PromiseObservable.create;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/observable/fromPromise.js', ['../../Observable', '../../observable/fromPromise'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var fromPromise_1 = $__require('../../observable/fromPromise');
  Observable_1.Observable.fromPromise = fromPromise_1.fromPromise;
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/observable/of.js", ["./ArrayObservable"], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var ArrayObservable_1 = $__require("./ArrayObservable");
  exports.of = ArrayObservable_1.ArrayObservable.of;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/observable/of.js', ['../../Observable', '../../observable/of'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var of_1 = $__require('../../observable/of');
  Observable_1.Observable.of = of_1.of;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/buffer.js', ['../OuterSubscriber', '../util/subscribeToResult'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var OuterSubscriber_1 = $__require('../OuterSubscriber');
    var subscribeToResult_1 = $__require('../util/subscribeToResult');
    /**
     * Buffers the source Observable values until `closingNotifier` emits.
     *
     * <span class="informal">Collects values from the past as an array, and emits
     * that array only when another Observable emits.</span>
     *
     * <img src="./img/buffer.png" width="100%">
     *
     * Buffers the incoming Observable values until the given `closingNotifier`
     * Observable emits a value, at which point it emits the buffer on the output
     * Observable and starts a new buffer internally, awaiting the next time
     * `closingNotifier` emits.
     *
     * @example <caption>On every click, emit array of most recent interval events</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var interval = Rx.Observable.interval(1000);
     * var buffered = interval.buffer(clicks);
     * buffered.subscribe(x => console.log(x));
     *
     * @see {@link bufferCount}
     * @see {@link bufferTime}
     * @see {@link bufferToggle}
     * @see {@link bufferWhen}
     * @see {@link window}
     *
     * @param {Observable<any>} closingNotifier An Observable that signals the
     * buffer to be emitted on the output Observable.
     * @return {Observable<T[]>} An Observable of buffers, which are arrays of
     * values.
     * @method buffer
     * @owner Observable
     */
    function buffer(closingNotifier) {
        return this.lift(new BufferOperator(closingNotifier));
    }
    exports.buffer = buffer;
    var BufferOperator = function () {
        function BufferOperator(closingNotifier) {
            this.closingNotifier = closingNotifier;
        }
        BufferOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
        };
        return BufferOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var BufferSubscriber = function (_super) {
        __extends(BufferSubscriber, _super);
        function BufferSubscriber(destination, closingNotifier) {
            _super.call(this, destination);
            this.buffer = [];
            this.add(subscribeToResult_1.subscribeToResult(this, closingNotifier));
        }
        BufferSubscriber.prototype._next = function (value) {
            this.buffer.push(value);
        };
        BufferSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            var buffer = this.buffer;
            this.buffer = [];
            this.destination.next(buffer);
        };
        return BufferSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/buffer.js', ['../../Observable', '../../operator/buffer'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var buffer_1 = $__require('../../operator/buffer');
  Observable_1.Observable.prototype.buffer = buffer_1.buffer;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/catch.js', ['../OuterSubscriber', '../util/subscribeToResult'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var OuterSubscriber_1 = $__require('../OuterSubscriber');
    var subscribeToResult_1 = $__require('../util/subscribeToResult');
    /**
     * Catches errors on the observable to be handled by returning a new observable or throwing an error.
     * @param {function} selector a function that takes as arguments `err`, which is the error, and `caught`, which
     *  is the source observable, in case you'd like to "retry" that observable by returning it again. Whatever observable
     *  is returned by the `selector` will be used to continue the observable chain.
     * @return {Observable} an observable that originates from either the source or the observable returned by the
     *  catch `selector` function.
     * @method catch
     * @owner Observable
     */
    function _catch(selector) {
        var operator = new CatchOperator(selector);
        var caught = this.lift(operator);
        return operator.caught = caught;
    }
    exports._catch = _catch;
    var CatchOperator = function () {
        function CatchOperator(selector) {
            this.selector = selector;
        }
        CatchOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
        };
        return CatchOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var CatchSubscriber = function (_super) {
        __extends(CatchSubscriber, _super);
        function CatchSubscriber(destination, selector, caught) {
            _super.call(this, destination);
            this.selector = selector;
            this.caught = caught;
        }
        // NOTE: overriding `error` instead of `_error` because we don't want
        // to have this flag this subscriber as `isStopped`.
        CatchSubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var result = void 0;
                try {
                    result = this.selector(err, this.caught);
                } catch (err) {
                    this.destination.error(err);
                    return;
                }
                this.unsubscribe();
                this.destination.remove(this);
                subscribeToResult_1.subscribeToResult(this, result);
            }
        };
        return CatchSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/catch.js', ['../../Observable', '../../operator/catch'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var catch_1 = $__require('../../operator/catch');
  Observable_1.Observable.prototype.catch = catch_1._catch;
  Observable_1.Observable.prototype._catch = catch_1._catch;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/concat.js', ['../../Observable', '../../operator/concat'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var concat_1 = $__require('../../operator/concat');
  Observable_1.Observable.prototype.concat = concat_1.concat;
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/operator/concatMap.js", ["./mergeMap"], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var mergeMap_1 = $__require("./mergeMap");
  /**
   * Projects each source value to an Observable which is merged in the output
   * Observable, in a serialized fashion waiting for each one to complete before
   * merging the next.
   *
   * <span class="informal">Maps each value to an Observable, then flattens all of
   * these inner Observables using {@link concatAll}.</span>
   *
   * <img src="./img/concatMap.png" width="100%">
   *
   * Returns an Observable that emits items based on applying a function that you
   * supply to each item emitted by the source Observable, where that function
   * returns an (so-called "inner") Observable. Each new inner Observable is
   * concatenated with the previous inner Observable.
   *
   * __Warning:__ if source values arrive endlessly and faster than their
   * corresponding inner Observables can complete, it will result in memory issues
   * as inner Observables amass in an unbounded buffer waiting for their turn to
   * be subscribed to.
   *
   * Note: `concatMap` is equivalent to `mergeMap` with concurrency parameter set
   * to `1`.
   *
   * @example <caption>For each click event, tick every second from 0 to 3, with no concurrency</caption>
   * var clicks = Rx.Observable.fromEvent(document, 'click');
   * var result = clicks.concatMap(ev => Rx.Observable.interval(1000).take(4));
   * result.subscribe(x => console.log(x));
   *
   * @see {@link concat}
   * @see {@link concatAll}
   * @see {@link concatMapTo}
   * @see {@link exhaustMap}
   * @see {@link mergeMap}
   * @see {@link switchMap}
   *
   * @param {function(value: T, ?index: number): Observable} project A function
   * that, when applied to an item emitted by the source Observable, returns an
   * Observable.
   * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
   * A function to produce the value on the output Observable based on the values
   * and the indices of the source (outer) emission and the inner Observable
   * emission. The arguments passed to this function are:
   * - `outerValue`: the value that came from the source
   * - `innerValue`: the value that came from the projected Observable
   * - `outerIndex`: the "index" of the value that came from the source
   * - `innerIndex`: the "index" of the value from the projected Observable
   * @return {Observable} an observable of values merged from the projected
   * Observables as they were subscribed to, one at a time. Optionally, these
   * values may have been projected from a passed `projectResult` argument.
   * @return {Observable} An Observable that emits the result of applying the
   * projection function (and the optional `resultSelector`) to each item emitted
   * by the source Observable and taking values from each projected inner
   * Observable sequentially.
   * @method concatMap
   * @owner Observable
   */
  function concatMap(project, resultSelector) {
    return this.lift(new mergeMap_1.MergeMapOperator(project, resultSelector, 1));
  }
  exports.concatMap = concatMap;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/concatMap.js', ['../../Observable', '../../operator/concatMap'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var concatMap_1 = $__require('../../operator/concatMap');
  Observable_1.Observable.prototype.concatMap = concatMap_1.concatMap;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/debounceTime.js', ['../Subscriber', '../scheduler/async'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require('../Subscriber');
    var async_1 = $__require('../scheduler/async');
    /**
     * Emits a value from the source Observable only after a particular time span
     * has passed without another source emission.
     *
     * <span class="informal">It's like {@link delay}, but passes only the most
     * recent value from each burst of emissions.</span>
     *
     * <img src="./img/debounceTime.png" width="100%">
     *
     * `debounceTime` delays values emitted by the source Observable, but drops
     * previous pending delayed emissions if a new value arrives on the source
     * Observable. This operator keeps track of the most recent value from the
     * source Observable, and emits that only when `dueTime` enough time has passed
     * without any other value appearing on the source Observable. If a new value
     * appears before `dueTime` silence occurs, the previous value will be dropped
     * and will not be emitted on the output Observable.
     *
     * This is a rate-limiting operator, because it is impossible for more than one
     * value to be emitted in any time window of duration `dueTime`, but it is also
     * a delay-like operator since output emissions do not occur at the same time as
     * they did on the source Observable. Optionally takes a {@link Scheduler} for
     * managing timers.
     *
     * @example <caption>Emit the most recent click after a burst of clicks</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.debounceTime(1000);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link auditTime}
     * @see {@link debounce}
     * @see {@link delay}
     * @see {@link sampleTime}
     * @see {@link throttleTime}
     *
     * @param {number} dueTime The timeout duration in milliseconds (or the time
     * unit determined internally by the optional `scheduler`) for the window of
     * time required to wait for emission silence before emitting the most recent
     * source value.
     * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
     * managing the timers that handle the timeout for each value.
     * @return {Observable} An Observable that delays the emissions of the source
     * Observable by the specified `dueTime`, and may drop some values if they occur
     * too frequently.
     * @method debounceTime
     * @owner Observable
     */
    function debounceTime(dueTime, scheduler) {
        if (scheduler === void 0) {
            scheduler = async_1.async;
        }
        return this.lift(new DebounceTimeOperator(dueTime, scheduler));
    }
    exports.debounceTime = debounceTime;
    var DebounceTimeOperator = function () {
        function DebounceTimeOperator(dueTime, scheduler) {
            this.dueTime = dueTime;
            this.scheduler = scheduler;
        }
        DebounceTimeOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
        };
        return DebounceTimeOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var DebounceTimeSubscriber = function (_super) {
        __extends(DebounceTimeSubscriber, _super);
        function DebounceTimeSubscriber(destination, dueTime, scheduler) {
            _super.call(this, destination);
            this.dueTime = dueTime;
            this.scheduler = scheduler;
            this.debouncedSubscription = null;
            this.lastValue = null;
            this.hasValue = false;
        }
        DebounceTimeSubscriber.prototype._next = function (value) {
            this.clearDebounce();
            this.lastValue = value;
            this.hasValue = true;
            this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
        };
        DebounceTimeSubscriber.prototype._complete = function () {
            this.debouncedNext();
            this.destination.complete();
        };
        DebounceTimeSubscriber.prototype.debouncedNext = function () {
            this.clearDebounce();
            if (this.hasValue) {
                this.destination.next(this.lastValue);
                this.lastValue = null;
                this.hasValue = false;
            }
        };
        DebounceTimeSubscriber.prototype.clearDebounce = function () {
            var debouncedSubscription = this.debouncedSubscription;
            if (debouncedSubscription !== null) {
                this.remove(debouncedSubscription);
                debouncedSubscription.unsubscribe();
                this.debouncedSubscription = null;
            }
        };
        return DebounceTimeSubscriber;
    }(Subscriber_1.Subscriber);
    function dispatchNext(subscriber) {
        subscriber.debouncedNext();
    }
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/debounceTime.js', ['../../Observable', '../../operator/debounceTime'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var debounceTime_1 = $__require('../../operator/debounceTime');
  Observable_1.Observable.prototype.debounceTime = debounceTime_1.debounceTime;
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/scheduler/Action.js", ["../Subscription"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscription_1 = $__require("../Subscription");
    /**
     * A unit of work to be executed in a {@link Scheduler}. An action is typically
     * created from within a Scheduler and an RxJS user does not need to concern
     * themselves about creating and manipulating an Action.
     *
     * ```ts
     * class Action<T> extends Subscription {
     *   new (scheduler: Scheduler, work: (state?: T) => void);
     *   schedule(state?: T, delay: number = 0): Subscription;
     * }
     * ```
     *
     * @class Action<T>
     */
    var Action = function (_super) {
        __extends(Action, _super);
        function Action(scheduler, work) {
            _super.call(this);
        }
        /**
         * Schedules this action on its parent Scheduler for execution. May be passed
         * some context object, `state`. May happen at some point in the future,
         * according to the `delay` parameter, if specified.
         * @param {T} [state] Some contextual data that the `work` function uses when
         * called by the Scheduler.
         * @param {number} [delay] Time to wait before executing the work, where the
         * time unit is implicit and defined by the Scheduler.
         * @return {void}
         */
        Action.prototype.schedule = function (state, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            return this;
        };
        return Action;
    }(Subscription_1.Subscription);
    exports.Action = Action;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/scheduler/AsyncAction.js', ['../util/root', './Action'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var root_1 = $__require('../util/root');
    var Action_1 = $__require('./Action');
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var AsyncAction = function (_super) {
        __extends(AsyncAction, _super);
        function AsyncAction(scheduler, work) {
            _super.call(this, scheduler, work);
            this.scheduler = scheduler;
            this.work = work;
            this.pending = false;
        }
        AsyncAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (this.closed) {
                return this;
            }
            // Always replace the current state with the new state.
            this.state = state;
            // Set the pending flag indicating that this action has been scheduled, or
            // has recursively rescheduled itself.
            this.pending = true;
            var id = this.id;
            var scheduler = this.scheduler;
            //
            // Important implementation note:
            //
            // Actions only execute once by default, unless rescheduled from within the
            // scheduled callback. This allows us to implement single and repeat
            // actions via the same code path, without adding API surface area, as well
            // as mimic traditional recursion but across asynchronous boundaries.
            //
            // However, JS runtimes and timers distinguish between intervals achieved by
            // serial `setTimeout` calls vs. a single `setInterval` call. An interval of
            // serial `setTimeout` calls can be individually delayed, which delays
            // scheduling the next `setTimeout`, and so on. `setInterval` attempts to
            // guarantee the interval callback will be invoked more precisely to the
            // interval period, regardless of load.
            //
            // Therefore, we use `setInterval` to schedule single and repeat actions.
            // If the action reschedules itself with the same delay, the interval is not
            // canceled. If the action doesn't reschedule, or reschedules with a
            // different delay, the interval will be canceled after scheduled callback
            // execution.
            //
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, delay);
            }
            this.delay = delay;
            // If this action has already an async Id, don't request a new one.
            this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
            return this;
        };
        AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            return root_1.root.setInterval(scheduler.flush.bind(scheduler, this), delay);
        };
        AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            // If this action is rescheduled with the same delay time, don't clear the interval id.
            if (delay !== null && this.delay === delay) {
                return id;
            }
            // Otherwise, if the action's delay time is different from the current delay,
            // clear the interval id
            return root_1.root.clearInterval(id) && undefined || undefined;
        };
        /**
         * Immediately executes this action and the `work` it contains.
         * @return {any}
         */
        AsyncAction.prototype.execute = function (state, delay) {
            if (this.closed) {
                return new Error('executing a cancelled action');
            }
            this.pending = false;
            var error = this._execute(state, delay);
            if (error) {
                return error;
            } else if (this.pending === false && this.id != null) {
                // Dequeue if the action didn't reschedule itself. Don't call
                // unsubscribe(), because the action could reschedule later.
                // For example:
                // ```
                // scheduler.schedule(function doWork(counter) {
                //   /* ... I'm a busy worker bee ... */
                //   var originalAction = this;
                //   /* wait 100ms before rescheduling the action */
                //   setTimeout(function () {
                //     originalAction.schedule(counter + 1);
                //   }, 100);
                // }, 1000);
                // ```
                this.id = this.recycleAsyncId(this.scheduler, this.id, null);
            }
        };
        AsyncAction.prototype._execute = function (state, delay) {
            var errored = false;
            var errorValue = undefined;
            try {
                this.work(state);
            } catch (e) {
                errored = true;
                errorValue = !!e && e || new Error(e);
            }
            if (errored) {
                this.unsubscribe();
                return errorValue;
            }
        };
        AsyncAction.prototype._unsubscribe = function () {
            var id = this.id;
            var scheduler = this.scheduler;
            var actions = scheduler.actions;
            var index = actions.indexOf(this);
            this.work = null;
            this.delay = null;
            this.state = null;
            this.pending = false;
            this.scheduler = null;
            if (index !== -1) {
                actions.splice(index, 1);
            }
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, null);
            }
        };
        return AsyncAction;
    }(Action_1.Action);
    exports.AsyncAction = AsyncAction;
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/Scheduler.js", [], true, function ($__require, exports, module) {
    "use strict";
    /**
     * An execution context and a data structure to order tasks and schedule their
     * execution. Provides a notion of (potentially virtual) time, through the
     * `now()` getter method.
     *
     * Each unit of work in a Scheduler is called an {@link Action}.
     *
     * ```ts
     * class Scheduler {
     *   now(): number;
     *   schedule(work, delay?, state?): Subscription;
     * }
     * ```
     *
     * @class Scheduler
     */

    var define,
        global = this || self,
        GLOBAL = global;
    var Scheduler = function () {
        function Scheduler(SchedulerAction, now) {
            if (now === void 0) {
                now = Scheduler.now;
            }
            this.SchedulerAction = SchedulerAction;
            this.now = now;
        }
        /**
         * Schedules a function, `work`, for execution. May happen at some point in
         * the future, according to the `delay` parameter, if specified. May be passed
         * some context object, `state`, which will be passed to the `work` function.
         *
         * The given arguments will be processed an stored as an Action object in a
         * queue of actions.
         *
         * @param {function(state: ?T): ?Subscription} work A function representing a
         * task, or some unit of work to be executed by the Scheduler.
         * @param {number} [delay] Time to wait before executing the work, where the
         * time unit is implicit and defined by the Scheduler itself.
         * @param {T} [state] Some contextual data that the `work` function uses when
         * called by the Scheduler.
         * @return {Subscription} A subscription in order to be able to unsubscribe
         * the scheduled work.
         */
        Scheduler.prototype.schedule = function (work, delay, state) {
            if (delay === void 0) {
                delay = 0;
            }
            return new this.SchedulerAction(this, work).schedule(state, delay);
        };
        Scheduler.now = Date.now ? Date.now : function () {
            return +new Date();
        };
        return Scheduler;
    }();
    exports.Scheduler = Scheduler;
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/scheduler/AsyncScheduler.js", ["../Scheduler"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Scheduler_1 = $__require("../Scheduler");
    var AsyncScheduler = function (_super) {
        __extends(AsyncScheduler, _super);
        function AsyncScheduler() {
            _super.apply(this, arguments);
            this.actions = [];
            /**
             * A flag to indicate whether the Scheduler is currently executing a batch of
             * queued actions.
             * @type {boolean}
             */
            this.active = false;
            /**
             * An internal ID used to track the latest asynchronous task such as those
             * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
             * others.
             * @type {any}
             */
            this.scheduled = undefined;
        }
        AsyncScheduler.prototype.flush = function (action) {
            var actions = this.actions;
            if (this.active) {
                actions.push(action);
                return;
            }
            var error;
            this.active = true;
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (action = actions.shift()); // exhaust the scheduler queue
            this.active = false;
            if (error) {
                while (action = actions.shift()) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AsyncScheduler;
    }(Scheduler_1.Scheduler);
    exports.AsyncScheduler = AsyncScheduler;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/scheduler/async.js', ['./AsyncAction', './AsyncScheduler'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var AsyncAction_1 = $__require('./AsyncAction');
  var AsyncScheduler_1 = $__require('./AsyncScheduler');
  exports.async = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/util/isDate.js", [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function isDate(value) {
        return value instanceof Date && !isNaN(+value);
    }
    exports.isDate = isDate;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/Notification.js', ['./Observable'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var Observable_1 = $__require('./Observable');
    /**
     * Represents a push-based event or value that an {@link Observable} can emit.
     * This class is particularly useful for operators that manage notifications,
     * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
     * others. Besides wrapping the actual delivered value, it also annotates it
     * with metadata of, for instance, what type of push message it is (`next`,
     * `error`, or `complete`).
     *
     * @see {@link materialize}
     * @see {@link dematerialize}
     * @see {@link observeOn}
     *
     * @class Notification<T>
     */
    var Notification = function () {
        function Notification(kind, value, exception) {
            this.kind = kind;
            this.value = value;
            this.exception = exception;
            this.hasValue = kind === 'N';
        }
        /**
         * Delivers to the given `observer` the value wrapped by this Notification.
         * @param {Observer} observer
         * @return
         */
        Notification.prototype.observe = function (observer) {
            switch (this.kind) {
                case 'N':
                    return observer.next && observer.next(this.value);
                case 'E':
                    return observer.error && observer.error(this.exception);
                case 'C':
                    return observer.complete && observer.complete();
            }
        };
        /**
         * Given some {@link Observer} callbacks, deliver the value represented by the
         * current Notification to the correctly corresponding callback.
         * @param {function(value: T): void} next An Observer `next` callback.
         * @param {function(err: any): void} [error] An Observer `error` callback.
         * @param {function(): void} [complete] An Observer `complete` callback.
         * @return {any}
         */
        Notification.prototype.do = function (next, error, complete) {
            var kind = this.kind;
            switch (kind) {
                case 'N':
                    return next && next(this.value);
                case 'E':
                    return error && error(this.exception);
                case 'C':
                    return complete && complete();
            }
        };
        /**
         * Takes an Observer or its individual callback functions, and calls `observe`
         * or `do` methods accordingly.
         * @param {Observer|function(value: T): void} nextOrObserver An Observer or
         * the `next` callback.
         * @param {function(err: any): void} [error] An Observer `error` callback.
         * @param {function(): void} [complete] An Observer `complete` callback.
         * @return {any}
         */
        Notification.prototype.accept = function (nextOrObserver, error, complete) {
            if (nextOrObserver && typeof nextOrObserver.next === 'function') {
                return this.observe(nextOrObserver);
            } else {
                return this.do(nextOrObserver, error, complete);
            }
        };
        /**
         * Returns a simple Observable that just delivers the notification represented
         * by this Notification instance.
         * @return {any}
         */
        Notification.prototype.toObservable = function () {
            var kind = this.kind;
            switch (kind) {
                case 'N':
                    return Observable_1.Observable.of(this.value);
                case 'E':
                    return Observable_1.Observable.throw(this.exception);
                case 'C':
                    return Observable_1.Observable.empty();
            }
            throw new Error('unexpected notification kind value');
        };
        /**
         * A shortcut to create a Notification instance of the type `next` from a
         * given value.
         * @param {T} value The `next` value.
         * @return {Notification<T>} The "next" Notification representing the
         * argument.
         */
        Notification.createNext = function (value) {
            if (typeof value !== 'undefined') {
                return new Notification('N', value);
            }
            return this.undefinedValueNotification;
        };
        /**
         * A shortcut to create a Notification instance of the type `error` from a
         * given error.
         * @param {any} [err] The `error` exception.
         * @return {Notification<T>} The "error" Notification representing the
         * argument.
         */
        Notification.createError = function (err) {
            return new Notification('E', undefined, err);
        };
        /**
         * A shortcut to create a Notification instance of the type `complete`.
         * @return {Notification<any>} The valueless "complete" Notification.
         */
        Notification.createComplete = function () {
            return this.completeNotification;
        };
        Notification.completeNotification = new Notification('C');
        Notification.undefinedValueNotification = new Notification('N', undefined);
        return Notification;
    }();
    exports.Notification = Notification;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/delay.js', ['../scheduler/async', '../util/isDate', '../Subscriber', '../Notification'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var async_1 = $__require('../scheduler/async');
    var isDate_1 = $__require('../util/isDate');
    var Subscriber_1 = $__require('../Subscriber');
    var Notification_1 = $__require('../Notification');
    /**
     * Delays the emission of items from the source Observable by a given timeout or
     * until a given Date.
     *
     * <span class="informal">Time shifts each item by some specified amount of
     * milliseconds.</span>
     *
     * <img src="./img/delay.png" width="100%">
     *
     * If the delay argument is a Number, this operator time shifts the source
     * Observable by that amount of time expressed in milliseconds. The relative
     * time intervals between the values are preserved.
     *
     * If the delay argument is a Date, this operator time shifts the start of the
     * Observable execution until the given date occurs.
     *
     * @example <caption>Delay each click by one second</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var delayedClicks = clicks.delay(1000); // each click emitted after 1 second
     * delayedClicks.subscribe(x => console.log(x));
     *
     * @example <caption>Delay all clicks until a future date happens</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var date = new Date('March 15, 2050 12:00:00'); // in the future
     * var delayedClicks = clicks.delay(date); // click emitted only after that date
     * delayedClicks.subscribe(x => console.log(x));
     *
     * @see {@link debounceTime}
     * @see {@link delayWhen}
     *
     * @param {number|Date} delay The delay duration in milliseconds (a `number`) or
     * a `Date` until which the emission of the source items is delayed.
     * @param {Scheduler} [scheduler=async] The Scheduler to use for
     * managing the timers that handle the time-shift for each item.
     * @return {Observable} An Observable that delays the emissions of the source
     * Observable by the specified timeout or Date.
     * @method delay
     * @owner Observable
     */
    function delay(delay, scheduler) {
        if (scheduler === void 0) {
            scheduler = async_1.async;
        }
        var absoluteDelay = isDate_1.isDate(delay);
        var delayFor = absoluteDelay ? +delay - scheduler.now() : Math.abs(delay);
        return this.lift(new DelayOperator(delayFor, scheduler));
    }
    exports.delay = delay;
    var DelayOperator = function () {
        function DelayOperator(delay, scheduler) {
            this.delay = delay;
            this.scheduler = scheduler;
        }
        DelayOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
        };
        return DelayOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var DelaySubscriber = function (_super) {
        __extends(DelaySubscriber, _super);
        function DelaySubscriber(destination, delay, scheduler) {
            _super.call(this, destination);
            this.delay = delay;
            this.scheduler = scheduler;
            this.queue = [];
            this.active = false;
            this.errored = false;
        }
        DelaySubscriber.dispatch = function (state) {
            var source = state.source;
            var queue = source.queue;
            var scheduler = state.scheduler;
            var destination = state.destination;
            while (queue.length > 0 && queue[0].time - scheduler.now() <= 0) {
                queue.shift().notification.observe(destination);
            }
            if (queue.length > 0) {
                var delay_1 = Math.max(0, queue[0].time - scheduler.now());
                this.schedule(state, delay_1);
            } else {
                source.active = false;
            }
        };
        DelaySubscriber.prototype._schedule = function (scheduler) {
            this.active = true;
            this.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
                source: this, destination: this.destination, scheduler: scheduler
            }));
        };
        DelaySubscriber.prototype.scheduleNotification = function (notification) {
            if (this.errored === true) {
                return;
            }
            var scheduler = this.scheduler;
            var message = new DelayMessage(scheduler.now() + this.delay, notification);
            this.queue.push(message);
            if (this.active === false) {
                this._schedule(scheduler);
            }
        };
        DelaySubscriber.prototype._next = function (value) {
            this.scheduleNotification(Notification_1.Notification.createNext(value));
        };
        DelaySubscriber.prototype._error = function (err) {
            this.errored = true;
            this.queue = [];
            this.destination.error(err);
        };
        DelaySubscriber.prototype._complete = function () {
            this.scheduleNotification(Notification_1.Notification.createComplete());
        };
        return DelaySubscriber;
    }(Subscriber_1.Subscriber);
    var DelayMessage = function () {
        function DelayMessage(time, notification) {
            this.time = time;
            this.notification = notification;
        }
        return DelayMessage;
    }();
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/delay.js', ['../../Observable', '../../operator/delay'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var delay_1 = $__require('../../operator/delay');
  Observable_1.Observable.prototype.delay = delay_1.delay;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/distinctUntilChanged.js', ['../Subscriber', '../util/tryCatch', '../util/errorObject'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require('../Subscriber');
    var tryCatch_1 = $__require('../util/tryCatch');
    var errorObject_1 = $__require('../util/errorObject');
    /**
     * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
     * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
     * If a comparator function is not provided, an equality check is used by default.
     * @param {function} [compare] optional comparison function called to test if an item is distinct from the previous item in the source.
     * @return {Observable} an Observable that emits items from the source Observable with distinct values.
     * @method distinctUntilChanged
     * @owner Observable
     */
    function distinctUntilChanged(compare, keySelector) {
        return this.lift(new DistinctUntilChangedOperator(compare, keySelector));
    }
    exports.distinctUntilChanged = distinctUntilChanged;
    var DistinctUntilChangedOperator = function () {
        function DistinctUntilChangedOperator(compare, keySelector) {
            this.compare = compare;
            this.keySelector = keySelector;
        }
        DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
        };
        return DistinctUntilChangedOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var DistinctUntilChangedSubscriber = function (_super) {
        __extends(DistinctUntilChangedSubscriber, _super);
        function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
            _super.call(this, destination);
            this.keySelector = keySelector;
            this.hasKey = false;
            if (typeof compare === 'function') {
                this.compare = compare;
            }
        }
        DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
            return x === y;
        };
        DistinctUntilChangedSubscriber.prototype._next = function (value) {
            var keySelector = this.keySelector;
            var key = value;
            if (keySelector) {
                key = tryCatch_1.tryCatch(this.keySelector)(value);
                if (key === errorObject_1.errorObject) {
                    return this.destination.error(errorObject_1.errorObject.e);
                }
            }
            var result = false;
            if (this.hasKey) {
                result = tryCatch_1.tryCatch(this.compare)(this.key, key);
                if (result === errorObject_1.errorObject) {
                    return this.destination.error(errorObject_1.errorObject.e);
                }
            } else {
                this.hasKey = true;
            }
            if (Boolean(result) === false) {
                this.key = key;
                this.destination.next(value);
            }
        };
        return DistinctUntilChangedSubscriber;
    }(Subscriber_1.Subscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/distinctUntilChanged.js', ['../../Observable', '../../operator/distinctUntilChanged'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var distinctUntilChanged_1 = $__require('../../operator/distinctUntilChanged');
  Observable_1.Observable.prototype.distinctUntilChanged = distinctUntilChanged_1.distinctUntilChanged;
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/operator/do.js", ["../Subscriber"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require("../Subscriber");
    /**
     * Perform a side effect for every emission on the source Observable, but return
     * an Observable that is identical to the source.
     *
     * <span class="informal">Intercepts each emission on the source and runs a
     * function, but returns an output which is identical to the source.</span>
     *
     * <img src="./img/do.png" width="100%">
     *
     * Returns a mirrored Observable of the source Observable, but modified so that
     * the provided Observer is called to perform a side effect for every value,
     * error, and completion emitted by the source. Any errors that are thrown in
     * the aforementioned Observer or handlers are safely sent down the error path
     * of the output Observable.
     *
     * This operator is useful for debugging your Observables for the correct values
     * or performing other side effects.
     *
     * Note: this is different to a `subscribe` on the Observable. If the Observable
     * returned by `do` is not subscribed, the side effects specified by the
     * Observer will never happen. `do` therefore simply spies on existing
     * execution, it does not trigger an execution to happen like `subscribe` does.
     *
     * @example <caption>Map every every click to the clientX position of that click, while also logging the click event</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var positions = clicks
     *   .do(ev => console.log(ev))
     *   .map(ev => ev.clientX);
     * positions.subscribe(x => console.log(x));
     *
     * @see {@link map}
     * @see {@link subscribe}
     *
     * @param {Observer|function} [nextOrObserver] A normal Observer object or a
     * callback for `next`.
     * @param {function} [error] Callback for errors in the source.
     * @param {function} [complete] Callback for the completion of the source.
     * @return {Observable} An Observable identical to the source, but runs the
     * specified Observer or callback(s) for each item.
     * @method do
     * @name do
     * @owner Observable
     */
    function _do(nextOrObserver, error, complete) {
        return this.lift(new DoOperator(nextOrObserver, error, complete));
    }
    exports._do = _do;
    var DoOperator = function () {
        function DoOperator(nextOrObserver, error, complete) {
            this.nextOrObserver = nextOrObserver;
            this.error = error;
            this.complete = complete;
        }
        DoOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new DoSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
        };
        return DoOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var DoSubscriber = function (_super) {
        __extends(DoSubscriber, _super);
        function DoSubscriber(destination, nextOrObserver, error, complete) {
            _super.call(this, destination);
            var safeSubscriber = new Subscriber_1.Subscriber(nextOrObserver, error, complete);
            safeSubscriber.syncErrorThrowable = true;
            this.add(safeSubscriber);
            this.safeSubscriber = safeSubscriber;
        }
        DoSubscriber.prototype._next = function (value) {
            var safeSubscriber = this.safeSubscriber;
            safeSubscriber.next(value);
            if (safeSubscriber.syncErrorThrown) {
                this.destination.error(safeSubscriber.syncErrorValue);
            } else {
                this.destination.next(value);
            }
        };
        DoSubscriber.prototype._error = function (err) {
            var safeSubscriber = this.safeSubscriber;
            safeSubscriber.error(err);
            if (safeSubscriber.syncErrorThrown) {
                this.destination.error(safeSubscriber.syncErrorValue);
            } else {
                this.destination.error(err);
            }
        };
        DoSubscriber.prototype._complete = function () {
            var safeSubscriber = this.safeSubscriber;
            safeSubscriber.complete();
            if (safeSubscriber.syncErrorThrown) {
                this.destination.error(safeSubscriber.syncErrorValue);
            } else {
                this.destination.complete();
            }
        };
        return DoSubscriber;
    }(Subscriber_1.Subscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/do.js', ['../../Observable', '../../operator/do'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var do_1 = $__require('../../operator/do');
  Observable_1.Observable.prototype.do = do_1._do;
  Observable_1.Observable.prototype._do = do_1._do;
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/operator/filter.js", ["../Subscriber"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require("../Subscriber");
    /**
     * Filter items emitted by the source Observable by only emitting those that
     * satisfy a specified predicate.
     *
     * <span class="informal">Like
     * [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
     * it only emits a value from the source if it passes a criterion function.</span>
     *
     * <img src="./img/filter.png" width="100%">
     *
     * Similar to the well-known `Array.prototype.filter` method, this operator
     * takes values from the source Observable, passes them through a `predicate`
     * function and only emits those values that yielded `true`.
     *
     * @example <caption>Emit only click events whose target was a DIV element</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var clicksOnDivs = clicks.filter(ev => ev.target.tagName === 'DIV');
     * clicksOnDivs.subscribe(x => console.log(x));
     *
     * @see {@link distinct}
     * @see {@link distinctKey}
     * @see {@link distinctUntilChanged}
     * @see {@link distinctUntilKeyChanged}
     * @see {@link ignoreElements}
     * @see {@link partition}
     * @see {@link skip}
     *
     * @param {function(value: T, index: number): boolean} predicate A function that
     * evaluates each value emitted by the source Observable. If it returns `true`,
     * the value is emitted, if `false` the value is not passed to the output
     * Observable. The `index` parameter is the number `i` for the i-th source
     * emission that has happened since the subscription, starting from the number
     * `0`.
     * @param {any} [thisArg] An optional argument to determine the value of `this`
     * in the `predicate` function.
     * @return {Observable} An Observable of values from the source that were
     * allowed by the `predicate` function.
     * @method filter
     * @owner Observable
     */
    function filter(predicate, thisArg) {
        return this.lift(new FilterOperator(predicate, thisArg));
    }
    exports.filter = filter;
    var FilterOperator = function () {
        function FilterOperator(predicate, thisArg) {
            this.predicate = predicate;
            this.thisArg = thisArg;
        }
        FilterOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
        };
        return FilterOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var FilterSubscriber = function (_super) {
        __extends(FilterSubscriber, _super);
        function FilterSubscriber(destination, predicate, thisArg) {
            _super.call(this, destination);
            this.predicate = predicate;
            this.thisArg = thisArg;
            this.count = 0;
            this.predicate = predicate;
        }
        // the try catch block below is left specifically for
        // optimization and perf reasons. a tryCatcher is not necessary here.
        FilterSubscriber.prototype._next = function (value) {
            var result;
            try {
                result = this.predicate.call(this.thisArg, value, this.count++);
            } catch (err) {
                this.destination.error(err);
                return;
            }
            if (result) {
                this.destination.next(value);
            }
        };
        return FilterSubscriber;
    }(Subscriber_1.Subscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/filter.js', ['../../Observable', '../../operator/filter'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var filter_1 = $__require('../../operator/filter');
  Observable_1.Observable.prototype.filter = filter_1.filter;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/util/EmptyError.js', [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     * An error thrown when an Observable or a sequence was queried but has no
     * elements.
     *
     * @see {@link first}
     * @see {@link last}
     * @see {@link single}
     *
     * @class EmptyError
     */
    var EmptyError = function (_super) {
        __extends(EmptyError, _super);
        function EmptyError() {
            var err = _super.call(this, 'no elements in sequence');
            this.name = err.name = 'EmptyError';
            this.stack = err.stack;
            this.message = err.message;
        }
        return EmptyError;
    }(Error);
    exports.EmptyError = EmptyError;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/last.js', ['../Subscriber', '../util/EmptyError'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require('../Subscriber');
    var EmptyError_1 = $__require('../util/EmptyError');
    /**
     * Returns an Observable that emits only the last item emitted by the source Observable.
     * It optionally takes a predicate function as a parameter, in which case, rather than emitting
     * the last item from the source Observable, the resulting Observable will emit the last item
     * from the source Observable that satisfies the predicate.
     *
     * <img src="./img/last.png" width="100%">
     *
     * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
     * callback if the Observable completes before any `next` notification was sent.
     * @param {function} predicate - the condition any source emitted item has to satisfy.
     * @return {Observable} an Observable that emits only the last item satisfying the given condition
     * from the source, or an NoSuchElementException if no such items are emitted.
     * @throws - Throws if no items that match the predicate are emitted by the source Observable.
     * @method last
     * @owner Observable
     */
    function last(predicate, resultSelector, defaultValue) {
        return this.lift(new LastOperator(predicate, resultSelector, defaultValue, this));
    }
    exports.last = last;
    var LastOperator = function () {
        function LastOperator(predicate, resultSelector, defaultValue, source) {
            this.predicate = predicate;
            this.resultSelector = resultSelector;
            this.defaultValue = defaultValue;
            this.source = source;
        }
        LastOperator.prototype.call = function (observer, source) {
            return source._subscribe(new LastSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source));
        };
        return LastOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var LastSubscriber = function (_super) {
        __extends(LastSubscriber, _super);
        function LastSubscriber(destination, predicate, resultSelector, defaultValue, source) {
            _super.call(this, destination);
            this.predicate = predicate;
            this.resultSelector = resultSelector;
            this.defaultValue = defaultValue;
            this.source = source;
            this.hasValue = false;
            this.index = 0;
            if (typeof defaultValue !== 'undefined') {
                this.lastValue = defaultValue;
                this.hasValue = true;
            }
        }
        LastSubscriber.prototype._next = function (value) {
            var index = this.index++;
            if (this.predicate) {
                this._tryPredicate(value, index);
            } else {
                if (this.resultSelector) {
                    this._tryResultSelector(value, index);
                    return;
                }
                this.lastValue = value;
                this.hasValue = true;
            }
        };
        LastSubscriber.prototype._tryPredicate = function (value, index) {
            var result;
            try {
                result = this.predicate(value, index, this.source);
            } catch (err) {
                this.destination.error(err);
                return;
            }
            if (result) {
                if (this.resultSelector) {
                    this._tryResultSelector(value, index);
                    return;
                }
                this.lastValue = value;
                this.hasValue = true;
            }
        };
        LastSubscriber.prototype._tryResultSelector = function (value, index) {
            var result;
            try {
                result = this.resultSelector(value, index);
            } catch (err) {
                this.destination.error(err);
                return;
            }
            this.lastValue = result;
            this.hasValue = true;
        };
        LastSubscriber.prototype._complete = function () {
            var destination = this.destination;
            if (this.hasValue) {
                destination.next(this.lastValue);
                destination.complete();
            } else {
                destination.error(new EmptyError_1.EmptyError());
            }
        };
        return LastSubscriber;
    }(Subscriber_1.Subscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/last.js', ['../../Observable', '../../operator/last'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var last_1 = $__require('../../operator/last');
  Observable_1.Observable.prototype.last = last_1.last;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/map.js', ['../Subscriber'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require('../Subscriber');
    /**
     * Applies a given `project` function to each value emitted by the source
     * Observable, and emits the resulting values as an Observable.
     *
     * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
     * it passes each source value through a transformation function to get
     * corresponding output values.</span>
     *
     * <img src="./img/map.png" width="100%">
     *
     * Similar to the well known `Array.prototype.map` function, this operator
     * applies a projection to each value and emits that projection in the output
     * Observable.
     *
     * @example <caption>Map every every click to the clientX position of that click</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var positions = clicks.map(ev => ev.clientX);
     * positions.subscribe(x => console.log(x));
     *
     * @see {@link mapTo}
     * @see {@link pluck}
     *
     * @param {function(value: T, index: number): R} project The function to apply
     * to each `value` emitted by the source Observable. The `index` parameter is
     * the number `i` for the i-th emission that has happened since the
     * subscription, starting from the number `0`.
     * @param {any} [thisArg] An optional argument to define what `this` is in the
     * `project` function.
     * @return {Observable<R>} An Observable that emits the values from the source
     * Observable transformed by the given `project` function.
     * @method map
     * @owner Observable
     */
    function map(project, thisArg) {
        if (typeof project !== 'function') {
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
        }
        return this.lift(new MapOperator(project, thisArg));
    }
    exports.map = map;
    var MapOperator = function () {
        function MapOperator(project, thisArg) {
            this.project = project;
            this.thisArg = thisArg;
        }
        MapOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
        };
        return MapOperator;
    }();
    exports.MapOperator = MapOperator;
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var MapSubscriber = function (_super) {
        __extends(MapSubscriber, _super);
        function MapSubscriber(destination, project, thisArg) {
            _super.call(this, destination);
            this.project = project;
            this.count = 0;
            this.thisArg = thisArg || this;
        }
        // NOTE: This looks unoptimized, but it's actually purposefully NOT
        // using try/catch optimizations.
        MapSubscriber.prototype._next = function (value) {
            var result;
            try {
                result = this.project.call(this.thisArg, value, this.count++);
            } catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return MapSubscriber;
    }(Subscriber_1.Subscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/map.js', ['../../Observable', '../../operator/map'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var map_1 = $__require('../../operator/map');
  Observable_1.Observable.prototype.map = map_1.map;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/merge.js', ['../observable/ArrayObservable', './mergeAll', '../util/isScheduler'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var ArrayObservable_1 = $__require('../observable/ArrayObservable');
    var mergeAll_1 = $__require('./mergeAll');
    var isScheduler_1 = $__require('../util/isScheduler');
    /**
     * Creates an output Observable which concurrently emits all values from every
     * given input Observable.
     *
     * <span class="informal">Flattens multiple Observables together by blending
     * their values into one Observable.</span>
     *
     * <img src="./img/merge.png" width="100%">
     *
     * `merge` subscribes to each given input Observable (either the source or an
     * Observable given as argument), and simply forwards (without doing any
     * transformation) all the values from all the input Observables to the output
     * Observable. The output Observable only completes once all input Observables
     * have completed. Any error delivered by an input Observable will be immediately
     * emitted on the output Observable.
     *
     * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var timer = Rx.Observable.interval(1000);
     * var clicksOrTimer = clicks.merge(timer);
     * clicksOrTimer.subscribe(x => console.log(x));
     *
     * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
     * var timer1 = Rx.Observable.interval(1000).take(10);
     * var timer2 = Rx.Observable.interval(2000).take(6);
     * var timer3 = Rx.Observable.interval(500).take(10);
     * var concurrent = 2; // the argument
     * var merged = timer1.merge(timer2, timer3, concurrent);
     * merged.subscribe(x => console.log(x));
     *
     * @see {@link mergeAll}
     * @see {@link mergeMap}
     * @see {@link mergeMapTo}
     * @see {@link mergeScan}
     *
     * @param {Observable} other An input Observable to merge with the source
     * Observable. More than one input Observables may be given as argument.
     * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
     * Observables being subscribed to concurrently.
     * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
     * concurrency of input Observables.
     * @return {Observable} an Observable that emits items that are the result of
     * every input Observable.
     * @method merge
     * @owner Observable
     */
    function merge() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
        }
        observables.unshift(this);
        return mergeStatic.apply(this, observables);
    }
    exports.merge = merge;
    /* tslint:enable:max-line-length */
    /**
     * Creates an output Observable which concurrently emits all values from every
     * given input Observable.
     *
     * <span class="informal">Flattens multiple Observables together by blending
     * their values into one Observable.</span>
     *
     * <img src="./img/merge.png" width="100%">
     *
     * `merge` subscribes to each given input Observable (as arguments), and simply
     * forwards (without doing any transformation) all the values from all the input
     * Observables to the output Observable. The output Observable only completes
     * once all input Observables have completed. Any error delivered by an input
     * Observable will be immediately emitted on the output Observable.
     *
     * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var timer = Rx.Observable.interval(1000);
     * var clicksOrTimer = Rx.Observable.merge(clicks, timer);
     * clicksOrTimer.subscribe(x => console.log(x));
     *
     * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
     * var timer1 = Rx.Observable.interval(1000).take(10);
     * var timer2 = Rx.Observable.interval(2000).take(6);
     * var timer3 = Rx.Observable.interval(500).take(10);
     * var concurrent = 2; // the argument
     * var merged = Rx.Observable.merge(timer1, timer2, timer3, concurrent);
     * merged.subscribe(x => console.log(x));
     *
     * @see {@link mergeAll}
     * @see {@link mergeMap}
     * @see {@link mergeMapTo}
     * @see {@link mergeScan}
     *
     * @param {Observable} input1 An input Observable to merge with others.
     * @param {Observable} input2 An input Observable to merge with others.
     * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
     * Observables being subscribed to concurrently.
     * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
     * concurrency of input Observables.
     * @return {Observable} an Observable that emits items that are the result of
     * every input Observable.
     * @static true
     * @name merge
     * @owner Observable
     */
    function mergeStatic() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
        }
        var concurrent = Number.POSITIVE_INFINITY;
        var scheduler = null;
        var last = observables[observables.length - 1];
        if (isScheduler_1.isScheduler(last)) {
            scheduler = observables.pop();
            if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
                concurrent = observables.pop();
            }
        } else if (typeof last === 'number') {
            concurrent = observables.pop();
        }
        if (observables.length === 1) {
            return observables[0];
        }
        return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(concurrent));
    }
    exports.mergeStatic = mergeStatic;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/merge.js', ['../../Observable', '../../operator/merge'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var merge_1 = $__require('../../operator/merge');
  Observable_1.Observable.prototype.merge = merge_1.merge;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/mergeMap.js', ['../util/subscribeToResult', '../OuterSubscriber'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var subscribeToResult_1 = $__require('../util/subscribeToResult');
    var OuterSubscriber_1 = $__require('../OuterSubscriber');
    /**
     * Projects each source value to an Observable which is merged in the output
     * Observable.
     *
     * <span class="informal">Maps each value to an Observable, then flattens all of
     * these inner Observables using {@link mergeAll}.</span>
     *
     * <img src="./img/mergeMap.png" width="100%">
     *
     * Returns an Observable that emits items based on applying a function that you
     * supply to each item emitted by the source Observable, where that function
     * returns an Observable, and then merging those resulting Observables and
     * emitting the results of this merger.
     *
     * @example <caption>Map and flatten each letter to an Observable ticking every 1 second</caption>
     * var letters = Rx.Observable.of('a', 'b', 'c');
     * var result = letters.mergeMap(x =>
     *   Rx.Observable.interval(1000).map(i => x+i)
     * );
     * result.subscribe(x => console.log(x));
     *
     * @see {@link concatMap}
     * @see {@link exhaustMap}
     * @see {@link merge}
     * @see {@link mergeAll}
     * @see {@link mergeMapTo}
     * @see {@link mergeScan}
     * @see {@link switchMap}
     *
     * @param {function(value: T, ?index: number): Observable} project A function
     * that, when applied to an item emitted by the source Observable, returns an
     * Observable.
     * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
     * A function to produce the value on the output Observable based on the values
     * and the indices of the source (outer) emission and the inner Observable
     * emission. The arguments passed to this function are:
     * - `outerValue`: the value that came from the source
     * - `innerValue`: the value that came from the projected Observable
     * - `outerIndex`: the "index" of the value that came from the source
     * - `innerIndex`: the "index" of the value from the projected Observable
     * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
     * Observables being subscribed to concurrently.
     * @return {Observable} An Observable that emits the result of applying the
     * projection function (and the optional `resultSelector`) to each item emitted
     * by the source Observable and merging the results of the Observables obtained
     * from this transformation.
     * @method mergeMap
     * @owner Observable
     */
    function mergeMap(project, resultSelector, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
            resultSelector = null;
        }
        return this.lift(new MergeMapOperator(project, resultSelector, concurrent));
    }
    exports.mergeMap = mergeMap;
    var MergeMapOperator = function () {
        function MergeMapOperator(project, resultSelector, concurrent) {
            if (concurrent === void 0) {
                concurrent = Number.POSITIVE_INFINITY;
            }
            this.project = project;
            this.resultSelector = resultSelector;
            this.concurrent = concurrent;
        }
        MergeMapOperator.prototype.call = function (observer, source) {
            return source._subscribe(new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
        };
        return MergeMapOperator;
    }();
    exports.MergeMapOperator = MergeMapOperator;
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var MergeMapSubscriber = function (_super) {
        __extends(MergeMapSubscriber, _super);
        function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
            if (concurrent === void 0) {
                concurrent = Number.POSITIVE_INFINITY;
            }
            _super.call(this, destination);
            this.project = project;
            this.resultSelector = resultSelector;
            this.concurrent = concurrent;
            this.hasCompleted = false;
            this.buffer = [];
            this.active = 0;
            this.index = 0;
        }
        MergeMapSubscriber.prototype._next = function (value) {
            if (this.active < this.concurrent) {
                this._tryNext(value);
            } else {
                this.buffer.push(value);
            }
        };
        MergeMapSubscriber.prototype._tryNext = function (value) {
            var result;
            var index = this.index++;
            try {
                result = this.project(value, index);
            } catch (err) {
                this.destination.error(err);
                return;
            }
            this.active++;
            this._innerSub(result, value, index);
        };
        MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
            this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
        };
        MergeMapSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
                this.destination.complete();
            }
        };
        MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            if (this.resultSelector) {
                this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
            } else {
                this.destination.next(innerValue);
            }
        };
        MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
            var result;
            try {
                result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
            } catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
            var buffer = this.buffer;
            this.remove(innerSub);
            this.active--;
            if (buffer.length > 0) {
                this._next(buffer.shift());
            } else if (this.active === 0 && this.hasCompleted) {
                this.destination.complete();
            }
        };
        return MergeMapSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
    exports.MergeMapSubscriber = MergeMapSubscriber;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/mergeMap.js', ['../../Observable', '../../operator/mergeMap'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var mergeMap_1 = $__require('../../operator/mergeMap');
  Observable_1.Observable.prototype.mergeMap = mergeMap_1.mergeMap;
  Observable_1.Observable.prototype.flatMap = mergeMap_1.mergeMap;
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/operator/skip.js", ["../Subscriber"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require("../Subscriber");
    /**
     * Returns an Observable that skips `n` items emitted by an Observable.
     *
     * <img src="./img/skip.png" width="100%">
     *
     * @param {Number} the `n` of times, items emitted by source Observable should be skipped.
     * @return {Observable} an Observable that skips values emitted by the source Observable.
     *
     * @method skip
     * @owner Observable
     */
    function skip(total) {
        return this.lift(new SkipOperator(total));
    }
    exports.skip = skip;
    var SkipOperator = function () {
        function SkipOperator(total) {
            this.total = total;
        }
        SkipOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new SkipSubscriber(subscriber, this.total));
        };
        return SkipOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var SkipSubscriber = function (_super) {
        __extends(SkipSubscriber, _super);
        function SkipSubscriber(destination, total) {
            _super.call(this, destination);
            this.total = total;
            this.count = 0;
        }
        SkipSubscriber.prototype._next = function (x) {
            if (++this.count > this.total) {
                this.destination.next(x);
            }
        };
        return SkipSubscriber;
    }(Subscriber_1.Subscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/skip.js', ['../../Observable', '../../operator/skip'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var skip_1 = $__require('../../operator/skip');
  Observable_1.Observable.prototype.skip = skip_1.skip;
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/observable/ScalarObservable.js", ["../Observable"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Observable_1 = $__require("../Observable");
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    var ScalarObservable = function (_super) {
        __extends(ScalarObservable, _super);
        function ScalarObservable(value, scheduler) {
            _super.call(this);
            this.value = value;
            this.scheduler = scheduler;
            this._isScalar = true;
            if (scheduler) {
                this._isScalar = false;
            }
        }
        ScalarObservable.create = function (value, scheduler) {
            return new ScalarObservable(value, scheduler);
        };
        ScalarObservable.dispatch = function (state) {
            var done = state.done,
                value = state.value,
                subscriber = state.subscriber;
            if (done) {
                subscriber.complete();
                return;
            }
            subscriber.next(value);
            if (subscriber.closed) {
                return;
            }
            state.done = true;
            this.schedule(state);
        };
        ScalarObservable.prototype._subscribe = function (subscriber) {
            var value = this.value;
            var scheduler = this.scheduler;
            if (scheduler) {
                return scheduler.schedule(ScalarObservable.dispatch, 0, {
                    done: false, value: value, subscriber: subscriber
                });
            } else {
                subscriber.next(value);
                if (!subscriber.closed) {
                    subscriber.complete();
                }
            }
        };
        return ScalarObservable;
    }(Observable_1.Observable);
    exports.ScalarObservable = ScalarObservable;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/observable/ArrayObservable.js', ['../Observable', './ScalarObservable', './EmptyObservable', '../util/isScheduler'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Observable_1 = $__require('../Observable');
    var ScalarObservable_1 = $__require('./ScalarObservable');
    var EmptyObservable_1 = $__require('./EmptyObservable');
    var isScheduler_1 = $__require('../util/isScheduler');
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    var ArrayObservable = function (_super) {
        __extends(ArrayObservable, _super);
        function ArrayObservable(array, scheduler) {
            _super.call(this);
            this.array = array;
            this.scheduler = scheduler;
            if (!scheduler && array.length === 1) {
                this._isScalar = true;
                this.value = array[0];
            }
        }
        ArrayObservable.create = function (array, scheduler) {
            return new ArrayObservable(array, scheduler);
        };
        /**
         * Creates an Observable that emits some values you specify as arguments,
         * immediately one after the other, and then emits a complete notification.
         *
         * <span class="informal">Emits the arguments you provide, then completes.
         * </span>
         *
         * <img src="./img/of.png" width="100%">
         *
         * This static operator is useful for creating a simple Observable that only
         * emits the arguments given, and the complete notification thereafter. It can
         * be used for composing with other Observables, such as with {@link concat}.
         * By default, it uses a `null` Scheduler, which means the `next`
         * notifications are sent synchronously, although with a different Scheduler
         * it is possible to determine when those notifications will be delivered.
         *
         * @example <caption>Emit 10, 20, 30, then 'a', 'b', 'c', then start ticking every second.</caption>
         * var numbers = Rx.Observable.of(10, 20, 30);
         * var letters = Rx.Observable.of('a', 'b', 'c');
         * var interval = Rx.Observable.interval(1000);
         * var result = numbers.concat(letters).concat(interval);
         * result.subscribe(x => console.log(x));
         *
         * @see {@link create}
         * @see {@link empty}
         * @see {@link never}
         * @see {@link throw}
         *
         * @param {...T} values Arguments that represent `next` values to be emitted.
         * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
         * the emissions of the `next` notifications.
         * @return {Observable<T>} An Observable that emits each given input value.
         * @static true
         * @name of
         * @owner Observable
         */
        ArrayObservable.of = function () {
            var array = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                array[_i - 0] = arguments[_i];
            }
            var scheduler = array[array.length - 1];
            if (isScheduler_1.isScheduler(scheduler)) {
                array.pop();
            } else {
                scheduler = null;
            }
            var len = array.length;
            if (len > 1) {
                return new ArrayObservable(array, scheduler);
            } else if (len === 1) {
                return new ScalarObservable_1.ScalarObservable(array[0], scheduler);
            } else {
                return new EmptyObservable_1.EmptyObservable(scheduler);
            }
        };
        ArrayObservable.dispatch = function (state) {
            var array = state.array,
                index = state.index,
                count = state.count,
                subscriber = state.subscriber;
            if (index >= count) {
                subscriber.complete();
                return;
            }
            subscriber.next(array[index]);
            if (subscriber.closed) {
                return;
            }
            state.index = index + 1;
            this.schedule(state);
        };
        ArrayObservable.prototype._subscribe = function (subscriber) {
            var index = 0;
            var array = this.array;
            var count = array.length;
            var scheduler = this.scheduler;
            if (scheduler) {
                return scheduler.schedule(ArrayObservable.dispatch, 0, {
                    array: array, index: index, count: count, subscriber: subscriber
                });
            } else {
                for (var i = 0; i < count && !subscriber.closed; i++) {
                    subscriber.next(array[i]);
                }
                subscriber.complete();
            }
        };
        return ArrayObservable;
    }(Observable_1.Observable);
    exports.ArrayObservable = ArrayObservable;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/mergeAll.js', ['../OuterSubscriber', '../util/subscribeToResult'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var OuterSubscriber_1 = $__require('../OuterSubscriber');
    var subscribeToResult_1 = $__require('../util/subscribeToResult');
    /**
     * Converts a higher-order Observable into a first-order Observable which
     * concurrently delivers all values that are emitted on the inner Observables.
     *
     * <span class="informal">Flattens an Observable-of-Observables.</span>
     *
     * <img src="./img/mergeAll.png" width="100%">
     *
     * `mergeAll` subscribes to an Observable that emits Observables, also known as
     * a higher-order Observable. Each time it observes one of these emitted inner
     * Observables, it subscribes to that and delivers all the values from the
     * inner Observable on the output Observable. The output Observable only
     * completes once all inner Observables have completed. Any error delivered by
     * a inner Observable will be immediately emitted on the output Observable.
     *
     * @example <caption>Spawn a new interval Observable for each click event, and blend their outputs as one Observable</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
     * var firstOrder = higherOrder.mergeAll();
     * firstOrder.subscribe(x => console.log(x));
     *
     * @example <caption>Count from 0 to 9 every second for each click, but only allow 2 concurrent timers</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000).take(10));
     * var firstOrder = higherOrder.mergeAll(2);
     * firstOrder.subscribe(x => console.log(x));
     *
     * @see {@link combineAll}
     * @see {@link concatAll}
     * @see {@link exhaust}
     * @see {@link merge}
     * @see {@link mergeMap}
     * @see {@link mergeMapTo}
     * @see {@link mergeScan}
     * @see {@link switch}
     * @see {@link zipAll}
     *
     * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of inner
     * Observables being subscribed to concurrently.
     * @return {Observable} An Observable that emits values coming from all the
     * inner Observables emitted by the source Observable.
     * @method mergeAll
     * @owner Observable
     */
    function mergeAll(concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        return this.lift(new MergeAllOperator(concurrent));
    }
    exports.mergeAll = mergeAll;
    var MergeAllOperator = function () {
        function MergeAllOperator(concurrent) {
            this.concurrent = concurrent;
        }
        MergeAllOperator.prototype.call = function (observer, source) {
            return source._subscribe(new MergeAllSubscriber(observer, this.concurrent));
        };
        return MergeAllOperator;
    }();
    exports.MergeAllOperator = MergeAllOperator;
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var MergeAllSubscriber = function (_super) {
        __extends(MergeAllSubscriber, _super);
        function MergeAllSubscriber(destination, concurrent) {
            _super.call(this, destination);
            this.concurrent = concurrent;
            this.hasCompleted = false;
            this.buffer = [];
            this.active = 0;
        }
        MergeAllSubscriber.prototype._next = function (observable) {
            if (this.active < this.concurrent) {
                this.active++;
                this.add(subscribeToResult_1.subscribeToResult(this, observable));
            } else {
                this.buffer.push(observable);
            }
        };
        MergeAllSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
                this.destination.complete();
            }
        };
        MergeAllSubscriber.prototype.notifyComplete = function (innerSub) {
            var buffer = this.buffer;
            this.remove(innerSub);
            this.active--;
            if (buffer.length > 0) {
                this._next(buffer.shift());
            } else if (this.active === 0 && this.hasCompleted) {
                this.destination.complete();
            }
        };
        return MergeAllSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
    exports.MergeAllSubscriber = MergeAllSubscriber;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/concat.js', ['../util/isScheduler', '../observable/ArrayObservable', './mergeAll'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var isScheduler_1 = $__require('../util/isScheduler');
    var ArrayObservable_1 = $__require('../observable/ArrayObservable');
    var mergeAll_1 = $__require('./mergeAll');
    /**
     * Creates an output Observable which sequentially emits all values from every
     * given input Observable after the current Observable.
     *
     * <span class="informal">Concatenates multiple Observables together by
     * sequentially emitting their values, one Observable after the other.</span>
     *
     * <img src="./img/concat.png" width="100%">
     *
     * Joins this Observable with multiple other Observables by subscribing to them
     * one at a time, starting with the source, and merging their results into the
     * output Observable. Will wait for each Observable to complete before moving
     * on to the next.
     *
     * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
     * var timer = Rx.Observable.interval(1000).take(4);
     * var sequence = Rx.Observable.range(1, 10);
     * var result = timer.concat(sequence);
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Concatenate 3 Observables</caption>
     * var timer1 = Rx.Observable.interval(1000).take(10);
     * var timer2 = Rx.Observable.interval(2000).take(6);
     * var timer3 = Rx.Observable.interval(500).take(10);
     * var result = timer1.concat(timer2, timer3);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link concatAll}
     * @see {@link concatMap}
     * @see {@link concatMapTo}
     *
     * @param {Observable} other An input Observable to concatenate after the source
     * Observable. More than one input Observables may be given as argument.
     * @param {Scheduler} [scheduler=null] An optional Scheduler to schedule each
     * Observable subscription on.
     * @return {Observable} All values of each passed Observable merged into a
     * single Observable, in order, in serial fashion.
     * @method concat
     * @owner Observable
     */
    function concat() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
        }
        return concatStatic.apply(void 0, [this].concat(observables));
    }
    exports.concat = concat;
    /* tslint:enable:max-line-length */
    /**
     * Creates an output Observable which sequentially emits all values from every
     * given input Observable after the current Observable.
     *
     * <span class="informal">Concatenates multiple Observables together by
     * sequentially emitting their values, one Observable after the other.</span>
     *
     * <img src="./img/concat.png" width="100%">
     *
     * Joins multiple Observables together by subscribing to them one at a time and
     * merging their results into the output Observable. Will wait for each
     * Observable to complete before moving on to the next.
     *
     * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
     * var timer = Rx.Observable.interval(1000).take(4);
     * var sequence = Rx.Observable.range(1, 10);
     * var result = Rx.Observable.concat(timer, sequence);
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Concatenate 3 Observables</caption>
     * var timer1 = Rx.Observable.interval(1000).take(10);
     * var timer2 = Rx.Observable.interval(2000).take(6);
     * var timer3 = Rx.Observable.interval(500).take(10);
     * var result = Rx.Observable.concat(timer1, timer2, timer3);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link concatAll}
     * @see {@link concatMap}
     * @see {@link concatMapTo}
     *
     * @param {Observable} input1 An input Observable to concatenate with others.
     * @param {Observable} input2 An input Observable to concatenate with others.
     * More than one input Observables may be given as argument.
     * @param {Scheduler} [scheduler=null] An optional Scheduler to schedule each
     * Observable subscription on.
     * @return {Observable} All values of each passed Observable merged into a
     * single Observable, in order, in serial fashion.
     * @static true
     * @name concat
     * @owner Observable
     */
    function concatStatic() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
        }
        var scheduler = null;
        var args = observables;
        if (isScheduler_1.isScheduler(args[observables.length - 1])) {
            scheduler = args.pop();
        }
        return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(1));
    }
    exports.concatStatic = concatStatic;
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/util/isScheduler.js", [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function isScheduler(value) {
        return value && typeof value.schedule === 'function';
    }
    exports.isScheduler = isScheduler;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/startWith.js', ['../observable/ArrayObservable', '../observable/ScalarObservable', '../observable/EmptyObservable', './concat', '../util/isScheduler'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var ArrayObservable_1 = $__require('../observable/ArrayObservable');
    var ScalarObservable_1 = $__require('../observable/ScalarObservable');
    var EmptyObservable_1 = $__require('../observable/EmptyObservable');
    var concat_1 = $__require('./concat');
    var isScheduler_1 = $__require('../util/isScheduler');
    /**
     * Returns an Observable that emits the items in a specified Iterable before it begins to emit items emitted by the
     * source Observable.
     *
     * <img src="./img/startWith.png" width="100%">
     *
     * @param {Values} an Iterable that contains the items you want the modified Observable to emit first.
     * @return {Observable} an Observable that emits the items in the specified Iterable and then emits the items
     * emitted by the source Observable.
     * @method startWith
     * @owner Observable
     */
    function startWith() {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i - 0] = arguments[_i];
        }
        var scheduler = array[array.length - 1];
        if (isScheduler_1.isScheduler(scheduler)) {
            array.pop();
        } else {
            scheduler = null;
        }
        var len = array.length;
        if (len === 1) {
            return concat_1.concatStatic(new ScalarObservable_1.ScalarObservable(array[0], scheduler), this);
        } else if (len > 1) {
            return concat_1.concatStatic(new ArrayObservable_1.ArrayObservable(array, scheduler), this);
        } else {
            return concat_1.concatStatic(new EmptyObservable_1.EmptyObservable(scheduler), this);
        }
    }
    exports.startWith = startWith;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/startWith.js', ['../../Observable', '../../operator/startWith'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var startWith_1 = $__require('../../operator/startWith');
  Observable_1.Observable.prototype.startWith = startWith_1.startWith;
  

  return module.exports;
});
System.registerDynamic('node_modules/rxjs/util/ArgumentOutOfRangeError.js', [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     * An error thrown when an element was queried at a certain index of an
     * Observable, but no such index or position exists in that sequence.
     *
     * @see {@link elementAt}
     * @see {@link take}
     * @see {@link takeLast}
     *
     * @class ArgumentOutOfRangeError
     */
    var ArgumentOutOfRangeError = function (_super) {
        __extends(ArgumentOutOfRangeError, _super);
        function ArgumentOutOfRangeError() {
            var err = _super.call(this, 'argument out of range');
            this.name = err.name = 'ArgumentOutOfRangeError';
            this.stack = err.stack;
            this.message = err.message;
        }
        return ArgumentOutOfRangeError;
    }(Error);
    exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError;
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/observable/EmptyObservable.js", ["../Observable"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Observable_1 = $__require("../Observable");
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    var EmptyObservable = function (_super) {
        __extends(EmptyObservable, _super);
        function EmptyObservable(scheduler) {
            _super.call(this);
            this.scheduler = scheduler;
        }
        /**
         * Creates an Observable that emits no items to the Observer and immediately
         * emits a complete notification.
         *
         * <span class="informal">Just emits 'complete', and nothing else.
         * </span>
         *
         * <img src="./img/empty.png" width="100%">
         *
         * This static operator is useful for creating a simple Observable that only
         * emits the complete notification. It can be used for composing with other
         * Observables, such as in a {@link mergeMap}.
         *
         * @example <caption>Emit the number 7, then complete.</caption>
         * var result = Rx.Observable.empty().startWith(7);
         * result.subscribe(x => console.log(x));
         *
         * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
         * var interval = Rx.Observable.interval(1000);
         * var result = interval.mergeMap(x =>
         *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
         * );
         * result.subscribe(x => console.log(x));
         *
         * @see {@link create}
         * @see {@link never}
         * @see {@link of}
         * @see {@link throw}
         *
         * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
         * the emission of the complete notification.
         * @return {Observable} An "empty" Observable: emits only the complete
         * notification.
         * @static true
         * @name empty
         * @owner Observable
         */
        EmptyObservable.create = function (scheduler) {
            return new EmptyObservable(scheduler);
        };
        EmptyObservable.dispatch = function (arg) {
            var subscriber = arg.subscriber;
            subscriber.complete();
        };
        EmptyObservable.prototype._subscribe = function (subscriber) {
            var scheduler = this.scheduler;
            if (scheduler) {
                return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
            } else {
                subscriber.complete();
            }
        };
        return EmptyObservable;
    }(Observable_1.Observable);
    exports.EmptyObservable = EmptyObservable;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/take.js', ['../Subscriber', '../util/ArgumentOutOfRangeError', '../observable/EmptyObservable'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require('../Subscriber');
    var ArgumentOutOfRangeError_1 = $__require('../util/ArgumentOutOfRangeError');
    var EmptyObservable_1 = $__require('../observable/EmptyObservable');
    /**
     * Emits only the first `count` values emitted by the source Observable.
     *
     * <span class="informal">Takes the first `count` values from the source, then
     * completes.</span>
     *
     * <img src="./img/take.png" width="100%">
     *
     * `take` returns an Observable that emits only the first `count` values emitted
     * by the source Observable. If the source emits fewer than `count` values then
     * all of its values are emitted. After that, it completes, regardless if the
     * source completes.
     *
     * @example <caption>Take the first 5 seconds of an infinite 1-second interval Observable</caption>
     * var interval = Rx.Observable.interval(1000);
     * var five = interval.take(5);
     * five.subscribe(x => console.log(x));
     *
     * @see {@link takeLast}
     * @see {@link takeUntil}
     * @see {@link takeWhile}
     * @see {@link skip}
     *
     * @throws {ArgumentOutOfRangeError} When using `take(i)`, it delivers an
     * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
     *
     * @param {number} count The maximum number of `next` values to emit.
     * @return {Observable<T>} An Observable that emits only the first `count`
     * values emitted by the source Observable, or all of the values from the source
     * if the source emits fewer than `count` values.
     * @method take
     * @owner Observable
     */
    function take(count) {
        if (count === 0) {
            return new EmptyObservable_1.EmptyObservable();
        } else {
            return this.lift(new TakeOperator(count));
        }
    }
    exports.take = take;
    var TakeOperator = function () {
        function TakeOperator(total) {
            this.total = total;
            if (this.total < 0) {
                throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
            }
        }
        TakeOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new TakeSubscriber(subscriber, this.total));
        };
        return TakeOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var TakeSubscriber = function (_super) {
        __extends(TakeSubscriber, _super);
        function TakeSubscriber(destination, total) {
            _super.call(this, destination);
            this.total = total;
            this.count = 0;
        }
        TakeSubscriber.prototype._next = function (value) {
            var total = this.total;
            if (++this.count <= total) {
                this.destination.next(value);
                if (this.count === total) {
                    this.destination.complete();
                    this.unsubscribe();
                }
            }
        };
        return TakeSubscriber;
    }(Subscriber_1.Subscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/take.js', ['../../Observable', '../../operator/take'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var take_1 = $__require('../../operator/take');
  Observable_1.Observable.prototype.take = take_1.take;
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/OuterSubscriber.js", ["./Subscriber"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require("./Subscriber");
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var OuterSubscriber = function (_super) {
        __extends(OuterSubscriber, _super);
        function OuterSubscriber() {
            _super.apply(this, arguments);
        }
        OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.destination.next(innerValue);
        };
        OuterSubscriber.prototype.notifyError = function (error, innerSub) {
            this.destination.error(error);
        };
        OuterSubscriber.prototype.notifyComplete = function (innerSub) {
            this.destination.complete();
        };
        return OuterSubscriber;
    }(Subscriber_1.Subscriber);
    exports.OuterSubscriber = OuterSubscriber;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/util/isPromise.js', [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function isPromise(value) {
        return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
    }
    exports.isPromise = isPromise;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/symbol/iterator.js', ['../util/root'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var root_1 = $__require('../util/root');
    var Symbol = root_1.root.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.iterator) {
            exports.$$iterator = Symbol.iterator;
        } else if (typeof Symbol.for === 'function') {
            exports.$$iterator = Symbol.for('iterator');
        }
    } else {
        if (root_1.root.Set && typeof new root_1.root.Set()['@@iterator'] === 'function') {
            // Bug for mozilla version
            exports.$$iterator = '@@iterator';
        } else if (root_1.root.Map) {
            // es6-shim specific logic
            var keys = Object.getOwnPropertyNames(root_1.root.Map.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (key !== 'entries' && key !== 'size' && root_1.root.Map.prototype[key] === root_1.root.Map.prototype['entries']) {
                    exports.$$iterator = key;
                    break;
                }
            }
        } else {
            exports.$$iterator = '@@iterator';
        }
    }
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/InnerSubscriber.js", ["./Subscriber"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require("./Subscriber");
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var InnerSubscriber = function (_super) {
        __extends(InnerSubscriber, _super);
        function InnerSubscriber(parent, outerValue, outerIndex) {
            _super.call(this);
            this.parent = parent;
            this.outerValue = outerValue;
            this.outerIndex = outerIndex;
            this.index = 0;
        }
        InnerSubscriber.prototype._next = function (value) {
            this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
        };
        InnerSubscriber.prototype._error = function (error) {
            this.parent.notifyError(error, this);
            this.unsubscribe();
        };
        InnerSubscriber.prototype._complete = function () {
            this.parent.notifyComplete(this);
            this.unsubscribe();
        };
        return InnerSubscriber;
    }(Subscriber_1.Subscriber);
    exports.InnerSubscriber = InnerSubscriber;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/util/subscribeToResult.js', ['./root', './isArray', './isPromise', '../Observable', '../symbol/iterator', '../InnerSubscriber', '../symbol/observable'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var root_1 = $__require('./root');
    var isArray_1 = $__require('./isArray');
    var isPromise_1 = $__require('./isPromise');
    var Observable_1 = $__require('../Observable');
    var iterator_1 = $__require('../symbol/iterator');
    var InnerSubscriber_1 = $__require('../InnerSubscriber');
    var observable_1 = $__require('../symbol/observable');
    function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
        var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
        if (destination.closed) {
            return null;
        }
        if (result instanceof Observable_1.Observable) {
            if (result._isScalar) {
                destination.next(result.value);
                destination.complete();
                return null;
            } else {
                return result.subscribe(destination);
            }
        }
        if (isArray_1.isArray(result)) {
            for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
                destination.next(result[i]);
            }
            if (!destination.closed) {
                destination.complete();
            }
        } else if (isPromise_1.isPromise(result)) {
            result.then(function (value) {
                if (!destination.closed) {
                    destination.next(value);
                    destination.complete();
                }
            }, function (err) {
                return destination.error(err);
            }).then(null, function (err) {
                // Escaping the Promise trap: globally throw unhandled errors
                root_1.root.setTimeout(function () {
                    throw err;
                });
            });
            return destination;
        } else if (typeof result[iterator_1.$$iterator] === 'function') {
            var iterator = result[iterator_1.$$iterator]();
            do {
                var item = iterator.next();
                if (item.done) {
                    destination.complete();
                    break;
                }
                destination.next(item.value);
                if (destination.closed) {
                    break;
                }
            } while (true);
        } else if (typeof result[observable_1.$$observable] === 'function') {
            var obs = result[observable_1.$$observable]();
            if (typeof obs.subscribe !== 'function') {
                destination.error(new Error('invalid observable'));
            } else {
                return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
            }
        } else {
            destination.error(new TypeError('unknown type returned'));
        }
        return null;
    }
    exports.subscribeToResult = subscribeToResult;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/takeUntil.js', ['../OuterSubscriber', '../util/subscribeToResult'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var OuterSubscriber_1 = $__require('../OuterSubscriber');
    var subscribeToResult_1 = $__require('../util/subscribeToResult');
    /**
     * Emits the values emitted by the source Observable until a `notifier`
     * Observable emits a value.
     *
     * <span class="informal">Lets values pass until a second Observable,
     * `notifier`, emits something. Then, it completes.</span>
     *
     * <img src="./img/takeUntil.png" width="100%">
     *
     * `takeUntil` subscribes and begins mirroring the source Observable. It also
     * monitors a second Observable, `notifier` that you provide. If the `notifier`
     * emits a value or a complete notification, the output Observable stops
     * mirroring the source Observable and completes.
     *
     * @example <caption>Tick every second until the first click happens</caption>
     * var interval = Rx.Observable.interval(1000);
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = interval.takeUntil(clicks);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link take}
     * @see {@link takeLast}
     * @see {@link takeWhile}
     * @see {@link skip}
     *
     * @param {Observable} notifier The Observable whose first emitted value will
     * cause the output Observable of `takeUntil` to stop emitting values from the
     * source Observable.
     * @return {Observable<T>} An Observable that emits the values from the source
     * Observable until such time as `notifier` emits its first value.
     * @method takeUntil
     * @owner Observable
     */
    function takeUntil(notifier) {
        return this.lift(new TakeUntilOperator(notifier));
    }
    exports.takeUntil = takeUntil;
    var TakeUntilOperator = function () {
        function TakeUntilOperator(notifier) {
            this.notifier = notifier;
        }
        TakeUntilOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new TakeUntilSubscriber(subscriber, this.notifier));
        };
        return TakeUntilOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var TakeUntilSubscriber = function (_super) {
        __extends(TakeUntilSubscriber, _super);
        function TakeUntilSubscriber(destination, notifier) {
            _super.call(this, destination);
            this.notifier = notifier;
            this.add(subscribeToResult_1.subscribeToResult(this, notifier));
        }
        TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.complete();
        };
        TakeUntilSubscriber.prototype.notifyComplete = function () {
            // noop
        };
        return TakeUntilSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/takeUntil.js', ['../../Observable', '../../operator/takeUntil'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var takeUntil_1 = $__require('../../operator/takeUntil');
  Observable_1.Observable.prototype.takeUntil = takeUntil_1.takeUntil;
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/operator/toArray.js", ["../Subscriber"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require("../Subscriber");
    /**
     * @return {Observable<any[]>|WebSocketSubject<T>|Observable<T>}
     * @method toArray
     * @owner Observable
     */
    function toArray() {
        return this.lift(new ToArrayOperator());
    }
    exports.toArray = toArray;
    var ToArrayOperator = function () {
        function ToArrayOperator() {}
        ToArrayOperator.prototype.call = function (subscriber, source) {
            return source._subscribe(new ToArraySubscriber(subscriber));
        };
        return ToArrayOperator;
    }();
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var ToArraySubscriber = function (_super) {
        __extends(ToArraySubscriber, _super);
        function ToArraySubscriber(destination) {
            _super.call(this, destination);
            this.array = [];
        }
        ToArraySubscriber.prototype._next = function (x) {
            this.array.push(x);
        };
        ToArraySubscriber.prototype._complete = function () {
            this.destination.next(this.array);
            this.destination.complete();
        };
        return ToArraySubscriber;
    }(Subscriber_1.Subscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/toArray.js', ['../../Observable', '../../operator/toArray'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var toArray_1 = $__require('../../operator/toArray');
  Observable_1.Observable.prototype.toArray = toArray_1.toArray;
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/util/isArray.js", [], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  exports.isArray = Array.isArray || function (x) {
    return x && typeof x.length === 'number';
  };
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/util/isObject.js", [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function isObject(x) {
        return x != null && typeof x === 'object';
    }
    exports.isObject = isObject;
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/util/isFunction.js", [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function isFunction(x) {
        return typeof x === 'function';
    }
    exports.isFunction = isFunction;
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/util/tryCatch.js", ["./errorObject"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var errorObject_1 = $__require("./errorObject");
    var tryCatchTarget;
    function tryCatcher() {
        try {
            return tryCatchTarget.apply(this, arguments);
        } catch (e) {
            errorObject_1.errorObject.e = e;
            return errorObject_1.errorObject;
        }
    }
    function tryCatch(fn) {
        tryCatchTarget = fn;
        return tryCatcher;
    }
    exports.tryCatch = tryCatch;
    ;
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/util/errorObject.js", [], true, function ($__require, exports, module) {
  "use strict";
  // typeof any so that it we don't have to cast when comparing a result to the error object

  var define,
      global = this || self,
      GLOBAL = global;
  exports.errorObject = { e: {} };
  

  return module.exports;
});
System.registerDynamic("node_modules/rxjs/util/UnsubscriptionError.js", [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     * An error thrown when one or more errors have occurred during the
     * `unsubscribe` of a {@link Subscription}.
     */
    var UnsubscriptionError = function (_super) {
        __extends(UnsubscriptionError, _super);
        function UnsubscriptionError(errors) {
            _super.call(this);
            this.errors = errors;
            var err = Error.call(this, errors ? errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) {
                return i + 1 + ") " + err.toString();
            }).join('\n  ') : '');
            this.name = err.name = 'UnsubscriptionError';
            this.stack = err.stack;
            this.message = err.message;
        }
        return UnsubscriptionError;
    }(Error);
    exports.UnsubscriptionError = UnsubscriptionError;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/Subscription.js', ['./util/isArray', './util/isObject', './util/isFunction', './util/tryCatch', './util/errorObject', './util/UnsubscriptionError'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var isArray_1 = $__require('./util/isArray');
    var isObject_1 = $__require('./util/isObject');
    var isFunction_1 = $__require('./util/isFunction');
    var tryCatch_1 = $__require('./util/tryCatch');
    var errorObject_1 = $__require('./util/errorObject');
    var UnsubscriptionError_1 = $__require('./util/UnsubscriptionError');
    /**
     * Represents a disposable resource, such as the execution of an Observable. A
     * Subscription has one important method, `unsubscribe`, that takes no argument
     * and just disposes the resource held by the subscription.
     *
     * Additionally, subscriptions may be grouped together through the `add()`
     * method, which will attach a child Subscription to the current Subscription.
     * When a Subscription is unsubscribed, all its children (and its grandchildren)
     * will be unsubscribed as well.
     *
     * @class Subscription
     */
    var Subscription = function () {
        /**
         * @param {function(): void} [unsubscribe] A function describing how to
         * perform the disposal of resources when the `unsubscribe` method is called.
         */
        function Subscription(unsubscribe) {
            /**
             * A flag to indicate whether this Subscription has already been unsubscribed.
             * @type {boolean}
             */
            this.closed = false;
            if (unsubscribe) {
                this._unsubscribe = unsubscribe;
            }
        }
        /**
         * Disposes the resources held by the subscription. May, for instance, cancel
         * an ongoing Observable execution or cancel any other type of work that
         * started when the Subscription was created.
         * @return {void}
         */
        Subscription.prototype.unsubscribe = function () {
            var hasErrors = false;
            var errors;
            if (this.closed) {
                return;
            }
            this.closed = true;
            var _a = this,
                _unsubscribe = _a._unsubscribe,
                _subscriptions = _a._subscriptions;
            this._subscriptions = null;
            if (isFunction_1.isFunction(_unsubscribe)) {
                var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
                if (trial === errorObject_1.errorObject) {
                    hasErrors = true;
                    (errors = errors || []).push(errorObject_1.errorObject.e);
                }
            }
            if (isArray_1.isArray(_subscriptions)) {
                var index = -1;
                var len = _subscriptions.length;
                while (++index < len) {
                    var sub = _subscriptions[index];
                    if (isObject_1.isObject(sub)) {
                        var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                        if (trial === errorObject_1.errorObject) {
                            hasErrors = true;
                            errors = errors || [];
                            var err = errorObject_1.errorObject.e;
                            if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                                errors = errors.concat(err.errors);
                            } else {
                                errors.push(err);
                            }
                        }
                    }
                }
            }
            if (hasErrors) {
                throw new UnsubscriptionError_1.UnsubscriptionError(errors);
            }
        };
        /**
         * Adds a tear down to be called during the unsubscribe() of this
         * Subscription.
         *
         * If the tear down being added is a subscription that is already
         * unsubscribed, is the same reference `add` is being called on, or is
         * `Subscription.EMPTY`, it will not be added.
         *
         * If this subscription is already in an `closed` state, the passed
         * tear down logic will be executed immediately.
         *
         * @param {TeardownLogic} teardown The additional logic to execute on
         * teardown.
         * @return {Subscription} Returns the Subscription used or created to be
         * added to the inner subscriptions list. This Subscription can be used with
         * `remove()` to remove the passed teardown logic from the inner subscriptions
         * list.
         */
        Subscription.prototype.add = function (teardown) {
            if (!teardown || teardown === Subscription.EMPTY) {
                return Subscription.EMPTY;
            }
            if (teardown === this) {
                return this;
            }
            var sub = teardown;
            switch (typeof teardown) {
                case 'function':
                    sub = new Subscription(teardown);
                case 'object':
                    if (sub.closed || typeof sub.unsubscribe !== 'function') {
                        break;
                    } else if (this.closed) {
                        sub.unsubscribe();
                    } else {
                        (this._subscriptions || (this._subscriptions = [])).push(sub);
                    }
                    break;
                default:
                    throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
            }
            return sub;
        };
        /**
         * Removes a Subscription from the internal list of subscriptions that will
         * unsubscribe during the unsubscribe process of this Subscription.
         * @param {Subscription} subscription The subscription to remove.
         * @return {void}
         */
        Subscription.prototype.remove = function (subscription) {
            // HACK: This might be redundant because of the logic in `add()`
            if (subscription == null || subscription === this || subscription === Subscription.EMPTY) {
                return;
            }
            var subscriptions = this._subscriptions;
            if (subscriptions) {
                var subscriptionIndex = subscriptions.indexOf(subscription);
                if (subscriptionIndex !== -1) {
                    subscriptions.splice(subscriptionIndex, 1);
                }
            }
        };
        Subscription.EMPTY = function (empty) {
            empty.closed = true;
            return empty;
        }(new Subscription());
        return Subscription;
    }();
    exports.Subscription = Subscription;
    

    return module.exports;
});
System.registerDynamic("node_modules/rxjs/Observer.js", [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    exports.empty = {
        closed: true,
        next: function (value) {},
        error: function (err) {
            throw err;
        },
        complete: function () {}
    };
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/Subscriber.js', ['./util/isFunction', './Subscription', './Observer', './symbol/rxSubscriber'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var isFunction_1 = $__require('./util/isFunction');
    var Subscription_1 = $__require('./Subscription');
    var Observer_1 = $__require('./Observer');
    var rxSubscriber_1 = $__require('./symbol/rxSubscriber');
    /**
     * Implements the {@link Observer} interface and extends the
     * {@link Subscription} class. While the {@link Observer} is the public API for
     * consuming the values of an {@link Observable}, all Observers get converted to
     * a Subscriber, in order to provide Subscription-like capabilities such as
     * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
     * implementing operators, but it is rarely used as a public API.
     *
     * @class Subscriber<T>
     */
    var Subscriber = function (_super) {
        __extends(Subscriber, _super);
        /**
         * @param {Observer|function(value: T): void} [destinationOrNext] A partially
         * defined Observer or a `next` callback function.
         * @param {function(e: ?any): void} [error] The `error` callback of an
         * Observer.
         * @param {function(): void} [complete] The `complete` callback of an
         * Observer.
         */
        function Subscriber(destinationOrNext, error, complete) {
            _super.call(this);
            this.syncErrorValue = null;
            this.syncErrorThrown = false;
            this.syncErrorThrowable = false;
            this.isStopped = false;
            switch (arguments.length) {
                case 0:
                    this.destination = Observer_1.empty;
                    break;
                case 1:
                    if (!destinationOrNext) {
                        this.destination = Observer_1.empty;
                        break;
                    }
                    if (typeof destinationOrNext === 'object') {
                        if (destinationOrNext instanceof Subscriber) {
                            this.destination = destinationOrNext;
                            this.destination.add(this);
                        } else {
                            this.syncErrorThrowable = true;
                            this.destination = new SafeSubscriber(this, destinationOrNext);
                        }
                        break;
                    }
                default:
                    this.syncErrorThrowable = true;
                    this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                    break;
            }
        }
        Subscriber.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
            return this;
        };
        /**
         * A static factory for a Subscriber, given a (potentially partial) definition
         * of an Observer.
         * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
         * @param {function(e: ?any): void} [error] The `error` callback of an
         * Observer.
         * @param {function(): void} [complete] The `complete` callback of an
         * Observer.
         * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
         * Observer represented by the given arguments.
         */
        Subscriber.create = function (next, error, complete) {
            var subscriber = new Subscriber(next, error, complete);
            subscriber.syncErrorThrowable = false;
            return subscriber;
        };
        /**
         * The {@link Observer} callback to receive notifications of type `next` from
         * the Observable, with a value. The Observable may call this method 0 or more
         * times.
         * @param {T} [value] The `next` value.
         * @return {void}
         */
        Subscriber.prototype.next = function (value) {
            if (!this.isStopped) {
                this._next(value);
            }
        };
        /**
         * The {@link Observer} callback to receive notifications of type `error` from
         * the Observable, with an attached {@link Error}. Notifies the Observer that
         * the Observable has experienced an error condition.
         * @param {any} [err] The `error` exception.
         * @return {void}
         */
        Subscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                this.isStopped = true;
                this._error(err);
            }
        };
        /**
         * The {@link Observer} callback to receive a valueless notification of type
         * `complete` from the Observable. Notifies the Observer that the Observable
         * has finished sending push-based notifications.
         * @return {void}
         */
        Subscriber.prototype.complete = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this._complete();
            }
        };
        Subscriber.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
        };
        Subscriber.prototype._next = function (value) {
            this.destination.next(value);
        };
        Subscriber.prototype._error = function (err) {
            this.destination.error(err);
            this.unsubscribe();
        };
        Subscriber.prototype._complete = function () {
            this.destination.complete();
            this.unsubscribe();
        };
        return Subscriber;
    }(Subscription_1.Subscription);
    exports.Subscriber = Subscriber;
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var SafeSubscriber = function (_super) {
        __extends(SafeSubscriber, _super);
        function SafeSubscriber(_parent, observerOrNext, error, complete) {
            _super.call(this);
            this._parent = _parent;
            var next;
            var context = this;
            if (isFunction_1.isFunction(observerOrNext)) {
                next = observerOrNext;
            } else if (observerOrNext) {
                context = observerOrNext;
                next = observerOrNext.next;
                error = observerOrNext.error;
                complete = observerOrNext.complete;
                if (isFunction_1.isFunction(context.unsubscribe)) {
                    this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = this.unsubscribe.bind(this);
            }
            this._context = context;
            this._next = next;
            this._error = error;
            this._complete = complete;
        }
        SafeSubscriber.prototype.next = function (value) {
            if (!this.isStopped && this._next) {
                var _parent = this._parent;
                if (!_parent.syncErrorThrowable) {
                    this.__tryOrUnsub(this._next, value);
                } else if (this.__tryOrSetError(_parent, this._next, value)) {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var _parent = this._parent;
                if (this._error) {
                    if (!_parent.syncErrorThrowable) {
                        this.__tryOrUnsub(this._error, err);
                        this.unsubscribe();
                    } else {
                        this.__tryOrSetError(_parent, this._error, err);
                        this.unsubscribe();
                    }
                } else if (!_parent.syncErrorThrowable) {
                    this.unsubscribe();
                    throw err;
                } else {
                    _parent.syncErrorValue = err;
                    _parent.syncErrorThrown = true;
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.complete = function () {
            if (!this.isStopped) {
                var _parent = this._parent;
                if (this._complete) {
                    if (!_parent.syncErrorThrowable) {
                        this.__tryOrUnsub(this._complete);
                        this.unsubscribe();
                    } else {
                        this.__tryOrSetError(_parent, this._complete);
                        this.unsubscribe();
                    }
                } else {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
            try {
                fn.call(this._context, value);
            } catch (err) {
                this.unsubscribe();
                throw err;
            }
        };
        SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
            try {
                fn.call(this._context, value);
            } catch (err) {
                parent.syncErrorValue = err;
                parent.syncErrorThrown = true;
                return true;
            }
            return false;
        };
        SafeSubscriber.prototype._unsubscribe = function () {
            var _parent = this._parent;
            this._context = null;
            this._parent = null;
            _parent.unsubscribe();
        };
        return SafeSubscriber;
    }(Subscriber);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/symbol/rxSubscriber.js', ['../util/root'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var root_1 = $__require('../util/root');
    var Symbol = root_1.root.Symbol;
    exports.$$rxSubscriber = typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for('rxSubscriber') : '@@rxSubscriber';
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/util/toSubscriber.js', ['../Subscriber', '../symbol/rxSubscriber'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var Subscriber_1 = $__require('../Subscriber');
    var rxSubscriber_1 = $__require('../symbol/rxSubscriber');
    function toSubscriber(nextOrObserver, error, complete) {
        if (nextOrObserver) {
            if (nextOrObserver instanceof Subscriber_1.Subscriber) {
                return nextOrObserver;
            }
            if (nextOrObserver[rxSubscriber_1.$$rxSubscriber]) {
                return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
            }
        }
        if (!nextOrObserver && !error && !complete) {
            return new Subscriber_1.Subscriber();
        }
        return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
    }
    exports.toSubscriber = toSubscriber;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/symbol/observable.js', ['../util/root'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var root_1 = $__require('../util/root');
    function getSymbolObservable(context) {
        var $$observable;
        var Symbol = context.Symbol;
        if (typeof Symbol === 'function') {
            if (Symbol.observable) {
                $$observable = Symbol.observable;
            } else {
                $$observable = Symbol('observable');
                Symbol.observable = $$observable;
            }
        } else {
            $$observable = '@@observable';
        }
        return $$observable;
    }
    exports.getSymbolObservable = getSymbolObservable;
    exports.$$observable = getSymbolObservable(root_1.root);
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/Observable.js', ['./util/root', './util/toSubscriber', './symbol/observable'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var root_1 = $__require('./util/root');
    var toSubscriber_1 = $__require('./util/toSubscriber');
    var observable_1 = $__require('./symbol/observable');
    /**
     * A representation of any set of values over any amount of time. This the most basic building block
     * of RxJS.
     *
     * @class Observable<T>
     */
    var Observable = function () {
        /**
         * @constructor
         * @param {Function} subscribe the function that is  called when the Observable is
         * initially subscribed to. This function is given a Subscriber, to which new values
         * can be `next`ed, or an `error` method can be called to raise an error, or
         * `complete` can be called to notify of a successful completion.
         */
        function Observable(subscribe) {
            this._isScalar = false;
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }
        /**
         * Creates a new Observable, with this Observable as the source, and the passed
         * operator defined as the new observable's operator.
         * @method lift
         * @param {Operator} operator the operator defining the operation to take on the observable
         * @return {Observable} a new observable with the Operator applied
         */
        Observable.prototype.lift = function (operator) {
            var observable = new Observable();
            observable.source = this;
            observable.operator = operator;
            return observable;
        };
        /**
         * Registers handlers for handling emitted values, error and completions from the observable, and
         *  executes the observable's subscriber function, which will take action to set up the underlying data stream
         * @method subscribe
         * @param {PartialObserver|Function} observerOrNext (optional) either an observer defining all functions to be called,
         *  or the first of three possible handlers, which is the handler for each value emitted from the observable.
         * @param {Function} error (optional) a handler for a terminal event resulting from an error. If no error handler is provided,
         *  the error will be thrown as unhandled
         * @param {Function} complete (optional) a handler for a terminal event resulting from successful completion.
         * @return {ISubscription} a subscription reference to the registered handlers
         */
        Observable.prototype.subscribe = function (observerOrNext, error, complete) {
            var operator = this.operator;
            var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
            if (operator) {
                operator.call(sink, this);
            } else {
                sink.add(this._subscribe(sink));
            }
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
            return sink;
        };
        /**
         * @method forEach
         * @param {Function} next a handler for each value emitted by the observable
         * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
         * @return {Promise} a promise that either resolves on observable completion or
         *  rejects with the handled error
         */
        Observable.prototype.forEach = function (next, PromiseCtor) {
            var _this = this;
            if (!PromiseCtor) {
                if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                    PromiseCtor = root_1.root.Rx.config.Promise;
                } else if (root_1.root.Promise) {
                    PromiseCtor = root_1.root.Promise;
                }
            }
            if (!PromiseCtor) {
                throw new Error('no Promise impl found');
            }
            return new PromiseCtor(function (resolve, reject) {
                var subscription = _this.subscribe(function (value) {
                    if (subscription) {
                        // if there is a subscription, then we can surmise
                        // the next handling is asynchronous. Any errors thrown
                        // need to be rejected explicitly and unsubscribe must be
                        // called manually
                        try {
                            next(value);
                        } catch (err) {
                            reject(err);
                            subscription.unsubscribe();
                        }
                    } else {
                        // if there is NO subscription, then we're getting a nexted
                        // value synchronously during subscription. We can just call it.
                        // If it errors, Observable's `subscribe` will ensure the
                        // unsubscription logic is called, then synchronously rethrow the error.
                        // After that, Promise will trap the error and send it
                        // down the rejection path.
                        next(value);
                    }
                }, reject, resolve);
            });
        };
        Observable.prototype._subscribe = function (subscriber) {
            return this.source.subscribe(subscriber);
        };
        /**
         * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
         * @method Symbol.observable
         * @return {Observable} this instance of the observable
         */
        Observable.prototype[observable_1.$$observable] = function () {
            return this;
        };
        // HACK: Since TypeScript inherits static properties too, we have to
        // fight against TypeScript here so Subject can have a different static create signature
        /**
         * Creates a new cold Observable by calling the Observable constructor
         * @static true
         * @owner Observable
         * @method create
         * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
         * @return {Observable} a new cold observable
         */
        Observable.create = function (subscribe) {
            return new Observable(subscribe);
        };
        return Observable;
    }();
    exports.Observable = Observable;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/util/root.js', [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var objectTypes = {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    };
    exports.root = objectTypes[typeof self] && self || objectTypes[typeof window] && window;
    var freeGlobal = objectTypes[typeof global] && global;
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
        exports.root = freeGlobal;
    }
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/operator/toPromise.js', ['../util/root'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var root_1 = $__require('../util/root');
    /**
     * @param PromiseCtor
     * @return {Promise<T>}
     * @method toPromise
     * @owner Observable
     */
    function toPromise(PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            } else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) {
                return value = x;
            }, function (err) {
                return reject(err);
            }, function () {
                return resolve(value);
            });
        });
    }
    exports.toPromise = toPromise;
    

    return module.exports;
});
System.registerDynamic('node_modules/rxjs/add/operator/toPromise.js', ['../../Observable', '../../operator/toPromise'], true, function ($__require, exports, module) {
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('../../Observable');
  var toPromise_1 = $__require('../../operator/toPromise');
  Observable_1.Observable.prototype.toPromise = toPromise_1.toPromise;
  

  return module.exports;
});