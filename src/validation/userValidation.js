import { body } from 'express-validator';

const userPostValidation = [ 
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password must not be empty!')
        .isLength({ min: 8})
        .withMessage('Password must be at least 8 characters!')
        .not()
        .isIn(['password', 'passwort', 'password123', 'passwort123', 'test1234', '00000000', 'hallo123', 'helloworld', 'hallowelt', '12345678'])
        .withMessage('Invalid password!'),
    body('username')
        .not()
        .isEmpty()
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Username must be an email address!')
];

const userPutValidation = [
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password must not be empty!')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters!')
        .not()
        .isIn(['password', 'passwort', 'password123', 'passwort123', 'test1234', '00000000', 'hallo123', 'helloworld', 'hallowelt', '12345678'])
        .withMessage('Invalid password!')
        .optional(),
    body('username')
        .isEmail()
        .normalizeEmail()
        .trim()
        .optional()
]

export {userPostValidation, userPutValidation};