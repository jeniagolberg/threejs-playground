import { Injectable } from "@angular/core";
import GUI from "lil-gui";
import { CameraService } from "./camera.service";
import * as THREE from "three"

@Injectable()
export class DebugUIService { 

    public gui: GUI;

    constructor(
        private cameraService: CameraService
    ) { }

    public init(gui: GUI, material? : THREE.Material) {
        this.gui = gui;

        this.addBaseControlsToDebug(material);
    }

    addBaseControlsToDebug(material?: THREE.Material){
        // camera
        this.gui.add(this.cameraService.camera.position, 'x', -10, 10, 0.1);
        this.gui.add(this.cameraService.camera.position, 'y', -10, 10, 0.1);
        this.gui.add(this.cameraService.camera.position, 'z', -10, 10, 0.1);

        // material
        if(material) {
            this.addBaseMaterialControls(material);
        }

    }

    get baseControls() {
        return ['wireframe', 'visible'];
    }

    addBaseMaterialControls(material: THREE.Material){

        for( let control of this.baseControls){
            try {
                const controller = this.gui.add(material, control)            
                controller.name(`${material.userData['name'] || 'unknown'}-${control}`);
                controller.updateDisplay();
            } catch(err) {
                console.log(`failed to configure ${control} control on: ${material.name}`)
            }
        }
    }

    customDebugUzi(obj: THREE.Object3D) {
        console.dir(obj);
        const uzi = obj.children[0];
        const uziVisabilityController = this.gui.add(uzi, 'visible');
        uziVisabilityController.name('uzi-visible');
        uziVisabilityController.updateDisplay();
    }

    addGuiControl(object: object, param: string, type: 'custom' | 'dropdown' | 'number',  customSettings: any){
        if(type === 'number') { 

        } else if(type === 'dropdown') {

        } else {

        }
        
    } 
}