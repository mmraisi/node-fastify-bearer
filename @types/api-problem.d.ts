declare module "api-problem" {
  export default class Problem {
    status: number;
    title?: string | null;
    type?: string | null;
    detail?: string;
    message?: string;
    [key: string]: unknown;

    constructor(
      status: number,
      title?: string | null,
      type?: string | null,
      details?: { [key: string]: unknown }
    );
    constructor(status: number, details?: { [key: string]: unknown });

    // Additional methods or properties can be defined here if needed
  }
}
