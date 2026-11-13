import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import bookmarkController from "./bookmark.controller";

const router = Router();

// Candidate: Toggle bookmark (add/remove)
router.post("/toggle", authGuard("candidate"), bookmarkController.toggleBookmark);

// Candidate: Get all saved jobs
router.get("/", authGuard("candidate"), bookmarkController.getMyBookmarks);

// Candidate: Remove a bookmark by jobId
router.delete("/:jobId", authGuard("candidate"), bookmarkController.removeBookmark);

export default router;

