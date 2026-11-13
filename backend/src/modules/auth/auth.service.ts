import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import type { IJwtPayload } from "../../lib/jwt";
import {
  signAccessToken,
  signEmailVerificationToken,
  signRefreshToken,
  verifyEmailVerificationToken,
  verifyRefreshToken,
} from "../../lib/jwt";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { sendVerificationEmail } from "../../utils/emailSender";
import type {
  IAuthUserAccount,
  ICandidateProfileDTO,
  ICandidateRegisterPayload,
  ILoginPayload,
  ILoginResult,
  IRecruiterProfileDTO,
  IRecruiterRegisterPayload,
  IRefreshTokenResult,
  IRegistrationResult,
  IResendVerificationResponseDTO,
  IVerifyEmailCredentialsPayload,
  IVerifyEmailResponseDTO,
} from "./auth.interface";
import AUTH_MESSAGES from "./auth.messages";

const registerCandidate = async (
  payload: ICandidateRegisterPayload,
): Promise<IRegistrationResult<ICandidateProfileDTO>> => {
  const normalizedEmail = payload.email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  const existingCompany = await prisma.company.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser || existingCompany) {
    throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.EMAIL_CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "candidate",
      title: payload.title?.trim() || "",
      bio: payload.bio?.trim() || "",
      skills: payload.skills || [],
      isEmailVerified: false,
      status: "active",
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      title: true,
      bio: true,
      skills: true,
      isEmailVerified: true,
      status: true,
      createdAt: true,
    },
  });

  // Generate secure HTTP-only email verification token
  const verificationToken = signEmailVerificationToken({
    id: newUser.id,
    email: newUser.email,
    role: "candidate",
    purpose: "email-verification",
  });

  await prisma.user.update({
    where: { id: newUser.id },
    data: { verificationToken },
  });

  // Dispatch email with zero token in URL or content
  await sendVerificationEmail({
    to: newUser.email,
    name: newUser.name,
    role: "candidate",
  });

  return {
    user: newUser,
    verificationToken,
  };
};

const registerRecruiter = async (
  payload: IRecruiterRegisterPayload,
): Promise<IRegistrationResult<IRecruiterProfileDTO>> => {
  const normalizedEmail = payload.email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  const existingCompany = await prisma.company.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser || existingCompany) {
    throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.EMAIL_CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const newCompany = await prisma.company.create({
    data: {
      name: payload.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "recruiter",
      location: payload.location?.trim() || "",
      companySize: payload.companySize?.trim() || "",
      website: payload.website?.trim() || "",
      description: payload.description?.trim() || "",
      isEmailVerified: false,
      status: "active",
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      location: true,
      companySize: true,
      website: true,
      description: true,
      isEmailVerified: true,
      status: true,
      createdAt: true,
    },
  });

  // Generate secure HTTP-only email verification token
  const verificationToken = signEmailVerificationToken({
    id: newCompany.id,
    email: newCompany.email,
    role: "recruiter",
    purpose: "email-verification",
  });

  await prisma.company.update({
    where: { id: newCompany.id },
    data: { verificationToken },
  });

  // Dispatch email with zero token in URL or content
  await sendVerificationEmail({
    to: newCompany.email,
    name: newCompany.name,
    role: "recruiter",
  });

  return {
    user: newCompany,
    verificationToken,
  };
};

