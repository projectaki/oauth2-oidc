import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isLoading = new BehaviorSubject(true);
  public isLoading$ = this.isLoading.asObservable();

  public isAuthenticated$ = combineLatest([
    this.isLoading$,
    this.auth.isAuthenticated$,
  ]).pipe(
    filter(([isLoading, _]) => !isLoading),
    map(([_, isAuthenticated]) => isAuthenticated)
  );

  public user$ = combineLatest([
    this.isAuthenticated$,
    this.auth.userData$,
  ]).pipe(
    filter(([{ isAuthenticated }, _]) => isAuthenticated),
    map(([_, userData]) => userData.userData)
  );

  constructor(private auth: OidcSecurityService) {}
  public idTokenPayload = this.auth.getPayloadFromIdToken();

  initializeAuth() {
    return this.auth.checkAuth().pipe(
      tap((x) => this.isLoading.next(false)),
      catchError((err) => {
        this.isLoading.next(false);
        return of('Error logging in: ' + err);
      })
    );
  }

  logout() {
    return this.auth.logoffAndRevokeTokens();
  }

  login() {
    this.auth.authorize();
  }
}
