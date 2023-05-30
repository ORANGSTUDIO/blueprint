import { EdgeConfig, GraphData, IG6GraphEvent, IShape, ModelConfig, ShapeStyle, StateStyles, NodeConfig } from '@antv/g6';
// import * as diff from 'diff';
// import jsf from 'json-schema-faker';
import _ from 'lodash';
// import Vue from 'vue';
// import { MethodRecord } from '../../../../../core/interfaces/db_method';
import {
  AnchorBaseConfig_DTS,
  AnchorTag_DTS,
  BlockNames_DTS,
  ConstOrVariable_DTS,
  DescInfo_DTS,
} from '../interfaces/service';
import {
  IFuncNodeConfig,
  INodeConfig,
  IPositon,
  IVarNodeConfig,
  LifeCircleItem,
  LogicTransferData,
} from '../interfaces';
import getColorByType from './getColorByType';
import { Schema, SchemaType } from '../interfaces/schema';
import { LOGIC_VARIABLE_EDGE } from '../consts';

export interface ObjectConfig {
  label: string;
  name: string;
  value: any;
  schema: Schema;
  _route_path?: string;
  _origin_node_id?: string;
  _origin_anchor_index?: number;
}

export interface VariableDetailOption {
  parentModel: INodeConfig;
  objectConfig: ObjectConfig;
}

export function getStatementEdgeBgArrow(color: string = '#74BBFF') {
  const svgXmlString = `
  <svg width="10" height="10" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.15503 1.58817C1.67433 0.927203 2.14648 0 2.96377 0H11.9816C12.6214 0 13.2227 0.306168 13.599 0.823657L20.1445 9.82366C20.6545 10.525 20.6545 11.475 20.1445 12.1763L13.599 21.1763C13.2227 21.6938 12.6214 22 11.9816 22H2.96377C2.14648 22 1.67433 21.0728 2.15503 20.4118L8.14448 12.1763C8.65451 11.475 8.65451 10.525 8.14448 9.82366L2.15503 1.58817Z" fill="${color}"/>
  </svg>
  `;
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXmlString);
  return img;
}

export function getTypeCastImgByType(type: SchemaType) {
  const fillColor = getColorByType(type);
  const svgXmlString = `<svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <circle cx='9' cy='9' r='9' fill='white'/>
            <path d='M12.3255 9.7C12.3874 9.7 12.4467 9.72458 12.4905 9.76834C12.5342 9.8121 12.5588 9.87145 12.5588 9.93333V10.8667C12.5588 10.9286 12.5342 10.9879 12.4905 11.0317C12.4467 11.0754 12.3874 11.1 12.3255 11.1H7.656L8.4932 11.9372C8.5368 11.9809 8.56128 12.0402 8.56128 12.1019C8.56128 12.1637 8.5368 12.2229 8.4932 12.2667L7.83333 12.9265C7.81166 12.9483 7.78591 12.9655 7.75756 12.9773C7.72921 12.989 7.69882 12.9951 7.66813 12.9951C7.63744 12.9951 7.60705 12.989 7.5787 12.9773C7.55036 12.9655 7.52461 12.9483 7.50293 12.9265L5.62693 11.0505C5.60275 11.0267 5.58404 10.998 5.57211 10.9662C5.56018 10.9345 5.55532 10.9005 5.55787 10.8667V9.93333C5.55787 9.87145 5.58245 9.8121 5.62621 9.76834C5.66997 9.72458 5.72932 9.7 5.7912 9.7H12.3245H12.3255ZM10.5111 5.07253L12.3871 6.94853C12.4114 6.97242 12.4302 7.00135 12.4421 7.03328C12.454 7.0652 12.4588 7.09936 12.4561 7.13333V8.06667C12.4561 8.12855 12.4316 8.1879 12.3878 8.23166C12.344 8.27542 12.2847 8.3 12.2228 8.3H5.68947C5.62758 8.3 5.56823 8.27542 5.52448 8.23166C5.48072 8.1879 5.45613 8.12855 5.45613 8.06667V7.13333C5.45613 7.07145 5.48072 7.0121 5.52448 6.96834C5.56823 6.92458 5.62758 6.9 5.68947 6.9H10.358L9.5208 6.0628C9.49907 6.04113 9.48183 6.01538 9.47007 5.98703C9.4583 5.95868 9.45225 5.92829 9.45225 5.8976C9.45225 5.86691 9.4583 5.83652 9.47007 5.80817C9.48183 5.77982 9.49907 5.75407 9.5208 5.7324L10.1807 5.07253C10.2023 5.0508 10.2281 5.03356 10.2564 5.0218C10.2848 5.01004 10.3152 5.00398 10.3459 5.00398C10.3766 5.00398 10.4069 5.01004 10.4353 5.0218C10.4636 5.03356 10.4894 5.0508 10.5111 5.07253ZM9 2C9.91925 2 10.8295 2.18106 11.6788 2.53284C12.5281 2.88463 13.2997 3.40024 13.9497 4.05025C14.5998 4.70026 15.1154 5.47194 15.4672 6.32122C15.8189 7.1705 16 8.08075 16 9C16 9.91925 15.8189 10.8295 15.4672 11.6788C15.1154 12.5281 14.5998 13.2997 13.9497 13.9497C13.2997 14.5998 12.5281 15.1154 11.6788 15.4672C10.8295 15.8189 9.91925 16 9 16C7.14348 16 5.36301 15.2625 4.05025 13.9497C2.7375 12.637 2 10.8565 2 9C2 7.14348 2.7375 5.36301 4.05025 4.05025C5.36301 2.7375 7.14348 2 9 2ZM9 3.4C8.2646 3.4 7.5364 3.54485 6.85697 3.82627C6.17755 4.1077 5.56021 4.52019 5.0402 5.0402C4.52019 5.56021 4.1077 6.17755 3.82627 6.85697C3.54485 7.5364 3.4 8.2646 3.4 9C3.4 9.7354 3.54485 10.4636 3.82627 11.143C4.1077 11.8225 4.52019 12.4398 5.0402 12.9598C5.56021 13.4798 6.17755 13.8923 6.85697 14.1737C7.5364 14.4552 8.2646 14.6 9 14.6C10.4852 14.6 11.9096 14.01 12.9598 12.9598C14.01 11.9096 14.6 10.4852 14.6 9C14.6 7.51479 14.01 6.09041 12.9598 5.0402C11.9096 3.99 10.4852 3.4 9 3.4Z' fill='${fillColor}'/>
          </svg>`;
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXmlString);
  return img;
}

