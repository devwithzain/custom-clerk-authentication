export type TverifyEmailProps = {
   email: string;
};

export type TregisterFormProps = {
   onVerificationStart: (email: string) => void;
};