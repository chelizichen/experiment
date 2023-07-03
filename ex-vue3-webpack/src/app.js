const express = require("express")

const ServerApplication = express();

ServerApplication.use(express.static('public/assets'))


ServerApplication.get("*", function (req, res) {
    res.redirect("localhost:3419")
    res.end()
    // res.sendFile('index.html')
})

ServerApplication.listen(3411, function () {
    console.log("app is listen on localhost:3411");
});