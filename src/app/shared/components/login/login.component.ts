import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../../../interfaces';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { AuthService } from '../../services/auth.service';
declare var $: any;
interface FormResult { error: boolean; message: string; }
@Component({
    selector: 'login-form',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    constructor(public translatePipe: TranslatePipe, public authService: AuthService, public router: Router) { }
    public model: IUser = { username: '', password: '' };
    public rememberLog = false;
    public formResult: FormResult;
    public ngOnInit(): void {
        $('#loginModal').on('show.bs.modal', event => {
            const button = $(event.relatedTarget);
            const modal = $(this);
        });
    }
    public submit(event: any): void {
        this.authService.loggIn(this.model.username, this.model.password).subscribe(
            val => {
                this.authService.storeUserData(val, this.rememberLog);
                this.formResult = { error: false, message: this.translatePipe.transform('login success') };
                $('#loginModal').modal('hide');
                this.router.navigate(['/']);
            }, err => {
                this.formResult = { error: true, message: this.translatePipe.transform('incorrect password') };
                $('.formAlert').fadeIn(() => { setTimeout(() => {
                        $('.formAlert').fadeOut(() => { this.formResult = { error: false, message: '' }; });
                    }, 2000);
                });
            }
        );
    }
}
