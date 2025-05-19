export class Feedback {
  public id: number;
  public recommendation_id: number;
  public score: number;
  public comment: string;

  constructor(data: Feedback | void) {
    if(data === undefined) {
      this.id = 0;
      this.recommendation_id = 0;
      this.score = 0;
      this.comment = '';
    }
    else {
      this.id = data.id;
      this.recommendation_id = data.recommendation_id;
      this.score = data.score;
      this.comment = data.comment;
    }
  }
}
