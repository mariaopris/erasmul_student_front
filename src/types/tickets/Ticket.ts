export class Ticket {
  public id: number;
  public user_id: number;
  public admin_id: number;
  public title: string;
  public status: string;
  public department: string;
  public created_at: string | Date;
  public updated_at: string | Date;

  constructor(data: Ticket | void) {
    if(data === undefined)
    {
      this.id = 0;
      this.user_id = 0;
      this.admin_id = 0;
      this.title = '';
      this.status = 'Open';
      this.department = '';
      this.created_at = '';
      this.updated_at = '';
    }
    else {
      this.id = data.id;
      this.user_id = data.user_id;
      this.admin_id = data.admin_id;
      this.title = data.title;
      this.status = data.status;
      this.department = data.department;
      data.updated_at = new Date(data.updated_at);
      this.updated_at = data.updated_at.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
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
