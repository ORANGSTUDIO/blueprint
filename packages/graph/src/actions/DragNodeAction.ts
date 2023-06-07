import Action from "../Action";

import { BehaviorOption, IEdge, IG6GraphEvent, IGraph, INode } from '@antv/g6';
import _ from 'lodash';
import { AnchorTag, INodeConfig } from '../interfaces/';
import { BehaviorOptionThis } from "../interfaces/behavior";
import { IGroup, Point } from "@antv/g-base";

/**
 * 计算鼠标位置与矩形最小距离
 */
function calculateMinDistance(mouseX: number, mouseY: number, edge: IEdge) {
  const rect = edge.getBBox();
  const left = rect.x;
  const right = rect.x + rect.width;
  const top = rect.y;
  const bottom = rect.y + rect.height;

  const dx = Math.max(left - mouseX, 0, mouseX - right);
  const dy = Math.max(top - mouseY, 0, mouseY - bottom);

  return {
    target: edge,
    distance: Math.sqrt(dx * dx + dy * dy),
  };
}

function findMinDistanceEdge(mouseX: number, mouseY: number, allEdges: IEdge[]) {
  const all: Array<{
    target: IEdge;
    distance: number;
  }> = allEdges.map((edge: IEdge) => calculateMinDistance(mouseX, mouseY, edge));

  return _.minBy(all, (o) => o.distance);
}

export default class DragNodeAction extends Action {
  public name: string = "drag-shadow-node";

