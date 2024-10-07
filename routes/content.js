// routes/content.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const slugify = require('slugify'); // Ensure slugify is installed

// Create new content

/**
 * @swagger
 * tags:
 *   name: Contents
 *   description: Content management endpoints
 */

/**
 * @swagger
 * /contents:
 *   post:
 *     summary: Create new content
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentCreate'
 *     responses:
 *       201:
 *         description: Content created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       400:
 *         description: Validation errors
 *       401:
 *         description: Unauthorized, invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 */
router.post(
  '/',
  auth(),
  [
    // Validation middleware
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('slug')
      .optional()
      .trim()
      .customSanitizer((value, { req }) => {
        if (value) {
          return slugify(value, { lower: true });
        } else {
          // If slug is not provided, generate from title
          return slugify(req.body.title, { lower: true });
        }
      })
      .custom(async value => {
        // Check if slug already exists
        const existingContent = await db.Content.findOne({
          where: { slug: value },
        });
        if (existingContent) {
          throw new Error('Slug already in use');
        }
        return true;
      }),
    body('body').notEmpty().withMessage('Body is required'),
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['draft', 'published'])
      .withMessage('Status must be either draft or published'),
    body('templateId')
      .optional()
      .isUUID()
      .withMessage('Template ID must be a valid UUID'),
  ],
  async (req, res, next) => {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const content = await db.Content.create({
        ...req.body,
        authorId: req.user.id,
      });
      res.status(201).json(content);
    } catch (error) {
      next(error);
    }
  },
);

// Get all contents with associated author and template

/**
 * @swagger
 * /contents:
 *   get:
 *     summary: Get all contents
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: A list of contents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContentWithRelations'
 */
router.get('/', async (req, res, next) => {
  try {
    const contents = await db.Content.findAll({
      include: [
        {
          model: db.User,
          as: 'author',
          attributes: ['id', 'username', 'email'],
        },
        { model: db.Template },
      ],
    });
    res.json(contents);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
