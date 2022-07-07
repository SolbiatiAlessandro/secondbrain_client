import {
  GameObjectOnGraph,
  GeometryOnGraph,
} from "../../interfaces/graph.interface";

import { Graph } from "../../graph/graph";
import { GraphSelection } from "../../graph/graph-selection";

import { GraphObject } from "../../graph/graphobjects/graph-object";
import { Node } from "../../graph/graphobjects/node";
import { GraphSelectableObject } from "../../graph/graphobjects/graph-selectable-object";

import { GraphEvent, Event, Events } from "../../events";

export interface EdgeAttributes {
	name: string,
	firstNode: Node,
	secondNode: Node
}

export class Edge extends GraphSelectableObject {
  public name: string;
	public firstNode: Node;
	public secondNode: Node;

  readonly SELECTION_EVENTS: Array<Event> = [
    Events.EDGE_DESELECTED,
    Events.EDGE_SELECTED,
  ];
  graph: Graph = Graph.getInstance();

  constructor(
		attributes: EdgeAttributes,
    public gameObjects: Record<string, GameObjectOnGraph>,
    public geometries: Record<string, GeometryOnGraph>
  ) {
    super();
    this.name = attributes.name;
		this.firstNode = attributes.firstNode;
		this.secondNode = attributes.secondNode;
  }

  neighbouringNodes(): [Node, Node] {
    return [this.firstNode, this.secondNode];
  }

  selectNeighbourNodes() {
    this.neighbouringNodes().map((node: Node) => node.select());
  }

  deselectNeighbourNodes() {
    this.neighbouringNodes().map((node: Node) => node.deselect());
  }

  broadcastToNeighbourNodes(event: Event) {
    this.neighbouringNodes().map((node: Node) =>
      node.broadcastToGameObjects(event)
    );
  }

  update() {
    Object.entries(this.gameObjects).forEach(([_, gameObject]) =>
      gameObject.update()
    );
    Object.entries(this.geometries).forEach(([_, geometry]) =>
      geometry.update()
    );
  }
}
