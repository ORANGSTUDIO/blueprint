import { Anchor, AnchorTag } from "../../interfaces/anchor";

import LogicNode from "../LogicNode";

export default class LogicStartNode extends LogicNode {
  public name: string = 'logic-start-node';
  public label: string = 'Start';
  public cover: string = '//s2-cdn.oneitfarm.com/FvAeFg70Prhv7kROfw40GEQmMK9p';
  public intro: string = 'The start node marks the beginning of the method and can also output the formal parameters of the method';

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
