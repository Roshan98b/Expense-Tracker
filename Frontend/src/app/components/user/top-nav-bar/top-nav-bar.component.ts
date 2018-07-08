import { Component, OnInit, DoCheck } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user/user.service';
import { GroupService } from '../../../services/group/group.service';

declare var $ :any;

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css']
})
export class TopNavBarComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
    private groupService: GroupService,
    private formBuilder: FormBuilder
   ) { }

  selected = {};
  EditForm: FormGroup;
  questions: string[] = ['What was your childhood nickname?', 'What school did you attend for sixth grade?', 'What is the last name of the teacher who gave you your first failing grade?', 'In what city or town did your mother and father meet?', 'What is your favorite movie?'];
  default: string = 'What was your childhood nickname?';

  pform: FormGroup = new FormGroup({
    password: new FormControl(null,[Validators.required, Validators.minLength(6)]),
    cpassword: new FormControl(null,[Validators.required]),
    
  });
  sForm: FormGroup = new FormGroup({
    securityQuestion: new FormControl(null,[Validators.required]),
    securityAnswer: new FormControl(null,[Validators.required])
  });

  password:FormControl =  new FormControl(null,{ validators: [Validators.required, Validators.minLength(6)]});

  focusDob: boolean;
  focusMobile: boolean;

  currentDate: Date;
  dateOfBirth: Date;
  dateValid: boolean = false;

  ngOnInit() {

    this.focusDob = false;
    this.focusMobile = false;

    this.EditForm = this.formBuilder.group({
      firstname: null,
      lastname: null,
      dob: [null, [Validators.required]],
      gender: ['Male'],
      email: [this.userService.user.email],
      contactno: [null, [Validators.required, Validators.minLength(10)]],
      balance: [this.userService.user.balance]
    });
  }

  ngDoCheck() {
    this.dateValidator();
  }

  onClickProfile() {
    
    this.userService.getUser();

    this.selected = {
      firstName: this.userService.user.firstname,
      lastName: this.userService.user.lastname,
      dob: this.userService.user.dob,
      gender: this.userService.user.gender,
      email: this.userService.user.email,
      mobileNumber: this.userService.user.contactno,
      balance: this.userService.user.balance
    }
  }

  dateValidator() {

    this.currentDate = new Date();
    this.dateOfBirth = new Date(this.EditForm.controls.dob.value);

    if (this.currentDate.getFullYear() - this.dateOfBirth.getFullYear() < 12)
      this.dateValid = false;
    else if (this.currentDate.getFullYear() - this.dateOfBirth.getFullYear() > 12)
      this.dateValid = true;
    else {
      if (this.currentDate.getMonth() < this.dateOfBirth.getMonth())
        this.dateValid = false;
      else if (this.currentDate.getMonth() > this.dateOfBirth.getMonth())
        this.dateValid = true;
      else {
        if (this.currentDate.getDay() > this.dateOfBirth.getDay())
        this.dateValid = false;
      else this.dateValid = true;
      }
    }
  }

  onFocus(i) {
    if(i == 1){
        if(this.focusDob == false)
            this.focusDob = true;
    } else {
        if(this.focusMobile == false)
            this.focusMobile = true;
    }
  }

  onEdit(i) {
    $("#profileModal").modal("hide");
    this.EditForm.controls['firstname'].setValue(i.firstName);
    this.EditForm.controls['lastname'].setValue(i.lastName);
    this.EditForm.controls['dob'].setValue(i.dob);
    this.EditForm.controls['gender'].setValue(i.gender);
    this.EditForm.controls['contactno'].setValue(i.mobileNumber);
  }

  onSubmit(i) {
    $("#edit").modal("hide");
    if (!this.dateValid) alert('You should be at least 12 years old to use this application!!');
    if(!this.EditForm.valid) {
      if(!this.EditForm.controls.dob.valid) alert('Please enter your Date of Birth!!')
      if(!this.EditForm.controls.contactno.valid) alert('Mobile number should have 10 digits');
    } else this.userService.postEditedProfile(this.EditForm.value).subscribe(
      (message) => {
        console.log(message);
        let obj = JSON.parse(localStorage.getItem('user'));
        obj.firstname = this.EditForm.controls.firstname.value;
        obj.lastname = this.EditForm.controls.lastname.value;
        obj.dob = this.EditForm.controls.dob.value;
        obj.gender = this.EditForm.controls.gender.value;
        obj.contactno = this.EditForm.controls.contactno.value;
        localStorage.setItem('user', JSON.stringify(obj));
        this.userService.user = obj;                
        alert('Your profile has been successfully updated!!');
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onOldPassword() {
    // Request for password check
    let flag = true; 
    if(flag) {
      $("#changepassword").modal("hide");    
      console.log(this.password.value);
      $("#newpassword").modal("show");
    } else {
      $("#changepassword").modal("hide");    
      alert('Incorrect password');
    }
  }

  onChangePassword(i){
    $("#edit").modal("hide");
  }

  onChangeSecurity(){
    $("#newpassword").modal("hide");
  }

  onChangedPassword() {
    if(!this.pform.valid) {
      if(!this.pform.controls.password.valid) alert('Invalid password!!');
    } else if(this.pform.controls.password.value != this.pform.controls.cpassword.value) alert('Confirm Password does not match password!!');
    else {
      $("#newpassword").modal("hide");

      // Post new password

      alert('Password changed'); 
    }
  }

  onChangedSecurity() {
    if(!this.sForm.valid) {
      if(!this.sForm.controls.securityAnswer.valid) alert('Answer the security question!!');
    } else {
      $("#changesecurity").modal("hide");

      // Post new password

      alert('Security changed'); 
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }

}