System.register("_@angular/core/src/linker/component_factory", ["_@angular/core/src/facade/errors", "_@angular/core/src/linker/view_utils"], function($__export) {
  "use strict";
  var __extends,
      unimplemented,
      ViewUtils,
      ComponentRef,
      ComponentRef_,
      EMPTY_CONTEXT,
      ComponentFactory;
  return {
    setters: [function($__m) {
      unimplemented = $__m.unimplemented;
    }, function($__m) {
      ViewUtils = $__m.ViewUtils;
    }],
    execute: function() {
      __extends = (this && this.__extends) || function(d, b) {
        for (var p in b)
          if (b.hasOwnProperty(p))
            d[p] = b[p];
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      ComponentRef = (function() {
        function ComponentRef() {}
        Object.defineProperty(ComponentRef.prototype, "location", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ComponentRef.prototype, "injector", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ComponentRef.prototype, "instance", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(ComponentRef.prototype, "hostView", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(ComponentRef.prototype, "changeDetectorRef", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ComponentRef.prototype, "componentType", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        return ComponentRef;
      }());
      $__export("ComponentRef", ComponentRef);
      ComponentRef_ = (function(_super) {
        __extends(ComponentRef_, _super);
        function ComponentRef_(_hostElement, _componentType) {
          _super.call(this);
          this._hostElement = _hostElement;
          this._componentType = _componentType;
        }
        Object.defineProperty(ComponentRef_.prototype, "location", {
          get: function() {
            return this._hostElement.elementRef;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ComponentRef_.prototype, "injector", {
          get: function() {
            return this._hostElement.injector;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ComponentRef_.prototype, "instance", {
          get: function() {
            return this._hostElement.component;
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(ComponentRef_.prototype, "hostView", {
          get: function() {
            return this._hostElement.parentView.ref;
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(ComponentRef_.prototype, "changeDetectorRef", {
          get: function() {
            return this._hostElement.parentView.ref;
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(ComponentRef_.prototype, "componentType", {
          get: function() {
            return this._componentType;
          },
          enumerable: true,
          configurable: true
        });
        ComponentRef_.prototype.destroy = function() {
          this._hostElement.parentView.destroy();
        };
        ComponentRef_.prototype.onDestroy = function(callback) {
          this.hostView.onDestroy(callback);
        };
        return ComponentRef_;
      }(ComponentRef));
      $__export("ComponentRef_", ComponentRef_);
      EMPTY_CONTEXT = new Object();
      ComponentFactory = (function() {
        function ComponentFactory(selector, _viewFactory, _componentType) {
          this.selector = selector;
          this._viewFactory = _viewFactory;
          this._componentType = _componentType;
        }
        Object.defineProperty(ComponentFactory.prototype, "componentType", {
          get: function() {
            return this._componentType;
          },
          enumerable: true,
          configurable: true
        });
        ComponentFactory.prototype.create = function(injector, projectableNodes, rootSelectorOrNode) {
          if (projectableNodes === void 0) {
            projectableNodes = null;
          }
          if (rootSelectorOrNode === void 0) {
            rootSelectorOrNode = null;
          }
          var vu = injector.get(ViewUtils);
          if (!projectableNodes) {
            projectableNodes = [];
          }
          var hostView = this._viewFactory(vu, injector, null);
          var hostElement = hostView.create(EMPTY_CONTEXT, projectableNodes, rootSelectorOrNode);
          return new ComponentRef_(hostElement, this._componentType);
        };
        return ComponentFactory;
      }());
      $__export("ComponentFactory", ComponentFactory);
    }
  };
});

System.register("_@angular/core/src/linker/component_factory_resolver", ["_@angular/core/src/facade/errors", "_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var __extends,
      BaseError,
      stringify,
      NoComponentFactoryError,
      _NullComponentFactoryResolver,
      ComponentFactoryResolver,
      CodegenComponentFactoryResolver;
  return {
    setters: [function($__m) {
      BaseError = $__m.BaseError;
    }, function($__m) {
      stringify = $__m.stringify;
    }],
    execute: function() {
      __extends = (this && this.__extends) || function(d, b) {
        for (var p in b)
          if (b.hasOwnProperty(p))
            d[p] = b[p];
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      NoComponentFactoryError = (function(_super) {
        __extends(NoComponentFactoryError, _super);
        function NoComponentFactoryError(component) {
          _super.call(this, "No component factory found for " + stringify(component));
          this.component = component;
        }
        return NoComponentFactoryError;
      }(BaseError));
      $__export("NoComponentFactoryError", NoComponentFactoryError);
      _NullComponentFactoryResolver = (function() {
        function _NullComponentFactoryResolver() {}
        _NullComponentFactoryResolver.prototype.resolveComponentFactory = function(component) {
          throw new NoComponentFactoryError(component);
        };
        return _NullComponentFactoryResolver;
      }());
      ComponentFactoryResolver = (function() {
        function ComponentFactoryResolver() {}
        ComponentFactoryResolver.NULL = new _NullComponentFactoryResolver();
        return ComponentFactoryResolver;
      }());
      $__export("ComponentFactoryResolver", ComponentFactoryResolver);
      CodegenComponentFactoryResolver = (function() {
        function CodegenComponentFactoryResolver(factories, _parent) {
          this._parent = _parent;
          this._factories = new Map();
          for (var i = 0; i < factories.length; i++) {
            var factory = factories[i];
            this._factories.set(factory.componentType, factory);
          }
        }
        CodegenComponentFactoryResolver.prototype.resolveComponentFactory = function(component) {
          var result = this._factories.get(component);
          if (!result) {
            result = this._parent.resolveComponentFactory(component);
          }
          return result;
        };
        return CodegenComponentFactoryResolver;
      }());
      $__export("CodegenComponentFactoryResolver", CodegenComponentFactoryResolver);
    }
  };
});

System.register("_@angular/core/src/linker/ng_module_factory", ["_@angular/core/src/di/injector", "_@angular/core/src/facade/errors", "_@angular/core/src/facade/lang", "_@angular/core/src/linker/component_factory_resolver"], function($__export) {
  "use strict";
  var __extends,
      Injector,
      THROW_IF_NOT_FOUND,
      unimplemented,
      stringify,
      CodegenComponentFactoryResolver,
      ComponentFactoryResolver,
      NgModuleRef,
      NgModuleFactory,
      _UNDEFINED,
      NgModuleInjector;
  return {
    setters: [function($__m) {
      Injector = $__m.Injector;
      THROW_IF_NOT_FOUND = $__m.THROW_IF_NOT_FOUND;
    }, function($__m) {
      unimplemented = $__m.unimplemented;
    }, function($__m) {
      stringify = $__m.stringify;
    }, function($__m) {
      CodegenComponentFactoryResolver = $__m.CodegenComponentFactoryResolver;
      ComponentFactoryResolver = $__m.ComponentFactoryResolver;
    }],
    execute: function() {
      __extends = (this && this.__extends) || function(d, b) {
        for (var p in b)
          if (b.hasOwnProperty(p))
            d[p] = b[p];
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      NgModuleRef = (function() {
        function NgModuleRef() {}
        Object.defineProperty(NgModuleRef.prototype, "injector", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(NgModuleRef.prototype, "componentFactoryResolver", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(NgModuleRef.prototype, "instance", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        return NgModuleRef;
      }());
      $__export("NgModuleRef", NgModuleRef);
      NgModuleFactory = (function() {
        function NgModuleFactory(_injectorClass, _moduleType) {
          this._injectorClass = _injectorClass;
          this._moduleType = _moduleType;
        }
        Object.defineProperty(NgModuleFactory.prototype, "moduleType", {
          get: function() {
            return this._moduleType;
          },
          enumerable: true,
          configurable: true
        });
        NgModuleFactory.prototype.create = function(parentInjector) {
          if (!parentInjector) {
            parentInjector = Injector.NULL;
          }
          var instance = new this._injectorClass(parentInjector);
          instance.create();
          return instance;
        };
        return NgModuleFactory;
      }());
      $__export("NgModuleFactory", NgModuleFactory);
      _UNDEFINED = new Object();
      NgModuleInjector = (function(_super) {
        __extends(NgModuleInjector, _super);
        function NgModuleInjector(parent, factories, bootstrapFactories) {
          _super.call(this, factories, parent.get(ComponentFactoryResolver, ComponentFactoryResolver.NULL));
          this.parent = parent;
          this.bootstrapFactories = bootstrapFactories;
          this._destroyListeners = [];
          this._destroyed = false;
        }
        NgModuleInjector.prototype.create = function() {
          this.instance = this.createInternal();
        };
        NgModuleInjector.prototype.get = function(token, notFoundValue) {
          if (notFoundValue === void 0) {
            notFoundValue = THROW_IF_NOT_FOUND;
          }
          if (token === Injector || token === ComponentFactoryResolver) {
            return this;
          }
          var result = this.getInternal(token, _UNDEFINED);
          return result === _UNDEFINED ? this.parent.get(token, notFoundValue) : result;
        };
        Object.defineProperty(NgModuleInjector.prototype, "injector", {
          get: function() {
            return this;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(NgModuleInjector.prototype, "componentFactoryResolver", {
          get: function() {
            return this;
          },
          enumerable: true,
          configurable: true
        });
        NgModuleInjector.prototype.destroy = function() {
          if (this._destroyed) {
            throw new Error("The ng module " + stringify(this.instance.constructor) + " has already been destroyed.");
          }
          this._destroyed = true;
          this.destroyInternal();
          this._destroyListeners.forEach(function(listener) {
            return listener();
          });
        };
        NgModuleInjector.prototype.onDestroy = function(callback) {
          this._destroyListeners.push(callback);
        };
        return NgModuleInjector;
      }(CodegenComponentFactoryResolver));
      $__export("NgModuleInjector", NgModuleInjector);
    }
  };
});

System.register("_@angular/core/src/animation/animation_group_player", ["_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var isPresent,
      scheduleMicroTask,
      AnimationGroupPlayer;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      scheduleMicroTask = $__m.scheduleMicroTask;
    }],
    execute: function() {
      AnimationGroupPlayer = (function() {
        function AnimationGroupPlayer(_players) {
          var _this = this;
          this._players = _players;
          this._onDoneFns = [];
          this._onStartFns = [];
          this._finished = false;
          this._started = false;
          this.parentPlayer = null;
          var count = 0;
          var total = this._players.length;
          if (total == 0) {
            scheduleMicroTask(function() {
              return _this._onFinish();
            });
          } else {
            this._players.forEach(function(player) {
              player.parentPlayer = _this;
              player.onDone(function() {
                if (++count >= total) {
                  _this._onFinish();
                }
              });
            });
          }
        }
        AnimationGroupPlayer.prototype._onFinish = function() {
          if (!this._finished) {
            this._finished = true;
            if (!isPresent(this.parentPlayer)) {
              this.destroy();
            }
            this._onDoneFns.forEach(function(fn) {
              return fn();
            });
            this._onDoneFns = [];
          }
        };
        AnimationGroupPlayer.prototype.init = function() {
          this._players.forEach(function(player) {
            return player.init();
          });
        };
        AnimationGroupPlayer.prototype.onStart = function(fn) {
          this._onStartFns.push(fn);
        };
        AnimationGroupPlayer.prototype.onDone = function(fn) {
          this._onDoneFns.push(fn);
        };
        AnimationGroupPlayer.prototype.hasStarted = function() {
          return this._started;
        };
        AnimationGroupPlayer.prototype.play = function() {
          if (!isPresent(this.parentPlayer)) {
            this.init();
          }
          if (!this.hasStarted()) {
            this._onStartFns.forEach(function(fn) {
              return fn();
            });
            this._onStartFns = [];
            this._started = true;
          }
          this._players.forEach(function(player) {
            return player.play();
          });
        };
        AnimationGroupPlayer.prototype.pause = function() {
          this._players.forEach(function(player) {
            return player.pause();
          });
        };
        AnimationGroupPlayer.prototype.restart = function() {
          this._players.forEach(function(player) {
            return player.restart();
          });
        };
        AnimationGroupPlayer.prototype.finish = function() {
          this._onFinish();
          this._players.forEach(function(player) {
            return player.finish();
          });
        };
        AnimationGroupPlayer.prototype.destroy = function() {
          this._onFinish();
          this._players.forEach(function(player) {
            return player.destroy();
          });
        };
        AnimationGroupPlayer.prototype.reset = function() {
          this._players.forEach(function(player) {
            return player.reset();
          });
        };
        AnimationGroupPlayer.prototype.setPosition = function(p) {
          this._players.forEach(function(player) {
            player.setPosition(p);
          });
        };
        AnimationGroupPlayer.prototype.getPosition = function() {
          var min = 0;
          this._players.forEach(function(player) {
            var p = player.getPosition();
            min = Math.min(p, min);
          });
          return min;
        };
        return AnimationGroupPlayer;
      }());
      $__export("AnimationGroupPlayer", AnimationGroupPlayer);
    }
  };
});

System.register("_@angular/core/src/animation/view_animation_map", ["_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var isPresent,
      ViewAnimationMap;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
    }],
    execute: function() {
      ViewAnimationMap = (function() {
        function ViewAnimationMap() {
          this._map = new Map();
          this._allPlayers = [];
        }
        ViewAnimationMap.prototype.find = function(element, animationName) {
          var playersByAnimation = this._map.get(element);
          if (isPresent(playersByAnimation)) {
            return playersByAnimation[animationName];
          }
        };
        ViewAnimationMap.prototype.findAllPlayersByElement = function(element) {
          var el = this._map.get(element);
          return el ? Object.keys(el).map(function(k) {
            return el[k];
          }) : [];
        };
        ViewAnimationMap.prototype.set = function(element, animationName, player) {
          var playersByAnimation = this._map.get(element);
          if (!isPresent(playersByAnimation)) {
            playersByAnimation = {};
          }
          var existingEntry = playersByAnimation[animationName];
          if (isPresent(existingEntry)) {
            this.remove(element, animationName);
          }
          playersByAnimation[animationName] = player;
          this._allPlayers.push(player);
          this._map.set(element, playersByAnimation);
        };
        ViewAnimationMap.prototype.getAllPlayers = function() {
          return this._allPlayers;
        };
        ViewAnimationMap.prototype.remove = function(element, animationName) {
          var playersByAnimation = this._map.get(element);
          if (playersByAnimation) {
            var player = playersByAnimation[animationName];
            delete playersByAnimation[animationName];
            var index = this._allPlayers.indexOf(player);
            this._allPlayers.splice(index, 1);
            if (Object.keys(playersByAnimation).length === 0) {
              this._map.delete(element);
            }
          }
        };
        return ViewAnimationMap;
      }());
      $__export("ViewAnimationMap", ViewAnimationMap);
    }
  };
});

System.register("_@angular/core/src/linker/animation_view_context", ["_@angular/core/src/animation/animation_group_player", "_@angular/core/src/animation/animation_queue", "_@angular/core/src/animation/view_animation_map"], function($__export) {
  "use strict";
  var AnimationGroupPlayer,
      queueAnimationGlobally,
      ViewAnimationMap,
      AnimationViewContext;
  return {
    setters: [function($__m) {
      AnimationGroupPlayer = $__m.AnimationGroupPlayer;
    }, function($__m) {
      queueAnimationGlobally = $__m.queueAnimation;
    }, function($__m) {
      ViewAnimationMap = $__m.ViewAnimationMap;
    }],
    execute: function() {
      AnimationViewContext = (function() {
        function AnimationViewContext() {
          this._players = new ViewAnimationMap();
        }
        AnimationViewContext.prototype.onAllActiveAnimationsDone = function(callback) {
          var activeAnimationPlayers = this._players.getAllPlayers();
          if (activeAnimationPlayers.length) {
            new AnimationGroupPlayer(activeAnimationPlayers).onDone(function() {
              return callback();
            });
          } else {
            callback();
          }
        };
        AnimationViewContext.prototype.queueAnimation = function(element, animationName, player) {
          queueAnimationGlobally(player);
          this._players.set(element, animationName, player);
        };
        AnimationViewContext.prototype.cancelActiveAnimation = function(element, animationName, removeAllAnimations) {
          if (removeAllAnimations === void 0) {
            removeAllAnimations = false;
          }
          if (removeAllAnimations) {
            this._players.findAllPlayersByElement(element).forEach(function(player) {
              return player.destroy();
            });
          } else {
            var player = this._players.find(element, animationName);
            if (player) {
              player.destroy();
            }
          }
        };
        return AnimationViewContext;
      }());
      $__export("AnimationViewContext", AnimationViewContext);
    }
  };
});

System.register("_@angular/core/src/linker/debug_context", ["_@angular/core/src/facade/lang", "_@angular/core/src/linker/view_type"], function($__export) {
  "use strict";
  var isBlank,
      isPresent,
      ViewType,
      StaticNodeDebugInfo,
      DebugContext;
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      ViewType = $__m.ViewType;
    }],
    execute: function() {
      StaticNodeDebugInfo = (function() {
        function StaticNodeDebugInfo(providerTokens, componentToken, refTokens) {
          this.providerTokens = providerTokens;
          this.componentToken = componentToken;
          this.refTokens = refTokens;
        }
        return StaticNodeDebugInfo;
      }());
      $__export("StaticNodeDebugInfo", StaticNodeDebugInfo);
      DebugContext = (function() {
        function DebugContext(_view, _nodeIndex, _tplRow, _tplCol) {
          this._view = _view;
          this._nodeIndex = _nodeIndex;
          this._tplRow = _tplRow;
          this._tplCol = _tplCol;
        }
        Object.defineProperty(DebugContext.prototype, "_staticNodeInfo", {
          get: function() {
            return isPresent(this._nodeIndex) ? this._view.staticNodeDebugInfos[this._nodeIndex] : null;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "context", {
          get: function() {
            return this._view.context;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "component", {
          get: function() {
            var staticNodeInfo = this._staticNodeInfo;
            if (isPresent(staticNodeInfo) && isPresent(staticNodeInfo.componentToken)) {
              return this.injector.get(staticNodeInfo.componentToken);
            }
            return null;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "componentRenderElement", {
          get: function() {
            var componentView = this._view;
            while (isPresent(componentView.declarationAppElement) && componentView.type !== ViewType.COMPONENT) {
              componentView = componentView.declarationAppElement.parentView;
            }
            return isPresent(componentView.declarationAppElement) ? componentView.declarationAppElement.nativeElement : null;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "injector", {
          get: function() {
            return this._view.injector(this._nodeIndex);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "renderNode", {
          get: function() {
            if (isPresent(this._nodeIndex) && this._view.allNodes) {
              return this._view.allNodes[this._nodeIndex];
            } else {
              return null;
            }
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "providerTokens", {
          get: function() {
            var staticNodeInfo = this._staticNodeInfo;
            return isPresent(staticNodeInfo) ? staticNodeInfo.providerTokens : null;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "source", {
          get: function() {
            return this._view.componentType.templateUrl + ":" + this._tplRow + ":" + this._tplCol;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "references", {
          get: function() {
            var _this = this;
            var varValues = {};
            var staticNodeInfo = this._staticNodeInfo;
            if (isPresent(staticNodeInfo)) {
              var refs = staticNodeInfo.refTokens;
              Object.keys(refs).forEach(function(refName) {
                var refToken = refs[refName];
                var varValue;
                if (isBlank(refToken)) {
                  varValue = _this._view.allNodes ? _this._view.allNodes[_this._nodeIndex] : null;
                } else {
                  varValue = _this._view.injectorGet(refToken, _this._nodeIndex, null);
                }
                varValues[refName] = varValue;
              });
            }
            return varValues;
          },
          enumerable: true,
          configurable: true
        });
        return DebugContext;
      }());
      $__export("DebugContext", DebugContext);
    }
  };
});

System.register("_@angular/core/src/linker/element_injector", ["_@angular/core/src/di/injector"], function($__export) {
  "use strict";
  var __extends,
      Injector,
      THROW_IF_NOT_FOUND,
      _UNDEFINED,
      ElementInjector;
  return {
    setters: [function($__m) {
      Injector = $__m.Injector;
      THROW_IF_NOT_FOUND = $__m.THROW_IF_NOT_FOUND;
    }],
    execute: function() {
      __extends = (this && this.__extends) || function(d, b) {
        for (var p in b)
          if (b.hasOwnProperty(p))
            d[p] = b[p];
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      _UNDEFINED = new Object();
      ElementInjector = (function(_super) {
        __extends(ElementInjector, _super);
        function ElementInjector(_view, _nodeIndex) {
          _super.call(this);
          this._view = _view;
          this._nodeIndex = _nodeIndex;
        }
        ElementInjector.prototype.get = function(token, notFoundValue) {
          if (notFoundValue === void 0) {
            notFoundValue = THROW_IF_NOT_FOUND;
          }
          var result = _UNDEFINED;
          if (result === _UNDEFINED) {
            result = this._view.injectorGet(token, this._nodeIndex, _UNDEFINED);
          }
          if (result === _UNDEFINED) {
            result = this._view.parentInjector.get(token, notFoundValue);
          }
          return result;
        };
        return ElementInjector;
      }(Injector));
      $__export("ElementInjector", ElementInjector);
    }
  };
});

System.register("_@angular/core/src/animation/animation_queue", [], function($__export) {
  "use strict";
  var _queuedAnimations;
  function queueAnimation(player) {
    _queuedAnimations.push(player);
  }
  function triggerQueuedAnimations() {
    for (var i = 0; i < _queuedAnimations.length; i++) {
      var player = _queuedAnimations[i];
      player.play();
    }
    _queuedAnimations = [];
  }
  $__export("queueAnimation", queueAnimation);
  $__export("triggerQueuedAnimations", triggerQueuedAnimations);
  return {
    setters: [],
    execute: function() {
      _queuedAnimations = [];
    }
  };
});

System.register("_@angular/core/src/linker/view_ref", ["_@angular/core/src/animation/animation_queue", "_@angular/core/src/change_detection/constants", "_@angular/core/src/facade/errors"], function($__export) {
  "use strict";
  var __extends,
      triggerQueuedAnimations,
      ChangeDetectorStatus,
      unimplemented,
      ViewRef,
      EmbeddedViewRef,
      ViewRef_;
  return {
    setters: [function($__m) {
      triggerQueuedAnimations = $__m.triggerQueuedAnimations;
    }, function($__m) {
      ChangeDetectorStatus = $__m.ChangeDetectorStatus;
    }, function($__m) {
      unimplemented = $__m.unimplemented;
    }],
    execute: function() {
      __extends = (this && this.__extends) || function(d, b) {
        for (var p in b)
          if (b.hasOwnProperty(p))
            d[p] = b[p];
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      ViewRef = (function() {
        function ViewRef() {}
        Object.defineProperty(ViewRef.prototype, "destroyed", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        return ViewRef;
      }());
      $__export("ViewRef", ViewRef);
      EmbeddedViewRef = (function(_super) {
        __extends(EmbeddedViewRef, _super);
        function EmbeddedViewRef() {
          _super.apply(this, arguments);
        }
        Object.defineProperty(EmbeddedViewRef.prototype, "context", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(EmbeddedViewRef.prototype, "rootNodes", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        ;
        return EmbeddedViewRef;
      }(ViewRef));
      $__export("EmbeddedViewRef", EmbeddedViewRef);
      ViewRef_ = (function() {
        function ViewRef_(_view) {
          this._view = _view;
          this._view = _view;
          this._originalMode = this._view.cdMode;
        }
        Object.defineProperty(ViewRef_.prototype, "internalView", {
          get: function() {
            return this._view;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ViewRef_.prototype, "rootNodes", {
          get: function() {
            return this._view.flatRootNodes;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ViewRef_.prototype, "context", {
          get: function() {
            return this._view.context;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ViewRef_.prototype, "destroyed", {
          get: function() {
            return this._view.destroyed;
          },
          enumerable: true,
          configurable: true
        });
        ViewRef_.prototype.markForCheck = function() {
          this._view.markPathToRootAsCheckOnce();
        };
        ViewRef_.prototype.detach = function() {
          this._view.cdMode = ChangeDetectorStatus.Detached;
        };
        ViewRef_.prototype.detectChanges = function() {
          this._view.detectChanges(false);
          triggerQueuedAnimations();
        };
        ViewRef_.prototype.checkNoChanges = function() {
          this._view.detectChanges(true);
        };
        ViewRef_.prototype.reattach = function() {
          this._view.cdMode = this._originalMode;
          this.markForCheck();
        };
        ViewRef_.prototype.onDestroy = function(callback) {
          this._view.disposables.push(callback);
        };
        ViewRef_.prototype.destroy = function() {
          this._view.destroy();
        };
        return ViewRef_;
      }());
      $__export("ViewRef_", ViewRef_);
    }
  };
});

System.register("_@angular/core/src/application_tokens", ["_@angular/core/src/di"], function($__export) {
  "use strict";
  var OpaqueToken,
      APP_ID,
      APP_ID_RANDOM_PROVIDER,
      PLATFORM_INITIALIZER,
      APP_BOOTSTRAP_LISTENER,
      PACKAGE_ROOT_URL;
  function _appIdRandomProviderFactory() {
    return "" + _randomChar() + _randomChar() + _randomChar();
  }
  function _randomChar() {
    return String.fromCharCode(97 + Math.floor(Math.random() * 25));
  }
  $__export("_appIdRandomProviderFactory", _appIdRandomProviderFactory);
  return {
    setters: [function($__m) {
      OpaqueToken = $__m.OpaqueToken;
    }],
    execute: function() {
      APP_ID = new OpaqueToken('AppId');
      $__export("APP_ID", APP_ID);
      APP_ID_RANDOM_PROVIDER = {
        provide: APP_ID,
        useFactory: _appIdRandomProviderFactory,
        deps: []
      };
      $__export("APP_ID_RANDOM_PROVIDER", APP_ID_RANDOM_PROVIDER);
      PLATFORM_INITIALIZER = new OpaqueToken('Platform Initializer');
      $__export("PLATFORM_INITIALIZER", PLATFORM_INITIALIZER);
      APP_BOOTSTRAP_LISTENER = new OpaqueToken('appBootstrapListener');
      $__export("APP_BOOTSTRAP_LISTENER", APP_BOOTSTRAP_LISTENER);
      PACKAGE_ROOT_URL = new OpaqueToken('Application Packages Root URL');
      $__export("PACKAGE_ROOT_URL", PACKAGE_ROOT_URL);
    }
  };
});

System.register("_@angular/core/src/change_detection/differs/default_iterable_differ", ["_@angular/core/src/facade/collection", "_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var isListLikeIterable,
      iterateListLike,
      isBlank,
      looseIdentical,
      stringify,
      DefaultIterableDifferFactory,
      trackByIdentity,
      DefaultIterableDiffer,
      CollectionChangeRecord,
      _DuplicateItemRecordList,
      _DuplicateMap;
  function getPreviousIndex(item, addRemoveOffset, moveOffsets) {
    var previousIndex = item.previousIndex;
    if (previousIndex === null)
      return previousIndex;
    var moveOffset = 0;
    if (moveOffsets && previousIndex < moveOffsets.length) {
      moveOffset = moveOffsets[previousIndex];
    }
    return previousIndex + addRemoveOffset + moveOffset;
  }
  return {
    setters: [function($__m) {
      isListLikeIterable = $__m.isListLikeIterable;
      iterateListLike = $__m.iterateListLike;
    }, function($__m) {
      isBlank = $__m.isBlank;
      looseIdentical = $__m.looseIdentical;
      stringify = $__m.stringify;
    }],
    execute: function() {
      DefaultIterableDifferFactory = (function() {
        function DefaultIterableDifferFactory() {}
        DefaultIterableDifferFactory.prototype.supports = function(obj) {
          return isListLikeIterable(obj);
        };
        DefaultIterableDifferFactory.prototype.create = function(cdRef, trackByFn) {
          return new DefaultIterableDiffer(trackByFn);
        };
        return DefaultIterableDifferFactory;
      }());
      $__export("DefaultIterableDifferFactory", DefaultIterableDifferFactory);
      trackByIdentity = function(index, item) {
        return item;
      };
      DefaultIterableDiffer = (function() {
        function DefaultIterableDiffer(_trackByFn) {
          this._trackByFn = _trackByFn;
          this._length = null;
          this._collection = null;
          this._linkedRecords = null;
          this._unlinkedRecords = null;
          this._previousItHead = null;
          this._itHead = null;
          this._itTail = null;
          this._additionsHead = null;
          this._additionsTail = null;
          this._movesHead = null;
          this._movesTail = null;
          this._removalsHead = null;
          this._removalsTail = null;
          this._identityChangesHead = null;
          this._identityChangesTail = null;
          this._trackByFn = this._trackByFn || trackByIdentity;
        }
        Object.defineProperty(DefaultIterableDiffer.prototype, "collection", {
          get: function() {
            return this._collection;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(DefaultIterableDiffer.prototype, "length", {
          get: function() {
            return this._length;
          },
          enumerable: true,
          configurable: true
        });
        DefaultIterableDiffer.prototype.forEachItem = function(fn) {
          var record;
          for (record = this._itHead; record !== null; record = record._next) {
            fn(record);
          }
        };
        DefaultIterableDiffer.prototype.forEachOperation = function(fn) {
          var nextIt = this._itHead;
          var nextRemove = this._removalsHead;
          var addRemoveOffset = 0;
          var moveOffsets = null;
          while (nextIt || nextRemove) {
            var record = !nextRemove || nextIt && nextIt.currentIndex < getPreviousIndex(nextRemove, addRemoveOffset, moveOffsets) ? nextIt : nextRemove;
            var adjPreviousIndex = getPreviousIndex(record, addRemoveOffset, moveOffsets);
            var currentIndex = record.currentIndex;
            if (record === nextRemove) {
              addRemoveOffset--;
              nextRemove = nextRemove._nextRemoved;
            } else {
              nextIt = nextIt._next;
              if (record.previousIndex == null) {
                addRemoveOffset++;
              } else {
                if (!moveOffsets)
                  moveOffsets = [];
                var localMovePreviousIndex = adjPreviousIndex - addRemoveOffset;
                var localCurrentIndex = currentIndex - addRemoveOffset;
                if (localMovePreviousIndex != localCurrentIndex) {
                  for (var i = 0; i < localMovePreviousIndex; i++) {
                    var offset = i < moveOffsets.length ? moveOffsets[i] : (moveOffsets[i] = 0);
                    var index = offset + i;
                    if (localCurrentIndex <= index && index < localMovePreviousIndex) {
                      moveOffsets[i] = offset + 1;
                    }
                  }
                  var previousIndex = record.previousIndex;
                  moveOffsets[previousIndex] = localCurrentIndex - localMovePreviousIndex;
                }
              }
            }
            if (adjPreviousIndex !== currentIndex) {
              fn(record, adjPreviousIndex, currentIndex);
            }
          }
        };
        DefaultIterableDiffer.prototype.forEachPreviousItem = function(fn) {
          var record;
          for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
            fn(record);
          }
        };
        DefaultIterableDiffer.prototype.forEachAddedItem = function(fn) {
          var record;
          for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            fn(record);
          }
        };
        DefaultIterableDiffer.prototype.forEachMovedItem = function(fn) {
          var record;
          for (record = this._movesHead; record !== null; record = record._nextMoved) {
            fn(record);
          }
        };
        DefaultIterableDiffer.prototype.forEachRemovedItem = function(fn) {
          var record;
          for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
            fn(record);
          }
        };
        DefaultIterableDiffer.prototype.forEachIdentityChange = function(fn) {
          var record;
          for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
            fn(record);
          }
        };
        DefaultIterableDiffer.prototype.diff = function(collection) {
          if (isBlank(collection))
            collection = [];
          if (!isListLikeIterable(collection)) {
            throw new Error("Error trying to diff '" + collection + "'");
          }
          if (this.check(collection)) {
            return this;
          } else {
            return null;
          }
        };
        DefaultIterableDiffer.prototype.onDestroy = function() {};
        DefaultIterableDiffer.prototype.check = function(collection) {
          var _this = this;
          this._reset();
          var record = this._itHead;
          var mayBeDirty = false;
          var index;
          var item;
          var itemTrackBy;
          if (Array.isArray(collection)) {
            var list = collection;
            this._length = collection.length;
            for (var index_1 = 0; index_1 < this._length; index_1++) {
              item = list[index_1];
              itemTrackBy = this._trackByFn(index_1, item);
              if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
                record = this._mismatch(record, item, itemTrackBy, index_1);
                mayBeDirty = true;
              } else {
                if (mayBeDirty) {
                  record = this._verifyReinsertion(record, item, itemTrackBy, index_1);
                }
                if (!looseIdentical(record.item, item))
                  this._addIdentityChange(record, item);
              }
              record = record._next;
            }
          } else {
            index = 0;
            iterateListLike(collection, function(item) {
              itemTrackBy = _this._trackByFn(index, item);
              if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
                record = _this._mismatch(record, item, itemTrackBy, index);
                mayBeDirty = true;
              } else {
                if (mayBeDirty) {
                  record = _this._verifyReinsertion(record, item, itemTrackBy, index);
                }
                if (!looseIdentical(record.item, item))
                  _this._addIdentityChange(record, item);
              }
              record = record._next;
              index++;
            });
            this._length = index;
          }
          this._truncate(record);
          this._collection = collection;
          return this.isDirty;
        };
        Object.defineProperty(DefaultIterableDiffer.prototype, "isDirty", {
          get: function() {
            return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null;
          },
          enumerable: true,
          configurable: true
        });
        DefaultIterableDiffer.prototype._reset = function() {
          if (this.isDirty) {
            var record;
            var nextRecord;
            for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
              record._nextPrevious = record._next;
            }
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
              record.previousIndex = record.currentIndex;
            }
            this._additionsHead = this._additionsTail = null;
            for (record = this._movesHead; record !== null; record = nextRecord) {
              record.previousIndex = record.currentIndex;
              nextRecord = record._nextMoved;
            }
            this._movesHead = this._movesTail = null;
            this._removalsHead = this._removalsTail = null;
            this._identityChangesHead = this._identityChangesTail = null;
          }
        };
        DefaultIterableDiffer.prototype._mismatch = function(record, item, itemTrackBy, index) {
          var previousRecord;
          if (record === null) {
            previousRecord = this._itTail;
          } else {
            previousRecord = record._prev;
            this._remove(record);
          }
          record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
          if (record !== null) {
            if (!looseIdentical(record.item, item))
              this._addIdentityChange(record, item);
            this._moveAfter(record, previousRecord, index);
          } else {
            record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
            if (record !== null) {
              if (!looseIdentical(record.item, item))
                this._addIdentityChange(record, item);
              this._reinsertAfter(record, previousRecord, index);
            } else {
              record = this._addAfter(new CollectionChangeRecord(item, itemTrackBy), previousRecord, index);
            }
          }
          return record;
        };
        DefaultIterableDiffer.prototype._verifyReinsertion = function(record, item, itemTrackBy, index) {
          var reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
          if (reinsertRecord !== null) {
            record = this._reinsertAfter(reinsertRecord, record._prev, index);
          } else if (record.currentIndex != index) {
            record.currentIndex = index;
            this._addToMoves(record, index);
          }
          return record;
        };
        DefaultIterableDiffer.prototype._truncate = function(record) {
          while (record !== null) {
            var nextRecord = record._next;
            this._addToRemovals(this._unlink(record));
            record = nextRecord;
          }
          if (this._unlinkedRecords !== null) {
            this._unlinkedRecords.clear();
          }
          if (this._additionsTail !== null) {
            this._additionsTail._nextAdded = null;
          }
          if (this._movesTail !== null) {
            this._movesTail._nextMoved = null;
          }
          if (this._itTail !== null) {
            this._itTail._next = null;
          }
          if (this._removalsTail !== null) {
            this._removalsTail._nextRemoved = null;
          }
          if (this._identityChangesTail !== null) {
            this._identityChangesTail._nextIdentityChange = null;
          }
        };
        DefaultIterableDiffer.prototype._reinsertAfter = function(record, prevRecord, index) {
          if (this._unlinkedRecords !== null) {
            this._unlinkedRecords.remove(record);
          }
          var prev = record._prevRemoved;
          var next = record._nextRemoved;
          if (prev === null) {
            this._removalsHead = next;
          } else {
            prev._nextRemoved = next;
          }
          if (next === null) {
            this._removalsTail = prev;
          } else {
            next._prevRemoved = prev;
          }
          this._insertAfter(record, prevRecord, index);
          this._addToMoves(record, index);
          return record;
        };
        DefaultIterableDiffer.prototype._moveAfter = function(record, prevRecord, index) {
          this._unlink(record);
          this._insertAfter(record, prevRecord, index);
          this._addToMoves(record, index);
          return record;
        };
        DefaultIterableDiffer.prototype._addAfter = function(record, prevRecord, index) {
          this._insertAfter(record, prevRecord, index);
          if (this._additionsTail === null) {
            this._additionsTail = this._additionsHead = record;
          } else {
            this._additionsTail = this._additionsTail._nextAdded = record;
          }
          return record;
        };
        DefaultIterableDiffer.prototype._insertAfter = function(record, prevRecord, index) {
          var next = prevRecord === null ? this._itHead : prevRecord._next;
          record._next = next;
          record._prev = prevRecord;
          if (next === null) {
            this._itTail = record;
          } else {
            next._prev = record;
          }
          if (prevRecord === null) {
            this._itHead = record;
          } else {
            prevRecord._next = record;
          }
          if (this._linkedRecords === null) {
            this._linkedRecords = new _DuplicateMap();
          }
          this._linkedRecords.put(record);
          record.currentIndex = index;
          return record;
        };
        DefaultIterableDiffer.prototype._remove = function(record) {
          return this._addToRemovals(this._unlink(record));
        };
        DefaultIterableDiffer.prototype._unlink = function(record) {
          if (this._linkedRecords !== null) {
            this._linkedRecords.remove(record);
          }
          var prev = record._prev;
          var next = record._next;
          if (prev === null) {
            this._itHead = next;
          } else {
            prev._next = next;
          }
          if (next === null) {
            this._itTail = prev;
          } else {
            next._prev = prev;
          }
          return record;
        };
        DefaultIterableDiffer.prototype._addToMoves = function(record, toIndex) {
          if (record.previousIndex === toIndex) {
            return record;
          }
          if (this._movesTail === null) {
            this._movesTail = this._movesHead = record;
          } else {
            this._movesTail = this._movesTail._nextMoved = record;
          }
          return record;
        };
        DefaultIterableDiffer.prototype._addToRemovals = function(record) {
          if (this._unlinkedRecords === null) {
            this._unlinkedRecords = new _DuplicateMap();
          }
          this._unlinkedRecords.put(record);
          record.currentIndex = null;
          record._nextRemoved = null;
          if (this._removalsTail === null) {
            this._removalsTail = this._removalsHead = record;
            record._prevRemoved = null;
          } else {
            record._prevRemoved = this._removalsTail;
            this._removalsTail = this._removalsTail._nextRemoved = record;
          }
          return record;
        };
        DefaultIterableDiffer.prototype._addIdentityChange = function(record, item) {
          record.item = item;
          if (this._identityChangesTail === null) {
            this._identityChangesTail = this._identityChangesHead = record;
          } else {
            this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
          }
          return record;
        };
        DefaultIterableDiffer.prototype.toString = function() {
          var list = [];
          this.forEachItem(function(record) {
            return list.push(record);
          });
          var previous = [];
          this.forEachPreviousItem(function(record) {
            return previous.push(record);
          });
          var additions = [];
          this.forEachAddedItem(function(record) {
            return additions.push(record);
          });
          var moves = [];
          this.forEachMovedItem(function(record) {
            return moves.push(record);
          });
          var removals = [];
          this.forEachRemovedItem(function(record) {
            return removals.push(record);
          });
          var identityChanges = [];
          this.forEachIdentityChange(function(record) {
            return identityChanges.push(record);
          });
          return 'collection: ' + list.join(', ') + '\n' + 'previous: ' + previous.join(', ') + '\n' + 'additions: ' + additions.join(', ') + '\n' + 'moves: ' + moves.join(', ') + '\n' + 'removals: ' + removals.join(', ') + '\n' + 'identityChanges: ' + identityChanges.join(', ') + '\n';
        };
        return DefaultIterableDiffer;
      }());
      $__export("DefaultIterableDiffer", DefaultIterableDiffer);
      CollectionChangeRecord = (function() {
        function CollectionChangeRecord(item, trackById) {
          this.item = item;
          this.trackById = trackById;
          this.currentIndex = null;
          this.previousIndex = null;
          this._nextPrevious = null;
          this._prev = null;
          this._next = null;
          this._prevDup = null;
          this._nextDup = null;
          this._prevRemoved = null;
          this._nextRemoved = null;
          this._nextAdded = null;
          this._nextMoved = null;
          this._nextIdentityChange = null;
        }
        CollectionChangeRecord.prototype.toString = function() {
          return this.previousIndex === this.currentIndex ? stringify(this.item) : stringify(this.item) + '[' + stringify(this.previousIndex) + '->' + stringify(this.currentIndex) + ']';
        };
        return CollectionChangeRecord;
      }());
      $__export("CollectionChangeRecord", CollectionChangeRecord);
      _DuplicateItemRecordList = (function() {
        function _DuplicateItemRecordList() {
          this._head = null;
          this._tail = null;
        }
        _DuplicateItemRecordList.prototype.add = function(record) {
          if (this._head === null) {
            this._head = this._tail = record;
            record._nextDup = null;
            record._prevDup = null;
          } else {
            this._tail._nextDup = record;
            record._prevDup = this._tail;
            record._nextDup = null;
            this._tail = record;
          }
        };
        _DuplicateItemRecordList.prototype.get = function(trackById, afterIndex) {
          var record;
          for (record = this._head; record !== null; record = record._nextDup) {
            if ((afterIndex === null || afterIndex < record.currentIndex) && looseIdentical(record.trackById, trackById)) {
              return record;
            }
          }
          return null;
        };
        _DuplicateItemRecordList.prototype.remove = function(record) {
          var prev = record._prevDup;
          var next = record._nextDup;
          if (prev === null) {
            this._head = next;
          } else {
            prev._nextDup = next;
          }
          if (next === null) {
            this._tail = prev;
          } else {
            next._prevDup = prev;
          }
          return this._head === null;
        };
        return _DuplicateItemRecordList;
      }());
      _DuplicateMap = (function() {
        function _DuplicateMap() {
          this.map = new Map();
        }
        _DuplicateMap.prototype.put = function(record) {
          var key = record.trackById;
          var duplicates = this.map.get(key);
          if (!duplicates) {
            duplicates = new _DuplicateItemRecordList();
            this.map.set(key, duplicates);
          }
          duplicates.add(record);
        };
        _DuplicateMap.prototype.get = function(trackById, afterIndex) {
          if (afterIndex === void 0) {
            afterIndex = null;
          }
          var key = trackById;
          var recordList = this.map.get(key);
          return recordList ? recordList.get(trackById, afterIndex) : null;
        };
        _DuplicateMap.prototype.remove = function(record) {
          var key = record.trackById;
          var recordList = this.map.get(key);
          if (recordList.remove(record)) {
            this.map.delete(key);
          }
          return record;
        };
        Object.defineProperty(_DuplicateMap.prototype, "isEmpty", {
          get: function() {
            return this.map.size === 0;
          },
          enumerable: true,
          configurable: true
        });
        _DuplicateMap.prototype.clear = function() {
          this.map.clear();
        };
        _DuplicateMap.prototype.toString = function() {
          return '_DuplicateMap(' + stringify(this.map) + ')';
        };
        return _DuplicateMap;
      }());
    }
  };
});

System.register("_@angular/core/src/change_detection/differs/default_keyvalue_differ", ["_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var isJsObject,
      looseIdentical,
      stringify,
      DefaultKeyValueDifferFactory,
      DefaultKeyValueDiffer,
      KeyValueChangeRecord;
  return {
    setters: [function($__m) {
      isJsObject = $__m.isJsObject;
      looseIdentical = $__m.looseIdentical;
      stringify = $__m.stringify;
    }],
    execute: function() {
      DefaultKeyValueDifferFactory = (function() {
        function DefaultKeyValueDifferFactory() {}
        DefaultKeyValueDifferFactory.prototype.supports = function(obj) {
          return obj instanceof Map || isJsObject(obj);
        };
        DefaultKeyValueDifferFactory.prototype.create = function(cdRef) {
          return new DefaultKeyValueDiffer();
        };
        return DefaultKeyValueDifferFactory;
      }());
      $__export("DefaultKeyValueDifferFactory", DefaultKeyValueDifferFactory);
      DefaultKeyValueDiffer = (function() {
        function DefaultKeyValueDiffer() {
          this._records = new Map();
          this._mapHead = null;
          this._previousMapHead = null;
          this._changesHead = null;
          this._changesTail = null;
          this._additionsHead = null;
          this._additionsTail = null;
          this._removalsHead = null;
          this._removalsTail = null;
        }
        Object.defineProperty(DefaultKeyValueDiffer.prototype, "isDirty", {
          get: function() {
            return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null;
          },
          enumerable: true,
          configurable: true
        });
        DefaultKeyValueDiffer.prototype.forEachItem = function(fn) {
          var record;
          for (record = this._mapHead; record !== null; record = record._next) {
            fn(record);
          }
        };
        DefaultKeyValueDiffer.prototype.forEachPreviousItem = function(fn) {
          var record;
          for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
            fn(record);
          }
        };
        DefaultKeyValueDiffer.prototype.forEachChangedItem = function(fn) {
          var record;
          for (record = this._changesHead; record !== null; record = record._nextChanged) {
            fn(record);
          }
        };
        DefaultKeyValueDiffer.prototype.forEachAddedItem = function(fn) {
          var record;
          for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            fn(record);
          }
        };
        DefaultKeyValueDiffer.prototype.forEachRemovedItem = function(fn) {
          var record;
          for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
            fn(record);
          }
        };
        DefaultKeyValueDiffer.prototype.diff = function(map) {
          if (!map) {
            map = new Map();
          } else if (!(map instanceof Map || isJsObject(map))) {
            throw new Error("Error trying to diff '" + map + "'");
          }
          return this.check(map) ? this : null;
        };
        DefaultKeyValueDiffer.prototype.onDestroy = function() {};
        DefaultKeyValueDiffer.prototype.check = function(map) {
          var _this = this;
          this._reset();
          var records = this._records;
          var oldSeqRecord = this._mapHead;
          var lastOldSeqRecord = null;
          var lastNewSeqRecord = null;
          var seqChanged = false;
          this._forEach(map, function(value, key) {
            var newSeqRecord;
            if (oldSeqRecord && key === oldSeqRecord.key) {
              newSeqRecord = oldSeqRecord;
              _this._maybeAddToChanges(newSeqRecord, value);
            } else {
              seqChanged = true;
              if (oldSeqRecord !== null) {
                _this._removeFromSeq(lastOldSeqRecord, oldSeqRecord);
                _this._addToRemovals(oldSeqRecord);
              }
              if (records.has(key)) {
                newSeqRecord = records.get(key);
                _this._maybeAddToChanges(newSeqRecord, value);
              } else {
                newSeqRecord = new KeyValueChangeRecord(key);
                records.set(key, newSeqRecord);
                newSeqRecord.currentValue = value;
                _this._addToAdditions(newSeqRecord);
              }
            }
            if (seqChanged) {
              if (_this._isInRemovals(newSeqRecord)) {
                _this._removeFromRemovals(newSeqRecord);
              }
              if (lastNewSeqRecord == null) {
                _this._mapHead = newSeqRecord;
              } else {
                lastNewSeqRecord._next = newSeqRecord;
              }
            }
            lastOldSeqRecord = oldSeqRecord;
            lastNewSeqRecord = newSeqRecord;
            oldSeqRecord = oldSeqRecord && oldSeqRecord._next;
          });
          this._truncate(lastOldSeqRecord, oldSeqRecord);
          return this.isDirty;
        };
        DefaultKeyValueDiffer.prototype._reset = function() {
          if (this.isDirty) {
            var record = void 0;
            for (record = this._previousMapHead = this._mapHead; record !== null; record = record._next) {
              record._nextPrevious = record._next;
            }
            for (record = this._changesHead; record !== null; record = record._nextChanged) {
              record.previousValue = record.currentValue;
            }
            for (record = this._additionsHead; record != null; record = record._nextAdded) {
              record.previousValue = record.currentValue;
            }
            this._changesHead = this._changesTail = null;
            this._additionsHead = this._additionsTail = null;
            this._removalsHead = this._removalsTail = null;
          }
        };
        DefaultKeyValueDiffer.prototype._truncate = function(lastRecord, record) {
          while (record !== null) {
            if (lastRecord === null) {
              this._mapHead = null;
            } else {
              lastRecord._next = null;
            }
            var nextRecord = record._next;
            this._addToRemovals(record);
            lastRecord = record;
            record = nextRecord;
          }
          for (var rec = this._removalsHead; rec !== null; rec = rec._nextRemoved) {
            rec.previousValue = rec.currentValue;
            rec.currentValue = null;
            this._records.delete(rec.key);
          }
        };
        DefaultKeyValueDiffer.prototype._maybeAddToChanges = function(record, newValue) {
          if (!looseIdentical(newValue, record.currentValue)) {
            record.previousValue = record.currentValue;
            record.currentValue = newValue;
            this._addToChanges(record);
          }
        };
        DefaultKeyValueDiffer.prototype._isInRemovals = function(record) {
          return record === this._removalsHead || record._nextRemoved !== null || record._prevRemoved !== null;
        };
        DefaultKeyValueDiffer.prototype._addToRemovals = function(record) {
          if (this._removalsHead === null) {
            this._removalsHead = this._removalsTail = record;
          } else {
            this._removalsTail._nextRemoved = record;
            record._prevRemoved = this._removalsTail;
            this._removalsTail = record;
          }
        };
        DefaultKeyValueDiffer.prototype._removeFromSeq = function(prev, record) {
          var next = record._next;
          if (prev === null) {
            this._mapHead = next;
          } else {
            prev._next = next;
          }
          record._next = null;
        };
        DefaultKeyValueDiffer.prototype._removeFromRemovals = function(record) {
          var prev = record._prevRemoved;
          var next = record._nextRemoved;
          if (prev === null) {
            this._removalsHead = next;
          } else {
            prev._nextRemoved = next;
          }
          if (next === null) {
            this._removalsTail = prev;
          } else {
            next._prevRemoved = prev;
          }
          record._prevRemoved = record._nextRemoved = null;
        };
        DefaultKeyValueDiffer.prototype._addToAdditions = function(record) {
          if (this._additionsHead === null) {
            this._additionsHead = this._additionsTail = record;
          } else {
            this._additionsTail._nextAdded = record;
            this._additionsTail = record;
          }
        };
        DefaultKeyValueDiffer.prototype._addToChanges = function(record) {
          if (this._changesHead === null) {
            this._changesHead = this._changesTail = record;
          } else {
            this._changesTail._nextChanged = record;
            this._changesTail = record;
          }
        };
        DefaultKeyValueDiffer.prototype.toString = function() {
          var items = [];
          var previous = [];
          var changes = [];
          var additions = [];
          var removals = [];
          var record;
          for (record = this._mapHead; record !== null; record = record._next) {
            items.push(stringify(record));
          }
          for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
            previous.push(stringify(record));
          }
          for (record = this._changesHead; record !== null; record = record._nextChanged) {
            changes.push(stringify(record));
          }
          for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            additions.push(stringify(record));
          }
          for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
            removals.push(stringify(record));
          }
          return 'map: ' + items.join(', ') + '\n' + 'previous: ' + previous.join(', ') + '\n' + 'additions: ' + additions.join(', ') + '\n' + 'changes: ' + changes.join(', ') + '\n' + 'removals: ' + removals.join(', ') + '\n';
        };
        DefaultKeyValueDiffer.prototype._forEach = function(obj, fn) {
          if (obj instanceof Map) {
            obj.forEach(fn);
          } else {
            Object.keys(obj).forEach(function(k) {
              return fn(obj[k], k);
            });
          }
        };
        return DefaultKeyValueDiffer;
      }());
      $__export("DefaultKeyValueDiffer", DefaultKeyValueDiffer);
      KeyValueChangeRecord = (function() {
        function KeyValueChangeRecord(key) {
          this.key = key;
          this.previousValue = null;
          this.currentValue = null;
          this._nextPrevious = null;
          this._next = null;
          this._nextAdded = null;
          this._nextRemoved = null;
          this._prevRemoved = null;
          this._nextChanged = null;
        }
        KeyValueChangeRecord.prototype.toString = function() {
          return looseIdentical(this.previousValue, this.currentValue) ? stringify(this.key) : (stringify(this.key) + '[' + stringify(this.previousValue) + '->' + stringify(this.currentValue) + ']');
        };
        return KeyValueChangeRecord;
      }());
      $__export("KeyValueChangeRecord", KeyValueChangeRecord);
    }
  };
});

System.register("_@angular/core/src/change_detection/differs/iterable_differs", ["_@angular/core/src/di", "_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var Optional,
      SkipSelf,
      getTypeNameForDebugging,
      isPresent,
      IterableDiffers;
  return {
    setters: [function($__m) {
      Optional = $__m.Optional;
      SkipSelf = $__m.SkipSelf;
    }, function($__m) {
      getTypeNameForDebugging = $__m.getTypeNameForDebugging;
      isPresent = $__m.isPresent;
    }],
    execute: function() {
      IterableDiffers = (function() {
        function IterableDiffers(factories) {
          this.factories = factories;
        }
        IterableDiffers.create = function(factories, parent) {
          if (isPresent(parent)) {
            var copied = parent.factories.slice();
            factories = factories.concat(copied);
            return new IterableDiffers(factories);
          } else {
            return new IterableDiffers(factories);
          }
        };
        IterableDiffers.extend = function(factories) {
          return {
            provide: IterableDiffers,
            useFactory: function(parent) {
              if (!parent) {
                throw new Error('Cannot extend IterableDiffers without a parent injector');
              }
              return IterableDiffers.create(factories, parent);
            },
            deps: [[IterableDiffers, new SkipSelf(), new Optional()]]
          };
        };
        IterableDiffers.prototype.find = function(iterable) {
          var factory = this.factories.find(function(f) {
            return f.supports(iterable);
          });
          if (isPresent(factory)) {
            return factory;
          } else {
            throw new Error("Cannot find a differ supporting object '" + iterable + "' of type '" + getTypeNameForDebugging(iterable) + "'");
          }
        };
        return IterableDiffers;
      }());
      $__export("IterableDiffers", IterableDiffers);
    }
  };
});

System.register("_@angular/core/src/change_detection/differs/keyvalue_differs", ["_@angular/core/src/di", "_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var Optional,
      SkipSelf,
      isPresent,
      KeyValueDiffers;
  return {
    setters: [function($__m) {
      Optional = $__m.Optional;
      SkipSelf = $__m.SkipSelf;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }],
    execute: function() {
      KeyValueDiffers = (function() {
        function KeyValueDiffers(factories) {
          this.factories = factories;
        }
        KeyValueDiffers.create = function(factories, parent) {
          if (isPresent(parent)) {
            var copied = parent.factories.slice();
            factories = factories.concat(copied);
            return new KeyValueDiffers(factories);
          } else {
            return new KeyValueDiffers(factories);
          }
        };
        KeyValueDiffers.extend = function(factories) {
          return {
            provide: KeyValueDiffers,
            useFactory: function(parent) {
              if (!parent) {
                throw new Error('Cannot extend KeyValueDiffers without a parent injector');
              }
              return KeyValueDiffers.create(factories, parent);
            },
            deps: [[KeyValueDiffers, new SkipSelf(), new Optional()]]
          };
        };
        KeyValueDiffers.prototype.find = function(kv) {
          var factory = this.factories.find(function(f) {
            return f.supports(kv);
          });
          if (isPresent(factory)) {
            return factory;
          } else {
            throw new Error("Cannot find a differ supporting object '" + kv + "'");
          }
        };
        return KeyValueDiffers;
      }());
      $__export("KeyValueDiffers", KeyValueDiffers);
    }
  };
});

System.register("_@angular/core/src/change_detection/change_detector_ref", [], function($__export) {
  "use strict";
  var ChangeDetectorRef;
  return {
    setters: [],
    execute: function() {
      ChangeDetectorRef = (function() {
        function ChangeDetectorRef() {}
        return ChangeDetectorRef;
      }());
      $__export("ChangeDetectorRef", ChangeDetectorRef);
    }
  };
});

System.register("_@angular/core/src/change_detection/constants", ["_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var isBlank,
      ChangeDetectionStrategy,
      ChangeDetectorStatus;
  function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
    return isBlank(changeDetectionStrategy) || changeDetectionStrategy === ChangeDetectionStrategy.Default;
  }
  $__export("isDefaultChangeDetectionStrategy", isDefaultChangeDetectionStrategy);
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
    }],
    execute: function() {
      $__export("ChangeDetectionStrategy", ChangeDetectionStrategy);
      (function(ChangeDetectionStrategy) {
        ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
        ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
      })(ChangeDetectionStrategy || ($__export("ChangeDetectionStrategy", ChangeDetectionStrategy = {})));
      $__export("ChangeDetectorStatus", ChangeDetectorStatus);
      (function(ChangeDetectorStatus) {
        ChangeDetectorStatus[ChangeDetectorStatus["CheckOnce"] = 0] = "CheckOnce";
        ChangeDetectorStatus[ChangeDetectorStatus["Checked"] = 1] = "Checked";
        ChangeDetectorStatus[ChangeDetectorStatus["CheckAlways"] = 2] = "CheckAlways";
        ChangeDetectorStatus[ChangeDetectorStatus["Detached"] = 3] = "Detached";
        ChangeDetectorStatus[ChangeDetectorStatus["Errored"] = 4] = "Errored";
        ChangeDetectorStatus[ChangeDetectorStatus["Destroyed"] = 5] = "Destroyed";
      })(ChangeDetectorStatus || ($__export("ChangeDetectorStatus", ChangeDetectorStatus = {})));
    }
  };
});

System.register("_@angular/core/src/change_detection/change_detection", ["_@angular/core/src/change_detection/differs/default_iterable_differ", "_@angular/core/src/change_detection/differs/default_keyvalue_differ", "_@angular/core/src/change_detection/differs/iterable_differs", "_@angular/core/src/change_detection/differs/keyvalue_differs", "_@angular/core/src/change_detection/change_detection_util", "_@angular/core/src/change_detection/change_detector_ref", "_@angular/core/src/change_detection/constants"], function($__export) {
  "use strict";
  var DefaultIterableDifferFactory,
      DefaultKeyValueDifferFactory,
      IterableDiffers,
      KeyValueDiffers,
      keyValDiff,
      iterableDiff,
      defaultIterableDiffers,
      defaultKeyValueDiffers;
  return {
    setters: [function($__m) {
      DefaultIterableDifferFactory = $__m.DefaultIterableDifferFactory;
      $__export({
        CollectionChangeRecord: $__m.CollectionChangeRecord,
        DefaultIterableDifferFactory: $__m.DefaultIterableDifferFactory,
        DefaultIterableDiffer: $__m.DefaultIterableDiffer
      });
    }, function($__m) {
      DefaultKeyValueDifferFactory = $__m.DefaultKeyValueDifferFactory;
      $__export({
        DefaultKeyValueDifferFactory: $__m.DefaultKeyValueDifferFactory,
        KeyValueChangeRecord: $__m.KeyValueChangeRecord
      });
    }, function($__m) {
      IterableDiffers = $__m.IterableDiffers;
      $__export({IterableDiffers: $__m.IterableDiffers});
    }, function($__m) {
      KeyValueDiffers = $__m.KeyValueDiffers;
      $__export({KeyValueDiffers: $__m.KeyValueDiffers});
    }, function($__m) {
      $__export({
        SimpleChange: $__m.SimpleChange,
        UNINITIALIZED: $__m.UNINITIALIZED,
        ValueUnwrapper: $__m.ValueUnwrapper,
        WrappedValue: $__m.WrappedValue,
        devModeEqual: $__m.devModeEqual,
        looseIdentical: $__m.looseIdentical
      });
    }, function($__m) {
      $__export({ChangeDetectorRef: $__m.ChangeDetectorRef});
    }, function($__m) {
      $__export({
        ChangeDetectionStrategy: $__m.ChangeDetectionStrategy,
        ChangeDetectorStatus: $__m.ChangeDetectorStatus,
        isDefaultChangeDetectionStrategy: $__m.isDefaultChangeDetectionStrategy
      });
    }],
    execute: function() {
      keyValDiff = [new DefaultKeyValueDifferFactory()];
      $__export("keyValDiff", keyValDiff);
      iterableDiff = [new DefaultIterableDifferFactory()];
      $__export("iterableDiff", iterableDiff);
      defaultIterableDiffers = new IterableDiffers(iterableDiff);
      $__export("defaultIterableDiffers", defaultIterableDiffers);
      defaultKeyValueDiffers = new KeyValueDiffers(keyValDiff);
      $__export("defaultKeyValueDiffers", defaultKeyValueDiffers);
    }
  };
});

System.register("_@angular/core/src/di/injector", ["_@angular/core/src/facade/errors", "_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var unimplemented,
      stringify,
      _THROW_IF_NOT_FOUND,
      THROW_IF_NOT_FOUND,
      _NullInjector,
      Injector;
  return {
    setters: [function($__m) {
      unimplemented = $__m.unimplemented;
    }, function($__m) {
      stringify = $__m.stringify;
    }],
    execute: function() {
      _THROW_IF_NOT_FOUND = new Object();
      THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
      $__export("THROW_IF_NOT_FOUND", THROW_IF_NOT_FOUND);
      _NullInjector = (function() {
        function _NullInjector() {}
        _NullInjector.prototype.get = function(token, notFoundValue) {
          if (notFoundValue === void 0) {
            notFoundValue = _THROW_IF_NOT_FOUND;
          }
          if (notFoundValue === _THROW_IF_NOT_FOUND) {
            throw new Error("No provider for " + stringify(token) + "!");
          }
          return notFoundValue;
        };
        return _NullInjector;
      }());
      Injector = (function() {
        function Injector() {}
        Injector.prototype.get = function(token, notFoundValue) {
          return unimplemented();
        };
        Injector.THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
        Injector.NULL = new _NullInjector();
        return Injector;
      }());
      $__export("Injector", Injector);
    }
  };
});

System.register("_@angular/core/src/di/reflective_injector", ["_@angular/core/src/facade/errors", "_@angular/core/src/di/injector", "_@angular/core/src/di/metadata", "_@angular/core/src/di/reflective_errors", "_@angular/core/src/di/reflective_key", "_@angular/core/src/di/reflective_provider"], function($__export) {
  "use strict";
  var unimplemented,
      Injector,
      THROW_IF_NOT_FOUND,
      Self,
      SkipSelf,
      AbstractProviderError,
      CyclicDependencyError,
      InstantiationError,
      NoProviderError,
      OutOfBoundsError,
      ReflectiveKey,
      resolveReflectiveProviders,
      _MAX_CONSTRUCTION_COUNTER,
      UNDEFINED,
      ReflectiveProtoInjectorInlineStrategy,
      ReflectiveProtoInjectorDynamicStrategy,
      ReflectiveProtoInjector,
      ReflectiveInjectorInlineStrategy,
      ReflectiveInjectorDynamicStrategy,
      ReflectiveInjector,
      ReflectiveInjector_,
      INJECTOR_KEY;
  function _mapProviders(injector, fn) {
    var res = new Array(injector._proto.numberOfProviders);
    for (var i = 0; i < injector._proto.numberOfProviders; ++i) {
      res[i] = fn(injector._proto.getProviderAtIndex(i));
    }
    return res;
  }
  return {
    setters: [function($__m) {
      unimplemented = $__m.unimplemented;
    }, function($__m) {
      Injector = $__m.Injector;
      THROW_IF_NOT_FOUND = $__m.THROW_IF_NOT_FOUND;
    }, function($__m) {
      Self = $__m.Self;
      SkipSelf = $__m.SkipSelf;
    }, function($__m) {
      AbstractProviderError = $__m.AbstractProviderError;
      CyclicDependencyError = $__m.CyclicDependencyError;
      InstantiationError = $__m.InstantiationError;
      NoProviderError = $__m.NoProviderError;
      OutOfBoundsError = $__m.OutOfBoundsError;
    }, function($__m) {
      ReflectiveKey = $__m.ReflectiveKey;
    }, function($__m) {
      resolveReflectiveProviders = $__m.resolveReflectiveProviders;
    }],
    execute: function() {
      _MAX_CONSTRUCTION_COUNTER = 10;
      UNDEFINED = new Object();
      ReflectiveProtoInjectorInlineStrategy = (function() {
        function ReflectiveProtoInjectorInlineStrategy(protoEI, providers) {
          this.provider0 = null;
          this.provider1 = null;
          this.provider2 = null;
          this.provider3 = null;
          this.provider4 = null;
          this.provider5 = null;
          this.provider6 = null;
          this.provider7 = null;
          this.provider8 = null;
          this.provider9 = null;
          this.keyId0 = null;
          this.keyId1 = null;
          this.keyId2 = null;
          this.keyId3 = null;
          this.keyId4 = null;
          this.keyId5 = null;
          this.keyId6 = null;
          this.keyId7 = null;
          this.keyId8 = null;
          this.keyId9 = null;
          var length = providers.length;
          if (length > 0) {
            this.provider0 = providers[0];
            this.keyId0 = providers[0].key.id;
          }
          if (length > 1) {
            this.provider1 = providers[1];
            this.keyId1 = providers[1].key.id;
          }
          if (length > 2) {
            this.provider2 = providers[2];
            this.keyId2 = providers[2].key.id;
          }
          if (length > 3) {
            this.provider3 = providers[3];
            this.keyId3 = providers[3].key.id;
          }
          if (length > 4) {
            this.provider4 = providers[4];
            this.keyId4 = providers[4].key.id;
          }
          if (length > 5) {
            this.provider5 = providers[5];
            this.keyId5 = providers[5].key.id;
          }
          if (length > 6) {
            this.provider6 = providers[6];
            this.keyId6 = providers[6].key.id;
          }
          if (length > 7) {
            this.provider7 = providers[7];
            this.keyId7 = providers[7].key.id;
          }
          if (length > 8) {
            this.provider8 = providers[8];
            this.keyId8 = providers[8].key.id;
          }
          if (length > 9) {
            this.provider9 = providers[9];
            this.keyId9 = providers[9].key.id;
          }
        }
        ReflectiveProtoInjectorInlineStrategy.prototype.getProviderAtIndex = function(index) {
          if (index == 0)
            return this.provider0;
          if (index == 1)
            return this.provider1;
          if (index == 2)
            return this.provider2;
          if (index == 3)
            return this.provider3;
          if (index == 4)
            return this.provider4;
          if (index == 5)
            return this.provider5;
          if (index == 6)
            return this.provider6;
          if (index == 7)
            return this.provider7;
          if (index == 8)
            return this.provider8;
          if (index == 9)
            return this.provider9;
          throw new OutOfBoundsError(index);
        };
        ReflectiveProtoInjectorInlineStrategy.prototype.createInjectorStrategy = function(injector) {
          return new ReflectiveInjectorInlineStrategy(injector, this);
        };
        return ReflectiveProtoInjectorInlineStrategy;
      }());
      $__export("ReflectiveProtoInjectorInlineStrategy", ReflectiveProtoInjectorInlineStrategy);
      ReflectiveProtoInjectorDynamicStrategy = (function() {
        function ReflectiveProtoInjectorDynamicStrategy(protoInj, providers) {
          this.providers = providers;
          var len = providers.length;
          this.keyIds = new Array(len);
          for (var i = 0; i < len; i++) {
            this.keyIds[i] = providers[i].key.id;
          }
        }
        ReflectiveProtoInjectorDynamicStrategy.prototype.getProviderAtIndex = function(index) {
          if (index < 0 || index >= this.providers.length) {
            throw new OutOfBoundsError(index);
          }
          return this.providers[index];
        };
        ReflectiveProtoInjectorDynamicStrategy.prototype.createInjectorStrategy = function(ei) {
          return new ReflectiveInjectorDynamicStrategy(this, ei);
        };
        return ReflectiveProtoInjectorDynamicStrategy;
      }());
      $__export("ReflectiveProtoInjectorDynamicStrategy", ReflectiveProtoInjectorDynamicStrategy);
      ReflectiveProtoInjector = (function() {
        function ReflectiveProtoInjector(providers) {
          this.numberOfProviders = providers.length;
          this._strategy = providers.length > _MAX_CONSTRUCTION_COUNTER ? new ReflectiveProtoInjectorDynamicStrategy(this, providers) : new ReflectiveProtoInjectorInlineStrategy(this, providers);
        }
        ReflectiveProtoInjector.fromResolvedProviders = function(providers) {
          return new ReflectiveProtoInjector(providers);
        };
        ReflectiveProtoInjector.prototype.getProviderAtIndex = function(index) {
          return this._strategy.getProviderAtIndex(index);
        };
        return ReflectiveProtoInjector;
      }());
      $__export("ReflectiveProtoInjector", ReflectiveProtoInjector);
      ReflectiveInjectorInlineStrategy = (function() {
        function ReflectiveInjectorInlineStrategy(injector, protoStrategy) {
          this.injector = injector;
          this.protoStrategy = protoStrategy;
          this.obj0 = UNDEFINED;
          this.obj1 = UNDEFINED;
          this.obj2 = UNDEFINED;
          this.obj3 = UNDEFINED;
          this.obj4 = UNDEFINED;
          this.obj5 = UNDEFINED;
          this.obj6 = UNDEFINED;
          this.obj7 = UNDEFINED;
          this.obj8 = UNDEFINED;
          this.obj9 = UNDEFINED;
        }
        ReflectiveInjectorInlineStrategy.prototype.resetConstructionCounter = function() {
          this.injector._constructionCounter = 0;
        };
        ReflectiveInjectorInlineStrategy.prototype.instantiateProvider = function(provider) {
          return this.injector._new(provider);
        };
        ReflectiveInjectorInlineStrategy.prototype.getObjByKeyId = function(keyId) {
          var p = this.protoStrategy;
          var inj = this.injector;
          if (p.keyId0 === keyId) {
            if (this.obj0 === UNDEFINED) {
              this.obj0 = inj._new(p.provider0);
            }
            return this.obj0;
          }
          if (p.keyId1 === keyId) {
            if (this.obj1 === UNDEFINED) {
              this.obj1 = inj._new(p.provider1);
            }
            return this.obj1;
          }
          if (p.keyId2 === keyId) {
            if (this.obj2 === UNDEFINED) {
              this.obj2 = inj._new(p.provider2);
            }
            return this.obj2;
          }
          if (p.keyId3 === keyId) {
            if (this.obj3 === UNDEFINED) {
              this.obj3 = inj._new(p.provider3);
            }
            return this.obj3;
          }
          if (p.keyId4 === keyId) {
            if (this.obj4 === UNDEFINED) {
              this.obj4 = inj._new(p.provider4);
            }
            return this.obj4;
          }
          if (p.keyId5 === keyId) {
            if (this.obj5 === UNDEFINED) {
              this.obj5 = inj._new(p.provider5);
            }
            return this.obj5;
          }
          if (p.keyId6 === keyId) {
            if (this.obj6 === UNDEFINED) {
              this.obj6 = inj._new(p.provider6);
            }
            return this.obj6;
          }
          if (p.keyId7 === keyId) {
            if (this.obj7 === UNDEFINED) {
              this.obj7 = inj._new(p.provider7);
            }
            return this.obj7;
          }
          if (p.keyId8 === keyId) {
            if (this.obj8 === UNDEFINED) {
              this.obj8 = inj._new(p.provider8);
            }
            return this.obj8;
          }
          if (p.keyId9 === keyId) {
            if (this.obj9 === UNDEFINED) {
              this.obj9 = inj._new(p.provider9);
            }
            return this.obj9;
          }
          return UNDEFINED;
        };
        ReflectiveInjectorInlineStrategy.prototype.getObjAtIndex = function(index) {
          if (index == 0)
            return this.obj0;
          if (index == 1)
            return this.obj1;
          if (index == 2)
            return this.obj2;
          if (index == 3)
            return this.obj3;
          if (index == 4)
            return this.obj4;
          if (index == 5)
            return this.obj5;
          if (index == 6)
            return this.obj6;
          if (index == 7)
            return this.obj7;
          if (index == 8)
            return this.obj8;
          if (index == 9)
            return this.obj9;
          throw new OutOfBoundsError(index);
        };
        ReflectiveInjectorInlineStrategy.prototype.getMaxNumberOfObjects = function() {
          return _MAX_CONSTRUCTION_COUNTER;
        };
        return ReflectiveInjectorInlineStrategy;
      }());
      $__export("ReflectiveInjectorInlineStrategy", ReflectiveInjectorInlineStrategy);
      ReflectiveInjectorDynamicStrategy = (function() {
        function ReflectiveInjectorDynamicStrategy(protoStrategy, injector) {
          this.protoStrategy = protoStrategy;
          this.injector = injector;
          this.objs = new Array(protoStrategy.providers.length).fill(UNDEFINED);
        }
        ReflectiveInjectorDynamicStrategy.prototype.resetConstructionCounter = function() {
          this.injector._constructionCounter = 0;
        };
        ReflectiveInjectorDynamicStrategy.prototype.instantiateProvider = function(provider) {
          return this.injector._new(provider);
        };
        ReflectiveInjectorDynamicStrategy.prototype.getObjByKeyId = function(keyId) {
          var p = this.protoStrategy;
          for (var i = 0; i < p.keyIds.length; i++) {
            if (p.keyIds[i] === keyId) {
              if (this.objs[i] === UNDEFINED) {
                this.objs[i] = this.injector._new(p.providers[i]);
              }
              return this.objs[i];
            }
          }
          return UNDEFINED;
        };
        ReflectiveInjectorDynamicStrategy.prototype.getObjAtIndex = function(index) {
          if (index < 0 || index >= this.objs.length) {
            throw new OutOfBoundsError(index);
          }
          return this.objs[index];
        };
        ReflectiveInjectorDynamicStrategy.prototype.getMaxNumberOfObjects = function() {
          return this.objs.length;
        };
        return ReflectiveInjectorDynamicStrategy;
      }());
      $__export("ReflectiveInjectorDynamicStrategy", ReflectiveInjectorDynamicStrategy);
      ReflectiveInjector = (function() {
        function ReflectiveInjector() {}
        ReflectiveInjector.resolve = function(providers) {
          return resolveReflectiveProviders(providers);
        };
        ReflectiveInjector.resolveAndCreate = function(providers, parent) {
          if (parent === void 0) {
            parent = null;
          }
          var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
          return ReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
        };
        ReflectiveInjector.fromResolvedProviders = function(providers, parent) {
          if (parent === void 0) {
            parent = null;
          }
          return new ReflectiveInjector_(ReflectiveProtoInjector.fromResolvedProviders(providers), parent);
        };
        Object.defineProperty(ReflectiveInjector.prototype, "parent", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        ReflectiveInjector.prototype.resolveAndCreateChild = function(providers) {
          return unimplemented();
        };
        ReflectiveInjector.prototype.createChildFromResolved = function(providers) {
          return unimplemented();
        };
        ReflectiveInjector.prototype.resolveAndInstantiate = function(provider) {
          return unimplemented();
        };
        ReflectiveInjector.prototype.instantiateResolved = function(provider) {
          return unimplemented();
        };
        return ReflectiveInjector;
      }());
      $__export("ReflectiveInjector", ReflectiveInjector);
      ReflectiveInjector_ = (function() {
        function ReflectiveInjector_(_proto, _parent) {
          if (_parent === void 0) {
            _parent = null;
          }
          this._constructionCounter = 0;
          this._proto = _proto;
          this._parent = _parent;
          this._strategy = _proto._strategy.createInjectorStrategy(this);
        }
        ReflectiveInjector_.prototype.get = function(token, notFoundValue) {
          if (notFoundValue === void 0) {
            notFoundValue = THROW_IF_NOT_FOUND;
          }
          return this._getByKey(ReflectiveKey.get(token), null, null, notFoundValue);
        };
        ReflectiveInjector_.prototype.getAt = function(index) {
          return this._strategy.getObjAtIndex(index);
        };
        Object.defineProperty(ReflectiveInjector_.prototype, "parent", {
          get: function() {
            return this._parent;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ReflectiveInjector_.prototype, "internalStrategy", {
          get: function() {
            return this._strategy;
          },
          enumerable: true,
          configurable: true
        });
        ReflectiveInjector_.prototype.resolveAndCreateChild = function(providers) {
          var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
          return this.createChildFromResolved(ResolvedReflectiveProviders);
        };
        ReflectiveInjector_.prototype.createChildFromResolved = function(providers) {
          var proto = new ReflectiveProtoInjector(providers);
          var inj = new ReflectiveInjector_(proto);
          inj._parent = this;
          return inj;
        };
        ReflectiveInjector_.prototype.resolveAndInstantiate = function(provider) {
          return this.instantiateResolved(ReflectiveInjector.resolve([provider])[0]);
        };
        ReflectiveInjector_.prototype.instantiateResolved = function(provider) {
          return this._instantiateProvider(provider);
        };
        ReflectiveInjector_.prototype._new = function(provider) {
          if (this._constructionCounter++ > this._strategy.getMaxNumberOfObjects()) {
            throw new CyclicDependencyError(this, provider.key);
          }
          return this._instantiateProvider(provider);
        };
        ReflectiveInjector_.prototype._instantiateProvider = function(provider) {
          if (provider.multiProvider) {
            var res = new Array(provider.resolvedFactories.length);
            for (var i = 0; i < provider.resolvedFactories.length; ++i) {
              res[i] = this._instantiate(provider, provider.resolvedFactories[i]);
            }
            return res;
          } else {
            return this._instantiate(provider, provider.resolvedFactories[0]);
          }
        };
        ReflectiveInjector_.prototype._instantiate = function(provider, ResolvedReflectiveFactory) {
          var factory = ResolvedReflectiveFactory.factory;
          var deps = ResolvedReflectiveFactory.dependencies;
          var length = deps.length;
          var d0;
          var d1;
          var d2;
          var d3;
          var d4;
          var d5;
          var d6;
          var d7;
          var d8;
          var d9;
          var d10;
          var d11;
          var d12;
          var d13;
          var d14;
          var d15;
          var d16;
          var d17;
          var d18;
          var d19;
          try {
            d0 = length > 0 ? this._getByReflectiveDependency(provider, deps[0]) : null;
            d1 = length > 1 ? this._getByReflectiveDependency(provider, deps[1]) : null;
            d2 = length > 2 ? this._getByReflectiveDependency(provider, deps[2]) : null;
            d3 = length > 3 ? this._getByReflectiveDependency(provider, deps[3]) : null;
            d4 = length > 4 ? this._getByReflectiveDependency(provider, deps[4]) : null;
            d5 = length > 5 ? this._getByReflectiveDependency(provider, deps[5]) : null;
            d6 = length > 6 ? this._getByReflectiveDependency(provider, deps[6]) : null;
            d7 = length > 7 ? this._getByReflectiveDependency(provider, deps[7]) : null;
            d8 = length > 8 ? this._getByReflectiveDependency(provider, deps[8]) : null;
            d9 = length > 9 ? this._getByReflectiveDependency(provider, deps[9]) : null;
            d10 = length > 10 ? this._getByReflectiveDependency(provider, deps[10]) : null;
            d11 = length > 11 ? this._getByReflectiveDependency(provider, deps[11]) : null;
            d12 = length > 12 ? this._getByReflectiveDependency(provider, deps[12]) : null;
            d13 = length > 13 ? this._getByReflectiveDependency(provider, deps[13]) : null;
            d14 = length > 14 ? this._getByReflectiveDependency(provider, deps[14]) : null;
            d15 = length > 15 ? this._getByReflectiveDependency(provider, deps[15]) : null;
            d16 = length > 16 ? this._getByReflectiveDependency(provider, deps[16]) : null;
            d17 = length > 17 ? this._getByReflectiveDependency(provider, deps[17]) : null;
            d18 = length > 18 ? this._getByReflectiveDependency(provider, deps[18]) : null;
            d19 = length > 19 ? this._getByReflectiveDependency(provider, deps[19]) : null;
          } catch (e) {
            if (e instanceof AbstractProviderError || e instanceof InstantiationError) {
              e.addKey(this, provider.key);
            }
            throw e;
          }
          var obj;
          try {
            switch (length) {
              case 0:
                obj = factory();
                break;
              case 1:
                obj = factory(d0);
                break;
              case 2:
                obj = factory(d0, d1);
                break;
              case 3:
                obj = factory(d0, d1, d2);
                break;
              case 4:
                obj = factory(d0, d1, d2, d3);
                break;
              case 5:
                obj = factory(d0, d1, d2, d3, d4);
                break;
              case 6:
                obj = factory(d0, d1, d2, d3, d4, d5);
                break;
              case 7:
                obj = factory(d0, d1, d2, d3, d4, d5, d6);
                break;
              case 8:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7);
                break;
              case 9:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8);
                break;
              case 10:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9);
                break;
              case 11:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10);
                break;
              case 12:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11);
                break;
              case 13:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12);
                break;
              case 14:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13);
                break;
              case 15:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14);
                break;
              case 16:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15);
                break;
              case 17:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16);
                break;
              case 18:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17);
                break;
              case 19:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18);
                break;
              case 20:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19);
                break;
              default:
                throw new Error("Cannot instantiate '" + provider.key.displayName + "' because it has more than 20 dependencies");
            }
          } catch (e) {
            throw new InstantiationError(this, e, e.stack, provider.key);
          }
          return obj;
        };
        ReflectiveInjector_.prototype._getByReflectiveDependency = function(provider, dep) {
          return this._getByKey(dep.key, dep.lowerBoundVisibility, dep.upperBoundVisibility, dep.optional ? null : THROW_IF_NOT_FOUND);
        };
        ReflectiveInjector_.prototype._getByKey = function(key, lowerBoundVisibility, upperBoundVisibility, notFoundValue) {
          if (key === INJECTOR_KEY) {
            return this;
          }
          if (upperBoundVisibility instanceof Self) {
            return this._getByKeySelf(key, notFoundValue);
          } else {
            return this._getByKeyDefault(key, notFoundValue, lowerBoundVisibility);
          }
        };
        ReflectiveInjector_.prototype._throwOrNull = function(key, notFoundValue) {
          if (notFoundValue !== THROW_IF_NOT_FOUND) {
            return notFoundValue;
          } else {
            throw new NoProviderError(this, key);
          }
        };
        ReflectiveInjector_.prototype._getByKeySelf = function(key, notFoundValue) {
          var obj = this._strategy.getObjByKeyId(key.id);
          return (obj !== UNDEFINED) ? obj : this._throwOrNull(key, notFoundValue);
        };
        ReflectiveInjector_.prototype._getByKeyDefault = function(key, notFoundValue, lowerBoundVisibility) {
          var inj;
          if (lowerBoundVisibility instanceof SkipSelf) {
            inj = this._parent;
          } else {
            inj = this;
          }
          while (inj instanceof ReflectiveInjector_) {
            var inj_ = inj;
            var obj = inj_._strategy.getObjByKeyId(key.id);
            if (obj !== UNDEFINED)
              return obj;
            inj = inj_._parent;
          }
          if (inj !== null) {
            return inj.get(key.token, notFoundValue);
          } else {
            return this._throwOrNull(key, notFoundValue);
          }
        };
        Object.defineProperty(ReflectiveInjector_.prototype, "displayName", {
          get: function() {
            var providers = _mapProviders(this, function(b) {
              return ' "' + b.key.displayName + '" ';
            }).join(', ');
            return "ReflectiveInjector(providers: [" + providers + "])";
          },
          enumerable: true,
          configurable: true
        });
        ReflectiveInjector_.prototype.toString = function() {
          return this.displayName;
        };
        return ReflectiveInjector_;
      }());
      $__export("ReflectiveInjector_", ReflectiveInjector_);
      INJECTOR_KEY = ReflectiveKey.get(Injector);
    }
  };
});

System.register("_@angular/core/src/reflection/reflection_capabilities", ["_@angular/core/src/facade/lang", "_@angular/core/src/type"], function($__export) {
  "use strict";
  var global,
      isPresent,
      stringify,
      Type,
      ReflectionCapabilities;
  function convertTsickleDecoratorIntoMetadata(decoratorInvocations) {
    if (!decoratorInvocations) {
      return [];
    }
    return decoratorInvocations.map(function(decoratorInvocation) {
      var decoratorType = decoratorInvocation.type;
      var annotationCls = decoratorType.annotationCls;
      var annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
      return new (annotationCls.bind.apply(annotationCls, [void 0].concat(annotationArgs)))();
    });
  }
  return {
    setters: [function($__m) {
      global = $__m.global;
      isPresent = $__m.isPresent;
      stringify = $__m.stringify;
    }, function($__m) {
      Type = $__m.Type;
    }],
    execute: function() {
      ReflectionCapabilities = (function() {
        function ReflectionCapabilities(reflect) {
          this._reflect = reflect || global.Reflect;
        }
        ReflectionCapabilities.prototype.isReflectionEnabled = function() {
          return true;
        };
        ReflectionCapabilities.prototype.factory = function(t) {
          return function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i - 0] = arguments[_i];
            }
            return new (t.bind.apply(t, [void 0].concat(args)))();
          };
        };
        ReflectionCapabilities.prototype._zipTypesAndAnnotations = function(paramTypes, paramAnnotations) {
          var result;
          if (typeof paramTypes === 'undefined') {
            result = new Array(paramAnnotations.length);
          } else {
            result = new Array(paramTypes.length);
          }
          for (var i = 0; i < result.length; i++) {
            if (typeof paramTypes === 'undefined') {
              result[i] = [];
            } else if (paramTypes[i] != Object) {
              result[i] = [paramTypes[i]];
            } else {
              result[i] = [];
            }
            if (paramAnnotations && isPresent(paramAnnotations[i])) {
              result[i] = result[i].concat(paramAnnotations[i]);
            }
          }
          return result;
        };
        ReflectionCapabilities.prototype.parameters = function(type) {
          if (type.parameters) {
            return type.parameters;
          }
          if (type.ctorParameters) {
            var ctorParameters = type.ctorParameters;
            var paramTypes = ctorParameters.map(function(ctorParam) {
              return ctorParam && ctorParam.type;
            });
            var paramAnnotations = ctorParameters.map(function(ctorParam) {
              return ctorParam && convertTsickleDecoratorIntoMetadata(ctorParam.decorators);
            });
            return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
          }
          if (isPresent(this._reflect) && isPresent(this._reflect.getMetadata)) {
            var paramAnnotations = this._reflect.getMetadata('parameters', type);
            var paramTypes = this._reflect.getMetadata('design:paramtypes', type);
            if (paramTypes || paramAnnotations) {
              return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
            }
          }
          return new Array(type.length).fill(undefined);
        };
        ReflectionCapabilities.prototype.annotations = function(typeOrFunc) {
          if (typeOrFunc.annotations) {
            var annotations = typeOrFunc.annotations;
            if (typeof annotations === 'function' && annotations.annotations) {
              annotations = annotations.annotations;
            }
            return annotations;
          }
          if (typeOrFunc.decorators) {
            return convertTsickleDecoratorIntoMetadata(typeOrFunc.decorators);
          }
          if (this._reflect && this._reflect.getMetadata) {
            var annotations = this._reflect.getMetadata('annotations', typeOrFunc);
            if (annotations)
              return annotations;
          }
          return [];
        };
        ReflectionCapabilities.prototype.propMetadata = function(typeOrFunc) {
          if (typeOrFunc.propMetadata) {
            var propMetadata = typeOrFunc.propMetadata;
            if (typeof propMetadata === 'function' && propMetadata.propMetadata) {
              propMetadata = propMetadata.propMetadata;
            }
            return propMetadata;
          }
          if (typeOrFunc.propDecorators) {
            var propDecorators_1 = typeOrFunc.propDecorators;
            var propMetadata_1 = {};
            Object.keys(propDecorators_1).forEach(function(prop) {
              propMetadata_1[prop] = convertTsickleDecoratorIntoMetadata(propDecorators_1[prop]);
            });
            return propMetadata_1;
          }
          if (this._reflect && this._reflect.getMetadata) {
            var propMetadata = this._reflect.getMetadata('propMetadata', typeOrFunc);
            if (propMetadata)
              return propMetadata;
          }
          return {};
        };
        ReflectionCapabilities.prototype.hasLifecycleHook = function(type, lcProperty) {
          return type instanceof Type && lcProperty in type.prototype;
        };
        ReflectionCapabilities.prototype.getter = function(name) {
          return new Function('o', 'return o.' + name + ';');
        };
        ReflectionCapabilities.prototype.setter = function(name) {
          return new Function('o', 'v', 'return o.' + name + ' = v;');
        };
        ReflectionCapabilities.prototype.method = function(name) {
          var functionBody = "if (!o." + name + ") throw new Error('\"" + name + "\" is undefined');\n        return o." + name + ".apply(o, args);";
          return new Function('o', 'args', functionBody);
        };
        ReflectionCapabilities.prototype.importUri = function(type) {
          if ((typeof type === 'undefined' ? 'undefined' : $traceurRuntime.typeof(type)) === 'object' && type['filePath']) {
            return type['filePath'];
          }
          return "./" + stringify(type);
        };
        ReflectionCapabilities.prototype.resolveIdentifier = function(name, moduleUrl, runtime) {
          return runtime;
        };
        ReflectionCapabilities.prototype.resolveEnum = function(enumIdentifier, name) {
          return enumIdentifier[name];
        };
        return ReflectionCapabilities;
      }());
      $__export("ReflectionCapabilities", ReflectionCapabilities);
    }
  };
});

System.register("_@angular/core/src/reflection/reflector_reader", [], function($__export) {
  "use strict";
  var ReflectorReader;
  return {
    setters: [],
    execute: function() {
      ReflectorReader = (function() {
        function ReflectorReader() {}
        return ReflectorReader;
      }());
      $__export("ReflectorReader", ReflectorReader);
    }
  };
});

System.register("_@angular/core/src/reflection/reflector", ["_@angular/core/src/reflection/reflector_reader"], function($__export) {
  "use strict";
  var __extends,
      ReflectorReader,
      Reflector;
  return {
    setters: [function($__m) {
      ReflectorReader = $__m.ReflectorReader;
    }],
    execute: function() {
      __extends = (this && this.__extends) || function(d, b) {
        for (var p in b)
          if (b.hasOwnProperty(p))
            d[p] = b[p];
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      Reflector = (function(_super) {
        __extends(Reflector, _super);
        function Reflector(reflectionCapabilities) {
          _super.call(this);
          this.reflectionCapabilities = reflectionCapabilities;
        }
        Reflector.prototype.updateCapabilities = function(caps) {
          this.reflectionCapabilities = caps;
        };
        Reflector.prototype.factory = function(type) {
          return this.reflectionCapabilities.factory(type);
        };
        Reflector.prototype.parameters = function(typeOrFunc) {
          return this.reflectionCapabilities.parameters(typeOrFunc);
        };
        Reflector.prototype.annotations = function(typeOrFunc) {
          return this.reflectionCapabilities.annotations(typeOrFunc);
        };
        Reflector.prototype.propMetadata = function(typeOrFunc) {
          return this.reflectionCapabilities.propMetadata(typeOrFunc);
        };
        Reflector.prototype.hasLifecycleHook = function(type, lcProperty) {
          return this.reflectionCapabilities.hasLifecycleHook(type, lcProperty);
        };
        Reflector.prototype.getter = function(name) {
          return this.reflectionCapabilities.getter(name);
        };
        Reflector.prototype.setter = function(name) {
          return this.reflectionCapabilities.setter(name);
        };
        Reflector.prototype.method = function(name) {
          return this.reflectionCapabilities.method(name);
        };
        Reflector.prototype.importUri = function(type) {
          return this.reflectionCapabilities.importUri(type);
        };
        Reflector.prototype.resolveIdentifier = function(name, moduleUrl, runtime) {
          return this.reflectionCapabilities.resolveIdentifier(name, moduleUrl, runtime);
        };
        Reflector.prototype.resolveEnum = function(identifier, name) {
          return this.reflectionCapabilities.resolveEnum(identifier, name);
        };
        return Reflector;
      }(ReflectorReader));
      $__export("Reflector", Reflector);
    }
  };
});

System.register("_@angular/core/src/reflection/reflection", ["_@angular/core/src/reflection/reflection_capabilities", "_@angular/core/src/reflection/reflector"], function($__export) {
  "use strict";
  var ReflectionCapabilities,
      Reflector,
      reflector;
  return {
    setters: [function($__m) {
      ReflectionCapabilities = $__m.ReflectionCapabilities;
    }, function($__m) {
      Reflector = $__m.Reflector;
      $__export({Reflector: $__m.Reflector});
    }],
    execute: function() {
      reflector = new Reflector(new ReflectionCapabilities());
      $__export("reflector", reflector);
    }
  };
});

System.register("_@angular/core/src/type", [], function($__export) {
  "use strict";
  var Type;
  return {
    setters: [],
    execute: function() {
      Type = Function;
      $__export("Type", Type);
    }
  };
});

System.register("_@angular/core/src/di/reflective_errors", ["_@angular/core/src/facade/errors", "_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var __extends,
      BaseError,
      WrappedError,
      stringify,
      AbstractProviderError,
      NoProviderError,
      CyclicDependencyError,
      InstantiationError,
      InvalidProviderError,
      NoAnnotationError,
      OutOfBoundsError,
      MixingMultiProvidersWithRegularProvidersError;
  function findFirstClosedCycle(keys) {
    var res = [];
    for (var i = 0; i < keys.length; ++i) {
      if (res.indexOf(keys[i]) > -1) {
        res.push(keys[i]);
        return res;
      }
      res.push(keys[i]);
    }
    return res;
  }
  function constructResolvingPath(keys) {
    if (keys.length > 1) {
      var reversed = findFirstClosedCycle(keys.slice().reverse());
      var tokenStrs = reversed.map(function(k) {
        return stringify(k.token);
      });
      return ' (' + tokenStrs.join(' -> ') + ')';
    }
    return '';
  }
  return {
    setters: [function($__m) {
      BaseError = $__m.BaseError;
      WrappedError = $__m.WrappedError;
    }, function($__m) {
      stringify = $__m.stringify;
    }],
    execute: function() {
      __extends = (this && this.__extends) || function(d, b) {
        for (var p in b)
          if (b.hasOwnProperty(p))
            d[p] = b[p];
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      AbstractProviderError = (function(_super) {
        __extends(AbstractProviderError, _super);
        function AbstractProviderError(injector, key, constructResolvingMessage) {
          _super.call(this, 'DI Error');
          this.keys = [key];
          this.injectors = [injector];
          this.constructResolvingMessage = constructResolvingMessage;
          this.message = this.constructResolvingMessage(this.keys);
        }
        AbstractProviderError.prototype.addKey = function(injector, key) {
          this.injectors.push(injector);
          this.keys.push(key);
          this.message = this.constructResolvingMessage(this.keys);
        };
        return AbstractProviderError;
      }(BaseError));
      $__export("AbstractProviderError", AbstractProviderError);
      NoProviderError = (function(_super) {
        __extends(NoProviderError, _super);
        function NoProviderError(injector, key) {
          _super.call(this, injector, key, function(keys) {
            var first = stringify(keys[0].token);
            return "No provider for " + first + "!" + constructResolvingPath(keys);
          });
        }
        return NoProviderError;
      }(AbstractProviderError));
      $__export("NoProviderError", NoProviderError);
      CyclicDependencyError = (function(_super) {
        __extends(CyclicDependencyError, _super);
        function CyclicDependencyError(injector, key) {
          _super.call(this, injector, key, function(keys) {
            return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
          });
        }
        return CyclicDependencyError;
      }(AbstractProviderError));
      $__export("CyclicDependencyError", CyclicDependencyError);
      InstantiationError = (function(_super) {
        __extends(InstantiationError, _super);
        function InstantiationError(injector, originalException, originalStack, key) {
          _super.call(this, 'DI Error', originalException);
          this.keys = [key];
          this.injectors = [injector];
        }
        InstantiationError.prototype.addKey = function(injector, key) {
          this.injectors.push(injector);
          this.keys.push(key);
        };
        Object.defineProperty(InstantiationError.prototype, "message", {
          get: function() {
            var first = stringify(this.keys[0].token);
            return this.originalError.message + ": Error during instantiation of " + first + "!" + constructResolvingPath(this.keys) + ".";
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(InstantiationError.prototype, "causeKey", {
          get: function() {
            return this.keys[0];
          },
          enumerable: true,
          configurable: true
        });
        return InstantiationError;
      }(WrappedError));
      $__export("InstantiationError", InstantiationError);
      InvalidProviderError = (function(_super) {
        __extends(InvalidProviderError, _super);
        function InvalidProviderError(provider) {
          _super.call(this, "Invalid provider - only instances of Provider and Type are allowed, got: " + provider);
        }
        return InvalidProviderError;
      }(BaseError));
      $__export("InvalidProviderError", InvalidProviderError);
      NoAnnotationError = (function(_super) {
        __extends(NoAnnotationError, _super);
        function NoAnnotationError(typeOrFunc, params) {
          _super.call(this, NoAnnotationError._genMessage(typeOrFunc, params));
        }
        NoAnnotationError._genMessage = function(typeOrFunc, params) {
          var signature = [];
          for (var i = 0,
              ii = params.length; i < ii; i++) {
            var parameter = params[i];
            if (!parameter || parameter.length == 0) {
              signature.push('?');
            } else {
              signature.push(parameter.map(stringify).join(' '));
            }
          }
          return 'Cannot resolve all parameters for \'' + stringify(typeOrFunc) + '\'(' + signature.join(', ') + '). ' + 'Make sure that all the parameters are decorated with Inject or have valid type annotations and that \'' + stringify(typeOrFunc) + '\' is decorated with Injectable.';
        };
        return NoAnnotationError;
      }(BaseError));
      $__export("NoAnnotationError", NoAnnotationError);
      OutOfBoundsError = (function(_super) {
        __extends(OutOfBoundsError, _super);
        function OutOfBoundsError(index) {
          _super.call(this, "Index " + index + " is out-of-bounds.");
        }
        return OutOfBoundsError;
      }(BaseError));
      $__export("OutOfBoundsError", OutOfBoundsError);
      MixingMultiProvidersWithRegularProvidersError = (function(_super) {
        __extends(MixingMultiProvidersWithRegularProvidersError, _super);
        function MixingMultiProvidersWithRegularProvidersError(provider1, provider2) {
          _super.call(this, 'Cannot mix multi providers and regular providers, got: ' + provider1.toString() + ' ' + provider2.toString());
        }
        return MixingMultiProvidersWithRegularProvidersError;
      }(BaseError));
      $__export("MixingMultiProvidersWithRegularProvidersError", MixingMultiProvidersWithRegularProvidersError);
    }
  };
});

System.register("_@angular/core/src/di/reflective_provider", ["_@angular/core/src/facade/collection", "_@angular/core/src/facade/lang", "_@angular/core/src/reflection/reflection", "_@angular/core/src/type", "_@angular/core/src/di/forward_ref", "_@angular/core/src/di/metadata", "_@angular/core/src/di/reflective_errors", "_@angular/core/src/di/reflective_key"], function($__export) {
  "use strict";
  var MapWrapper,
      isBlank,
      isPresent,
      reflector,
      Type,
      resolveForwardRef,
      Host,
      Inject,
      Optional,
      Self,
      SkipSelf,
      InvalidProviderError,
      MixingMultiProvidersWithRegularProvidersError,
      NoAnnotationError,
      ReflectiveKey,
      ReflectiveDependency,
      _EMPTY_LIST,
      ResolvedReflectiveProvider_,
      ResolvedReflectiveFactory;
  function resolveReflectiveFactory(provider) {
    var factoryFn;
    var resolvedDeps;
    if (isPresent(provider.useClass)) {
      var useClass = resolveForwardRef(provider.useClass);
      factoryFn = reflector.factory(useClass);
      resolvedDeps = _dependenciesFor(useClass);
    } else if (isPresent(provider.useExisting)) {
      factoryFn = function(aliasInstance) {
        return aliasInstance;
      };
      resolvedDeps = [ReflectiveDependency.fromKey(ReflectiveKey.get(provider.useExisting))];
    } else if (isPresent(provider.useFactory)) {
      factoryFn = provider.useFactory;
      resolvedDeps = constructDependencies(provider.useFactory, provider.deps);
    } else {
      factoryFn = function() {
        return provider.useValue;
      };
      resolvedDeps = _EMPTY_LIST;
    }
    return new ResolvedReflectiveFactory(factoryFn, resolvedDeps);
  }
  function resolveReflectiveProvider(provider) {
    return new ResolvedReflectiveProvider_(ReflectiveKey.get(provider.provide), [resolveReflectiveFactory(provider)], provider.multi);
  }
  function resolveReflectiveProviders(providers) {
    var normalized = _normalizeProviders(providers, []);
    var resolved = normalized.map(resolveReflectiveProvider);
    return MapWrapper.values(mergeResolvedReflectiveProviders(resolved, new Map()));
  }
  function mergeResolvedReflectiveProviders(providers, normalizedProvidersMap) {
    for (var i = 0; i < providers.length; i++) {
      var provider = providers[i];
      var existing = normalizedProvidersMap.get(provider.key.id);
      if (isPresent(existing)) {
        if (provider.multiProvider !== existing.multiProvider) {
          throw new MixingMultiProvidersWithRegularProvidersError(existing, provider);
        }
        if (provider.multiProvider) {
          for (var j = 0; j < provider.resolvedFactories.length; j++) {
            existing.resolvedFactories.push(provider.resolvedFactories[j]);
          }
        } else {
          normalizedProvidersMap.set(provider.key.id, provider);
        }
      } else {
        var resolvedProvider = void 0;
        if (provider.multiProvider) {
          resolvedProvider = new ResolvedReflectiveProvider_(provider.key, provider.resolvedFactories.slice(), provider.multiProvider);
        } else {
          resolvedProvider = provider;
        }
        normalizedProvidersMap.set(provider.key.id, resolvedProvider);
      }
    }
    return normalizedProvidersMap;
  }
  function _normalizeProviders(providers, res) {
    providers.forEach(function(b) {
      if (b instanceof Type) {
        res.push({
          provide: b,
          useClass: b
        });
      } else if (b && (typeof b === 'undefined' ? 'undefined' : $traceurRuntime.typeof(b)) == 'object' && b.provide !== undefined) {
        res.push(b);
      } else if (b instanceof Array) {
        _normalizeProviders(b, res);
      } else {
        throw new InvalidProviderError(b);
      }
    });
    return res;
  }
  function constructDependencies(typeOrFunc, dependencies) {
    if (!dependencies) {
      return _dependenciesFor(typeOrFunc);
    } else {
      var params = dependencies.map(function(t) {
        return [t];
      });
      return dependencies.map(function(t) {
        return _extractToken(typeOrFunc, t, params);
      });
    }
  }
  function _dependenciesFor(typeOrFunc) {
    var params = reflector.parameters(typeOrFunc);
    if (!params)
      return [];
    if (params.some(isBlank)) {
      throw new NoAnnotationError(typeOrFunc, params);
    }
    return params.map(function(p) {
      return _extractToken(typeOrFunc, p, params);
    });
  }
  function _extractToken(typeOrFunc, metadata, params) {
    var depProps = [];
    var token = null;
    var optional = false;
    if (!Array.isArray(metadata)) {
      if (metadata instanceof Inject) {
        return _createDependency(metadata.token, optional, null, null, depProps);
      } else {
        return _createDependency(metadata, optional, null, null, depProps);
      }
    }
    var lowerBoundVisibility = null;
    var upperBoundVisibility = null;
    for (var i = 0; i < metadata.length; ++i) {
      var paramMetadata = metadata[i];
      if (paramMetadata instanceof Type) {
        token = paramMetadata;
      } else if (paramMetadata instanceof Inject) {
        token = paramMetadata.token;
      } else if (paramMetadata instanceof Optional) {
        optional = true;
      } else if (paramMetadata instanceof Self) {
        upperBoundVisibility = paramMetadata;
      } else if (paramMetadata instanceof Host) {
        upperBoundVisibility = paramMetadata;
      } else if (paramMetadata instanceof SkipSelf) {
        lowerBoundVisibility = paramMetadata;
      }
    }
    token = resolveForwardRef(token);
    if (isPresent(token)) {
      return _createDependency(token, optional, lowerBoundVisibility, upperBoundVisibility, depProps);
    } else {
      throw new NoAnnotationError(typeOrFunc, params);
    }
  }
  function _createDependency(token, optional, lowerBoundVisibility, upperBoundVisibility, depProps) {
    return new ReflectiveDependency(ReflectiveKey.get(token), optional, lowerBoundVisibility, upperBoundVisibility, depProps);
  }
  $__export("resolveReflectiveProviders", resolveReflectiveProviders);
  $__export("mergeResolvedReflectiveProviders", mergeResolvedReflectiveProviders);
  $__export("constructDependencies", constructDependencies);
  return {
    setters: [function($__m) {
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      reflector = $__m.reflector;
    }, function($__m) {
      Type = $__m.Type;
    }, function($__m) {
      resolveForwardRef = $__m.resolveForwardRef;
    }, function($__m) {
      Host = $__m.Host;
      Inject = $__m.Inject;
      Optional = $__m.Optional;
      Self = $__m.Self;
      SkipSelf = $__m.SkipSelf;
    }, function($__m) {
      InvalidProviderError = $__m.InvalidProviderError;
      MixingMultiProvidersWithRegularProvidersError = $__m.MixingMultiProvidersWithRegularProvidersError;
      NoAnnotationError = $__m.NoAnnotationError;
    }, function($__m) {
      ReflectiveKey = $__m.ReflectiveKey;
    }],
    execute: function() {
      ReflectiveDependency = (function() {
        function ReflectiveDependency(key, optional, lowerBoundVisibility, upperBoundVisibility, properties) {
          this.key = key;
          this.optional = optional;
          this.lowerBoundVisibility = lowerBoundVisibility;
          this.upperBoundVisibility = upperBoundVisibility;
          this.properties = properties;
        }
        ReflectiveDependency.fromKey = function(key) {
          return new ReflectiveDependency(key, false, null, null, []);
        };
        return ReflectiveDependency;
      }());
      $__export("ReflectiveDependency", ReflectiveDependency);
      _EMPTY_LIST = [];
      ResolvedReflectiveProvider_ = (function() {
        function ResolvedReflectiveProvider_(key, resolvedFactories, multiProvider) {
          this.key = key;
          this.resolvedFactories = resolvedFactories;
          this.multiProvider = multiProvider;
        }
        Object.defineProperty(ResolvedReflectiveProvider_.prototype, "resolvedFactory", {
          get: function() {
            return this.resolvedFactories[0];
          },
          enumerable: true,
          configurable: true
        });
        return ResolvedReflectiveProvider_;
      }());
      $__export("ResolvedReflectiveProvider_", ResolvedReflectiveProvider_);
      ResolvedReflectiveFactory = (function() {
        function ResolvedReflectiveFactory(factory, dependencies) {
          this.factory = factory;
          this.dependencies = dependencies;
        }
        return ResolvedReflectiveFactory;
      }());
      $__export("ResolvedReflectiveFactory", ResolvedReflectiveFactory);
    }
  };
});

System.register("_@angular/core/src/di/forward_ref", ["_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var stringify;
  function forwardRef(forwardRefFn) {
    forwardRefFn.__forward_ref__ = forwardRef;
    forwardRefFn.toString = function() {
      return stringify(this());
    };
    return forwardRefFn;
  }
  function resolveForwardRef(type) {
    if (typeof type === 'function' && type.hasOwnProperty('__forward_ref__') && type.__forward_ref__ === forwardRef) {
      return type();
    } else {
      return type;
    }
  }
  $__export("forwardRef", forwardRef);
  $__export("resolveForwardRef", resolveForwardRef);
  return {
    setters: [function($__m) {
      stringify = $__m.stringify;
    }],
    execute: function() {}
  };
});

System.register("_@angular/core/src/di/reflective_key", ["_@angular/core/src/facade/lang", "_@angular/core/src/di/forward_ref"], function($__export) {
  "use strict";
  var stringify,
      resolveForwardRef,
      ReflectiveKey,
      KeyRegistry,
      _globalKeyRegistry;
  return {
    setters: [function($__m) {
      stringify = $__m.stringify;
    }, function($__m) {
      resolveForwardRef = $__m.resolveForwardRef;
    }],
    execute: function() {
      ReflectiveKey = (function() {
        function ReflectiveKey(token, id) {
          this.token = token;
          this.id = id;
          if (!token) {
            throw new Error('Token must be defined!');
          }
        }
        Object.defineProperty(ReflectiveKey.prototype, "displayName", {
          get: function() {
            return stringify(this.token);
          },
          enumerable: true,
          configurable: true
        });
        ReflectiveKey.get = function(token) {
          return _globalKeyRegistry.get(resolveForwardRef(token));
        };
        Object.defineProperty(ReflectiveKey, "numberOfKeys", {
          get: function() {
            return _globalKeyRegistry.numberOfKeys;
          },
          enumerable: true,
          configurable: true
        });
        return ReflectiveKey;
      }());
      $__export("ReflectiveKey", ReflectiveKey);
      KeyRegistry = (function() {
        function KeyRegistry() {
          this._allKeys = new Map();
        }
        KeyRegistry.prototype.get = function(token) {
          if (token instanceof ReflectiveKey)
            return token;
          if (this._allKeys.has(token)) {
            return this._allKeys.get(token);
          }
          var newKey = new ReflectiveKey(token, ReflectiveKey.numberOfKeys);
          this._allKeys.set(token, newKey);
          return newKey;
        };
        Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
          get: function() {
            return this._allKeys.size;
          },
          enumerable: true,
          configurable: true
        });
        return KeyRegistry;
      }());
      $__export("KeyRegistry", KeyRegistry);
      _globalKeyRegistry = new KeyRegistry();
    }
  };
});

System.register("_@angular/core/src/util/decorators", ["_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var global,
      stringify,
      _nextClassId,
      Reflect;
  function extractAnnotation(annotation) {
    if (typeof annotation === 'function' && annotation.hasOwnProperty('annotation')) {
      annotation = annotation.annotation;
    }
    return annotation;
  }
  function applyParams(fnOrArray, key) {
    if (fnOrArray === Object || fnOrArray === String || fnOrArray === Function || fnOrArray === Number || fnOrArray === Array) {
      throw new Error("Can not use native " + stringify(fnOrArray) + " as constructor");
    }
    if (typeof fnOrArray === 'function') {
      return fnOrArray;
    }
    if (Array.isArray(fnOrArray)) {
      var annotations = fnOrArray;
      var annoLength = annotations.length - 1;
      var fn = fnOrArray[annoLength];
      if (typeof fn !== 'function') {
        throw new Error("Last position of Class method array must be Function in key " + key + " was '" + stringify(fn) + "'");
      }
      if (annoLength != fn.length) {
        throw new Error("Number of annotations (" + annoLength + ") does not match number of arguments (" + fn.length + ") in the function: " + stringify(fn));
      }
      var paramsAnnotations = [];
      for (var i = 0,
          ii = annotations.length - 1; i < ii; i++) {
        var paramAnnotations = [];
        paramsAnnotations.push(paramAnnotations);
        var annotation = annotations[i];
        if (Array.isArray(annotation)) {
          for (var j = 0; j < annotation.length; j++) {
            paramAnnotations.push(extractAnnotation(annotation[j]));
          }
        } else if (typeof annotation === 'function') {
          paramAnnotations.push(extractAnnotation(annotation));
        } else {
          paramAnnotations.push(annotation);
        }
      }
      Reflect.defineMetadata('parameters', paramsAnnotations, fn);
      return fn;
    }
    throw new Error("Only Function or Array is supported in Class definition for key '" + key + "' is '" + stringify(fnOrArray) + "'");
  }
  function Class(clsDef) {
    var constructor = applyParams(clsDef.hasOwnProperty('constructor') ? clsDef.constructor : undefined, 'constructor');
    var proto = constructor.prototype;
    if (clsDef.hasOwnProperty('extends')) {
      if (typeof clsDef.extends === 'function') {
        constructor.prototype = proto = Object.create(clsDef.extends.prototype);
      } else {
        throw new Error("Class definition 'extends' property must be a constructor function was: " + stringify(clsDef.extends));
      }
    }
    for (var key in clsDef) {
      if (key !== 'extends' && key !== 'prototype' && clsDef.hasOwnProperty(key)) {
        proto[key] = applyParams(clsDef[key], key);
      }
    }
    if (this && this.annotations instanceof Array) {
      Reflect.defineMetadata('annotations', this.annotations, constructor);
    }
    var constructorName = constructor['name'];
    if (!constructorName || constructorName === 'constructor') {
      constructor['overriddenName'] = "class" + _nextClassId++;
    }
    return constructor;
  }
  function makeDecorator(name, props, parentClass, chainFn) {
    if (chainFn === void 0) {
      chainFn = null;
    }
    var metaCtor = makeMetadataCtor([props]);
    function DecoratorFactory(objOrType) {
      if (!(Reflect && Reflect.getMetadata)) {
        throw 'reflect-metadata shim is required when using class decorators';
      }
      if (this instanceof DecoratorFactory) {
        metaCtor.call(this, objOrType);
        return this;
      }
      var annotationInstance = new DecoratorFactory(objOrType);
      var chainAnnotation = typeof this === 'function' && Array.isArray(this.annotations) ? this.annotations : [];
      chainAnnotation.push(annotationInstance);
      var TypeDecorator = function TypeDecorator(cls) {
        var annotations = Reflect.getOwnMetadata('annotations', cls) || [];
        annotations.push(annotationInstance);
        Reflect.defineMetadata('annotations', annotations, cls);
        return cls;
      };
      TypeDecorator.annotations = chainAnnotation;
      TypeDecorator.Class = Class;
      if (chainFn)
        chainFn(TypeDecorator);
      return TypeDecorator;
    }
    if (parentClass) {
      DecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    DecoratorFactory.prototype.toString = function() {
      return ("@" + name);
    };
    DecoratorFactory.annotationCls = DecoratorFactory;
    return DecoratorFactory;
  }
  function makeMetadataCtor(props) {
    return function ctor() {
      var _this = this;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
      }
      props.forEach(function(prop, i) {
        var argVal = args[i];
        if (Array.isArray(prop)) {
          _this[prop[0]] = argVal === undefined ? prop[1] : argVal;
        } else {
          for (var propName in prop) {
            _this[propName] = argVal && argVal.hasOwnProperty(propName) ? argVal[propName] : prop[propName];
          }
        }
      });
    };
  }
  function makeParamDecorator(name, props, parentClass) {
    var metaCtor = makeMetadataCtor(props);
    function ParamDecoratorFactory() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
      }
      if (this instanceof ParamDecoratorFactory) {
        metaCtor.apply(this, args);
        return this;
      }
      var annotationInstance = new ((_a = ParamDecoratorFactory).bind.apply(_a, [void 0].concat(args)))();
      ParamDecorator.annotation = annotationInstance;
      return ParamDecorator;
      function ParamDecorator(cls, unusedKey, index) {
        var parameters = Reflect.getMetadata('parameters', cls) || [];
        while (parameters.length <= index) {
          parameters.push(null);
        }
        parameters[index] = parameters[index] || [];
        parameters[index].push(annotationInstance);
        Reflect.defineMetadata('parameters', parameters, cls);
        return cls;
      }
      var _a;
    }
    if (parentClass) {
      ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    ParamDecoratorFactory.prototype.toString = function() {
      return ("@" + name);
    };
    ParamDecoratorFactory.annotationCls = ParamDecoratorFactory;
    return ParamDecoratorFactory;
  }
  function makePropDecorator(name, props, parentClass) {
    var metaCtor = makeMetadataCtor(props);
    function PropDecoratorFactory() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
      }
      if (this instanceof PropDecoratorFactory) {
        metaCtor.apply(this, args);
        return this;
      }
      var decoratorInstance = new ((_a = PropDecoratorFactory).bind.apply(_a, [void 0].concat(args)))();
      return function PropDecorator(target, name) {
        var meta = Reflect.getOwnMetadata('propMetadata', target.constructor) || {};
        meta[name] = meta.hasOwnProperty(name) && meta[name] || [];
        meta[name].unshift(decoratorInstance);
        Reflect.defineMetadata('propMetadata', meta, target.constructor);
      };
      var _a;
    }
    if (parentClass) {
      PropDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    PropDecoratorFactory.prototype.toString = function() {
      return ("@" + name);
    };
    PropDecoratorFactory.annotationCls = PropDecoratorFactory;
    return PropDecoratorFactory;
  }
  $__export("Class", Class);
  $__export("makeDecorator", makeDecorator);
  $__export("makeParamDecorator", makeParamDecorator);
  $__export("makePropDecorator", makePropDecorator);
  return {
    setters: [function($__m) {
      global = $__m.global;
      stringify = $__m.stringify;
    }],
    execute: function() {
      _nextClassId = 0;
      Reflect = global.Reflect;
    }
  };
});

System.register("_@angular/core/src/di/metadata", ["_@angular/core/src/util/decorators"], function($__export) {
  "use strict";
  var makeParamDecorator,
      Inject,
      Optional,
      Injectable,
      Self,
      SkipSelf,
      Host;
  return {
    setters: [function($__m) {
      makeParamDecorator = $__m.makeParamDecorator;
    }],
    execute: function() {
      Inject = makeParamDecorator('Inject', [['token', undefined]]);
      $__export("Inject", Inject);
      Optional = makeParamDecorator('Optional', []);
      $__export("Optional", Optional);
      Injectable = makeParamDecorator('Injectable', []);
      $__export("Injectable", Injectable);
      Self = makeParamDecorator('Self', []);
      $__export("Self", Self);
      SkipSelf = makeParamDecorator('SkipSelf', []);
      $__export("SkipSelf", SkipSelf);
      Host = makeParamDecorator('Host', []);
      $__export("Host", Host);
    }
  };
});

System.register("_@angular/core/src/di/opaque_token", ["_@angular/core/src/di/metadata"], function($__export) {
  "use strict";
  var Injectable,
      OpaqueToken;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }],
    execute: function() {
      OpaqueToken = (function() {
        function OpaqueToken(_desc) {
          this._desc = _desc;
        }
        OpaqueToken.prototype.toString = function() {
          return "Token " + this._desc;
        };
        OpaqueToken.decorators = [{type: Injectable}];
        OpaqueToken.ctorParameters = [null];
        return OpaqueToken;
      }());
      $__export("OpaqueToken", OpaqueToken);
    }
  };
});

System.register("_@angular/core/src/di", ["_@angular/core/src/di/metadata", "_@angular/core/src/di/forward_ref", "_@angular/core/src/di/injector", "_@angular/core/src/di/reflective_injector", "_@angular/core/src/di/reflective_provider", "_@angular/core/src/di/reflective_key", "_@angular/core/src/di/opaque_token"], function($__export) {
  "use strict";
  var $__exportNames = {undefined: true};
  return {
    setters: [function($__m) {
      var exportObj = Object.create(null);
      Object.keys($__m).forEach(function(p) {
        if (p !== 'default' && !$__exportNames[p])
          exportObj[p] = $__m[p];
      });
      $__export(exportObj);
    }, function($__m) {
      $__export({
        forwardRef: $__m.forwardRef,
        resolveForwardRef: $__m.resolveForwardRef
      });
    }, function($__m) {
      $__export({Injector: $__m.Injector});
    }, function($__m) {
      $__export({ReflectiveInjector: $__m.ReflectiveInjector});
    }, function($__m) {
      $__export({ResolvedReflectiveFactory: $__m.ResolvedReflectiveFactory});
    }, function($__m) {
      $__export({ReflectiveKey: $__m.ReflectiveKey});
    }, function($__m) {
      $__export({OpaqueToken: $__m.OpaqueToken});
    }],
    execute: function() {}
  };
});

System.register("_@angular/core/src/render/api", ["_@angular/core/src/facade/errors"], function($__export) {
  "use strict";
  var unimplemented,
      RenderComponentType,
      RenderDebugInfo,
      Renderer,
      RootRenderer;
  return {
    setters: [function($__m) {
      unimplemented = $__m.unimplemented;
    }],
    execute: function() {
      RenderComponentType = (function() {
        function RenderComponentType(id, templateUrl, slotCount, encapsulation, styles, animations) {
          this.id = id;
          this.templateUrl = templateUrl;
          this.slotCount = slotCount;
          this.encapsulation = encapsulation;
          this.styles = styles;
          this.animations = animations;
        }
        return RenderComponentType;
      }());
      $__export("RenderComponentType", RenderComponentType);
      RenderDebugInfo = (function() {
        function RenderDebugInfo() {}
        Object.defineProperty(RenderDebugInfo.prototype, "injector", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RenderDebugInfo.prototype, "component", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RenderDebugInfo.prototype, "providerTokens", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RenderDebugInfo.prototype, "references", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RenderDebugInfo.prototype, "context", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RenderDebugInfo.prototype, "source", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        return RenderDebugInfo;
      }());
      $__export("RenderDebugInfo", RenderDebugInfo);
      Renderer = (function() {
        function Renderer() {}
        return Renderer;
      }());
      $__export("Renderer", Renderer);
      RootRenderer = (function() {
        function RootRenderer() {}
        return RootRenderer;
      }());
      $__export("RootRenderer", RootRenderer);
    }
  };
});

System.register("_@angular/core/src/security", [], function($__export) {
  "use strict";
  var SecurityContext,
      Sanitizer;
  return {
    setters: [],
    execute: function() {
      $__export("SecurityContext", SecurityContext);
      (function(SecurityContext) {
        SecurityContext[SecurityContext["NONE"] = 0] = "NONE";
        SecurityContext[SecurityContext["HTML"] = 1] = "HTML";
        SecurityContext[SecurityContext["STYLE"] = 2] = "STYLE";
        SecurityContext[SecurityContext["SCRIPT"] = 3] = "SCRIPT";
        SecurityContext[SecurityContext["URL"] = 4] = "URL";
        SecurityContext[SecurityContext["RESOURCE_URL"] = 5] = "RESOURCE_URL";
      })(SecurityContext || ($__export("SecurityContext", SecurityContext = {})));
      Sanitizer = (function() {
        function Sanitizer() {}
        return Sanitizer;
      }());
      $__export("Sanitizer", Sanitizer);
    }
  };
});

System.register("_@angular/core/src/linker/element_ref", [], function($__export) {
  "use strict";
  var ElementRef;
  return {
    setters: [],
    execute: function() {
      ElementRef = (function() {
        function ElementRef(nativeElement) {
          this.nativeElement = nativeElement;
        }
        return ElementRef;
      }());
      $__export("ElementRef", ElementRef);
    }
  };
});

System.register("_@angular/core/src/profile/wtf_impl", ["_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var global,
      trace,
      events;
  function detectWTF() {
    var wtf = global['wtf'];
    if (wtf) {
      trace = wtf['trace'];
      if (trace) {
        events = trace['events'];
        return true;
      }
    }
    return false;
  }
  function createScope(signature, flags) {
    if (flags === void 0) {
      flags = null;
    }
    return events.createScope(signature, flags);
  }
  function leave(scope, returnValue) {
    trace.leaveScope(scope, returnValue);
    return returnValue;
  }
  function startTimeRange(rangeType, action) {
    return trace.beginTimeRange(rangeType, action);
  }
  function endTimeRange(range) {
    trace.endTimeRange(range);
  }
  $__export("detectWTF", detectWTF);
  $__export("createScope", createScope);
  $__export("leave", leave);
  $__export("startTimeRange", startTimeRange);
  $__export("endTimeRange", endTimeRange);
  return {
    setters: [function($__m) {
      global = $__m.global;
    }],
    execute: function() {}
  };
});

System.register("_@angular/core/src/profile/profile", ["_@angular/core/src/profile/wtf_impl"], function($__export) {
  "use strict";
  var createScope,
      detectWTF,
      endTimeRange,
      leave,
      startTimeRange,
      wtfEnabled,
      wtfCreateScope,
      wtfLeave,
      wtfStartTimeRange,
      wtfEndTimeRange;
  function noopScope(arg0, arg1) {
    return null;
  }
  return {
    setters: [function($__m) {
      createScope = $__m.createScope;
      detectWTF = $__m.detectWTF;
      endTimeRange = $__m.endTimeRange;
      leave = $__m.leave;
      startTimeRange = $__m.startTimeRange;
    }],
    execute: function() {
      wtfEnabled = detectWTF();
      $__export("wtfEnabled", wtfEnabled);
      wtfCreateScope = wtfEnabled ? createScope : function(signature, flags) {
        return noopScope;
      };
      $__export("wtfCreateScope", wtfCreateScope);
      wtfLeave = wtfEnabled ? leave : function(s, r) {
        return r;
      };
      $__export("wtfLeave", wtfLeave);
      wtfStartTimeRange = wtfEnabled ? startTimeRange : function(rangeType, action) {
        return null;
      };
      $__export("wtfStartTimeRange", wtfStartTimeRange);
      wtfEndTimeRange = wtfEnabled ? endTimeRange : function(r) {
        return null;
      };
      $__export("wtfEndTimeRange", wtfEndTimeRange);
    }
  };
});

System.register("_@angular/core/src/linker/view_container_ref", ["_@angular/core/src/facade/errors", "_@angular/core/src/facade/lang", "_@angular/core/src/profile/profile"], function($__export) {
  "use strict";
  var unimplemented,
      isPresent,
      wtfCreateScope,
      wtfLeave,
      ViewContainerRef,
      ViewContainerRef_;
  return {
    setters: [function($__m) {
      unimplemented = $__m.unimplemented;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      wtfCreateScope = $__m.wtfCreateScope;
      wtfLeave = $__m.wtfLeave;
    }],
    execute: function() {
      ViewContainerRef = (function() {
        function ViewContainerRef() {}
        Object.defineProperty(ViewContainerRef.prototype, "element", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ViewContainerRef.prototype, "injector", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ViewContainerRef.prototype, "parentInjector", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ViewContainerRef.prototype, "length", {
          get: function() {
            return unimplemented();
          },
          enumerable: true,
          configurable: true
        });
        ;
        return ViewContainerRef;
      }());
      $__export("ViewContainerRef", ViewContainerRef);
      ViewContainerRef_ = (function() {
        function ViewContainerRef_(_element) {
          this._element = _element;
          this._createComponentInContainerScope = wtfCreateScope('ViewContainerRef#createComponent()');
          this._insertScope = wtfCreateScope('ViewContainerRef#insert()');
          this._removeScope = wtfCreateScope('ViewContainerRef#remove()');
          this._detachScope = wtfCreateScope('ViewContainerRef#detach()');
        }
        ViewContainerRef_.prototype.get = function(index) {
          return this._element.nestedViews[index].ref;
        };
        Object.defineProperty(ViewContainerRef_.prototype, "length", {
          get: function() {
            var views = this._element.nestedViews;
            return isPresent(views) ? views.length : 0;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ViewContainerRef_.prototype, "element", {
          get: function() {
            return this._element.elementRef;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ViewContainerRef_.prototype, "injector", {
          get: function() {
            return this._element.injector;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ViewContainerRef_.prototype, "parentInjector", {
          get: function() {
            return this._element.parentInjector;
          },
          enumerable: true,
          configurable: true
        });
        ViewContainerRef_.prototype.createEmbeddedView = function(templateRef, context, index) {
          if (context === void 0) {
            context = null;
          }
          if (index === void 0) {
            index = -1;
          }
          var viewRef = templateRef.createEmbeddedView(context);
          this.insert(viewRef, index);
          return viewRef;
        };
        ViewContainerRef_.prototype.createComponent = function(componentFactory, index, injector, projectableNodes) {
          if (index === void 0) {
            index = -1;
          }
          if (injector === void 0) {
            injector = null;
          }
          if (projectableNodes === void 0) {
            projectableNodes = null;
          }
          var s = this._createComponentInContainerScope();
          var contextInjector = injector || this._element.parentInjector;
          var componentRef = componentFactory.create(contextInjector, projectableNodes);
          this.insert(componentRef.hostView, index);
          return wtfLeave(s, componentRef);
        };
        ViewContainerRef_.prototype.insert = function(viewRef, index) {
          if (index === void 0) {
            index = -1;
          }
          var s = this._insertScope();
          if (index == -1)
            index = this.length;
          var viewRef_ = viewRef;
          this._element.attachView(viewRef_.internalView, index);
          return wtfLeave(s, viewRef_);
        };
        ViewContainerRef_.prototype.move = function(viewRef, currentIndex) {
          var s = this._insertScope();
          if (currentIndex == -1)
            return;
          var viewRef_ = viewRef;
          this._element.moveView(viewRef_.internalView, currentIndex);
          return wtfLeave(s, viewRef_);
        };
        ViewContainerRef_.prototype.indexOf = function(viewRef) {
          return this._element.nestedViews.indexOf(viewRef.internalView);
        };
        ViewContainerRef_.prototype.remove = function(index) {
          if (index === void 0) {
            index = -1;
          }
          var s = this._removeScope();
          if (index == -1)
            index = this.length - 1;
          var view = this._element.detachView(index);
          view.destroy();
          wtfLeave(s);
        };
        ViewContainerRef_.prototype.detach = function(index) {
          if (index === void 0) {
            index = -1;
          }
          var s = this._detachScope();
          if (index == -1)
            index = this.length - 1;
          var view = this._element.detachView(index);
          return wtfLeave(s, view.ref);
        };
        ViewContainerRef_.prototype.clear = function() {
          for (var i = this.length - 1; i >= 0; i--) {
            this.remove(i);
          }
        };
        return ViewContainerRef_;
      }());
      $__export("ViewContainerRef_", ViewContainerRef_);
    }
  };
});

System.register("_@angular/core/src/linker/view_type", [], function($__export) {
  "use strict";
  var ViewType;
  return {
    setters: [],
    execute: function() {
      $__export("ViewType", ViewType);
      (function(ViewType) {
        ViewType[ViewType["HOST"] = 0] = "HOST";
        ViewType[ViewType["COMPONENT"] = 1] = "COMPONENT";
        ViewType[ViewType["EMBEDDED"] = 2] = "EMBEDDED";
      })(ViewType || ($__export("ViewType", ViewType = {})));
    }
  };
});

System.register("_@angular/core/src/linker/element", ["_@angular/core/src/facade/lang", "_@angular/core/src/linker/element_ref", "_@angular/core/src/linker/view_container_ref", "_@angular/core/src/linker/view_type"], function($__export) {
  "use strict";
  var isPresent,
      ElementRef,
      ViewContainerRef_,
      ViewType,
      AppElement;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      ElementRef = $__m.ElementRef;
    }, function($__m) {
      ViewContainerRef_ = $__m.ViewContainerRef_;
    }, function($__m) {
      ViewType = $__m.ViewType;
    }],
    execute: function() {
      AppElement = (function() {
        function AppElement(index, parentIndex, parentView, nativeElement) {
          this.index = index;
          this.parentIndex = parentIndex;
          this.parentView = parentView;
          this.nativeElement = nativeElement;
          this.nestedViews = null;
          this.componentView = null;
        }
        Object.defineProperty(AppElement.prototype, "elementRef", {
          get: function() {
            return new ElementRef(this.nativeElement);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(AppElement.prototype, "vcRef", {
          get: function() {
            return new ViewContainerRef_(this);
          },
          enumerable: true,
          configurable: true
        });
        AppElement.prototype.initComponent = function(component, componentConstructorViewQueries, view) {
          this.component = component;
          this.componentConstructorViewQueries = componentConstructorViewQueries;
          this.componentView = view;
        };
        Object.defineProperty(AppElement.prototype, "parentInjector", {
          get: function() {
            return this.parentView.injector(this.parentIndex);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(AppElement.prototype, "injector", {
          get: function() {
            return this.parentView.injector(this.index);
          },
          enumerable: true,
          configurable: true
        });
        AppElement.prototype.mapNestedViews = function(nestedViewClass, callback) {
          var result = [];
          if (isPresent(this.nestedViews)) {
            this.nestedViews.forEach(function(nestedView) {
              if (nestedView.clazz === nestedViewClass) {
                result.push(callback(nestedView));
              }
            });
          }
          return result;
        };
        AppElement.prototype.moveView = function(view, currentIndex) {
          var previousIndex = this.nestedViews.indexOf(view);
          if (view.type === ViewType.COMPONENT) {
            throw new Error("Component views can't be moved!");
          }
          var nestedViews = this.nestedViews;
          if (nestedViews == null) {
            nestedViews = [];
            this.nestedViews = nestedViews;
          }
          nestedViews.splice(previousIndex, 1);
          nestedViews.splice(currentIndex, 0, view);
          var refRenderNode;
          if (currentIndex > 0) {
            var prevView = nestedViews[currentIndex - 1];
            refRenderNode = prevView.lastRootNode;
          } else {
            refRenderNode = this.nativeElement;
          }
          if (isPresent(refRenderNode)) {
            view.renderer.attachViewAfter(refRenderNode, view.flatRootNodes);
          }
          view.markContentChildAsMoved(this);
        };
        AppElement.prototype.attachView = function(view, viewIndex) {
          if (view.type === ViewType.COMPONENT) {
            throw new Error("Component views can't be moved!");
          }
          var nestedViews = this.nestedViews;
          if (nestedViews == null) {
            nestedViews = [];
            this.nestedViews = nestedViews;
          }
          nestedViews.splice(viewIndex, 0, view);
          var refRenderNode;
          if (viewIndex > 0) {
            var prevView = nestedViews[viewIndex - 1];
            refRenderNode = prevView.lastRootNode;
          } else {
            refRenderNode = this.nativeElement;
          }
          if (isPresent(refRenderNode)) {
            view.renderer.attachViewAfter(refRenderNode, view.flatRootNodes);
          }
          view.addToContentChildren(this);
        };
        AppElement.prototype.detachView = function(viewIndex) {
          var view = this.nestedViews.splice(viewIndex, 1)[0];
          if (view.type === ViewType.COMPONENT) {
            throw new Error("Component views can't be moved!");
          }
          view.detach();
          view.removeFromContentChildren(this);
          return view;
        };
        return AppElement;
      }());
      $__export("AppElement", AppElement);
    }
  };
});

System.register("_@angular/core/src/facade/collection", ["_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var getSymbolIterator,
      isJsObject,
      isPresent,
      _arrayFromMap,
      MapWrapper,
      StringMapWrapper,
      ListWrapper;
  function _flattenArray(source, target) {
    if (isPresent(source)) {
      for (var i = 0; i < source.length; i++) {
        var item = source[i];
        if (Array.isArray(item)) {
          _flattenArray(item, target);
        } else {
          target.push(item);
        }
      }
    }
    return target;
  }
  function isListLikeIterable(obj) {
    if (!isJsObject(obj))
      return false;
    return Array.isArray(obj) || (!(obj instanceof Map) && getSymbolIterator() in obj);
  }
  function areIterablesEqual(a, b, comparator) {
    var iterator1 = a[getSymbolIterator()]();
    var iterator2 = b[getSymbolIterator()]();
    while (true) {
      var item1 = iterator1.next();
      var item2 = iterator2.next();
      if (item1.done && item2.done)
        return true;
      if (item1.done || item2.done)
        return false;
      if (!comparator(item1.value, item2.value))
        return false;
    }
  }
  function iterateListLike(obj, fn) {
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        fn(obj[i]);
      }
    } else {
      var iterator = obj[getSymbolIterator()]();
      var item = void 0;
      while (!((item = iterator.next()).done)) {
        fn(item.value);
      }
    }
  }
  $__export("isListLikeIterable", isListLikeIterable);
  $__export("areIterablesEqual", areIterablesEqual);
  $__export("iterateListLike", iterateListLike);
  return {
    setters: [function($__m) {
      getSymbolIterator = $__m.getSymbolIterator;
      isJsObject = $__m.isJsObject;
      isPresent = $__m.isPresent;
    }],
    execute: function() {
      _arrayFromMap = (function() {
        try {
          if ((new Map()).values().next) {
            return function createArrayFromMap(m, getValues) {
              return getValues ? Array.from(m.values()) : Array.from(m.keys());
            };
          }
        } catch (e) {}
        return function createArrayFromMapWithForeach(m, getValues) {
          var res = new Array(m.size),
              i = 0;
          m.forEach(function(v, k) {
            res[i] = getValues ? v : k;
            i++;
          });
          return res;
        };
      })();
      MapWrapper = (function() {
        function MapWrapper() {}
        MapWrapper.createFromStringMap = function(stringMap) {
          var result = new Map();
          for (var prop in stringMap) {
            result.set(prop, stringMap[prop]);
          }
          return result;
        };
        MapWrapper.keys = function(m) {
          return _arrayFromMap(m, false);
        };
        MapWrapper.values = function(m) {
          return _arrayFromMap(m, true);
        };
        return MapWrapper;
      }());
      $__export("MapWrapper", MapWrapper);
      StringMapWrapper = (function() {
        function StringMapWrapper() {}
        StringMapWrapper.merge = function(m1, m2) {
          var m = {};
          for (var _i = 0,
              _a = Object.keys(m1); _i < _a.length; _i++) {
            var k = _a[_i];
            m[k] = m1[k];
          }
          for (var _b = 0,
              _c = Object.keys(m2); _b < _c.length; _b++) {
            var k = _c[_b];
            m[k] = m2[k];
          }
          return m;
        };
        StringMapWrapper.equals = function(m1, m2) {
          var k1 = Object.keys(m1);
          var k2 = Object.keys(m2);
          if (k1.length != k2.length) {
            return false;
          }
          for (var i = 0; i < k1.length; i++) {
            var key = k1[i];
            if (m1[key] !== m2[key]) {
              return false;
            }
          }
          return true;
        };
        return StringMapWrapper;
      }());
      $__export("StringMapWrapper", StringMapWrapper);
      ListWrapper = (function() {
        function ListWrapper() {}
        ListWrapper.removeAll = function(list, items) {
          for (var i = 0; i < items.length; ++i) {
            var index = list.indexOf(items[i]);
            list.splice(index, 1);
          }
        };
        ListWrapper.remove = function(list, el) {
          var index = list.indexOf(el);
          if (index > -1) {
            list.splice(index, 1);
            return true;
          }
          return false;
        };
        ListWrapper.equals = function(a, b) {
          if (a.length != b.length)
            return false;
          for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i])
              return false;
          }
          return true;
        };
        ListWrapper.maximum = function(list, predicate) {
          if (list.length == 0) {
            return null;
          }
          var solution = null;
          var maxValue = -Infinity;
          for (var index = 0; index < list.length; index++) {
            var candidate = list[index];
            if (candidate == null) {
              continue;
            }
            var candidateValue = predicate(candidate);
            if (candidateValue > maxValue) {
              solution = candidate;
              maxValue = candidateValue;
            }
          }
          return solution;
        };
        ListWrapper.flatten = function(list) {
          var target = [];
          _flattenArray(list, target);
          return target;
        };
        return ListWrapper;
      }());
      $__export("ListWrapper", ListWrapper);
    }
  };
});

System.register("_@angular/core/src/facade/lang", [], function($__export) {
  "use strict";
  var globalScope,
      _global,
      STRING_MAP_PROTO,
      NumberWrapper,
      _symbolIterator;
  function scheduleMicroTask(fn) {
    Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
  }
  function getTypeNameForDebugging(type) {
    return type['name'] || (typeof type === 'undefined' ? 'undefined' : $traceurRuntime.typeof(type));
  }
  function isPresent(obj) {
    return obj != null;
  }
  function isBlank(obj) {
    return obj == null;
  }
  function isStrictStringMap(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : $traceurRuntime.typeof(obj)) === 'object' && obj !== null && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
  }
  function isDate(obj) {
    return obj instanceof Date && !isNaN(obj.valueOf());
  }
  function stringify(token) {
    if (typeof token === 'string') {
      return token;
    }
    if (token === undefined || token === null) {
      return '' + token;
    }
    if (token.overriddenName) {
      return token.overriddenName;
    }
    if (token.name) {
      return token.name;
    }
    var res = token.toString();
    var newLineIndex = res.indexOf('\n');
    return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
  }
  function looseIdentical(a, b) {
    return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
  }
  function isJsObject(o) {
    return o !== null && (typeof o === 'function' || (typeof o === 'undefined' ? 'undefined' : $traceurRuntime.typeof(o)) === 'object');
  }
  function print(obj) {
    console.log(obj);
  }
  function warn(obj) {
    console.warn(obj);
  }
  function setValueOnPath(global, path, value) {
    var parts = path.split('.');
    var obj = global;
    while (parts.length > 1) {
      var name = parts.shift();
      if (obj.hasOwnProperty(name) && isPresent(obj[name])) {
        obj = obj[name];
      } else {
        obj = obj[name] = {};
      }
    }
    if (obj === undefined || obj === null) {
      obj = {};
    }
    obj[parts.shift()] = value;
  }
  function getSymbolIterator() {
    if (!_symbolIterator) {
      if (globalScope.Symbol && Symbol.iterator) {
        _symbolIterator = Symbol.iterator;
      } else {
        var keys = Object.getOwnPropertyNames(Map.prototype);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          if (key !== 'entries' && key !== 'size' && Map.prototype[key] === Map.prototype['entries']) {
            _symbolIterator = key;
          }
        }
      }
    }
    return _symbolIterator;
  }
  function isPrimitive(obj) {
    return !isJsObject(obj);
  }
  function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }
  $__export("scheduleMicroTask", scheduleMicroTask);
  $__export("getTypeNameForDebugging", getTypeNameForDebugging);
  $__export("isPresent", isPresent);
  $__export("isBlank", isBlank);
  $__export("isStrictStringMap", isStrictStringMap);
  $__export("isDate", isDate);
  $__export("stringify", stringify);
  $__export("looseIdentical", looseIdentical);
  $__export("isJsObject", isJsObject);
  $__export("print", print);
  $__export("warn", warn);
  $__export("setValueOnPath", setValueOnPath);
  $__export("getSymbolIterator", getSymbolIterator);
  $__export("isPrimitive", isPrimitive);
  $__export("escapeRegExp", escapeRegExp);
  return {
    setters: [],
    execute: function() {
      if (typeof window === 'undefined') {
        if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
          globalScope = self;
        } else {
          globalScope = global;
        }
      } else {
        globalScope = window;
      }
      _global = globalScope;
      $__export("global", _global);
      _global.assert = function assert(condition) {};
      STRING_MAP_PROTO = Object.getPrototypeOf({});
      NumberWrapper = (function() {
        function NumberWrapper() {}
        NumberWrapper.parseIntAutoRadix = function(text) {
          var result = parseInt(text);
          if (isNaN(result)) {
            throw new Error('Invalid integer literal when parsing ' + text);
          }
          return result;
        };
        NumberWrapper.parseInt = function(text, radix) {
          if (radix == 10) {
            if (/^(\-|\+)?[0-9]+$/.test(text)) {
              return parseInt(text, radix);
            }
          } else if (radix == 16) {
            if (/^(\-|\+)?[0-9ABCDEFabcdef]+$/.test(text)) {
              return parseInt(text, radix);
            }
          } else {
            var result = parseInt(text, radix);
            if (!isNaN(result)) {
              return result;
            }
          }
          throw new Error('Invalid integer literal when parsing ' + text + ' in base ' + radix);
        };
        NumberWrapper.isNumeric = function(value) {
          return !isNaN(value - parseFloat(value));
        };
        return NumberWrapper;
      }());
      $__export("NumberWrapper", NumberWrapper);
      _symbolIterator = null;
    }
  };
});

System.register("_@angular/core/src/change_detection/change_detection_util", ["_@angular/core/src/facade/collection", "_@angular/core/src/facade/lang"], function($__export) {
  "use strict";
  var areIterablesEqual,
      isListLikeIterable,
      isPrimitive,
      looseIdentical,
      UNINITIALIZED,
      WrappedValue,
      ValueUnwrapper,
      SimpleChange;
  function devModeEqual(a, b) {
    if (isListLikeIterable(a) && isListLikeIterable(b)) {
      return areIterablesEqual(a, b, devModeEqual);
    } else if (!isListLikeIterable(a) && !isPrimitive(a) && !isListLikeIterable(b) && !isPrimitive(b)) {
      return true;
    } else {
      return looseIdentical(a, b);
    }
  }
  $__export("devModeEqual", devModeEqual);
  return {
    setters: [function($__m) {
      areIterablesEqual = $__m.areIterablesEqual;
      isListLikeIterable = $__m.isListLikeIterable;
    }, function($__m) {
      isPrimitive = $__m.isPrimitive;
      looseIdentical = $__m.looseIdentical;
      $__export({looseIdentical: $__m.looseIdentical});
    }],
    execute: function() {
      UNINITIALIZED = {toString: function() {
          return 'CD_INIT_VALUE';
        }};
      $__export("UNINITIALIZED", UNINITIALIZED);
      WrappedValue = (function() {
        function WrappedValue(wrapped) {
          this.wrapped = wrapped;
        }
        WrappedValue.wrap = function(value) {
          return new WrappedValue(value);
        };
        return WrappedValue;
      }());
      $__export("WrappedValue", WrappedValue);
      ValueUnwrapper = (function() {
        function ValueUnwrapper() {
          this.hasWrappedValue = false;
        }
        ValueUnwrapper.prototype.unwrap = function(value) {
          if (value instanceof WrappedValue) {
            this.hasWrappedValue = true;
            return value.wrapped;
          }
          return value;
        };
        ValueUnwrapper.prototype.reset = function() {
          this.hasWrappedValue = false;
        };
        return ValueUnwrapper;
      }());
      $__export("ValueUnwrapper", ValueUnwrapper);
      SimpleChange = (function() {
        function SimpleChange(previousValue, currentValue) {
          this.previousValue = previousValue;
          this.currentValue = currentValue;
        }
        SimpleChange.prototype.isFirstChange = function() {
          return this.previousValue === UNINITIALIZED;
        };
        return SimpleChange;
      }());
      $__export("SimpleChange", SimpleChange);
    }
  };
});

System.register("_@angular/core/src/facade/errors", [], function($__export) {
  "use strict";
  var __extends,
      BaseError,
      WrappedError;
  function unimplemented() {
    throw new Error('unimplemented');
  }
  $__export("unimplemented", unimplemented);
  return {
    setters: [],
    execute: function() {
      __extends = (this && this.__extends) || function(d, b) {
        for (var p in b)
          if (b.hasOwnProperty(p))
            d[p] = b[p];
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      BaseError = (function(_super) {
        __extends(BaseError, _super);
        function BaseError(message) {
          var nativeError = _super.call(this, message);
          this._nativeError = nativeError;
        }
        Object.defineProperty(BaseError.prototype, "message", {
          get: function() {
            return this._nativeError.message;
          },
          set: function(message) {
            this._nativeError.message = message;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(BaseError.prototype, "name", {
          get: function() {
            return this._nativeError.name;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(BaseError.prototype, "stack", {
          get: function() {
            return this._nativeError.stack;
          },
          set: function(value) {
            this._nativeError.stack = value;
          },
          enumerable: true,
          configurable: true
        });
        BaseError.prototype.toString = function() {
          return this._nativeError.toString();
        };
        return BaseError;
      }(Error));
      $__export("BaseError", BaseError);
      WrappedError = (function(_super) {
        __extends(WrappedError, _super);
        function WrappedError(message, error) {
          _super.call(this, message + " caused by: " + (error instanceof Error ? error.message : error));
          this.originalError = error;
        }
        Object.defineProperty(WrappedError.prototype, "stack", {
          get: function() {
            return (this.originalError instanceof Error ? this.originalError : this._nativeError).stack;
          },
          enumerable: true,
          configurable: true
        });
        return WrappedError;
      }(BaseError));
      $__export("WrappedError", WrappedError);
    }
  };
});

System.register("_@angular/core/src/linker/errors", ["_@angular/core/src/change_detection/change_detection_util", "_@angular/core/src/facade/errors"], function($__export) {
  "use strict";
  var __extends,
      UNINITIALIZED,
      BaseError,
      WrappedError,
      ExpressionChangedAfterItHasBeenCheckedError,
      ViewWrappedError,
      ViewDestroyedError;
  return {
    setters: [function($__m) {
      UNINITIALIZED = $__m.UNINITIALIZED;
    }, function($__m) {
      BaseError = $__m.BaseError;
      WrappedError = $__m.WrappedError;
    }],
    execute: function() {
      __extends = (this && this.__extends) || function(d, b) {
        for (var p in b)
          if (b.hasOwnProperty(p))
            d[p] = b[p];
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      ExpressionChangedAfterItHasBeenCheckedError = (function(_super) {
        __extends(ExpressionChangedAfterItHasBeenCheckedError, _super);
        function ExpressionChangedAfterItHasBeenCheckedError(oldValue, currValue) {
          var msg = "Expression has changed after it was checked. Previous value: '" + oldValue + "'. Current value: '" + currValue + "'.";
          if (oldValue === UNINITIALIZED) {
            msg += " It seems like the view has been created after its parent and its children have been dirty checked." + " Has it been created in a change detection hook ?";
          }
          _super.call(this, msg);
        }
        return ExpressionChangedAfterItHasBeenCheckedError;
      }(BaseError));
      $__export("ExpressionChangedAfterItHasBeenCheckedError", ExpressionChangedAfterItHasBeenCheckedError);
      ViewWrappedError = (function(_super) {
        __extends(ViewWrappedError, _super);
        function ViewWrappedError(originalError, context) {
          _super.call(this, "Error in " + context.source, originalError);
          this.context = context;
        }
        return ViewWrappedError;
      }(WrappedError));
      $__export("ViewWrappedError", ViewWrappedError);
      ViewDestroyedError = (function(_super) {
        __extends(ViewDestroyedError, _super);
        function ViewDestroyedError(details) {
          _super.call(this, "Attempt to use a destroyed view: " + details);
        }
        return ViewDestroyedError;
      }(BaseError));
      $__export("ViewDestroyedError", ViewDestroyedError);
    }
  };
});

System.register("_@angular/core/src/linker/view_utils", ["_@angular/core/src/application_tokens", "_@angular/core/src/change_detection/change_detection", "_@angular/core/src/change_detection/change_detection_util", "_@angular/core/src/di", "_@angular/core/src/facade/lang", "_@angular/core/src/render/api", "_@angular/core/src/security", "_@angular/core/src/linker/element", "_@angular/core/src/linker/errors"], function($__export) {
  "use strict";
  var APP_ID,
      devModeEqual,
      UNINITIALIZED,
      Inject,
      Injectable,
      isPresent,
      looseIdentical,
      RenderComponentType,
      RootRenderer,
      Sanitizer,
      AppElement,
      ExpressionChangedAfterItHasBeenCheckedError,
      ViewUtils,
      EMPTY_ARR,
      MAX_INTERPOLATION_VALUES,
      EMPTY_ARRAY,
      EMPTY_MAP,
      CAMEL_CASE_REGEXP,
      InlineArray0,
      InlineArray2,
      InlineArray4,
      InlineArray8,
      InlineArray16,
      InlineArrayDynamic,
      EMPTY_INLINE_ARRAY;
  function flattenNestedViewRenderNodes(nodes) {
    return _flattenNestedViewRenderNodes(nodes, []);
  }
  function _flattenNestedViewRenderNodes(nodes, renderNodes) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node instanceof AppElement) {
        var appEl = node;
        renderNodes.push(appEl.nativeElement);
        if (isPresent(appEl.nestedViews)) {
          for (var k = 0; k < appEl.nestedViews.length; k++) {
            _flattenNestedViewRenderNodes(appEl.nestedViews[k].rootNodesOrAppElements, renderNodes);
          }
        }
      } else {
        renderNodes.push(node);
      }
    }
    return renderNodes;
  }
  function ensureSlotCount(projectableNodes, expectedSlotCount) {
    var res;
    if (!projectableNodes) {
      res = EMPTY_ARR;
    } else if (projectableNodes.length < expectedSlotCount) {
      var givenSlotCount = projectableNodes.length;
      res = new Array(expectedSlotCount);
      for (var i = 0; i < expectedSlotCount; i++) {
        res[i] = (i < givenSlotCount) ? projectableNodes[i] : EMPTY_ARR;
      }
    } else {
      res = projectableNodes;
    }
    return res;
  }
  function interpolate(valueCount, c0, a1, c1, a2, c2, a3, c3, a4, c4, a5, c5, a6, c6, a7, c7, a8, c8, a9, c9) {
    switch (valueCount) {
      case 1:
        return c0 + _toStringWithNull(a1) + c1;
      case 2:
        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2;
      case 3:
        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3;
      case 4:
        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4;
      case 5:
        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5;
      case 6:
        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6;
      case 7:
        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7;
      case 8:
        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8;
      case 9:
        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8 + _toStringWithNull(a9) + c9;
      default:
        throw new Error("Does not support more than 9 expressions");
    }
  }
  function _toStringWithNull(v) {
    return v != null ? v.toString() : '';
  }
  function checkBinding(throwOnChange, oldValue, newValue) {
    if (throwOnChange) {
      if (!devModeEqual(oldValue, newValue)) {
        throw new ExpressionChangedAfterItHasBeenCheckedError(oldValue, newValue);
      }
      return false;
    } else {
      return !looseIdentical(oldValue, newValue);
    }
  }
  function castByValue(input, value) {
    return input;
  }
  function pureProxy1(fn) {
    var result;
    var v0 = UNINITIALIZED;
    return function(p0) {
      if (!looseIdentical(v0, p0)) {
        v0 = p0;
        result = fn(p0);
      }
      return result;
    };
  }
  function pureProxy2(fn) {
    var result;
    var v0 = UNINITIALIZED;
    var v1 = UNINITIALIZED;
    return function(p0, p1) {
      if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1)) {
        v0 = p0;
        v1 = p1;
        result = fn(p0, p1);
      }
      return result;
    };
  }
  function pureProxy3(fn) {
    var result;
    var v0 = UNINITIALIZED;
    var v1 = UNINITIALIZED;
    var v2 = UNINITIALIZED;
    return function(p0, p1, p2) {
      if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2)) {
        v0 = p0;
        v1 = p1;
        v2 = p2;
        result = fn(p0, p1, p2);
      }
      return result;
    };
  }
  function pureProxy4(fn) {
    var result;
    var v0,
        v1,
        v2,
        v3;
    v0 = v1 = v2 = v3 = UNINITIALIZED;
    return function(p0, p1, p2, p3) {
      if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3)) {
        v0 = p0;
        v1 = p1;
        v2 = p2;
        v3 = p3;
        result = fn(p0, p1, p2, p3);
      }
      return result;
    };
  }
  function pureProxy5(fn) {
    var result;
    var v0,
        v1,
        v2,
        v3,
        v4;
    v0 = v1 = v2 = v3 = v4 = UNINITIALIZED;
    return function(p0, p1, p2, p3, p4) {
      if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4)) {
        v0 = p0;
        v1 = p1;
        v2 = p2;
        v3 = p3;
        v4 = p4;
        result = fn(p0, p1, p2, p3, p4);
      }
      return result;
    };
  }
  function pureProxy6(fn) {
    var result;
    var v0,
        v1,
        v2,
        v3,
        v4,
        v5;
    v0 = v1 = v2 = v3 = v4 = v5 = UNINITIALIZED;
    return function(p0, p1, p2, p3, p4, p5) {
      if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5)) {
        v0 = p0;
        v1 = p1;
        v2 = p2;
        v3 = p3;
        v4 = p4;
        v5 = p5;
        result = fn(p0, p1, p2, p3, p4, p5);
      }
      return result;
    };
  }
  function pureProxy7(fn) {
    var result;
    var v0,
        v1,
        v2,
        v3,
        v4,
        v5,
        v6;
    v0 = v1 = v2 = v3 = v4 = v5 = v6 = UNINITIALIZED;
    return function(p0, p1, p2, p3, p4, p5, p6) {
      if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6)) {
        v0 = p0;
        v1 = p1;
        v2 = p2;
        v3 = p3;
        v4 = p4;
        v5 = p5;
        v6 = p6;
        result = fn(p0, p1, p2, p3, p4, p5, p6);
      }
      return result;
    };
  }
  function pureProxy8(fn) {
    var result;
    var v0,
        v1,
        v2,
        v3,
        v4,
        v5,
        v6,
        v7;
    v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = UNINITIALIZED;
    return function(p0, p1, p2, p3, p4, p5, p6, p7) {
      if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6) || !looseIdentical(v7, p7)) {
        v0 = p0;
        v1 = p1;
        v2 = p2;
        v3 = p3;
        v4 = p4;
        v5 = p5;
        v6 = p6;
        v7 = p7;
        result = fn(p0, p1, p2, p3, p4, p5, p6, p7);
      }
      return result;
    };
  }
  function pureProxy9(fn) {
    var result;
    var v0,
        v1,
        v2,
        v3,
        v4,
        v5,
        v6,
        v7,
        v8;
    v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = UNINITIALIZED;
    return function(p0, p1, p2, p3, p4, p5, p6, p7, p8) {
      if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6) || !looseIdentical(v7, p7) || !looseIdentical(v8, p8)) {
        v0 = p0;
        v1 = p1;
        v2 = p2;
        v3 = p3;
        v4 = p4;
        v5 = p5;
        v6 = p6;
        v7 = p7;
        v8 = p8;
        result = fn(p0, p1, p2, p3, p4, p5, p6, p7, p8);
      }
      return result;
    };
  }
  function pureProxy10(fn) {
    var result;
    var v0,
        v1,
        v2,
        v3,
        v4,
        v5,
        v6,
        v7,
        v8,
        v9;
    v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = v9 = UNINITIALIZED;
    return function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9) {
      if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6) || !looseIdentical(v7, p7) || !looseIdentical(v8, p8) || !looseIdentical(v9, p9)) {
        v0 = p0;
        v1 = p1;
        v2 = p2;
        v3 = p3;
        v4 = p4;
        v5 = p5;
        v6 = p6;
        v7 = p7;
        v8 = p8;
        v9 = p9;
        result = fn(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9);
      }
      return result;
    };
  }
  function setBindingDebugInfoForChanges(renderer, el, changes) {
    Object.keys(changes).forEach(function(propName) {
      setBindingDebugInfo(renderer, el, propName, changes[propName].currentValue);
    });
  }
  function setBindingDebugInfo(renderer, el, propName, value) {
    try {
      renderer.setBindingDebugInfo(el, "ng-reflect-" + camelCaseToDashCase(propName), value ? value.toString() : null);
    } catch (e) {
      renderer.setBindingDebugInfo(el, "ng-reflect-" + camelCaseToDashCase(propName), '[ERROR] Exception while trying to serialize the value');
    }
  }
  function camelCaseToDashCase(input) {
    return input.replace(CAMEL_CASE_REGEXP, function() {
      var m = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        m[_i - 0] = arguments[_i];
      }
      return '-' + m[1].toLowerCase();
    });
  }
  function createRenderElement(renderer, parentElement, name, attrs, debugInfo) {
    var el = renderer.createElement(parentElement, name, debugInfo);
    for (var i = 0; i < attrs.length; i += 2) {
      renderer.setElementAttribute(el, attrs.get(i), attrs.get(i + 1));
    }
    return el;
  }
  function selectOrCreateRenderHostElement(renderer, elementName, attrs, rootSelectorOrNode, debugInfo) {
    var hostElement;
    if (isPresent(rootSelectorOrNode)) {
      hostElement = renderer.selectRootElement(rootSelectorOrNode, debugInfo);
    } else {
      hostElement = createRenderElement(renderer, null, elementName, attrs, debugInfo);
    }
    return hostElement;
  }
  $__export("flattenNestedViewRenderNodes", flattenNestedViewRenderNodes);
  $__export("ensureSlotCount", ensureSlotCount);
  $__export("interpolate", interpolate);
  $__export("checkBinding", checkBinding);
  $__export("castByValue", castByValue);
  $__export("pureProxy1", pureProxy1);
  $__export("pureProxy2", pureProxy2);
  $__export("pureProxy3", pureProxy3);
  $__export("pureProxy4", pureProxy4);
  $__export("pureProxy5", pureProxy5);
  $__export("pureProxy6", pureProxy6);
  $__export("pureProxy7", pureProxy7);
  $__export("pureProxy8", pureProxy8);
  $__export("pureProxy9", pureProxy9);
  $__export("pureProxy10", pureProxy10);
  $__export("setBindingDebugInfoForChanges", setBindingDebugInfoForChanges);
  $__export("setBindingDebugInfo", setBindingDebugInfo);
  $__export("createRenderElement", createRenderElement);
  $__export("selectOrCreateRenderHostElement", selectOrCreateRenderHostElement);
  return {
    setters: [function($__m) {
      APP_ID = $__m.APP_ID;
    }, function($__m) {
      devModeEqual = $__m.devModeEqual;
    }, function($__m) {
      UNINITIALIZED = $__m.UNINITIALIZED;
    }, function($__m) {
      Inject = $__m.Inject;
      Injectable = $__m.Injectable;
    }, function($__m) {
      isPresent = $__m.isPresent;
      looseIdentical = $__m.looseIdentical;
    }, function($__m) {
      RenderComponentType = $__m.RenderComponentType;
      RootRenderer = $__m.RootRenderer;
    }, function($__m) {
      Sanitizer = $__m.Sanitizer;
    }, function($__m) {
      AppElement = $__m.AppElement;
    }, function($__m) {
      ExpressionChangedAfterItHasBeenCheckedError = $__m.ExpressionChangedAfterItHasBeenCheckedError;
    }],
    execute: function() {
      ViewUtils = (function() {
        function ViewUtils(_renderer, _appId, sanitizer) {
          this._renderer = _renderer;
          this._appId = _appId;
          this._nextCompTypeId = 0;
          this.sanitizer = sanitizer;
        }
        ViewUtils.prototype.createRenderComponentType = function(templateUrl, slotCount, encapsulation, styles, animations) {
          return new RenderComponentType(this._appId + "-" + this._nextCompTypeId++, templateUrl, slotCount, encapsulation, styles, animations);
        };
        ViewUtils.prototype.renderComponent = function(renderComponentType) {
          return this._renderer.renderComponent(renderComponentType);
        };
        ViewUtils.decorators = [{type: Injectable}];
        ViewUtils.ctorParameters = [{type: RootRenderer}, {
          type: undefined,
          decorators: [{
            type: Inject,
            args: [APP_ID]
          }]
        }, {type: Sanitizer}];
        return ViewUtils;
      }());
      $__export("ViewUtils", ViewUtils);
      EMPTY_ARR = [];
      MAX_INTERPOLATION_VALUES = 9;
      $__export("MAX_INTERPOLATION_VALUES", MAX_INTERPOLATION_VALUES);
      EMPTY_ARRAY = [];
      $__export("EMPTY_ARRAY", EMPTY_ARRAY);
      EMPTY_MAP = {};
      $__export("EMPTY_MAP", EMPTY_MAP);
      CAMEL_CASE_REGEXP = /([A-Z])/g;
      InlineArray0 = (function() {
        function InlineArray0() {
          this.length = 0;
        }
        InlineArray0.prototype.get = function(index) {
          return undefined;
        };
        return InlineArray0;
      }());
      InlineArray2 = (function() {
        function InlineArray2(length, _v0, _v1) {
          this.length = length;
          this._v0 = _v0;
          this._v1 = _v1;
        }
        InlineArray2.prototype.get = function(index) {
          switch (index) {
            case 0:
              return this._v0;
            case 1:
              return this._v1;
            default:
              return undefined;
          }
        };
        return InlineArray2;
      }());
      $__export("InlineArray2", InlineArray2);
      InlineArray4 = (function() {
        function InlineArray4(length, _v0, _v1, _v2, _v3) {
          this.length = length;
          this._v0 = _v0;
          this._v1 = _v1;
          this._v2 = _v2;
          this._v3 = _v3;
        }
        InlineArray4.prototype.get = function(index) {
          switch (index) {
            case 0:
              return this._v0;
            case 1:
              return this._v1;
            case 2:
              return this._v2;
            case 3:
              return this._v3;
            default:
              return undefined;
          }
        };
        return InlineArray4;
      }());
      $__export("InlineArray4", InlineArray4);
      InlineArray8 = (function() {
        function InlineArray8(length, _v0, _v1, _v2, _v3, _v4, _v5, _v6, _v7) {
          this.length = length;
          this._v0 = _v0;
          this._v1 = _v1;
          this._v2 = _v2;
          this._v3 = _v3;
          this._v4 = _v4;
          this._v5 = _v5;
          this._v6 = _v6;
          this._v7 = _v7;
        }
        InlineArray8.prototype.get = function(index) {
          switch (index) {
            case 0:
              return this._v0;
            case 1:
              return this._v1;
            case 2:
              return this._v2;
            case 3:
              return this._v3;
            case 4:
              return this._v4;
            case 5:
              return this._v5;
            case 6:
              return this._v6;
            case 7:
              return this._v7;
            default:
              return undefined;
          }
        };
        return InlineArray8;
      }());
      $__export("InlineArray8", InlineArray8);
      InlineArray16 = (function() {
        function InlineArray16(length, _v0, _v1, _v2, _v3, _v4, _v5, _v6, _v7, _v8, _v9, _v10, _v11, _v12, _v13, _v14, _v15) {
          this.length = length;
          this._v0 = _v0;
          this._v1 = _v1;
          this._v2 = _v2;
          this._v3 = _v3;
          this._v4 = _v4;
          this._v5 = _v5;
          this._v6 = _v6;
          this._v7 = _v7;
          this._v8 = _v8;
          this._v9 = _v9;
          this._v10 = _v10;
          this._v11 = _v11;
          this._v12 = _v12;
          this._v13 = _v13;
          this._v14 = _v14;
          this._v15 = _v15;
        }
        InlineArray16.prototype.get = function(index) {
          switch (index) {
            case 0:
              return this._v0;
            case 1:
              return this._v1;
            case 2:
              return this._v2;
            case 3:
              return this._v3;
            case 4:
              return this._v4;
            case 5:
              return this._v5;
            case 6:
              return this._v6;
            case 7:
              return this._v7;
            case 8:
              return this._v8;
            case 9:
              return this._v9;
            case 10:
              return this._v10;
            case 11:
              return this._v11;
            case 12:
              return this._v12;
            case 13:
              return this._v13;
            case 14:
              return this._v14;
            case 15:
              return this._v15;
            default:
              return undefined;
          }
        };
        return InlineArray16;
      }());
      $__export("InlineArray16", InlineArray16);
      InlineArrayDynamic = (function() {
        function InlineArrayDynamic(length) {
          var values = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
          }
          this.length = length;
          this._values = values;
        }
        InlineArrayDynamic.prototype.get = function(index) {
          return this._values[index];
        };
        return InlineArrayDynamic;
      }());
      $__export("InlineArrayDynamic", InlineArrayDynamic);
      EMPTY_INLINE_ARRAY = new InlineArray0();
      $__export("EMPTY_INLINE_ARRAY", EMPTY_INLINE_ARRAY);
    }
  };
});

