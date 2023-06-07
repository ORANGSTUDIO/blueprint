import { IG6GraphEvent, IGroup, INode, IShape } from '@antv/g6';
import _ from 'lodash';
// import { GraphUtil } from '../graph-util';
import getColorByType from '../utils/getColorByType';

let dragLog: number[] = [];
let anchorNodeId: string | number | null = null;

export default (anchor: IShape, group: IGroup, p: [number, number]) => {

  anchor.on('mouseenter', (e: IG6GraphEvent) => {
    anchor.attr({
      cursor: 'crosshair',
    });
  });

  anchor.on('dragstart', (e: IG6GraphEvent) => {
    dragLog = [e.x, e.y];
    const bBox = group.get('item').getBBox();
    const point = [
      bBox.width * (p[0] - 0.5), // x
      bBox.height * (p[1] - 0.5), // y
    ];

    const anchorData = _.get(e.target.cfg, 'anchorData');
    const { data, tag } = anchorData;

    const line = group.addShape('path', {
      attrs: {
        stroke: (tag as string).startsWith('statement')
          ? '#1890FF'
          : getColorByType(data.type),
        lineDash: [5, 5],
        path: [
          ['M', ...point],
          ['L', ...point],
        ],
      },
      className: 'dashed-line',
      pointStart: point,
    });

    group.toFront();
    line.toFront();

    const id = group.get('item').get('id');
    anchorNodeId = id;
  });

  anchor.on('drag', (e: IG6GraphEvent) => {
    const line = group.$getItem('dashed-line');
    const node = group.getFirst();
    const canvasBox = node.get('canvasBBox');


    if (!canvasBox || !line) {
      return;
    }
    ;

    const diff = canvasBox.height / 2;
    const pointStart = line.get('pointStart');

    // const graph = GraphUtil.getGraph();
    // const zoom = graph.getZoom() ;
    const zoom = 1;

    const endPoint = [(e.x - canvasBox.x - canvasBox.width / 2) / zoom, (e.y - canvasBox.y - diff + 10) / zoom];

    line.toFront();

    if (Math.sqrt(Math.pow(Math.abs(dragLog[0]) - Math.abs(e.x), 2) + Math.pow(Math.abs(dragLog[1]) - Math.abs(e.y), 2)) >= 10) {
      if (e.x >= dragLog[0]) {
        // 右下
        if (e.y >= dragLog[1]) {
          endPoint[0] -= 1;
          endPoint[1] -= 1;
        } else {
          // 右上
          endPoint[0] -= 1;
          endPoint[1] -= 1;
        }
      } else {
        // 左上
        if (e.y >= dragLog[1]) {
          endPoint[0] += 1;
          endPoint[1] += 1;
        } else {
          // 左下
          endPoint[0] += 1;
          endPoint[1] += 1;
        }
      }
    }

    line.attr({
      path: [
        ['M', ...pointStart],
        ['L', endPoint[0], endPoint[1]],
      ],
    });
  });

  anchor.on('dragend', (e: IG6GraphEvent) => {
    const item = group.$getItem('dashed-line');
    item.remove();
    anchorNodeId = null;
  });

  anchor.on('dragenter', (e: IG6GraphEvent) => {
    if (e.target.cfg.nodeId !== anchorNodeId) {
      const { index } = e.target.cfg;
      if (group.getAllAnchorBg()[index]) {
        group.getAllAnchorBg()[index].attr('fillOpacity', 0.7);
      }
    }
  });

  anchor.on('dragleave', (e: IG6GraphEvent) => {
    if (e.target.cfg.nodeId !== anchorNodeId) {
      const { index } = e.target.cfg;
      if (group.getAllAnchorBg()[index]) {
        group.getAllAnchorBg()[index].attr('fillOpacity', 1);
      }
    }
  });
};
