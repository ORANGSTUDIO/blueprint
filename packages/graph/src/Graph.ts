import G6, { EdgeConfig, Graph as G6Graph, GraphData, IG6GraphEvent, INode, Item, ShapeStyle, StateStyles, UpdateType } from "@antv/g6";
import { GraphEventMap, GraphOptions, INodeConfig, AnchorTag, AddEdgeOptions } from "./interfaces";
import _ from 'lodash';
import registerFactory from "./register-factory";
import { AnchorBaseConfig_DTS, ConstOrVariable_DTS } from './interfaces/service';
import getImgByType from "./utils/getImgByType";
import { DEFAULT_STYLES, LOGIC_STATEMENT_EDGE, LOGIC_VARIABLE_EDGE } from "./consts";
import { getEgdeStyle } from "./utils/getEgdeStyle";
import { SchemaType } from "./interfaces/schema";
import Action from "./Action";
import DragNodeAction from "./actions/DragNodeAction";

registerFactory(G6);
export default class Graph {
  private graph: G6Graph;
  private static commonNodes: Array<(g6: typeof G6) => void> = [];
  private actions: Action[] = [];

  constructor(options: GraphOptions) {
    this.graph = this.initGraph(options);
    this.initActions();
  }

  private initActions() {
    this.actions = [
      new DragNodeAction(this)
    ]

    this.actions.forEach(action => {
      G6.registerBehavior(action.name, action.behaviorOption())
    })
  }

  /**
   * 更新图数据
   * @param data 绘图数据
   */
  public updateGraphData(graphData: GraphData) {
    this.graph.clear();
    this.graph.data(graphData);
    this.graph.render();
  }

  /**
   * 添加边
   * @param options
   * @returns
   */
  public addEdge(options: AddEdgeOptions) {
    const { source, target, sourceAnchor, targetAnchor, coercive } = options;

    const sourceData = (source.getModel() as INodeConfig).data
    const targetData = (target.getModel() as INodeConfig).data

    if (!sourceData || !targetData) {
      return
    }

    const sourceAnchorData = sourceData.anchors[sourceAnchor] as AnchorBaseConfig_DTS;
    const targetAnchorData = targetData.anchors[targetAnchor] as AnchorBaseConfig_DTS;
    const souceDataType = _.get(sourceAnchorData, 'data.schema.type') || sourceAnchorData.data.type;
    const isStatement = sourceAnchorData.tag === AnchorTag.STATEMENT_OUTPUT;

    if (!isStatement && targetAnchorData.data.constOrVariable) {
      targetAnchorData.data.constOrVariable = ConstOrVariable_DTS.USE_VARIABLE;
    }

    this.graph.addItem(
      'edge',
      this.createEdgeModel(
        {
          type: isStatement ? LOGIC_STATEMENT_EDGE : LOGIC_VARIABLE_EDGE,
          id: `${+new Date() + (Math.random() * 10000).toFixed(0)}`,
          source: (source as any).get('id'),
          target: target.get('id'),
          sourceAnchor: sourceAnchor as number,
          targetAnchor: targetAnchor as number,
          varType: souceDataType,
          coercive,
        },
        isStatement,
      ),
      true,
    );

    const sourceCfg = source.getModel() as INodeConfig;
    const sourceCfgData = sourceCfg.data;
    const targetCfg = target.getModel() as INodeConfig;
    const targetCfgData = targetCfg.data;

    if (!sourceCfgData || !targetCfgData) {
      return
    }
    sourceCfgData.anchors[sourceAnchor].connected = true;
    targetCfgData.anchors[targetAnchor].connected = true;
    source.update(sourceCfg);
    target.update(targetCfg);
  }

  private createEdgeModel(
    cfg: {
      type?: string;
      id?: string;
      source: string;
      target: string;
      sourceAnchor: number;
      targetAnchor: number;
      style?: ShapeStyle;
      stateStyles?: StateStyles;
      varType: SchemaType;
      coercive?: boolean;
    },
    isStatement = true,
  ): EdgeConfig {
    const { type, id, source, target, sourceAnchor, targetAnchor, style, stateStyles, varType, coercive = false } = cfg;
    const defalutStyle = getEgdeStyle(isStatement, varType);
    return {
      type: type || LOGIC_VARIABLE_EDGE,
      id: id || `${+new Date() + (Math.random() * 10000).toFixed(0)}`, // edge id
      source,
      target,
      sourceAnchor,
      targetAnchor,
      style: style || defalutStyle,
      stateStyles: stateStyles || {
        'edgeState:default': {
          ...(style || defalutStyle),
        },
        'edgeState:selected': {
          ...(style || defalutStyle),
        },
        'edgeState:hover': {
          ...(style || defalutStyle),
        },
        // 'edgeState:preselection': {
        //   radius: 6,
        //   offset: -15,
        //   lineWidth: 3,
        //   stroke: '#f00',
        //   lineAppendWidth: 10, // 防止线太细没法点中
        //   endArrow: null,
        // },
      },
      data: {
        varType,
        coercive,
      },
    } as EdgeConfig;
  }


