import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { EmployeesService } from '../_services/employees.service';
import { EmployeesAddEditComponent } from '../employees-add-edit/employees-add-edit.component';
import { EmployeeShowComponent } from './employee-show/employee-show.component';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

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

	deleteEmployee(employee) {
	    console.log("deleteEmployee clicked!");
	}

	// modal display

	showEmployee(employee) {
		this.employee = employee;

	    const initialState = {
		  employeeData: this.employee
	    };
	    this.bsModalRef = this.modalService.show(EmployeeShowComponent, {initialState});
	    this.bsModalRef.content.closeBtnName = 'Close';
	}

	showEdit(employee) {
	    this.employee = employee;

	    const initialState = {
	      employeeData: this.employee,
		  selectedPosition: 1,
	      title: 'Modal with component',
	      btnName: employee ? 'Update' : 'Save'
	    };
	    this.bsModalRef = this.modalService.show(EmployeesAddEditComponent, {initialState});
	    this.bsModalRef.content.closeBtnName = 'Close';
	}

}
