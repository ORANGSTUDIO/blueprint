import { Anchor, AnchorTag } from "../../interfaces/anchor";

import LogicNode from "../LogicNode";

export default class LogicVariableNode extends LogicNode {
  public name: string = 'logic-variable-node';
  public width: number = 150;
  public height: number = 40;
  public label: string = 'String';
  public cover: string = '//s2-cdn.oneitfarm.com/FvAeFg70Prhv7kROfw40GEQmMK9p';
  public intro: string = 'The start node marks the beginning of the method and can also output the formal parameters of the method';

  public getAnchors() {
    const anchor: Anchor = {
      "nodeId": "16849813662049865",
      "tag": AnchorTag.VAR_OUTPUT,
      "index": 0,
      "data": {
        "name": "",
        "label": "",
        "schema": {
          "type": "string"
        }
      },
      "connected": true
    }
    const anchors: Anchor[] = [
      anchor
    ]
    return anchors;
  }
}
