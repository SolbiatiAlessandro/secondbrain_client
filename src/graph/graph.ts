import GraphologyGraph from 'graphology';

import { Node } from "../graph/graphobjects/node";
import { Edge } from "../graph/graphobjects/edge";
import { GraphObject } from "../graph/graphobjects/graph-object";
import { loadGraph, updateNodeAttributes } from "../graph/externalAPIs/api";

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
		if (graphologyGraph){
			graphologyGraph.forEachNode((node, attrs) => {
				super.addNode(node, attrs);
			});
			graphologyGraph.forEachEdge((edge, attributes, source, target) => {
				super.addEdgeWithKey(edge, source, target, attributes);
			});
		} else {
			alert("Warning: failed loading graph from backend!");
		}
	}

  addNode(node: Node): string {
    let attr: any = {};
    attr[this.NODE] = node;
		super.mergeNodeAttributes(node.name, attr);
    return node.name;
  }

	save(): void {
		this.forEachNode((node, attrs) => updateNodeAttributes(node, attrs[this.NODE].nodeAttributes.x, attrs[this.NODE].nodeAttributes.y));
	}

  addEdge(edge: Edge): string {
    let attr: any = {};
    attr[this.EDGE] = edge;
		super.mergeEdgeAttributes(edge.name, attr);
    return edge.name;
  }

  get allEdges(): Array<Edge> {
    return super.mapEdges((_: string, attr: any) => attr[this.EDGE]).filter(edge => edge);;
  }

  get allNodes(): Array<Node> {
    return super.mapNodes((_: string, attr: any) => attr[this.NODE]);
  }

  update() {
    // later we should update only selected from GraphEvents
    this.allEdges.map((edge: Edge) => edge.update());
  }
}
