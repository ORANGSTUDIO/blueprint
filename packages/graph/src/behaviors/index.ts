import { IG6 } from '../interfaces';
import activeEdge from './active-edge';
import canvasEvent from './canvas-event';
import hoverNode from './hover-node';
import selectNode from './select-node';

const registerBehavior: (G6: IG6) => void = (G6: IG6) => {
  canvasEvent(G6);
  selectNode(G6);
  activeEdge(G6);
  hoverNode(G6);
};

export default registerBehavior;
