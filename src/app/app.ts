import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TrailersList } from "./trailers-list/trailers-list";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TrailersList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gw-rental-app');
}
