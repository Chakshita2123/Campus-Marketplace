const express = require("express");
const passport = require("passport");

const router = express.Router();

// ✅ Step 1: Redirect user to Google for authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Step 2: Google callback after successful login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://127.0.0.1:5500/login.html" }),
  (req, res) => {
    // Redirect to index page after successful login
    res.redirect("http://127.0.0.1:5500/index.html");
  }
);

// ✅ Step 3: Get current user info (optional)
router.get("/user", (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
});

// ✅ Step 4: Logout user
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Error logging out");
    res.redirect("http://127.0.0.1:5500/login.html");
  });
});

module.exports = router;


