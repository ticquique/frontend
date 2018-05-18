import { AuthService } from './auth.service';
import { environment } from './../../../environments/environment';
import { IConversation } from './../../../interfaces/chat/conversation';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';
import { IUser } from '../../../interfaces';

@Injectable()
export class SocketService {

    public socket: BehaviorSubject<SocketIOClient.Socket> = new BehaviorSubject<SocketIOClient.Socket>(null);

    constructor(private authService: AuthService) {
        this.authService.authToken.subscribe(token => {
            if (token) {
                const currentSocket = io(`${environment.api.url}`, { secure: true, query: `token=${token}` });
                this.socket.next(currentSocket);
            } else if (this.socket.getValue()) {
                this.socket.getValue().disconnect();
                this.socket.next(null);
            }
        });
    }
}
