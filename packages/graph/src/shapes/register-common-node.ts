import G6, { IGroup, NodeConfig, ShapeOptions } from "@antv/g6";
import { AnchorBaseConfigWithPosition, AnchorTag, IIGroup, IModelConfig, INodeConfig, IShapeOptions } from "../interfaces";
import { AnchorTag_DTS, BlockNames_DTS } from "../interfaces/service";
import getImgByType from "../utils/getImgByType";

import helpSvg from '../assets/imgs/help.svg';
import circleSmSvg from '../assets/imgs/circle-sm.svg';
import { getStatementSvg } from "../utils/getStatementSvg";
import ensureHTTPS from "../utils/ensureHTTPS";


export interface LogicNodeRecord {
  name: string; // varchar(100) []	名称
  label: string; // 标签
  cover: string; // 封面
  intro: string; // varchar(100) []	介绍
}

export default function registerCommonNode(record: LogicNodeRecord): void {
  const { name, label, cover, intro } = record;
  const nodeDefinition: IShapeOptions = {
    itemType: name,

    calcNodeHeight(cfg?: NodeConfig, group?: IGroup) {
      if (!cfg) {
        throw new Error('no cfg')
      }

      if (!group) {
        throw new Error('no group')
      }
      // 节点默认的初始宽高
      cfg.nodeWidth = 210;
      cfg.nodeHeight = 134;

      if (!this.getAnchorPoints) {
        throw new Error('no getAnchorPoints')
      }

      const anchors = this.getAnchorPoints(cfg);

      if (!anchors) {
        throw new Error('no anchors')
      }

      const leftLength = anchors.filter(
        (anchor: AnchorBaseConfigWithPosition) =>
          anchor[2].tag === AnchorTag_DTS.VAR_INPUT || anchor[2].tag === AnchorTag_DTS.STATEMENT_INPUT,
      ).length;
      const maxLength = Math.max(leftLength, anchors.length - leftLength);

      // 计算宽度
      const titleSize = 0;
      cfg.nodeWidth = titleSize < 9 ? 210 : 210 + (titleSize - 8) * 16;

      const widthList: number[] = [];
      const index = {
        left: 0,
        right: 0,
      };
      [
        { tag: AnchorTag_DTS.STATEMENT_INPUT, pos: 'left' },
        { tag: AnchorTag_DTS.STATEMENT_OUTPUT, pos: 'right' },
        { tag: AnchorTag_DTS.VAR_INPUT, pos: 'left' },
        { tag: AnchorTag_DTS.VAR_OUTPUT, pos: 'right' },
      ].forEach((config) => {
        anchors
          .filter((a) => a[2].tag === config.tag)
          .forEach((anchor) => {
            const text = group.addShape('text', {
              attrs: {
                x: 0,
                y: 0,
                text: anchor[2].data.label,
                fill: 'black',
                fontSize: 12,
                lineHeight: 20,
                opacity: 0,
                textBaseline: 'middle',
                textAlign: 'start',
              },
              draggable: true,
              name: 'title',
            });
            if (!widthList[index[config.pos]]) {
              widthList[index[config.pos]] = 0;
            }
            widthList[index[config.pos]] += text.getBBox().width;
            index[config.pos]++;
            text.remove();
          });
      });

      cfg.nodeWidth = Math.max(90, ...widthList) + 120;

      // 计算高度
      if (maxLength < 3) {
        cfg.nodeHeight = 44 + 3 * 30;
      } else {
        cfg.nodeHeight = 44 + (maxLength + 1) * 30;
      }
    },

    /**
     * 渲染视图
     * @param cfg
     * @param group
     */
    assembleShape(cfg?: INodeConfig, group?: IIGroup) {
      if (!cfg) {
        throw new Error('no cfg')
      }

      if (!group) {
        throw new Error('no group')
      }

      const offsetX = -cfg.nodeWidth / 2;
      const offsetY = -cfg.nodeHeight / 2;
      const textOffset = cfg.nodeWidth - 210;

      // Topbar
      // 标题背景框
      group.addShape('rect', {
        attrs: {
          x: offsetX + 1,
          y: offsetY + 1,
          width: cfg.nodeWidth - 2,
          height: 44,
          fill: '#F2F8FF',
          cursor: 'move',
          radius: [12, 12, 0, 0],
        },
        name: 'title-container',
        draggable: true,
      });

      group.addShape('image', {
        attrs: {
          x: offsetX + 17,
          y: offsetY + 13,
          width: 20,
          height: 20,
          img: ensureHTTPS(cover),
          cursor: 'pointer',
        },
        name: 'icon',
      });

      // 节点的标题
      group.addShape('text', {
        attrs: {
          x: offsetX + 48,
          y: offsetY + 22,
          fontSize: 14,
          lineHeight: 20,
          text: (cfg.label || cfg.data.label || label),
          fill: 'rgba(0,0,0,.85)',
          fontWeight: 'bolder',
          textBaseline: 'middle',
          textAlign: 'start',
          cursor: 'move',
        },
        draggable: true,
        name: 'title',
      });

      const helpText = intro;

      if (helpText) {
        group.addShape('image', {
          attrs: {
            x: offsetX + 177 + textOffset,
            y: offsetY + 14,
            width: 16,
            height: 16,
            img: helpSvg,
            cursor: 'pointer',
          },
          name: 'right-help',
        });
      }

      // 动态获取锚点
      const anchorConfigs = this.getAnchorPoints(cfg) as AnchorBaseConfigWithPosition[];

      const statementInputAnchors = anchorConfigs.filter(
        (anchor) => anchor[2].tag === AnchorTag_DTS.STATEMENT_INPUT,
      );

      if (statementInputAnchors.length) {
        statementInputAnchors.forEach((anchor, i) => {
          const {
            index,
            connected,
            data: { label },
          } = anchor[2];
          // 逻辑流程的输入
          group.addShape('text', {
            attrs: {
              x: offsetX + 40,
              y: offsetY + 44 + 30 * (i + 1),
              text: label,
              fill: 'black',
              fontSize: 12,
              lineHeight: 20,
              opacity: 0.85,
              textBaseline: 'middle',
              textAlign: 'start',
              cursor: 'pointer',
            },
            name: 'statement-input-title',
          });

          group.addShape('image', {
            attrs: {
              x: offsetX + 19,
              y: offsetY + 44 + 30 * (i + 1) - 8,
              width: 16,
              height: 16,
              img: getStatementSvg(connected),
              cursor: 'pointer',
            },
            anchorTag: AnchorTag.STATEMENT_INPUT,
            anchorIndex: index,
            name: 'statement-input-img',
          });
        });
      }

      // 流程输出
      const statementOutputAnchors = anchorConfigs.filter(
        (anchor) => anchor[2].tag === AnchorTag_DTS.STATEMENT_OUTPUT,
      );

      if (statementOutputAnchors.length) {
        statementOutputAnchors.forEach((anchor, i) => {
          const {
            index,
            connected,
            data: { label, name },
          } = anchor[2];

          group.addShape('text', {
            attrs: {
              x: offsetX + 175 + textOffset,
              y: offsetY + 44 + 30 * (i + 1),
              text: label,
              fill: 'black',
              fontSize: 12,
              lineHeight: 20,
              opacity: 0.85,
              textBaseline: 'middle',
              textAlign: 'end',
              cursor: 'pointer',
            },
            name: 'statement-output-title',
          });

          group.addShape('image', {
            attrs: {
              x: offsetX + 180 + textOffset,
              y: offsetY + 44 + 30 * (i + 1) - 8,
              width: 16,
              height: 16,
              img: getStatementSvg(connected),
              cursor: 'pointer',
            },
            anchorTag: AnchorTag.STATEMENT_OUTPUT,
            anchorIndex: index,
            anchorName: name,
            name: 'statement-output-img',
          });
        });
      }
      // 参数输入
      const variableInputAnchors = anchorConfigs.filter((anchor) => anchor[2].tag === AnchorTag_DTS.VAR_INPUT);

      if (variableInputAnchors && variableInputAnchors.length) {
        _.forEach(variableInputAnchors, (anchor, order) => {
          const {
            index,
            connected,
            data: { label, type, value, schema },
          } = anchor[2];

          group.addShape('image', {
            attrs: {
              x: offsetX + 20,
              y: offsetY + 44 + (statementInputAnchors.length + order + 1) * 30 - 8,
              width: 14,
              height: 14,
              img: getImgByType(schema ? schema.type : type, 'in', !!connected),
              cursor: 'pointer',
              anchor_index: index,
            },
            anchorTag: AnchorTag.VAR_INPUT,
            anchorIndex: index,
            anchorName: name,
            name: 'variable-input-img',
          });

          const text = label;

          const variableInputText = group.addShape('text', {
            attrs: {
              x: offsetX + 40,
              y: offsetY + 44 + (statementInputAnchors.length + order + 1) * 30,
              text,
              fill: 'black',
              fontSize: 12,
              lineHeight: 20,
              opacity: 0.85,
              textBaseline: 'middle',
              textAlign: 'start',
              cursor: 'pointer',
              anchor_index: index,
            },
            name: 'variable-input-text',
            anchorName: name,
          });

          // 使用常量显示的小圆点
          group.addShape('image', {
            attrs: {
              x: offsetX + 40 + variableInputText.getBBox().width + 6,
              y: offsetY + 44 + (statementInputAnchors.length + order + 1) * 30 - 4,
              width: 6,
              height: 6,
              opacity: value ? 1 : 0,
              img: circleSmSvg,
              cursor: 'pointer',
            },
            anchorIndex: index,
            name: 'badge',
          });
        });
      }

      // 参数输出
      const variableOutputAnchors = anchorConfigs.filter((anchor) => anchor[2].tag === AnchorTag_DTS.VAR_OUTPUT);

      if (variableOutputAnchors && variableOutputAnchors.length) {
        _.forEach(variableOutputAnchors, (anchor, order) => {
          const {
            index,
            connected,
            data: { label, name, type, schema },
          } = anchor[2];

          group.addShape('image', {
            attrs: {
              x: offsetX + 180 + textOffset,
              y: offsetY + 44 + (statementOutputAnchors.length + order + 1) * 30 - 8,
              width: 14,
              height: 14,
              img: getImgByType(schema ? schema.type : type, 'out', !!connected),
              cursor: 'pointer',
              anchor_index: index,
            },
            anchorTag: AnchorTag.VAR_OUTPUT,
            anchorIndex: index,
            anchorName: name,
            name: 'variable-output-img',
          });

          group.addShape('text', {
            attrs: {
              x: offsetX + 176 + textOffset,
              y: offsetY + 44 + (statementOutputAnchors.length + order + 1) * 30,
              text: label,
              fill: 'black',
              fontSize: 12,
              lineHeight: 20,
              opacity: 0.85,
              textBaseline: 'middle',
              textAlign: 'end',
              cursor: 'pointer',
              anchor_index: index,
            },
            anchorIndex: index,
            anchorName: name,
            name: 'variable-output-text',
          });
        });
      }

      group.sort();
    },

    getAnchorPoints(cfg?: IModelConfig): AnchorBaseConfigWithPosition[] {
      if (!cfg) {
        throw new Error('no cfg')
      }
      // 这部分的逻辑根据后台返回的数据配置(getConfig)
      const nodeConfigData = cfg.data;
      const anchors = nodeConfigData.anchors;

      let leftIndex = 0;
      let rightIndex = 0;

      if (!anchors) {
        throw new Error('no anchors')
      }

      return anchors.map((anchor) => {
        if (anchor.tag === AnchorTag_DTS.STATEMENT_INPUT || anchor.tag === AnchorTag_DTS.VAR_INPUT) {
          return [0, (74 + leftIndex++ * 30) / cfg.nodeHeight, anchor];
        } else {
          return [1, (74 + rightIndex++ * 30) / cfg.nodeHeight, anchor];
        }
      });
    },
  };

  G6.registerNode(name, nodeDefinition, BlockNames_DTS.LOGIC_BASE_NODE);
}

export function registerCommonNodes() {
  registerCommonNode({
    name: 'logic-start-node',
    label: 'label',
    cover: 'cover',
    intro: 'intro',
  });
}



