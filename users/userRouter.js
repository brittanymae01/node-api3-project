const express = require("express");

const router = express.Router();

const Users = require("./userDb.js");
const Posts = require("../posts/postDb");

//fix problem with adding user even if it doesnt have a name

router.post("/", validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then(user => {
      // if (!req.body.name) {
      //   return res.status(400).json({
      //     errorMessage: "a name needs to be provided"
      //   });
      // } else {
      return res.status(201).json(user);
      // }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem adding user"
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const userInfo = { ...req.body, user_id: req.params.id };
  // do your magic!
  Posts.insert(userInfo)
    .then(post => {
      return res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem adding post"
      });
    });
});

router.get("/", (req, res) => {
  // do your magic!
  Users.get()
    .then(users => {
      return res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem retreiving users"
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  Users.getById(req.params.id)
    .then(user => {
      // if (!user) {
      //   return res.status(404).json({
      //     errorMessage: "user Id provided does not exist"
      //   });
      // } else {
      return res.status(200).json(user);
      // }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem retreiving user"
      });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.params.id)
    .then(user => {
      // if (user.length === 0) {
      //   return res.status(404).json({
      //     errorMessage: "posts by this user does not exist"
      //   });
      // } else {
      return res.status(200).json(user);
      // }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "error retreiving posts"
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.params.id)
    .then(deleted => {
      return res.status(200).json(deleted);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem deleting user"
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  // do your magic!
  Users.update(req.params.id, req.body)
    .then(updated => {
      // if (!updated) {
      //   return res.status(404).json({
      //     errorMessage: "this user does not exist to update"
      //   });
      // } else {
      return res.status(200).json(updated);
      // }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem updated user"
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  Users.getById(req.params.id).then(user => {
    if (!user) {
      res.status(404).json({ message: "invalid user id" });
    } else {
      req.user = user;
    }
  });
  next();
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({
      errorMessage: "missing user data"
    });
  } else if (!req.body.name) {
    res.status(400).json({
      errorMessage: "missing required name field"
    });
  } else {
    return res.status(201).json(req.body);
  }
  next();
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({
      errorMessage: "missing post data"
    });
  } else if (!req.body.text) {
    res.status(400).json({
      errorMessage: "missing required text field"
    });
  } else {
    return res.status(201).json(req.body);
  }
  next();
}

module.exports = router;
