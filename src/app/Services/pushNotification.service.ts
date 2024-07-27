import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Platform } from '@angular/cdk/platform';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({
    providedIn: "root",
})
export class PushNotificationService {
    constructor(private firebaseX: FirebaseX, private http: HttpClient, private push: Push,
        private platform: Platform, public api: ApiService) { }

    async getToken() {
        console.log('Called');

        if (this.platform.IOS) {
            const options: PushOptions = {
                ios: {
                    alert: 'true',
                    badge: true,
                    sound: 'false'
                }
            }
            this.push.hasPermission()
                .then((res: any) => {
                    if (res.isEnabled) {
                        const pushObject: PushObject = this.push.init(options);
                        pushObject.on('registration').subscribe((registration: any) => (
                            console.log(registration)
                        ));
                    } else {

                    }
                });
        }
        if (this.platform.ANDROID) {
            let token = await this.firebaseX.getToken();
            // await this.firebaseX.grantPermission();
            console.log('Deveice Token', token)
            // const TOKEN = 'fTKdUKajSCq039AqkXQcNN:APA91bEH3AnQfNl6stXOvXvA69KAjawV2UKZOeWFSNnYHcwqyX3mFI31yKynRUlXvudMGRGv1t58HUyfPXMpvXa8AiUrmNdu21_hnDiIPP1c65K6clrKGBNpVi15X9ODU12M9456ENHw'
            this.sendTokenToServer(token);
        }
        // const TOKEN = 'fTKdUKajSCq039AqkXQcNN:APA91bEH3AnQfNl6stXOvXvA69KAjawV2UKZOeWFSNnYHcwqyX3mFI31yKynRUlXvudMGRGv1t58HUyfPXMpvXa8AiUrmNdu21_hnDiIPP1c65K6clrKGBNpVi15X9ODU12M9456ENHw'
        // this.sendTokenToServer(TOKEN);

    }

    sendTokenToServer(deviceToken: any) {
        let post = {
            token: deviceToken
        }
        this.api.GetOtp(post).subscribe({
            next: (res => {
                console.log('notification Sent');
            }), error: (err => {
                console.log('Error while Sent');
            })
        })
    }

}