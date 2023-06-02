import { Anchor, AnchorTag } from "../../interfaces/anchor";

import LogicNode from "../LogicNode";

export default class LogicEndNode extends LogicNode {
  public name: string = 'logic-end-node';
  public label: string = 'End';
  public cover: string = '//s2-cdn.oneitfarm.com/FoEnk_GRMC-zyA9yMgieECpoXjN3';
  public intro: string = 'The end node marks the end of the method, and its input is the return value of the method';

  public getAnchors() {
    const anchros: Anchor[] = [{
      "nodeId": "logic-end-node",
      "tag": AnchorTag.STATEMENT_INPUT,
      "index": 0,
      "connected": false,
      data: {
        label: "end"
      }
    }]

    return anchros;
  }
}
