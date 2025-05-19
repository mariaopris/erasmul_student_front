export class Documentt {
  public id: number;
  public user_id: number;
  public type: string;
  public status: string;
  public path: string;
  public feedback: string;

  constructor(data: Documentt | void) {
    if(data === undefined) {
      this.id = 0;
      this.user_id = 0;
      this.type = '';
      this.status = 'Not Available';
      this.path = '';
      this.feedback = '';
    }
    else {
      this.id = data.id;
      this.user_id = data.user_id;
      this.type = data.type;
      this.status = data.status;
      this.path = data.path;
      this.feedback = data.feedback;
    }
  }
}
