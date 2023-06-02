import { Anchor } from "../interfaces/anchor";

export default abstract class LogicNode {
  public abstract name: string;
  public abstract label: string;
  public abstract cover: string;
  public abstract intro: string;
  public width: number = 210;
  public height: number = 134;

  public abstract getAnchors(): Anchor[];
}
