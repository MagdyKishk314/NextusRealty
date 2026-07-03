import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import * as auth from "../controllers/authController.js";
import * as admin from "../controllers/adminController.js";

export const adminRouter = Router();

// Public auth routes (must stay outside the guard).
adminRouter.get("/login", auth.showLogin);
adminRouter.post("/login", auth.login);
adminRouter.post("/logout", auth.logout);

// Everything else under /admin requires a valid session.
adminRouter.use(requireAdmin);

adminRouter.get("/", admin.dashboard);

// Posts
adminRouter.get("/posts", admin.postsManage);
adminRouter.get("/posts/new", admin.newPost);
adminRouter.post("/posts", admin.createPostHandler);
adminRouter.get("/posts/:id/view", admin.viewPost);
adminRouter.get("/posts/:id/edit", admin.editPost);
adminRouter.post("/posts/:id/toggle", admin.togglePostStatus);
adminRouter.post("/posts/:id", admin.updatePostHandler);
adminRouter.post("/posts/:id/delete", admin.deletePostHandler);

// Testimonials
adminRouter.get("/testimonials/new", admin.newTestimonial);
adminRouter.post("/testimonials", admin.createTestimonialHandler);
adminRouter.get("/testimonials/:id/edit", admin.editTestimonial);
adminRouter.post("/testimonials/:id", admin.updateTestimonialHandler);
adminRouter.post("/testimonials/:id/delete", admin.deleteTestimonialHandler);
