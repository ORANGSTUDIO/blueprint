import { Graph } from "@antv/g6";

export type BehaviorOptionThis<T> = {
  graph: Graph;
} & T
