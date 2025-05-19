import {Recommendations} from "./Recommendations";
import {RecommendedCourse} from "./RecommendedCourse";

export class Recommendation {
  public recommendations: Recommendations[];
  public recommendations_for_required_credits: RecommendedCourse[];
  public message: string;
  public description: string;

  constructor(data: Recommendation | void) {
    if(data === undefined) {
      this.recommendations = <Recommendations[]>[];
      this.recommendations_for_required_credits = <RecommendedCourse[]>[];
      this.message = '';
      this.description = '';
    }
    else {
      this.recommendations = <Recommendations[]>[];
      this.recommendations_for_required_credits = <RecommendedCourse[]>[];
      if(data) {
        this.message = data.message;
        this.description = data.description;
        if(data.hasOwnProperty('recommendations')) {
          data.recommendations.forEach((recommendation: Recommendations) => {
            this.recommendations.push(new Recommendations(recommendation));
          })
        }
        data.recommendations_for_required_credits.forEach((recommendations_for_required_credit: RecommendedCourse) => {
          this.recommendations_for_required_credits.push(new RecommendedCourse(recommendations_for_required_credit));
        })
      }
    }
  }
}