const verifyEmail = async (
  token?: string,
): Promise<IVerifyEmailResponseDTO> => {
  if (!token) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.VERIFICATION_COOKIE_MISSING,
    );
  }

  let decoded: {
    id: string;
    email: string;
    role: "candidate" | "recruiter";
    purpose: string;
  };

  try {
    decoded = verifyEmailVerificationToken(token);
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "name" in err &&
      err.name === "TokenExpiredError"
    ) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "Verification link has expired (5-minute limit exceeded). Please request a fresh verification link.",
      );
    }
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_VERIFICATION_TOKEN,
    );
  }

  if (decoded.role === "candidate") {
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        AUTH_MESSAGES.USER_PROFILE_NOT_FOUND,
      );
    }

    if (user.isDeleted) {
      throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.ACCOUNT_DELETED);
    }

    if (user.verificationToken !== token) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_VERIFICATION_TOKEN,
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
      },
    });

    return {
      user: updatedUser,
      role: updatedUser.role,
      message: AUTH_MESSAGES.EMAIL_VERIFIED_CANDIDATE,
    };
  }

  // Recruiter verification
  const company = await prisma.company.findUnique({
    where: { id: decoded.id },
  });

  if (!company) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      AUTH_MESSAGES.RECRUITER_PROFILE_NOT_FOUND,
    );
  }

  if (company.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.ACCOUNT_DELETED);
  }

  if (company.verificationToken !== token) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_VERIFICATION_TOKEN,
    );
  }

  const updatedCompany = await prisma.company.update({
    where: { id: company.id },
    data: {
      isEmailVerified: true,
      verificationToken: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isEmailVerified: true,
    },
  });

  return {
    user: updatedCompany,
    role: updatedCompany.role,
    message: AUTH_MESSAGES.EMAIL_VERIFIED_RECRUITER,
  };
};

const verifyEmailWithCredentials = async (
  payload: IVerifyEmailCredentialsPayload,
): Promise<{
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
  role: string;
  accessToken: string;
  refreshToken: string;
  message: string;
}> => {
  const normalizedEmail = payload.email.toLowerCase().trim();

  let userRecord: IAuthUserAccount | null = null;
  let isRecruiter = false;

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (user) {
    userRecord = user;
  } else {
    const company = await prisma.company.findUnique({
      where: { email: normalizedEmail },
    });
    if (company) {
      userRecord = company;
      isRecruiter = true;
    }
  }

  if (!userRecord) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_CREDENTIALS,
    );
  }

  if (userRecord.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.ACCOUNT_DELETED);
  }

  if (userRecord.status === "blocked") {
    throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.ACCOUNT_BLOCKED);
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    userRecord.password,
  );
  if (!isPasswordMatch) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_CREDENTIALS,
    );
  }

  // Mark account as verified upon authenticating on the new device
  if (isRecruiter) {
    await prisma.company.update({
      where: { id: userRecord.id },
      data: { isEmailVerified: true, verificationToken: null },
    });
  } else {
    await prisma.user.update({
      where: { id: userRecord.id },
      data: { isEmailVerified: true, verificationToken: null },
    });
  }

  const role = (userRecord.role ||
    (isRecruiter ? "recruiter" : "candidate")) as IJwtPayload["role"];

  const accessToken = signAccessToken({
    id: userRecord.id,
    email: userRecord.email,
    role,
  });

  const refreshToken = signRefreshToken({
    id: userRecord.id,
    email: userRecord.email,
    role,
  });

  return {
    user: {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      role,
      isEmailVerified: true,
    },
    role,
    accessToken,
    refreshToken,
    message: AUTH_MESSAGES.EMAIL_VERIFICATION_SUCCESS,
  };
};

const resendVerificationEmail = async (
  emailOrPayload: string | { email: string },
): Promise<IResendVerificationResponseDTO> => {
  const email =
    typeof emailOrPayload === "string" ? emailOrPayload : emailOrPayload.email;
  const normalizedEmail = email.toLowerCase().trim();

  let target: {
    id: string;
    name: string;
    email: string;
    role: "candidate" | "recruiter";
    isEmailVerified: boolean;
  } | null = null;
  let isCompany = false;

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (user) {
    target = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "candidate",
      isEmailVerified: user.isEmailVerified,
    };
  } else {
    const company = await prisma.company.findUnique({
      where: { email: normalizedEmail },
    });
    if (company) {
      target = {
        id: company.id,
        name: company.name,
        email: company.email,
        role: "recruiter",
        isEmailVerified: company.isEmailVerified,
      };
      isCompany = true;
    }
  }

  if (!target) {
    throw new AppError(StatusCodes.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  if (target.isEmailVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, AUTH_MESSAGES.ALREADY_VERIFIED);
  }

  const newVerificationToken = signEmailVerificationToken({
    id: target.id,
    email: target.email,
    role: target.role,
    purpose: "email-verification",
  });

  if (isCompany) {
    await prisma.company.update({
      where: { id: target.id },
      data: { verificationToken: newVerificationToken },
    });
  } else {
    await prisma.user.update({
      where: { id: target.id },
      data: { verificationToken: newVerificationToken },
    });
  }

  await sendVerificationEmail({
    to: target.email,
    name: target.name,
    role: target.role,
  });

  return {
    email: target.email,
    message: AUTH_MESSAGES.RESEND_VERIFICATION_SUCCESS,
    verificationToken: newVerificationToken,
  };
};

