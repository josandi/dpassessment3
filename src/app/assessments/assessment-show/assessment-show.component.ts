import { Component, OnInit } from '@angular/core';
import { AssessmentsService } from '../../_services/assessments.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AssessmentEmployeeComponent } from '../assessment-employee/assessment-employee.component';

@Component({
  selector: 'app-assessment-show',
  templateUrl: './assessment-show.component.html',
  styleUrls: ['./assessment-show.component.scss']
})
export class AssessmentShowComponent implements OnInit {
  assessmentShowModal: BsModalRef;
  errorMsg;
  assessment: any;
  empAssessmentStatus: any;

  constructor(private bsModalRef: BsModalRef,
              private modalService: BsModalService,
              private _assessmentService: AssessmentsService ) { }

  ngOnInit() {
    this.getEmpAssessmentStatus();
  }

  // MAIN FUNCTIONS

  /* Purpose: get all employees with the status for the current assessment */
  getEmpAssessmentStatus() {
    this._assessmentService.getEmpAssessmentStatus(this.assessment.assessmentId)
      .subscribe(data =>
        this.empAssessmentStatus = data.listOfEmp, 
        error => this.errorMsg = error
      );
  }

  // MODAL DISPLAY

  /* Purpose: display employee assessment for the selected employee */
  showEmployeeAssessment(employee) {
    const initialState = {
      employee: employee,
      assessment: this.assessment
    }    
    this.assessmentShowModal = this.modalService.show(
      AssessmentEmployeeComponent, 
      Object.assign({initialState}, { class: 'modal-lg' })
    );
  }

  // UTILITIES

  /* Purpose: hide current modal */
  closeModal() {
    this.bsModalRef.hide();
  }

}
