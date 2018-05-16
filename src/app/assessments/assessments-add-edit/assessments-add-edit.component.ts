import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-assessments-add-edit',
  templateUrl: './assessments-add-edit.component.html',
  styleUrls: ['./assessments-add-edit.component.scss']
})
export class AssessmentsAddEditComponent implements OnInit {
  assessmentData: any;
  questionnaires: any;
  minDeadline: Date;
  
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    if(!this.assessmentData){
      this.assessmentData = {};
    }

    this.minDeadline = new Date();
  }

  saveAssessment() {
    console.log("Save clicked");
    console.log(this.assessmentData);
    this.bsModalRef.hide();
  }

  // modal display

  showQuestionnaire(questionnaireId) {
    console.log("Show questionnaire " + questionnaireId);
  }

}
