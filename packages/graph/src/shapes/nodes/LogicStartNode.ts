import { Anchor, AnchorTag } from "../../interfaces/anchor";

import LogicNode from "../LogicNode";

export default class LogicStartNode extends LogicNode {
  public name: string = 'logic-start-node';
  public label: string = 'logic-start-node';
  public cover: string = 'logic-start-node';
  public intro: string = 'logic-start-node';

  public getAnchors() {
    const anchros: Anchor[] = [{
      "nodeId": "logic-start-node",
      "tag": AnchorTag.STATEMENT_OUTPUT,
      "index": 0,
      "connected": false,
      data: {
        name: 'start',
        label: "start"
      }
    }]

    return anchros;
  }
}
