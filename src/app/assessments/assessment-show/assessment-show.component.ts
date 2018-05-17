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
  EmpAssessmentStatus: any;

  constructor(private bsModalRef: BsModalRef,
              private modalService: BsModalService,
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
    const initialState = {
      employee: employee,
      assessment: this.assessment
    }    
    this.assessmentShowModal = this.modalService.show(
      AssessmentEmployeeComponent, 
      Object.assign({initialState}, { class: 'modal-lg' })
    );
  }

  // utilities

  closeModal() {
    this.bsModalRef.hide();
  }

}
