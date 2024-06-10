import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import * as THREE from "three";
import { HartaService } from "./harta.service";
import { DebugUIService } from "./debug.service";
import { OBB } from 'three/examples/jsm/Addons';
import { EventManagmentService } from "./event-managment.service";

@Injectable()
export class SceneGraphService {
    constructor(
        private hartaService: HartaService,
        private eventListeners: EventManagmentService
    ){

    }

    private _sceneGraph: any;
    
    private _inited$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _built$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    initSceneGraph(param: any) {

    }

    async uziGraph(debug? : DebugUIService): Promise<THREE.Object3D> {
        // const uziSceneGraph = new THREE.Scene();
        const uziModelScene = (await this.hartaService.getUziModel()) as unknown as THREE.Object3D
        
        const uzi = uziModelScene.children[0] as THREE.Object3D;
        
        uziModelScene.add(new THREE.AxesHelper(150))



        // axis aligned bounding box
        const {aabb, aabbBox} = this.getAaBoundingBoxByBox3(uzi, 'uzi-aabb', 0x00ff00)
        // uziModelScene.add(aabb);

        // orianted bounding Box
        const {obb, obbMesh } = this.getOBounidngBoxByBox3(aabbBox, 'orianted-uzi-box', 0xffff00 )
        // uziModelScene.add(obbMesh)
        uzi.add(obbMesh)
        uziModelScene.rotation.set(Math.PI, Math.PI, Math.PI - 1)

        // obbMesh.rotation.set(Math.PI, Math.PI, Math.PI - 1)
        // aabb.rotation.set(Math.PI, Math.PI, Math.PI - 1);
        // obbMesh.applyMatrix4(uziModelScene.matrix)


        // aabb.rotation.set(Math.PI, Math.PI, Math.PI - 1)

        // debug?.addBaseMaterialControls(uzi],)


        //set up movement
        this.eventListeners.frameTicks.pipe(
            tap(() => {

                const {x, y ,z} = uziModelScene.rotation
                uziModelScene.rotation.x = x + 0.01;
                uziModelScene.rotation.y = y + 0.01;
                uziModelScene.rotation.z = z + 0.01;
            })
        ).subscribe();



        return uziModelScene;
    }

    async basicObjectsGraph(debug?: DebugUIService) {
        
        const basicSceneGraph = new THREE.Object3D();


        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        material.userData = {name: 'main-box'}
        const cube = new THREE.Mesh(geometry, material);
        // basicSceneGraph.add(cube);

        // Add random geometry 
        const geometryrand = this.hartaService.getGeometryByCount();
        const materialrand = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        materialrand.userData = {name: 'random-geo'}
        const meshrand = new THREE.Mesh(geometryrand, materialrand)
        basicSceneGraph.add(meshrand)

        // create a aabb based on meshrand
        const aabb1 = this.getAABoundingBoByBoxHelper(meshrand, 'harta', 0x00ff00);
        // basicSceneGraph.add(aabb1)

        const {aabb, aabbBox} = this.getAaBoundingBoxByBox3(meshrand, 'box3-harta', 0xffff00);
        basicSceneGraph.add(aabb);

        // const model: THREE.Object3D = await this.hartaService.getUziModel() as unknown as THREE.Object3D;
        // console.dir(model);
        // basicSceneGraph.add(model)


        //create a obb based object on meshrand
        const {obbMesh, obb} = this.getOBounidngBoxByBox3(aabbBox, 'orianted-box', 0x00f0f0);
        // const randMeshId = basicSceneGraph.getObjectById(meshrand.id);
        // obbObject.applyMatrix4(randMeshId?.matrix as THREE.Matrix4)
        // obbObject.geometry.translate(
        //     meshrand.position.x,
        //     meshrand.position.y,
        //     meshrand.position.z
        // )
        // ) = meshrand.position

        obbMesh.position.copy(obb.center)
        basicSceneGraph.add(obbMesh)


        // const uzi = model.

        if(debug){
            // debug.customDebugUzi(model)
            debug.addBaseMaterialControls(material)
            debug.addBaseMaterialControls(materialrand)
            debug.addBaseMaterialControls(aabb1.material)
            debug.addBaseMaterialControls(aabb.material as THREE.Material)
            debug.addBaseMaterialControls(obbMesh.material as THREE.Material)


        }


        return basicSceneGraph
    }


    public getAaBoundingBoxByBox3(mesh: THREE.Object3D, name?: string, color?: THREE.ColorRepresentation) {
        const aabbBox = new THREE.Box3().setFromObject(mesh, true);
        const aabb = new THREE.Box3Helper(aabbBox, color);
        (aabb.material as THREE.Material).userData = {name}
        return  { aabb, aabbBox}
    }

    public getAABoundingBoByBoxHelper(mesh: THREE.Mesh, name: string, color: THREE.ColorRepresentation) {
        const boundingMesh = new THREE.BoxHelper(mesh, color);
        boundingMesh.material.userData = { name };

        return boundingMesh;
    }

    public getOBounidngBoxByBox3(aabbMesh: THREE.Box3, name: string, color: THREE.ColorRepresentation){ 
        const oriantedBoundingBox = new OBB().fromBox3(aabbMesh)
        const obboxMaterial = new THREE.MeshBasicMaterial({color, wireframe: true});
        const obbMesh = new THREE.LineSegments(
            new THREE.BoxGeometry(
                oriantedBoundingBox.halfSize.x*2,
                oriantedBoundingBox.halfSize.y*2,
                oriantedBoundingBox.halfSize.z*2
            ),
            obboxMaterial
        );
        // obbMesh.applyMatrix4(aabbMesh.get)
        obbMesh.position.copy(oriantedBoundingBox.center)
        return {obbMesh, obb: oriantedBoundingBox};
        // return oriantedBoundingMesh.fromBox3(aabbMesh.geometry.boundingBox as THREE.Box3)
    }

    public get builtSubject$() {
        return this._built$;
    }
}