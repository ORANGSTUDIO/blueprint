import { IGroup, ShapeOptions, ShapeStyle, Item } from '@antv/g6';
import { IG6, IIGroup, IModelConfig, INodeConfig, IShapeOptions } from '../../interfaces';
import { BlockNames_DTS } from '../../interfaces/service';
import anchorEvent from '../../behaviors/anchor-event';
import itemEvents from '../../behaviors/item-event';
import defaultStyles from '../defaultStyles';

const { nodeStyles, anchorPointStyles } = defaultStyles;

function getStyle(options: any, cfg: any): ShapeStyle {
  return {
    ...cfg, // data中配置的样式
    ...nodeStyles,
    ...options, // 代码中传进来的样式
    anchorPointStyles,
  };
}

export default (G6: IG6) => {
  const itemType = BlockNames_DTS.LOGIC_BASE_NODE;

  const nodeDefinition: IShapeOptions = {
    itemType,
    // 自定义方法
    calcNodeHeight(cfg?: INodeConfig) {
      if (!cfg) {
        return
      }
      cfg.nodeWidth = 210;
      cfg.nodeHeight = 132;
    },

    assembleShape(cfg?: INodeConfig, group?: IGroup) {
    },

    getShapeStyle(cfg: IModelConfig) {
      return getStyle.call(
        this,
        {
          width: cfg.nodeWidth,
          height: cfg.nodeHeight,
          x: -cfg.nodeWidth / 2,
          y: -cfg.nodeHeight / 2,
        },
        cfg,
      );
    },

    initAnchor(cfg: IModelConfig, group: IIGroup) {
      group.anchorShapes = [];
      group.showAnchor = () => {
        this.drawAnchor(cfg, group);
      };
      group.clearAnchor = () => {
        if (group.anchorShapes) {
          const line = group.$getItem('dashed-line');

          if (line) {
            line.remove();
          }
          group.anchorShapes.forEach((a) => a.remove());
        }
        group.anchorShapes = [];
      };
    },

    drawAnchor(cfg: IModelConfig, group: IIGroup) {
      const attrs = group.getFirst().attr();
      const { anchorPointStyles } = attrs;

      const item = group.get('children')[0];
      const bBox = item.getBBox();
      const anchors: number[][] = this.getAnchorPoints(cfg);

      // 绘制锚点坐标
      anchors &&
      anchors.forEach((p: number[], i: number) => {
        const x = bBox.width * (p[0] - 0.5);
        const y = bBox.height * (p[1] - 0.5);

        const anchor = group.addShape('circle', {
          attrs: {
            x,
            y,
            ...anchorPointStyles,
          },
          opacity: 1,
          zIndex: 1,
          nodeId: group.get('id'),
          className: 'node-anchor',
          draggable: true,
          isAnchor: true,
          index: i,
        });

        const anchorGroup = this.getNodeAnchorBg({
          cfg,
          group,
          x,
          y,
          anchorIdx: i,
          position: p,
        });

        anchorEvent(anchorGroup, group, p);

        group.anchorShapes.push(anchor);
        group.anchorShapes.push(anchorGroup);
      });

      // 查找所有锚点
      group.getAllAnchors = () => {
        return group.anchorShapes.filter((c) => c.get('isAnchor') === true);
      };
      // 查找指定锚点
      group.getAnchor = (i) => {
        return group.anchorShapes.filter((c) => c.get('className') === 'node-anchor' && c.get('index') === i);
      };
      // 查找所有锚点背景
      group.getAllAnchorBg = () => {
        return group.anchorShapes.filter((c) => c.get('className') === 'node-anchor-bg');
      };
    },

    getNodeAnchorBg(options) {
      const { cfg, group, x, y, anchorIdx, position } = options;
      return group.addShape('circle', {
        attrs: {
          x,
          y,
          r: 11,
          fill: '#000',
          opacity: 0,
        },
        zIndex: 2,
        nodeId: group.get('id'),
        className: 'node-anchor-bg',
        draggable: true,
        isAnchor: true,
        index: anchorIdx,
        meta: cfg,
        anchorData: position[2],
      });
    },

    // 内部方法
    shapeType: 'logic-base',
    draw(cfg?: IModelConfig, group?: IGroup) {
      return this.drawShape(cfg, group);
    },

    drawShape(cfg: IModelConfig, group: IIGroup) {
      this.calcNodeHeight(cfg, group);

      const attrs = this.getShapeStyle(cfg, group);
      const keyShape = group.addShape('rect', {
        className: `${this.shapeType}-shape`,
        name: `${this.shapeType}-shape`,
        xShapeNode: true, // 自定义节点标识
        draggable: true,
        attrs,
      });

      this.assembleShape(cfg, group);

      group.$getItem = (className) => {
        return group.get('children').find((item) => item.get('className') === className);
      };

      this.initAnchor(cfg, group);
      return keyShape;
    },

    update(cfg: IModelConfig, node: Item, updateType?: any) {
    },
    // update: null,

    setState(name?: string, value?: string | boolean, item?: Item) {
      const buildInEvents: string[] = [
        'anchorShow',
        'anchorActived',
        'nodeState',
        'nodeState:default',
        'nodeState:selected',
        'nodeState:matched', // 搜索命中样式
        'nodeState:hover',
        'nodeOnDragStart',
        'nodeOnDrag',
        'nodeOnDragEnd',
      ];

      if (!item) {
        return
      }

      const group = item.getContainer() as IIGroup;

      if (group.get('destroyed')) {
        return;
      }

      if (name && buildInEvents.includes(name)) {
        // 内部this绑定到了当前item实例
        if (!itemEvents[name]) {
          console.warn('找不到事件方法：', name);
        }
        itemEvents[name].call(this, value, group);
      } else if (this.stateApplying) {
        this.stateApplying.call(this, name, value, item);
      } else {
        console.warn(
          `warning: ${name} 事件回调未注册!\n可继承该节点并通过 stateApplying 方法进行注册\n如已注册请忽略 (-_-!)`,
        );
      }
    },

    getAnchorPoints(cfg?: IModelConfig): any[] {
      return [
        [0, 0],
        [0, 0.5],
        [1, 0],
        [1, 0.5],
        [1, 1],
        [0.5, 1],
        [0, 1],
      ];
    },
  };

  G6.registerNode(itemType, nodeDefinition as ShapeOptions, 'single-node');
};
