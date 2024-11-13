export class Message {
  public id: number;
  public ticket_id: number;
  public user_type: number;
  public message: string;
  public created_at: string | Date;

  constructor(data: Message | void) {
    if(data === undefined) {
      this.id = 0;
      this.ticket_id = 0;
      this.user_type = 0;
      this.message = '';
      this.created_at = '';
    }
    else {
      this.id = data.id;
      this.ticket_id = data.ticket_id;
      this.user_type = data.user_type;
      this.message = data.message;
      data.created_at = new Date(data.created_at);
      this.created_at = data.created_at.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
  }
}
