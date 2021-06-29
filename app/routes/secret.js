const express = require("express");
const router = express.Router();



router.route('/').get((req, res) => {
    res.send("hey you are accessing the secure part");
})

module.exports = router;