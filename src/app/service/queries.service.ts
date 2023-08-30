import { Injectable } from '@angular/core';

import lpic101 from '../../assets/LPI-2019-1-101d-QA-all.json'
import lpic102 from '../../assets/LPI-2019-1-102d-QA-all.json'
import { Question } from '../Interface/question';

@Injectable({
  providedIn: 'root'
})
export class QueriesService {
  // questions: Question[] = lpic101
  questions: Question[] = []
  catalog: string = '101'

  constructor() {
    this.questions = lpic101
  }

  setCatalog(catalog: string) {
    if(catalog == '101') {
      this.catalog = catalog
    } else if(catalog == '102') {
      this.catalog = catalog
    } else {
      this.catalog = '101'
    }
  }

  getCatalog() {
    return this.catalog
  }

  getLpicQuestions() {
    let catalog = this.getCatalog()
    if(catalog == '101') {
      this.questions = lpic101
    } else if(catalog == '102') {
      this.questions = lpic102
    } else {
      this.questions = lpic101
    }
  }

  getAll(): Question[] {
    this.getLpicQuestions()
    return this.questions
  }

  getAllMc(): Question[] {
    this.getLpicQuestions()
    return this.questions.filter(q => q.qtyp == 'mc')
  }

  getAllSc(): Question[] {
    this.getLpicQuestions()
    return this.questions.filter(q => q.qtyp == 'sc')
  }

  getAllFi(): Question[] {
    this.getLpicQuestions()
    return this.questions.filter(q => q.qtyp == 'fi')
  }

  initAllQuestions() {
    this.questions.map((q) => {
      q.qtyp == 'mc';
      q.qanswers.map((a) => (a.givenanswer = false));
    });
    this.questions.map((q) => {
      q.qtyp == 'sc';
      q.qanswers.map((a) => (a.givenanswer = false));
    });
    this.questions.map((q) => {
      q.qtyp == 'fi';
      q.qgivenanswerFillIn = '';
    });
  }
}
