import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser,} from "../controllers/user.controller";

const router = Router();

// logging middleware
router.use((req, _res, next) => {
	console.log(`[users] ${req.method} ${req.path}`);
	next();
});

// Define routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Catch-all for undefined routes in this router
router.use((req, res) => {
	console.log(`[users] no route matched for ${req.method} ${req.path}`);
	res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

export default router;
