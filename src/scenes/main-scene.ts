import { EdgeBuilder } from "../builders/edge-builder";
import { NodeBuilder } from "../builders/node-builder";
import { Graph } from "../graph/graph";
import { GraphSelection } from "../graph/graph-selection";
import { Edge } from "../graph/graphobjects/edge";
import { Node } from "../graph/graphobjects/node";
import { Events } from "../events";

export class MainScene extends Phaser.Scene {
  graph: Graph = Graph.getInstance();

  constructor() {
    super({ key: "MainScene" });
  }

  create(): void {
    this.buildGraph();
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
  }

	// build graph objects from data loaded in graph
  buildGraph() {
		const nodeBuilder = new NodeBuilder(this);
		this.graph.forEachNode((node, attrs) => {
			console.log(node, attrs);
			if(attrs.nodetype == "CURATED_NOTE"){
				nodeBuilder.build({
					name: node, 
					x: Math.floor(Math.random() * 1000), 
					y: Math.floor(Math.random() * 1000),
					size: 10,
					title: attrs.title,
					fullpath: attrs.fullpath
				});
			}
		});

		const edgeBuilder = new EdgeBuilder(this);
		this.graph.forEachEdge((edge, attrs, source, target, sourceAttrs, targetAttrs) => {
			if(sourceAttrs.nodetype == "CURATED_NOTE" && targetAttrs.nodetype == "CURATED_NOTE"){
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
