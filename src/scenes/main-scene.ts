import { EdgeBuilder } from "../builders/edge-builder";
import { NodeBuilder } from "../builders/node-builder";
import { Graph } from "../graph/graph";
import { GraphSelection } from "../graph/graph-selection";
import { Edge } from "../graph/graphobjects/edge";
import { Node } from "../graph/graphobjects/node";
import { Events } from "../events";

import * as gexf from 'graphology-gexf';
import GraphologyGraph from 'graphology';
//@ts-ignore
import * as jQuery from "jquery";

function getServerPortValue(): string{
	const urlSearchParams = new URLSearchParams(window.location.search);
	//@ts-ignore
	const params = Object.fromEntries(urlSearchParams.entries());
	return params['server'] ? params['server'] : "8080";
}

/* 
 * SYNC ajax call to
 * https://solbiatialessandro.github.io/secondbrain_server/#api-Graph-LoadGraph
*/
function loadGraph(): GraphologyGraph{
	// @ts-ignore
	const port = getServerPortValue();
	var graph: any;
	jQuery.ajax( {
		'url': `http://localhost:${port}/load-graph`,
		'async': false,
		'success': function(graphData: any){
				const _graph =  gexf.parse(GraphologyGraph, graphData.graph);
				graph = _graph;
		}
	});
	return graph;
}


export class MainScene extends Phaser.Scene {
  graph: Graph;

  constructor() {
    super({ key: "MainScene" });
  }

  create(): void {
		//@ts-ignore
		this.graph =  Graph.getInstance(loadGraph());
    this.populateGraph();
		console.log(this.graph)
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

  populateGraph() {
    const nodeBuilder = new NodeBuilder(this);
		//@ts-ignore
		this.graph.forEachNode((nodeKey, attrs) => {
			if(attrs.nodetype == "CURATED_NOTE"){
				const _node = nodeBuilder.build(nodeKey, Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000));
			}
		});

		/*
    const edgeBuilder = new EdgeBuilder(this);
    edgeBuilder.build(node1, node2);
    edgeBuilder.build(node2, node4);
    edgeBuilder.build(node4, node5);
    edgeBuilder.build(node2, node5);
    edgeBuilder.build(node4, node6);
    edgeBuilder.build(node5, node7);
	 */
  }

  update(): void {
    this.graph.update();
  }
}
