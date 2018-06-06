import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  user: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.setUserDetails();
  }

  /* Purpose: Set sidebar's user details */
  setUserDetails() {
    this.user.fullname = localStorage.getItem('dpa-fullname');
    this.user.role = localStorage.getItem('dpa-role');
    this.user.isAdmin = this.authService.isAdmin();
  }

}
