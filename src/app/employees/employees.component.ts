import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { EmployeesService } from '../_services/employees.service';
import { EmployeeShowComponent } from './employee-show/employee-show.component';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
	employeeShowModal: BsModalRef;
	errorMsg;
	employees;
	employee = {};
	empAssessments = {};
	bsModalRef: BsModalRef;

  constructor( private _employeeService: EmployeesService, 
  			   private modalService: BsModalService ) { }

	ngOnInit() {
		this.getAllEmployees();
	}

	getAllEmployees() {
	    this._employeeService.getAllEmployees()
      		.subscribe(data =>
      			this.employees = data, 
				error => this.errorMsg = error);
	}

	// modal display

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
	
}
