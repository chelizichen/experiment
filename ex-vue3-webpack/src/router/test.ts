import { Router } from "express";
const router = Router()

router.get("/test", function (req, res: any) {
  res.send({
    msg: "Hello Webpack",
  });
});

export {
    router
}