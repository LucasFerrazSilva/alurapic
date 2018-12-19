import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { lowerCaseValidator } from "src/app/shared/validators/lower-case.validator";
import { NewUser } from "./new-user";
import { SignupService } from "./signup.service";
import { UserNotTakenValidatorService } from "./user-not-taken.validator.service";
import { PlatformDetectorService } from "src/app/core/platform-detector/platform-detector.service";

@Component({
    templateUrl: './signup.component.html',
    providers: [
        UserNotTakenValidatorService
    ]
})
export class SignupComponent implements OnInit{

    signupForm: FormGroup;
    @ViewChild('inputEmail') emailInput: ElementRef<HTMLInputElement>;


    constructor(
        private formBuilder: FormBuilder,
        private userNotTakenValidatorService: UserNotTakenValidatorService,
        private signupService: SignupService,
        private router: Router,
        private platformDetectorService: PlatformDetectorService
    ){}


    ngOnInit(){
        this.signupForm = this.formBuilder.group({
            email: ['', [
                    Validators.required,
                    Validators.email
                ]
            ],
            fullName: ['', 
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(40)
                ]
            ],
            userName: [
                '', 
                [
                    Validators.required,
                    lowerCaseValidator,
                    Validators.minLength(2),
                    Validators.maxLength(30)
                ],
                this.userNotTakenValidatorService.checkUserNameTaken()
            ],
            password: ['', 
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(14)
                ]
            ]
        });

        if(this.platformDetectorService.isPlatformBrowser())
            this.emailInput.nativeElement.focus();
    }

    signup(){
        const newUser: NewUser = this.signupForm.getRawValue() as NewUser;

        this.signupService
            .signup(newUser)
            .subscribe(
                () => this.router.navigate(['']),
                err => console.log(err)
            );
    }

}