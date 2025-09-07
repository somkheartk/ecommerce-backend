// Common utility functions for the backend

export function buildResponse({ code, message, data = null, error = null }: {
  code: any;
  message: any;
  data?: any;
  error?: any;
}) {
  const res: Record<string, any> = { code, message };
  if (data !== null && data !== undefined) res.data = data;
  if (error !== null && error !== undefined) res.error = error;
  return res;
}

// Example usage:
// return res.status(RESPONSE.SUCCESS.httpStatus).json(buildResponse({
//   code: RESPONSE.SUCCESS.code,
//   message: RESPONSE.SUCCESS.message,
//   data: result
// }));
