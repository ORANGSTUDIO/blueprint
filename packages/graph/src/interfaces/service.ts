import { EdgeConfig } from '@antv/g6';
import { AnchorTag, INodeConfig, MessageType } from './index';
import { Schema } from './schema';

export type ParamsOptional_PT<T> = {
  [p in keyof T]?: T[p];
};

export type LooseObject_DTS = {
  [key: string]: any;
};

/**
 * 所有的逻辑块
 */
export enum BlockNames_DTS {
  LOGIC_BASE_NODE = 'logic-base-node', // BASE
  LOGIC_TRY_CATCH_NODE = 'logic-try-catch-node', // try catch块
  LOGIC_START_NODE = 'logic-start-node', // 开始块
  LOGIC_END_NODE = 'logic-end-node', // 结束块
  LOGIC_LIFECYCLE_NODE = 'logic-lifecycle-node', // 生命周期
  LOGIC_FUNC_NODE = 'logic-func-node', // 自定义函数
  LOGIC_BACKEND_FUNC_NODE = 'logic-backend-func-node', // 自定义函数
  LOGIC_API_NODE = 'logic-api-node', // 调用API
  LOGIC_LIBRARY_FUNC_NODE = 'logic-library-func-node', // 库方法
  LOGIC_NET_NODE = 'logic-net-node', // 网络请求
  LOGIC_MESSAGE_NODE = 'logic-message-node', // 消息提醒
  LOGIC_IFELSE_NODE = 'logic-ifelse-node', // 如果否则
  LOGIC_ROUTER_NODE = 'logic-router-node', // 路由跳转
  LOGIC_ARRAY_FOREACH_NODE = 'logic-array-foreach-node', // 数组循环
  LOGIC_SET_ARRAY_ITEM_NODE = 'logic-set-array-item-node', // 设置数组项
  LOGIC_CALC_NODE = 'logic-calc-node', // 计算
  LOGIC_ASSIGN_NODE = 'logic-assign-node', // 赋值

  LOGIC_SIDE_MESSAGE_NODE = 'logic-side-message-node', // 侧边提醒
  LOGIC_PAGE_PASS_VALUE_NODE = 'logic-page-pass-value-node', // 页面传值
  LOGIC_GET_LOCALE_NODE = 'logic-get-locale-node', // 获取多语言
  LOGIC_SET_LOCALE_NODE = 'logic-set-locale-node', // 设置多语言
  LOGIC_METHOD_REF_NODE = 'logic-method-ref-node', // 获取方法引用
  LOGIC_NEXT_TICK_NODE = 'logic-next-tick-node', // 下次渲染结束执行

  LOGIC_VARIABLE_DETIAL_NODE = 'logic-variable-detail-node', // 变量详情
  LOGIC_STRING_NODE = 'logic-string-node', // 变量（字符串）
  LOGIC_BOOLEAN_NODE = 'logic-boolean-node', // 变量（布尔值）
  LOGIC_NUMBER_NODE = 'logic-number-node', // 变量（数字）
  LOGIC_ARRAY_NODE = 'logic-array-node', // 变量（数组）
  LOGIC_OBJECT_NODE = 'logic-object-node', // 变量（对象）

  LOGIC_INTEGER_NODE = 'logic-integer-node', // 整型变量

  LOGIC_CREATE_OBJECT_NODE = 'logic-create-object-node', // 构造对象

  LOGIC_EQUAL_NODE = 'logic-equal-node', // 等于
  LOGIC_NOT_EQUAL_NODE = 'logic-not-equal-node', // 不等于
  LOGIC_LESS_NODE = 'logic-less-node', // 小于
  LOGIC_GREATER_NODE = 'logic-greater-node', // 大于
  LOGIC_LESS_EQUAL_NODE = 'logic-less-equal-node', // 小于等于
  LOGIC_GREATER_EQUAL_NODE = 'logic-greater-equal-node', // 大于等于

  LOGIC_NEGATION_NODE = 'logic-negation-node', // 逻辑取反
  LOGIC_AND_NODE = 'logic-and-node', // 逻辑与
  LOGIC_OR_NODE = 'logic-or-node', // 逻辑或
  LOGIC_FULL_EQUAL_NODE = 'logic-full-equal-node', // 相等
  LOGIC_NOT_FULL_EQUAL_NODE = 'logic-not-full-equal-node', // 不相等

  LOGIC_ADDITION_NODE = 'logic-addition-node', // 加法
  LOGIC_SUBTRACTION_NODE = 'logic-subtraction-node', // 减法
  LOGIC_MULTIPLICATION_NODE = 'logic-multiplication-node', // 乘法
  LOGIC_DIVISION_NODE = 'logic-division-node', // 除法
  LOGIC_REMAINDER_NODE = 'logic-remainder-node', //取余

  LOGIC_STRING_CONCAT_NODE = 'logic-string-concat-node', // 连接文本
  LOGIC_AI_NODE = 'logic-ai-node', // ai方法

