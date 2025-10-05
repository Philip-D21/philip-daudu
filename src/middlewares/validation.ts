import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';


// Common validation schemas
export const commonSchemas = {
  // UUID validation
  uuid: Joi.string().uuid().required(),
  uuidOptional: Joi.string().uuid().optional(),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().optional(),
    order: Joi.string().valid('ASC', 'DESC').default('ASC')
  }),

  // Date range
  dateRange: Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
  }),

  // Search
  search: Joi.object({
    q: Joi.string().min(2).max(100).required(),
    departmentId: Joi.string().uuid().optional()
  })
};

// Department validation schemas
export const departmentSchemas = {
  create: Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.empty': 'Department name is required',
        'string.min': 'Department name must be at least 2 characters',
        'string.max': 'Department name must not exceed 100 characters'
      })
  }),

  update: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional()
      .messages({
        'string.min': 'Department name must be at least 2 characters',
        'string.max': 'Department name must not exceed 100 characters'
      })
  }),

  getEmployees: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    sort: Joi.string().valid('name', 'email', 'createdAt').default('name'),
    order: Joi.string().valid('ASC', 'DESC').default('ASC')
  })
};

// Employee validation schemas
export const employeeSchemas = {
  create: Joi.object({
    name: Joi.string().trim().min(2).max(255).required()
      .messages({
        'string.empty': 'Employee name is required',
        'string.min': 'Employee name must be at least 2 characters',
        'string.max': 'Employee name must not exceed 255 characters'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address'
      }),
    departmentId: Joi.string().uuid().required()
      .messages({
        'string.empty': 'Department ID is required',
        'string.guid': 'Department ID must be a valid UUID'
      })
  }),

  update: Joi.object({
    name: Joi.string().trim().min(2).max(255).optional(),
    email: Joi.string().email().optional(),
    departmentId: Joi.string().uuid().optional()
  }),

  getById: Joi.object({
    id: Joi.string().uuid().required()
      .messages({
        'string.guid': 'Employee ID must be a valid UUID'
      })
  })
};

// Leave request validation schemas
export const leaveRequestSchemas = {
  create: Joi.object({
    employeeId: Joi.string().uuid().required()
      .messages({
        'string.empty': 'Employee ID is required',
        'string.guid': 'Employee ID must be a valid UUID'
      }),
    startDate: Joi.date().iso().min('now').required()
      .messages({
        'date.min': 'Start date must be in the future'
      }),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
      .messages({
        'date.min': 'End date must be after start date'
      }),
    reason: Joi.string().trim().max(1000).optional()
      .messages({
        'string.max': 'Reason must not exceed 1000 characters'
      })
  }).custom((value, helpers) => {
    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);

    if (startDate > maxFutureDate) {
      return helpers.error('any.custom', {
        message: 'Leave requests cannot be more than 1 year in advance'
      });
    }

    // Check if leave duration is reasonable (max 30 days)
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
      return helpers.error('any.custom', {
        message: 'Leave requests cannot exceed 30 days'
      });
    }

    return value;
  }),

  update: Joi.object({
    status: Joi.string().valid('APPROVED', 'REJECTED', 'PENDING_APPROVAL').required(),
    approvedBy: Joi.string().uuid().when('status', {
      is: 'APPROVED',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    }),
    rejectionReason: Joi.string().trim().max(1000).when('status', {
      is: 'REJECTED',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
  }),

  getById: Joi.object({
    id: Joi.string().uuid().required()
      .messages({
        'string.guid': 'Leave request ID must be a valid UUID'
      })
  }),

  dateRangeQuery: Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    status: Joi.array().items(
      Joi.string().valid('PENDING', 'APPROVED', 'REJECTED', 'PENDING_APPROVAL')
    ).optional(),
    departmentId: Joi.string().uuid().optional()
  })
};