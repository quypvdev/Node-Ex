const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const {
   userById,
   read,
   update,
   listUsers,
   updaterole,
   remove,
} = require("../controllers/user");

router.get("/user/:userId", requireSignin, isAuth, read);
router.get("/admin/user/listuser", isAdmin, listUsers);
router.delete("/delete/:userId", requireSignin, remove);
router.put("/user/:userId", requireSignin, isAuth, update);
router.put("/admin/user/:userId", requireSignin, isAdmin, updaterole);
router.param("userId", userById);

module.exports = router;
