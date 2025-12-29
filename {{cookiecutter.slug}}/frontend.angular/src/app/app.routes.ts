import { Routes } from '@angular/router';

import { Home } from './home/home';
{% - if cookiecutter.basic_authentication == "Yes, please!" -%}
import { Login } from './user/login/login';
import { Register } from './user/register/register';
import { VerifyEmail } from './user/verify-email/verify-email';
import { PasswordForgotten } from './user/password-forgotten/password-forgotten';
import { ResetPassword } from './user/reset-password/reset-password';
import { UserSettings } from './user/user-settings/user-settings';
import { LoggedOnGuard } from './guards/logged-on.guard';
{% endif %}

const routes: Routes = [
    {
        path: 'home',
        component: Home,
    },
{%- if cookiecutter.basic_authentication == "Yes, please!" -%}
    {
        path: 'login',
            component: Login,
        },
    {
        path: 'register',
            component: Register,
        },
    {
        path: 'confirm-email/:key',
            component: VerifyEmail,
        },
    {
        path: 'password-forgotten',
            component: PasswordForgotten;
    },
    {
        path: 'reset-password/:uid/:token',
            component: ResetPassword;
    },
    {
        path: 'user-settings',
            canActivate: [LoggedOnGuard],
                component: UserSettings;
    },
{%- endif -%}
    {
        path: '',
            redirectTo: '/home',
                pathMatch: 'full';
    }
];

export { routes };
