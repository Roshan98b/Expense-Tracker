import { Component, OnInit } from '@angular/core';

import { TransactionService } from '../../../../../services/transaction/transaction.service';
import { GroupService } from '../../../../../services/group/group.service';
import { UserService } from '../../../../../services/user/user.service';

declare var $ :any;

@Component({
  selector: 'app-unapproved',
  templateUrl: './unapproved.component.html',
  styleUrls: ['./unapproved.component.css']
})
export class UnapprovedComponent implements OnInit {

  constructor(
  	private transactionService: TransactionService,
  	private groupService: GroupService,
  	private userService: UserService
   ) { }

  selected = {};
  active;

  ngOnInit() {
  	this.changeStatus();
    this.active = this.groupService.active;  	
    this.groupService.getAllMembers(() => {});
  }

  ngDoCheck() {
    if(this.active !== this.groupService.active) {
    	this.changeStatus();
      this.active = this.groupService.active;
      this.groupService.getAllMembers(() => {});
    }
  }

  getUnapprovedTransactions() {
  	this.transactionService.getUnapprovedTransactions(this.groupService.active._groupId).subscribe(
  		(model: any[]) => {
  			this.transactionService.unapproved = model;
  		},
  		(err) => {
  			console.log(err);
  		}
  	);
  }

  changeStatus() {
  	this.transactionService.changeStatus(this.groupService.active._groupId).subscribe(
  		(model) => {
  			this.getUnapprovedTransactions();
  		},
  		(err) => {
  			console.log(err);
  		}
  	);
  }

  checkGH(i) {
    if(this.groupService.active.gh) return true;
    else return false;
  }

  checkUser(i) {
    if(i._Uid == this.userService.user._id) return true;
    else return false;
  }

  onView(i) {
    this.selected = {
      _id: i._id,
      _Uid: i._Uid,
      transactionName: i.transactionName,
      amount: i.amount,
      expenseDate: i.expenseDate,
      uploadDate: i.uploadDate,
      expenseType: i.expenseType,
      comments: i.comments,
      initial: []
    }
    this.add(this.selected, i);
  }

  add(selected, i) {
    for(let j = 0 ; j < i.initial.length ; j++) {
      if(this.groupService.allMembers[j])
      selected.initial.push(
        {
          email: this.groupService.allMembers[j].email,
          amount: i.initial[j].amount
        }
      );
    }
  }

  onMove(i) {
    i.poll = 0;
    this.transactionService.updateToInitial(i).subscribe(
      (model) => {
        this.changeStatus();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onDelete(i) {
    $("#view").modal("hide");
    this.transactionService.deleteTransaction(i._id).subscribe(
      (message) => {
        this.changeStatus();
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
