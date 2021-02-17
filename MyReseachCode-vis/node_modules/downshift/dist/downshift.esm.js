import computeScrollIntoView from 'compute-scroll-into-view';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// istanbul ignore next
var statusDiv = typeof document === 'undefined' ? null : document.getElementById('a11y-status-message');

var statuses = [];

/**
 * @param {String} status the status message
 */
function setStatus(status) {
  var isSameAsLast = statuses[statuses.length - 1] === status;
  if (isSameAsLast) {
    statuses = [].concat(statuses, [status]);
  } else {
    statuses = [status];
  }
  var div = getStatusDiv();

  // Remove previous children
  while (div.lastChild) {
    div.removeChild(div.firstChild);
  }

  statuses.filter(Boolean).forEach(function (statusItem, index) {
    div.appendChild(getStatusChildDiv(statusItem, index));
  });
}

/**
 * @param {String} status the status message
 * @param {Number} index the index
 * @return {HTMLElement} the child node
 */
function getStatusChildDiv(status, index) {
  var display = index === statuses.length - 1 ? 'block' : 'none';

  var childDiv = document.createElement('div');
  childDiv.style.display = display;
  childDiv.textContent = status;

  return childDiv;
}

/**
 * Get the status node or create it if it does not already exist
 * @return {HTMLElement} the status node
 */
function getStatusDiv() {
  if (statusDiv) {
    return statusDiv;
  }
  statusDiv = document.createElement('div');
  statusDiv.setAttribute('id', 'a11y-status-message');
  statusDiv.setAttribute('role', 'status');
  statusDiv.setAttribute('aria-live', 'assertive');
  statusDiv.setAttribute('aria-relevant', 'additions text');
  Object.assign(statusDiv.style, {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px'
  });
  document.body.appendChild(statusDiv);
  return statusDiv;
}

var unknown = process.env.NODE_ENV !== "production" ? '__autocomplete_unknown__' : 0;
var mouseUp = process.env.NODE_ENV !== "production" ? '__autocomplete_mouseup__' : 1;
var itemMouseEnter = process.env.NODE_ENV !== "production" ? '__autocomplete_item_mouseenter__' : 2;
var keyDownArrowUp = process.env.NODE_ENV !== "production" ? '__autocomplete_keydown_arrow_up__' : 3;
var keyDownArrowDown = process.env.NODE_ENV !== "production" ? '__autocomplete_keydown_arrow_down__' : 4;
var keyDownEscape = process.env.NODE_ENV !== "production" ? '__autocomplete_keydown_escape__' : 5;
var keyDownEnter = process.env.NODE_ENV !== "production" ? '__autocomplete_keydown_enter__' : 6;
var clickItem = process.env.NODE_ENV !== "production" ? '__autocomplete_click_item__' : 7;
var blurInput = process.env.NODE_ENV !== "production" ? '__autocomplete_blur_input__' : 8;
var changeInput = process.env.NODE_ENV !== "production" ? '__autocomplete_change_input__' : 9;
var keyDownSpaceButton = process.env.NODE_ENV !== "production" ? '__autocomplete_keydown_space_button__' : 10;
var clickButton = process.env.NODE_ENV !== "production" ? '__autocomplete_click_button__' : 11;
var blurButton = process.env.NODE_ENV !== "production" ? '__autocomplete_blur_button__' : 12;
var controlledPropUpdatedSelectedItem = process.env.NODE_ENV !== "production" ? '__autocomplete_controlled_prop_updated_selected_item__' : 13;
var touchStart = process.env.NODE_ENV !== "production" ? '__autocomplete_touchstart__' : 14;

var stateChangeTypes = /*#__PURE__*/Object.freeze({
  unknown: unknown,
  mouseUp: mouseUp,
  itemMouseEnter: itemMouseEnter,
  keyDownArrowUp: keyDownArrowUp,
  keyDownArrowDown: keyDownArrowDown,
  keyDownEscape: keyDownEscape,
  keyDownEnter: keyDownEnter,
  clickItem: clickItem,
  blurInput: blurInput,
  changeInput: changeInput,
  keyDownSpaceButton: keyDownSpaceButton,
  clickButton: clickButton,
  blurButton: blurButton,
  controlledPropUpdatedSelectedItem: controlledPropUpdatedSelectedItem,
  touchStart: touchStart
});

var idCounter = 0;

/**
 * Accepts a parameter and returns it if it's a function
 * or a noop function if it's not. This allows us to
 * accept a callback, but not worry about it if it's not
 * passed.
 * @param {Function} cb the callback
 * @return {Function} a function
 */
function cbToCb(cb) {
  return typeof cb === 'function' ? cb : noop;
}

function noop() {}

/**
 * Scroll node into view if necessary
 * @param {HTMLElement} node the element that should scroll into view
 * @param {HTMLElement} rootNode the root element of the component
 */
function scrollIntoView(node, rootNode) {
  if (node === null) {
    return;
  }

  var actions = computeScrollIntoView(node, {
    boundary: rootNode,
    block: 'nearest',
    scrollMode: 'if-needed'
  });
  actions.forEach(function (_ref) {
    var el = _ref.el,
        top = _ref.top,
        left = _ref.left;

    el.scrollTop = top;
    el.scrollLeft = left;
  });
}

/**
 * @param {HTMLElement} parent the parent node
 * @param {HTMLElement} child the child node
 * @return {Boolean} whether the parent is the child or the child is in the parent
 */
function isOrContainsNode(parent, child) {
  return parent === child || parent.contains && parent.contains(child);
}

/**
 * Simple debounce implementation. Will call the given
 * function once after the time given has passed since
 * it was last called.
 * @param {Function} fn the function to call after the time
 * @param {Number} time the time to wait
 * @return {Function} the debounced function
 */
function debounce(fn, time) {
  var timeoutId = void 0;

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  function wrapper() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    cancel();
    timeoutId = setTimeout(function () {
      timeoutId = null;
      fn.apply(undefined, args);
    }, time);
  }

  wrapper.cancel = cancel;

  return wrapper;
}

