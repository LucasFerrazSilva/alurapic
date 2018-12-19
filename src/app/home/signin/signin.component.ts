import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../core/auth/auth.service";
import { Router } from "@angular/router";
import { PlatformDetectorService } from "../../core/platform-detector/platform-detector.service";

@Component({
    templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {

    loginForm: FormGroup;
    @ViewChild('userNameInput') userNameInput: ElementRef<HTMLInputElement>;


    constructor(
        private formBuilder: FormBuilder, 
        private authService: AuthService,
        private router: Router,
        private platformDetectorService: PlatformDetectorService
    ) {}

    ngOnInit(){
        this.loginForm = this.formBuilder.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
        
        if(this.platformDetectorService.isPlatformBrowser())
            this.userNameInput.nativeElement.focus();
    }

    login(){
        const userName = this.loginForm.get('userName').value;
        const password = this.loginForm.get('password').value;

        this.authService
                .authenticate(userName, password)
                .subscribe(
                    () => {
                        console.log('Autenticado');                        
                        this.router.navigate(['user', userName]); //ou this.router.navigateByUrl('user/' + userName); 
                    },
                    err => {
                        console.log(err);
                        this.loginForm.reset();
                        alert('Invalid username/password!');

                        if(this.platformDetectorService.isPlatformBrowser())
                            this.userNameInput.nativeElement.focus();
                    }
                );
    }
    
}