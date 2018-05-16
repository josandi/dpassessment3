import { Component, OnInit } from '@angular/core';
import { AssessmentsService } from '../../_services/assessments.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-assessment-show',
  templateUrl: './assessment-show.component.html',
  styleUrls: ['./assessment-show.component.scss']
})
export class AssessmentShowComponent implements OnInit {
  errorMsg;
  assessment: any;
  EmpAssessmentStatus: any;

  constructor(public bsModalRef: BsModalRef,
              private _assessmentService: AssessmentsService ) { }

  ngOnInit() {
    this.getEmpAssessmentStatus();
  }

  getEmpAssessmentStatus() {
    this._assessmentService.EmpAssessmentStatus()
      .subscribe(data =>
        this.EmpAssessmentStatus = data, 
        error => this.errorMsg = error);
  }

  // modal display

  showEmployeeAssessment(employee) {
    console.log(employee.fullname + " - " + employee.status);
  }

}
