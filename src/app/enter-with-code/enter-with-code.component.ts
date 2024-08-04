import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoService } from '../Services/CryptoService';
import { AppComponent } from '../app.component';
import { ApiService } from '../Services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-enter-with-code',
  templateUrl: './enter-with-code.component.html',
  styleUrls: ['./enter-with-code.component.scss'],
})
export class EnterWithCodeComponent implements OnInit {
  decryptedData: any

  onLogin: boolean = false;
  EnteredCode: any

  constructor(public cryptoService: CryptoService, public app: AppComponent, private alertController: AlertController, public router: Router, public api: ApiService) { }

  // constructor(public router: Router) { }

  ngOnInit() {
    console.log(this.router.url.split('/'));
    const SplitPath: any = this.router.url.split('/');
    const IV: any = SplitPath[2];
    const EncryptedData: any = SplitPath[3];
    // const Key: any = SplitPath[4];

    this.DecryptData(IV, EncryptedData)
  }

  DecryptData(IV, EncryptedData) {
    const Data: any = this.cryptoService.decrypt(IV, EncryptedData);
    console.log(JSON.parse(Data));
    this.decryptedData = JSON.parse(Data)
  }

  doVerify() {
    const Code: any = document.getElementById('EnterCode')
    this.EnteredCode = Code.value

    if (this.decryptedData.code == this.EnteredCode) {
      alert('Verified Successful')
    } else {
      alert('Verification Failed')
    }
  }

  // onOtpChange(event) {
  //   const Code: any = document.getElementById('EnterCode')
  //   this.EnteredCode = Code.value
  // }

}
