import * as gexf from 'graphology-gexf';
import GraphologyGraph from 'graphology';
//@ts-ignore
import * as jQuery from "jquery";

import { Node } from "../../graph/graphobjects/node";

/* 
 * SYNC ajax call to
 * https://solbiatialessandro.github.io/secondbrain_server/#api-Graph-LoadGraph
 * you must have it running locally on localhost:8080
*/
export function loadGraph(): GraphologyGraph{
	// @ts-ignore
	var graph: any;
	jQuery.ajax( {
		'url': `http://localhost:8080/load-graph`,
		'async': false,
		'success': function(graphData: any){
				console.log("http://localhost:8080/load-graph SUCCESS");
				console.log(graphData);
				const _graph =  gexf.parse(GraphologyGraph, graphData.graph);
				graph = _graph;
		}
	});
	return graph;
}

export function updateNodeAttributes(node: string, x: number, y: number): void {
	jQuery.ajax( {
		'url': `http://localhost:8080/update-node-attributes?` + jQuery.param({node: node, x: x, y: y}),
		'async': false,
		'success': function(){
			console.log("updateNodeAttributes SUCCESS");
		}
	});
}
