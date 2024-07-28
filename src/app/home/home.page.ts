import { Component } from '@angular/core';
import { PushNotificationService } from '../Services/pushNotification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public router: Router) { }

  doLogout(event: any) {
    event.preventDefault();
    localStorage.clear();
    this.router.navigate(['/Login']);
  }

}
