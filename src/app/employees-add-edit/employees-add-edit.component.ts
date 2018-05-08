import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-employees-add-edit',
  templateUrl: './employees-add-edit.component.html',
  styleUrls: ['./employees-add-edit.component.css']
})
export class EmployeesAddEditComponent implements OnInit {

  title: string;
  closeBtnName: string;
  employeeData;
  positionList;

  constructor(public bsModalRef: BsModalRef) {}
 
  ngOnInit() {
    console.log(this.positionList);
  }

}
