import { ElementRef, Injectable, ViewChild } from "@angular/core";
import * as THREE from "three";
import { EventManagmentService } from "./event-managment.service";
import { SceneGraphService } from "./scene-graph.service";
import { CameraService } from "./camera.service";
import { tap } from "rxjs";
import { OrbitControls } from "three/examples/jsm/Addons"
import { GUI } from "lil-gui"
import { DebugUIService } from "./debug.service";

@Injectable()
export class SceneConfgiurationService {
    @ViewChild('rendererContainer', { static: true }) rendererContainer: ElementRef;
    controls: OrbitControls;

    constructor(
        private eventManagmentService: EventManagmentService,
        private cameraService: CameraService,
        private sceneGraphService:  SceneGraphService,
        private debugService: DebugUIService
    ) {

    }
    
    private renderer: THREE.WebGLRenderer;

    public initScene(scene: THREE.Scene, rendererContainer: ElementRef): THREE.Scene{
        //
        this.cameraService.initPositinedCamera();

        this.configSceneLights(scene);

        this.initRenderer(rendererContainer);
        this.initSceneDefaultListeners();
        this.initOrbitControls();
        this.initDebugUi(new GUI());

        this.eventManagmentService.setUpListenders();
         // 

        return scene;
    }

    configSceneLights(scene: THREE.Scene) {
        scene.add( new THREE.AmbientLight(0xffffff, 60))

        const directionalLight = new THREE.DirectionalLight(0xffffff, 60);
        directionalLight.position.set(1,2,3);
        scene.add(directionalLight)
    }

    initDebugUi(gui: GUI) {
        this.debugService.init(gui);
    }

    initRenderer(rendererContainer: ElementRef){
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    }

    initSceneDefaultListeners(){
        this.eventManagmentService.windowSize$.pipe(
            tap(() => {
                console.log('resize occur')
            })
        ).subscribe(({width, height}) => {
            const camera = this.cameraService.camera as THREE.PerspectiveCamera;

            camera.aspect = width/height
            camera.updateProjectionMatrix();

            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
    }

    initOrbitControls(){
        this.controls = new OrbitControls(this.cameraService.camera as THREE.PerspectiveCamera, this.renderer.domElement);
    }

    render(scene: THREE.Scene){
        this.renderer.render(scene, this.cameraService.camera);
    }
}
