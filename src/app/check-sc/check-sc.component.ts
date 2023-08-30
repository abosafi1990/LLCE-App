import { Component } from '@angular/core';
import { Question } from '../Interface/question';
import { QueriesService } from '../service/queries.service';
@Component({
  selector: 'llce-check-sc',
  templateUrl: './check-sc.component.html',
  styleUrls: ['./check-sc.component.css']
})
export class CheckScComponent {
  questions: Question[];
  question: Question;
  whatIsCorrect: boolean = false;
  currentQuestion: number = -1;
  popupWarning: boolean = false;

  constructor(private qs: QueriesService) {
    // get Single Choice Questions
    this.questions = this.qs.getAll().filter((q) => q.qtyp == 'sc');
    // antworten initialisieren
    this.questions.map(q => {q.qtyp == 'mc'; q.qanswers.map(a => a.givenanswer = false)})
    this.questions.map(q => {q.qtyp == 'sc'; q.qanswers.map(a => a.givenanswer = false)})
    this.questions.map(q => {q.qtyp == 'fi'; q.qgivenanswerFillIn = ''})

    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
  }

  toggleCorrect(ind: number) {
    if (this.currentQuestion == ind) {
      this.whatIsCorrect = !this.whatIsCorrect;
    } else {
      this.currentQuestion = ind;
      this.whatIsCorrect = true;
    }
  }

  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.question = this.questions[this.currentQuestion];
    }
    this.whatIsCorrect = false;
    this.popupWarning = false;
  }

  nextQuestion() {
    // check mode: if q is not answered -> next question
    //             if q is answered -> check if ok else 1 q back
    let nextQuestion = false;
    if (this.isQuestionAnswered()) {
      console.log('q answered')
      // frage prüfen ob ok: if ok -> next question else 1 q back
      if (this.isQuestionAnswerOk()) {
      console.log('answer(s) ok')
      nextQuestion = true;
      } else {
        // answer not ok -> warning and 1 question back
        console.log('popup warning')
        this.resetCurrentAnsweredQuestion()
        this.resetPreviousAnsweredQuestion()
        this.prevQuestion();
        this.popupWarning = true;
      }
    } else {
      nextQuestion = true;
    }
    if (nextQuestion) {
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.question = this.questions[this.currentQuestion];
      }
    }
    this.whatIsCorrect = false;
  }

  isQuestionAnswered(): boolean {
    // ist ein givenanswer = true
    if (
      this.question.qanswers.findIndex((ans) => ans.givenanswer === true) != -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  firstQuestion() {
    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
    this.whatIsCorrect = false;
  }

  lastQuestion() {
    this.currentQuestion = this.questions.length - 1;
    this.question = this.questions[this.currentQuestion];
    this.whatIsCorrect = false;
  }

  selectAnswerSC(ind: number) {
    // reset all givenanswer to false (this is single choice)
    this.question.qanswers.map(a => a.givenanswer = false)
    // then set choosen answer to true
    this.question.qanswers[ind].givenanswer = true
  }

  isQuestionAnswerOk() {
    // finde eine falsche Antwort -> gesamte Frage ist falsch
    if(this.question.qanswers.find(ans => ans.correct != ans.givenanswer)) {
      return false
    } else {
      return true;
    }
  }

  resetCurrentAnsweredQuestion() {
    this.question.qanswers.map(ans => ans.givenanswer = false)
  }

  resetPreviousAnsweredQuestion() {
    if(this.currentQuestion >= 1)
    this.questions[this.currentQuestion-1].qanswers.map(ans => ans.givenanswer = false)
  }
}

