import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminContentComponent } from './components/admin/admin-content/admin-content.component';
import { ApproveghComponent } from './components/admin/admin-content/approvegh/approvegh.component';
import { RemoveghComponent } from './components/admin/admin-content/removegh/removegh.component';
import { UserComponent } from './components/user/user.component';
import { ContentComponent } from './components/user/content/content.component';
import { InvitationComponent } from './components/user/content/invitation/invitation.component';
import { AddmemberComponent } from './components/user/content/addmember/addmember.component';
import { UploadbillComponent } from './components/user/content/uploadbill/uploadbill.component';
import { InitialComponent } from './components/user/content/transactions/initial/initial.component';
import { CompletedComponent } from './components/user/content/transactions/completed/completed.component';
import { ApprovedComponent } from './components/user/content/transactions/approved/approved.component';
import { UnapprovedComponent } from './components/user/content/transactions/unapproved/unapproved.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { GroupReportComponent } from './components/user/content/reports/group-report/group-report.component';
import { IndividualInGroupReportComponent } from './components/user/content/reports/individual-in-group-report/individual-in-group-report.component';
import { IndividualReportComponent } from './components/user/content/reports/individual-report/individual-report.component';
import { ViewMembersComponent } from './components/user/content/view-members/view-members.component';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	},
	{
		path: 'forgotPassword',
		component: ForgotPasswordComponent
	},
	{
		path: 'resetPassword/:id',
		component: ResetPasswordComponent
	},
	{
		path: 'admin',
		component: AdminComponent,
		children: [
			{
				path: '',
				redirectTo: 'content',
				pathMatch: 'full'
			},
			{
				path: 'content',
				component: AdminContentComponent,
				children: [
					{
						path: '',
						redirectTo: 'approvegh',
						pathMatch: 'full'
					},
					{
						path: 'approvegh',
						component: ApproveghComponent,
						canActivate: [AdminGuard]
					},
					{
						path: 'removegh',
						component: RemoveghComponent,
						canActivate: [AdminGuard]
					}
				]
			}
		]
	},
	{
		path: 'user',
		component: UserComponent,
		children: [
			{
				path: '',
				redirectTo: 'content',
				pathMatch: 'full'
			},
			{
				path: 'content',
				component: ContentComponent,
				children: [
					{
						path: '',
						redirectTo: 'invitation',
						pathMatch: 'full'
					},
					{
						path: 'invitation',
						component: InvitationComponent,
						canActivate: [AuthGuard]
					},
					{
						path: 'viewMembers',
						component: ViewMembersComponent,
						canActivate: [AuthGuard]
					},
					{
						path: 'addmember',
						component: AddmemberComponent,
						canActivate: [AuthGuard]
					},
					{
						path: 'uploadbill',
						component: UploadbillComponent,
						canActivate: [AuthGuard]
					},
					{
						path: 'groupReport',
						component: GroupReportComponent,
						canActivate: [AuthGuard]
					},
					{
						path: 'individualInGroupReport',
						component: IndividualInGroupReportComponent,
						canActivate: [AuthGuard]
					},
					{
						path: 'individualReport',
						component: IndividualReportComponent,
						canActivate: [AuthGuard]
					},
					{
						path: 'initialtransaction',
						component: InitialComponent,
						canActivate: [AuthGuard]				
					},
					{
						path: 'completedtransaction',
						component: CompletedComponent,
						canActivate: [AuthGuard]				
					},
					{
						path: 'approvedtransaction',
						component: ApprovedComponent,
						canActivate: [AuthGuard]					
					},
					{
						path: 'unapprovedtransaction',
						component: UnapprovedComponent,
						canActivate: [AuthGuard]								
					}										
				]
			}
		]
	}
];

@NgModule({
	exports: [
		RouterModule
	],
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }
