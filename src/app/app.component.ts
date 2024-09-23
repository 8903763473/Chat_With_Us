import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './Services/api.service';
import { PushNotificationService } from './Services/pushNotification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userId: any;
  isLoading: boolean = false;

  constructor(public router: Router, public push: PushNotificationService) {
    if (localStorage.getItem('login') != 'true') {
      this.router.navigate(['/Login']);
    }
    this.userId = localStorage.getItem('userId')
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.push.getToken();
  }

  navigate(data: any) {
    this.router.navigate(['/' + data]);
  }

}
