import { BehaviorOption } from "@antv/g6";
import Graph from "./Graph";

export default abstract class Action {
  protected graph: Graph;
  public abstract name: string;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  public abstract behaviorOption(): BehaviorOption;
}
