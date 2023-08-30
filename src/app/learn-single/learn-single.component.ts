import { Component } from '@angular/core';
import { QueriesService } from '../service/queries.service';
import { Question } from '../Interface/question';
@Component({
  selector: 'llce-learn-single',
  templateUrl: './learn-single.component.html',
  styleUrls: ['./learn-single.component.css']
})
export class LearnSingleComponent {
  questions: Question[];
  question: Question;
  whatIsCorrect: boolean = false
  currentQuestion: number = -1


  constructor(private qs: QueriesService) {
    this.questions = this.qs.getAll();
    this.currentQuestion = 0
    this.question = this.questions[this.currentQuestion]
  }

  toggleCorrect(ind: number) {
    if (this.currentQuestion == ind) {
      this.whatIsCorrect = !this.whatIsCorrect
    } else {
      this.currentQuestion = ind
      this.whatIsCorrect = true
    }
  }

  prevQuestion() {
    if(this.currentQuestion > 0) {
      this.currentQuestion--
      this.question = this.questions[this.currentQuestion]
    }
    this.whatIsCorrect = false
  }

  nextQuestion() {
    if(this.currentQuestion < this.questions.length -1) {
      this.currentQuestion++
      this.question = this.questions[this.currentQuestion]
    }
    this.whatIsCorrect = false
  }

  firstQuestion() {
      this.currentQuestion = 0
      this.question = this.questions[this.currentQuestion]
      this.whatIsCorrect = false
    }

  lastQuestion() {
      this.currentQuestion = this.questions.length -1
      this.question = this.questions[this.currentQuestion]
      this.whatIsCorrect = false
    }
}

