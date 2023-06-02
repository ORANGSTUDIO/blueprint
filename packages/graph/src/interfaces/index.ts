import G6, { IGroup, INode, ModelConfig, NodeConfig, IShape, IG6GraphEvent, ShapeOptions } from '@antv/g6';
import { AnchorBaseConfig_DTS, BlockNames_DTS } from './service';
import { AnchorTag } from './anchor';

export * from './anchor';

export interface GraphOptions {
  container: HTMLElement;
}

export type IG6 = typeof G6;

export type IIGroup = IGroup & {
  $getItem: (className: string) => IShape;
  getAllAnchors: (className: string) => IShape[];
  getAnchor: (index: number) => IShape[];
  getAllAnchorBg: () => IShape[];
  anchorShapes: IShape[];
  clearAnchor: (group?: IIGroup) => void;
  // 动画相关
  running?: boolean;
  run: (group?: IIGroup) => void;
  stop: (group?: IIGroup) => void;
  [key: string]: any;
};

export type IShapeOptions = ShapeOptions & Partial<{
  calcNodeHeight: (cfg?: NodeConfig, group?: IGroup) => void;
  assembleShape: (cfg?: INodeConfig, group?: IGroup) => void;
  getShapeStyle: (cfg: IModelConfig) => void;
  initAnchor: (cfg: IModelConfig, group: IIGroup) => void;
  drawAnchor: (cfg: IModelConfig, group: IIGroup) => void;
  getNodeAnchorBg: (options: {
    cfg: IModelConfig;
    group: IIGroup;
    x: number;
    y: number;
    anchorIdx: number;
    position: number[];
  }) => IShape;
}>;

export interface IModelConfig extends ModelConfig {
  nodeWidth: number;
  nodeHeight: number;
  data: INodeConfig;
}

export enum StageMode {
  Method = 'method',
  Variable = 'variable',
}

export interface AnchorData {
  tag: AnchorTag;
  type: string;
  label: string;
  value: any;

  [key: string]: any; // 不同的节点的不同锚点还有可能有自己的特有属性
}

export interface LogicCategory {
  label: string;
  name: string;
  uuid?: string;
  children: LogicCategoryItem[];
}

export interface LogicCategoryItem {
  type: BlockNames_DTS | string; // 节点名称
  label: string; // 节点中文名称
  name?: string; // 节点英文名称
  img: string; // 节点icon
  meta?: INodeConfig; // 节点配置
}



export interface LifeCircle {
  value: string;
  label: string;
  mold?: number; //  在当前mold类型页面才显示
}

export interface LifeCircleItem {
  type: string;
  label: string;
  uuid: string;
}

export type NodeConfigDataUnion =
  | IVarNodeConfig
  | IFuncNodeConfig
  | IMessageNodeConfig
  | ISideMessageConfig
  | INetNodeConfig
  | IRouteNodeConfig
  | ISetLocaleConfig
  | IMethodRef
  | IPagePassValue
  | IGetLocalLan
  | {};

export interface IGetLocalLan {
  i18nKey: string;
}

export interface IMethodRef {
  methodId: string;
}

export interface ISetLocaleConfig {
  language: LanguageMap;
}

/**
 * 支持的语言
 */
export enum LanguageMap {
  CN = 'zh-CN', // 中文
  EN = 'en-US', // 英文
}

export interface IPagePassValue {
  page_pass_value_type: PagePassValueType;
}

/**
 * 路由取值
 */
export enum PagePassValueType {
  PATH = 'path', // 路径
  NAME = 'name', // 路由名
  QUERY = 'query', // 路由查询参数
  PARAMS = 'params', // 动态路由键值对
  META = 'meta', // 信息
}

export interface IRouteNodeConfig {
  target_page: string;
}

/**
 * 网络请求方式
 */
export enum RequestType {
  POST = 'post',
  GET = 'get',
  DELETE = 'delete',
  PUT = 'put',
  PATCH = 'patch',
}

export interface INetNodeConfig {
  requestType: RequestType;
}

/**
 * 消息提醒的类型
 */
export enum MessageType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

/**
 * 侧边提醒
 */
export interface ISideMessageConfig {
  content: string;
  type: SideMessageType;
}

/**
 * 侧边提醒类型
 */
export enum SideMessageType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROE = 'error',
}

export interface IMessageNodeConfig {
  during: number;
  type: MessageType;
  content: string;
}

export interface IVarNodeConfig {
  varId: string;
  varLabel: string;
  varName: string;
}

export interface IFuncNodeConfig {
  funcId: string;
  funcName: string;
  funcLabel: string;
}


export type INodeConfig<T extends NodeConfigDataUnion = {}> =
{
  type: BlockNames_DTS | string; // 节点类型
  translateType: string; // 翻译类型
  nodeWidth: number; // 节点宽度
  nodeHeight: number; // 节点高度
  label: {
    en_us: string;
    zh_cn: string;
  }; // 标题中文名称
  name: string; // 标题英文名称
  img: string; // 节点icon图标
  data: NodeConfigData<T>;
} & NodeConfig

// 翻译有关字段存在这里
export type NodeConfigData<T extends NodeConfigDataUnion = {}> = T extends infer U
  ? U & {
      anchors: AnchorBaseConfig_DTS[];
      _origin_node_id?: string;
      _origin_anchor_index?: number;
      [key: string]: any;
    }
  : never;

export interface IPositon {
  x: number;
  y: number;
}

export interface LogicTransferData {
  type: BlockNames_DTS;
  model: string;
}

export type AnchorBaseConfigWithPosition = [number, number, AnchorBaseConfig_DTS];

export interface AddEdgeOptions {
  source: INode;
  target: INode;
  sourceAnchor: number;
  targetAnchor: number;
  coercive?: boolean
}

export interface GraphEventMap {
  eventName: string;
  callback: (e: IG6GraphEvent | any) => void | Promise<void>;
}