/**
 * This is intended to be used to compose event handlers.
 * They are executed in order until one of them sets
 * `event.preventDownshiftDefault = true`.
 * @param {...Function} fns the event handler functions
 * @return {Function} the event handler to add to an element
 */
function callAllEventHandlers() {
  for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  return function (event) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    return fns.some(function (fn) {
      if (fn) {
        fn.apply(undefined, [event].concat(args));
      }
      return event.preventDownshiftDefault || event.hasOwnProperty('nativeEvent') && event.nativeEvent.preventDownshiftDefault;
    });
  };
}

/**
 * This return a function that will call all the given functions with
 * the arguments with which it's called. It does a null-check before
 * attempting to call the functions and can take any number of functions.
 * @param {...Function} fns the functions to call
 * @return {Function} the function that calls all the functions
 */
function callAll() {
  for (var _len4 = arguments.length, fns = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    fns[_key4] = arguments[_key4];
  }

  return function () {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    fns.forEach(function (fn) {
      if (fn) {
        fn.apply(undefined, args);
      }
    });
  };
}

/**
 * This generates a unique ID for an instance of Downshift
 * @return {String} the unique ID
 */
function generateId() {
  return String(idCounter++);
}

/**
 * Resets idCounter to 0. Used for SSR.
 */
function resetIdCounter() {
  idCounter = 0;
}

/**
 * @param {Object} param the downshift state and other relevant properties
 * @return {String} the a11y status message
 */
function getA11yStatusMessage(_ref2) {
  var isOpen = _ref2.isOpen,
      highlightedItem = _ref2.highlightedItem,
      selectedItem = _ref2.selectedItem,
      resultCount = _ref2.resultCount,
      previousResultCount = _ref2.previousResultCount,
      itemToString = _ref2.itemToString;

  if (!isOpen) {
    if (selectedItem) {
      return itemToString(selectedItem);
    } else {
      return '';
    }
  }

  if (!resultCount) {
    return 'No results.';
  } else if (!highlightedItem || resultCount !== previousResultCount) {
    return resultCount + ' ' + (resultCount === 1 ? 'result is' : 'results are') + ' available, use up and down arrow keys to navigate.';
  }
  return itemToString(highlightedItem);
}

/**
 * Takes an argument and if it's an array, returns the first item in the array
 * otherwise returns the argument
 * @param {*} arg the maybe-array
 * @param {*} defaultValue the value if arg is falsey not defined
 * @return {*} the arg or it's first item
 */
function unwrapArray(arg, defaultValue) {
  arg = Array.isArray(arg) ? /* istanbul ignore next (preact) */arg[0] : arg;
  if (!arg && defaultValue) {
    return defaultValue;
  } else {
    return arg;
  }
}

/**
 * @param {Object} element (P)react element
 * @return {Boolean} whether it's a DOM element
 */
function isDOMElement(element) {

  // then we assume this is react
  return typeof element.type === 'string';
}

/**
 * @param {Object} element (P)react element
 * @return {Object} the props
 */
function getElementProps(element) {

  return element.props;
}

/**
 * Throws a helpful error message for required properties. Useful
 * to be used as a default in destructuring or object params.
 * @param {String} fnName the function name
 * @param {String} propName the prop name
 */
function requiredProp(fnName, propName) {
  // eslint-disable-next-line no-console
  console.error('The property "' + propName + '" is required in "' + fnName + '"');
}

var stateKeys = ['highlightedIndex', 'inputValue', 'isOpen', 'selectedItem', 'type'];
/**
 * @param {Object} state the state object
 * @return {Object} state that is relevant to downshift
 */
function pickState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var result = {};
  stateKeys.forEach(function (k) {
    if (state.hasOwnProperty(k)) {
      result[k] = state[k];
    }
  });
  return result;
}

/**
 * Normalizes the 'key' property of a KeyboardEvent in IE/Edge
 * @param {Object} event a keyboardEvent object
 * @return {String} keyboard key
 */
function normalizeArrowKey(event) {
  var key = event.key,
      keyCode = event.keyCode;
  /* istanbul ignore next (ie) */

  if (keyCode >= 37 && keyCode <= 40 && key.indexOf('Arrow') !== 0) {
    return 'Arrow' + key;
  }
  return key;
}

/**
 * Simple check if the value passed is object literal
 * @param {*} obj any things
 * @return {Boolean} whether it's object literal
 */
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/* eslint camelcase:0 */