System.register("_@angular/core/src/linker/view", ["_@angular/core/src/change_detection/change_detection", "_@angular/core/src/facade/collection", "_@angular/core/src/facade/lang", "_@angular/core/src/profile/profile", "_@angular/core/src/linker/animation_view_context", "_@angular/core/src/linker/debug_context", "_@angular/core/src/linker/element", "_@angular/core/src/linker/element_injector", "_@angular/core/src/linker/errors", "_@angular/core/src/linker/view_ref", "_@angular/core/src/linker/view_type", "_@angular/core/src/linker/view_utils"], function($__export) {
  "use strict";
  var __extends,
      ChangeDetectorStatus,
      ListWrapper,
      isPresent,
      wtfCreateScope,
      wtfLeave,
      AnimationViewContext,
      DebugContext,
      AppElement,
      ElementInjector,
      ExpressionChangedAfterItHasBeenCheckedError,
      ViewDestroyedError,
      ViewWrappedError,
      ViewRef_,
      ViewType,
      ensureSlotCount,
      flattenNestedViewRenderNodes,
      _scope_check,
      AppView,
      DebugAppView;
  function _findLastRenderNode(node) {
    var lastNode;
    if (node instanceof AppElement) {
      var appEl = node;
      lastNode = appEl.nativeElement;
      if (isPresent(appEl.nestedViews)) {
        for (var i = appEl.nestedViews.length - 1; i >= 0; i--) {
          var nestedView = appEl.nestedViews[i];
          if (nestedView.rootNodesOrAppElements.length > 0) {
            lastNode = _findLastRenderNode(nestedView.rootNodesOrAppElements[nestedView.rootNodesOrAppElements.length - 1]);
          }
        }
      }
    } else {
      lastNode = node;
    }
    return lastNode;
  }
  return {
    setters: [function($__m) {
      ChangeDetectorStatus = $__m.ChangeDetectorStatus;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      wtfCreateScope = $__m.wtfCreateScope;
      wtfLeave = $__m.wtfLeave;
    }, function($__m) {
      AnimationViewContext = $__m.AnimationViewContext;
    }, function($__m) {
      DebugContext = $__m.DebugContext;
    }, function($__m) {
      AppElement = $__m.AppElement;
    }, function($__m) {
      ElementInjector = $__m.ElementInjector;
    }, function($__m) {
      ExpressionChangedAfterItHasBeenCheckedError = $__m.ExpressionChangedAfterItHasBeenCheckedError;
      ViewDestroyedError = $__m.ViewDestroyedError;
      ViewWrappedError = $__m.ViewWrappedError;
    }, function($__m) {
      ViewRef_ = $__m.ViewRef_;
    }, function($__m) {
      ViewType = $__m.ViewType;
    }, function($__m) {
      ensureSlotCount = $__m.ensureSlotCount;
      flattenNestedViewRenderNodes = $__m.flattenNestedViewRenderNodes;
    }],
    execute: function() {
      __extends = (this && this.__extends) || function(d, b) {
        for (var p in b)
          if (b.hasOwnProperty(p))
            d[p] = b[p];
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      _scope_check = wtfCreateScope("AppView#check(ascii id)");
      AppView = (function() {
        function AppView(clazz, componentType, type, viewUtils, parentInjector, declarationAppElement, cdMode) {
          this.clazz = clazz;
          this.componentType = componentType;
          this.type = type;
          this.viewUtils = viewUtils;
          this.parentInjector = parentInjector;
          this.declarationAppElement = declarationAppElement;
          this.cdMode = cdMode;
          this.contentChildren = [];
          this.viewChildren = [];
          this.viewContainerElement = null;
          this.numberOfChecks = 0;
          this.ref = new ViewRef_(this);
          if (type === ViewType.COMPONENT || type === ViewType.HOST) {
            this.renderer = viewUtils.renderComponent(componentType);
          } else {
            this.renderer = declarationAppElement.parentView.renderer;
          }
        }
        Object.defineProperty(AppView.prototype, "animationContext", {
          get: function() {
            if (!this._animationContext) {
              this._animationContext = new AnimationViewContext();
            }
            return this._animationContext;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(AppView.prototype, "destroyed", {
          get: function() {
            return this.cdMode === ChangeDetectorStatus.Destroyed;
          },
          enumerable: true,
          configurable: true
        });
        AppView.prototype.create = function(context, givenProjectableNodes, rootSelectorOrNode) {
          this.context = context;
          var projectableNodes;
          switch (this.type) {
            case ViewType.COMPONENT:
              projectableNodes = ensureSlotCount(givenProjectableNodes, this.componentType.slotCount);
              break;
            case ViewType.EMBEDDED:
              projectableNodes = this.declarationAppElement.parentView.projectableNodes;
              break;
            case ViewType.HOST:
              projectableNodes = givenProjectableNodes;
              break;
          }
          this._hasExternalHostElement = isPresent(rootSelectorOrNode);
          this.projectableNodes = projectableNodes;
          return this.createInternal(rootSelectorOrNode);
        };
        AppView.prototype.createInternal = function(rootSelectorOrNode) {
          return null;
        };
        AppView.prototype.init = function(rootNodesOrAppElements, allNodes, disposables, subscriptions) {
          this.rootNodesOrAppElements = rootNodesOrAppElements;
          this.allNodes = allNodes;
          this.disposables = disposables;
          this.subscriptions = subscriptions;
          if (this.type === ViewType.COMPONENT) {
            this.declarationAppElement.parentView.viewChildren.push(this);
            this.dirtyParentQueriesInternal();
          }
        };
        AppView.prototype.injectorGet = function(token, nodeIndex, notFoundResult) {
          return this.injectorGetInternal(token, nodeIndex, notFoundResult);
        };
        AppView.prototype.injectorGetInternal = function(token, nodeIndex, notFoundResult) {
          return notFoundResult;
        };
        AppView.prototype.injector = function(nodeIndex) {
          if (isPresent(nodeIndex)) {
            return new ElementInjector(this, nodeIndex);
          } else {
            return this.parentInjector;
          }
        };
        AppView.prototype.destroy = function() {
          if (this._hasExternalHostElement) {
            this.renderer.detachView(this.flatRootNodes);
          } else if (isPresent(this.viewContainerElement)) {
            this.viewContainerElement.detachView(this.viewContainerElement.nestedViews.indexOf(this));
          }
          this._destroyRecurse();
        };
        AppView.prototype._destroyRecurse = function() {
          if (this.cdMode === ChangeDetectorStatus.Destroyed) {
            return;
          }
          var children = this.contentChildren;
          for (var i = 0; i < children.length; i++) {
            children[i]._destroyRecurse();
          }
          children = this.viewChildren;
          for (var i = 0; i < children.length; i++) {
            children[i]._destroyRecurse();
          }
          this.destroyLocal();
          this.cdMode = ChangeDetectorStatus.Destroyed;
        };
        AppView.prototype.destroyLocal = function() {
          var _this = this;
          var hostElement = this.type === ViewType.COMPONENT ? this.declarationAppElement.nativeElement : null;
          for (var i = 0; i < this.disposables.length; i++) {
            this.disposables[i]();
          }
          for (var i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
          }
          this.destroyInternal();
          this.dirtyParentQueriesInternal();
          if (this._animationContext) {
            this._animationContext.onAllActiveAnimationsDone(function() {
              return _this.renderer.destroyView(hostElement, _this.allNodes);
            });
          } else {
            this.renderer.destroyView(hostElement, this.allNodes);
          }
        };
        AppView.prototype.destroyInternal = function() {};
        AppView.prototype.detachInternal = function() {};
        AppView.prototype.detach = function() {
          var _this = this;
          this.detachInternal();
          if (this._animationContext) {
            this._animationContext.onAllActiveAnimationsDone(function() {
              return _this.renderer.detachView(_this.flatRootNodes);
            });
          } else {
            this.renderer.detachView(this.flatRootNodes);
          }
        };
        Object.defineProperty(AppView.prototype, "changeDetectorRef", {
          get: function() {
            return this.ref;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(AppView.prototype, "parent", {
          get: function() {
            return isPresent(this.declarationAppElement) ? this.declarationAppElement.parentView : null;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(AppView.prototype, "flatRootNodes", {
          get: function() {
            return flattenNestedViewRenderNodes(this.rootNodesOrAppElements);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(AppView.prototype, "lastRootNode", {
          get: function() {
            var lastNode = this.rootNodesOrAppElements.length > 0 ? this.rootNodesOrAppElements[this.rootNodesOrAppElements.length - 1] : null;
            return _findLastRenderNode(lastNode);
          },
          enumerable: true,
          configurable: true
        });
        AppView.prototype.dirtyParentQueriesInternal = function() {};
        AppView.prototype.detectChanges = function(throwOnChange) {
          var s = _scope_check(this.clazz);
          if (this.cdMode === ChangeDetectorStatus.Checked || this.cdMode === ChangeDetectorStatus.Errored)
            return;
          if (this.cdMode === ChangeDetectorStatus.Destroyed) {
            this.throwDestroyedError('detectChanges');
          }
          this.detectChangesInternal(throwOnChange);
          if (this.cdMode === ChangeDetectorStatus.CheckOnce)
            this.cdMode = ChangeDetectorStatus.Checked;
          this.numberOfChecks++;
          wtfLeave(s);
        };
        AppView.prototype.detectChangesInternal = function(throwOnChange) {
          this.detectContentChildrenChanges(throwOnChange);
          this.detectViewChildrenChanges(throwOnChange);
        };
        AppView.prototype.detectContentChildrenChanges = function(throwOnChange) {
          for (var i = 0; i < this.contentChildren.length; ++i) {
            var child = this.contentChildren[i];
            if (child.cdMode === ChangeDetectorStatus.Detached)
              continue;
            child.detectChanges(throwOnChange);
          }
        };
        AppView.prototype.detectViewChildrenChanges = function(throwOnChange) {
          for (var i = 0; i < this.viewChildren.length; ++i) {
            var child = this.viewChildren[i];
            if (child.cdMode === ChangeDetectorStatus.Detached)
              continue;
            child.detectChanges(throwOnChange);
          }
        };
        AppView.prototype.markContentChildAsMoved = function(renderAppElement) {
          this.dirtyParentQueriesInternal();
        };
        AppView.prototype.addToContentChildren = function(renderAppElement) {
          renderAppElement.parentView.contentChildren.push(this);
          this.viewContainerElement = renderAppElement;
          this.dirtyParentQueriesInternal();
        };
        AppView.prototype.removeFromContentChildren = function(renderAppElement) {
          ListWrapper.remove(renderAppElement.parentView.contentChildren, this);
          this.dirtyParentQueriesInternal();
          this.viewContainerElement = null;
        };
        AppView.prototype.markAsCheckOnce = function() {
          this.cdMode = ChangeDetectorStatus.CheckOnce;
        };
        AppView.prototype.markPathToRootAsCheckOnce = function() {
          var c = this;
          while (isPresent(c) && c.cdMode !== ChangeDetectorStatus.Detached) {
            if (c.cdMode === ChangeDetectorStatus.Checked) {
              c.cdMode = ChangeDetectorStatus.CheckOnce;
            }
            var parentEl = c.type === ViewType.COMPONENT ? c.declarationAppElement : c.viewContainerElement;
            c = isPresent(parentEl) ? parentEl.parentView : null;
          }
        };
        AppView.prototype.eventHandler = function(cb) {
          return cb;
        };
        AppView.prototype.throwDestroyedError = function(details) {
          throw new ViewDestroyedError(details);
        };
        return AppView;
      }());
      $__export("AppView", AppView);
      DebugAppView = (function(_super) {
        __extends(DebugAppView, _super);
        function DebugAppView(clazz, componentType, type, viewUtils, parentInjector, declarationAppElement, cdMode, staticNodeDebugInfos) {
          _super.call(this, clazz, componentType, type, viewUtils, parentInjector, declarationAppElement, cdMode);
          this.staticNodeDebugInfos = staticNodeDebugInfos;
          this._currentDebugContext = null;
        }
        DebugAppView.prototype.create = function(context, givenProjectableNodes, rootSelectorOrNode) {
          this._resetDebug();
          try {
            return _super.prototype.create.call(this, context, givenProjectableNodes, rootSelectorOrNode);
          } catch (e) {
            this._rethrowWithContext(e);
            throw e;
          }
        };
        DebugAppView.prototype.injectorGet = function(token, nodeIndex, notFoundResult) {
          this._resetDebug();
          try {
            return _super.prototype.injectorGet.call(this, token, nodeIndex, notFoundResult);
          } catch (e) {
            this._rethrowWithContext(e);
            throw e;
          }
        };
        DebugAppView.prototype.detach = function() {
          this._resetDebug();
          try {
            _super.prototype.detach.call(this);
          } catch (e) {
            this._rethrowWithContext(e);
            throw e;
          }
        };
        DebugAppView.prototype.destroyLocal = function() {
          this._resetDebug();
          try {
            _super.prototype.destroyLocal.call(this);
          } catch (e) {
            this._rethrowWithContext(e);
            throw e;
          }
        };
        DebugAppView.prototype.detectChanges = function(throwOnChange) {
          this._resetDebug();
          try {
            _super.prototype.detectChanges.call(this, throwOnChange);
          } catch (e) {
            this._rethrowWithContext(e);
            throw e;
          }
        };
        DebugAppView.prototype._resetDebug = function() {
          this._currentDebugContext = null;
        };
        DebugAppView.prototype.debug = function(nodeIndex, rowNum, colNum) {
          return this._currentDebugContext = new DebugContext(this, nodeIndex, rowNum, colNum);
        };
        DebugAppView.prototype._rethrowWithContext = function(e) {
          if (!(e instanceof ViewWrappedError)) {
            if (!(e instanceof ExpressionChangedAfterItHasBeenCheckedError)) {
              this.cdMode = ChangeDetectorStatus.Errored;
            }
            if (isPresent(this._currentDebugContext)) {
              throw new ViewWrappedError(e, this._currentDebugContext);
            }
          }
        };
        DebugAppView.prototype.eventHandler = function(cb) {
          var _this = this;
          var superHandler = _super.prototype.eventHandler.call(this, cb);
          return function(event) {
            _this._resetDebug();
            try {
              return superHandler(event);
            } catch (e) {
              _this._rethrowWithContext(e);
              throw e;
            }
          };
        };
        return DebugAppView;
      }(AppView));
      $__export("DebugAppView", DebugAppView);
    }
  };
});

System.register("_@angular/core/src/metadata/view", [], function($__export) {
  "use strict";
  var ViewEncapsulation,
      ViewMetadata;
  return {
    setters: [],
    execute: function() {
      $__export("ViewEncapsulation", ViewEncapsulation);
      (function(ViewEncapsulation) {
        ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
        ViewEncapsulation[ViewEncapsulation["Native"] = 1] = "Native";
        ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
      })(ViewEncapsulation || ($__export("ViewEncapsulation", ViewEncapsulation = {})));
      ViewMetadata = (function() {
        function ViewMetadata(_a) {
          var _b = _a === void 0 ? {} : _a,
              templateUrl = _b.templateUrl,
              template = _b.template,
              encapsulation = _b.encapsulation,
              styles = _b.styles,
              styleUrls = _b.styleUrls,
              animations = _b.animations,
              interpolation = _b.interpolation;
          this.templateUrl = templateUrl;
          this.template = template;
          this.styleUrls = styleUrls;
          this.styles = styles;
          this.encapsulation = encapsulation;
          this.animations = animations;
          this.interpolation = interpolation;
        }
        return ViewMetadata;
      }());
      $__export("ViewMetadata", ViewMetadata);
    }
  };
});

//# sourceMappingURL=ngForCompiled.js.map