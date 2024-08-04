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

    // public baseUrl = "http://192.168.31.171:5000/api";
    public baseUrl = "http://localhost:5000/api";



    Login(data: any) {
        return this.http.post(this.baseUrl + '/auth/login', data);
    }

    Register(data: any) {
        return this.http.post(this.baseUrl + '/auth/register', data);
    }

    GetOtp(deviceToken: any) {
        return this.http.post(this.baseUrl + '/auth/getOtp', deviceToken);
    }

    verifyOTP(data: any) {
        return this.http.post(this.baseUrl + '/auth/verify-otp', data);
    }

    inviteUser(data: any) {
        return this.http.post(this.baseUrl + '/auth/inviteMail', data, { responseType: 'text' });
    }

    getAllUsers(data: any) {
        return this.http.get(this.baseUrl + '/user/getAllUsers/' + data);
    }

}