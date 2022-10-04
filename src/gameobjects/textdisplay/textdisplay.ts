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

/* how to add emoji
 * Server
 * 1. add to enum to constants.ts
 *
 * Client
 * 2. add to scenes/load-scene
 * 3. add images to assets folder
 * 4. add to enum in gameobjects/textdisplay/textdisplay.ts
 */
enum EMOJIS { // maps encoded emoji string to asset name
	BANANA = "banana",
	IDEA = "plant",
	WIP = "wrench",
	REFERENCE = "book",
	STAR = "star",
	EGGBANANA = "eggbanana",
	SLEEP = "sleep",
}

const SHOW_EMOJIS =  {
	BANANA : true,
	IDEA : true,
	WIP : true,
	REFERENCE : true,
	STAR : true,
	EGGBANANA: true,
	SLEEP: true
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
		this.text = new Phaser.GameObjects.Text(this.scene, this.pointCenter.x - (3 * this.title.length), this.pointCenter.y - 5, this.title, { fontSize: this.size.toString() + 'px', color: 
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
				// @ts-ignore
				if ( SHOW_EMOJIS[emoji] ) {
					this.add(emojiSprite, true);
				}
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
