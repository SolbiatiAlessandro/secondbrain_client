import {
  GameObjectOnGraph,
  GeometryOnGraph,
} from "../../interfaces/graph.interface";

import { Graph } from "../../graph/graph";
import { GraphSelection } from "../../graph/graph-selection";

import { GraphObject } from "../../graph/graphobjects/graph-object";
import { GraphSelectableObject } from "../../graph/graphobjects/graph-selectable-object";

import { Event, GraphEvent, Events } from "../../events";

export interface NodeAttributes {
	name: string,
	x: number,
	y: number,
	size: number
}

export class Node extends GraphSelectableObject {
  graph: Graph = Graph.getInstance();
	public name: string;

  readonly SELECTION_EVENTS: Array<Event> = [
    Events.NODE_SELECTED,
    Events.NODE_DESELECTED,
  ];

  constructor(
    nodeAttributes: NodeAttributes,
    public gameObjects: Record<string, GameObjectOnGraph>,
    public geometries: Record<string, GeometryOnGraph>
  ) {
    super();
		this.name = nodeAttributes.name; 
  }
}
