import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  constructor(private alertController: AlertController, public router: Router, public app: AppComponent, public api: ApiService) { }

  ngOnInit() {
    if (localStorage.getItem('login') == 'true') {
      this.router.navigate(['/home']);
    }
  }


  doRegister(event: any) {
    event?.preventDefault();
    const Name: any = document.getElementById('Name');
    const Email: any = document.getElementById('EmailId');
    const Password: any = document.getElementById('userPassword');
    const Mobile: any = document.getElementById('Mobile');
    const Native: any = document.getElementById('Native');

    let post = {
      "userInfo": {
        "name": Name.value,
        "email": Email.value,
        "native": Native.value,
        "password": Password.value,
        "mobile": Mobile.value,
        "otp": null
      },
      "aboutInfo": {
        "name": Name.value,
        "email": Email.value,
        "mobile": Mobile.value,
        "aboutMe": "Software Developer"
      },
      "personalInfo": {
        "name": Name.value,
        "email": Email.value,
        "mobile": Mobile.value,
        "aboutMe": "Loves coding"
      },
      "privacy": {
        "allowtoViewProfilePhoto": "Everyone",
        "lastSeen": "2024-07-26T12:00:00Z",
        "status": "Everyone",
        "readReceipts": true,
        "allowtoAddinGroups": "Everyone"
      },
      "security": {
        "allowNotification": true
      },
      "screenMode": {
        "theme": "dark"
      }
    }

    console.log(post);


    this.api.Register(post).subscribe({
      next: (res => {
        console.log(res);
        this.presentAlert('Success', 'Registered Successfully', 'Login Now', 1);
      }), error: (err => {
        console.log(err);
        this.presentAlert('Error', 'Error while Register', 'Try again', 2)
      })
    })
  }

  async presentAlert(header: any, message: any, text: any, id: any) {
    const alert = await this.alertController.create({
      header: header,
      // subHeader: 'Subtitle',
      message: message,
      buttons: [{
        text: text,
        handler: () => {
          id == 1 ? this.router.navigate(['/Login']) : this.doRegister(null);
        }
      }],
      backdropDismiss: false
    });
    await alert.present();
  }

}
