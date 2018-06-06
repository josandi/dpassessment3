import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-layout',
  template: `
    <app-sidebar></app-sidebar>
    <div class="dpa-page">
      <app-topbar></app-topbar>
      <div class="page-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: []
})
export class UserLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
