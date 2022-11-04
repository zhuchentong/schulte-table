import { _decorator, Component, Node, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Box")
export class Box extends Component {
  public number: string;

  start() {}

  update(deltaTime: number) {}
}