/**
 * 获取主色的背景色
 * @returns 背景色
 */
export function getBgColorByColor(color: string) {
  const defaultColor = '#CCCCCC';

  const map = new Map<string, string>([
    ['#52C41A', '#D9F7BE'],
    ['#722ED1', '#EFDBFF'],
    ['#1c87d6', '#C4EEFF'],
    ['#FA8C16', '#FFE7BA'],
    ['#13C2C2', '#B5F5EC'],
    ['#FA541C', '#ffd8bf'],
    ['#f759ab', '#ffadd2'], // 整型
  ]);

  return map.get(color) || defaultColor;
}

export function getRandomNodeId(): string {
  return `${+new Date() + (Math.random() * 10000).toFixed(0)}`;
}

export interface DetailNodeBaseConfig {
  parent_node_id: string;
  parent_node_position: IPositon;
  parent_node_config: {
    label: string;
    name: string;
    value: any;
    _route_path: string;
    _origin_node_id?: string;
    _origin_anchor_index?: number;
    schema?: Schema;
  };
}

export function isVariableNode(type: BlockNames_DTS) {
  return ['string', 'number', 'boolean', 'array', 'object', 'undefined', 'integer'] // 变量
    .map((type) => `logic-${type}-node`)
    .includes(type);
}

export function isClickMethodDetial(e: IG6GraphEvent) {
  const shape = e.target as IShape;
  return shape.get('name') === 'funcDetail';
}

export function isClickApiHelper(e: IG6GraphEvent) {
  const shape = e.target as IShape;
  return shape.get('name') === 'api-help-icon';
}

export function integeGraphData(oldData: GraphData, newData: GraphData): GraphData {
  const startNode = _.find(
    newData.nodes,
    (newNode: INodeConfig) => newNode.type === BlockNames_DTS.LOGIC_START_NODE,
  ) as INodeConfig;
  const endNode = _.find(
    newData.nodes,
    (newNode: INodeConfig) => newNode.type === BlockNames_DTS.LOGIC_END_NODE,
  ) as INodeConfig;

  const oldNodes = oldData.nodes as INodeConfig[];
  _.forEach(oldNodes, (oldNode: INodeConfig) => {
    if (oldNode.type === BlockNames_DTS.LOGIC_START_NODE) {
      Object.assign(oldNode, { ...startNode, id: oldNode.id });
    }

    if (oldNode.type === BlockNames_DTS.LOGIC_END_NODE) {
      Object.assign(oldNode, { ...endNode, id: oldNode.id });
    }
  });

  return oldData;
}

/**
 * 判断数据类型，只判断基础类型
 * @param data 待判断的数据
 */
export function getDataType(data: any) {
  if (_.isArray(data)) {
    return 'array';
  }

  return typeof data;
}

/**
 * 获取节点块文本的长度
 * @param value
 * @return 内容的长度
 */
export function getNodeTextSize(value: string): number {
  if (!value) {
    return 0;
  }
  const charCount = value.split('').reduce((prev, curr) => {
    if (/[a-z]|[0-9]|[,;.!@#-+/\\$%^*()<>?:"'{}~]/i.test(curr)) {
      return prev + 0.6;
    }
    return prev + 1;
  }, 0);

  // 向上取整，防止出现半个字的情况
  return Math.ceil(charCount);
}


export function ensureHTTPS(url: string): string {
  if (!url) {
    return '';
  }
  if (!/^https?:\/\//i.test(url)) {
    if (url.startsWith('//')) {
      url = 'https:' + url;
    } else {
      url = 'https://' + url;
    }
  } else if (/^http:\/\//i.test(url)) {
    url = url.replace(/^http:/i, 'https:');
  }
  return url;
}

export function canCoerce(type1: string, type2: string): boolean {
  if (type1 === type2) {
    return true;
  }

  if ((type1 === 'string' && type2 === 'number') || (type2 === 'string' && type1 === 'number')) {
    return true;
  }
  if ((type1 === 'string' && type2 === 'integer') || (type2 === 'string' && type1 === 'integer')) {
    return true;
  }
  if ((type1 === 'boolean' && type2 === 'integer') || (type2 === 'boolean' && type1 === 'integer')) {
    return true;
  }
  if ((type1 === 'boolean' && type2 === 'number') || (type2 === 'boolean' && type1 === 'number')) {
    return true;
  }
  if ((type1 === 'boolean' && type2 === 'string') || (type2 === 'boolean' && type1 === 'string')) {
    return true;
  }
  return false;
}
