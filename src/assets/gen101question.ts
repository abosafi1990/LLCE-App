// 20221204 antonius ehlen 
//         with ideas by robert levandowski

// generates JSON files containing queries of 
//          FillIn, SngleChoice, MultipleChoice
//                    and one file containing them all  
//   starting point is a QA-QuestionAnswer text file using 
//   the QA file format of QA additional text files of the lpisim program

// changed: 202303141513 ae
//   something simplified and corrected 

// libs to use
import * as fs from 'fs';
// import { parse } from 'querystring';

// array question startLineNumbers
let qStarts: number[] = []
// question array, one question one string
let qArray: string[] = []

// arrays for final question lists of 
//      sc - SingleChoice, mc - MultipleChoice, fi - FillIn questions
let scQuestions: string[] = []
let mcQuestions: string[] = []
let fiQuestions: string[] = []

// set file name
let fname = 'LPI-2019-1-101d-QA'
console.log('Filename:', fname)

// read file content
let fileContent = fs.readFileSync(fname, "utf-8")

// get indexes of questens in fileContent
while (fileContent.indexOf("QUESTION") !== -1) {
    qStarts.push(fileContent.indexOf("QUESTION"))
    fileContent = fileContent.replace("QUESTION", "Question")
}

// generate array of questions
for (let i = 0; i < qStarts.length; i++) {
    qArray.push(fileContent.slice(qStarts[i], (qStarts[i + 1])).replace(/\n\n/g, '\n'))
}

// select FillIn questions
for (let q of qArray) {
    if (q.indexOf('A. ') === -1) {
        fiQuestions.push(q.replace(/\n\n/g, '\n'))
    }
}

// select SingleChoice questions
for (let q of qArray) {
    let pos = q.indexOf('Answer:')
    if (q[pos + 9] === "\n") {
        scQuestions.push(q.replace(/\n\n/g, '\n'))
    }
}

// select MultipleChoice questions
for (let q of qArray) {
    let pos = q.indexOf('Answer:')
    if (q[pos + 9] !== "\n" && q.indexOf('A. ') !== -1) {
        mcQuestions.push(q)
    }
}

console.log('  FillIns: ', fiQuestions.length)
console.log('  SingleChoices: ', scQuestions.length)
console.log('  MultipleChoices: ', mcQuestions.length)

// parsing functions for 
//      fi: FillIn, 
//      sc: SingleChoice and 
//      mc: MultipleChoice query types

// ++++++++++++++++++
function fiParse(q: string) {
    // fi: FillIn parsing 
    interface FiQuery {
        qid: number,
        qtyp: 'fi',
        qtxt: string[],
        qanswers: FiAnswers[],
        qinfo: string[]
    }
    interface FiAnswers {
        txt: string[]
    }

    let fiQuery: FiQuery = {
        qid: -1,
        qtyp: 'fi',
        qtxt: [],
        qanswers: [],
        qinfo: []
    }
    // my be expanded in programs with a givenAnsCorrect field
    //      let fianswers = { txt: [], givenAnsCorrect: false }
    let fianswers: FiAnswers = { txt: [] }

    let qStringArray = q.split('\n')

    let infoTextArray: string[] = []
    let foundQuestionNr: boolean = false
    let foundCorrectAnswer: boolean = false

    for (let zeile of qStringArray) {
        let regexQuestion = /Question (\d+):/
        let regexAnswer = /Answer: (.*)/

        if (zeile.match(regexQuestion)) {
            foundQuestionNr = true
            fiQuery.qid = parseInt(zeile.match(regexQuestion)![1])
            fianswers = { txt: [] }
        } else if (zeile.match(regexAnswer)) {
            foundCorrectAnswer = true
            let answerline = zeile.match(regexAnswer)![1]
            for (let ans of answerline.split(','))
                fianswers.txt.push(ans)
        } else if (foundQuestionNr && foundCorrectAnswer) {
            // everything after Answer line is info
            if (!(zeile === '' && infoTextArray.length === 0)) {
                infoTextArray.push(zeile)
            }
        } else {
            if (!(zeile === '' && fiQuery.qtxt.length === 0)) {
                fiQuery.qtxt.push(zeile)
            }
        }
    }
    fiQuery.qanswers.push(fianswers)
    fiQuery.qinfo = infoTextArray

    return fiQuery
}

