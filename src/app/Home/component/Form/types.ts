export type TodoFormData = {
  title?: string;
  todoInput?: string;
  reflection?: string;
};

export type ModalFormEndOptions = {
  timerId: string;
  startTime: string;
  pausedDuration?: number;
  endTime?: string;
};

export type ModalFormProps = {
  mode: FormMode;
  studyLogId?: string;
  endOptions?: ModalFormEndOptions;
};

export type FormMode = "create" | "edit" | "end";
