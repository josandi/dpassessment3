import { Component, OnInit } from '@angular/core';
import { Client } from '../_models/client';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { ClientsService } from '../_services/clients.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ClientShowComponent } from './client-show/client-show.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  errorMsg;
  clients: Client[];
  pagination: Pagination;
  clientShowModal: BsModalRef;

  constructor(private _clientsService: ClientsService,
              private route: ActivatedRoute,
              private alertify: AlertifyService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.clients = data['clients'].result;
      this.pagination = data['clients'].pagination;
    });
  }

  // MAIN FUNCTIONS

  /* Purpose: retrieves list of clients */
  loadClients() {
    this._clientsService.getAllClients(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res: PaginatedResult<Client[]>) => {
        this.clients = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

  // MODAL DISPLAYS

  /* Purpose: shows details of specific client */
  showClient(client) {
    const initialState = {
		  client: client
	  };
	  this.clientShowModal = this.modalService.show(
			ClientShowComponent,
			Object.assign({initialState}, { class: 'modal-md' })
		);
  }

  // UTILITIES
  
  /* Purpose: retrieve next set of data based on the pagination */
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadClients();
  }
}
