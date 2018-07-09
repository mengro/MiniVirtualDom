import listDiff from 'list-diff2';

export const diff = (oldTree, newTree) => {
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
  var diffs = listDiff(oldChildren, newChildren, 'key');
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

export default diff;