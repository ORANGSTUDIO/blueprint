import { IG6GraphEvent } from '@antv/g6';
import { IG6 } from '../interfaces';
import { BehaviorOptionThis } from '../interfaces/behavior';

export default (G6: IG6) => {
  const behavior: BehaviorOptionThis<'getEvents' | 'shouldBegin'> = {
    getEvents() {
      return {
        'node:mouseenter': 'onNodeEnter',
        'node:mouseleave': 'onNodeLeave',
      };
    },
    shouldBegin(_e) {
      return true;
    },
    onNodeEnter(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      // 显示当前节点的锚点
      this.graph.emit('before-anchor-show', e);
      // e.item.setState('anchorShow', true); // 二值状态
    },
    onNodeLeave(e: IG6GraphEvent) {
      if (!this.shouldBegin(e)) return;
      if (!e.item) return;
      // 将锚点再次隐藏
      e.item.setState('anchorShow', false); // 二值状态
    },
  }

  G6.registerBehavior('hover-node', behavior);
};
