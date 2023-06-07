import { BehaviorOption, Graph, IG6GraphEvent } from '@antv/g6';
import { IG6 } from '../interfaces';
import { BehaviorOptionThis } from '../interfaces/behavior';
import { WithRequiredProperty } from '../interfaces/util';

export default (G6: IG6) => {
  type IBehaviorOption = WithRequiredProperty<BehaviorOption,
    'getDefaultCfg' | 'getEvents' | 'shouldBegin'>

  const behavior: IBehaviorOption & ThisType<BehaviorOptionThis<{
    _clearSelected: () => void
  } & IBehaviorOption>> = {
    getDefaultCfg() {
      return {
        // editMode: false, // 当前的编辑状态
      };
    },
    getEvents() {
      return {
        'canvas:click': 'onCanvasClick',
        'edge:click': 'onEdgeClick',
        'edge:dblclick': 'ondblEdgeClick',
        'edge:mouseenter': 'onMouseEnter',
        'edge:mousemove': 'onMouseMove',
        'edge:mouseleave': 'onMouseLeave',
        'edge:dragover': 'onDragover',
      };
    },
    shouldBegin(e?: IG6GraphEvent) {
      return true;
    },
    onDragover(e: IG6GraphEvent) {},
    onCanvasClick(e: IG6GraphEvent) {
      this._clearSelected();
    },
    onEdgeClick(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      if (!e.item) return;
      e.item.toFront();
      this._clearSelected();
      // 设置当前节点的 click 状态为 true
      e.item.setState('edgeState', 'selected');
      // this.graph.setItemState(e.item, 'edgeState', 'selected');
      // 将点击事件发送给 graph 实例
      this.graph.emit('after-edge-selected', e);
    },
    ondblEdgeClick(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      if (!e.item) return;

      this._clearSelected();
      // 设置当前节点的 click 状态为 true
      e.item.setState('edgeState', 'selected');
      // 将点击事件发送给 graph 实例
      this.graph.emit('after-edge-dblclick', e);
    },
    // hover edge
    onMouseEnter(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      if (!e.item) return;

      if (!e.item.hasState('edgeState:hover') && !e.item.hasState('edgeState:selected')) {
        e.item.setState('edgeState', 'hover');
      }
      this.graph.emit('on-edge-mouseenter', e);
    },
    onMouseMove(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;

      this.graph.emit('on-edge-mousemove', e);
    },
    // out edge
    onMouseLeave(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      if (!e.item) return;

      if (!e.item.hasState('edgeState:selected')) {
        e.item.setState('edgeState', 'default');
      }
      this.graph.emit('on-edge-mouseleave', e);
    },
    // 清空已选
    _clearSelected() {
      const selectedNodes = this.graph.findAllByState('node', 'nodeState:selected');

      selectedNodes.forEach((node) => {
        node.clearStates('nodeState:selected');
      });

      const selectedEdges = this.graph.findAllByState('edge', 'edgeState:selected');

      selectedEdges.forEach((edge) => {
        edge.clearStates('edgeState:selected');
      });
      this.graph.emit('after-edge-selected');
    },
  };
  G6.registerBehavior('active-edge', behavior)
};
