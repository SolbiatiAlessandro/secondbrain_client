import * as gexf from 'graphology-gexf';
import GraphologyGraph from 'graphology';
//@ts-ignore
import * as jQuery from "jquery";

/* 
 * SYNC ajax call to
 * https://solbiatialessandro.github.io/secondbrain_server/#api-Graph-LoadGraph
 * you must have it running locally on localhost:8080
*/
export function loadGraph(): GraphologyGraph{
	// @ts-ignore
	const port = getServerPortValue();
	var graph: any;
	jQuery.ajax( {
		'url': `http://localhost:8080/load-graph`,
		'async': false,
		'success': function(graphData: any){
				const _graph =  gexf.parse(GraphologyGraph, graphData.graph);
				graph = _graph;
		}
	});
	return graph;
}
