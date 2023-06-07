import { BehaviorOption, Graph } from "@antv/g6";
import { WithRequiredProperty } from "./util";

export type BehaviorOptionThis<K extends keyof BehaviorOption, T = {}> =
WithRequiredProperty<BehaviorOption, K> & ThisType<
  WithRequiredProperty<BehaviorOption, K> & {
    graph: Graph;
  } & T
>


