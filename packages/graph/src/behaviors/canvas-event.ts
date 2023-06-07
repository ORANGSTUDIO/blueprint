import { IG6 } from '../interfaces';
import { IG6GraphEvent } from '@antv/g6';
import { BehaviorOptionThis } from '../interfaces/behavior';

export default (G6: IG6) => {
  const behavior: BehaviorOptionThis<'getEvents'> = {
    getEvents() {
      return {
        'canvas:mousemove': 'onCanvasMouseMove',
        'canvas:mousedown': 'onCanvasMouseDown',
        'canvas:mouseup': 'onCanvasMouseUp',
        'canvas:dragend': 'onCanvasDragEnd',
      };
    },

    onCanvasMouseMove(e: IG6GraphEvent) {
      e.target.get('el').style.cursor = 'grab';
    },

    onCanvasMouseDown(e: IG6GraphEvent) {
      e.target.get('el').style.cursor = 'grabbing';
    },

    onCanvasMouseUp(e: IG6GraphEvent) {
      e.target.get('el').style.cursor = 'grab';
    },

    onCanvasDragEnd(e: IG6GraphEvent) {
      e.target.get('el').style.cursor = 'grab';
      this.graph.emit('on-canvas-dragend', e);
    },
  };

  G6.registerBehavior('canvas-event', behavior);
};
