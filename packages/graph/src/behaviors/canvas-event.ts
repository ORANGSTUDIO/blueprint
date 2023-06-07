import { IG6 } from '../interfaces';
import { BehaviorOption, IG6GraphEvent } from '@antv/g6';
import { BehaviorOptionThis } from '../interfaces/behavior';
import { WithRequiredProperty } from '../interfaces/util';

export default (G6: IG6) => {
  type IBehaviorOption = WithRequiredProperty<BehaviorOption,
    'getDefaultCfg' | 'getEvents' | 'shouldBegin'>

  const behavior: IBehaviorOption & ThisType<BehaviorOptionThis<{
  } & IBehaviorOption>> = {
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
  }

  G6.registerBehavior('canvas-event', behavior);
};
