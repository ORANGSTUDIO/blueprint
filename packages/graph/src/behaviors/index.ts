import { IG6 } from '../interfaces';
import canvasEvent from './canvas-event'; // 画布行为
import selectNode from './select-node'; // 选中节点行为
import activeEdge from './active-edge'; // 激活边
import hoverNode from './hover-node'; // hover节点
// import scrollContainer from './scroll-container';

const registerBehavior: (G6: IG6) => void = (G6: IG6) => {
  canvasEvent(G6);
  selectNode(G6);
  // deleteItem(G6);
  activeEdge(G6);
  hoverNode(G6);
  // scrollContainer(G6);
};

export default registerBehavior;
