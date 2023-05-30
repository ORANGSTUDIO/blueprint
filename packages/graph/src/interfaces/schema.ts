import { JSONSchema4, JSONSchema4TypeName } from 'json-schema';

export interface Schema extends JSONSchema4 {
  /**
   * 生成的类名
   */
  className?: string;
}

export type SchemaType = JSONSchema4TypeName;
