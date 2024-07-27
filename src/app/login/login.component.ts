import { Component, OnInit } from '@angular/core';
import { PushNotificationService } from '../Services/pushNotification.service';
import { Router } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  showTotst: boolean = false;

  constructor(public Pushotification: PushNotificationService, private alertController: AlertController, public router: Router, public api: ApiService) { }

  ngOnInit() {
    this.showTotst = false
    if (localStorage.getItem('login') != 'true') {
      this.router.navigate(['/Login']);
    }
  }

  doLogin(event: Event) {
    event.preventDefault();
    const Email: any = document.getElementById('Email');
    const Password: any = document.getElementById('Password');
    let post = {
      "email": Email.value,
      "password": Password
    }
    if (post.email && post.password) {
      this.api.Login(post).subscribe({
        next: ((res: any) => {
          console.log(res);
          localStorage.setItem('login', 'true');
          localStorage.setItem('token', res?.token);
          this.presentAlert();
        }), error: (err => {
          console.log(err);
        })
      })
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }


  getOtptoDevice() {
    this.Pushotification.getToken()
  }

}
