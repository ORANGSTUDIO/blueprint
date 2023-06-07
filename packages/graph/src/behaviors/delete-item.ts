import { IG6GraphEvent, Item } from '@antv/g6';
import { BACKSPACE, DELETE } from '../consts';
import { IG6 } from '../interfaces';
import { BehaviorOptionThis } from '../interfaces/behavior';

export default (G6: IG6) => {
  const behavior: BehaviorOptionThis<'getEvents'> = {
    getEvents() {
      return {
        keydown: 'onKeydown',
      };
    },

    onKeydown(e: IG6GraphEvent) {
      if (e.keyCode === BACKSPACE || e.keyCode === DELETE) {
        const nodes = this.graph.findAllByState('node', 'nodeState:selected');

        if (nodes && nodes.length) {
          const $node = nodes[0].getContainer().get('item') as Item;

          this.graph.emit('before-node-removed', {
            target: $node,
            callback(confirm: boolean) {
              if (confirm) {
                this.graph.remove($node);
                this.graph.emit('after-node-selected');
                this.graph.emit('after-node-removed', $node);
              }
            },
          });
        }

        const edges = this.graph.findAllByState('edge', 'edgeState:selected');

        if (edges && edges.length) {
          const $edge = edges[0].getContainer().get('item');
          const _this = this;

          this.graph.emit('before-edge-removed', {
            target: $edge,
            callback(confirm: boolean) {
              if (confirm) {
                _this.graph.remove($edge);
                _this.graph.set('after-edge-selected', []);
                _this.graph.emit('after-edge-selected');
                _this.graph.emit('after-edge-removed', $edge);
              }
            },
          });
        }
      }
    },
  };

  G6.registerBehavior('delete-item', behavior);
};
