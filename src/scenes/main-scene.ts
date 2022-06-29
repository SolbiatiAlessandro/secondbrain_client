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
		this.graph.forEachNode((node, attrs) => {
			if(attrs.nodetype == "CURATED_NOTE"){
				nodeBuilder.build(node, Math.floor(Math.random() * 1100), Math.floor(Math.random() * 600), attrs.label);
			}
		});

    const edgeBuilder = new EdgeBuilder(this);
		this.graph.forEachEdge((edge, attrs, source, target, sourceAttrs, targetAttrs) => {
			if(sourceAttrs.nodetype == "CURATED_NOTE" && targetAttrs.nodetype == "CURATED_NOTE"){
				edgeBuilder.build(edge, sourceAttrs[this.graph.NODE], targetAttrs[this.graph.NODE]);
			}
		});
  }

  update(): void {
    this.graph.update();
  }
}
