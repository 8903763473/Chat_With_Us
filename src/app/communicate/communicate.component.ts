import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebrtcService } from '../webrtc.service';

@Component({
  selector: 'app-communicate',
  templateUrl: './communicate.component.html',
  styleUrls: ['./communicate.component.scss'],
})
export class CommunicateComponent {

  @ViewChild('localVideo') localVideo: ElementRef | any;
  @ViewChild('remoteVideo') remoteVideo: ElementRef | any;
  targetUser: any;
  currentUser: any

  constructor(private webrtcService: WebrtcService) { }

  ionViewWillEnter() {
    this.currentUser = 'Vijay';
    this.currentUser = 'Ramya'; 
    this.webrtcService.setUsers(this.currentUser, this.targetUser);
  }

  async startCall() {
    this.webrtcService.setUsers(this.currentUser, this.targetUser);
    await this.webrtcService.startCall();
    this.localVideo.nativeElement.srcObject = this.webrtcService.getLocalStream();
    this.remoteVideo.nativeElement.srcObject = this.webrtcService.getRemoteStream();
  }

}
