export class RecommendedCourse {
  public course_id: number;
  public course_name: string;
  public course_no_credits: number;
  public university_id: number;
  public university_name: string;
  public similarity_score: number;

  constructor(data: RecommendedCourse | void) {
    if(data === undefined) {
      this.course_id = 0;
      this.course_name = '';
      this.course_no_credits = 0;
      this.university_id = 0;
      this.university_name = '';
      this.similarity_score = 0;
    }
    else {
      this.course_id = data.course_id;
      this.course_name = data.course_name;
      this.course_no_credits = data.course_no_credits;
      this.university_id = data.university_id;
      this.university_name = data.university_name;
      this.similarity_score = data.similarity_score;
    }
  }
}
