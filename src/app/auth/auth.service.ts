import { Injectable } from '@angular/core';
import {
  EventTypes,
  OidcSecurityService,
  PublicEventsService,
} from 'angular-auth-oidc-client';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: string = '';
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

  public userInfo$ = this.user$.pipe(
    switchMap(() => this.userService.getUserInfo())
  );

  constructor(
    private auth: OidcSecurityService,
    private userService: UserService,
    private eventService: PublicEventsService
  ) {}

  initializeAuth() {
    return this.auth.checkAuth().pipe(
      switchMap((x) => this.auth.userData$),
      switchMap((x) => this.userService.getUserInfo()),
      tap(() => console.log(this.auth.getAccessToken())),
      tap((x) => (this.user = 'user is set')),
      tap((x) => this.isLoading.next(false)),
      catchError((err) => {
        this.isLoading.next(false);
        return of('Error logging in: ' + err);
      })
    );
  }

  getUserChangedEvent() {
    return this.eventService
      .registerForEvents()
      .pipe(
        filter(
          (notification) => notification.type === EventTypes.UserDataChanged
        )
      );
  }

  getUser() {
    return this.user;
  }

  logout() {
    return this.auth.logoffAndRevokeTokens();
  }

  login() {
    this.auth.authorize();
  }
}
