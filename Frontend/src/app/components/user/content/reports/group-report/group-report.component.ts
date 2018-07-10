import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ReportService } from '../../../../../services/report/report.service';
import { GroupService } from '../../../../../services/group/group.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-group-report',
  templateUrl: './group-report.component.html',
  styleUrls: ['./group-report.component.css']
})
export class GroupReportComponent implements OnInit {

  categoryChart = [];
  monthlyChart = [];
  years: number[] = [];
  default: number = 2018;

  constructor(
    private reportService: ReportService,
    private groupService: GroupService
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
    this.getReport(this.reportForm.controls.reportYear.value, this.groupService.active._groupId);  
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
          display: false
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

  getReport(year, groupId) {
    let obj = {
      year: year,
      groupId: groupId
    };
    this.reportService.postYear(obj).subscribe(
      (model) => {
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
    this.getReport(this.reportForm.controls.reportYear.value, this.groupService.active._groupId);
  }

}
