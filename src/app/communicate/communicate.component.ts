import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebrtcService } from '../webrtc.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-communicate',
  templateUrl: './communicate.component.html',
  styleUrls: ['./communicate.component.scss'],
})
export class CommunicateComponent implements OnInit {
  @ViewChild('localAudio') localAudio: ElementRef | any;
  @ViewChild('remoteAudio') remoteAudio: ElementRef | any;
  incomingCall: string | null = null;

  constructor(private webrtcService: WebrtcService, public app: AppComponent) {
    // Handle incoming call notifications
    this.webrtcService.onIncomingCall = (from: string) => {
      this.incomingCall = from;
    };
  }

  ngOnInit() {
    this.webrtcService.joinRoom(this.app.userId); // Join room on component init
  }

  async startCall() {
    const { localStream, remoteStream } = await this.webrtcService.startCall(true, this.app.userId);

    this.localAudio.nativeElement.srcObject = localStream;
    this.remoteAudio.nativeElement.srcObject = remoteStream;
    this.localAudio.nativeElement.muted = true; // Ensure local audio is muted

    // Notify other user of the call
    this.webrtcService.callUser(this.app.userId, '66a6155c08afe53de15dfc5b'); // Replace 'user2' with the actual user ID
  }

  async acceptCall() {
    if (this.incomingCall) {
      const { localStream, remoteStream } = await this.webrtcService.acceptCall(this.incomingCall);

      this.localAudio.nativeElement.srcObject = localStream;
      this.remoteAudio.nativeElement.srcObject = remoteStream;
      this.localAudio.nativeElement.muted = true; // Ensure local audio is muted

      this.incomingCall = null;
    }
  }

  declineCall() {
    this.incomingCall = null;
  }
}
