import { Component, OnInit } from '@angular/core';

import { TransactionService } from '../../../../../services/transaction/transaction.service';
import { GroupService } from '../../../../../services/group/group.service';
import { UserService } from '../../../../../services/user/user.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})
export class CompletedComponent implements OnInit {

  constructor(
  	private transactionService: TransactionService,
  	private groupService: GroupService,
  	private userService: UserService
   ) { }

  selected = {};
  active;
  content: boolean;

  ngOnInit() {
  	this.getCompletedTransactions();
    this.active = this.groupService.active;    
    this.groupService.getAllMembers(() => {});
  }

  ngDoCheck() {
    if(this.active !== this.groupService.active) {
    	this.checkComplete();
      this.active = this.groupService.active;
      this.groupService.getAllMembers(() => {});
    }
  }  

  getCompletedTransactions() {
  	this.transactionService.getCompletedTransactions(this.groupService.active._groupId).subscribe(
  		(model: any[]) => {
  			this.transactionService.completed = model;
        if(this.transactionService.completed.length == 0)
          this.content = false;
        else
          this.content = true;
  		},
  		(err) => {
  			console.log(err);
  		}
  	);
  }

  checkComplete() {
    this.transactionService.checkComplete(this.groupService.active._groupId).subscribe(
      (model) => {
        this.getCompletedTransactions();
      },
      (err) => {
        console.log(err);
      }
    );    
  }  

  onView(i) {
    this.selected = {
      _id: i._id,
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

}
