const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

const sanitizeText = (value = '') => String(value).trim();

const validateRegisterInput = (body) => {
  const fullName = sanitizeText(body.fullName);
  const email = sanitizeText(body.email).toLowerCase();
  const password = sanitizeText(body.password);
  const confirmPassword = sanitizeText(body.confirmPassword);
  const course = sanitizeText(body.course);
  const interests = sanitizeText(body.interests);
  const bio = sanitizeText(body.bio || '');

  if (!fullName || !email || !password || !confirmPassword || !course || !interests) {
    return { valid: false, message: 'All required fields must be provided' };
  }

  if (!isEmail(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }

  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }

  return {
    valid: true,
    data: { fullName, email, password, course, interests, bio },
  };
};

const validateLoginInput = (body) => {
  const email = sanitizeText(body.email).toLowerCase();
  const password = sanitizeText(body.password);

  if (!email || !password) {
    return { valid: false, message: 'Email and password are required' };
  }

  if (!isEmail(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  return { valid: true, data: { email, password } };
};

const validateEventInput = (body) => {
  const title = sanitizeText(body.title);
  const eventDate = sanitizeText(body.eventDate);
  const eventTime = sanitizeText(body.eventTime);
  const location = sanitizeText(body.location);
  const category = sanitizeText(body.category);
  const description = sanitizeText(body.description);

  if (!title || !eventDate || !eventTime || !location || !category || !description) {
    return { valid: false, message: 'All event fields are required' };
  }

  return {
    valid: true,
    data: { title, eventDate, eventTime, location, category, description },
  };
};

module.exports = {
  sanitizeText,
  validateRegisterInput,
  validateLoginInput,
  validateEventInput,
};
