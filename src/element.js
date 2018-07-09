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

export const el = (tagName, props, children) => {
  return new Element(tagName, props, children);
};