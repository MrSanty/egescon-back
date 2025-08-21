import { ValidationError } from '@nestjs/common';

export const formatValidationErrors = (errors: ValidationError[]) => {
  const formattedErrors = {};
  errors.forEach((err) => {
    formattedErrors[err.property] = Object.values(err.constraints || {}).map(
      (message) => {
        return { message };
      },
    );
  });
  return formattedErrors;
};
