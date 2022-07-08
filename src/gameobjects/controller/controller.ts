import { Constants } from "../../constants";
import { Events } from "../../events";

import { Point } from "../../geometry/point";

import { GameObjectOnGraph } from "../../interfaces/graph.interface";

import { ControllerHandle } from "../../gameobjects/controller/gameobjects/controller-handle";
import { ControllerLine } from "../../gameobjects/controller/gameobjects/controller-line";
import { GameObjectWithControllerTypes } from "../../gameobjects/controller/controller-types";

class ControllerCenter extends Phaser.GameObjects.Sprite {
	constructor(
    scene: Phaser.Scene,
		public point: Point,
		public onDragCallback: (x: number, y: number) => void,
		public pointerUpCallback: () => void
	){
    super(scene, point.x, point.y, "controlPointCenter");
    this.setInteractive({ draggable: true });
	}

	onDrag(x: number, y: number){
		this.point.x = x;
		this.point.y = y;
		this.x = x;
		this.y = y;
		this.onDragCallback(x, y);
	}

	pointerUp(){
		console.log(this.x, this.y);
		this.pointerUpCallback();
	}
}

export class Controller
  extends GameObjectWithControllerTypes
  implements GameObjectOnGraph
{
  controllerCenter: ControllerCenter;
  rightControllerHandle: ControllerHandle;
  leftControllerHandle: ControllerHandle;
  line: ControllerLine;

  valid: boolean = true;

  depth: number = 5;
  imageOffsetY: number = -20;

  pointerdown() {}

  populateControllerHandles() {
    this.rightControllerHandle = new ControllerHandle(
      this.scene,
      this.pointRightTest,
      this.pointRightRender,
      this.onHandleDrag("rightControllerHandle", "leftControllerHandle"),
      this.imageOffsetY,
      this.pointerdown.bind(this)
    );
    this.add(this.rightControllerHandle, true);
    this.leftControllerHandle = new ControllerHandle(
      this.scene,
      this.pointLeftTest,
      this.pointLeftRender,
      this.onHandleDrag("leftControllerHandle", "rightControllerHandle"),
      this.imageOffsetY,
      this.pointerdown.bind(this)
    );
    this.add(this.leftControllerHandle, true);
  }

  populate() {
    this.populateControllerHandles();
    this.line = new ControllerLine(
      this.scene,
      this.leftControllerHandle,
      this.rightControllerHandle
    );
    this.add(this.line, true);
    this.controllerCenter = new ControllerCenter(
			this.scene, 
			this.pointCenter, 
																								 
			(x: number, y: number) => {
				this.graphParentNode.nodeAttributes.x = x;
				this.graphParentNode.nodeAttributes.y = y;
			},
			() => {
				navigator.clipboard.writeText(this.graphParentNode.nodeAttributes.fullpath);
				this.graphParentNode.save();
			},
		);
		this.add(this.controllerCenter, true);
    this.setDepth(this.depth);
		this._setVisible(false);
  }


	_setVisible(value: boolean){
    this.setVisible(value);
		this.controllerCenter.setVisible(true);
	}

  onHandleDrag(
    handle: "rightControllerHandle" | "leftControllerHandle",
    otherControllerHandle: "rightControllerHandle" | "leftControllerHandle"
  ): (x: number, y: number) => void {
    return function (x: number, y: number) {
      this[handle].move(x, y, this.valid);
      this[otherControllerHandle].move(
        ...this.pointCenter.reflectBy(x, y),
        this.valid
      );
      this.line.move(this[handle], this[otherControllerHandle]);
    }.bind(this);
  }

  _setTint(color: number) {
    this.rightControllerHandle.setTint(color);
    this.leftControllerHandle.setTint(color);
    this.line.setTint(color);
  }

  onEvent(event: Events) {
    if (event == Events.CURVE_VALID) {
      this._setTint(Constants.PRIMARY_COLOR);
      this.valid = true;
    }
    if (event == Events.CURVE_INVALID) {
      this._setTint(Constants.ERROR_COLOR);
      this.valid = false;
    }
    if (event == Events.NODE_SELECTED) {
      this._setVisible(true);
    }
    if (event == Events.NODE_DESELECTED) {
      this._setVisible(false);
    }
  }
}
