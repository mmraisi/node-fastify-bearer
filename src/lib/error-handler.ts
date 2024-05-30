import Problem from "api-problem";
import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases } from "http-status-codes";

export const CustomApiErrors = {
  ERR_ALREADY_EXISTS: "ALREADY.EXISTS",
  ERR_MISSING_PROPERTIES: "MISSING.PROPERTIES",
  ERR_UNAUTHORIZED: "UNAUTHORIZED",
  ERR_NOT_FOUND: "NOT_FOUND",
  // add more as needed
};

export function buildApiErrorCode(context: string, error: string) {
  return [context.toUpperCase(), error].join(".");
}

/**
 * Handles errors and constructs an API Problem response.
 * @param error The error object.
 * @param request The Fastify request object.
 * @param reply The Fastify reply object.
 * @returns The constructed API Problem response.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorHandler(
  error: any,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const date = new Date();
  let problem;

  switch (true) {
    case error instanceof Problem:
      request.log.warn(error, error.message);
      problem = error;
      break;

    case error.constructor.name === "FastifyError":
      request.log.fatal(error, error.message);

      problem = new Problem(error.statusCode ?? 500, error.code, null, {
        detail: error.message,
      });
      break;

    case error instanceof SyntaxError:
      request.log.fatal(error, error.message);
      problem = new Problem(
        400,
        ReasonPhrases.BAD_REQUEST.toUpperCase(),
        null,
        {
          detail: error.message,
        }
      );
      break;

    // openApi spec validation error
    case error.validation !== undefined:
      request.log.warn(error, error.message);
      problem = new Problem(
        400,
        ReasonPhrases.BAD_REQUEST.toUpperCase(),
        null,
        {
          detail: error.message,
          code: "OPENAPI.SCHEMA.VALIDATION.FAILURE",
          validation: error.validation,
          validationContext: error.validationContext,
        }
      );
      break;

    default:
      // Log other errors as error level
      request.log.fatal(error, error.message);

      problem = new Problem(
        500,
        ReasonPhrases.INTERNAL_SERVER_ERROR.toUpperCase(),
        null,
        {
          detail: "Internal Server Error",
        }
      );
      break;
  }

  problem.date = date;

  // Log fatal errors
  if (problem.status >= 500) {
    request.log.fatal(error, error.message);
  }

  return reply
    .code(problem.status)
    .type("application/json")
    .send(JSON.stringify(problem));
}
