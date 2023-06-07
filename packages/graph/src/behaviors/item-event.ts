import { LOGIC_STATEMENT_EDGE, LOGIC_VARIABLE_EDGE } from '../consts';
import { IIGroup, IModelConfig, IShapeOptions } from '../interfaces';
import { IGroup, IShape, INode } from '@antv/g6';
import { IElement } from '@antv/g-base'
import { ItemEventName } from '../interfaces/event';

function setStyle(item: IElement, nodeStyle: any) {
  item.attr(nodeStyle);
}

function getItemStyle(type: string, group: IGroup, state: string = 'hover') {
  const item = group.get('item');
  const attrs = group.getFirst().attr();
  const originStyle = type === 'node' ? item.get('originStyle') : item.get('originStyle')['edge-shape'];
  const activeStyle = attrs.style[`${type}State:${state}`];
  const defaultStyle = attrs.style[`${type}State:default`];

  if (type === 'edge' && defaultStyle && !defaultStyle.lineWidth) {
    defaultStyle.lineWidth = 1;
  }

  return {
    activeStyle,
    defaultStyle,
    originStyle,
  };
}

const events: {
  [itemEvent in ItemEventName]: (...args: any[]) => void
} & ThisType<IShapeOptions> = {
  /**
   * @description 锚点事件
   * 显示/隐藏锚点
   */
  anchorShow(value: string | boolean, group: IIGroup) {
    // 锚点全局开关
    // changeData 时由于实例没销毁, 这里需要处理异常
    if (group.get('children')) {
      const { anchorControls } = group.getFirst().cfg.attrs;
      if (anchorControls && anchorControls.hide) return false;
    }

    if (value) {
      group.showAnchor(group);
    } else {
      group.clearAnchor(group);
    }
  },

  /**
   * @description 锚点激活事件
   */
  anchorActived(value: string | boolean, group: IIGroup) {
    const _this = this;
    // 锚点全局开关
    if (group.get('children')) {
      const { anchorControls } = group.getFirst().cfg.attrs;
      if (anchorControls && anchorControls.hide) {
        return false;
      }
    }

    if (value) {
      const node = group.get('item') as INode;
      const nodeCfg = node.getModel() as IModelConfig;
      group.showAnchor(group);

      if (!_this.getAnchorPoints) {
        return
      }

      const points = _this.getAnchorPoints(nodeCfg);
      if (!points) {
        return
      }

      points.forEach((p, i) => {
        const bbox = group.getFirst().getBBox();
        // 激活元素
        const hotspot = group.addShape('circle', {
          zIndex: 0,
          attrs: {
            x: bbox.minX + bbox.width * p[0],
            y: bbox.minY + bbox.height * p[1],
            r: 0,
            opacity: 0.5,
            fill: '#1890ff',
            // ...anchorHotsoptStyles,
          },
          nodeId: group.get('item').get('id'),
          className: 'node-anchor-bg',
          draggable: true,
          isAnchor: true,
          index: i,
        });

        // 锚点动画
        hotspot.animate(
          { r: 11 },
          {
            duration: 200,
          },
        );

        group.sort(); // 将group中的元素按照 zIndex 从大到小排序
        group.anchorShapes.push(hotspot);
      });

      group.anchorShapes.filter((item) => {
        if (item.get('className') === 'node-anchor') {
          item.toFront();
        }
        if (item.get('className') === 'node-anchor-group') {
          item.attr({
            r: 13,
          });
          item.toFront();
        }
      });
    } else {
      group.clearAnchor(group);
    }
  },

  /**
   * @description 边多状态事件
   */
  nodeState(value: string | boolean, group: IIGroup) {
    const _this = this;
    if (value === false) {
      // 清除所有状态
      events['nodeState:default'].call(_this, true, group);
    } else {
      events[`nodeState:${value}` as ItemEventName] && events[`nodeState:${value}` as ItemEventName].call(_this, value, group);
    }
  },

  /**
   * @description 节点恢复默认状态事件
   */
  'nodeState:default'(value: string | boolean, group: IIGroup) {
    const _this = this;

    if (value) {
      const node = group.getChildByIndex(0);
      const { defaultStyle } = getItemStyle.call(_this, 'node', group);
      if (!defaultStyle) return;
      setStyle(node, defaultStyle);
    }
  },

  /**
   * @description 节点selected事件
   */
  'nodeState:selected'(value: string | boolean, group: IIGroup) {
    const _this = this as IShapeOptions;
    const node = group.getChildByIndex(0);
    const { activeStyle, defaultStyle } = getItemStyle.call(_this, 'node', group, 'selected');
    if (!activeStyle) return;
    if (value) {
      setStyle(node, activeStyle);
    } else {
      setStyle(node, defaultStyle);
    }
  },
  /**
   * 搜索块命中的样式
   * @param value
   * @param group
   */
  'nodeState:matched'(value, group) {
    const _this = this;
    const node = group.getChildByIndex(0);
    const { activeStyle, defaultStyle } = getItemStyle.call(_this, 'node', group, 'matched');
    if (!activeStyle) return;
    if (value) {
      setStyle(node, activeStyle);
    } else {
      setStyle(node, defaultStyle);
    }
  },
  /**
   * @description 节点hover事件
   */
  'nodeState:hover'(value: string | boolean, group: IIGroup) {
    const _this = this as IShapeOptions;
    const node = group.getChildByIndex(0);
    const { activeStyle, defaultStyle } = getItemStyle.call(_this, 'node', group, 'hover');

    if (!activeStyle) return;
    if (value) {
      setStyle(node, activeStyle);
    } else {
      setStyle(node, defaultStyle);
    }
  },

  /**
   * @description 边多状态事件
   */
  edgeState(value, group) {
    // const item = group.get('item');
    // const model = item.getModel();

    if (value === false) {
      events['edgeState:default'].call(this, true, group);
    } else {
      events[`edgeState:${value}` as ItemEventName] && events[`edgeState:${value}` as ItemEventName].call(this, value, group);
    }
  },

  /**
   * @description 边恢复默认状态事件
   */
  'edgeState:default'(value, group) {
    // const path = group.getChildByIndex(0);
    const item = group.get('item');
    const model = item.getModel();
    const { type } = model;

    if (type === LOGIC_STATEMENT_EDGE) {
      if (value) {
        const edge = group.getChildByIndex(0);
        edge.hide();
      }
    } else if (type === LOGIC_VARIABLE_EDGE) {
      const children = group.get('children');
      const pathShapeBg = children.find((path: IElement) => path.get('name') === 'path-shape-bg');
      const pathShape = children.find((path: IElement) => path.get('name') === 'path-shape');

      if (value) {
        pathShape.attr({
          lineWidth: 2,
        });
        pathShapeBg.hide();
      }
    }
  },

  /**
   * @description edge hover事件
   */
  'edgeState:hover'(value, group) {
    const path = group.getChildByIndex(0);
    const item = group.get('item');
    const model = item.getModel();
    const { type } = model;

    if (type === LOGIC_STATEMENT_EDGE) {
      if (value) {
        path.show();
      } else {
        path.hide();
      }
    } else if (type === LOGIC_VARIABLE_EDGE) {
      const children = group.get('children');
      const pathShapeBg = children.find((path: IElement) => path.get('name') === 'path-shape-bg');
      const pathShape = children.find((path: IElement) => path.get('name') === 'path-shape');

      if (value) {
        pathShape.attr({
          lineWidth: 3,
        });
        pathShapeBg.show();
      } else {
        pathShape.attr({
          lineWidth: 2,
        });
        pathShapeBg.hide();
      }
    }
  },

  /**
   * @description edge 选中事件
   */
  'edgeState:selected'(value, group) {
    const path = group.getChildByIndex(0);
    const item = group.get('item');
    const model = item.getModel();
    const { type } = model;

    if (type === LOGIC_STATEMENT_EDGE) {
      if (value) {
        path.show();
      } else {
        path.hide();
      }
    } else if (type === LOGIC_VARIABLE_EDGE) {
      const children = group.get('children');
      const pathShapeBg = children.find((path: IElement) => path.get('name') === 'path-shape-bg');
      const pathShape = children.find((path: IElement) => path.get('name') === 'path-shape');

      if (value) {
        pathShape.attr({
          lineWidth: 3,
        });
        pathShapeBg.show();
      } else {
        pathShape.attr({
          lineWidth: 2,
        });
        pathShapeBg.hide();
      }
    }
  },

  'edgeState:preselection'(value: boolean, group: IGroup) {
    const children = group.getChildren();
    const path = children[0] as IShape;
    const imgShapeGroup = children[1] as IGroup;
    const imgShapes = imgShapeGroup.getChildren() || [];

    if (value) {
      imgShapes.forEach((imgShape) => {
        // imgShape.attr({ img: require('../img/rightarrow3.svg') });
        imgShape.attr({ img: '../img/rightarrow3.svg' });
      });
      path.show();
    } else {
      imgShapes.forEach((imgShape) => {
        // imgShape.attr({ img: require('../img/rightarrow2.svg') });
        imgShape.attr({ img: '../img/rightarrow2.svg' });
      });
      path.hide();
    }
  },
};

export default events;
