import { Component, OnInit, DoCheck } from '@angular/core';
import { FormControl } from '@angular/forms';

import { UserService } from '../../../../services/user/user.service';
import { GroupService } from '../../../../services/group/group.service';
import { Group } from '../../../../services/group/group';

@Component({
  selector: 'app-addmember',
  templateUrl: './addmember.component.html',
  styleUrls: ['./addmember.component.css']
})
export class AddmemberComponent implements OnInit, DoCheck {

  focusSearch: boolean;

  constructor(
  	private userService: UserService,
  	private groupService: GroupService
  ) { }

  search = new FormControl();

  ngOnInit() {
    this.groupService.getAllMembers(() => {});
    this.focusSearch = false;
    this.groupService.tempMember = [];
  }

  ngDoCheck() {
    if(this.groupService.tempMember.length != 0)
      this.focusSearch = true;
    else
      this.focusSearch = false;
  }

  filterUsers(model) {
    let pos = [];
    for(let i=0 ; i<model.length ; i++) {
      for(let j=0 ; j<this.groupService.allMembers.length ; j++)
        if(model[i]) {
          if(model[i].email == "admin@admin.com") pos.push(i);
          if(model[i].email == this.groupService.allMembers[j].email) pos.push(i);
        }
    }
    for(let i in pos) model.splice(i, 1);  
    this.groupService.tempMember = model;
  }

  onKey(event: any) { 
    if(event.target.value) {
    	this.groupService.searchMember(event.target.value).subscribe(
    		(model) => {
          this.filterUsers(model);
    		},
    		(err) => {
    			console.log(err);
    		}
    	);
    } else {
      this.groupService.tempMember = [];
    }
  }

  sendInvite(i) {
  	this.groupService.postTempMember(i._id).subscribe(
  		(message) => {
  			console.log(message);
        this.search.reset();
        this.groupService.tempMember = [];
        alert('Invitation sent successfully!!');        
  		},
  		(err) => {
  			console.log(err);
  		}
  	);
  }

}
