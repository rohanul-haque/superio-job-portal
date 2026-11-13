import { Router } from "express";
import adminRoutes from "../modules/admin/admin.route";
import applicationRoutes from "../modules/application/application.route";
import authRoutes from "../modules/auth/auth.route";
import bookmarkRoutes from "../modules/bookmark/bookmark.route";
import candidateRoutes from "../modules/candidate/candidate.route";
import categoryRoutes from "../modules/category/category.route";
import jobRoutes from "../modules/job/job.route";
import recruiterRoutes from "../modules/recruiter/recruiter.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/categories",
    route: categoryRoutes,
  },
  {
    path: "/jobs",
    route: jobRoutes,
  },
  {
    path: "/candidate",
    route: candidateRoutes,
  },
  {
    path: "/recruiter",
    route: recruiterRoutes,
  },
  {
    path: "/applications",
    route: applicationRoutes,
  },
  {
    path: "/bookmarks",
    route: bookmarkRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
