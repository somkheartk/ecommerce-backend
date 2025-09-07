// Common response messages and reusable constants

export const RESPONSE = {
  OK: { code: 0, message: 'SUCCESS', httpStatus: 200, meta: { page: null, limit: null, total: null, totalPages: null } },
  CREATED: { code: 1, message: 'CREATED', httpStatus: 201 },
  UPDATED: { code: 2, message: 'UPDATED', httpStatus: 200 },
  DELETED: { code: 3, message: 'DELETED', httpStatus: 200 },
  BAD_REQUEST: { code: 1000, message: 'BAD REQUEST', httpStatus: 400 },
  VALIDATION_ERROR: { code: 1001, message: 'VALIDATION ERROR', httpStatus: 400 },
  UNAUTHORIZED: { code: 1002, message: 'UNAUTHORIZED', httpStatus: 401 },
  FORBIDDEN: { code: 1003, message: 'FORBIDDEN', httpStatus: 403 },
  NOT_FOUND: { code: 1004, message: 'NOT FOUND', httpStatus: 404 },
  USER_NOT_FOUND: { code: 1100, message: 'USER NOT FOUND', httpStatus: 404 },
  PRODUCT_NOT_FOUND: { code: 1200, message: 'PRODUCT NOT FOUND', httpStatus: 404 },
  ORDER_NOT_FOUND: { code: 1300, message: 'ORDER NOT FOUND', httpStatus: 404 },
  CONFLICT: { code: 1400, message: 'CONFLICT', httpStatus: 409 },
  DUPLICATE: { code: 1401, message: 'DUPLICATE ENTRY', httpStatus: 409 },
  INTERNAL_SERVER_ERROR: { code: 1500, message: 'INTERNAL SERVER ERROR', httpStatus: 500 },
};

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const JWT_PAYLOAD = {
  SUB: 'SUB',
  EMAIL: 'EMAIL',
  ROLE: 'ROLE',
};
