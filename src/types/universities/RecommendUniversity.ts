export class RecommendUniversity {
  public year: string;
  public duration: string;
  public faculty: string;
  public preferred_countries: [];

  constructor(data: RecommendUniversity | void) {
    if(data === undefined) {
      this.year = '';
      this.duration = '';
      this.faculty = '';
      this.preferred_countries = [];
    }
    else {
      this.year = data.year;
      this.duration = data.duration;
      this.faculty = data.faculty;
      this.preferred_countries = data.preferred_countries;
    }
  }
}