  private initGraph(options: GraphOptions) {
    const { container } = options;

    if (!container) {
      throw Error('缺少 container 字段！');
    }

    const [width, height] = [container.scrollWidth, container.scrollHeight];

    Graph.commonNodes.forEach((i) => i(G6));

    const { nodeStateStyles } = DEFAULT_STYLES;

    const mergedOptions: GraphOptions = _.merge(
      {},
      {
        width,
        height,
        workerEnabled: true, // 是否启用 webworker
        gpuEnabled: true, // 开启GPU
        enabledStack: true,
        container,
        modes: {
          default: [
            'drag-canvas',
            'drag-shadow-node',
            'canvas-event',
            'delete-item',
            'select-node',
            'hover-node',
            'active-edge',
            {
              type: 'scroll-container',
              zoomKey: ['control', 'meta'],
              // g6 源码有bug，不支持数组
              // zoomKey: /windows|win32/i.test(navigator.userAgent) ? 'ctrl' : 'meta',
            },
          ],
          originDrag: [
            'drag-canvas',
            'drag-node',
            'canvas-event',
            'delete-item',
            'select-node',
            'hover-node',
            'active-edge',
          ],
        },
        nodeStateStyles,
        layout: {
          gpuEnabled: true,
        },
      },
      options,
    );

    return (this.graph = new G6.Graph(mergedOptions));
  }

  public destory() {
    this.actions = [];
    this.graph.clear();
    this.graph.destroy();
    // this.graph = null;
  }

  public getNodeById(id: string) {
    return this.graph.findById(id);
  }

  public updateAnchorIndex(cfg: INodeConfig, node: INode) {
    if (!cfg.data) {
      return
    }

    // 更新锚点的index，删除被删除锚点的线
    const result: {
      [index: number]: number
    } = {}
    const indexMap: any = cfg.data.anchors.reduce((result, anchor) => {
      result[anchor.index] = 1;
      return result;
    }, result);
    node.getInEdges().forEach((edge) => {
      const targetAnchorIndex = edge.getModel().targetAnchor as number;
      if (!indexMap[targetAnchorIndex]) {
        this.graph.remove(edge.getID());
      }
    });
    node.getOutEdges().forEach((edge) => {
      const sourceAnchorIndex = edge.getModel().sourceAnchor as number;
      if (!indexMap[sourceAnchorIndex]) {
        this.graph.remove(edge.getID());
      }
    });
    cfg.data.anchors.forEach((anchor, index) => {
      anchor.index = index;
    });
  }

  // public nodeUpdate(cfg: INodeConfig<any>, node: INode, updateType?: UpdateType) {
  //   if (updateType === 'bbox') {
  //     node.draw();
  //     // this.graph.changeData();
  //     this.updateAnchorIndex(cfg, node);
  //     return;
  //   }

  //   const model = node.get('model');
  //   const { attrs } = node.get('keyShape');
  //   const group = node.get('group');
  //   const item = group.get('children')[0];
  //   item.attr({ ...attrs, ...model.style });
  //   // 锚点被链接后需要变成实心
  //   const children = group.get('children');
  //   const anchorImgs: Item[] = children.filter((item: Item) =>
  //     [AnchorTag.STATEMENT_OUTPUT, AnchorTag.STATEMENT_INPUT, AnchorTag.VAR_INPUT, AnchorTag.VAR_OUTPUT].includes(
  //       item.get('anchorTag'),
  //     ),
  //   );

  //   anchorImgs.forEach((imgShape) => {
  //     const anchorIndex = imgShape.get('anchorIndex');
  //     if (cfg.data.anchors[anchorIndex]) {
  //       const {
  //         connected = false,
  //         tag,
  //         data: { type, schema },
  //       } = cfg.data.anchors[anchorIndex];

  //       if ([AnchorTag.STATEMENT_OUTPUT, AnchorTag.STATEMENT_INPUT].includes(tag)) {
  //         imgShape.attr({
  //           // img: require(`./img/statement_anchor${connected ? '' : '_light'}.svg`),
  //           img: 'Graph 147',
  //         });
  //       } else {
  //         imgShape.attr({
  //           img: getImgByType(schema.type || type, AnchorTag.VAR_INPUT === tag ? 'in' : 'out', connected).src,
  //         });
  //       }
  //     } else {
  //       console.warn('找不到该锚点!');
  //     }
  //   });

  //   const badges: Item[] = children.filter((item: Item) => item.get('name') === 'badge');
  //   badges.forEach((badge) => {
  //     const anchorIndex = badge.get('anchorIndex');
  //     if (cfg.data.anchors[anchorIndex]) {
  //       const {
  //         data: { constOrVariable = ConstOrVariable_DTS.USE_VARIABLE, value },
  //       } = cfg.data.anchors[anchorIndex];
  //       badge.attr('opacity', constOrVariable !== ConstOrVariable_DTS.USE_VARIABLE || value ? 1 : 0);
  //     }
  //   });
  //   this.updateAnchorIndex(cfg, node);
  // }

  // public registerEvents(event: GraphEventMap[]);
  // public registerEvents(event: string, callback: (e: IG6GraphEvent) => void);
  // public registerEvents(event: string | GraphEventMap[], callback?: (e: IG6GraphEvent) => void) {
  //   if (Array.isArray(event)) {
  //     _.forEach(event, (ev: GraphEventMap) => {
  //       this.graph.on(ev.eventName, ev.callback);
  //     });
  //   } else {
  //     if (callback) {
  //       this.graph.on(event, callback);
  //     }
  //   }
  // }
}
