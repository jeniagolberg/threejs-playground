import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable()
export class CameraService {

    constructor(){

    }

    private _camera: THREE.Camera;

    public get camera (): THREE.Camera {
        if(!this._camera) {
            this.initCamera();
        }

        return this._camera;
    }

    public set camera(camera: THREE.Camera){
        this._camera = camera;
    }

    public initCamera(): void {
        //default cube view
        this._camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000); // add to view-config-loader
        this._camera.position.set(0, 0, 200); // add to view-config-loader
    }

    public initPositinedCamera(){
        this.initCamera() // add position paramaters passing
    }
}