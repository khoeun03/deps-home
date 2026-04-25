export type ProblemsResponse = {
  data: {
    id: string;
    title: string;
  }[];
  totalCount: number;
};

export type MinMaxRequirement = {
  min?: number;
  max?: number;
};

export type SubmitFile = {
  name: string;
  languages: string[];
  content?: string;
  count?: MinMaxRequirement;
  bytes?: MinMaxRequirement;
};

export type SubmitFormat = {
  totalBytes?: MinMaxRequirement;
  fileCount?: MinMaxRequirement;
  files: SubmitFile[];
};

export type ProblemResponse = {
  id: string;
  title: string;
  content: string;
  powFactor: number;
  formats: Record<string, SubmitFormat>;
};

export type SubmissionsResponse = {
  data: {
    id: string;
    problemId: string;
    format: string;
    verdict?: string;
    submittedAt: Date;
  }[];
  totalCount: number;
};
