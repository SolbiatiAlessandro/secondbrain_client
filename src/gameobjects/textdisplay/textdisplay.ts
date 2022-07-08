import { Edge } from "../../graph/graphobjects/edge";
import { Point } from "../../geometry/point";

import { Constants } from "../../constants";
import { Events } from "../../events";

import { NodeGeometries } from "../../builders/node-builder";

import { GameObjectOnGraph } from "../../interfaces/graph.interface";

import { MainScene } from "../../scenes/main-scene";

import { GameObject } from "../../gameobjects/gameobject";

class GameObjectWithTextDisplayTypes extends GameObject {
  get pointCenter(): Point {
    //@ts-ignore
    return this.graphParentElement.geometries[NodeGeometries.POINT__CENTER];
  }

  get graphParentEdge(): Edge {
    // @ts-ignore
    return this.graphParentElement;
  }
}

export class TextDisplay
  extends GameObjectWithTextDisplayTypes
  implements GameObjectOnGraph
{
	text: Phaser.GameObjects.Text;

  depth: number = 5;

  pointerdown() {}

	constructor(
		public scene: MainScene,
		public title: string,
		public size: number
	){
		super(scene);
	}

  populate() {
		console.log(this.size);
		this.text = new Phaser.GameObjects.Text(this.scene, this.pointCenter.x, this.pointCenter.y, this.title, { fontSize: this.size.toString() + 'px', color: 'grey' });
		this.add(this.text, true);
    this.setDepth(this.depth);
    this.setVisible(true);
  }

  onEvent(event: Events) {
    if (event == Events.CURVE_VALID) {
    }
    if (event == Events.CURVE_INVALID) {
    }
    if (event == Events.NODE_SELECTED) {
      this.text.setTint(Constants.SECONDARY_COLOR);
    }
    if (event == Events.NODE_DESELECTED) {
      this.text.setTint(Constants.PRIMARY_COLOR);
    }
  }
}
