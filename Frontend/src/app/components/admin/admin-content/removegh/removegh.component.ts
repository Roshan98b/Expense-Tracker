import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../../../services/user/user.service';
import { GroupService } from '../../../../services/group/group.service';
import { Group } from '../../../../services/group/group';

declare var $: any;

@Component({
  selector: 'app-removegh',
  templateUrl: './removegh.component.html',
  styleUrls: ['./removegh.component.css']
})
export class RemoveghComponent implements OnInit {

  constructor(
  	private groupService: GroupService
  ) { }

  delForm: FormGroup = new FormGroup({
    member: new FormControl(null,[Validators.required])
  });

  selForm: FormGroup = new FormGroup({
    selectedGH: new FormControl(null)
   });

  selGH;
  allMembers;
  content: Boolean;

  ngOnInit() {
  }

  onClick(i) {
    this.selGH = i;
    this.groupService.getCurrentGroupMembers(this.selGH._id).subscribe(
      (model) => {
        this.allMembers = model;
        this.filterUsers(this.allMembers);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  filterUsers(model) {
    for(let i=0 ; i<model.length ; i++)
      if(model[i])
        if(model[i].email == this.selGH.email)
          model.splice(i, 1);
  }

  onKey(event: any) { 
    if(event.target.value) {
    	this.groupService.searchGroupHead(event.target.value).subscribe(
    		(model) => {
    			this.groupService.tempGH = <Group[]>model;
          if(this.groupService.tempGH.length == 0)
            this.content = false;
          else
            this.content = true;
    		},
    		(err) => {
    			console.log(err);
    		}
    	);
    } else {
      this.groupService.tempGH = [];
      this.content = false;
    }
  }

  onSubmit() {
    var obj = {
      _id: this.delForm.value.member._id,
      _Uid: this.selGH._Uid,
      email: this.delForm.value.member.email,
      _groupId: this.selGH._id 
    }
    this.groupService.postDeleteGH(obj).subscribe(
      (message) => {
        console.log(message);
        $("#delModal").modal("hide");
        this.selForm.reset();
        this.groupService.tempGH = [];
        this.content = false;
      },
      (err) => {
        console.log(err);
      }
    );

  }

}
