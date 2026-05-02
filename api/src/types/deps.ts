export type Signed<T> = {
  data: T & {
    signedAt: Date;
  };
  key: string;
  sign: string;
};

export type SubmitResponse = {
  submissionId: string;
};

export type SolveCertificate = Signed<{
  identity: string;
  problemId: string;
  score: number;
}>;
