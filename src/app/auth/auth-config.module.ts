import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';
import { pkceConfig } from './pkce-config';
import { auth0Config } from './auth0-config';

@NgModule({
  imports: [AuthModule.forRoot(auth0Config)],
  exports: [AuthModule],
})
export class AuthConfigModule {}
