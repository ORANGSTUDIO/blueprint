import { IG6 } from './interfaces';
import registerBehavior from './behaviors';
import registerNode from './shapes/register-nodes';
import registerEdge from './shapes/register-edges';

export default (G6: IG6) => {
  registerNode(G6);
  registerEdge(G6);
  registerBehavior(G6);
};
