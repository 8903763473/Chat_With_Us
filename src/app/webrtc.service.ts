import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebrtcService {
  private socket: Socket | any;
  private localStream: MediaStream | any;
  private remoteStream: MediaStream | any;
  private peerConnection: RTCPeerConnection;
  private servers: any = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  };
  private currentUser: string | any;
  private targetUser: string | any;

  // Constants
  private readonly SERVER_URL = 'http://localhost:8100/';
  private readonly RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_INTERVAL = 2000; // 2 seconds

  private reconnectAttempts = 0;

  constructor() {
    console.log('Connecting to:', this.SERVER_URL);

    this.connectSocket();

    this.peerConnection = new RTCPeerConnection(this.servers);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('candidate', { candidate: event.candidate, targetUser: this.targetUser });
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream.addTrack(event.track);
    };

    this.socket.on('offer', (data: any) => {
      if (data.targetUser === this.currentUser) {
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        this.createAnswer();
      }
    });

    this.socket.on('answer', (data: any) => {
      if (data.targetUser === this.currentUser) {
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    this.socket.on('candidate', (data: any) => {
      if (data.targetUser === this.currentUser) {
        this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });
  }

  private connectSocket() {
    this.socket = io(this.SERVER_URL, {
      withCredentials: true, // Ensure credentials are sent with the request
      transports: ['websocket', 'polling'], // Specify transport mechanisms
    });

    this.socket.on('connect', () => {
      console.log('Connected to server with ID:', this.socket.id);
      this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Connection Error:', error);
      this.handleReconnect();
    });

    this.socket.on('disconnect', () => {
      console.warn('Disconnected from server');
      this.handleReconnect();
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket Error:', error);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.RECONNECT_ATTEMPTS) {
      setTimeout(() => {
        this.reconnectAttempts++;
        console.log(`Reconnecting attempt ${this.reconnectAttempts}/${this.RECONNECT_ATTEMPTS}`);
        this.connectSocket();
      }, this.RECONNECT_INTERVAL);
    } else {
      console.error('Max reconnect attempts reached. Could not reconnect.');
    }
  }

  setUsers(currentUser: string, targetUser: string) {
    this.currentUser = currentUser;
    this.targetUser = targetUser;
  }

  async startCall() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.localStream.getTracks().forEach((track: any) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.remoteStream = new MediaStream();
    this.createOffer();
  }

  async createOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socket.emit('offer', { offer, targetUser: this.targetUser });
  }

  async createAnswer() {
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.socket.emit('answer', { answer, targetUser: this.targetUser });
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream() {
    return this.remoteStream;
  }
}