var Downshift = function (_Component) {
  inherits(Downshift, _Component);

  function Downshift(props) {
    classCallCheck(this, Downshift);

    var _this = possibleConstructorReturn(this, _Component.call(this, props));

    _initialiseProps.call(_this);

    var state = _this.getState({
      highlightedIndex: _this.props.defaultHighlightedIndex,
      isOpen: _this.props.defaultIsOpen,
      inputValue: _this.props.defaultInputValue,
      selectedItem: _this.props.defaultSelectedItem
    });
    if (state.selectedItem != null) {
      state.inputValue = _this.props.itemToString(state.selectedItem);
    }
    _this.state = state;
    return _this;
  }
  // itemCount can be changed asynchronously
  // from within downshift (so it can't come from a prop)
  // this is why we store it as an instance and use
  // getItemCount rather than just use items.length
  // (to support windowing + async)


  /**
   * @param {Function} fn the function to call after the time
   * @param {Number} time the time to wait
   */


  /**
   * Clear all running timeouts
   */
  Downshift.prototype.internalClearTimeouts = function internalClearTimeouts() {
    this.timeoutIds.forEach(function (id) {
      clearTimeout(id);
    });

    this.timeoutIds = [];
  };

  /**
   * Gets the state based on internal state or props
   * If a state value is passed via props, then that
   * is the value given, otherwise it's retrieved from
   * stateToMerge
   *
   * This will perform a shallow merge of the given state object
   * with the state coming from props
   * (for the controlled component scenario)
   * This is used in state updater functions so they're referencing
   * the right state regardless of where it comes from.
   *
   * @param {Object} stateToMerge defaults to this.state
   * @return {Object} the state
   */


  Downshift.prototype.getState = function getState() {
    var _this2 = this;

    var stateToMerge = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;

    return Object.keys(stateToMerge).reduce(function (state, key) {
      state[key] = _this2.isControlledProp(key) ? _this2.props[key] : stateToMerge[key];
      return state;
    }, {});
  };

  /**
   * This determines whether a prop is a "controlled prop" meaning it is
   * state which is controlled by the outside of this component rather
   * than within this component.
   * @param {String} key the key to check
   * @return {Boolean} whether it is a controlled controlled prop
   */


  Downshift.prototype.isControlledProp = function isControlledProp(key) {
    return this.props[key] !== undefined;
  };

  Downshift.prototype.getItemCount = function getItemCount() {
    // things read better this way. They're in priority order:
    // 1. `this.itemCount`
    // 2. `this.props.itemCount`
    // 3. `this.items.length`
    var itemCount = this.items.length;
    if (this.itemCount != null) {
      itemCount = this.itemCount;
    } else if (this.props.itemCount !== undefined) {
      itemCount = this.props.itemCount;
    }
    return itemCount;
  };

  Downshift.prototype.getItemNodeFromIndex = function getItemNodeFromIndex(index) {
    return this.props.environment.document.getElementById(this.getItemId(index));
  };

  Downshift.prototype.scrollHighlightedItemIntoView = function scrollHighlightedItemIntoView() {
    /* istanbul ignore else (react-native) */
    {
      var node = this.getItemNodeFromIndex(this.getState().highlightedIndex);
      this.props.scrollIntoView(node, this._rootNode);
    }
  };

  Downshift.prototype.moveHighlightedIndex = function moveHighlightedIndex(amount, otherStateToSet) {
    if (this.getState().isOpen) {
      this.changeHighlightedIndex(amount, otherStateToSet);
    } else {
      this.setHighlightedIndex(undefined, _extends({ isOpen: true }, otherStateToSet));
    }
  };

  Downshift.prototype.changeHighlightedIndex = function changeHighlightedIndex(moveAmount, otherStateToSet) {
    var itemsLastIndex = this.getItemCount() - 1;
    if (itemsLastIndex < 0) {
      return;
    }

    var _getState = this.getState(),
        highlightedIndex = _getState.highlightedIndex;

    var baseIndex = highlightedIndex;
    if (baseIndex === null) {
      baseIndex = moveAmount > 0 ? -1 : itemsLastIndex + 1;
    }
    var newIndex = baseIndex + moveAmount;
    if (newIndex < 0) {
      newIndex = itemsLastIndex;
    } else if (newIndex > itemsLastIndex) {
      newIndex = 0;
    }
    this.setHighlightedIndex(newIndex, otherStateToSet);
  };

  // any piece of our state can live in two places:
  // 1. Uncontrolled: it's internal (this.state)
  //    We will call this.setState to update that state
  // 2. Controlled: it's external (this.props)
  //    We will call this.props.onStateChange to update that state
  //
  // In addition, we'll call this.props.onChange if the
  // selectedItem is changed.


  Downshift.prototype.getStateAndHelpers = function getStateAndHelpers() {
    var _getState2 = this.getState(),
        highlightedIndex = _getState2.highlightedIndex,
        inputValue = _getState2.inputValue,
        selectedItem = _getState2.selectedItem,
        isOpen = _getState2.isOpen;

    var itemToString = this.props.itemToString;
    var id = this.id;
    var getRootProps = this.getRootProps,
        getToggleButtonProps = this.getToggleButtonProps,
        getLabelProps = this.getLabelProps,
        getMenuProps = this.getMenuProps,
        getInputProps = this.getInputProps,
        getItemProps = this.getItemProps,
        openMenu = this.openMenu,
        closeMenu = this.closeMenu,
        toggleMenu = this.toggleMenu,
        selectItem = this.selectItem,
        selectItemAtIndex = this.selectItemAtIndex,
        selectHighlightedItem = this.selectHighlightedItem,
        setHighlightedIndex = this.setHighlightedIndex,
        clearSelection = this.clearSelection,
        clearItems = this.clearItems,
        reset = this.reset,
        setItemCount = this.setItemCount,
        unsetItemCount = this.unsetItemCount,
        setState = this.internalSetState;

    return {
      // prop getters
      getRootProps: getRootProps,
      getToggleButtonProps: getToggleButtonProps,
      getLabelProps: getLabelProps,
      getMenuProps: getMenuProps,
      getInputProps: getInputProps,
      getItemProps: getItemProps,

      // actions
      reset: reset,
      openMenu: openMenu,
      closeMenu: closeMenu,
      toggleMenu: toggleMenu,
      selectItem: selectItem,
      selectItemAtIndex: selectItemAtIndex,
      selectHighlightedItem: selectHighlightedItem,
      setHighlightedIndex: setHighlightedIndex,
      clearSelection: clearSelection,
      clearItems: clearItems,
      setItemCount: setItemCount,
      unsetItemCount: unsetItemCount,
      setState: setState,

      // props
      itemToString: itemToString,

      // derived
      id: id,

      // state
      highlightedIndex: highlightedIndex,
      inputValue: inputValue,
      isOpen: isOpen,
      selectedItem: selectedItem
    };
  };

  //////////////////////////// ROOT

  //\\\\\\\\\\\\\\\\\\\\\\\\\\ ROOT

  //////////////////////////// BUTTON

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ BUTTON

  /////////////////////////////// LABEL

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ LABEL

  /////////////////////////////// INPUT

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ INPUT

  /////////////////////////////// MENU

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ MENU

  /////////////////////////////// ITEM

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ ITEM

  Downshift.prototype.componentDidMount = function componentDidMount() {
    var _this3 = this;

    /* istanbul ignore if (react-native) */
    if (process.env.NODE_ENV !== 'production' && !false && this.getMenuProps.called && !this.getMenuProps.suppressRefError) {
      validateGetMenuPropsCalledCorrectly(this._menuNode, this.getMenuProps);
    }

    /* istanbul ignore if (react-native) */
    {
      var targetWithinDownshift = function (target) {
        var checkActiveElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var document = _this3.props.environment.document;

        return [_this3._rootNode, _this3._menuNode].some(function (contextNode) {
          return contextNode && (isOrContainsNode(contextNode, target) || checkActiveElement && isOrContainsNode(contextNode, document.activeElement));
        });
      };
      // this.isMouseDown helps us track whether the mouse is currently held down.
      // This is useful when the user clicks on an item in the list, but holds the mouse
      // down long enough for the list to disappear (because the blur event fires on the input)
      // this.isMouseDown is used in the blur handler on the input to determine whether the blur event should
      // trigger hiding the menu.
      var onMouseDown = function () {
        _this3.isMouseDown = true;
      };
      var onMouseUp = function (event) {
        _this3.isMouseDown = false;
        // if the target element or the activeElement is within a downshift node
        // then we don't want to reset downshift
        var contextWithinDownshift = targetWithinDownshift(event.target);
        if (!contextWithinDownshift && _this3.getState().isOpen) {
          _this3.reset({ type: mouseUp }, function () {
            return _this3.props.onOuterClick(_this3.getStateAndHelpers());
          });
        }
      };
      // Touching an element in iOS gives focus and hover states, but touching out of
      // the element will remove hover, and persist the focus state, resulting in the
      // blur event not being triggered.
      var onTouchStart = function (event) {
        var contextWithinDownshift = targetWithinDownshift(event.target, false);
        if (!contextWithinDownshift && _this3.getState().isOpen) {
          _this3.reset({ type: touchStart }, function () {
            return _this3.props.onOuterClick(_this3.getStateAndHelpers());
          });
        }
      };

      this.props.environment.addEventListener('mousedown', onMouseDown);
      this.props.environment.addEventListener('mouseup', onMouseUp);
      this.props.environment.addEventListener('touchstart', onTouchStart);

      this.cleanup = function () {
        _this3.internalClearTimeouts();
        _this3.updateStatus.cancel();
        _this3.props.environment.removeEventListener('mousedown', onMouseDown);
        _this3.props.environment.removeEventListener('mouseup', onMouseUp);
        _this3.props.environment.removeEventListener('touchstart', onTouchStart);
      };
    }
  };

  Downshift.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    /* istanbul ignore if (react-native) */
    if (process.env.NODE_ENV !== 'production' && !false && this.getMenuProps.called && !this.getMenuProps.suppressRefError) {
      validateGetMenuPropsCalledCorrectly(this._menuNode, this.getMenuProps);
    }

    if (this.isControlledProp('selectedItem') && this.props.selectedItemChanged(prevProps.selectedItem, this.props.selectedItem)) {
      this.internalSetState({
        type: controlledPropUpdatedSelectedItem,
        inputValue: this.props.itemToString(this.props.selectedItem)
      });
    }

    var current = this.props.highlightedIndex === undefined ? this.state : this.props;
    var prev = prevProps.highlightedIndex === undefined ? prevState : prevProps;

    if (current.highlightedIndex !== prev.highlightedIndex && !this.avoidScrolling) {
      this.scrollHighlightedItemIntoView();
    }

    /* istanbul ignore else (react-native) */
    this.updateStatus();
  };

  Downshift.prototype.componentWillUnmount = function componentWillUnmount() {
    this.cleanup(); // avoids memory leak
  };

  Downshift.prototype.render = function render() {
    var children = unwrapArray(this.props.children, noop);
    // because the items are rerendered every time we call the children
    // we clear this out each render and it will be populated again as
    // getItemProps is called.
    this.clearItems();
    // we reset this so we know whether the user calls getRootProps during
    // this render. If they do then we don't need to do anything,
    // if they don't then we need to clone the element they return and
    // apply the props for them.
    this.getRootProps.called = false;
    this.getRootProps.refKey = undefined;
    this.getRootProps.suppressRefError = undefined;
    // we do something similar for getMenuProps
    this.getMenuProps.called = false;
    this.getMenuProps.refKey = undefined;
    this.getMenuProps.suppressRefError = undefined;
    // we do something similar for getLabelProps
    this.getLabelProps.called = false;
    // and something similar for getInputProps
    this.getInputProps.called = false;
    var element = unwrapArray(children(this.getStateAndHelpers()));
    if (!element) {
      return null;
    }

    if (this.getRootProps.called || this.props.suppressRefError) {
      if (process.env.NODE_ENV !== 'production' && !this.getRootProps.suppressRefError && !this.props.suppressRefError) {
        validateGetRootPropsCalledCorrectly(element, this.getRootProps);
      }
      return element;
    } else if (isDOMElement(element)) {
      // they didn't apply the root props, but we can clone
      // this and apply the props ourselves
      return React.cloneElement(element, this.getRootProps(getElementProps(element)));
    }

    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      // they didn't apply the root props, but they need to
      // otherwise we can't query around the autocomplete

      throw new Error('downshift: If you return a non-DOM element, you must use apply the getRootProps function');
    }

    /* istanbul ignore next */
    return undefined;
  };

  return Downshift;
}(Component);

