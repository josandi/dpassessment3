import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-assessments-add-edit',
  templateUrl: './assessments-add-edit.component.html',
  styleUrls: ['./assessments-add-edit.component.scss']
})
export class AssessmentsAddEditComponent implements OnInit {

  assessmentData;
  questionnairesData;
  title;
  closeBtnName;
  
  constructor(public bsModalRef: BsModalRef) { }

  showQuestionnaire(value) {
  }

  ngOnInit() {
    console.log(this.questionnairesData);
  }

  

}
