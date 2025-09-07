// Common response messages and reusable constants

export const RESPONSE = {
  SUCCESS: { code: 0, message: 'success', httpStatus: 200 },
  FAIL: { code: 1, message: 'fail', httpStatus: 400 },
  INVALID_CREDENTIALS: { code: 1001, message: 'Invalid credentials', httpStatus: 401 },
  USER_NOT_FOUND: { code: 1002, message: 'User not found', httpStatus: 404 },
  PRODUCT_NOT_FOUND: { code: 1003, message: 'Product not found', httpStatus: 404 },
  ORDER_NOT_FOUND: { code: 1004, message: 'Order not found', httpStatus: 404 },
  UNAUTHORIZED: { code: 1005, message: 'Unauthorized', httpStatus: 401 },
  FORBIDDEN: { code: 1006, message: 'Forbidden', httpStatus: 403 },
  CREATED: { code: 2001, message: 'Created successfully', httpStatus: 201 },
  UPDATED: { code: 2002, message: 'Updated successfully', httpStatus: 200 },
  DELETED: { code: 2003, message: 'Deleted successfully', httpStatus: 200 },
};

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const JWT_PAYLOAD = {
  SUB: 'sub',
  EMAIL: 'email',
  ROLE: 'role',
};