const login = async (payload: ILoginPayload): Promise<ILoginResult> => {
  const normalizedEmail = payload.email.toLowerCase().trim();

  let userRecord: IAuthUserAccount | null = null;
  let isRecruiter = false;

  if (payload.role !== "recruiter") {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (user) {
      userRecord = user;
    }
  }

  if (!userRecord && payload.role !== "candidate" && payload.role !== "admin") {
    const company = await prisma.company.findUnique({
      where: { email: normalizedEmail },
    });
    if (company) {
      userRecord = company;
      isRecruiter = true;
    }
  }

  if (!userRecord) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_CREDENTIALS,
    );
  }

  if (userRecord.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.ACCOUNT_DELETED);
  }

  if (userRecord.status === "blocked") {
    throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.ACCOUNT_BLOCKED);
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    userRecord.password,
  );
  if (!isPasswordMatch) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_CREDENTIALS,
    );
  }

  if (!userRecord.isEmailVerified) {
    throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.EMAIL_NOT_VERIFIED);
  }

  const role = (userRecord.role ||
    (isRecruiter ? "recruiter" : "candidate")) as IJwtPayload["role"];

  const accessToken = signAccessToken({
    id: userRecord.id,
    email: userRecord.email,
    role,
  });

  const refreshToken = signRefreshToken({
    id: userRecord.id,
    email: userRecord.email,
    role,
  });

  const {
    password: _password,
    verificationToken: _vt,
    resetPasswordToken: _rpt,
    ...safeUser
  } = userRecord;

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};

const refreshToken = async (token?: string): Promise<IRefreshTokenResult> => {
  if (!token) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED,
    );
  }

  let decoded: IJwtPayload;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_REFRESH_TOKEN,
    );
  }

  const { id, role } = decoded;

  let account: {
    id: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    status: string;
    isDeleted: boolean;
  } | null = null;

  if (role === "recruiter") {
    account = await prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        status: true,
        isDeleted: true,
      },
    });
  } else {
    account = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        status: true,
        isDeleted: true,
      },
    });
  }

  if (!account) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      AUTH_MESSAGES.USER_PROFILE_NOT_FOUND,
    );
  }

  if (account.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.ACCOUNT_DELETED);
  }

  if (account.status === "blocked") {
    throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.ACCOUNT_BLOCKED);
  }

  if (!account.isEmailVerified) {
    throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.EMAIL_NOT_VERIFIED);
  }

  const newAccessToken = signAccessToken({
    id: account.id,
    email: account.email,
    role: account.role as IJwtPayload["role"],
  });

  return {
    accessToken: newAccessToken,
  };
};

const getMe = async (userPayload: IJwtPayload) => {
  if (userPayload.role === "recruiter") {
    const company = await prisma.company.findUnique({
      where: { id: userPayload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        description: true,
        website: true,
        location: true,
        companySize: true,
        socialLinks: true,
        isEmailVerified: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!company) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        AUTH_MESSAGES.RECRUITER_PROFILE_NOT_FOUND,
      );
    }
    return company;
  }

  const user = await prisma.user.findUnique({
    where: { id: userPayload.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePicture: true,
      title: true,
      bio: true,
      skills: true,
      socialLinks: true,
      resume: true,
      isEmailVerified: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      AUTH_MESSAGES.USER_PROFILE_NOT_FOUND,
    );
  }
  return {
    ...user,
    profilePicture: user.profilePicture || null,
    resume: user.resume
      ? typeof user.resume === "string"
        ? user.resume
        : user.resume.url
      : "",
  };
};

const authService = {
  registerCandidate,
  registerRecruiter,
  verifyEmail,
  verifyEmailWithCredentials,
  login,
  refreshToken,
  resendVerificationEmail,
  getMe,
};

export default authService;
