// routes/template.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, validationResult } = require('express-validator');

// Create a new template

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: Template management endpoints
 */

/**
 * @swagger
 * /templates:
 *   post:
 *     summary: Create a new template
 *     tags: [Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemplateCreate'
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Template'
 *       400:
 *         description: Validation errors
 */
router.post(
  '/',
  [
    // Validation middleware
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .custom(async value => {
        // Check if template name already exists
        const existingTemplate = await db.Template.findOne({
          where: { name: value },
        });
        if (existingTemplate) {
          throw new Error('Template name already in use');
        }
        return true;
      }),
    body('components')
      .notEmpty()
      .withMessage('Components are required')
      .isObject()
      .withMessage('Components must be a valid JSON object'),
    body('description').optional().trim(),
  ],
  async (req, res, next) => {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const template = await db.Template.create(req.body);
      res.status(201).json(template);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
