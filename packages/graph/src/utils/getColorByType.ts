import { SchemaType } from "../interfaces/schema";

/**
 * 根据数据类型获取颜色
 * @param type 数据类型
 * @returns 颜色值
 */
export default function getColorByType(type: SchemaType) {
  const defaultColor = '#8c8c8c';

  const map: {
    [type in SchemaType]: string
  } = {
    'null': '#8c8c8c',
    'string': '#52C41A',
    'number': '#722ED1',
    'boolean': '#1c87d6',
    'object': '#FA8C16',
    'array': '#13C2C2',
    'integer': '#f759ab',
    'any': '#8c8c8c',
  }

  return map[type] || defaultColor;
}
