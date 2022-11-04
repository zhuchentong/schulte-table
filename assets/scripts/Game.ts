import {
  _decorator,
  Component,
  Prefab,
  instantiate,
  Color,
  UITransform,
  Label,
  Node,
  NodeEventType,
  Sprite,
  director,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class game extends Component {
  // 游戏等级
  private level = 5;
  // 当前数字
  private current: number = 1;
  private time = 0;
  // Box预制块
  @property({ type: Prefab })
  boxPrfb?: Prefab;

  loadLevel() {
    this.level = window["level"] || 3;
  }

  updateButtonActive(state: boolean) {
    const resetNode = this.node.getChildByName("Reset");
    const backNode = this.node.getChildByName("Back");
    resetNode.active = state;
    backNode.active = state;
  }

  start() {
    this.updateButtonActive(false);
    this.loadLevel();
    this.schedule(this.updateTime, 0.01);
    this.createBoxs();
  }

  update(deltaTime: number) {}

  updateTime() {
    const timerNode = this.node.getChildByName("Timer");
    const timerLabel = timerNode.getComponent(Label);

    this.time += 0.01;
    timerLabel.string = this.time.toFixed(2);
  }

  updateNumber() {
    const numberNode = this.node.getChildByName("Number");
    const numberLabel = numberNode.getComponent(Label);
    this.current += 1;
    numberLabel.string = this.current.toString();
  }

  /**
   * 创建Box
   */
  createBoxs() {
    const container = this.node.getChildByName("BoxContainer");

    const ui = container.getComponent(UITransform);

    const width = (ui.height = ui.width);
    const size = width / this.level;

    const list = Array.from(Array(this.level ** 2), (_, i) => i + 1).sort(
      () => Math.random() - 0.5
    );

    list.forEach((v, index) => {
      const boxNode = instantiate(this.boxPrfb);

      const boxNodeUI = boxNode.getComponent(UITransform);
      const numberNode = boxNode.getChildByPath("/Background/Number");

      const label = numberNode.getComponent(Label);

      boxNodeUI.width = size;
      boxNodeUI.height = size;
      boxNode.setPosition(
        (index % this.level) * size,
        Math.floor(index / this.level) * size
      );

      label.fontSize = 100;
      label.string = v.toString();

      container.addChild(boxNode);

      boxNode.on(NodeEventType.TOUCH_START, this.onSelectBoxNode(v, boxNode));
    });
  }

  /**
   * 选择Box块
   * @param value
   * @param node
   * @returns
   */
  onSelectBoxNode(value: number, node: Node) {
    return () => {
      if (this.current === value) {
        const backgroundNode = node.getChildByName("Background");
        const numberNode = node.getChildByPath("/Background/Number");
        const backgroundSprite = backgroundNode.getComponent(Sprite);
        const numberLabel = numberNode.getComponent(Label);

        backgroundSprite.color = new Color("#1c1e26");
        numberLabel.color = new Color("#494c56");

        if (this.current === this.level ** 2) {
          this.finishGame();
        } else {
          this.updateNumber();
        }
      }
    };
  }

  finishGame() {
    this.updateButtonActive(true);
    this.unschedule(this.updateTime);
  }

  reset() {
    director.loadScene("Game");
  }

  back() {
    director.loadScene("Welcome");
  }
}
