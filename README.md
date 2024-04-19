# News Aggregator Website

This project pulls articles from various sources and display them with pagination so the user can:
- Search for articles by keyword and filter the results by date, category, and source.
- Personalize news feed by clicking on (Personalize news feed) button in home page to go to the prefernces page which will show sources,categories and authors for the showed news.

 > **_NOTES:_** 
- If the user doesn't save any preferences the news will show without any filter params.
- If the user has saved preferences before the first shown news will be with the preferences filter params.
- If the user searches for an article by keyword or filters the results by date, category, and source the shown news will be with entered values without saved preferences params.
- You can change the API KEYs from .env file





## Used News Sources
1- [NewsAPI](https://newsapi.ai/documentation?tab=searchArticles&lang=rest): This is a comprehensive API that allows developers to access articles from
more than 70,000 news sources, including major newspapers, magazines, and blogs.
The API provides access to articles in various languages and categories, and it supports
search and filtering.

2- [New York Times](https://developer.nytimes.com/docs/articlesearch-product/1/routes/articlesearch.json/get): This API allows developers to access articles from The New York
Times, one of the most respected news sources in the world. The API provides access
to articles in various categories and supports search and filtering.

3- [NewsAPI.org](https://newsapi.org/docs/endpoints) : This API provides access to news articles from thousands of sources,
including news publications, blogs, and magazines. It allows developers to retrieve
articles based on keywords, categories, and sources.

## Run the project

You can run the project within a Docker container:

### `docker run -dp 127.0.0.1:3000:80 news_image_app`

OR you need the install the modules:
### `npm i`

Then you can run the project:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.