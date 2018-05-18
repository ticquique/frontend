import { Component, OnInit, HostListener } from '@angular/core';
import { IUser } from '../../../../interfaces';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
declare var $: any;
interface FormResult { error: boolean; message: string; }

@Component({
    selector: 'register-form',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    constructor(public translatePipe: TranslatePipe, public authService: AuthService) { }
    public model: IUser = { username: '', email: '', role: 'artist' };
    public formResult: FormResult;
    public submit(event: any): void {
        this.authService.register(this.model.username, this.model.role, this.model.email).subscribe(
            val => {
                this.formResult = { error: false, message: this.translatePipe.transform('Go to your email to confirm') };
                $('.formAlert.alert-success').fadeIn(() => {
                    setTimeout(() => { $('.formAlert.alert-success').fadeOut(() => {
                        $('#registerModal').modal('hide');
                    }); }, 2000);
                });
            },
            err => {
                this.formResult = { error: true, message: err.error.message };
                $('.formAlert.alert-danger').fadeIn(() => {
                    setTimeout(() => { $('.formAlert.alert-danger').fadeOut(); }, 2000);
                });
            }
        );
    }
    ngOnInit(): void {
        $('#registerModal').on('show.bs.modal', event => {
            const button = $(event.relatedTarget);
            const modal = $(this);
        });
    }
}
