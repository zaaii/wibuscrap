# Wibu Scrapper

Web scraper for Anoboy, Otakudesu, Doramaindo, Komiku, 

# Getting Started

1. Clone the repository, and navigate to the repository directory.

2. Setup `.env` for Anoboy Link and Doramaindo (Anoboy and Doramaindo Link often get changed time to time, so make sure to check it regularly). Example : 
```
ANOBOY_LINK="Enter Anoboy Link Here"
DORAMAINDO_LINK="Enter Doramaindo Link Here"
```

3. Run `npm install`.

4. Run the code.
```
npm run start
```

# Sample Result

- Note that this scraper is deployed on a `free Render service`, so `some features may not work properly` and, it maybe `out of quota` sometimes.

#### 1. Anoboy
  - [Get Latest Animes](https://wibuscrap.vercel.app/api/anoboy)
  ```
  https://wibuscrap.vercel.app/api/anoboy
  ```
  - [Search Certain Anime](https://wibuscrap.vercel.app/api/anoboy?s=bocchi)
  ```
  https://wibuscrap.vercel.app/api/anoboy?s=bocchi
  ```
  - [Get Anime Detail as well as the stream link](https://wibuscrap.vercel.app/api/anoboy/2022~12~bleach-sennen-kessen-hen-episode-9~)
  ```
  https://wibuscrap.vercel.app/api/anoboy/2022~12~bleach-sennen-kessen-hen-episode-9~
  ```
  
  
#### 2. Komiku
  - [Get Latest Mangas](https://wibuscrap.vercel.app/api/komiku)
  ```
  https://wibuscrap.vercel.app/api/komiku
  ```
  - [Search Certain Manga](https://weeb-scraper.onrender.com/api/komiku?s=Kaguya)
  ```
  https://wibuscrap.vercel.app/api/komiku?s=Kaguya
  ```

-----
Thanks To
- https://github.com/devmoeid/api-otakudesu
- https://github.com/fahmih6/Weebs_Scraper