Downshift.defaultProps = {
  defaultHighlightedIndex: null,
  defaultSelectedItem: null,
  defaultInputValue: '',
  defaultIsOpen: false,
  getA11yStatusMessage: getA11yStatusMessage,
  itemToString: function itemToString(i) {
    if (i == null) {
      return '';
    }
    if (process.env.NODE_ENV !== 'production' && isPlainObject(i) && !i.hasOwnProperty('toString')) {
      // eslint-disable-next-line no-console
      console.warn('downshift: An object was passed to the default implementation of `itemToString`. You should probably provide your own `itemToString` implementation. Please refer to the `itemToString` API documentation.', 'The object that was passed:', i);
    }
    return String(i);
  },
  onStateChange: noop,
  onInputValueChange: noop,
  onUserAction: noop,
  onChange: noop,
  onSelect: noop,
  onOuterClick: noop,
  selectedItemChanged: function selectedItemChanged(prevItem, item) {
    return prevItem !== item;
  },
  environment: typeof window === 'undefined' /* istanbul ignore next (ssr) */
  ? {} : window,
  stateReducer: function stateReducer(state, stateToSet) {
    return stateToSet;
  },
  suppressRefError: false,
  scrollIntoView: scrollIntoView
};
Downshift.stateChangeTypes = stateChangeTypes;

