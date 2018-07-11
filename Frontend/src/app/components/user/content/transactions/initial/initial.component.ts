import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { DomSanitizer  } from '@angular/platform-browser';

import { TransactionService } from '../../../../../services/transaction/transaction.service';
import { GroupService } from '../../../../../services/group/group.service';
import { UserService } from '../../../../../services/user/user.service';

declare var $ :any;

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css']
})
export class InitialComponent implements OnInit {

  constructor(
  	private transactionService: TransactionService,
  	private groupService: GroupService,
  	private userService: UserService,
    private sanitizer: DomSanitizer,    
    private formBuilder: FormBuilder
   ) { }

  active;
  selected = {};
  EditForm: FormGroup;  
  amountSum: number;
  content:boolean;

  focusTname:boolean;
  focusEamount: boolean;
  focusTdate: boolean;

  currentDate: number;
  transactionDate: number;
  transactionDateYear: number;
  dateValid: boolean = false;
  amountValid: boolean;

  ngOnInit() {
  	this.changeStatus();
    this.active = this.groupService.active;
    this.EditForm = this.formBuilder.group({
      transactionName: [null, [Validators.minLength(1), Validators.required]],
      expenseAmount: [null, [Validators.required, Validators.min(0)]],
      transactionDate: [null, [Validators.required]],
      expenseTypeOptions: ['Rent', [Validators.required]],
      comments: null,
      members: this.formBuilder.array([]) 
    });
    this.groupService.getAllMembers(() => {});
  }

  ngDoCheck() {
    if(this.active !== this.groupService.active) {
    	this.changeStatus();
      this.EditForm.setControl('members', new FormArray([]));
      this.groupService.getAllMembers(() => {});      
      this.active = this.groupService.active;
    }

    this.dateValidator();
    this.amountValidator();
  }

  get members(): FormArray {
    return this.EditForm.get('members') as FormArray;
  }  

  addMembers(members, i) {
    for(let index=0 ; index < members.length ; index++) {
      this.members.push(
        this.formBuilder.group({
          _id: members[index]._id,
          email: members[index].email,
          amount: this.check(i[index])
        })
      );
    }
  }

  onFocus(i) {
    if (i == 1) {
      if (this.focusTname == false)
        this.focusTname = true;
    } else if (i == 2) {
      if (this.focusEamount == false)
        this.focusEamount = true;
    } else {
      if (this.focusTdate == false)
        this.focusTdate = true;
    }
  }

  check(value) {
    if(value) return value.amount;
    else return 0;
  }  

  checkUser(model) {
    if(model._Uid == this.userService.user._id) return true;
    else return false;
  }

  dateValidator() {
    this.currentDate = new Date().valueOf();
    this.transactionDate = new Date(this.EditForm.controls.transactionDate.value).valueOf();
    this.transactionDateYear = new Date(this.EditForm.controls.transactionDate.value).getFullYear();
     if (this.currentDate - this.transactionDate < 0 || this.transactionDateYear < 2018) {
      this.dateValid = false;
    } else this.dateValid = true;
  }

  amountValidator() {
    this.amountSum = 0;
    for (var i of this.members.value) {
      this.amountSum += i.amount;
      if (i.amount < 0 && this.amountValid == true)
        this.amountValid = false;
    }
    if (this.EditForm.controls.expenseAmount.value != this.amountSum && this.amountValid == true)
      this.amountValid = false;
    if (this.EditForm.controls.expenseAmount.value == this.amountSum)
      this.amountValid = true;
  }

  getInitialTransactions() {
  	this.transactionService.getInitialTransactions(this.groupService.active._groupId).subscribe(
  		(model: any[]) => {
  			this.transactionService.initial = model;
        if(this.transactionService.initial.length == 0)
          this.content = false;
        else
          this.content = true;
  		},
  		(err) => {
  			console.log(err);
  		}
  	);
  }

  changeStatus() {
  	this.transactionService.changeStatus(this.groupService.active._groupId).subscribe(
  		(model) => {
  			this.getInitialTransactions();
  		},
  		(err) => {
  			console.log(err);
  		}
  	);
  }

  onAmount(i) {
    for(let j of i.initial)
      if(j._id == this.userService.user._id && j.amount == 0)
        return true;
    return false;          
  }

	initPoll(i) {
		for(let j of i.poll)
			if(j._id == this.userService.user._id)
				return j.response;
	}  

