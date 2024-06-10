import { Injectable } from "@angular/core";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

@Injectable()
export class HartaService { 

    constructor() {

    }


    getGeometryByCount(count = 80) {
        const geometry = new THREE.BufferGeometry();

        const positionArray = new Float32Array(count * 3 * 3);

        for(let i = 0; i < count * 3 * 3; i++){ 
            positionArray[i] = Math.random()
        }

        const positionAttributes = new THREE.BufferAttribute(positionArray, 3); // second is number of elements in array that count as a vortex
        geometry.setAttribute('position', positionAttributes);

        return geometry;
    }

    getUziModel(){ 
        const loader = new GLTFLoader();
        loader.setCrossOrigin('anonymous');
        const dracoLoader = new DRACOLoader().setDecoderPath('https://unpkg.com/three@0.163.0/examples/jsm/libs/draco/gltf/');
        // const dracoLoader = new DRACOLoader().setDecoderPath('../node_modules/three/examples/jsm/libs/draco/gltf/')
        loader.setDRACOLoader(dracoLoader);
        const modelPath = 'https://rawcdn.githack.com/wetzzer/Uzi/e85576bd079c9648e4e2148567ecfa32a5660564/UZI.glb';
        
        return new Promise((resolve, reject) => {
            loader.load(
                modelPath,
                (gltf) => {
                    resolve(gltf.scene);
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        }); 
    }
}