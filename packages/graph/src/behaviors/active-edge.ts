import { IG6GraphEvent } from '@antv/g6';
import { IG6 } from '../interfaces';
import { BehaviorOptionThis } from '../interfaces/behavior';

export default (G6: IG6) => {
  const behavior: BehaviorOptionThis<
    'getEvents',
    {
      _clearSelected: () => void;
    }
  > = {
    getEvents() {
      return {
        'canvas:click': 'onCanvasClick',
        'edge:click': 'onEdgeClick',
        'edge:dblclick': 'ondblEdgeClick',
        'edge:mouseenter': 'onMouseEnter',
        'edge:mousemove': 'onMouseMove',
        'edge:mouseleave': 'onMouseLeave',
      };
    },

    onCanvasClick(_e: IG6GraphEvent) {
      this._clearSelected();
    },

    onEdgeClick(e: IG6GraphEvent) {
      if (!e.item) {
        return;
      }

      e.item.toFront();
      this._clearSelected();
      e.item.setState('edgeState', 'selected');
      this.graph.emit('after-edge-selected', e);
    },

    ondblEdgeClick(e: IG6GraphEvent) {
      if (!e.item) {
        return;
      }

      this._clearSelected();
      e.item.setState('edgeState', 'selected');
      this.graph.emit('after-edge-dblclick', e);
    },

    onMouseEnter(e: IG6GraphEvent) {
      if (!e.item) {
        return;
      }

      if (
        !e.item.hasState('edgeState:hover') &&
        !e.item.hasState('edgeState:selected')
      ) {
        e.item.setState('edgeState', 'hover');
      }
      this.graph.emit('on-edge-mouseenter', e);
    },

    onMouseMove(e: IG6GraphEvent) {
      this.graph.emit('on-edge-mousemove', e);
    },

    onMouseLeave(e: IG6GraphEvent) {
      if (!e.item) {
        return;
      }

      if (!e.item.hasState('edgeState:selected')) {
        e.item.setState('edgeState', 'default');
      }
      this.graph.emit('on-edge-mouseleave', e);
    },
    // 清空已选
    _clearSelected() {
      const selectedNodes = this.graph.findAllByState(
        'node',
        'nodeState:selected'
      );

      selectedNodes.forEach(node => {
        node.clearStates('nodeState:selected');
      });

      const selectedEdges = this.graph.findAllByState(
        'edge',
        'edgeState:selected'
      );

      selectedEdges.forEach(edge => {
        edge.clearStates('edgeState:selected');
      });
      this.graph.emit('after-edge-selected');
    },
  };

  G6.registerBehavior('active-edge', behavior);
};
