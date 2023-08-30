import { Component } from '@angular/core';
import { Question } from '../Interface/question';
import { QueriesService } from '../service/queries.service';
import { Statistics } from '../Interface/statistics';

@Component({
  selector: 'llce-check-all',
  templateUrl: './check-all.component.html',
  styleUrls: ['./check-all.component.css']
})
export class CheckAllComponent {
  questions: Question[];
  question: Question;
  whatIsCorrect: boolean = false;
  currentQuestion: number = -1;
  popupWarning: boolean = false;
  statistic: Statistics = {
    qmax: 0,
    qanswered: 0,
    qnotanswered: 0,
    qcorrect: 0,
    qwrong: 0,
  };
  showResults: boolean = false
  xTimesWrong: number= 0
  xTimesWrongMax: number = 2

  constructor(private qs: QueriesService) {
    // we use all question (mc/sc/fi)
    this.questions = this.qs.getAll();
    // initialise answers
    this.questions.map((q) => q.qanswers.map((a) => (a.givenanswer = false)));
    this.questions.map((q) => {
      q.qtyp == 'fi';
      q.qgivenanswerFillIn = '';
    });
    // select first question
    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];

    this.statistic.qmax = this.questions.length;
    this.statistic.qanswered = 0;
    this.statistic.qnotanswered = 0;
    this.statistic.qcorrect = 0;
    this.statistic.qwrong = 0;
  }

  initStatistics() {
    this.statistic.qmax = this.questions.length;
    this.statistic.qanswered = 0;
    this.statistic.qnotanswered = 0;
    this.statistic.qcorrect = 0;
    this.statistic.qwrong = 0;

    this.xTimesWrong = 0
  }

  selectAllQuestions() {
    // get Single Choice Questions
    this.questions = this.qs.getAll();
    // antworten initialisieren
    this.qs.initAllQuestions();

    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
    this.initStatistics();
    this.checkResult();
  }

  selectScQuestions() {
    // get Single Choice Questions
    this.questions = this.qs.getAll().filter((q) => q.qtyp == 'sc');
    // antworten initialisieren
    this.qs.initAllQuestions();

    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
    this.initStatistics();
    this.checkResult();
  }

  selectMcQuestions() {
    // get Single Choice Questions
    this.questions = this.qs.getAll().filter((q) => q.qtyp == 'mc');
    // antworten initialisieren
    this.qs.initAllQuestions();

    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
    this.initStatistics();
    this.checkResult();
  }

  selectFiQuestions() {
    // get Single Choice Questions
    this.questions = this.qs.getAll().filter((q) => q.qtyp == 'fi');
    // antworten initialisieren
    this.qs.initAllQuestions();

    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
    this.initStatistics();
    this.checkResult();
  }

  shuffleQuestions() {
    this.questions = this.questions.sort((a, b) => 0.5 - Math.random())
    this.firstQuestion()
  }

  shuffleAnswers() {
    this.questions = this.questions.map(q => {q.qanswers = q.qanswers.sort((a, b) => 0.5 - Math.random()); return q} )
    this.firstQuestion()
  }

  setNumberOfQuestions(qcount: string) {
    if (qcount != '') {
      this.questions = this.questions.slice(0, parseInt(qcount));
    }
    this.checkResult();
  }

  toggleShowCorrect(ind: number) {
    if (this.currentQuestion == ind) {
      this.whatIsCorrect = !this.whatIsCorrect;
    } else {
      this.currentQuestion = ind;
      this.whatIsCorrect = true;
    }
    this.showResults = false
  }

  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.question = this.questions[this.currentQuestion];
    }
    this.whatIsCorrect = false;
    this.popupWarning = false;
    this.checkResult();
    this.showResults = false
  }

  nextQuestion() {
    // check mode: if q is not answered -> next question
    //             if q is answered -> check if ok else 1 q back
    let nextQuestion = false;
    this.showResults = false
    if (this.isQuestionAnswered()) {
      console.log('q answered');
      // frage prüfen ob ok: if ok -> next question else 1 q back
      if (this.isQuestionAnswerOk()) {
        console.log('answer(s) ok');
        nextQuestion = true;
      } else {
        // answer not ok -> warning and 1 question back
        console.log('popup warning');
        this.resetCurrentAnsweredQuestion();
        this.resetPreviousAnsweredQuestion();
        this.prevQuestion();
        this.popupWarning = true;
        this.xTimesWrong++
      }
    } else {
      nextQuestion = true;
    }
    if (nextQuestion) {
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.question = this.questions[this.currentQuestion];
      } else {
        this.showResults = true
      }
    } else {
      this.showResults = true
    }
    this.whatIsCorrect = false;
    this.checkResult();
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
    this.checkResult();
    this.showResults = false
  }

  lastQuestion() {
    this.currentQuestion = this.questions.length - 1;
    this.question = this.questions[this.currentQuestion];
    this.whatIsCorrect = false;
    this.checkResult();
    this.showResults = false
  }

  selectAnswer(ind: number) {
    this.question.qanswers[ind].givenanswer =
      !this.question.qanswers[ind].givenanswer;
    this.checkResult();
  }

  selectAnswerSC(ind: number) {
    // reset all givenanswer to false (this is single choice)
    this.question.qanswers.map((a) => (a.givenanswer = false));
    // then set choosen answer to true
    this.question.qanswers[ind].givenanswer = true;
    this.checkResult();
  }

  isQuestionAnswerOk() {
    // check ms/sc
    if (this.question.qtyp === 'mc' || this.question.qtyp === 'sc') {
      // finde eine falsche Antwort -> gesamte Frage ist falsch
      if (
        this.question.qanswers.find((ans) => ans.correct != ans.givenanswer)
      ) {
        return false;
      } else {
        return true;
      }
    } else if (this.question.qtyp === 'fi') {
      // check fi
      if (this.question.qgivenanswerFillIn != '') {
        // Antwort gegeben : check korrekt Anstwort
        if (
          this.question.qanswers.findIndex(
            (a) => a.txt[0] == this.question.qgivenanswerFillIn
          ) != -1
        ) {
          // correct answer found
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      // not either mc/sc/fi
      return false;
    }
    this.checkResult();
  }

  keyInput(input: string) {
    if (input.length == 0) {
      // input is empty -> no answer given
      this.question.qgivenanswerFillIn = '';
      this.question.qanswers[0].givenanswer = false;
    } else {
      // store answer ans set givenanswer = true
      this.question.qgivenanswerFillIn = input;
      this.question.qanswers[0].givenanswer = true;
    }
    // console.log(input);
    this.checkResult();
  }

  resetCurrentAnsweredQuestion() {
    this.question.qanswers.map((ans) => (ans.givenanswer = false));
    this.checkResult();
  }
  resetPreviousAnsweredQuestion() {
    if (this.currentQuestion >= 1)
      this.questions[this.currentQuestion - 1].qanswers.map(
        (ans) => (ans.givenanswer = false)
      );
    this.checkResult();
  }

  checkResult() {
    this.statistic.qmax = this.questions.length;
    // count answered questions
    // if qgivenanswerFillIn is not '' or givenanswer is true -> answered
    // count mc and sc qnsawered questions
    let mcscanswered = this.questions.filter((q) =>
      q.qanswers.find((a) => a.givenanswer == true)
    ).length;
    // count fi answered questions
    // let fianswered = this.questions.filter(
    //   (q) => q.qgivenanswerFillIn != ''
    // ).length;
    this.statistic.qanswered = mcscanswered;

    // calc not answeredf questions
    this.statistic.qnotanswered =
      this.statistic.qmax - this.statistic.qanswered;

    // calc wrong answered questions
    this.statistic.qwrong = 0;
    // find only one wrong answer in a question -> question is wrong
    let mcscwrong = this.questions.filter((q) =>
      q.qanswers.find(
        (a) => a.givenanswer == true && a.correct != a.givenanswer
      )
    ).length;

    // calc correct answered questions
    this.statistic.qcorrect = this.statistic.qanswered - mcscwrong;
  }

  showResult() {
    this.showResults = !this.showResults
  }
}
