import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { EmployeesService } from '../../_services/employees.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AssessmentEmployeeComponent } from '../../assessments/assessment-employee/assessment-employee.component';

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

  constructor(public bsModalRef: BsModalRef,
              private modalService: BsModalService,
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

  showEmployeeAssessment(assessment) {
	  const initialState = {
      employee: this.employeeData,
		  assessment: assessment
	  };
	  this.bsModalRef = this.modalService.show(
			AssessmentEmployeeComponent,
			Object.assign({initialState}, { class: 'modal-lg' })
		);
  }
  
}

