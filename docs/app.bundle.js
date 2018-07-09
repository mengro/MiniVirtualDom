/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/list-diff2/index.js":
/*!******************************************!*\
  !*** ./node_modules/list-diff2/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/diff */ "./node_modules/list-diff2/lib/diff.js").diff


/***/ }),

/***/ "./node_modules/list-diff2/lib/diff.js":
/*!*********************************************!*\
  !*** ./node_modules/list-diff2/lib/diff.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
function diff (oldList, newList, key) {
  var oldMap = makeKeyIndexAndFree(oldList, key)
  var newMap = makeKeyIndexAndFree(newList, key)

  var newFree = newMap.free

  var oldKeyIndex = oldMap.keyIndex
  var newKeyIndex = newMap.keyIndex

  var moves = []

  // a simulate list to manipulate
  var children = []
  var i = 0
  var item
  var itemKey
  var freeIndex = 0

  // fist pass to check item in old list: if it's removed or not
  while (i < oldList.length) {
    item = oldList[i]
    itemKey = getItemKey(item, key)
    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null)
      } else {
        var newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    } else {
      var freeItem = newFree[freeIndex++]
      children.push(freeItem || null)
    }
    i++
  }

  var simulateList = children.slice(0)

  // remove items no longer exist
  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)
      removeSimulate(i)
    } else {
      i++
    }
  }

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0
  while (i < newList.length) {
    item = newList[i]
    itemKey = getItemKey(item, key)

    var simulateItem = simulateList[j]
    var simulateItemKey = getItemKey(simulateItem, key)

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++
      } else {
        // new item, just inesrt it
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        } else {
          // if remove current simulateItem make item in right place
          // then just remove it
          var nextItemKey = getItemKey(simulateList[j + 1], key)
          if (nextItemKey === itemKey) {
            remove(i)
            removeSimulate(j)
            j++ // after removing, current j is right, just jump to next one
          } else {
            // else insert item
            insert(i, item)
          }
        }
      }
    } else {
      insert(i, item)
    }

    i++
  }

  function remove (index) {
    var move = {index: index, type: 0}
    moves.push(move)
  }

  function insert (index, item) {
    var move = {index: index, item: item, type: 1}
    moves.push(move)
  }

  function removeSimulate (index) {
    simulateList.splice(index, 1)
  }

  return {
    moves: moves,
    children: children
  }
}

/**
 * Convert list to key-item keyIndex object.
 * @param {Array} list
 * @param {String|Function} key
 */
function makeKeyIndexAndFree (list, key) {
  var keyIndex = {}
  var free = []
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i]
    var itemKey = getItemKey(item, key)
    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}

function getItemKey (item, key) {
  if (!item || !key) return void 666
  return typeof key === 'string'
    ? item[key]
    : key(item)
}

exports.makeKeyIndexAndFree = makeKeyIndexAndFree // exports for test
exports.diff = diff


/***/ }),

/***/ "./src/diff.js":
/*!*********************!*\
  !*** ./src/diff.js ***!
  \*********************/
/*! exports provided: diff, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "diff", function() { return diff; });
/* harmony import */ var list_diff2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! list-diff2 */ "./node_modules/list-diff2/index.js");
/* harmony import */ var list_diff2__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(list_diff2__WEBPACK_IMPORTED_MODULE_0__);


const diff = (oldTree, newTree) => {
  const index = 0;
  const patches = {};
  dfsWalk(oldTree, newTree, index, patches);
  return patches;
}

const dfsWalk = (oldNode, newNode, index, patches) => {
  const currentPatch = [];
  if (!newNode) {
    //void
  }else if(typeof oldNode === 'string' && typeof newNode === 'string'){
    if (oldNode !== newNode) {
      currentPatch.push({type: 'TEXT', content: newNode});
    }
  }else if (
    newNode.tagName === oldNode.tagName &&
    newNode.key === oldNode.key
  ) {
    const propsPatches = diffProps(oldNode, newNode);
    if (propsPatches) {
      currentPatch.push({type: 'PROPS', props: propsPatches});
    }
    if (!(newNode.props && newNode.props.hasOwnProperty('ignore'))) {
      diffChildren(
        oldNode.children,
        newNode.children,
        index,
        patches,
        currentPatch,
      )
    }
  }else{
    currentPatch.push({type: 'REPLACE', node: newNode});
  }
  if (currentPatch.length) {
    patches[index] = currentPatch;
  }
}

const diffChildren = (oldChildren, newChildren, index, patches, currentPatch) => {
  var diffs = list_diff2__WEBPACK_IMPORTED_MODULE_0___default()(oldChildren, newChildren, 'key');
  newChildren = diffs.children;
  if (diffs.moves.length) {
    const reorderPatch = { type: 'REORDER', moves: diffs.moves };
    currentPatch.push(reorderPatch);
  }

  let leftNode = null;
  let currentNodeIndex = index;
  oldChildren.forEach((child, i) => {
    const newChild = newChildren[i];
    currentNodeIndex = (leftNode && leftNode.count)
    ? currentNodeIndex + leftNode.count + 1
    : currentNodeIndex + 1;
    dfsWalk(child, newChild, currentNodeIndex, patches);
    leftNode = child;
  })
}

