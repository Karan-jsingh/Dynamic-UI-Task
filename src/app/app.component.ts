import { Component } from '@angular/core';
import { UserManagerComponent } from './features/user-manager/user-manager.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserManagerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
