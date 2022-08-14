import { EdgeBuilder } from "../builders/edge-builder";
import { NodeBuilder } from "../builders/node-builder";
import { Graph } from "../graph/graph";
import { GraphSelection } from "../graph/graph-selection";
import { Edge } from "../graph/graphobjects/edge";
import { Node } from "../graph/graphobjects/node";
import { Events } from "../events";
import { Constants } from "../constants";
import { bfsFromNode } from 'graphology-traversal/bfs';

export class MainScene extends Phaser.Scene {
  graph: Graph = Graph.getInstance();

  constructor() {
    super({ key: "MainScene" });
  }

  create(): void {
    this.buildGraph();
		this.setUpCamera();
		this.setUpGameEvents();
  }

	setUpGameEvents(): void{
    this.input.on(
      "drag",
      function (pointer: any, gameObject: any, x: number, y: number) {
        gameObject.onDrag(x, y);
      }
    );
    this.input.on(
      "pointerdown",
      function (
        pointer: any,
        currentlyOver: Array<Phaser.GameObjects.GameObject>
      ) {
        if (currentlyOver.length == 0) {
          GraphSelection.emptySelection();
        }
      }.bind(this)
    );
		this.input.on(
			"pointerup",
			function(
				pointer: any,
        currentlyOver: Array<Phaser.GameObjects.GameObject>
			){
				// @ts-ignore
				currentlyOver.forEach(gameObject => gameObject.pointerUp());
		}.bind(this));
	}

	setUpCamera(): void {
		// camera pan
		const camera = this.cameras.main;
		this.input.on("pointermove", function (pointer: any, currentlyOver: any) {
			if (!pointer.isDown) return;
			if (currentlyOver.length != 0) return;
			camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
			camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
		});

		this.input.on("wheel",  (pointer: any, gameObjects: any, deltaX: any, deltaY: any, deltaZ: any) => {
			if (deltaY > 0) {
					var newZoom = camera.zoom -.1;
					if (newZoom > 0.1) {
							camera.zoom = newZoom;
					}
			}
			if (deltaY < 0) {
					var newZoom = camera.zoom +.1;
					if (newZoom < 2) {
							camera.zoom = newZoom;
					}
			}
			// camera.centerOn(pointer.worldX, pointer.worldY);
			// camera.pan(pointer.worldX, pointer.worldY, 2000, "Power2");
		});
	}

	// build graph objects from data loaded in graph
  buildGraph() {
		const nodeBuilder = new NodeBuilder(this);

		let nodesON: Set<string> = new Set();

		// 8e647c20-f951-11ec-9dfd-b9c8db686024 Love
		bfsFromNode(this.graph, '8e647c20-f951-11ec-9dfd-b9c8db686024', function(node, attrs, depth){
			if(depth <= 3 && attrs.nodetype == "CURATED_NOTE"){
				nodeBuilder.build({
					name: node, 
					x: attrs.x * Constants.GRAPH_XY_SCALING_FACTOR,
					y: attrs.y * Constants.GRAPH_XY_SCALING_FACTOR,
					size: attrs.size,
					title: attrs.title,
					fullpath: attrs.fullpath,
					banana: ('banana' in attrs) ? attrs.banana : false
				});
				nodesON.add(node)
			}
		});

		const edgeBuilder = new EdgeBuilder(this);
		this.graph.forEachEdge((edge, attrs, source, target, sourceAttrs, targetAttrs) => {
			if(sourceAttrs.nodetype == "CURATED_NOTE" && targetAttrs.nodetype == "CURATED_NOTE"
				 && nodesON.has(source) && nodesON.has(target)
				){
				edgeBuilder.build({
					name: edge, 
					firstNode: sourceAttrs[this.graph.NODE], 
					secondNode: targetAttrs[this.graph.NODE]
				});
			}
		});
  }

  update(): void {
    this.graph.update();
  }
}