// ++++++++++++++++++++++++
// si: SingleChoice parsing
function scParse(q: string) {
    interface ScQuery {
        qid: number,
        qtyp: 'sc',
        qtxt: string[],
        qanswers: ScAnswers[],
        qcorrect: string,
        qinfo: string[]
    }
    interface ScAnswers {
        txt: string[],
        correct: boolean
    }

    let scQuery: ScQuery = {
        qid: -1,
        qtyp: 'sc',
        qtxt: [],
        qanswers: [],
        qcorrect: '',
        qinfo: []
    }

    let qStringArray = q.split('\n')

    let answersTextArray: string[] = []
    let infoTextArray: string[] = []

    let foundQuestionNr: boolean = false
    let foundAnswersAZ: boolean = false
    let foundCorrectAnswer: boolean = false

    // first step: select query text, correct answer and info 
    //      and prepare answers for second step 
    for (let zeile of qStringArray) {
        let regexQuestion = /Question (\d+):/
        let regexAnswersAZ = '^([A-Z]\. ).*'
        let regexAnswer = /Answer: (.*)/

        if (zeile.match(regexQuestion)) {
            // start of question
            foundQuestionNr = true
            scQuery.qid = parseInt(zeile.match(regexQuestion)![1])
        } else if (zeile.match(regexAnswer)) {
            // found Answer: line
            foundCorrectAnswer = true
            scQuery.qcorrect = zeile.match(regexAnswer)![1]
        } else if (zeile.match(regexAnswersAZ)) {
            // found a single answer
            foundAnswersAZ = true
            answersTextArray.push(zeile)
        } else if (foundQuestionNr && !foundAnswersAZ) {
            // add question text
            if (!(zeile === '' && scQuery.qtxt.length === 0)) {
                scQuery.qtxt.push(zeile)
            }
        } else if (foundAnswersAZ && !foundCorrectAnswer) {
            if (!(zeile === '' && answersTextArray.length === 0)) {
                // add answer AZ letter
                answersTextArray.push(zeile)
            }
        } else if (foundQuestionNr && foundCorrectAnswer) {
            // everything after Answer: line
            if (!(zeile === '' && infoTextArray.length === 0)) {
                infoTextArray.push(zeile)
            }
        }
    };
    scQuery.qinfo = infoTextArray


    // second step: 
    //   prepare answer array adding it later to query

    let scAnswer: ScAnswers = { txt: [], correct: false }
    // my be expanded in programs with a selected field
    //      let scAnswer = { txt: [], correct: false, selected: false }

    // build answers array and add true to correct answer
    // verarbeite so etwas: (in answersTextArray vorhanden)
    // A. text test
    //   andere zeile
    // B. zweite antwort
    // C. dritte antwort
    //   folgezeile dritte antwort
    // usw.
    // korrekte antwort liegt in scQuery.qcorrect vor

    let regexFindAZ = '^([A-Z]). '
    let foundFirstAtoZ: boolean = false
    let foundlinestartwithblank = false
    for (let zeile of answersTextArray) {
        let regexFoundAZ = zeile.match(regexFindAZ)
        if (regexFoundAZ && !foundFirstAtoZ) {
            foundFirstAtoZ = true
            foundlinestartwithblank = false

            scAnswer = { txt: [], correct: false }
            if (regexFoundAZ.input != undefined) {
                scAnswer.txt.push(regexFoundAZ.input)
            }
            // check if answer is correct answer
            if (scQuery.qcorrect.includes(regexFoundAZ[1])) {
                scAnswer.correct = true
            }
        } else {
            // found next AZ or a line which starts with blank 
            //                          => add line to AZ answer
            if (regexFoundAZ) {
                // found next AZ
                foundlinestartwithblank = false
                // store previous answer
                scQuery.qanswers.push(scAnswer)
                // set new answer default object
                scAnswer = { txt: [], correct: false }
                if (regexFoundAZ!.input != undefined) {
                    scAnswer.txt.push(regexFoundAZ!.input)
                }
                // is answer correct?
                if (scQuery.qcorrect.includes(regexFoundAZ[1])) {
                    scAnswer.correct = true
                }
            } else {
                foundlinestartwithblank = true
                // found an additional line,  if this line starts 
                //      with a blank, this indicates program code 
                scAnswer.txt.push(zeile)
            }
        }
    }
    // add last answer 
    scQuery.qanswers.push(scAnswer)

    return scQuery
}