var _initialiseProps = function () {
  var _this4 = this;

  this.id = this.props.id || 'downshift-' + generateId();
  this.menuId = this.props.menuId || this.id + '-menu';
  this.labelId = this.props.labelId || this.id + '-label';
  this.inputId = this.props.inputId || this.id + '-input';

  this.getItemId = this.props.getItemId || function (index) {
    return _this4.id + '-item-' + index;
  };

  this.input = null;
  this.items = [];
  this.itemCount = null;
  this.previousResultCount = 0;
  this.timeoutIds = [];

  this.internalSetTimeout = function (fn, time) {
    var id = setTimeout(function () {
      _this4.timeoutIds = _this4.timeoutIds.filter(function (i) {
        return i !== id;
      });
      fn();
    }, time);

    _this4.timeoutIds.push(id);
  };

  this.setItemCount = function (count) {
    _this4.itemCount = count;
  };

  this.unsetItemCount = function () {
    _this4.itemCount = null;
  };

  this.setHighlightedIndex = function () {
    var highlightedIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this4.props.defaultHighlightedIndex;
    var otherStateToSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    otherStateToSet = pickState(otherStateToSet);
    _this4.internalSetState(_extends({ highlightedIndex: highlightedIndex }, otherStateToSet));
  };

  this.clearSelection = function (cb) {
    _this4.internalSetState({
      selectedItem: null,
      inputValue: '',
      isOpen: false
    }, cb);
  };

  this.selectItem = function (item, otherStateToSet, cb) {
    otherStateToSet = pickState(otherStateToSet);
    _this4.internalSetState(_extends({
      isOpen: false,
      highlightedIndex: _this4.props.defaultHighlightedIndex,
      selectedItem: item,
      inputValue: _this4.isControlledProp('selectedItem') ? _this4.props.defaultInputValue : _this4.props.itemToString(item)
    }, otherStateToSet), cb);
  };

  this.selectItemAtIndex = function (itemIndex, otherStateToSet, cb) {
    var item = _this4.items[itemIndex];
    if (item == null) {
      return;
    }
    _this4.selectItem(item, otherStateToSet, cb);
  };

  this.selectHighlightedItem = function (otherStateToSet, cb) {
    return _this4.selectItemAtIndex(_this4.getState().highlightedIndex, otherStateToSet, cb);
  };

  this.internalSetState = function (stateToSet, cb) {
    var isItemSelected = void 0,
        onChangeArg = void 0;

    var onStateChangeArg = {};
    var isStateToSetFunction = typeof stateToSet === 'function';

    // we want to call `onInputValueChange` before the `setState` call
    // so someone controlling the `inputValue` state gets notified of
    // the input change as soon as possible. This avoids issues with
    // preserving the cursor position.
    // See https://github.com/paypal/downshift/issues/217 for more info.
    if (!isStateToSetFunction && stateToSet.hasOwnProperty('inputValue')) {
      _this4.props.onInputValueChange(stateToSet.inputValue, _extends({}, _this4.getStateAndHelpers(), stateToSet));
    }
    return _this4.setState(function (state) {
      state = _this4.getState(state);
      var newStateToSet = isStateToSetFunction ? stateToSet(state) : stateToSet;

      // Your own function that could modify the state that will be set.
      newStateToSet = _this4.props.stateReducer(state, newStateToSet);

      // checks if an item is selected, regardless of if it's different from
      // what was selected before
      // used to determine if onSelect and onChange callbacks should be called
      isItemSelected = newStateToSet.hasOwnProperty('selectedItem');
      // this keeps track of the object we want to call with setState
      var nextState = {};
      // this is just used to tell whether the state changed
      var nextFullState = {};
      // we need to call on change if the outside world is controlling any of our state
      // and we're trying to update that state. OR if the selection has changed and we're
      // trying to update the selection
      if (isItemSelected && newStateToSet.selectedItem !== state.selectedItem) {
        onChangeArg = newStateToSet.selectedItem;
      }
      newStateToSet.type = newStateToSet.type || unknown;

      Object.keys(newStateToSet).forEach(function (key) {
        // onStateChangeArg should only have the state that is
        // actually changing
        if (state[key] !== newStateToSet[key]) {
          onStateChangeArg[key] = newStateToSet[key];
        }
        // the type is useful for the onStateChangeArg
        // but we don't actually want to set it in internal state.
        // this is an undocumented feature for now... Not all internalSetState
        // calls support it and I'm not certain we want them to yet.
        // But it enables users controlling the isOpen state to know when
        // the isOpen state changes due to mouseup events which is quite handy.
        if (key === 'type') {
          return;
        }
        nextFullState[key] = newStateToSet[key];
        // if it's coming from props, then we don't care to set it internally
        if (!_this4.isControlledProp(key)) {
          nextState[key] = newStateToSet[key];
        }
      });

      // if stateToSet is a function, then we weren't able to call onInputValueChange
      // earlier, so we'll call it now that we know what the inputValue state will be.
      if (isStateToSetFunction && newStateToSet.hasOwnProperty('inputValue')) {
        _this4.props.onInputValueChange(newStateToSet.inputValue, _extends({}, _this4.getStateAndHelpers(), newStateToSet));
      }

      return nextState;
    }, function () {
      // call the provided callback if it's a function
      cbToCb(cb)();

      // only call the onStateChange and onChange callbacks if
      // we have relevant information to pass them.
      var hasMoreStateThanType = Object.keys(onStateChangeArg).length > 1;
      if (hasMoreStateThanType) {
        _this4.props.onStateChange(onStateChangeArg, _this4.getStateAndHelpers());
      }

      if (isItemSelected) {
        _this4.props.onSelect(stateToSet.selectedItem, _this4.getStateAndHelpers());
      }

      if (onChangeArg !== undefined) {
        _this4.props.onChange(onChangeArg, _this4.getStateAndHelpers());
      }
      // this is currently undocumented and therefore subject to change
      // We'll try to not break it, but just be warned.
      _this4.props.onUserAction(onStateChangeArg, _this4.getStateAndHelpers());
    });
  };

  this.rootRef = function (node) {
    return _this4._rootNode = node;
  };

  this.getRootProps = function () {
    var _babelHelpers$extends;

    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref4$suppressRefErro = _ref4.suppressRefError,
        suppressRefError = _ref4$suppressRefErro === undefined ? false : _ref4$suppressRefErro;

    var _ref3$refKey = _ref3.refKey,
        refKey = _ref3$refKey === undefined ? 'ref' : _ref3$refKey,
        rest = objectWithoutProperties(_ref3, ['refKey']);

    // this is used in the render to know whether the user has called getRootProps.
    // It uses that to know whether to apply the props automatically
    _this4.getRootProps.called = true;
    _this4.getRootProps.refKey = refKey;
    _this4.getRootProps.suppressRefError = suppressRefError;

    var _getState3 = _this4.getState(),
        isOpen = _getState3.isOpen;

    return _extends((_babelHelpers$extends = {}, _babelHelpers$extends[refKey] = _this4.rootRef, _babelHelpers$extends.role = 'combobox', _babelHelpers$extends['aria-expanded'] = isOpen, _babelHelpers$extends['aria-haspopup'] = 'listbox', _babelHelpers$extends['aria-owns'] = isOpen ? _this4.menuId : null, _babelHelpers$extends['aria-labelledby'] = _this4.labelId, _babelHelpers$extends), rest);
  };

  this.keyDownHandlers = {
    ArrowDown: function ArrowDown(event) {
      event.preventDefault();
      var amount = event.shiftKey ? 5 : 1;
      this.moveHighlightedIndex(amount, {
        type: keyDownArrowDown
      });
    },
    ArrowUp: function ArrowUp(event) {
      event.preventDefault();
      var amount = event.shiftKey ? -5 : -1;
      this.moveHighlightedIndex(amount, {
        type: keyDownArrowUp
      });
    },
    Enter: function Enter(event) {
      var _getState4 = this.getState(),
          isOpen = _getState4.isOpen,
          highlightedIndex = _getState4.highlightedIndex;

      if (isOpen && highlightedIndex != null) {
        event.preventDefault();
        var item = this.items[highlightedIndex];
        var itemNode = this.getItemNodeFromIndex(highlightedIndex);
        if (item == null || itemNode && itemNode.hasAttribute('disabled')) {
          return;
        }
        this.selectHighlightedItem({
          type: keyDownEnter
        });
      }
    },
    Escape: function Escape(event) {
      event.preventDefault();
      this.reset({ type: keyDownEscape });
    }
  };
  this.buttonKeyDownHandlers = _extends({}, this.keyDownHandlers, {
    ' ': function _(event) {
      event.preventDefault();
      this.toggleMenu({ type: keyDownSpaceButton });
    }
  });

  this.getToggleButtonProps = function () {
    var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var onClick = _ref5.onClick,
        onPress = _ref5.onPress,
        onKeyDown = _ref5.onKeyDown,
        onKeyUp = _ref5.onKeyUp,
        onBlur = _ref5.onBlur,
        rest = objectWithoutProperties(_ref5, ['onClick', 'onPress', 'onKeyDown', 'onKeyUp', 'onBlur']);

    var _getState5 = _this4.getState(),
        isOpen = _getState5.isOpen;

    var enabledEventHandlers = {
      onClick: callAllEventHandlers(onClick, _this4.button_handleClick),
      onKeyDown: callAllEventHandlers(onKeyDown, _this4.button_handleKeyDown),
      onKeyUp: callAllEventHandlers(onKeyUp, _this4.button_handleKeyUp),
      onBlur: callAllEventHandlers(onBlur, _this4.button_handleBlur)
    };
    var eventHandlers = rest.disabled ? {} : enabledEventHandlers;
    return _extends({
      type: 'button',
      role: 'button',
      'aria-label': isOpen ? 'close menu' : 'open menu',
      'aria-haspopup': true,
      'data-toggle': true
    }, eventHandlers, rest);
  };

  this.button_handleKeyUp = function (event) {
    // Prevent click event from emitting in Firefox
    event.preventDefault();
  };

  this.button_handleKeyDown = function (event) {
    var key = normalizeArrowKey(event);
    if (_this4.buttonKeyDownHandlers[key]) {
      _this4.buttonKeyDownHandlers[key].call(_this4, event);
    }
  };

  this.button_handleClick = function (event) {
    event.preventDefault();
    // handle odd case for Safari and Firefox which
    // don't give the button the focus properly.
    /* istanbul ignore if (can't reasonably test this) */
    if (_this4.props.environment.document.activeElement === _this4.props.environment.document.body) {
      event.target.focus();
    }
    // to simplify testing components that use downshift, we'll not wrap this in a setTimeout
    // if the NODE_ENV is test. With the proper build system, this should be dead code eliminated
    // when building for production and should therefore have no impact on production code.
    if (process.env.NODE_ENV === 'test') {
      _this4.toggleMenu({ type: clickButton });
    } else {
      // Ensure that toggle of menu occurs after the potential blur event in iOS
      _this4.internalSetTimeout(function () {
        return _this4.toggleMenu({ type: clickButton });
      });
    }
  };

  this.button_handleBlur = function (event) {
    var blurTarget = event.target; // Save blur target for comparison with activeElement later
    // Need setTimeout, so that when the user presses Tab, the activeElement is the next focused element, not body element
    _this4.internalSetTimeout(function () {
      if (!_this4.isMouseDown && (_this4.props.environment.document.activeElement == null || _this4.props.environment.document.activeElement.id !== _this4.inputId) && _this4.props.environment.document.activeElement !== blurTarget // Do nothing if we refocus the same element again (to solve issue in Safari on iOS)
      ) {
          _this4.reset({ type: blurButton });
        }
    });
  };

  this.getLabelProps = function (props) {
    return _extends({ htmlFor: _this4.inputId, id: _this4.labelId }, props);
  };

  this.getInputProps = function () {
    var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var onKeyDown = _ref6.onKeyDown,
        onBlur = _ref6.onBlur,
        onChange = _ref6.onChange,
        onInput = _ref6.onInput,
        onChangeText = _ref6.onChangeText,
        rest = objectWithoutProperties(_ref6, ['onKeyDown', 'onBlur', 'onChange', 'onInput', 'onChangeText']);

    var onChangeKey = void 0;
    var eventHandlers = {};

    /* istanbul ignore next (preact) */
    onChangeKey = 'onChange';

    var _getState6 = _this4.getState(),
        inputValue = _getState6.inputValue,
        isOpen = _getState6.isOpen,
        highlightedIndex = _getState6.highlightedIndex;

    if (!rest.disabled) {
      var _eventHandlers;

      eventHandlers = (_eventHandlers = {}, _eventHandlers[onChangeKey] = callAllEventHandlers(onChange, onInput, _this4.input_handleChange), _eventHandlers.onKeyDown = callAllEventHandlers(onKeyDown, _this4.input_handleKeyDown), _eventHandlers.onBlur = callAllEventHandlers(onBlur, _this4.input_handleBlur), _eventHandlers);
    }

    /* istanbul ignore if (react-native) */


    return _extends({
      'aria-autocomplete': 'list',
      'aria-activedescendant': isOpen && typeof highlightedIndex === 'number' && highlightedIndex >= 0 ? _this4.getItemId(highlightedIndex) : null,
      'aria-controls': isOpen ? _this4.menuId : null,
      'aria-labelledby': _this4.labelId,
      // https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
      // revert back since autocomplete="nope" is ignored on latest Chrome and Opera
      autoComplete: 'off',
      value: inputValue,
      id: _this4.inputId
    }, eventHandlers, rest);
  };

  this.input_handleKeyDown = function (event) {
    var key = normalizeArrowKey(event);
    if (key && _this4.keyDownHandlers[key]) {
      _this4.keyDownHandlers[key].call(_this4, event);
    }
  };

  this.input_handleChange = function (event) {
    _this4.internalSetState({
      type: changeInput,
      isOpen: true,
      inputValue: event.target.value
    });
  };

  this.input_handleTextChange /* istanbul ignore next (react-native) */ = function (text) {
    _this4.internalSetState({
      type: changeInput,
      isOpen: true,
      inputValue: text
    });
  };

  this.input_handleBlur = function () {
    // Need setTimeout, so that when the user presses Tab, the activeElement is the next focused element, not the body element
    _this4.internalSetTimeout(function () {
      var downshiftButtonIsActive = _this4.props.environment.document.activeElement.dataset.toggle && _this4._rootNode && _this4._rootNode.contains(_this4.props.environment.document.activeElement);
      if (!_this4.isMouseDown && !downshiftButtonIsActive) {
        _this4.reset({ type: blurInput });
      }
    });
  };

  this.menuRef = function (node) {
    _this4._menuNode = node;
  };

  this.getMenuProps = function () {
    var _babelHelpers$extends2;

    var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref8$suppressRefErro = _ref8.suppressRefError,
        suppressRefError = _ref8$suppressRefErro === undefined ? false : _ref8$suppressRefErro;

    var _ref7$refKey = _ref7.refKey,
        refKey = _ref7$refKey === undefined ? 'ref' : _ref7$refKey,
        ref = _ref7.ref,
        props = objectWithoutProperties(_ref7, ['refKey', 'ref']);

    _this4.getMenuProps.called = true;
    _this4.getMenuProps.refKey = refKey;
    _this4.getMenuProps.suppressRefError = suppressRefError;

    return _extends((_babelHelpers$extends2 = {}, _babelHelpers$extends2[refKey] = callAll(ref, _this4.menuRef), _babelHelpers$extends2.role = 'listbox', _babelHelpers$extends2['aria-labelledby'] = props && props['aria-label'] ? null : _this4.labelId, _babelHelpers$extends2.id = _this4.menuId, _babelHelpers$extends2), props);
  };

  this.getItemProps = function () {
    var _enabledEventHandlers;

    var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var onMouseMove = _ref9.onMouseMove,
        onMouseDown = _ref9.onMouseDown,
        onClick = _ref9.onClick,
        onPress = _ref9.onPress,
        index = _ref9.index,
        _ref9$item = _ref9.item,
        item = _ref9$item === undefined ? process.env.NODE_ENV === 'production' ? /* istanbul ignore next */undefined : requiredProp('getItemProps', 'item') : _ref9$item,
        rest = objectWithoutProperties(_ref9, ['onMouseMove', 'onMouseDown', 'onClick', 'onPress', 'index', 'item']);

    if (index === undefined) {
      _this4.items.push(item);
      index = _this4.items.indexOf(item);
    } else {
      _this4.items[index] = item;
    }

    var onSelectKey = 'onClick';
    var customClickHandler = onClick;

    var enabledEventHandlers = (_enabledEventHandlers = {
      // onMouseMove is used over onMouseEnter here. onMouseMove
      // is only triggered on actual mouse movement while onMouseEnter
      // can fire on DOM changes, interrupting keyboard navigation
      onMouseMove: callAllEventHandlers(onMouseMove, function () {
        if (index === _this4.getState().highlightedIndex) {
          return;
        }
        _this4.setHighlightedIndex(index, {
          type: itemMouseEnter
        });

        // We never want to manually scroll when changing state based
        // on `onMouseMove` because we will be moving the element out
        // from under the user which is currently scrolling/moving the
        // cursor
        _this4.avoidScrolling = true;
        _this4.internalSetTimeout(function () {
          return _this4.avoidScrolling = false;
        }, 250);
      }),
      onMouseDown: callAllEventHandlers(onMouseDown, function (event) {
        // This prevents the activeElement from being changed
        // to the item so it can remain with the current activeElement
        // which is a more common use case.
        event.preventDefault();
      })
    }, _enabledEventHandlers[onSelectKey] = callAllEventHandlers(customClickHandler, function () {
      _this4.selectItemAtIndex(index, {
        type: clickItem
      });
    }), _enabledEventHandlers);

    // Passing down the onMouseDown handler to prevent redirect
    // of the activeElement if clicking on disabled items
    var eventHandlers = rest.disabled ? { onMouseDown: enabledEventHandlers.onMouseDown } : enabledEventHandlers;

    return _extends({
      id: _this4.getItemId(index),
      role: 'option',
      'aria-selected': _this4.getState().selectedItem === item
    }, eventHandlers, rest);
  };

  this.clearItems = function () {
    _this4.items = [];
  };

  this.reset = function () {
    var otherStateToSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cb = arguments[1];

    otherStateToSet = pickState(otherStateToSet);
    _this4.internalSetState(function (_ref10) {
      var selectedItem = _ref10.selectedItem;
      return _extends({
        isOpen: false,
        highlightedIndex: _this4.props.defaultHighlightedIndex,
        inputValue: _this4.props.itemToString(selectedItem)
      }, otherStateToSet);
    }, cb);
  };

  this.toggleMenu = function () {
    var otherStateToSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cb = arguments[1];

    otherStateToSet = pickState(otherStateToSet);
    _this4.internalSetState(function (_ref11) {
      var isOpen = _ref11.isOpen;

      return _extends({ isOpen: !isOpen }, otherStateToSet);
    }, function () {
      var _getState7 = _this4.getState(),
          isOpen = _getState7.isOpen;

      if (isOpen) {
        // highlight default index
        _this4.setHighlightedIndex(undefined, otherStateToSet);
      }
      cbToCb(cb)();
    });
  };

  this.openMenu = function (cb) {
    _this4.internalSetState({ isOpen: true }, cb);
  };

  this.closeMenu = function (cb) {
    _this4.internalSetState({ isOpen: false }, cb);
  };

  this.updateStatus = debounce(function () {
    var state = _this4.getState();
    var item = _this4.items[state.highlightedIndex];
    var resultCount = _this4.getItemCount();
    var status = _this4.props.getA11yStatusMessage(_extends({
      itemToString: _this4.props.itemToString,
      previousResultCount: _this4.previousResultCount,
      resultCount: resultCount,
      highlightedItem: item
    }, state));
    _this4.previousResultCount = resultCount;

    setStatus(status);
  }, 200);
};

