import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TranslatePipe } from "./pipes/translate.pipe";
import { LoaderComponent } from "./components/loader-component/loader.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { TimeAgoPipe } from "./pipes/timeAgo.pipe";
import { TranslationService } from "./services/translation.service";
import { HeaderService, BROWSER_FAVICONS_CONFIG } from "./services/header.service";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { LoaderService } from "./services/loader.service";
import { SocketService } from "./services/socket.service";
import { ChatService } from "./services/chat.service";
import { NotificationService } from "./services/notification.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    imports: [
        FormsModule,
        RouterModule,
        CommonModule
    ],
    declarations: [
        TranslatePipe,
        LoaderComponent,
        LoginComponent,
        RegisterComponent,
        TimeAgoPipe
    ],
    exports: [
        LoaderComponent,
        FormsModule,
        TranslatePipe,
        RouterModule,
        CommonModule,
        LoginComponent,
        RegisterComponent,
        TimeAgoPipe,
        ReactiveFormsModule
    ],
    providers: [
        TranslationService,
        HeaderService,
        AuthService,
        UserService,
        LoaderService,
        TranslatePipe,
        SocketService,
        ChatService,
        TimeAgoPipe,
        NotificationService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: BROWSER_FAVICONS_CONFIG,
            useValue: {
                icons: {
                    default: {
                        type: 'image/png',
                        href: './assets/favicon/favicon24.png',
                        isDefault: true
                    }
                },
                cacheBusting: true
            }
        }
    ],
})
export class SharedModule {
    static forRoot(): any {
        return {
            ngModule: SharedModule,
            providers: [
                LoaderService,
                HeaderService,
                AuthService,
                UserService,
                TranslatePipe,
                TranslationService,
                SocketService,
                ChatService,
                TimeAgoPipe,
                NotificationService,
                {
                    provide: BROWSER_FAVICONS_CONFIG,
                    useValue: {
                        icons: {
                            default: {
                                type: 'image/png',
                                href: './assets/favicon/favicon24.png',
                                isDefault: true
                            }
                        },
                        cacheBusting: true
                    }
                }
            ],
        };
    }
}
