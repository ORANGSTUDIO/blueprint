import { IG6 } from '../interfaces';
import { IG6GraphEvent } from '@antv/g6';

export default (G6: IG6) => {
  G6.registerBehavior('canvas-event', {
    getDefaultCfg() {
      return {};
    },
    shouldBegin(e) {
      return true;
    },
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
      // logicEditorStore.canvasPosition = [e.canvasX / 2, e.canvasY / 2];
      this.graph.emit('on-canvas-dragend', e);
    },
  });
};
