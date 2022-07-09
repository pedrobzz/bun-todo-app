export type BaseUseCaseResponse<T> = {
  status: number;
  success: boolean;
  data?: T;
  error?: string;
};
