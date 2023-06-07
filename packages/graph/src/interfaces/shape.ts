import { IShape, ShapeStyle } from "@antv/g6";

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
  interface ModelConfig {
    nodeWidth?: number;
    nodeHeight?: number;
  }
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

