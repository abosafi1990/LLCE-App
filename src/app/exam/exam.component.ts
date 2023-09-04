import { Component } from '@angular/core';
import { Question } from '../Interface/question';
import { Statistics } from '../Interface/statistics';
import { QueriesService } from '../service/queries.service';
@Component({
  selector: 'llce-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent {
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
  showResults: boolean = false;
  endExamFlag: boolean = false;
  xPercentFail: number = 20;
  xPercentFailFlag: boolean = false;
  xQuestionsWrong: number = 0;
  isLastQuestion: boolean = false;
  isFirstQuestion: boolean = false;

  constructor(public qs: QueriesService) {
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
    this.isFirstQuestion = true;

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
    this.statistic.percentWrong = this.statistic.qwrong / this.statistic.qmax;
    this.isLastQuestion = false;
  }

  selectExam101() {
    this.qs.setCatalog('101')
    this.selectAllQuestions()
  }

  selectExam102() {
    this.qs.setCatalog('102')
    this.selectAllQuestions()
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
    this.questions = this.questions.sort((a, b) => 0.5 - Math.random());
    this.firstQuestion();
  }

  shuffleAnswers() {
    this.questions = this.questions.map((q) => {
      q.qanswers = q.qanswers.sort((a, b) => 0.5 - Math.random());
      return q;
    });
    this.firstQuestion();
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
    this.showResults = false;
  }

  prevQuestion() {
    this.checkResult();

    this.isLastQuestion = false;
    this.isFirstQuestion = false;
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.question = this.questions[this.currentQuestion];
    }
    if (this.currentQuestion == 0) {
      this.isFirstQuestion = true;
    }
    this.showResults = false;
  }

  nextQuestion() {
               
    this.isLastQuestion = false;
    this.isFirstQuestion = false;

    // calc exam results
    this.checkResult();
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.question = this.questions[this.currentQuestion];
      this.isFirstQuestion = false;
      if (this.currentQuestion == this.questions.length - 1) {
        this.isLastQuestion = true;
      }
    }
  }

  firstQuestion() {
    this.isFirstQuestion = true;
    this.isLastQuestion = false;

    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
    this.whatIsCorrect = false;
    this.checkResult();
    this.showResults = false;
  }

  lastQuestion() {
    this.isFirstQuestion = false;
    this.isLastQuestion = true;

    this.currentQuestion = this.questions.length - 1;
    this.question = this.questions[this.currentQuestion];
    this.whatIsCorrect = false;
    this.checkResult();
    this.showResults = false;
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
    
    let mcanswered = this.questions.filter(
      (q) => q.qtyp == 'mc' && q.qanswers.find((a) => a.givenanswer == true)
    ).length;
    let scanswered = this.questions.filter(
      (q) => q.qtyp == 'sc' && q.qanswers.find((a) => a.givenanswer == true)
    ).length;
   
    let fianswered = this.questions.filter(
      (q) => q.qtyp == 'fi' && q.qanswers.find((a) => a.givenanswer == true)
    ).length;

    this.statistic.qanswered = mcanswered + scanswered + fianswered;

    // calc not answeredf questions
    this.statistic.qnotanswered =
      this.statistic.qmax - this.statistic.qanswered;

    // calc wrong answered questions
    this.statistic.qwrong = 0;
    // find only one wrong answer in a question -> question is wrong
    let mcscwrong = this.questions.filter(
      (q) =>
        (q.qtyp == 'mc' || q.qtyp == 'sc') &&
        q.qanswers.find(
          (a) => a.givenanswer == true && a.correct != a.givenanswer
        )
    ).length;
    // check only first fill answer
    let fiwrong = this.questions.filter(
      (q) =>
        q.qgivenanswerFillIn != '' &&
        q.qanswers[0].txt[0] != q.qgivenanswerFillIn
    ).length;
    // calc correct answered questions
    this.statistic.qcorrect = this.statistic.qanswered - mcscwrong - fiwrong;
    this.statistic.qwrong = mcscwrong + fiwrong;

    if (
      (this.statistic.qwrong / this.statistic.qmax) * 100 >=
      this.xPercentFail
    ) {
      this.xPercentFailFlag = true;
    }
    console.log(this.xPercentFailFlag,this.statistic);
  }

  showResult() {
    this.showResults = !this.showResults;
  }

  endExam() {
    this.endExamFlag = true;
  }
}
