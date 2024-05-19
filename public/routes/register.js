const { body, validationResult } = require('express-validator');

//...

router.post('/', [
  // Validate the input
  body('username').notEmpty().withMessage('Please enter a username.'),
  body('email').notEmpty().withMessage('Please enter an email.'),
  body('password').notEmpty().withMessage('Please enter a password.'),

  //...

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //...
  },
]);