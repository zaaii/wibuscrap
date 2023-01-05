const router = require("express").Router()
const route = router
const Services = require("../services/otakudesu-services")


route.get("/", (req, res) => {
    res.send({
        endpoint: {
            getOngoingAnime: "/ongoing/:page",
            getCompletedAnime: "/completed/:page",
            getAnimeSearch: "/search/:q",
            getAnimeList: "/anime-list",
            getAnimeDetail: "/detail/:endpoint",
            getAnimeEpisode: "/episode/:endpoint",
            getBatchLink: "/batch/:endpoint",
            getGenreList: "/genres",
            getGenrePage: "/genres/:genre/:page"
        }
    })
})


// Get Ongoing Anime -Done-
router.get("/ongoing/:page", Services.getOngoing)
// Get Completed Anime -Done-
router.get("/completed/:page", Services.getCompleted)
// Get Search Anime -Done-
router.get("/search/:q", Services.getSearch)
// Get Anime List -Done-
router.get("/anime-list", Services.getAnimeList)
// Get Anime Detail -Done-  
route.get("/detail/:endpoint", Services.getAnimeDetail)
// Get Anime Episode -Done-
router.get("/episode/:endpoint", Services.getAnimeEpisode)
// Get Batch Link -Done-
router.get("/batch/:endpoint", Services.getBatchLink)
// Get Genre List -Done-
router.get("/genres", Services.getGenreList) 
// Get Genre Page -Done-
router.get("/genres/:genre/:page", Services.getGenrePage)

module.exports = route