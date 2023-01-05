const router = require("express").Router()
const route = router
const Services = require("../services/otakudesu-services")


route.get("/", (req, res) => {
    res.send({
        endpoint: {
            getOngoingAnime: "/ongoing/:page",
            getCompletedAnime: "/api/otakudesu/completed/:page",
            getAnimeSearch: "/api/otakudesu/search/:q",
            getAnimeList: "/api/otakudesu/anime-list",
            getAnimeDetail: "/api/otakudesu/detail/:endpoint",
            getAnimeEpisode: "/api/otakudesu/episode/:endpoint",
            getBatchLink: "/api/otakudesu/batch/:endpoint",
            getGenreList: "/api/otakudesu/genres",
            getGenrePage: "/api/otakudesu/genres/:genre/:page"
        }
    })
})


// Get Ongoing Anime -Done-
router.get("/ongoing/:page", Services.getOngoing)
// Get Completed Anime -Done-
router.get("/api/otakudesu/completed/:page", Services.getCompleted)
// Get Search Anime -Done-
router.get("/api/otakudesu/search/:q", Services.getSearch)
// Get Anime List -Done-
router.get("/api/otakudesu/anime-list", Services.getAnimeList)
// Get Anime Detail -Done-  
route.get("/api/otakudesu/detail/:endpoint", Services.getAnimeDetail)
// Get Anime Episode -Done-
router.get("/api/otakudesu/episode/:endpoint", Services.getAnimeEpisode)
// Get Batch Link -Done-
router.get("/api/otakudesu/batch/:endpoint", Services.getBatchLink)
// Get Genre List -Done-
router.get("/api/otakudesu/genres", Services.getGenreList) 
// Get Genre Page -Done-
router.get("/api/otakudesu/genres/:genre/:page", Services.getGenrePage)

module.exports = route