import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TransactionService } from '../../../../../services/transaction/transaction.service';
import { GroupService } from '../../../../../services/group/group.service';
import { UserService } from '../../../../../services/user/user.service';

declare var $: any;

@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.css']
})
export class ApprovedComponent implements OnInit {

  constructor(
  	private transactionService: TransactionService,
  	private groupService: GroupService,
  	private userService: UserService
  ) { }

  selected = {};
  active;
  amount = 0;

  ngOnInit() {
  	this.checkComplete();
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

  getApprovedTransactions() {
  	this.transactionService.getApprovedTransactions(this.groupService.active._groupId).subscribe(
  		(model: any[]) => {
  			this.transactionService.approved = model;
  		},
  		(err) => {
  			console.log(err);
  		}
  	);
  }

  checkPay(i) {
    for(let j of i.members) {
      if(j._id == this.userService.user._id && j.amount == 0)
        return true;
    }
    return false;
  }

  checkComplete() {
    this.transactionService.checkComplete(this.groupService.active._groupId).subscribe(
      (model) => {
        this.changeStatus();
      },
      (err) => {
        console.log(err);
      }
    );    
  }

  changeStatus() {
  	this.transactionService.changeStatus(this.groupService.active._groupId).subscribe(
  		(model) => {
  			this.getApprovedTransactions();
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
      members: []
    }
    this.add(this.selected, i);
  }

  add(selected, i) {
    for(let j = 0 ; j < i.members.length ; j++) {
      if(this.groupService.allMembers[j])
      selected.members.push(
        {
          email: this.groupService.allMembers[j].email,
          amount: i.members[j].amount
        }
      );
    }
  }

  onPayInit(i) {
    this.selected = i;
    this.amount = this.getUserAmount();
  }

  getUserAmount() {
    var _id = this.userService.user._id;
    var amt = 0;
    for(let i of this.selected['members']) {
      if(i._id == _id) amt = i.amount;
    }
    return amt;
  }

  onWallet() {
    $("#pay").modal("hide");
  }

  onPay() {
    $("#pay").modal("hide");
    let obj = {
      _id: this.selected['_id'],
      _Uid: this.userService.user._id,
      _Did: this.selected['_Uid'],
      memberBalance: this.userService.user.balance,
      transactionAmount: this.getUserAmount()
    };
    this.transactionService.billPayment(obj).subscribe(
      (model) => {
        this.checkComplete();
        let user = JSON.parse(localStorage.getItem('user'));
        user.balance = model['memberBalance'];
        localStorage.setItem('user', JSON.stringify(user));
        this.userService.user = user;
        console.log(model);
      },
      (err) => {
        console.log(err)
      }  
    ); 
  }

} 