export class Step {
  public id: number;
  public type: string;
  public tag: string;
  public status: string;

  constructor(data: Step | void) {
    if(data === undefined) {
      this.id = 0;
      this.type = '';
      this.tag = '';
      this.status = '';
    }
    else {
      this.id = data.id;
      this.type = data.type;
      this.tag = data.tag;
      this.status = data.status;
    }
  }
}
