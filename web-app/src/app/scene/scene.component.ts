import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons"
import { HartaService } from '../services/harta.service';
import { SceneConfgiurationService } from '../services/scene-config.service';
import { EventManagmentService } from '../services/event-managment.service';
import { SceneGraphService } from '../services/scene-graph.service';
import { CameraService } from '../services/camera.service';
import { DebugUIService } from '../services/debug.service';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  standalone: true,
  styleUrls: ['./scene.component.scss'],
  providers: [
    HartaService,
    SceneConfgiurationService,
    EventManagmentService,
    SceneGraphService,
    CameraService,
    DebugUIService
  ]
})
export class SceneComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer: ElementRef;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  canvas: any;

  sizes: {
    width: number;
    height: number;
  } = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  constructor(
    private hartaService : HartaService,
    private sceneConfigService: SceneConfgiurationService,
    private cameraService: CameraService,
    private eventManagementService: EventManagmentService,
    private sceneGraphService: SceneGraphService,
    private debugService: DebugUIService
  ) { }

  ngOnInit(): void {
    this.initScene2();
    this.canvas = document.querySelector('canvas');
    this.render();
  }

  async initScene2(): Promise<void> {
    this.scene = this.sceneConfigService.initScene(new THREE.Scene(), this.rendererContainer)

    // this.scene.add(await this.sceneGraphService.basicObjectsGraph(this.debugService))
    this.scene.add(await this.sceneGraphService.uziGraph());

  }

  render(): void {
    const animate = () => {

      requestAnimationFrame(animate);
      this.eventManagementService.tick();
      this.sceneConfigService.render(this.scene);
    };
    animate();
  }
}
