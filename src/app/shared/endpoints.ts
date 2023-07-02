import {environment} from '../../environments/environment';

export class Endpoints {
  private baseUrl = environment.base_url;

  // Authentication
  public registration = this.baseUrl + '/api/auth/signup';
  public login = this.baseUrl + '/api/auth/signin';
  public reset = this.baseUrl + '/api/auth/reset';
  public resetPass = this.baseUrl + '/api/auth/reset-password';

  // Classes
  public create_class = this.baseUrl + '/api/classes/create';
  public get_class = this.baseUrl + '/api/classes/get';
  public get_class_by_student = this.baseUrl + '/api/classes/get/student';
  public get_teacher_by_class = this.baseUrl + '/api/classes/get/teacher';
  public update_class = this.baseUrl + '/api/classes/update';
  public delete_class = this.baseUrl + '/api/classes/delete';

  // RCs
  public create_rc = this.baseUrl + '/api/rating-category/create';
  public get_rc = this.baseUrl + '/api/rating-category/get';
  public update_rc = this.baseUrl + '/api/rating-category/update';
  public delete_rc = this.baseUrl + '/api/rating-category/delete';

  // Students
  public create_students = this.baseUrl + '/api/students/create';
  public get_students_by_class = this.baseUrl + '/api/students/get/classes';
  public get_students_by_parent = this.baseUrl + '/api/students/get/by/parent';
  public add_student_to_class = this.baseUrl + '/api/students/add-to-class';
  public update_students = this.baseUrl + '/api/students/update';
  public delete_students = this.baseUrl + '/api/students/delete';
  public mark_sick = this.baseUrl + '/api/students/mark/sick';
  public get_sick = this.baseUrl + '/api/students/get/sick';
  public remove_student = this.baseUrl + '/api/classes/del/class';

  // Rating
  public create_rating = this.baseUrl + '/api/rating/create';
  public get_rating = this.baseUrl + '/api/rating/get';

  // Appointment
  public create_appointment = this.baseUrl + '/api/appointments/create';
  public update_appointment = this.baseUrl + '/api/appointments/update';
  public get_appointment_by_user = this.baseUrl + '/api/appointments/get-by/user';

  // Activity
  public create_activity = this.baseUrl + '/api/activity/create';
  public get_activity = this.baseUrl + '/api/activity/get-by/class';

  // Attendance
  public attendance = this.baseUrl + '/api/attendance';

  // Homework
  public homework = this.baseUrl + '/api/homework';

  // Category
  public category = this.baseUrl + '/api/categories';

  // Files
  public files = this.baseUrl + '/api/filesfolders';

  // Profile
  public profile = this.baseUrl + '/api/profile';
}
