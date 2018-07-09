export const patch = (node, patches) => {
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

export default patch
