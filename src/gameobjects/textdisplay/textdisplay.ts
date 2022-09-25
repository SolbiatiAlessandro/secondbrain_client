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

// copied from "~/Hacking/LOVECRM/v2_phaser/server/src/server/constants.ts"
/*
enum EMOJIS {
	BANANA = "🍌",
	IDEA = "🪴",
	WIP = "🛠",
	REFERENCE = "📚"
}*/
enum EMOJIS {
	BANANA = "banana",
	IDEA = "plant",
	WIP = "wrench",
	REFERENCE = "book",
	STAR = "star"
}

export class TextDisplay
  extends GameObjectWithTextDisplayTypes
  implements GameObjectOnGraph
{
	text: Phaser.GameObjects.Text;

  depth: number = 6;

  pointerdown() {}

	constructor(
		public scene: MainScene,
		public title: string,
		public size: number,
		public emojistring: string
	){
		super(scene);
	}

  populate() {
		console.log(this.size);
		this.text = new Phaser.GameObjects.Text(this.scene, this.pointCenter.x, this.pointCenter.y, this.title, { fontSize: this.size.toString() + 'px', color: 
																						'grey' });
		this.add(this.text, true);
    this.setDepth(this.depth + 1);
    this.setVisible(true);

		// emojistring = "|2,BANANA|2,IDEA|"
		//
		this.emojistring.split("|").forEach((value_emoji) => {
			if (value_emoji != '') {
				const emoji = value_emoji.split(",")[1];
				const size = value_emoji.split(",")[0];
				const imagename = Object.entries(EMOJIS).filter((nameval: any) => nameval[0] == emoji)[0][1]
				const emojiSprite = new Phaser.GameObjects.Sprite(
					this.scene, 
					this.pointCenter.x + (Math.random() * 60 - 30), 
					this.pointCenter.y + (Math.random() * 60 - 30), 
					imagename
				);
				// how to do switch syntax
				if (size == "1"){
					emojiSprite.scale = 0.3;
				}
				else if(size == "2"){
					emojiSprite.scale = 0.4;
				}
				else if(size == "3"){
					emojiSprite.scale = 0.5;
				}
				else {
					emojiSprite.scale = 0.6;
				}
				emojiSprite.depth = this.depth - 1;
				this.add(emojiSprite, true);
			}
		});

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
