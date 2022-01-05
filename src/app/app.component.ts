import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'oauth2-oidc';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.initializeAuth().subscribe();
    this.auth
      .getUserChangedEvent()
      .subscribe((value) => console.log('user data changed', value));
    // this.auth.user$.subscribe((x) => console.log('user', x));
    // this.auth.userInfo$.subscribe((x) => console.log('userinfo', x));
  }
}