	togglePoll(i, poll) {
		var obj = {
			_id: i._id,
			poll: {
				_id: this.userService.user._id,
				response: poll
			}
		};
		this.transactionService.updatePoll(obj).subscribe(
			(model) =>{
        this.changeStatus();
			},
			(err) => {
				console.log(err);
			}
		);
	}

  onView(i) {
    let True=0, False=0;
    for(let j of i.poll) {
      if(j.response) True++;
      else False++
    }
    for(let j of i.initial)
      if(j.amount == 0) False--;
    this.selected = {
      _id: i._id,
      _Uid: i._Uid,
      transactionName: i.transactionName,
      amount: i.amount,
      expenseDate: i.expenseDate,
      uploadDate: i.uploadDate,
      expenseType: i.expenseType,
      comments: i.comments,
      poll: Math.ceil((True/(True+False))*100),
      initial: []
    }
    this.add(this.selected, i);
  }

  getProgress() {
    return {
      'width': this.selected['poll']+'%'
    }
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

  onEdit(i) {
    $("#view").modal("hide");
    this.selected = i;
    this.EditForm.controls['transactionName'].setValue(i.transactionName);
    this.EditForm.controls['expenseAmount'].setValue(i.amount);
    let date = new Date(i.expenseDate);
    this.EditForm.controls['transactionDate'].setValue(date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+date.getDate()).slice(-2));
    this.EditForm.controls['expenseTypeOptions'].setValue(i.expenseType);    
    this.EditForm.controls['comments'].setValue(i.comments);    
    this.EditForm.setControl('members', new FormArray([])); 
    this.addMembers(this.groupService.allMembers, i.initial);
    this.focusTname = false;
    this.focusEamount = false;
    this.focusTdate = false;

    this.amountValid = true;
  }

  onSubmit() {
    this.selected['_Uid'] = this.userService.user._id;
    this.selected['_groupId'] = this.groupService.active._groupId;    
    this.selected['transactionName'] = this.EditForm.controls['transactionName'].value;
    this.selected['amount'] = this.EditForm.controls['expenseAmount'].value;
    this.selected['expenseDate'] = this.EditForm.controls['transactionDate'].value;
    this.selected['expenseType'] = this.EditForm.controls['expenseTypeOptions'].value;
    this.selected['comments'] = this.EditForm.controls['comments'].value;
    this.selected['members'] = JSON.parse(JSON.stringify(this.EditForm.controls['members'].value));
    this.selected['initial'] = JSON.parse(JSON.stringify(this.EditForm.controls['members'].value));
    for(let i=0 ; i<this.selected['members'].length ; i++) {
      if(this.selected['members'][i]._id == this.selected['_Uid']) this.selected['members'][i].amount = 0;
      delete this.selected['members'][i].email;
      delete this.selected['initial'][i].email;
    }       
    this.selected['status'] = 0;

    if(!this.dateValid) this.focusTdate = true;
    else if(!this.amountValid) this.focusEamount = true;
    else if(!this.EditForm.valid){
      if(!this.EditForm.controls.transactionName.valid) this.focusTname = true;
      if(!this.EditForm.controls.expenseAmount.valid) this.focusEamount = true;
      if(!this.EditForm.controls.transactionDate.valid) this.focusTdate = true;
    } else this.transactionService.updateToInitial(this.selected).subscribe(
      (model) => {
        this.changeStatus();        
        console.log(model);
        alert('The bill has been edited successfully and is available for polling!!');
        this.focusTname = false;
        this.focusEamount = false;
        this.focusTdate = false;
        this.amountValid = true;
        $("#edit1").modal("hide");
        this.EditForm = this.formBuilder.group({
          transactionName: [null, [Validators.minLength(1), Validators.required]],
          expenseAmount: [null, [Validators.required, Validators.min(0)]],
          transactionDate: [null, [Validators.required]],
          expenseTypeOptions: ['Rent', [Validators.required]],
          comments: null,
          members: this.formBuilder.array([]) 
        });
      },
      (err) => {
        console.log(err);
      }
    );     
  }

  confirmDelete() {
    $("#view").modal("hide");
  }

  onDelete(i) {
    $("#confirmDeleteBill").modal("hide");
    this.transactionService.deleteTransaction(i._id).subscribe(
      (message) => {
        this.changeStatus();
        console.log(message);
        alert('The selected bill has been successfully deleted!!');
      },
      (err) => {
        console.log(err);
      }
    );
  }

}