const diffProps = (oldNode, newNode) => {
  let count = 0;
  const newProps = newNode.props;
  const oldProps = oldNode.props;
  const propsPatches = {};
  Object.keys(newProps).forEach(key => {
    if (oldProps[key] !== newProps[key] || !oldProps.hasOwnProperty(key)) {
      count++;
      propsPatches[key] = newProps[key];
    }
  })
  if (count === 0) {
    return null
  }

  return propsPatches
}

/* harmony default export */ __webpack_exports__["default"] = (diff);

/***/ }),

/***/ "./src/element.js":
/*!************************!*\
  !*** ./src/element.js ***!
  \************************/
/*! exports provided: el */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "el", function() { return el; });
class Element {
  /**
   * Element类构造函数
   * @param {String} tagName 标签名
   * @param {Object} props 属性集合
   * @param {Array} children 子元素
   */
  constructor(tagName, props, children){
    if (!this instanceof Element) {
      return new Element(arguments); 
    }
    if (props instanceof Array) {
      children = props
      props = {}
    }
    this.tagName = tagName;
    this.props = props;
    this.children = children;
    this.key = props
    ? props.key
    : void 666
    let count = 0;
    this.children.forEach((child, i) => {
      if (child instanceof Element) {
        count += child.count
      } else {
        children[i] = '' + child
      }
      count++
    })
    this.count = count;
  }
  /**
   * render函数，根据vDom对象构建真实dom
   */
  render(){
    const el = document.createElement(this.tagName);
    const { props, children } = this;
    Object.keys(props).forEach(key => {
      el.setAttribute(key, props[key]);
    })
    children && children.forEach(child => {
      const childEl = (child instanceof Element)
      ? child.render()
      : document.createTextNode(child);
      el.appendChild(childEl);
    })
    return el;
  }
}

const el = (tagName, props, children) => {
  return new Element(tagName, props, children);
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/element.js");
/* harmony import */ var _diff__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./diff */ "./src/diff.js");
/* harmony import */ var _patch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./patch */ "./src/patch.js");



window.vd = {
  el: _element__WEBPACK_IMPORTED_MODULE_0__["el"],
  diff: _diff__WEBPACK_IMPORTED_MODULE_1__["diff"],
  patch: _patch__WEBPACK_IMPORTED_MODULE_2__["patch"],
}

/***/ }),

/***/ "./src/patch.js":
/*!**********************!*\
  !*** ./src/patch.js ***!
  \**********************/
