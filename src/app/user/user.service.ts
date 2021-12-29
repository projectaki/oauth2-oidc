import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUserInfo() {
    return of(
      new Promise<any>((res) => setTimeout(() => res({ id: 'yah' }), 2000))
    );
  }
}
