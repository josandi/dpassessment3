import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { EmployeesService } from '../../_services/employees.service';

@Component({
  selector: 'app-employee-show',
  templateUrl: './employee-show.component.html',
  styleUrls: ['./employee-show.component.scss']
})
export class EmployeeShowComponent implements OnInit {
	errorMsg;
  closeBtnName: string;
  employeeData: any;
  empAssessments: any;

  constructor( public bsModalRef: BsModalRef,
                private _employeeService: EmployeesService ) { }

  ngOnInit() {
    this.getEmployeeAssessments(this.employeeData.aspNetUserID);
  }

	getEmployeeAssessments(empId) {
	    this._employeeService.getEmployeeAssessments(empId)
	    	.subscribe(data =>
	    		this.empAssessments = data, 
				error => this.errorMsg = error)
	}

}

