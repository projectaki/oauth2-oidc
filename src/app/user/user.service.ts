import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUserInfo() {
    return from(
      new Promise<any>((res) => setTimeout(() => res({ id: 'yah' }), 2000))
    );
  }
}
