import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LearnListComponent,
    LearnSingleComponent,
    CheckComponent,
    CheckMcComponent,
    CheckScComponent,
    CheckFiComponent,
    CheckAllComponent,
    LearnComponent,
  CheckComponent,
  CheckAllComponent,
  CheckFiComponent,
  CheckMcComponent,
  CheckScComponent,
    ExamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }