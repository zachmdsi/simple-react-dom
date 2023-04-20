function VNode(type, props, children) {
  this.type = type;
  this.props = props;
  this.children = children;
}

function createVNode(type, props, ...children) {
  return new VNode(type, props, children);
}

function render(vNode) {
  if (typeof vNode == "string") {
    return document.createTextNode(vNode);
  }

  const { type, props, children } = vNode;
  const element = document.createElement(type);

  for (const prop in props) {
    if (props.hasOwnProperty(prop)) {
      element[prop] = props[prop];
    }
  }

  children
    .map(render)
    .forEach((childElement) => element.appendChild(childElement));

  return element;
}

function patch(parent, oldVNode, newVNode, index = 0) {
  if (!oldVNode) {
    parent.appendChild(newVNode);
  } else if (!newVNode) {
    parent.removeChild(parent.childNodes[index]);
  } else if (isDifferent(oldVNode, newVNode)) {
    parent.replaceChild(render(newVNode), parent.childNodes[index]);
  } else if (oldVNode.type) {
    const oldLength = oldVNode.children.length;
    const newLength = newVNode.children.length;

    for (let i = 0; i < Math.max(oldLength, newLength); i++) {
      patch(
        parent.childNodes[index],
        oldVNode.children[i],
        newVNode.children[i],
        i
      );
    }
  }
}

function isDifferent(oldVNode, newVNode) {
  return (
    typeof oldVNode !== typeof newVNode ||
    (typeof oldVNode === "string" && oldVNode !== newVNode) ||
    oldVNode.type !== newVNode.type
  );
}

const oldVNode = createVNode("div", {}, "Hello, world!");
const newVNode = createVNode("div", {}, "Hello, Virtual DOM!");

const container = document.getElementById("app");
container.appendChild(render(oldVNode));

setTimeout(() => {
  patch(container, oldVNode, newVNode);
});
