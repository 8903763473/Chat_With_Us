import { Component, OnInit } from '@angular/core';
import { PushNotificationService } from '../Services/pushNotification.service';
import { Router } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  onLogin: boolean = false;
  EnteredOTP: any

  constructor(public Pushotification: PushNotificationService, public app: AppComponent, private alertController: AlertController, public router: Router, public api: ApiService) { }

  ngOnInit() {
    this.onLogin = true;
    if (localStorage.getItem('login') == 'true') {
      this.router.navigate(['/home']);
    }
  }

  doLogin(event: Event) {
    event.preventDefault();
    const Email: any = document.getElementById('Email');
    const Password: any = document.getElementById('Password');
    let post = {
      "email": Email.value,
      "password": Password.value
    }
    if (post.email && post.password) {
      this.app.isLoading = true
      this.api.Login(post).subscribe({
        next: ((res: any) => {
          console.log(res);
          localStorage.setItem('token', res?.UserData?.token?.Token);
          localStorage.setItem('userId', res?.UserData?.user?._id);

          this.onLogin = false;
          this.app.isLoading = false;
          this.Pushotification.getToken();
        }), error: (err => {
          console.log(err);
          this.app.isLoading = false;
        })
      })
    }
  }

  doVerify() {
    if (this.EnteredOTP.length == 4) {
      this.app.isLoading = true;
      let post = {
        otp: this.EnteredOTP,
        userId: localStorage.getItem('userId')
      }
      this.api.verifyOTP(post).subscribe({
        next: (res => {
          console.log(res);
          this.app.isLoading = false;
          localStorage.setItem('login', 'true');
          this.presentAlert();
        }), error: (err => {
          console.log(err);
          this.app.isLoading = false;
        })
      })
    } else {
      alert('OTP length should not be less than four !')
    }
  }

  onOtpChange(event: any) {
    this.EnteredOTP = event;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      // subHeader: 'Subtitle',
      message: 'Verified Successfully',
      buttons: [{
        text: "let's go",
        handler: () => {
          this.router.navigate(['/home']);
        }
      }],
      backdropDismiss: false
    });
    await alert.present();
  }


  getOtptoDevice() {
    this.Pushotification.getToken()
  }

}
