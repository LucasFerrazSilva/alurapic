import { Injectable } from "@angular/core";
import { TokenService } from "../token/token.service";
import { Subject, BehaviorSubject } from "rxjs";
import { User } from "./user.interface";
import * as jwt_decode from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private userSubject = new BehaviorSubject<User>(null);
    private userName: string;
    

    constructor(private tokenService: TokenService){
        if(this.tokenService.hasToken())
            this.decodeAndNotify();
    }


    setToken(token: string){
        this.tokenService.setToken(token);
        this.decodeAndNotify();
    }

    getUser(){
        return this.userSubject.asObservable();
    }

    private decodeAndNotify(){
        const token = this.tokenService.getToken();
        const user = jwt_decode(token) as User; //decodifica o Payload do token
        this.userName = user.name;
        this.userSubject.next(user);
    }

    logout(){
        this.tokenService.removeToken();
        this.userSubject.next(null);
    }

    isLogged(){
        return this.tokenService.hasToken();
    }

    getUserName(){
        return this.userName;
    }

}