process.env.NODE_ENV !== "production" ? Downshift.propTypes = {
  children: PropTypes.func,
  defaultHighlightedIndex: PropTypes.number,
  defaultSelectedItem: PropTypes.any,
  defaultInputValue: PropTypes.string,
  defaultIsOpen: PropTypes.bool,
  getA11yStatusMessage: PropTypes.func,
  itemToString: PropTypes.func,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onStateChange: PropTypes.func,
  onInputValueChange: PropTypes.func,
  onUserAction: PropTypes.func,
  onOuterClick: PropTypes.func,
  selectedItemChanged: PropTypes.func,
  stateReducer: PropTypes.func,
  itemCount: PropTypes.number,
  id: PropTypes.string,
  environment: PropTypes.shape({
    addEventListener: PropTypes.func,
    removeEventListener: PropTypes.func,
    document: PropTypes.shape({
      getElementById: PropTypes.func,
      activeElement: PropTypes.any,
      body: PropTypes.any
    })
  }),
  suppressRefError: PropTypes.bool,
  scrollIntoView: PropTypes.func,
  // things we keep in state for uncontrolled components
  // but can accept as props for controlled components
  /* eslint-disable react/no-unused-prop-types */
  selectedItem: PropTypes.any,
  isOpen: PropTypes.bool,
  inputValue: PropTypes.string,
  highlightedIndex: PropTypes.number,
  labelId: PropTypes.string,
  inputId: PropTypes.string,
  menuId: PropTypes.string,
  getItemId: PropTypes.func
  /* eslint-enable react/no-unused-prop-types */
} : void 0;

function validateGetMenuPropsCalledCorrectly(node, _ref) {
  var refKey = _ref.refKey;

  if (!node) {
    // eslint-disable-next-line no-console
    console.error('downshift: The ref prop "' + refKey + '" from getMenuProps was not applied correctly on your menu element.');
  }
}

function validateGetRootPropsCalledCorrectly(element, _ref2) {
  var refKey = _ref2.refKey;

  var refKeySpecified = refKey !== 'ref';
  var isComposite = !isDOMElement(element);
  if (isComposite && !refKeySpecified) {
    // eslint-disable-next-line no-console
    console.error('downshift: You returned a non-DOM element. You must specify a refKey in getRootProps');
  } else if (!isComposite && refKeySpecified) {
    // eslint-disable-next-line no-console
    console.error('downshift: You returned a DOM element. You should not specify a refKey in getRootProps. You specified "' + refKey + '"');
  }
  if (!getElementProps(element)[refKey]) {
    // eslint-disable-next-line no-console
    console.error('downshift: You must apply the ref prop "' + refKey + '" from getRootProps onto your root element.');
  }
}

export default Downshift;
export { resetIdCounter };