  LOGIC_SET_TIMEOUT_NODE = 'logic-set-timeout-node', // 延迟调用
  LOGIC_SET_INTERVAL_NODE = 'logic-set-interval-node', // 周期调用

  LOGIC_FORM_VALIDATION = 'logic-form-validation', // 表单校验
  LOGIC_FORM_RESET = 'logic-form-reset', // 表单重置

  // 数据模型
  LOGIC_DATA_MODEL_ADD = 'logic-data-model-add',
  LOGIC_DATA_MODEL_QUERY = 'logic-data-model-query',
  LOGIC_DATA_MODEL_DELETE = 'logic-data-model-delete',
  LOGIC_DATA_MODEL_QUERY_LIST = 'logic-data-model-query-list',
  LOGIC_DATA_MODEL_UPDATE = 'logic-data-model-update',

  // 审批流
  LOGIC_MISSION_ALL = 'logic-mission-all',
  LOGIC_MISSION_GET = 'logic-mession-get',
  LOGIC_PROCESS_INS_LIST = 'logic-process-ins-list',
  LOGIC_MISSION_PASS = 'logic-mission-pass',
  LOGIC_MISSION_REJECT = 'logic-mission-reject',
  LOGIC_MISSION_STOP = 'logic-mission-stop',
  LOGIC_MISSION_ADD_MULTI = 'logic-mission-add-multi',

  // 数组
  LOGIC_ARRAY_PUSH_NODE = 'logic-array-push',
  LOGIC_ARRAY_GET_NODE = 'logic-array-get',

  // 日志
  LOGIC_CONSOLE_NODE = 'logic-console-node',

  // 正则测试
  LOGIC_REGEX_TEST_NODE = 'logic-regex-test-node',
}



/**
 * 支线任务
 */
export enum SideQuests_DTS {
  TRY_SYNTAX = 'try_syntax', // 【try catch语句】try函数块
  CATCH_SYNTAX = 'catch_syntax', // 【try catch语句】catch函数块
  FOREACH_BODY_SYNTAX = 'foreach_body_syntax', // 【foreach 语句】循环体
  IFELSE_DO = 'IFELSE_DO', // if-else DO
  IFELSE_ELSE = 'IFELSE_ELSE', // if-else else
  NEXT_TICK = 'NEXT_TICK', // $nextTick
  FUNCTION = 'function', // setTimeout
  SUCCESS = 'success',
  FAIL = 'fail',
}

/**
 * 使用常量或者变量
 */
export enum ConstOrVariable_DTS {
  USE_CONST = 'useConst',
  USE_VARIABLE = 'useVariable',
}

/**
 * 仅仅用做标识，用于逻辑判断
 */
export enum DescInfo_DTS {
  RETURN_VALUE = 'RETURN_VALUE', // 返回值

  ARRAY_FOREACH_SOURCE = 'ARRAY_FOREACH_SOURCE', // 数组循环的数据源
  ARRAY_FOREACH_ITEM = 'ARRAY_FOREACH_ITEM', // 数组循环的 项
  ARRAY_FOREACH_INDEX = 'ARRAY_FOREACH_INDEX', // 数组循环的 索引
  /**
   * 数组
   */
  ARRAY = 'ARRAY',
  /**
   * 数组 项
   */
  ARRAY_ITEM = 'ARRAY_ITEM',
  /**
   * 数组 索引
   */
  ARRAY_INDEX = 'ARRAY_INDEX',
  IFELSE_IF = 'IFELSE_IF', // if-else 判断
  /**
   * 变量
   */
  VARIABLE = 'VARIABLE',
  /**
   * 值
   */
  VALUE = 'VALUE',

  NETWORK_REQUEST_START = 'NETWORK_REQUEST_START', // 网络请求发起方
  NETWORK_REQUEST_METHOD = 'NETWORK_REQUEST_METHOD', // 网络请求方式：get/post等
  NETWORK_REQUEST_URL = 'NETWORK_REQUEST_URL', // 网络请求地址
  NETWORK_REQUEST_PARAMS = 'NETWORK_REQUEST_PARAMS', // 网络请求参数
  NETWORK_REQUEST_HEADER = 'NETWORK_REQUEST_HEADER', // 网络请求头
  NETWORK_REQUEST_STACK = 'NETWORK_REQUEST_STACK', // 网络请求堆栈

  ROUTER_PARAMS = 'ROUTER_PARAMS', // 页面跳转-param参数
  ROUTER_QUERY = 'ROUTER_QUERY', // 页面跳转-query参数

  CURRENT_LANGUAGE = 'CURRENT_LANGUAGE', // 多语言类型
}

/**
 * 锚点配置
 */
