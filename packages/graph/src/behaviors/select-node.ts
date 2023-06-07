import { IG6GraphEvent } from '@antv/g6';
import { IG6 } from '../interfaces';
import { BehaviorOptionThis } from '../interfaces/behavior';

export default (G6: IG6) => {
  const behavior: BehaviorOptionThis<'getDefaultCfg' | 'getEvents' | 'shouldBegin', {
    _clearSelected: () => void;
  }> = {
    getDefaultCfg() {
      return {
        multiple: false,
      };
    },

    getEvents() {
      return {
        'node:click': 'onNodeClick',
        'node:dblclick': 'onDblClick',
        'canvas:click': 'onCanvasClick',
        'node:mouseenter': 'onNodeMouseEnter',
        'node:mousemove': 'onNodeMouseMove',
        'node:mouseleave': 'onNodeMouseLeave',
      };
    },
    shouldBegin(_e) {
      return true;
    },

    onNodeClick(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      if (!e.item) return;
      // 先将所有当前是 click 状态的节点/edge 置为非 selected 状态
      this._clearSelected();
      e.item.toFront();
      // 获取被点击的节点元素对象, 设置当前节点的 click 状态为 selected
      const states = e.item.getStates();
      if (!states.includes('nodeState:matched')) {
        e.item.setState('nodeState', 'selected');
      }
      // 将点击事件发送给 graph 实例
      this.graph.emit('after-node-selected', e);
    },
    onDblClick(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      if (!e.item) return;
      // 先将所有当前是 click 状态的节点/edge 置为非 selected 状态
      this._clearSelected();
      e.item.toFront();
      // 获取被点击的节点元素对象, 设置当前节点的 click 状态为 true
      e.item.setState('nodeState', 'selected');
      // 将点击事件发送给 graph 实例
      this.graph.emit('after-node-dblclick', e);
    },
    onCanvasClick(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      this._clearSelected();
      this.graph.emit('on-canvas-click', e);
    },
    // hover node
    onNodeMouseEnter(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      if (!e.item) return;
      if (!e.item.hasState('nodeState:selected') && !e.item.hasState('nodeState:matched')) {
        e.item.setState('nodeState', 'hover');
      }
      this.graph.emit('on-node-mouseenter', e);
    },
    onNodeMouseMove(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      this.graph.emit('on-node-mousemove', e);
    },
    // 移出 node
    onNodeMouseLeave(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      if (!e.item) return;
      // hasState 判断当前元素是否存在某种状态
      if (!e.item.hasState('nodeState:selected') && !e.item.hasState('nodeState:matched')) {
        e.item.clearStates('nodeState:hover');
      }
      this.graph.emit('on-node-mouseleave', e);
    },
    // 清空已选
    _clearSelected() {
      const selectedNodes = this.graph.findAllByState('node', 'nodeState:selected');
      selectedNodes.forEach(node => {
        node.clearStates(['nodeState:selected', 'nodeState:hover']);
      });
      const selectedEdges = this.graph.findAllByState('edge', 'edgeState:selected');
      selectedEdges.forEach(edge => {
        edge.clearStates(['edgeState:selected', 'edgeState:hover']);
      });
      // this.graph.emit('after-node-selected');
    },
  }
  G6.registerBehavior('select-node', behavior);
};
