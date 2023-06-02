import { IShape, ShapeStyle, ModelConfig } from "@antv/g6";
import { INodeConfig } from ".";
import { AnchorBaseConfig_DTS, AnchorTag_DTS } from "./service";

export interface DefaultStyles{
  nodeStyles: ShapeStyle;
  nodeStateStyles: {
    'nodeState:default': ShapeStyle;
    'nodeState:hover': ShapeStyle;
    'nodeState:selected': ShapeStyle;
    'nodeState:matched': ShapeStyle;
  };
  edgeStyles: ShapeStyle | {
    [key: string]: ShapeStyle;
  };
  edgeStateStyles: {
    selected: ShapeStyle;
    hover: ShapeStyle;
  };
  anchorPointStyles: ShapeStyle;
}

declare module "@antv/g6" {
  interface IGroup {
    $getItem: (className: string) => IShape;
    getAllAnchors: (className: string) => IShape[];
    getAnchor: (index: number) => IShape[];
    getAllAnchorBg: () => IShape[];
    anchorShapes: IShape[];
    clearAnchor: (group?: IGroup) => void;
    // 动画相关
    running?: boolean;
    run: (group?: IGroup) => void;
    stop: (group?: IGroup) => void;
    [key: string]: any;
  }
}

