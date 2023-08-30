import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LearnListComponent } from './learn-list/learn-list.component';
import { LearnSingleComponent } from './learn-single/learn-single.component';
import { CheckComponent } from './check/check.component';
import { CheckMcComponent } from './check-mc/check-mc.component';
import { CheckScComponent } from './check-sc/check-sc.component';
import { CheckFiComponent } from './check-fi/check-fi.component';
import { CheckAllComponent } from './check-all/check-all.component';
import { LearnComponent } from './learn/learn.component';
import { ExamComponent } from './exam/exam.component';

const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'main', component: MainComponent},
  {path: 'learn', component: LearnComponent},
  {path: 'learnlist', component: LearnListComponent},
  {path: 'learnsingle', component: LearnSingleComponent},
  {path: 'check', component: CheckComponent},
  {path: 'checkmc', component: CheckMcComponent},
  {path: 'checkmc', component: CheckMcComponent},
  {path: 'checksc', component: CheckScComponent},
  {path: 'checkfi', component: CheckFiComponent},
  {path: 'checkall', component: CheckAllComponent},
  {path: 'exam', component: ExamComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

