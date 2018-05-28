import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { EmployeesService } from '../_services/employees.service';
import { EmployeeShowComponent } from './employee-show/employee-show.component';
import { Employee } from '../_models/employee';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
	employeeShowModal: BsModalRef;
	errorMsg;
	employees: Employee[];
	employee = {};
	empAssessments = {};
  pagination: Pagination;
  bsModalRef: BsModalRef;

  constructor(private _employeeService: EmployeesService, 
              private modalService: BsModalService,
              private route: ActivatedRoute,
              private alertify: AlertifyService ) { }

	ngOnInit() {
		this.route.data.subscribe(data => {
      this.employees = data['employees'].result;
      this.pagination = data['employees'].pagination;
    })
  }

  /* Purpose: get list of employees */
	loadEmployees() {
	    this._employeeService.getAllEmployees(this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe((res: PaginatedResult<Employee[]>) => {
          this.employees = res.result;
          this.pagination = res.pagination;
        }, error => {
          this.alertify.error(error);
        });
  }

	// MODAL DISPLAY

  /* Purpose: show detail of selected employee */
	showEmployee(employee) {
		this.employee = employee;

	  const initialState = {
		  employeeData: this.employee
	  };
	  this.employeeShowModal = this.modalService.show(
			EmployeeShowComponent,
			Object.assign({initialState}, { class: 'modal-md' })
		);
  }
  
  // UTILITIES

  /* Purpose: retrieve next set of data based on the pagination */
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadEmployees();
  }
	
}
