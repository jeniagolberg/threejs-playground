import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SceneComponent } from './scene/scene.component';
import { ActionsBarComponent } from './actions-bar/actions-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SceneComponent, ActionsBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'web-app';
}
