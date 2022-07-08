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
  valid: boolean = true;

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
		const text = new Phaser.GameObjects.Text(this.scene, this.pointCenter.x, this.pointCenter.y, this.title, { fontSize: this.size.toString(), color: 'grey' });
		this.add(text, true);
    this.setDepth(this.depth);
    this.setVisible(true);
  }
}
