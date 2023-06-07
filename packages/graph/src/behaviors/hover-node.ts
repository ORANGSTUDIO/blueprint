import { IG6GraphEvent } from '@antv/g6';
import { IG6 } from '../interfaces';
import { BehaviorOptionThis } from '../interfaces/behavior';

export default (G6: IG6) => {
  const behavior: BehaviorOptionThis<'getEvents'> = {
    getEvents() {
      return {
        'node:mouseenter': 'onNodeEnter',
        'node:mouseleave': 'onNodeLeave',
      };
    },

    onNodeEnter(e: IG6GraphEvent) {
      this.graph.emit('before-anchor-show', e);
    },

    onNodeLeave(e: IG6GraphEvent) {
      if (!e.item) return;
      e.item.setState('anchorShow', false);
    },
  };

  G6.registerBehavior('hover-node', behavior);
};
