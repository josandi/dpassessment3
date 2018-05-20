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

  // API GET

  getEmpAssessmentStatus() {
    this._assessmentService.getEmpAssessmentStatus()
      .subscribe(data =>
        this.EmpAssessmentStatus = data, 
        error => this.errorMsg = error,
        () => {                                       // TEMPORARY: remove once endpoint is done
          this.EmpAssessmentStatus.forEach(emp => {
            emp.status = 'Unanswered';
          });
        }
      );
  }

  // MODAL DISPLAY

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

  closeModal() {
    this.bsModalRef.hide();
  }

}
