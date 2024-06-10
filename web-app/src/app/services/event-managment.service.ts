import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";


interface WindowSize {
    width: number;
    height: number
}

@Injectable()
export class EventManagmentService {

    constructor() {

    }

    private _windowSise$: BehaviorSubject<WindowSize> = new BehaviorSubject({
        width: window.innerWidth,
        height: window.innerHeight
    })

    private _windowFullScreen$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public get windowSize$(): BehaviorSubject<WindowSize> {
        return this._windowSise$ as BehaviorSubject<WindowSize>;
    }

    public get windowFullScreen$(): BehaviorSubject<boolean> {
        return this._windowFullScreen$ as BehaviorSubject<boolean>;
    }

    private _animationTicks$: Subject<void> = new Subject<void>();
    
    public get frameTicks(): Subject<void>{
        return this._animationTicks$;
    }

    public tick() {
        this._animationTicks$.next();
    }

    public setUpListenders () {
        window.addEventListener('resize', () => {
            this._windowSise$.next({
                width: window.innerWidth,
                height: window.innerHeight
            });
        })

        window.addEventListener('dblclick', () => {

            this._windowFullScreen$.next(!this._windowFullScreen$.value);
            console.log('double click')
      
            // if(!document.fullscreenElement){
            //   // console.dir(this.canvas);
            //   this.canvas.requestFullscreen();
            // } else {
            //   document.exitFullscreen();
            // }
          })
    }
}