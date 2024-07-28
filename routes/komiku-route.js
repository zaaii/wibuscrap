const router = require("express").Router();

const komikuService = require("../services/komiku-service.js");

router.get("/", (req, res) => komikuService.getLatestManga(req, res));
router.post("/", (req, res) => komikuService.getMangaByParamBatch(req, res));
router.get("/hot", (req, res) => komikuService.getHotManga(req, res));
router.get("/genre", (req, res) => komikuService.getGenreList(req, res));
router.get("/genre/:genre", (req, res) => komikuService.getComicByGenre(req, res));
router.get("/:param", (req, res) => komikuService.getMangaByParam(req, res));
router.get("/chapter/:param", (req, res) =>
  komikuService.getMangaChapterByParam(req, res)
);

module.exports = router;
