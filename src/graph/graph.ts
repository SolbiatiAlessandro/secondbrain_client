import GraphologyGraph from 'graphology';

import { Node } from "../graph/graphobjects/node";
import { Edge } from "../graph/graphobjects/edge";
import { GraphObject } from "../graph/graphobjects/graph-object";
import { loadGraph } from "../graph/externalAPIs/api";

import { GraphSelection, GraphSelectionState } from "../graph/graph-selection";
import {
  GeometryOnGraph,
  GameObjectOnGraph,
} from "../interfaces/graph.interface";



import { Event, GraphEvent, Events } from "../events";

export class Graph extends GraphologyGraph {
  private static instance: Graph;

  public readonly NODE: string = "_node";
  public readonly EDGE: string = "_edge";

  public graphSelectionState = new GraphSelectionState();

  public static getInstance(): Graph {
    if (!Graph.instance) {
			const loadedGraph: GraphologyGraph = loadGraph();
      Graph.instance = new Graph(loadedGraph);
    }
    return Graph.instance;
  }

	constructor(graphologyGraph: GraphologyGraph){
		super();
		graphologyGraph.forEachNode((node, attrs) => {
			super.addNode(node, attrs);
		});
		graphologyGraph.forEachEdge((edge, attributes, source, target) => {
			super.addEdgeWithKey(edge, source, target, attributes);
		});
	}

  addNode(node: Node): string {
    let attr: any = {};
    attr[this.NODE] = node;
    super.addNode(node.name, attr);
    return node.name;
  }

  addEdge(edge: Edge): string {
    let attr: any = {};
    attr[this.EDGE] = edge;
    super.addEdgeWithKey(
      edge.name,
      edge.firstNode.name,
      edge.secondNode.name,
      attr
    );
    return edge.name;
  }

  get allEdges() {
    return super.mapEdges((_: string, attr: any) => attr[this.EDGE]);
  }

  get allNodes() {
    return super.mapNodes((_: string, attr: any) => attr[this.NODE]);
  }

  update() {
    // later we should update only selected from GraphEvents
    this.allEdges.map((edge: Edge) => edge.update());
  }
}
