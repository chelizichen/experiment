const { Router } = require("express");
const router = Router()

router.get("/test", function (req, res) {
  res.send({
    msg: "Hello Webpack",
  });
});

module.exports =  {
  router
}