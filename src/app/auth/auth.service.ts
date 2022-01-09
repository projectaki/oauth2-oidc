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
  /** Loading observable which emits false when the login is
   * successfully completed. Initial value: true.
   */
  public isLoading$ = this.isLoading.asObservable();

  /**
   * Observable which emits true if the user is authenticated. This observable
   * relies on the isLoading$ observable, which means it will only emit its first value,
   * once the authentication has successfully completed. This is neccessary in Auth guards,
   * when all the routes have guards combined with auto login. This will prevent timing issue,
   * infinite loop redirects.
   */
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

  /**
   * Authentication initialization method. Subscribe to it once in app component to start auth process,
   * call backend for user info, set authenticated user state, and push false to isLoading$. If there is
   * an error with authentication, just logout to redirect to login as there is no unprotected pages.
   * @returns Returns the OidcSecurityService.checkAuth observable.
   */
  initializeAuth() {
    return this.auth.checkAuth().pipe(
      switchMap((x) => this.auth.userData$),
      switchMap((x) => this.userService.getUserInfo()),
      //tap(() => console.log(this.auth.getAccessToken())),
      //tap((x) => (this.user = 'user is set')),
      tap((x) => this.isLoading.next(false)),
      catchError((err) => {
        this.isLoading.next(false);
        return of('Error logging in: ' + err);
      })
    );
  }

  /**
   *
   * @returns Notification event.
   */
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

  loginCallback() {
    return this.auth.stsCallback$;
  }
}
