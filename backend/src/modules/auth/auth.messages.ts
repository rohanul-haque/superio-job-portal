const AUTH_MESSAGES = {
  // Success Messages
  REGISTER_SUCCESS:
    "Registration successful! Please check your email to verify your account.",
  CANDIDATE_REGISTER_SUCCESS:
    "Candidate registered successfully! Please check your email to verify your account.",
  RECRUITER_REGISTER_SUCCESS:
    "Recruiter account registered successfully! Please check your email to verify your company.",
  LOGIN_SUCCESS: "Login successful!",
  LOGOUT_SUCCESS: "Logout successful! All session cookies have been cleared.",
  TOKEN_REFRESH_SUCCESS: "Access token refreshed successfully.",
  EMAIL_VERIFICATION_SUCCESS:
    "Email verified successfully! You can now log in.",
  EMAIL_VERIFIED_CANDIDATE:
    "Candidate email verified successfully! You can now log in.",
  EMAIL_VERIFIED_RECRUITER:
    "Recruiter email verified successfully! You can now log in.",
  RESEND_VERIFICATION_SUCCESS:
    "A new verification email has been sent successfully. Please check your inbox. The verification link is valid for 5 minutes.",
  PROFILE_FETCH_SUCCESS: "User profile retrieved successfully.",

  // Authentication & Session Errors
  NO_ACCESS_TOKEN:
    "Authentication failed: No access token provided in cookies.",
  INVALID_OR_EXPIRED_TOKEN:
    "Authentication failed: Access token is invalid or expired.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  REFRESH_TOKEN_REQUIRED: "Refresh token is missing from cookies.",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token.",
  FORBIDDEN_PREFIX: "Forbidden: Access denied for role",

  // Account State Errors
  ACCOUNT_DELETED: "This account has been deleted.",
  ACCOUNT_BLOCKED:
    "This account has been blocked or suspended by administrator.",
  EMAIL_NOT_VERIFIED:
    "Your email is not verified yet. Please check your inbox to verify your email.",
  EMAIL_CONFLICT: "An account with this email address already exists.",
  USER_NOT_FOUND: "No account found with this email address.",
  ALREADY_VERIFIED:
    "This account has already verified its email. You can proceed directly to log in.",
  USER_PROFILE_NOT_FOUND: "User profile not found.",
  RECRUITER_PROFILE_NOT_FOUND: "Recruiter company profile not found.",

  // Email Verification Specific Errors
  VERIFICATION_COOKIE_MISSING:
    "Verification session cookie not found. If you opened this link on a new device, please verify with your credentials.",
  INVALID_VERIFICATION_TOKEN: "Invalid or expired verification session token.",
  TOKEN_REQUIRED: "Verification token is required.",
} as const;

export default AUTH_MESSAGES;
