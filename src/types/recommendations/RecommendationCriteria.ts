import {University} from "../universities/University";
import {Recommendation} from "./Recommendation";

export class RecommendationCriteria {
  public id: number;
  public user_id: number;
  public year: string;
  public duration: string;
  public university: University;
  public degree: string;
  public preferred_countries: string;
  public study_language: string;
  public recommendation: Recommendation;
  public status: string;
  public created_at: Date|string;

  constructor(data: RecommendationCriteria | void) {
    if(data === undefined) {
      this.id = 0;
      this.user_id = 0;
      this.year = '';
      this.duration = '';
      this.university = new University();
      this.degree = '';
      this.preferred_countries = '';
      this.study_language = '';
      this.recommendation = new Recommendation();
      this.status = '';
      this.created_at = '';
    }
    else {
      this.id = data.id;
      this.user_id = data.user_id;
      this.year = data.year;
      this.duration = data.duration;
      this.university = new University(data.university);
      this.degree = data.degree;
      this.preferred_countries = JSON.parse(data.preferred_countries);
      this.study_language = JSON.parse(data.study_language);
      data.recommendation = JSON.parse(data.recommendation);
      this.recommendation = new Recommendation(data.recommendation);
      this.status = data.status;
      const date = new Date(data.created_at);
      this.created_at = date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  }
}
