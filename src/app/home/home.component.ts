import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // This loads after authentication has been initialized
    console.log('IN HOME CTOR');
    const user = this.auth.getUser();
    console.log('User string', user);
  }

  logout() {
    this.auth.logout().subscribe();
  }

  nav() {
    this.router.navigate(['protected']);
  }
}
