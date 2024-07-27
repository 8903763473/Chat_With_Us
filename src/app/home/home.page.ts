import { Component } from '@angular/core';
import { PushNotificationService } from '../Services/pushNotification.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public Push: PushNotificationService) { }

}
