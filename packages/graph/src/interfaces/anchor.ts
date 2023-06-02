import { Schema } from "./schema";

/**
 * 锚点类型
 */
export enum AnchorTag {
  /**
   * 输入
   */
  STATEMENT_INPUT = 'statement_input',
  /**
   * 输出
   */
  STATEMENT_OUTPUT = 'statement_output',
  /**
   * 入参
   */
  VAR_INPUT = 'var_input',
  /**
   * 出参
   */
  VAR_OUTPUT = 'var_output',
}

/**
 * 所有锚点
 */
export type Anchor = AnchorVarInput
  | AnchorStatementInput
  | AnchorStatementOutput
  | AnchorVarOutput;


export interface AnchorBase {
  tag: AnchorTag;
  index: number;
  nodeId: string;
  connected: boolean; // 是否被链接
}

export interface AnchorStatementInput extends AnchorBase {
  tag: AnchorTag.STATEMENT_INPUT,
  data: {
    label: string;
  }
}

export interface AnchorStatementOutput extends AnchorBase {
  tag: AnchorTag.STATEMENT_OUTPUT,
  data: {
    name: string;
    label: string;
  }
}

export interface AnchorVarInput extends AnchorBase {
  tag: AnchorTag.VAR_INPUT,
  data: {
    label: string;
    value: string;
    schema: Schema;
  }
}

export interface AnchorVarOutput extends AnchorBase {
  tag: AnchorTag.VAR_OUTPUT,
  data: {
    name: string;
    label: string;
    schema: Schema;
  }
}