/*! exports provided: patch, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "patch", function() { return patch; });
const patch = (node, patches) => {
  let counter = {
    count: 0,
  }
  dfsWalk(node, counter, patches)
}
const dfsWalk = (node, counter, patches) => {
  const currentPatches = patches[counter.count];
  node.childNodes && node.childNodes.forEach(childNode => {
    counter.count++;
    dfsWalk(childNode, counter, patches)
  });
  if (currentPatches) {
    applyPatches(node, currentPatches);
  }
}
const applyPatches = (node, currentPatches) => {
  currentPatches.forEach(currentPatch => {
    switch (currentPatch.type) {
      case 'REPLACE':
        const newNode = (typeof currentPatch.node === 'string') ?
          document.createTextNode(currentPatch.node) :
          currentPatch.node.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case 'REORDER':
        reorderChildren(node, currentPatch.moves)
        break
      case 'PROPS':
        setProps(node, currentPatch.props)
        break
      case 'TEXT':
        if (node.textContent) {
          node.textContent = currentPatch.content
        } else {
          // fuck ie
          node.nodeValue = currentPatch.content
        }
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  })
}

const setProps = (node, props) => {
  Object.keys.forEach(key => {
    if (props[key] === void 'udf') {
      node.removeAttribute(key)
    }else{
      setAttr(node, key, props[key]);
    }
  })
}

const setAttr = (node, key, value) => {
  switch (key) {
    case 'style':
      node.style.cssText = value
      break
    case 'value':
      const tagName = node.tagName || ''
      tagName = tagName.toLowerCase()
      if (
        tagName === 'input' || tagName === 'textarea'
      ) {
        node.value = value
      } else {
        // if it is not a input or textarea, use `setAttribute` to set
        node.setAttribute(key, value)
      }
      break
    default:
      node.setAttribute(key, value)
      break
  }
}

const reorderChildren = (node, moves) => {
  const staticNodeList = Array.from(node.childNodes);
  const maps = {};
  staticNodeList.forEach(node => {
    if (node.nodeType === 1) {
      const key = node.getAttribute('key');
      if (key) {
        maps[key] = node;
      }
    }
  })
  moves.forEach(move => {
    const { index } = move;
    if (move.type === 0) { // remove item
      if (staticNodeList[index] === node.childNodes[index]) { // maybe have been removed for inserting
        node.removeChild(node.childNodes[index])
      }
      staticNodeList.splice(index, 1)
    } else if (move.type === 1) { // insert item
      const insertNode = maps[move.item.key]
        ? maps[move.item.key]
        : (typeof move.item === 'object')
            ? move.item.render()
            : document.createTextNode(move.item)
      staticNodeList.splice(index, 0, insertNode)
      node.insertBefore(insertNode, node.childNodes[index] || null)
    }
  })
}

/* harmony default export */ __webpack_exports__["default"] = (patch);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xpc3QtZGlmZjIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xpc3QtZGlmZjIvbGliL2RpZmYuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpZmYuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxNQUFNO0FBQ2pCLFlBQVksT0FBTyxJQUFJO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFD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Q0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxXQUFXLFFBQVE7QUFDbkIsMEJBQTBCO0FBQzFCLDZEQUE2RDtBQUM3RDtBQUNBO0FBQ0E7QUFDQSxLQUFLLDRCQUE0QjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBIiwiZmlsZSI6ImFwcC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvZGlmZicpLmRpZmZcbiIsIi8qKlxyXG4gKiBEaWZmIHR3byBsaXN0IGluIE8oTikuXHJcbiAqIEBwYXJhbSB7QXJyYXl9IG9sZExpc3QgLSBPcmlnaW5hbCBMaXN0XHJcbiAqIEBwYXJhbSB7QXJyYXl9IG5ld0xpc3QgLSBMaXN0IEFmdGVyIGNlcnRhaW4gaW5zZXJ0aW9ucywgcmVtb3Zlcywgb3IgbW92ZXNcclxuICogQHJldHVybiB7T2JqZWN0fSAtIHttb3ZlczogPEFycmF5Pn1cclxuICogICAgICAgICAgICAgICAgICAtIG1vdmVzIGlzIGEgbGlzdCBvZiBhY3Rpb25zIHRoYXQgdGVsbGluZyBob3cgdG8gcmVtb3ZlIGFuZCBpbnNlcnRcclxuICovXHJcbmZ1bmN0aW9uIGRpZmYgKG9sZExpc3QsIG5ld0xpc3QsIGtleSkge1xyXG4gIHZhciBvbGRNYXAgPSBtYWtlS2V5SW5kZXhBbmRGcmVlKG9sZExpc3QsIGtleSlcclxuICB2YXIgbmV3TWFwID0gbWFrZUtleUluZGV4QW5kRnJlZShuZXdMaXN0LCBrZXkpXHJcblxyXG4gIHZhciBuZXdGcmVlID0gbmV3TWFwLmZyZWVcclxuXHJcbiAgdmFyIG9sZEtleUluZGV4ID0gb2xkTWFwLmtleUluZGV4XHJcbiAgdmFyIG5ld0tleUluZGV4ID0gbmV3TWFwLmtleUluZGV4XHJcblxyXG4gIHZhciBtb3ZlcyA9IFtdXHJcblxyXG4gIC8vIGEgc2ltdWxhdGUgbGlzdCB0byBtYW5pcHVsYXRlXHJcbiAgdmFyIGNoaWxkcmVuID0gW11cclxuICB2YXIgaSA9IDBcclxuICB2YXIgaXRlbVxyXG4gIHZhciBpdGVtS2V5XHJcbiAgdmFyIGZyZWVJbmRleCA9IDBcclxuXHJcbiAgLy8gZmlzdCBwYXNzIHRvIGNoZWNrIGl0ZW0gaW4gb2xkIGxpc3Q6IGlmIGl0J3MgcmVtb3ZlZCBvciBub3RcclxuICB3aGlsZSAoaSA8IG9sZExpc3QubGVuZ3RoKSB7XHJcbiAgICBpdGVtID0gb2xkTGlzdFtpXVxyXG4gICAgaXRlbUtleSA9IGdldEl0ZW1LZXkoaXRlbSwga2V5KVxyXG4gICAgaWYgKGl0ZW1LZXkpIHtcclxuICAgICAgaWYgKCFuZXdLZXlJbmRleC5oYXNPd25Qcm9wZXJ0eShpdGVtS2V5KSkge1xyXG4gICAgICAgIGNoaWxkcmVuLnB1c2gobnVsbClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgbmV3SXRlbUluZGV4ID0gbmV3S2V5SW5kZXhbaXRlbUtleV1cclxuICAgICAgICBjaGlsZHJlbi5wdXNoKG5ld0xpc3RbbmV3SXRlbUluZGV4XSlcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIGZyZWVJdGVtID0gbmV3RnJlZVtmcmVlSW5kZXgrK11cclxuICAgICAgY2hpbGRyZW4ucHVzaChmcmVlSXRlbSB8fCBudWxsKVxyXG4gICAgfVxyXG4gICAgaSsrXHJcbiAgfVxyXG5cclxuICB2YXIgc2ltdWxhdGVMaXN0ID0gY2hpbGRyZW4uc2xpY2UoMClcclxuXHJcbiAgLy8gcmVtb3ZlIGl0ZW1zIG5vIGxvbmdlciBleGlzdFxyXG4gIGkgPSAwXHJcbiAgd2hpbGUgKGkgPCBzaW11bGF0ZUxpc3QubGVuZ3RoKSB7XHJcbiAgICBpZiAoc2ltdWxhdGVMaXN0W2ldID09PSBudWxsKSB7XHJcbiAgICAgIHJlbW92ZShpKVxyXG4gICAgICByZW1vdmVTaW11bGF0ZShpKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaSsrXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBpIGlzIGN1cnNvciBwb2ludGluZyB0byBhIGl0ZW0gaW4gbmV3IGxpc3RcclxuICAvLyBqIGlzIGN1cnNvciBwb2ludGluZyB0byBhIGl0ZW0gaW4gc2ltdWxhdGVMaXN0XHJcbiAgdmFyIGogPSBpID0gMFxyXG4gIHdoaWxlIChpIDwgbmV3TGlzdC5sZW5ndGgpIHtcclxuICAgIGl0ZW0gPSBuZXdMaXN0W2ldXHJcbiAgICBpdGVtS2V5ID0gZ2V0SXRlbUtleShpdGVtLCBrZXkpXHJcblxyXG4gICAgdmFyIHNpbXVsYXRlSXRlbSA9IHNpbXVsYXRlTGlzdFtqXVxyXG4gICAgdmFyIHNpbXVsYXRlSXRlbUtleSA9IGdldEl0ZW1LZXkoc2ltdWxhdGVJdGVtLCBrZXkpXHJcblxyXG4gICAgaWYgKHNpbXVsYXRlSXRlbSkge1xyXG4gICAgICBpZiAoaXRlbUtleSA9PT0gc2ltdWxhdGVJdGVtS2V5KSB7XHJcbiAgICAgICAgaisrXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gbmV3IGl0ZW0sIGp1c3QgaW5lc3J0IGl0XHJcbiAgICAgICAgaWYgKCFvbGRLZXlJbmRleC5oYXNPd25Qcm9wZXJ0eShpdGVtS2V5KSkge1xyXG4gICAgICAgICAgaW5zZXJ0KGksIGl0ZW0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIGlmIHJlbW92ZSBjdXJyZW50IHNpbXVsYXRlSXRlbSBtYWtlIGl0ZW0gaW4gcmlnaHQgcGxhY2VcclxuICAgICAgICAgIC8vIHRoZW4ganVzdCByZW1vdmUgaXRcclxuICAgICAgICAgIHZhciBuZXh0SXRlbUtleSA9IGdldEl0ZW1LZXkoc2ltdWxhdGVMaXN0W2ogKyAxXSwga2V5KVxyXG4gICAgICAgICAgaWYgKG5leHRJdGVtS2V5ID09PSBpdGVtS2V5KSB7XHJcbiAgICAgICAgICAgIHJlbW92ZShpKVxyXG4gICAgICAgICAgICByZW1vdmVTaW11bGF0ZShqKVxyXG4gICAgICAgICAgICBqKysgLy8gYWZ0ZXIgcmVtb3ZpbmcsIGN1cnJlbnQgaiBpcyByaWdodCwganVzdCBqdW1wIHRvIG5leHQgb25lXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBlbHNlIGluc2VydCBpdGVtXHJcbiAgICAgICAgICAgIGluc2VydChpLCBpdGVtKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaW5zZXJ0KGksIGl0ZW0pXHJcbiAgICB9XHJcblxyXG4gICAgaSsrXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZW1vdmUgKGluZGV4KSB7XHJcbiAgICB2YXIgbW92ZSA9IHtpbmRleDogaW5kZXgsIHR5cGU6IDB9XHJcbiAgICBtb3Zlcy5wdXNoKG1vdmUpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbnNlcnQgKGluZGV4LCBpdGVtKSB7XHJcbiAgICB2YXIgbW92ZSA9IHtpbmRleDogaW5kZXgsIGl0ZW06IGl0ZW0sIHR5cGU6IDF9XHJcbiAgICBtb3Zlcy5wdXNoKG1vdmUpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZW1vdmVTaW11bGF0ZSAoaW5kZXgpIHtcclxuICAgIHNpbXVsYXRlTGlzdC5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbW92ZXM6IG1vdmVzLFxyXG4gICAgY2hpbGRyZW46IGNoaWxkcmVuXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydCBsaXN0IHRvIGtleS1pdGVtIGtleUluZGV4IG9iamVjdC5cclxuICogQHBhcmFtIHtBcnJheX0gbGlzdFxyXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0ga2V5XHJcbiAqL1xyXG5mdW5jdGlvbiBtYWtlS2V5SW5kZXhBbmRGcmVlIChsaXN0LCBrZXkpIHtcclxuICB2YXIga2V5SW5kZXggPSB7fVxyXG4gIHZhciBmcmVlID0gW11cclxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXHJcbiAgICB2YXIgaXRlbUtleSA9IGdldEl0ZW1LZXkoaXRlbSwga2V5KVxyXG4gICAgaWYgKGl0ZW1LZXkpIHtcclxuICAgICAga2V5SW5kZXhbaXRlbUtleV0gPSBpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmcmVlLnB1c2goaXRlbSlcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHtcclxuICAgIGtleUluZGV4OiBrZXlJbmRleCxcclxuICAgIGZyZWU6IGZyZWVcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEl0ZW1LZXkgKGl0ZW0sIGtleSkge1xyXG4gIGlmICghaXRlbSB8fCAha2V5KSByZXR1cm4gdm9pZCA2NjZcclxuICByZXR1cm4gdHlwZW9mIGtleSA9PT0gJ3N0cmluZydcclxuICAgID8gaXRlbVtrZXldXHJcbiAgICA6IGtleShpdGVtKVxyXG59XHJcblxyXG5leHBvcnRzLm1ha2VLZXlJbmRleEFuZEZyZWUgPSBtYWtlS2V5SW5kZXhBbmRGcmVlIC8vIGV4cG9ydHMgZm9yIHRlc3RcclxuZXhwb3J0cy5kaWZmID0gZGlmZlxyXG4iLCJpbXBvcnQgbGlzdERpZmYgZnJvbSAnbGlzdC1kaWZmMic7XHJcblxyXG5leHBvcnQgY29uc3QgZGlmZiA9IChvbGRUcmVlLCBuZXdUcmVlKSA9PiB7XHJcbiAgY29uc3QgaW5kZXggPSAwO1xyXG4gIGNvbnN0IHBhdGNoZXMgPSB7fTtcclxuICBkZnNXYWxrKG9sZFRyZWUsIG5ld1RyZWUsIGluZGV4LCBwYXRjaGVzKTtcclxuICByZXR1cm4gcGF0Y2hlcztcclxufVxyXG5cclxuY29uc3QgZGZzV2FsayA9IChvbGROb2RlLCBuZXdOb2RlLCBpbmRleCwgcGF0Y2hlcykgPT4ge1xyXG4gIGNvbnN0IGN1cnJlbnRQYXRjaCA9IFtdO1xyXG4gIGlmICghbmV3Tm9kZSkge1xyXG4gICAgLy92b2lkXHJcbiAgfWVsc2UgaWYodHlwZW9mIG9sZE5vZGUgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBuZXdOb2RlID09PSAnc3RyaW5nJyl7XHJcbiAgICBpZiAob2xkTm9kZSAhPT0gbmV3Tm9kZSkge1xyXG4gICAgICBjdXJyZW50UGF0Y2gucHVzaCh7dHlwZTogJ1RFWFQnLCBjb250ZW50OiBuZXdOb2RlfSk7XHJcbiAgICB9XHJcbiAgfWVsc2UgaWYgKFxyXG4gICAgbmV3Tm9kZS50YWdOYW1lID09PSBvbGROb2RlLnRhZ05hbWUgJiZcclxuICAgIG5ld05vZGUua2V5ID09PSBvbGROb2RlLmtleVxyXG4gICkge1xyXG4gICAgY29uc3QgcHJvcHNQYXRjaGVzID0gZGlmZlByb3BzKG9sZE5vZGUsIG5ld05vZGUpO1xyXG4gICAgaWYgKHByb3BzUGF0Y2hlcykge1xyXG4gICAgICBjdXJyZW50UGF0Y2gucHVzaCh7dHlwZTogJ1BST1BTJywgcHJvcHM6IHByb3BzUGF0Y2hlc30pO1xyXG4gICAgfVxyXG4gICAgaWYgKCEobmV3Tm9kZS5wcm9wcyAmJiBuZXdOb2RlLnByb3BzLmhhc093blByb3BlcnR5KCdpZ25vcmUnKSkpIHtcclxuICAgICAgZGlmZkNoaWxkcmVuKFxyXG4gICAgICAgIG9sZE5vZGUuY2hpbGRyZW4sXHJcbiAgICAgICAgbmV3Tm9kZS5jaGlsZHJlbixcclxuICAgICAgICBpbmRleCxcclxuICAgICAgICBwYXRjaGVzLFxyXG4gICAgICAgIGN1cnJlbnRQYXRjaCxcclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgY3VycmVudFBhdGNoLnB1c2goe3R5cGU6ICdSRVBMQUNFJywgbm9kZTogbmV3Tm9kZX0pO1xyXG4gIH1cclxuICBpZiAoY3VycmVudFBhdGNoLmxlbmd0aCkge1xyXG4gICAgcGF0Y2hlc1tpbmRleF0gPSBjdXJyZW50UGF0Y2g7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBkaWZmQ2hpbGRyZW4gPSAob2xkQ2hpbGRyZW4sIG5ld0NoaWxkcmVuLCBpbmRleCwgcGF0Y2hlcywgY3VycmVudFBhdGNoKSA9PiB7XHJcbiAgdmFyIGRpZmZzID0gbGlzdERpZmYob2xkQ2hpbGRyZW4sIG5ld0NoaWxkcmVuLCAna2V5Jyk7XHJcbiAgbmV3Q2hpbGRyZW4gPSBkaWZmcy5jaGlsZHJlbjtcclxuICBpZiAoZGlmZnMubW92ZXMubGVuZ3RoKSB7XHJcbiAgICBjb25zdCByZW9yZGVyUGF0Y2ggPSB7IHR5cGU6ICdSRU9SREVSJywgbW92ZXM6IGRpZmZzLm1vdmVzIH07XHJcbiAgICBjdXJyZW50UGF0Y2gucHVzaChyZW9yZGVyUGF0Y2gpO1xyXG4gIH1cclxuXHJcbiAgbGV0IGxlZnROb2RlID0gbnVsbDtcclxuICBsZXQgY3VycmVudE5vZGVJbmRleCA9IGluZGV4O1xyXG4gIG9sZENoaWxkcmVuLmZvckVhY2goKGNoaWxkLCBpKSA9PiB7XHJcbiAgICBjb25zdCBuZXdDaGlsZCA9IG5ld0NoaWxkcmVuW2ldO1xyXG4gICAgY3VycmVudE5vZGVJbmRleCA9IChsZWZ0Tm9kZSAmJiBsZWZ0Tm9kZS5jb3VudClcclxuICAgID8gY3VycmVudE5vZGVJbmRleCArIGxlZnROb2RlLmNvdW50ICsgMVxyXG4gICAgOiBjdXJyZW50Tm9kZUluZGV4ICsgMTtcclxuICAgIGRmc1dhbGsoY2hpbGQsIG5ld0NoaWxkLCBjdXJyZW50Tm9kZUluZGV4LCBwYXRjaGVzKTtcclxuICAgIGxlZnROb2RlID0gY2hpbGQ7XHJcbiAgfSlcclxufVxyXG5cclxuY29uc3QgZGlmZlByb3BzID0gKG9sZE5vZGUsIG5ld05vZGUpID0+IHtcclxuICBsZXQgY291bnQgPSAwO1xyXG4gIGNvbnN0IG5ld1Byb3BzID0gbmV3Tm9kZS5wcm9wcztcclxuICBjb25zdCBvbGRQcm9wcyA9IG9sZE5vZGUucHJvcHM7XHJcbiAgY29uc3QgcHJvcHNQYXRjaGVzID0ge307XHJcbiAgT2JqZWN0LmtleXMobmV3UHJvcHMpLmZvckVhY2goa2V5ID0+IHtcclxuICAgIGlmIChvbGRQcm9wc1trZXldICE9PSBuZXdQcm9wc1trZXldIHx8ICFvbGRQcm9wcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgIGNvdW50Kys7XHJcbiAgICAgIHByb3BzUGF0Y2hlc1trZXldID0gbmV3UHJvcHNba2V5XTtcclxuICAgIH1cclxuICB9KVxyXG4gIGlmIChjb3VudCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcblxyXG4gIHJldHVybiBwcm9wc1BhdGNoZXNcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGlmZjsiLCJjbGFzcyBFbGVtZW50IHtcclxuICAvKipcclxuICAgKiBFbGVtZW5057G75p6E6YCg5Ye95pWwXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRhZ05hbWUg5qCH562+5ZCNXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzIOWxnuaAp+mbhuWQiFxyXG4gICAqIEBwYXJhbSB7QXJyYXl9IGNoaWxkcmVuIOWtkOWFg+e0oFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHRhZ05hbWUsIHByb3BzLCBjaGlsZHJlbil7XHJcbiAgICBpZiAoIXRoaXMgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiBuZXcgRWxlbWVudChhcmd1bWVudHMpOyBcclxuICAgIH1cclxuICAgIGlmIChwcm9wcyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgIGNoaWxkcmVuID0gcHJvcHNcclxuICAgICAgcHJvcHMgPSB7fVxyXG4gICAgfVxyXG4gICAgdGhpcy50YWdOYW1lID0gdGFnTmFtZTtcclxuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcclxuICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcclxuICAgIHRoaXMua2V5ID0gcHJvcHNcclxuICAgID8gcHJvcHMua2V5XHJcbiAgICA6IHZvaWQgNjY2XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCwgaSkgPT4ge1xyXG4gICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICAgICAgY291bnQgKz0gY2hpbGQuY291bnRcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjaGlsZHJlbltpXSA9ICcnICsgY2hpbGRcclxuICAgICAgfVxyXG4gICAgICBjb3VudCsrXHJcbiAgICB9KVxyXG4gICAgdGhpcy5jb3VudCA9IGNvdW50O1xyXG4gIH1cclxuICAvKipcclxuICAgKiByZW5kZXLlh73mlbDvvIzmoLnmja52RG9t5a+56LGh5p6E5bu655yf5a6eZG9tXHJcbiAgICovXHJcbiAgcmVuZGVyKCl7XHJcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy50YWdOYW1lKTtcclxuICAgIGNvbnN0IHsgcHJvcHMsIGNoaWxkcmVuIH0gPSB0aGlzO1xyXG4gICAgT2JqZWN0LmtleXMocHJvcHMpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgcHJvcHNba2V5XSk7XHJcbiAgICB9KVxyXG4gICAgY2hpbGRyZW4gJiYgY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgIGNvbnN0IGNoaWxkRWwgPSAoY2hpbGQgaW5zdGFuY2VvZiBFbGVtZW50KVxyXG4gICAgICA/IGNoaWxkLnJlbmRlcigpXHJcbiAgICAgIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hpbGQpO1xyXG4gICAgICBlbC5hcHBlbmRDaGlsZChjaGlsZEVsKTtcclxuICAgIH0pXHJcbiAgICByZXR1cm4gZWw7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZWwgPSAodGFnTmFtZSwgcHJvcHMsIGNoaWxkcmVuKSA9PiB7XHJcbiAgcmV0dXJuIG5ldyBFbGVtZW50KHRhZ05hbWUsIHByb3BzLCBjaGlsZHJlbik7XHJcbn07IiwiaW1wb3J0IHsgZWwgfSBmcm9tJy4vZWxlbWVudCc7XHJcbmltcG9ydCB7IGRpZmYgfSBmcm9tJy4vZGlmZic7XHJcbmltcG9ydCB7IHBhdGNoIH0gZnJvbScuL3BhdGNoJztcclxud2luZG93LnZkID0ge1xyXG4gIGVsLFxyXG4gIGRpZmYsXHJcbiAgcGF0Y2gsXHJcbn0iLCJleHBvcnQgY29uc3QgcGF0Y2ggPSAobm9kZSwgcGF0Y2hlcykgPT4ge1xyXG4gIGxldCBjb3VudGVyID0ge1xyXG4gICAgY291bnQ6IDAsXHJcbiAgfVxyXG4gIGRmc1dhbGsobm9kZSwgY291bnRlciwgcGF0Y2hlcylcclxufVxyXG5jb25zdCBkZnNXYWxrID0gKG5vZGUsIGNvdW50ZXIsIHBhdGNoZXMpID0+IHtcclxuICBjb25zdCBjdXJyZW50UGF0Y2hlcyA9IHBhdGNoZXNbY291bnRlci5jb3VudF07XHJcbiAgbm9kZS5jaGlsZE5vZGVzICYmIG5vZGUuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkTm9kZSA9PiB7XHJcbiAgICBjb3VudGVyLmNvdW50Kys7XHJcbiAgICBkZnNXYWxrKGNoaWxkTm9kZSwgY291bnRlciwgcGF0Y2hlcylcclxuICB9KTtcclxuICBpZiAoY3VycmVudFBhdGNoZXMpIHtcclxuICAgIGFwcGx5UGF0Y2hlcyhub2RlLCBjdXJyZW50UGF0Y2hlcyk7XHJcbiAgfVxyXG59XHJcbmNvbnN0IGFwcGx5UGF0Y2hlcyA9IChub2RlLCBjdXJyZW50UGF0Y2hlcykgPT4ge1xyXG4gIGN1cnJlbnRQYXRjaGVzLmZvckVhY2goY3VycmVudFBhdGNoID0+IHtcclxuICAgIHN3aXRjaCAoY3VycmVudFBhdGNoLnR5cGUpIHtcclxuICAgICAgY2FzZSAnUkVQTEFDRSc6XHJcbiAgICAgICAgY29uc3QgbmV3Tm9kZSA9ICh0eXBlb2YgY3VycmVudFBhdGNoLm5vZGUgPT09ICdzdHJpbmcnKSA/XHJcbiAgICAgICAgICBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjdXJyZW50UGF0Y2gubm9kZSkgOlxyXG4gICAgICAgICAgY3VycmVudFBhdGNoLm5vZGUucmVuZGVyKClcclxuICAgICAgICBub2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld05vZGUsIG5vZGUpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnUkVPUkRFUic6XHJcbiAgICAgICAgcmVvcmRlckNoaWxkcmVuKG5vZGUsIGN1cnJlbnRQYXRjaC5tb3ZlcylcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdQUk9QUyc6XHJcbiAgICAgICAgc2V0UHJvcHMobm9kZSwgY3VycmVudFBhdGNoLnByb3BzKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ1RFWFQnOlxyXG4gICAgICAgIGlmIChub2RlLnRleHRDb250ZW50KSB7XHJcbiAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gY3VycmVudFBhdGNoLmNvbnRlbnRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gZnVjayBpZVxyXG4gICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSBjdXJyZW50UGF0Y2guY29udGVudFxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBwYXRjaCB0eXBlICcgKyBjdXJyZW50UGF0Y2gudHlwZSlcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5jb25zdCBzZXRQcm9wcyA9IChub2RlLCBwcm9wcykgPT4ge1xyXG4gIE9iamVjdC5rZXlzLmZvckVhY2goa2V5ID0+IHtcclxuICAgIGlmIChwcm9wc1trZXldID09PSB2b2lkICd1ZGYnKSB7XHJcbiAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGtleSlcclxuICAgIH1lbHNle1xyXG4gICAgICBzZXRBdHRyKG5vZGUsIGtleSwgcHJvcHNba2V5XSk7XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuY29uc3Qgc2V0QXR0ciA9IChub2RlLCBrZXksIHZhbHVlKSA9PiB7XHJcbiAgc3dpdGNoIChrZXkpIHtcclxuICAgIGNhc2UgJ3N0eWxlJzpcclxuICAgICAgbm9kZS5zdHlsZS5jc3NUZXh0ID0gdmFsdWVcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ3ZhbHVlJzpcclxuICAgICAgY29uc3QgdGFnTmFtZSA9IG5vZGUudGFnTmFtZSB8fCAnJ1xyXG4gICAgICB0YWdOYW1lID0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIGlmIChcclxuICAgICAgICB0YWdOYW1lID09PSAnaW5wdXQnIHx8IHRhZ05hbWUgPT09ICd0ZXh0YXJlYSdcclxuICAgICAgKSB7XHJcbiAgICAgICAgbm9kZS52YWx1ZSA9IHZhbHVlXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gaWYgaXQgaXMgbm90IGEgaW5wdXQgb3IgdGV4dGFyZWEsIHVzZSBgc2V0QXR0cmlidXRlYCB0byBzZXRcclxuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKVxyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrXHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBub2RlLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKVxyXG4gICAgICBicmVha1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgcmVvcmRlckNoaWxkcmVuID0gKG5vZGUsIG1vdmVzKSA9PiB7XHJcbiAgY29uc3Qgc3RhdGljTm9kZUxpc3QgPSBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2Rlcyk7XHJcbiAgY29uc3QgbWFwcyA9IHt9O1xyXG4gIHN0YXRpY05vZGVMaXN0LmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xyXG4gICAgICBjb25zdCBrZXkgPSBub2RlLmdldEF0dHJpYnV0ZSgna2V5Jyk7XHJcbiAgICAgIGlmIChrZXkpIHtcclxuICAgICAgICBtYXBzW2tleV0gPSBub2RlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuICBtb3Zlcy5mb3JFYWNoKG1vdmUgPT4ge1xyXG4gICAgY29uc3QgeyBpbmRleCB9ID0gbW92ZTtcclxuICAgIGlmIChtb3ZlLnR5cGUgPT09IDApIHsgLy8gcmVtb3ZlIGl0ZW1cclxuICAgICAgaWYgKHN0YXRpY05vZGVMaXN0W2luZGV4XSA9PT0gbm9kZS5jaGlsZE5vZGVzW2luZGV4XSkgeyAvLyBtYXliZSBoYXZlIGJlZW4gcmVtb3ZlZCBmb3IgaW5zZXJ0aW5nXHJcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmNoaWxkTm9kZXNbaW5kZXhdKVxyXG4gICAgICB9XHJcbiAgICAgIHN0YXRpY05vZGVMaXN0LnNwbGljZShpbmRleCwgMSlcclxuICAgIH0gZWxzZSBpZiAobW92ZS50eXBlID09PSAxKSB7IC8vIGluc2VydCBpdGVtXHJcbiAgICAgIGNvbnN0IGluc2VydE5vZGUgPSBtYXBzW21vdmUuaXRlbS5rZXldXHJcbiAgICAgICAgPyBtYXBzW21vdmUuaXRlbS5rZXldXHJcbiAgICAgICAgOiAodHlwZW9mIG1vdmUuaXRlbSA9PT0gJ29iamVjdCcpXHJcbiAgICAgICAgICAgID8gbW92ZS5pdGVtLnJlbmRlcigpXHJcbiAgICAgICAgICAgIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobW92ZS5pdGVtKVxyXG4gICAgICBzdGF0aWNOb2RlTGlzdC5zcGxpY2UoaW5kZXgsIDAsIGluc2VydE5vZGUpXHJcbiAgICAgIG5vZGUuaW5zZXJ0QmVmb3JlKGluc2VydE5vZGUsIG5vZGUuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbClcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwYXRjaFxyXG4iXSwic291cmNlUm9vdCI6IiJ9