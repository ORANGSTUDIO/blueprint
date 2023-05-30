import { ShapeStyle } from "@antv/g6";
import getColorByType from "./getColorByType";
import { SchemaType } from "../interfaces/schema";

export function getEgdeStyle(isStatement: boolean, type: SchemaType): ShapeStyle {
  return {
    radius: 6,
    offset: -15,
    lineWidth: isStatement ? 3 : 2,
    stroke: isStatement ? '#1890FF' : getColorByType(type) || '',
    lineAppendWidth: 10, // 防止线太细没法点中
    endArrow: isStatement
      ? undefined
      : {
          lineDash: [0],
          path: 'M 0,0 L 8,4 L 7,0 L 8,-4 Z',
          d: 0,
          fill: getColorByType(type) || '',
          stroke: getColorByType(type) || '',
        },
    // endArrow: null,
  };
}
