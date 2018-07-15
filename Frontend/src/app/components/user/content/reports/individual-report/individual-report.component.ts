import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ReportService } from '../../../../../services/report/report.service';
import { GroupService } from '../../../../../services/group/group.service';
import { UserService } from '../../../../../services/user/user.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-individual-report',
  templateUrl: './individual-report.component.html',
  styleUrls: ['./individual-report.component.css']
})
export class IndividualReportComponent implements OnInit {

  categoryChart = [];
  monthlyChart = [];
  years: number[] = [];
  default: number = 2018;
  contentC: Boolean = true;
  contentM: Boolean = true;

  constructor(
    private reportService: ReportService,
    private groupService: GroupService,
    private userService: UserService
  ) { }

  reportForm: FormGroup = new FormGroup({
    reportYear: new FormControl(0, [Validators.required])
  });

  ngOnInit() {
    this.reportForm.controls['reportYear'].setValue(this.default);
    this.getCurrentYear();
    for (var i = 2018; i <= this.getCurrentYear(); i++) {
      this.years.push(i);
    }
    this.getReport(this.reportForm.controls.reportYear.value, this.userService.user._id);  
  }  

  categorywiseReport(obj) {
    obj = this.toCatagoryArray(obj);
    let expense = obj.expense;
    let allCategories = obj.expenseType;

    this.categoryChart = new Chart('categoryCanvas', {
      type: 'pie',
      data: {
        labels: allCategories,
        datasets: [{ 
          data: expense,
          borderColor: ["#f56954","#00a65a","#f39c12","#00c0ef","#3c8dbc","#d2d6de"],
          backgroundColor: ["#f56954","#00a65a","#f39c12","#00c0ef","#3c8dbc","#d2d6de"],
          fill: true
        }]
      },
      options: {
        legend: {
          display: true,
          position: 'right'
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: false
          }],
        }
      }
    });
  }

  monthlyReport(obj) {
    obj = this.toMonthArray(obj);
    let expense = obj.expense;
    let allMonths = obj.month;

    this.monthlyChart = new Chart('monthlyCanvas', {
      type: 'bar',
      data: {
        labels: ['January','February','March','April','May','June','July',
            'August','September','October','November','December'],
        datasets: [{ 
          data: expense,
          borderColor: ["#f56954","#f56954","#f56954","#00a65a","#00a65a","#00a65a","#f39c12","#f39c12","#f39c12","#00c0ef","#00c0ef","#00c0ef"],
          backgroundColor: ["#f56954","#f56954","#f56954","#00a65a","#00a65a","#00a65a","#f39c12","#f39c12","#f39c12","#00c0ef","#00c0ef","#00c0ef"],
          fill: true
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Total monthly expense amount (in Rupees)'
            },
            display: true
          }],
        }
      }
    });    
  }

  toMonthArray(obj) {
    var monthly ={
      expense: [],
      month: []
    }
    for(let i of obj) {
      monthly.expense.push(i.expense);
      monthly.month.push(i.month);
    }
    return monthly;
  }

  toCatagoryArray(obj) {
    var catagory ={
      expense: [],
      expenseType: []
    }
    for(let i of obj) {
      catagory.expense.push(i.expense);
      catagory.expenseType.push(i.expenseType);
    }
    return catagory;
  }

  allMonths(model) {
    for(let i=1, j=0 ; i <= 12 ; i++) {
      if(model[j]) {
        if(model[j].month != i)
          model.splice(j, 0, {expense: 0, month: i});
        j++;
      } else model.splice(j++, 0, {expense: 0, month: i})      
    }          
  }

  getReport(year, Uid) {
    let obj = {
      year: year,
      _Uid: Uid
    };
    this.reportService.postUser(obj).subscribe(
      (model) => {
        if(Object.keys(model['catagorical']).length == 0) this.contentC = false;
        else this.contentC = true;
        if(Object.keys(model['monthly']).length == 0) this.contentM = false;
        else this.contentM = true;
        this.allMonths(model['monthly']);
        this.categorywiseReport(model['catagorical']);
        this.monthlyReport(model['monthly']);       
      },
      (err) => {
        console.log(err);
      }
    );    
  }

  getCurrentYear(): number {
    return (new Date()).getFullYear();
  }

  onSubmit() {
    this.getReport(this.reportForm.controls.reportYear.value, this.userService.user._id);
  }
}