export interface AnchorBaseConfig_DTS {
  nodeId: string;
  tag: AnchorTag;
  index: number; // 锚点位置
  data: {
    _desc?: DescInfo_DTS;
    _sideQuests?: SideQuests_DTS; // 支线任务（举例：try-catch 或者 循环 等）
    _isExit?: boolean; // 输出点（查找主流程函数，从‘开始-输出’-> '函数-输入'-> ‘函数-输出’ -> '结束-结束'）
    _isEntry?: boolean; // 输入点
    _route_path?: string; // 对象： 'varId.key1.key2'  数组：'varId.0.key1'
    _origin_node_id?: string; // 源节点id，目前在数组循环中的项展开使用
    _origin_anchor_index?: number; // 源节点的锚点

    value?: any;
    constOrVariable?: ConstOrVariable_DTS; // 使用常量或者变量
    uuids?: any[];
    tag?: AnchorTag;
    label?: string | any; // 中文描述
    name?: string; // 变量方法名（供Blockly使用）
    type?: string; //  连线判断
    schema?: Schema | any;

    messageType?: MessageType; // 消息提醒块的消息类型
    [key: string]: any;
  };

  connected?: boolean;
  selected?: boolean;
}

export type AnchorBaseConfig_DataField_PK = Pick<AnchorBaseConfig_DTS, 'data'>;

/**
 * 块定义
 */
export interface LogicBlockBaseTplMap_DTS {
  [logicBlock: string]: {
    label: string; // 块描述信息
    anchors: {
      [anchorIndex: string]: AnchorBaseConfig_DTS;
    };
  };
}

/**
 * 锚点内部type
 */
export enum AnchorType_DTS {
  Function = 'function',
  String = 'string',
  Number = 'number',
  Object = 'object',
  Undefined = 'undefined',
  Array = 'array',
}

/**
 *  锚点关联的节点信息
 */
export interface ConnectedNodeInfo_DTS {
  connnectedAnchorIndex: string;
  edge: EdgeConfig;
  sourceNode: INodeConfig; // 依赖节点：连线的起点
  targetNode: INodeConfig; // 当前节点：连线的结束点
}

export type MapFromAnchorToSourceNode_DTS = {
  [anchorIndex: string]: ConnectedNodeInfo_DTS;
};

/**
 * 作用域节点关系
 */
export interface ScopeNode_DTS {
  children: ScopeNode_DTS[];
  parentNodeId: string;
  nodeId: string;
  type: BlockNames_DTS; // 当前块类型
  methodInfo: MethodWorkFlow_DTS;
}

export interface MethodWorkFlow_DTS {
  nodeId: string; // 当前块id
  type: BlockNames_DTS; // 当前块类型

  /**
   * 锚点关联的块
   * PS: 只记录一个节点（当前的锚点是结束锚点，也就是入参依赖的时候，溯源查找，所以只会有一条边，一个块符合）
   */
  map_FromAnchorToSourceNode: MapFromAnchorToSourceNode_DTS;

  /**
   * 支线任务（try-catch 块等等）
   */
  sideQuests: {
    /**
     * 这里是二维数组，为了支持 重复 的语法，类似 if-else
     */
    [key in SideQuests_DTS]?: Array<MethodWorkFlow_DTS[]>;
  };

  // 以下都是调试属性，仅在开发发环境使用
  // $__currentNode: INodeConfig;
  // $__entryNodeId: string; // 上一步的块
  // $__exitNodeId: string; // 下一步的块
}

/**
 * 缓存：查询表
 */
export interface LogicCache_DTS {
  /**
   * 图表块
   */
  nodes: {
    [NodeId: string]: INodeConfig;
  };
  /**
   * 图表边线
   */
  edges: {
    [EdgeId: string]: EdgeConfig;
  };
  /**
   * 块+锚点 查找关联的 边
   */
  nodeAnchorToEdgeMap: {
    [NodeId_AnchorIndex: string]: EdgeConfig;
  };
}

export interface InitTranslateQuery_DTS {
  methodWorkFlow: MethodWorkFlow_DTS[];
  rootMethodId?: string;
}

// export interface CacheInstance_DTS {
//   /**
//    * 内部缓存
//    */
//   logicCache: LogicCache_DTS;
//   /**
//    * 图表数据
//    */
//   graphData: GraphData;

//   getNode_FromCache: (nodeId: string) => INodeConfig;
//   getRelatedEdgeWithNodeAnchor_FromCache: (
//     nodeId: string,
//     anchorIndex: number,
//     currentAnchorIsSource: boolean,
//   ) => EdgeConfig;
//   getEdge_FromCache: (edgeId: string) => EdgeConfig;
// }

/**
 * 最小块的翻译参数
 */
export interface TranslateNodeParams_DTS {
  method: MethodWorkFlow_DTS;
}

/**
 * 变量存储
 */
export interface AllVarOutputMap_DTS {
  [nodeId: string]: {
    // 锚点存储的变量
    [anchor_index: string]: string[];
  };
}

/**
 * 节点作用域
 */
export interface ScopeQueryCache_DTS {
  [nodeId: string]: {
    parentList: string[];
    sonList: string[];
  };
}

/**
 * 连线错误类型
 */
export enum EdgeError_DTS {
  SCOPE = 'SCOPE', // 变量作用域错误
}

/**
 * 翻译中的非法信息（包含边edge 等）
 */
export interface TranslateError_DTS {
  edge: string; // edge 边ID
  errorType: EdgeError_DTS; // edge错误分类

  [otherInfo: string]: any;
}
