import { IElement } from '@antv/g-base';
import { IGroup, IShape, Item } from '@antv/g6';
import { LOGIC_STATEMENT_EDGE, LOGIC_VARIABLE_EDGE } from '../consts';
import { IIGroup, IModelConfig, IShapeOptions } from '../interfaces';
import { ItemEventName } from '../interfaces/event';

function setStyle(item: IElement, nodeStyle: any) {
  item.attr(nodeStyle);
}

function getItemStyle(type: string, group: IGroup, state: string = 'hover') {
  const item = group.get('item') as Item;
  const attrs = group.getFirst().attr();
  const originStyle =
    type === 'node'
      ? item.get('originStyle')
      : item.get('originStyle')['edge-shape'];
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
  [itemEvent in ItemEventName]: (...args: any[]) => void;
} & ThisType<IShapeOptions> = {
  anchorShow(value: string | boolean, group: IGroup) {
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

  anchorActived(value: string | boolean, group: IGroup) {
    if (group.get('children')) {
      const { anchorControls } = group.getFirst().cfg.attrs;
      if (anchorControls && anchorControls.hide) {
        return false;
      }
    }

    if (value) {
      const node = group.get('item') as Item;
      const nodeCfg = node.getModel() as IModelConfig;
      group.showAnchor(group);

      if (!this.getAnchorPoints) {
        return;
      }

      const points = this.getAnchorPoints(nodeCfg);
      if (!points) {
        return;
      }

      points.forEach((p, i) => {
        const bbox = group.getFirst().getBBox();
        const hotspot = group.addShape('circle', {
          zIndex: 0,
          attrs: {
            x: bbox.minX + bbox.width * p[0],
            y: bbox.minY + bbox.height * p[1],
            r: 0,
            opacity: 0.5,
            fill: '#1890ff',
          },
          nodeId: (group.get('item') as Item).get<string>('id'),
          className: 'node-anchor-bg',
          draggable: true,
          isAnchor: true,
          index: i,
        });

        hotspot.animate(
          { r: 11 },
          {
            duration: 200,
          }
        );

        group.sort();
        group.anchorShapes.push(hotspot);
      });

      group.anchorShapes.filter(item => {
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

  nodeState(value: string | boolean, group: IIGroup) {
    if (value === false) {
      events['nodeState:default'].call(this, true, group);
    } else {
      events[`nodeState:${value}` as ItemEventName] &&
        events[`nodeState:${value}` as ItemEventName].call(this, value, group);
    }
  },

  'nodeState:default'(value: string | boolean, group: IIGroup) {
    if (value) {
      const node = group.getFirst();
      const { defaultStyle } = getItemStyle.call(this, 'node', group);
      if (!defaultStyle) return;
      setStyle(node, defaultStyle);
    }
  },

  'nodeState:selected'(value: string | boolean, group: IIGroup) {
    const node = group.getFirst();
    const { activeStyle, defaultStyle } = getItemStyle.call(
      this,
      'node',
      group,
      'selected'
    );

    if (!activeStyle) {
      return;
    }

    if (value) {
      setStyle(node, activeStyle);
    } else {
      setStyle(node, defaultStyle);
    }
  },

  'nodeState:matched'(value: string | boolean, group: IGroup) {
    const node = group.getFirst();
    const { activeStyle, defaultStyle } = getItemStyle.call(
      this,
      'node',
      group,
      'matched'
    );

    if (!activeStyle) {
      return;
    }

    if (value) {
      setStyle(node, activeStyle);
    } else {
      setStyle(node, defaultStyle);
    }
  },

  'nodeState:hover'(value: string | boolean, group: IIGroup) {
    const node = group.getFirst();
    const { activeStyle, defaultStyle } = getItemStyle.call(
      this,
      'node',
      group,
      'hover'
    );

    if (!activeStyle) {
      return;
    }
    if (value) {
      setStyle(node, activeStyle);
    } else {
      setStyle(node, defaultStyle);
    }
  },

  edgeState(value: string | boolean, group: IGroup) {
    if (value === false) {
      events['edgeState:default'].call(this, true, group);
    } else {
      events[`edgeState:${value}` as ItemEventName] &&
        events[`edgeState:${value}` as ItemEventName].call(this, value, group);
    }
  },

  'edgeState:default'(value: string | boolean, group: IGroup) {
    const item = group.get('item') as Item;
    const model = item.getModel();
    const { type } = model;

    if (type === LOGIC_STATEMENT_EDGE) {
      if (value) {
        const edge = group.getFirst();
        edge.hide();
      }
    } else if (type === LOGIC_VARIABLE_EDGE) {
      const children = group.get('children');
      const pathShapeBg = children.find(
        (path: IElement) => path.get('name') === 'path-shape-bg'
      );
      const pathShape = children.find(
        (path: IElement) => path.get('name') === 'path-shape'
      );

      if (value) {
        pathShape.attr({
          lineWidth: 2,
        });
        pathShapeBg.hide();
      }
    }
  },

  'edgeState:hover'(value: string | boolean, group: IGroup) {
    const path = group.getFirst();
    const item = group.get('item') as Item;
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
      const pathShapeBg = children.find(
        (path: IElement) => path.get('name') === 'path-shape-bg'
      );
      const pathShape = children.find(
        (path: IElement) => path.get('name') === 'path-shape'
      );

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

  'edgeState:selected'(value: string | boolean, group: IGroup) {
    const path = group.getFirst();
    const item = group.get('item') as Item;
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
      const pathShapeBg = children.find(
        (path: IElement) => path.get('name') === 'path-shape-bg'
      );
      const pathShape = children.find(
        (path: IElement) => path.get('name') === 'path-shape'
      );

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
      imgShapes.forEach(imgShape => {
        imgShape.attr({ img: '../img/rightarrow3.svg' });
      });
      path.show();
    } else {
      imgShapes.forEach(imgShape => {
        imgShape.attr({ img: '../img/rightarrow2.svg' });
      });
      path.hide();
    }
  },
};

export default events;
