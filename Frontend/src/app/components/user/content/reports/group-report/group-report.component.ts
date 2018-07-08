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
  years: string[] = [];
  default: string = '2018';
  obj;

  constructor(
  	private _report: ReportService,
  	private groupService: GroupService
  	) { }

  reportForm: FormGroup = new FormGroup({
    reportYear: new FormControl(null, [Validators.required])
  });

  ngOnInit() {
  	this.reportForm.controls['reportYear'].setValue(this.default, {onlySelf: true});
    this.getCurrentYear();
    for (var i = 2018; i <= this.getCurrentYear(); i++) {
      this.years.push(i.toString());
    }

    this._report.categorywiseReport()
      .subscribe(res => {
        
        let expense = res['list'].map(res => res.expense);
        let allCategories = res['list'].map(res => res.category);

        console.log(res);

        this.categoryChart = new Chart('categoryCanvas', {
          type: 'pie',
          data: {
            labels: allCategories,
            datasets: [{ 
                data:[expense[0], expense[1], expense[2], expense[3], expense[4]],
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

      })

      this._report.monthlyReport()
      .subscribe(res => {
        
        let expense = res['list'].map(res => res.expense);
        let allMonths = res['list'].map(res => res.month);

        console.log(res);

        this.monthlyChart = new Chart('monthlyCanvas', {
          type: 'bar',
          data: {
            labels: allMonths,
            datasets: [{ 
                data:[expense[0], expense[1], expense[2], expense[3], expense[4], expense[5], expense[6], expense[7], expense[8], expense[9], expense[10], expense[11]],
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

      })
  }

  isDataEmpty(): boolean {
    //return this.data.length === 0;
    return false;
  }

  getCurrentYear(): number {
    return (new Date()).getFullYear();
  }

  onSubmit() {
    console.log("Yes");
    this.obj = {
    	year: this.reportForm.value,
    	groupId: this.groupService.active._groupId
    };
    this._report.postYear(this.obj).subscribe(
    	(model) => {
    		console.log(model);       
    	},
    	(err) => {
        	console.log(err);
    	}
    );
  }

}
