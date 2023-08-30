export interface Question {
    qid: number,
    qtyp: string,
    qtxt: string[],
    qanswers: Answer[],
    qcorrect?: string,
    qgivenanswerFillIn?: string,
    qinfo?: string[]
}
export interface Answer {
    txt: string[],
    correct?: boolean
    givenanswer?: boolean
}
