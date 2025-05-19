import axios from "axios";
import {University} from "./University";
import {Department} from "./Department";
import Swal from "sweetalert2";

export class Degree {
  public id: number;
  public name: string;
  public university_id: number;
  public department_id: number;
  public level: string;
  public university: University;
  public show: boolean;

  constructor(data: Degree | void) {
    if(data === undefined) {
      this.id = 0;
      this.name = '';
      this.university_id = 0;
      this.department_id = 0;
      this.level = '';
      this.university = new University();
      this.show = false;
    }
    else {
      this.id = data.id;
      this.name = data.name;
      this.university_id = data.university_id;
      this.department_id = data.department_id;
      this.level = data.level;
      this.university = new University(data.university);
      if(data.hasOwnProperty('show')) {
        this.show = data.show;
      } else {
        this.show = false;
      }
    }
  }

  public async add(university: University, department: Department) {
    try {
      this.university_id = university.id;
      this.department_id = department.id;

      await axios.post("http://127.0.0.1:8000/api/degrees", {
        form: {
          'name': this.name,
          'university_id': this.university_id,
          'department_id': this.department_id,
          'level': this.level,
        },
      })
        .then(async (response) => {
          if (response.data.status) {
            Swal.fire({
              title: 'Success!',
              text: response.data.message,
              icon: 'success',
            })
          } else {
            let message = response.data.message;
            let title = 'Error...';
            if(Object.keys(response.data.errors).length > 0)
            {
              message = response.data.errors[Object.keys(response.data.errors)[0]];
              title = response.data.message;
            }
            Swal.fire({
              title: title,
              text: message,
              icon: 'error',
            })
          }
        });
    } catch (e) {
      console.log('error', e);
      Swal.fire({
        icon: 'error',
        title: 'Ooops..',
        text: e.response.data.error,
      })
    }
  }

}