  public behaviorOption(): BehaviorOption {
    const self = this
    const option: BehaviorOptionThis<'getDefaultCfg' | 'getEvents' | 'shouldBegin', {
      _clearSelected: () => void;
      _nodeOnDragStart: (e: IG6GraphEvent, group: IGroup) => void;
      _nodeOnDrag: (e: IG6GraphEvent, group: IGroup) => void;
      _nodeOnDragEnd: (e: IG6GraphEvent, group: IGroup) => void;
      _addShadowNode: (e: IG6GraphEvent, group: IGroup) => void;
      getNearestEdge: (e: IG6GraphEvent) => void;
      _dragNodeModeCheck: () => boolean;
      distance: number[];
      dragStartNode: {
        id?: number | string | undefined;
        anchorIndex: number;
        anchorData: any;
        group?: IGroup;
      },
      origin: Point
    }> = {
      getDefaultCfg() {
        return {
          isGragging: false,
          sourceAnchorIndex: 0,
          // 记录当前拖拽模式(拖拽目标可能是节点也可能是锚点)
          dragTarget: 'node',
          dragStartNode: {},
          distance: [], // 鼠标距离节点中心位置的距离

          insertNodeInfo: null, // 待插入的节点相关信息
        };
      },
      getEvents() {
        return {
          'node:mousedown': 'onMousedown',
          'node:mouseup': 'onMouseup',
          'node:dragstart': 'onDragStart',
          'node:drag': 'onDrag',
          'node:dragend': 'onDragEnd',
          'node:drop': 'onDrop',
          'node:dragenter': 'onDragOver',
        };
      },
      shouldBegin(_e?: IG6GraphEvent) {
        return true;
      },
      onDragOver(_e: IG6GraphEvent) {},
      // 鼠标按下显示锚点光圈
      onMousedown(e: IG6GraphEvent) {
        if (!this.shouldBegin(e)) return;
        if (!e.item) return;
        this._clearSelected();
        if (e.target.cfg.isAnchor) {
          // 拖拽锚点
          this.dragTarget = 'anchor';
          this.dragStartNode = {
            ...e.item._cfg,
            anchorIndex: e.target.cfg.index,
            anchorData: e.target.cfg.anchorData, // 把当前点击的锚点也挂载上去
          };
          const nodes = this.graph.findAll('node', (node) => !!node);

          nodes.forEach((node) => {
            node.setState('anchorActived', true);
          });

          // > feat: 语句锚点,已经被连接的锚点不能再被连接
          if ([AnchorTag.STATEMENT_OUTPUT, AnchorTag.STATEMENT_INPUT].includes(e.target.cfg?.anchorData?.tag)) {
            const index = e.target.cfg.anchorData.index;
            const edges = this.graph.getEdges();
            const exist = edges.find(
              (edge) => edge._cfg && edge._cfg.model && edge._cfg.model.source === e.target.cfg.nodeId && edge._cfg.model.sourceAnchor === index,
            );
            if (exist) {
              if (!this.shouldBegin(e)) return;
              this.isGragging = false;
              const nodes = this.graph.findAll('node', (node) => !!node);
              nodes.forEach((node) => {
                node.clearStates('anchorActived');
              });
              return;
            }
          }
        }
        this.graph.emit('on-node-mousedown', e);
      },
      onMouseup(e: IG6GraphEvent) {
        if (!this.shouldBegin(e)) return;
        if (this.dragTarget === 'anchor') {
          const nodes = this.graph.findAll('node', (node) => !!node);

          nodes.forEach((node) => {
            node.clearStates('anchorActived');
          });
        }
        this.graph.emit('on-node-mouseup', e);
      },
      // 拖拽开始
      onDragStart(e: IG6GraphEvent) {
        if (!this.shouldBegin(e)) return;
        if (!e.item) return;
        const group = e.item.getContainer();

        this.isGragging = true;
        this.origin = {
          x: e.x,
          y: e.y,
        };
        if (e.target.get('isAnchor')) {
          // 拖拽锚点, 记录当前点击的锚点 index
          this.sourceAnchorIndex = e.target.get('index');
        } else if (group.getFirst().cfg.xShapeNode) {
          // 拖拽自定义节点
          e.item.toFront();
          this.dragTarget = 'node';
          this._nodeOnDragStart(e, group);
        }
        this.graph.emit('on-node-dragstart', e);
      },
      // 拖拽中
      onDrag(e: IG6GraphEvent) {
        if (!this.shouldBegin(e)) return;
        if (!e.item) return;

        if (this.isGragging) {
          const group = e.item.getContainer();

          if (this.dragTarget === 'node' && group.getFirst().cfg.xShapeNode) {
            this._nodeOnDrag(e, e.item.getContainer());
          }
          this.graph.emit('on-node-drag', e);
        }
      },
      // 拖拽结束
      onDragEnd(e: IG6GraphEvent) {
        if (!this.shouldBegin(e)) return;
        if (!e.item) return;

        const group = e.item.getContainer();

        this.isGragging = false;
        if (this.dragTarget === 'anchor') {
          const nodes = this.graph.findAll('node', (node) => !!node);

          nodes.forEach((node) => {
            node.clearStates('anchorActived');
          });
        } else if (this.dragTarget === 'node' && group.getFirst().cfg.xShapeNode) {
          this._nodeOnDragEnd(e, group);
        }
      },
      // 锚点拖拽结束添加边
      onDrop(e: IG6GraphEvent) {
        if (!this.shouldBegin(e)) return;
        if (!e.item) return;
        // e.item 当前拖拽节点 | e.target 当前释放节点
        if (this.dragStartNode.id && e.target.cfg.isAnchor && this.dragStartNode.id !== e.target.cfg.nodeId) {
          if (!this.dragStartNode.group) {
            return
          }

          const sourceNode = this.dragStartNode.group.get('item');
          const targetNode = e.item.getContainer().get('item');
          const { singleEdge } = sourceNode.getModel(); // 同个source和同个target只能有1条线
          const targetAnchorIndex = e.target.get('index');
          const edges = sourceNode.getOutEdges();

          const hasLinked = edges.find((edge: IEdge) => {
            // sourceAnchorIndex === targetAnchorIndex, edge.source.id === source.id, edget.target.id === target.id
            if (
              (edge.get('source').get('id') === sourceNode.get('id') &&
                edge.get('target').get('id') === e.target.cfg.nodeId &&
                edge.get('sourceAnchorIndex') === this.sourceAnchorIndex &&
                edge.get('targetAnchorIndex') === targetAnchorIndex) ||
              (singleEdge && edge.get('target').get('id') === e.target.cfg.nodeId)
            ) {
              return true;
            }
          });

          if (!hasLinked) {
            this.graph.emit('before-edge-add', {
              source: sourceNode,
              target: targetNode,
              sourceAnchor: this.dragStartNode.anchorIndex,
              targetAnchor: targetAnchorIndex,
            });
          }
        }
        this.graph.emit('on-node-drop', e);
      },

      /**
       * @description 判断当前画布模式是否启用了内置的 drag-node, 因为有冲突
       */
      _dragNodeModeCheck():  boolean {
        const currentMode = this.graph.get('modes')[this.graph.getCurrentMode()];

        if (currentMode.includes('drag-node')) {
          return true;
        }
        return false;
      },

      /**
       * @description 节点拖拽开始事件
       */
      _nodeOnDragStart(e: IG6GraphEvent, group: IGroup) {
        this._dragNodeModeCheck();
        this._addShadowNode(e, group);
      },

      /**
       * @description 添加虚拟节点
       */
      _addShadowNode(e: IG6GraphEvent, group: IGroup) {
        const item = group.get('item');
        const model = item.get('model');
        const { width, height, centerX, centerY } = item.getBBox();

        let attrs = {
          fillOpacity: 0.1,
          fill: '#1890FF',
          stroke: '#1890FF',
          cursor: 'move',
          lineDash: [4, 4],
          width,
          height,
          x: model.x,
          y: model.y,
        } as any;

        this.distance = [e.x - centerX + width / 2, e.y - centerY + height / 2];

        const shadowNode = group.addShape('rect', {
          className: 'shadow-node',
          attrs,
        });

        shadowNode.toFront();
      },

      /**
       * @description 节点拖拽事件
       */
      _nodeOnDrag(e: IG6GraphEvent, group: IGroup) {
        // 记录鼠标拖拽时与图形中心点坐标的距离
        const item = group.get('item');
        const pathAttrs = group.getFirst();
        const { centerX, centerY } = item.getBBox();
        const shadowNode = pathAttrs.cfg.xShapeNode ? group.$getItem('shadow-node') : null;

        if (!shadowNode) {
          return
        }

        shadowNode.attr({
          x: e.x - centerX - this.distance[0],
          y: e.y - centerY - this.distance[1],
        });
        shadowNode.toFront();

        this.getNearestEdge(e);
      },

      /**
       * @description 节点拖拽结束事件
       */
      _nodeOnDragEnd(e: IG6GraphEvent, group: IGroup) {
        const { graph } = this;
        if (!e.item) return;
        const model = e.item.getModel();

        const shadowNode = group.getFirst().cfg.xShapeNode ? group.$getItem('shadow-node') : null;

        if (shadowNode) {
          if (!model.x || !model.y) {
            return
          }

          const x = e.x - this.origin.x + model.x;
          const y = e.y - this.origin.y + model.y;
          const pos = {
            x,
            y,
          };

          shadowNode.remove();

          if (!this._dragNodeModeCheck()) {
            // 如果当前模式中没有使用内置的 drag-node 则让画布更新节点位置
            graph.updateItem(e.item, pos);
          }
        }
        if (this.insertNodeInfo) {
          const { edge, node } = this.insertNodeInfo as { edge: IEdge; node: INode };
          const sourceNode: INode = edge.getSource();
          const targetNode: INode = edge.getTarget();

          const sourceNodeData = (sourceNode.getModel() as INodeConfig).data;

          if (!sourceNodeData) {
            return
          }

          // 找出sourceNode的语句输出锚点的索引
          const sourceStatementOutputAnchor = sourceNodeData.anchors.find(
            (i) => i.tag === AnchorTag.STATEMENT_OUTPUT,
          );

          if (!sourceStatementOutputAnchor) {
            return
          }

          const sourceAnchorIndex = sourceStatementOutputAnchor.index;


          const targetNodeData = (targetNode.getModel() as INodeConfig).data;

          if (!targetNodeData) {
            return
          }


          const targetStatementInputAnchor = targetNodeData.anchors.find(
            (i) => i.tag === AnchorTag.STATEMENT_INPUT,
          );

          if (!targetStatementInputAnchor) {
            return
          }

          const targetAnchorIndex = targetStatementInputAnchor.index;

          this.graph.removeItem(edge, true);
          self.graph.addEdge({
            source: sourceNode,
            target: node,
            sourceAnchor: sourceAnchorIndex,
            targetAnchor: 0,
          });
          self.graph.addEdge({
            source: node,
            target: targetNode,
            sourceAnchor: 1,
            targetAnchor: targetAnchorIndex,
          });
          this.insertNodeInfo = null;
        }

        this.graph.emit('on-node-dragend', e);
      },
      // 清空已选的边
      _clearSelected() {
        const selectedEdges = this.graph.findAllByState('edge', 'edgeState:selected');

        selectedEdges.forEach((edge) => {
          edge.clearStates(['edgeState:selected', 'edgeState:hover']);
        });
      },

      /**
       * 获取最近的边
       */
      getNearestEdge(e: IG6GraphEvent) {
        // 计算距离这个节点最近的边
        const node = e.item as INode;
        const model = node.getModel() as INodeConfig;
        const point = { x: e.x, y: e.y };
        if (!model.data) {
          return
        }
        // 首先这个块要同时有输入和输出,并且两端没有被连接才可以
        const anchors = model.data.anchors.filter((i) => i.tag.startsWith('statement') && !i.connected);
        // 有些块多个输出
        if (anchors.length < 2) {
          return;
        }
        const relatedEdges = node.getEdges();
        // 遍历所有边,排除与当前节点相连接的边
        const allEdges = this.graph
          .getEdges()
          .filter((edge: IEdge) => {
            // 必须是逻辑语句边,变量边不处理
            return edge.getModel().type === 'logic-statement-edge';
          })
          .filter((edge) => {
            const exist = relatedEdges.find((i) => i.get('id') === edge.get('id'));
            return !exist;
          });

        const v = findMinDistanceEdge(point.x, point.y, allEdges);

        if (v) {
          if (v.distance <= 10) {
            if (v.target) {
              if (!v.target.hasState('edgeState:preselection')) {
                const prev = (this.graph as IGraph).findAllByState('edge', 'edgeState:preselection');
                if (prev) {
                  prev.forEach((i) => i.clearStates('edgeState:preselection'));
                  this.insertNodeInfo = null;
                }
                v.target.setState('edgeState:preselection', true);
                this.insertNodeInfo = {
                  edge: v.target,
                  node,
                };
              }
            }
          } else {
            if (v.target) {
              if (v.target.hasState('edgeState:preselection')) {
                v.target.clearStates('edgeState:preselection');
                this.insertNodeInfo = null;
              }
            }
          }
        }
      },
    };
    return option
  }
}
