import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Platform } from '@angular/cdk/platform';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: "root",
})
export class ApiService {
    constructor(private firebaseX: FirebaseX, private http: HttpClient, private push: Push,
        private platform: Platform) { }

    public baseUrl = "http://192.168.59.171:8589/api";


    Login(data: any) {
        return this.http.post(this.baseUrl + '/auth/login', data);
    }

    Register(data: any) {
        return this.http.post(this.baseUrl + '/auth/register', data);
    }

    GetOtp(deviceToken: any) {
        return this.http.post(this.baseUrl + '/auth/getOtp', deviceToken);
    }

}