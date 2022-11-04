import { _decorator, Component, Node, Scene, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Welcome")
export class Welcome extends Component {
  public currentLevel: number = 3;
  start() {
    director.addPersistRootNode(this.node);
  }

  update(deltaTime: number) {}

  selectGameLevel(_, level: string) {
    window["level"] = parseInt(level);
    director.loadScene("Game");
  }
}
