export type Signed<T> = {
  data: T & {
    signedAt: Date;
  };
  key: string;
  sign: string;
};

export type SignedProofed<T> = {
  date: T & {
    signedAt: Date;
  };
  key: string;
  sign: string;
  pow: string;
};

export type SubmitRequest = SignedProofed<{
  format: string;
  files: Record<
    string,
    {
      language: string;
      content: string;
    }
  >;
}>;

export type SubmitResponse = {
  submissionId: string;
};

export type SolveCertificate = Signed<{
  identity: string;
  problemId: string;
  score: number;
}>;

export type SubmissionResponse =
  | {
      status: 'waiting' | 'judging';
      additionalInfo?: string;
      progress?: number;
    }
  | {
      status: 'finished';
      verdict: 'AC' | 'PC' | 'WA' | 'TLE' | 'MLE' | 'OLE' | 'RE' | 'CE' | 'UE' | 'NA';
      additionalInfo?: string;
      certificate?: SolveCertificate;
    };
