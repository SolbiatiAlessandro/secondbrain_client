import { Node, NodeAttributes } from "../graph/graphobjects/node";
import { Graph } from "../graph/graph";

import {
  GeometryOnGraph,
  GameObjectOnGraph,
} from "../interfaces/graph.interface";

import { Point } from "../geometry/point";

import { GeometryBuilder } from "../builders/geometry-builder";

import { MainScene } from "../scenes/main-scene";

import { Controller } from "../gameobjects/controller/controller";
import { TextDisplay } from "../gameobjects/textdisplay/textdisplay";

export enum NodeGeometries {
  POINT__CENTER,
  POINT__LEFT_HANDLE,
  POINT__RIGHT_HANDLE,
  POINT__LEFT_HANDLE_TEST,
  POINT__RIGHT_HANDLE_TEST,
}

export enum NodeGameObjects {
  CONTROLLER,
	TEXTDISPLAY
}

export class NodeBuilder {
  graph: Graph = Graph.getInstance();
  geometryBuilder: GeometryBuilder = new GeometryBuilder();

  private readonly HANDLE_OFFSET = 60;

  constructor(public scene: MainScene) {}

  buildGeometries(nodeAttributes: NodeAttributes): Record<string, GeometryOnGraph> {
    const geometries: Record<string, GeometryOnGraph> = {};
    geometries[NodeGeometries.POINT__CENTER] = new Point(nodeAttributes.x, nodeAttributes.y);
    geometries[NodeGeometries.POINT__LEFT_HANDLE] = new Point(
      nodeAttributes.x - this.HANDLE_OFFSET,
      nodeAttributes.y - this.HANDLE_OFFSET
    );
    geometries[NodeGeometries.POINT__RIGHT_HANDLE] = new Point(
      nodeAttributes.x + this.HANDLE_OFFSET,
      nodeAttributes.y + this.HANDLE_OFFSET
    );
    geometries[NodeGeometries.POINT__LEFT_HANDLE_TEST] = new Point(
      nodeAttributes.x - this.HANDLE_OFFSET,
      nodeAttributes.y - this.HANDLE_OFFSET
    );
    geometries[NodeGeometries.POINT__RIGHT_HANDLE_TEST] = new Point(
      nodeAttributes.x + this.HANDLE_OFFSET,
      nodeAttributes.y + this.HANDLE_OFFSET
    );
    return geometries;
  }

  buildGameObjects(nodeAttributes: NodeAttributes): Record<string, GameObjectOnGraph> {
    const gameObjects: Record<string, GameObjectOnGraph> = {};
    gameObjects[NodeGameObjects.CONTROLLER] = new Controller(this.scene);
    gameObjects[NodeGameObjects.TEXTDISPLAY] = new TextDisplay(this.scene, nodeAttributes.title, nodeAttributes.size, nodeAttributes.banana);
    return gameObjects;
  }

  build(nodeAttributes: NodeAttributes): Node {
    // @ts-ignore
    const geometries = this.buildGeometries(nodeAttributes);
    const gameObjects = this.buildGameObjects(nodeAttributes);

    const node = new Node(nodeAttributes, gameObjects, geometries);
    this.graph.addNode(node);
    Object.entries(geometries).forEach(
      ([key, geometry]) => (geometry.graphParentElement = node)
    );
    Object.entries(gameObjects).forEach(
      ([key, gameObject]) => (gameObject.graphParentElement = node)
    );
    return node;
  }
}
