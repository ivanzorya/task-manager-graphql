export interface Task {
    _id: string;
    subject: string;
    done: boolean;
  }

export interface NewTask {
  subject: string;
  done: boolean;
}
