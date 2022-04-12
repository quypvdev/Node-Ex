const express = require("express");
const router = express.Router();

const {
   requireSignin,
   isAuth,
   isAdmin,
   isUser,
} = require("../controllers/auth");

const {
   userById,
   read,
   update,
   listUsers,
   remove,
   setlibRole,
   setmemberRole,
} = require("../controllers/user");

router.get("/user/:userId", requireSignin, isAuth, read);
router.get("/librarian/user/listuser", requireSignin, isAdmin, listUsers);
router.delete("/librarian/delete/:userId", requireSignin, remove);
router.delete("/delete/myown/:userId", requireSignin, isUser, remove);
router.put("/user/:userId", requireSignin, update);
router.put("/librarian/role/lib/:userId", requireSignin, isAdmin, setlibRole);
router.put(
   "/librarian/role/member/:userId",
   requireSignin,
   isAdmin,
   setmemberRole
);
router.param("userId", userById);

module.exports = router;
