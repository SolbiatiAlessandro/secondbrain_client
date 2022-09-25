import {
  GameObjectOnGraph,
  GeometryOnGraph,
} from "../../interfaces/graph.interface";

import { Graph } from "../../graph/graph";
import { GraphSelection } from "../../graph/graph-selection";

import { GraphObject } from "../../graph/graphobjects/graph-object";
import { GraphSelectableObject } from "../../graph/graphobjects/graph-selectable-object";

import { Event, GraphEvent, Events } from "../../events";

import { updateNodeAttributes } from "../../graph/externalAPIs/api";

export interface NodeAttributes {
	name: string,
	x: number,
	y: number,
	size: number,
	title: string,
	fullpath: string,
	emojistring: string,
}

export class Node extends GraphSelectableObject {
  graph: Graph = Graph.getInstance();
	public name: string;

  readonly SELECTION_EVENTS: Array<Event> = [
    Events.NODE_SELECTED,
    Events.NODE_DESELECTED,
  ];

  constructor(
    public nodeAttributes: NodeAttributes,
    public gameObjects: Record<string, GameObjectOnGraph>,
    public geometries: Record<string, GeometryOnGraph>
  ) {
    super();
		this.name = nodeAttributes.name; 
  }

	save(){
		updateNodeAttributes(this.name, this.nodeAttributes.x, this.nodeAttributes.y);
	}
}
