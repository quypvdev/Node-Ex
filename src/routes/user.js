const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin, isAdminn} = require('../controllers/auth');

const { userById, read, update, purchaseHistory, getStatusValues, listUsers, updaterole } = require('../controllers/user');

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});

router.get('/user/:userId', requireSignin, isAuth, read);
router.get("/user/list/:userId", requireSignin, isAuth, isAdmin, listUsers);
router.put('/user/:userId', requireSignin,isAuth, update);
router.put('/admin/user/:userId', requireSignin, isAdmin, updaterole);
// router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);
// router.get(
//     "/order/status-values/:userId",
//     requireSignin,
//     isAuth,
//     isAdmin,
//     getStatusValues
// );
router.param('userId', userById);

module.exports = router;