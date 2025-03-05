import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
{%- if cookiecutter.basic_authentication == "Yes, please!" -%}
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { VerifyEmailComponent } from './user/verify-email/verify-email.component';
import { PasswordForgottenComponent } from './user/password-forgotten/password-forgotten.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';
import { LoggedOnGuard } from './guards/logged-on.guard';
{% endif %}

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {%- if cookiecutter.basic_authentication == "Yes, please!" -%}
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'confirm-email/:key',
        component: VerifyEmailComponent,
    },
    {
        path: 'password-forgotten',
        component: PasswordForgottenComponent
    },
    {
        path: 'reset-password/:uid/:token',
        component: ResetPasswordComponent
    },
    {
        path: 'user-settings',
        canActivate: [LoggedOnGuard],
        component: UserSettingsComponent
    },
    {% endif %}
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

export { routes };
