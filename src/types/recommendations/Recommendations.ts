import {RecommendedCourse} from "./RecommendedCourse";
import {University} from "../universities/University";

export class Recommendations {
  public university_id: number;
  public university_name: string;
  public recommended_courses: RecommendedCourse[];
  public university: University;

  constructor(data: Recommendations | void) {
    if(data === undefined) {
      this.university_id = 0;
      this.university_name = '';
      this.recommended_courses = <RecommendedCourse[]>[];
      this.university = new University();
    }
    else {
      this.university_id = data.university_id;
      this.university_name = data.university_name;
      this.recommended_courses = data.recommended_courses;
      if(data.hasOwnProperty('university')) {
        this.university = new University(data.university);
      }
    }
  }
}