// ++++++++++++++++++++++
// MultipleChoice parsing
function mcParse(q: string) {
    interface McQuery {
        qid: number,
        qtyp: 'mc',
        qtxt: string[],
        qanswers: McAnswers[],
        qcorrect: string,
        qinfo: string[]
    }
    interface McAnswers {
        txt: string[],
        correct: boolean
    }

    let mcQuery: McQuery = {
        qid: -1,
        qtyp: 'mc',
        qtxt: [],
        qanswers: [],
        qcorrect: '',
        qinfo: []
    }

    let qStringArray = q.split('\n')

    let answersTextArray: string[] = []
    let infoTextArray: string[] = []

    let foundQuestionNr: boolean = false
    let foundAnswersAZ: boolean = false
    let foundCorrectAnswer: boolean = false

    // first step: 
    //   set query text, correct answer and info and 
    //   prepare answers for second step 
    for (let zeile of qStringArray) {
        let regexQuestion = /Question (\d+):/
        let regexAnswersAZ = '^([A-Z]\. ).*'
        let regexAnswer = /Answer: (.*)/

        if (zeile.match(regexQuestion)) {
            // start of question
            foundQuestionNr = true
            mcQuery.qid = parseInt(zeile.match(regexQuestion)![1])
        } else if (zeile.match(regexAnswer)) {
            // found Answer: line
            foundCorrectAnswer = true
            mcQuery.qcorrect = zeile.match(regexAnswer)![1]
        } else if (zeile.match(regexAnswersAZ)) {
            // found an answer
            foundAnswersAZ = true
            answersTextArray.push(zeile)
        } else if (foundQuestionNr && !foundAnswersAZ) {
            // add question text
            if (!(zeile === '' && mcQuery.qtxt.length === 0)) {
                mcQuery.qtxt.push(zeile)
            }
        } else if (foundAnswersAZ && !foundCorrectAnswer) {
            // add answer AZ letter
            answersTextArray.push(zeile)
        } else if (foundQuestionNr && foundCorrectAnswer) {
            // everything after 'Answer:' line is info text
            if (!(zeile === '' && infoTextArray.length === 0)) {
                infoTextArray.push(zeile)
            }
        }
    };
    mcQuery.qinfo = infoTextArray

    let foundFirstAtoZ: boolean = false
    let foundlinestartwithblank = false

    // second step: 
    //   build answers array and add true to correct answers
    let mcAnswer: McAnswers = { txt: [], correct: false }
    // my be expanded in programs with a selected field
    // let mcAnswer = { txt: [], correct: false, selected: false }

    for (let zeile of answersTextArray) {
        let regexFindAZ = '^([A-Z])[.] '
        let regexFoundAZ = zeile.match(regexFindAZ)
        if (regexFoundAZ && !foundFirstAtoZ) {
            // found first AZ
            foundFirstAtoZ = true
            foundlinestartwithblank = false
            mcAnswer = { txt: [], correct: false }
            if (regexFoundAZ!.input) {
                mcAnswer.txt.push(regexFoundAZ.input)
            }

            // is answer correct?
            if (mcQuery.qcorrect.includes(regexFoundAZ[1])) {
                mcAnswer.correct = true
            }
        } else {
            // found next AZ or line which starts with blank 
            //                          => add line to AZ answer
            if (regexFoundAZ) {
                // found next AZ
                foundlinestartwithblank = false
                // store previous answer
                mcQuery.qanswers.push(mcAnswer)
                // set new answer default object
                mcAnswer = { txt: [], correct: false }
                if (regexFoundAZ.input != undefined) {
                    mcAnswer.txt.push(regexFoundAZ!.input)
                }
                // is answer correct?
                if (mcQuery.qcorrect.includes(regexFoundAZ[1])) {
                    mcAnswer.correct = true
                }
            } else {
                // a normal text line - add to current answer
                foundlinestartwithblank = true
                mcAnswer.txt.push(zeile)
            }
        }
    }
    // add last answer 
    mcQuery.qanswers.push(mcAnswer)

    return mcQuery
}

// Generate results
// +++++++++++ prepare arrays and write JSON files ++++++++++++++++++++++++
let wfname = ''


// +++++ Fill In:
wfname = fname + "-fi.json"
//   generate fi JSON ready object
let fiQuestionsReady = []
for (let i = 0; i < fiQuestions.length; i++) {
    fiQuestionsReady.push(fiParse(fiQuestions[i]))
}
fiQuestionsReady.sort((a, b) => a.qid - b.qid)
//   write fi JSON question files
fs.writeFile(fname + "-fi.json", JSON.stringify(fiQuestionsReady, null, 2), "utf-8", function (err) {
    if (err) console.log(err)
})
console.log('  generated: ', wfname)

// +++++ Single Choice:
wfname = fname + "-sc.json"
//   generate sc JSON ready object
let scQuestionsReady = []
for (let i = 0; i < scQuestions.length; i++) {
    scQuestionsReady.push(scParse(scQuestions[i]))
}
scQuestionsReady.sort((a, b) => a.qid - b.qid)
//   write sc JSON question files
fs.writeFile(wfname, JSON.stringify(scQuestionsReady, null, 2), "utf-8", function (err) {
    if (err) console.log(err)
})
console.log('  generated: ', wfname)

// +++++ Multiple Choice:
wfname = fname + "-mc.json"
//   generate mc JSON ready object
let mcQuestionsReady = []
for (let i = 0; i < mcQuestions.length; i++) {
    mcQuestionsReady.push(mcParse(mcQuestions[i]))
}
mcQuestionsReady.sort((a, b) => a.qid - b.qid)
//   write mc JSON question files
fs.writeFile(wfname, JSON.stringify(mcQuestionsReady, null, 2), "utf-8", function (err) {
    if (err) console.log(err)
})
console.log('  generated: ', wfname)

// +++++ AllQuestions:
// ++ all questions in one JSON file ascending sorted +++++++++
wfname = fname + "-all.json"
let allqs: any[] = []

allqs = allqs.concat(scQuestionsReady, mcQuestionsReady, fiQuestionsReady)
// ++ sort them all bei query id
allqs.sort((a, b) => a.qid - b.qid)

// ++ write allqs JSON question files
fs.writeFile(wfname, JSON.stringify(allqs, null, 2), "utf-8", function (err) {
    if (err) console.log(err)
})
console.log('  generated: ', wfname)

// ende
