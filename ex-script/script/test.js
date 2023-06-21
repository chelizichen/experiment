var ceshi = null;
ceshi = await new Promise((resolve) => {
  setTimeout(async () => {
    removeImgBg(document.getElementById("newimg"));
    var naturalWidth = document.getElementById("newimg").naturalWidth;
    var naturalHeight = document.getElementById("newimg").naturalHeight;
    imgBox.style.width = naturalWidth - 30 + "px";
    imgBox.style.height = naturalHeight - 30 + "px";
    myImage.src = document.getElementById("newimg").src;
    // Object.prototype.toString.call(document.getElementById('newimg').src)
    // console.log(Object.prototype.toString.call(document.getElementById('newimg')
    //     .src), '打印');
    const file = base64ToFile(
      document.getElementById("newimg").src,
      "picture",
      "image/png"
    );
    console.log(file, "返回file"); // 输出File对象
    var formData = new FormData();
    var action = "text";
    formData.append("action", action);
    formData.append("file", file);
    axios
      .all([
        axios({
          url: process.env.VUE_APP_BASE_API + "/common/upload",
          method: "Post",
          data: formData,
          headers: { Authorization: "Bearer " + getToken() },
        }),
      ])
      .then(
        axios.spread((res) => {
          // ceshi = res.data.fileName
          resolve(res.data.fileName);
          console.log(res.data.fileName, "是否取到");
          console.log(ceshi, "res.data.fileName");
        })
      );
    myImage.style.border = "1px solid red";
    imgBox.style.top = aa + "px";
    imgBox.style.left = bb + "px";
    var solid = document.getElementById("myImage").style.border;
    picloading(solid);
    // ImgDrag.imgUrl = document.getElementById('myImage').src
  }, 100);
});
