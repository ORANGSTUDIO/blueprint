import { IG6GraphEvent, IGroup, IShape, Item } from '@antv/g6';
import _ from 'lodash';
import { AnchorData } from '../interfaces';
import getColorByType from '../utils/getColorByType';

let dragLog: number[] = [];
let anchorNodeId: string | number | null = null;

export default (anchor: IShape, group: IGroup, p: number[]) => {
  anchor.on('mouseenter', (_e: IG6GraphEvent) => {
    anchor.attr({
      cursor: 'crosshair',
    });
  });

  anchor.on('dragstart', (e: IG6GraphEvent) => {
    dragLog = [e.x, e.y];

    const bBox = group.get('item').getBBox();
    const point = [bBox.width * (p[0] - 0.5), bBox.height * (p[1] - 0.5)];

    const anchorData = _.get(e.target.cfg, 'anchorData') as AnchorData;
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

    const id = (group.get('item') as Item).get<string>('id');
    anchorNodeId = id;
  });

  anchor.on('drag', (e: IG6GraphEvent) => {
    const line = group.$getItem('dashed-line');
    const node = group.getFirst();
    const canvasBox = node.getCanvasBBox();

    if (!canvasBox || !line) {
      return;
    }

    const diff = canvasBox.height / 2;
    const pointStart = line.get('pointStart') as number[];
    const zoom = 1;

    const endPoint = [
      (e.x - canvasBox.x - canvasBox.width / 2) / zoom,
      (e.y - canvasBox.y - diff + 10) / zoom,
    ];

    line.toFront();

    if (
      Math.sqrt(
        Math.pow(Math.abs(dragLog[0]) - Math.abs(e.x), 2) +
          Math.pow(Math.abs(dragLog[1]) - Math.abs(e.y), 2)
      ) >= 10
    ) {
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

  anchor.on('dragend', (_e: IG6GraphEvent) => {
    const item = group.$getItem('dashed-line');
    item.remove();
    anchorNodeId = null;
  });

  anchor.on('dragenter', (e: IG6GraphEvent) => {
    const nodeId = e.target.cfg.nodeId as string;
    if (nodeId !== anchorNodeId) {
      const { index } = e.target.cfg;
      if (group.getAllAnchorBg()[index]) {
        group.getAllAnchorBg()[index].attr('fillOpacity', 0.7);
      }
    }
  });

  anchor.on('dragleave', (e: IG6GraphEvent) => {
    const nodeId = e.target.cfg.nodeId as string;
    const index = e.target.cfg.index as number;

    if (nodeId !== anchorNodeId) {
      if (group.getAllAnchorBg()[index]) {
        group.getAllAnchorBg()[index].attr('fillOpacity', 1);
      }
    }
  });
};
