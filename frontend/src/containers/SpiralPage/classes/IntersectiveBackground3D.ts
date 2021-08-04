import * as THREE from 'three';

import { InteractiveObject3D } from './InteractiveObject3D';

export class IntersectiveBackground3D extends InteractiveObject3D {
  _raycasterPlane: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshBasicMaterial
  > | null = null;

  constructor() {
    super();
  }

  _drawRaycasterPlane() {
    this._raycasterPlane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1000, 1000),
      new THREE.MeshBasicMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        opacity: 0,
      }),
    );

    this.add(this._raycasterPlane);
  }

  getIntersectPoint(
    x: number,
    y: number,
    raycaster: THREE.Raycaster,
    camera: THREE.Camera,
  ) {
    raycaster.setFromCamera({ x, y }, camera);

    if (this._raycasterPlane) {
      const intersects = raycaster.intersectObjects(
        [this._raycasterPlane],
        true,
      );
      if (intersects[0]) {
        return intersects[0].point;
      }
    }

    return null;
  }

  setPlaneDepth(value: number) {
    if (this._raycasterPlane) {
      this._raycasterPlane.position.z = value;
    }
  }

  init() {
    this._drawRaycasterPlane();
  }

  destroy() {}
}