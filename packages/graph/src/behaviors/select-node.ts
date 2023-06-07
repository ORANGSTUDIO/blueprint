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
        'node:click': 'onNodeClick',
        'node:dblclick': 'onDblClick',
        'canvas:click': 'onCanvasClick',
        'node:mouseenter': 'onNodeMouseEnter',
        'node:mousemove': 'onNodeMouseMove',
        'node:mouseleave': 'onNodeMouseLeave',
      };
    },

    onNodeClick(e: IG6GraphEvent) {
      if (!e.item) {
        return;
      }

      this._clearSelected();
      e.item.toFront();

      const states = e.item.getStates();
      if (!states.includes('nodeState:matched')) {
        e.item.setState('nodeState', 'selected');
      }
      this.graph.emit('after-node-selected', e);
    },

    onDblClick(e: IG6GraphEvent) {
      if (!e.item) {
        return;
      }

      this._clearSelected();
      e.item.toFront();
      e.item.setState('nodeState', 'selected');
      this.graph.emit('after-node-dblclick', e);
    },

    onCanvasClick(e: IG6GraphEvent) {
      this._clearSelected();
      this.graph.emit('on-canvas-click', e);
    },

    onNodeMouseEnter(e: IG6GraphEvent) {
      if (!e.item) {
        return;
      }

      if (
        !e.item.hasState('nodeState:selected') &&
        !e.item.hasState('nodeState:matched')
      ) {
        e.item.setState('nodeState', 'hover');
      }
      this.graph.emit('on-node-mouseenter', e);
    },

    onNodeMouseMove(e: IG6GraphEvent) {
      this.graph.emit('on-node-mousemove', e);
    },

    onNodeMouseLeave(e: IG6GraphEvent) {
      if (!e.item) {
        return;
      }

      if (
        !e.item.hasState('nodeState:selected') &&
        !e.item.hasState('nodeState:matched')
      ) {
        e.item.clearStates('nodeState:hover');
      }
      this.graph.emit('on-node-mouseleave', e);
    },

    _clearSelected() {
      const selectedNodes = this.graph.findAllByState(
        'node',
        'nodeState:selected'
      );
      selectedNodes.forEach(node => {
        node.clearStates(['nodeState:selected', 'nodeState:hover']);
      });
      const selectedEdges = this.graph.findAllByState(
        'edge',
        'edgeState:selected'
      );
      selectedEdges.forEach(edge => {
        edge.clearStates(['edgeState:selected', 'edgeState:hover']);
      });
    },
  };

  G6.registerBehavior('select-node', behavior);
};
