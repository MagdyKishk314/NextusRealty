import { Router } from "express";
import { basicAuth } from "../middleware/auth.js";
import * as admin from "../controllers/adminController.js";

export const adminRouter = Router();

// Everything under /admin requires authentication.
adminRouter.use(basicAuth);

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
