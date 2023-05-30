import { ShapeStyle } from "@antv/g6";

export interface DefaultStyleConfig {
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

const defaultStyles: DefaultStyleConfig = {
  nodeStyles: {
    fill: '#fff',
    stroke: '#d9d9d9',
    lineWidth: 1,
    radius: 12,
    shadowOffsetX: 0,
    shadowOffsetY: 12,
    shadowBlur: 28,
  },
  nodeStateStyles: {
    'nodeState:default': {
      cursor: 'default',
      stroke: '#d9d9d9',
      lineWidth: 1,
    },
    'nodeState:hover': {
      lineWidth: 1,
      stroke: '#d9d9d9',
      shadowColor: '#d9d9d9',
    },
    'nodeState:selected': {
      lineWidth: 2,
      stroke: '#1890ff',
    },
    'nodeState:matched': {
      lineWidth: 2,
      stroke: '#1890ff',
    },
  },
  // edge默认样式
  edgeStyles: {
    radius: 6,
    offset: 15,
    lineWidth: 3,
    stroke: '#1890FF',
    lineDash: [5, 5],
    lineAppendWidth: 10, // 防止线太细没法点中
    endArrow: {
      lineWidth: 2,
      lineDash: [0],
      path: 'M 0,0 L 8,4 L 7,0 L 8,-4 Z',
      fill: '#1890FF',
      stroke: '#1890FF',
    },
  },
  // edge交互样式
  edgeStateStyles: {
    selected: {
      stroke: '#68B7FF',
    },
    hover: {
      stroke: '#68B7FF',
    },
  },

  // 锚点样式
  anchorPointStyles: {
    r: 4,
    stroke: '#68B7FF',
    fill: '#fff',
    lineWidth: 1,
  },
};

export default defaultStyles;
