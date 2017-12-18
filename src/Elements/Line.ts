import ElementBase from "./ElementBase";

export class Line extends ElementBase {
  public path = [[0, 0], [0, 0]];

  public type: string = "line";
}
