import { SchemaType } from "../interfaces/schema";
import getColorByType from "./getColorByType";

export default function getImgByType(type: SchemaType, direction: 'in' | 'out' = 'in', active: boolean = false) {
  const exsit = ['string', 'number', 'boolean', 'object', 'array', 'integer', 'undefined'].includes(type);
  if (!exsit) {
    console.warn('graph/util/index', `不支持的数据类型:${type}`);
    type = 'null';
  }

  let svgXmlString: string;
  const color = getColorByType(type);

  if (direction === 'in') {
    svgXmlString = `
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='8' cy='8' r='7.5' stroke='${color}'/>
      ${active ? ` <circle cx='8' cy='8' r='4' fill='${color}'/>` : ``}
      </svg>`;
  } else {
    svgXmlString = `
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect x='1.5' y='1.5' width='13' height='13' stroke='${color}'/>
      ${active ? `<rect x='4' y='4' width='8' height='8' fill='${color}'/>` : ``}
      </svg>`;
  }
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXmlString);
  return img;
}
