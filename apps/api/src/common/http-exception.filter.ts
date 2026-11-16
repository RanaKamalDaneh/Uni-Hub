import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

/**
 * Normalises every error into `{ statusCode, code, message, details? }`.
 * Internal errors never leak stack traces or SQL to clients.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions');

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') return;
    const res = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Something went wrong. Please try again.';
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
        code = HttpStatus[status] ?? 'ERROR';
      } else {
        const b = body as Record<string, unknown>;
        code = (b.code as string) ?? (HttpStatus[status] as string) ?? 'ERROR';
        if (Array.isArray(b.message)) {
          code = 'VALIDATION_ERROR';
          message = 'Some fields are invalid';
          details = b.message;
        } else {
          message = (b.message as string) ?? message;
          details = b.details;
        }
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        code = 'ALREADY_EXISTS';
        message = 'A record with these details already exists';
        details = { fields: exception.meta?.target };
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        code = 'NOT_FOUND';
        message = 'The requested record was not found';
      } else if (exception.code === 'P2003') {
        status = HttpStatus.CONFLICT;
        code = 'IN_USE';
        message = 'This record is referenced by other data and cannot be changed';
      } else {
        this.logger.error(exception.message);
      }
    } else {
      this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    }

    res.status(status).json({ statusCode: status, code, message, ...(details ? { details } : {}) });
  }
}
