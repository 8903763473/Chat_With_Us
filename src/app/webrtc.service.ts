import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebrtcService {
  private socket: Socket;
  private peerConnection: RTCPeerConnection | any;
  private localStream: MediaStream | any;
  private remoteStream: MediaStream | any;
  public onIncomingCall: (from: string) => void = () => {};

  constructor() {
    this.socket = io('http://192.168.31.171:5000', {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Listen for incoming call
    this.socket.on('incomingCall', (data) => {
      console.log(`Incoming call from ${data.from}`);
      if (this.onIncomingCall) {
        this.onIncomingCall(data.from);
      }
    });

    // Listen for signals
    this.socket.on('signal', async (data) => {
      if (data.signal.candidate) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
      }

      if (data.signal.sdp) {
        if (data.signal.sdp.type === 'offer') {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal.sdp));
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);
          this.socket.emit('signal', {
            room: data.room,
            signal: { sdp: answer },
          });
        } else if (data.signal.sdp.type === 'answer') {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal.sdp));
        }
      }
    });
  }

  public joinRoom(roomId: string) {
    this.socket.emit('join', roomId);
  }

  public async startCall(isCaller: boolean, roomId: string) {
    this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.remoteStream = new MediaStream();

    this.peerConnection = new RTCPeerConnection();

    this.localStream.getTracks().forEach((track: any) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.ontrack = (event: any) => {
      event.streams[0].getTracks().forEach((track: any) => {
        this.remoteStream.addTrack(track);
      });
    };

    this.peerConnection.onicecandidate = (event: any) => {
      if (event.candidate) {
        this.socket.emit('signal', {
          room: roomId,
          signal: { candidate: event.candidate },
        });
      }
    };

    if (isCaller) {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.socket.emit('signal', {
        room: roomId,
        signal: { sdp: offer },
      });
    }

    return { localStream: this.localStream, remoteStream: this.remoteStream };
  }

  public callUser(from: string, to: string) {
    this.socket.emit('call', { from, to });
  }

  public async acceptCall(roomId: string) {
    return await this.startCall(false, roomId);
  }
}
