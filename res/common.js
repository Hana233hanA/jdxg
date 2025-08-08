let ImagePreloader = {
    new: function (src) {
        let img = new Image()
        img.src = src
        return img
    }
}
let Loading = {
    loadingInterval : null,
    initImgs : [],
    imageLoadCompleted : false,
    callback : null,
    imageOnload : function () {
        let complete = true;
        for (let key in Loading.initImgs) {
            complete = complete && Loading.initImgs[key].complete
        }
        if (complete) {
            console.log("images ready..")
            Loading.imageLoadCompleted = true
        }
    },
    loop : function () {
        if (!Loading.imageLoadCompleted) {
            return
        }
        clearInterval(Loading.loadingInterval)
        $("div.loading").hide()
        if (typeof Loading.callback == "function") {
            Loading.callback.call()
        }
    },
    _init : function (initList) {
        if (!(initList instanceof Array) || initList.length <= 0) {
            Loading.imageLoadCompleted = true
            $("div.loading").hide()
            if (typeof Loading.callback == "function") {
                Loading.callback.call()
            }
            return
        }
        for (let key in initList) {
            let img = ImagePreloader.new(initList[key])
            img.onload = Loading.imageOnload
            Loading.initImgs.push(img)
        }
        Loading.loadingInterval = setInterval("Loading.loop()", 100)
    },
    init: function (initList) {
        if (!(initList instanceof Array)) {
            initList = []
        }
        $("img[preload]").each(function (i, v) { initList.push($(v).attr("src")) })
        Loading._init(initList)
    }
}