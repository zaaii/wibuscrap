const axios = require('axios');
const cheerio = require('cheerio');

module.exports.getLatestManga = async (req, res) => {
  const page = req.query.page || 1;
  const keyword = req.query.s;
  const tag = req.query.tag || "hot";
  const genre = req.query.genre;
  const url = req.protocol + "://" + req.get("host") + req.baseUrl;

  let scrapingUrl;
  if (keyword) {
    scrapingUrl = page === 1
      ? `https://api.komiku.id/?post_type=manga&s=${keyword}`
      : `https://api.komiku.id/page/${page}/?post_type=manga&s=${keyword}`;
  } else if (genre) {
    scrapingUrl = page === 1
      ? `https://api.komiku.id/genre/${genre}`
      : `https://api.komiku.id/genre/${genre}/page/${page}`;
  } else {
    scrapingUrl = page === 1
      ? `https://api.komiku.id/other/${tag}/`
      : `https://api.komiku.id/other/${tag}/page/${page}/`;
  }

  try {
    const response = await axios.get(scrapingUrl, {
      headers: { 'Referer': 'https://komiku.id/' }
    });
    const $ = cheerio.load(response.data);

    const mangaList = [];

    $('.bge').each((i, el) => {
      const mangaTitle = $(el).find('.kan h3').text().trim();
      const mangaDescription = $(el).find('.kan p').text().trim().replace(/\s+/g, ' ');
      const mangaThumbnail = $(el).find('.bgei img').attr('src');

      let mangaParam = $(el).find('.kan a').eq(0).attr('href').split('/');
      mangaParam = (genre || keyword) ? mangaParam[2] : mangaParam[4];

      const latestChapter = $(el).find('.kan .new1').last().find('span').last().text().trim();

      mangaList.push({
        title: mangaTitle,
        description: mangaDescription,
        latest_chapter: latestChapter,
        thumbnail: mangaThumbnail ? mangaThumbnail.split('?')[0] : '',
        param: mangaParam,
        detail_url: `${url}/${mangaParam}`,
      });
    });

    let prev = '';
    let next = '';

    if (keyword) {
      prev = `&s=${keyword}`;
      next = `&s=${keyword}`;
    } else if (genre) {
      next += `&genre=${genre}`;
      prev += `&genre=${genre}`;
    } else {
      next += `&tag=${tag}`;
      prev += `&tag=${tag}`;
    }

    res.json({
      next_page: `${url}?page=${parseInt(page) + 1}${next}`,
      prev_page: parseInt(page) > 1 ? `${url}?page=${parseInt(page) - 1}${prev}` : null,
      data: mangaList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};

module.exports.getMangaByParam = async (req, res) => {
  const { param } = req.params;
  const url = req.protocol + "://" + req.get("host") + req.baseUrl;

  try {
    const response = await axios.get(`https://komiku.id/manga/${param}`, {
      headers: { 'Referer': 'https://komiku.id/' }
    });
    const $ = cheerio.load(response.data);

    const mangaTitle = $('#Judul h1').text().trim();
    const mangaThumbnail = $('.ims img').attr('src');
    const mangaGenre = [];
    const mangaSynopsis = $('#Judul .desc').text().trim();
    const mangaChapters = [];
    const mangaSimilar = [];

    $('.genre li a').each((i, el) => {
      mangaGenre.push($(el).text());
    });

    $('#Daftar_Chapter tbody tr').each((i, el) => {
      if (i > 0) {
        const chapterNumber = $(el).find('.judulseries').text().trim();
        let chapterSlug = $(el).find('.judulseries a').attr('href').split('/')[1];
        if (chapterSlug == "ch") {
          chapterSlug = $(el).find('.judulseries a').attr('href').split('ch/')[1];
        }
        const chapterRelease = $(el).find('.tanggalseries').text().trim();

        mangaChapters.push({
          chapter: chapterNumber,
          param: chapterSlug,
          release: chapterRelease,
          detail_url: `${url}/chapter/${chapterSlug}`,
        });
      }
    });

    $('#Spoiler .grd').each((i, el) => {
      const link = $(el).find('a').attr('href');
      const linkArray = link.split('/');
      const spoilerParam = linkArray[linkArray.length - 2];
      const spoilerTitle = $(el).find('.h4').text().trim();
      const spoilerThumbnail = $(el).find('img').attr('data-src').split('?')[0];
      const spoilerSynopsis = $(el).find('p').text().trim();

      mangaSimilar.push({
        title: spoilerTitle,
        thumbnail: spoilerThumbnail,
        synopsis: spoilerSynopsis,
        param: spoilerParam,
        detail_url: `${url}/${spoilerParam}`,
      });
    });

    res.json({
      data: {
        title: mangaTitle,
        param: param,
        thumbnail: mangaThumbnail.split('?')[0],
        genre: mangaGenre,
        synopsis: mangaSynopsis,
        chapters: mangaChapters,
        similars: mangaSimilar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};

module.exports.getHotManga = async (req, res) => {
  const page = req.query.page || 1;
  const urls = req.protocol + "://" + req.get("host") + req.baseUrl;
  const url = req.protocol + "://" + req.get("host") + req.baseUrl + "/hot";
  
  try {
    const scrapingUrl = page === 1
      ? `https://api.komiku.id/other/hot/`
      : `https://api.komiku.id/other/hot/page/${page}/`;

    const response = await fetch(scrapingUrl);
    const html = await response.text();
    const $ = cheerio.load(html);

    const mangaList = [];
    $(".bge").each((i, el) => {
      const mangaTitle = $(el).find(".kan h3").text().trim();
      const mangaDescription = $(el).find(".kan p").text().trim();
      const mangaThumbnail = $(el).find(".bgei img").attr("src");
      const mangaParam = $(el).find(".kan a").first().attr("href")?.split("/")[4] || "";
      const latestChapter = $(el).find(".kan .new1").last().find("span").last().text().trim();
      const type = $(el).find(".tpe1_inf b").text().trim();
      const views = $(el).find(".kan .judul2").text().split("•")[0].trim();
      const updateTime = $(el).find(".kan .judul2").text().split("•")[1].trim();
      const colorType = $(el).find(".kan .judul2").text().split("•")[2]?.trim() || "";

      if (mangaTitle && mangaParam) {
        mangaList.push({
          title: mangaTitle,
          description: mangaDescription,
          latest_chapter: latestChapter,
          thumbnail: mangaThumbnail ? mangaThumbnail.split("?")[0] : "",
          param: mangaParam,
          detail_url: `${urls}/${mangaParam}`,
          type,
          views,
          update_time: updateTime,
          color_type: colorType
        });
      }
    });

    const nextPage = $("span[hx-get]").attr("hx-get")?.match(/\/page\/(\d+)/)?.[1];

    return res.json({
      next_page: nextPage ? `${url}?page=${nextPage}` : null,
      prev_page: page > 1 ? `${url}?page=${page - 1}` : null,
      data: mangaList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

module.exports.getMangaByParamBatch = async (req, res) => {
  const body = req.body;
  const url = req.protocol + "://" + req.get("host") + req.baseUrl;

  console.log(body);

  try {
    const promises = body.map(element => getMangaDetail(element, url));
    const data = await Promise.all(promises);
    res.json({ data: data });
  } catch (err) {
    res.status(500).json({
      data: {},
      error: {
        error: err?.message || "Unknown Error",
      },
    });
  }
};

async function getMangaDetail(param, url) {
  try {
    const response = await axios.get(`https://komiku.id/manga/${param}`, {
      headers: { 'Referer': 'https://komiku.id/' }
    });
    const $ = cheerio.load(response.data);

    const mangaTitle = $('#Judul h1').text().trim();
    const mangaThumbnail = $('.ims img').attr('src');
    const mangaGenre = [];
    const mangaSynopsis = $('#Judul .desc').text().trim();
    const mangaChapters = [];

    $('.genre li a').each((i, el) => {
      mangaGenre.push($(el).text());
    });

    $('#Daftar_Chapter tbody tr').each((i, el) => {
      if (i > 0) {
        const chapterNumber = $(el).find('.judulseries').text().trim();
        let chapterSlug = $(el).find('.judulseries a').attr('href').split('/')[1];
        if (chapterSlug == "ch") {
          chapterSlug = $(el).find('.judulseries a').attr('href').split('ch/')[1];
        }
        const chapterRelease = $(el).find('.tanggalseries').text().trim();

        mangaChapters.push({
          chapter: chapterNumber,
          param: chapterSlug,
          release: chapterRelease,
          detail_url: `${url}/chapter/${chapterSlug}`,
        });
      }
    });

    return {
      title: mangaTitle,
      param: param,
      thumbnail: mangaThumbnail.split('?')[0],
      genre: mangaGenre,
      synopsis: mangaSynopsis,
      chapters: mangaChapters,
    };
  } catch (error) {
    console.error(`Error fetching manga detail for ${param}:`, error);
    throw error;
  }
}

module.exports.getComicByGenre = async (req, res) => {
  const { genre } = req.params;
  const page = req.query.page || 1;
  const urls = req.protocol + "://" + req.get("host") + req.baseUrl;
  const url = req.protocol + "://" + req.get("host") + req.baseUrl + "/genre/" + genre;

  try {
    const scrapingUrl = page === 1
      ? `https://api.komiku.id/genre/${genre}/`
      : `https://api.komiku.id/genre/${genre}/page/${page}/`;

    const response = await axios.get(scrapingUrl, {
      headers: { 'Referer': 'https://komiku.id/' }
    });
    const $ = cheerio.load(response.data);

    const comicList = [];

    $(".bge").each((i, el) => {
      const comicTitle = $(el).find(".kan h3").text().trim();
      const comicDescription = $(el).find(".kan p").text().trim();
      const comicThumbnail = $(el).find(".bgei img").attr("src");
      const comicParam = $(el).find(".kan a").first().attr("href")?.split("/")[4] || "";
      const latestChapter = $(el).find(".kan .new1").last().find("span").last().text().trim();
      const type = $(el).find(".tpe1_inf b").text().trim();
      const views = $(el).find(".kan .judul2").text().split("•")[0].trim();
      const updateTime = $(el).find(".kan .judul2").text().split("•")[1].trim();
      const colorType = $(el).find(".kan .judul2").text().split("•")[2]?.trim() || "";

      if (comicTitle && comicParam) {
        comicList.push({
          title: comicTitle,
          description: comicDescription,
          latest_chapter: latestChapter,
          thumbnail: comicThumbnail ? comicThumbnail.split("?")[0] : "",
          param: comicParam,
          detail_url: `${urls}/${comicParam}`,
          type,
          views,
          update_time: updateTime,
          color_type: colorType
        });
      }
    });

    const nextPage = $("span[hx-get]").attr("hx-get")?.match(/\/page\/(\d+)/)?.[1];

    res.json({
      genre: genre,
      next_page: nextPage ? `${url}?page=${nextPage}` : null,
      prev_page: page > 1 ? `${url}?page=${page - 1}` : null,
      data: comicList,
    });
  } catch (error) {
    console.error(`Error fetching comics for genre ${genre}:`, error);
    res.status(500).json({ error: `An error occurred while fetching comics for genre ${genre}` });
  }
};

// Add this to your exports
module.exports.getGenreList = async (req, res) => {
  try {
    const response = await axios.get('https://komiku.id/', {
      headers: { 'Referer': 'https://komiku.id/' }
    });
    const $ = cheerio.load(response.data);

    const genreList = [];

    $('select[name="genre2"] option').each((i, el) => {
      const value = $(el).attr('value');
      const text = $(el).text().trim();
      if (value && text !== 'Genre 2') {
        genreList.push({
          value: value,
          name: text
        });
      }
    });

    res.json({
      data: genreList
    });
  } catch (error) {
    console.error('Error fetching genre list:', error);
    res.status(500).json({ error: 'An error occurred while fetching the genre list' });
  }
};

module.exports.getMangaChapterByParam = async (req, res) => {
  const { param } = req.params;

  try {
    const response = await axios.get(`https://komiku.id/ch/${param}`, {
      headers: { 'Referer': 'https://komiku.id/' }
    });
    const $ = cheerio.load(response.data);

    const chapterImages = [];

    $('#Baca_Komik img').each((i, el) => {
      let imageUrl = $(el).attr('src');
      if (imageUrl) {
        imageUrl = imageUrl.replace('img.komiku.id', 'cdn.komiku.co.id');
        chapterImages.push(imageUrl);
      }
    });

    res.json({
      data: chapterImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching chapter data' });
  }
};