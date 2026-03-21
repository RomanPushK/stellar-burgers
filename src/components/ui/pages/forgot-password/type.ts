export type ForgotPasswordUIProps = {
  errorText: string;
  email: string;
  setEmail: (e: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
};