import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { postImageUpload } from "../middleware/upload.js";
import * as auth from "../controllers/authController.js";
import * as admin from "../controllers/adminController.js";

export const adminRouter = Router();

// Public auth routes (must stay outside the guard).
adminRouter.get("/login", auth.showLogin);
adminRouter.post("/login", auth.login);
adminRouter.post("/logout", auth.logout);

// Everything else under /admin requires a valid session.
adminRouter.use(requireAdmin);

// The admin home is the blog-post manager.
adminRouter.get("/", admin.postsManage);

// Posts
adminRouter.get("/posts", (_req, res) => res.redirect(301, "/admin"));
adminRouter.get("/posts/new", admin.newPost);
adminRouter.post("/posts", postImageUpload, admin.createPostHandler);
adminRouter.get("/posts/:id/view", admin.viewPost);
adminRouter.get("/posts/:id/edit", admin.editPost);
adminRouter.post("/posts/:id/toggle", admin.togglePostStatus);
adminRouter.post("/posts/:id", postImageUpload, admin.updatePostHandler);
adminRouter.post("/posts/:id/delete", admin.deletePostHandler);
