import { Component, OnInit } from '@angular/core';
import { Client } from '../../_models/client';
import { ClientsService } from '../../_services/clients.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-client-show',
  templateUrl: './client-show.component.html',
  styleUrls: ['./client-show.component.scss']
})
export class ClientShowComponent implements OnInit {
  client: Client;
  generalFeedback: any = [];
  empAssessments: any = [];

  constructor(private _clientsService: ClientsService,
              private bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  // UTILITIES

  /* Purpose: Close current modal */
  closeModal() {
    this.bsModalRef.hide();
  }

}
