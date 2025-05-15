import { useState, useEffect } from "react";
import * as Functions from "../Components/common/functions";
import { format } from 'date-fns';


function CollectAndUnifyDataFromAPIsResponce(responce) {
  let collectedData = []
  let sources = []
  let authors = []
  if (!Functions.isEmpty(responce)) {
    responce.forEach((data) => {
      if (data.status === "OK" || data.status === "ok" || !Functions.isEmpty(data.articles)) {
        let articles = []
        if (!Functions.isEmpty(data.response) && !Functions.isEmpty(data.response.docs)) {
          articles = data.response.docs
        }

        if (!Functions.isEmpty(data.articles)) {
          articles = (!Functions.isEmpty(data.articles.totalResults)) ? data.articles.results : !Functions.isEmpty(data.articles) ? data.articles : []
        }

        if (!Functions.isEmpty(articles)) {
          articles?.forEach((article) => {
            if (!Functions.isObjectEmpty(article)) {
              article.publishedAt = article.dateTimePub ? article.dateTimePub : article.publishedAt
              article.url = article.web_url ? article.web_url : article.url

              article.urlToImage = article.urlToImage ? article.urlToImage : article.image

              if (Functions.isEmpty(article.urlToImage))
                article.urlToImage = !Functions.isEmpty(article.multimedia) && !Functions.isEmpty(article.multimedia.default) ? article.multimedia.default.url ? article.multimedia.default.url : null : null

              if (Functions.isEmpty(article.title) && !Functions.isEmpty(article.headline))
                article.title = !Functions.isEmpty(article.headline.main) ? article.headline.main : null

              if (Functions.isEmpty(article.description))
                article.description = article.abstract
              article.sourceName = !Functions.isEmpty(article.source) ? article.source : null
              if (!Functions.isEmpty(article.source) && !Functions.isEmpty(article.source.name)) {
                article.sourceName = article.source.name
              }
              if (!Functions.isEmpty(article.source) && !Functions.isEmpty(article.source.title)) {
                article.sourceName = article.source.title
              }

              article.author = article.author ? article.author : null
              if (!Functions.isEmpty(article.authors)) {
                article.author = !Functions.isEmpty(article.authors[0].name) ? article.authors[0].name : null
              }
              if (!Functions.isEmpty(article.byline)) {
                article.author = !Functions.isEmpty(article.byline.original) ? article.byline.original : null
              }
              article.category = article.subsection_name ? article.subsection_name : null

              if (!Functions.checkIfValueExistInArray(article.sourceName, sources)) {
                sources.push(article.sourceName)
              }

              if (!Functions.isEmpty(article.byline) && !Functions.isEmpty(article.byline.person)) {
                article.byline.person.forEach((Author) => {
                  let authorFullname = Author.firstname + " " + Author.lastname
                  if (!Functions.checkIfValueExistInArray(authorFullname, authors)) {
                    authors.push(authorFullname)
                  }
                })
              } else {
                if (!Functions.checkIfValueExistInArray(article.author, authors) && !Functions.isEmpty(article.author))
                  authors.push(article.author)
              }
            }

          })
        }
        collectedData.push(...articles)
      }
    })
  }

  return { collectedData, sources, authors }
}

const useNewsData = (category, selectedSource, startDate, endDate, searchTerm) => {
  const [newsData, setNewsData] = useState([]);
  const [sources, setSources] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const nytimesApiKey = process.env.REACT_APP_NYTIMES_API_KEY;
    const NewsApiKey = process.env.REACT_APP_NEWS_API_KEY;
    const NewsApiAIKey = process.env.REACT_APP_NEWS_API_AI_KEY;

    // Preferencies
    const preferedSources = JSON.parse(localStorage.getItem('userPreferedSources')) || [];
    const preferedCategories = JSON.parse(localStorage.getItem('userPreferedCategories')) || [];
    const preferedAuthors = JSON.parse(localStorage.getItem('userPreferedAuthors')) || [];


    async function fetchNewsAPIData() {
      // Search params
      let categoryParam = category ? `&category=${category.replace(/ /g, '-')}` : "";
      let sourceParam = selectedSource ? `&sources=${selectedSource.replace(/ /g, '-')}` : "";
      let searchParam = searchTerm ? `&q=${searchTerm}` : "";
      let fromDate = startDate ? `&from=${format(startDate, 'yyyy-MM-dd')}` : "";
      let toDate = endDate ? `&from=${format(endDate, 'yyyy-MM-dd')}` : "";
      let authorParam = ""

      if (!category && !selectedSource && !startDate && !endDate && !searchTerm) {
        // if the user didn't filter the news so the news will show as his prefernces chosen before
        categoryParam = !Functions.isEmpty(preferedCategories) ? `&category=${preferedCategories.toString().replace(/ /g, '-').replace(",", "&")}` : categoryParam;
        sourceParam = !Functions.isEmpty(preferedSources) ? `&sources=${preferedSources.toString().replace(",", "&")}` : sourceParam;
        authorParam = !Functions.isEmpty(preferedAuthors) ? `&author=${preferedAuthors.toString()}` : authorParam;
      }

      // change parameters base on each API documentation
      let addedParamsToURL1 = categoryParam.replace('category', 'facet_fields=subsection_name&facet_filter=true&fq') + sourceParam + searchParam + fromDate.replace('from', 'begin_date') + toDate.replace('to', 'end_date') + authorParam
      let addedParamsToURL2 = categoryParam + sourceParam + searchParam + fromDate + toDate + authorParam
      // newsapi You cannot mix the sources parameter with the country or category parameters.
      if (category) {
        addedParamsToURL2 = categoryParam + searchParam + fromDate + toDate + authorParam
      } else {
        addedParamsToURL2 = sourceParam + searchParam + fromDate + toDate + authorParam
      }
      let addedParamsToURL3 = categoryParam.replace('category', 'categoryUri') + sourceParam.replace("source,'sourceUri  ") + searchParam.replace("&q", '&keyword') + fromDate.replace("from", 'dateStart') + toDate.replace("to", 'dateEnd') + authorParam.replace("authoe", 'authorUri')

      const endpoints = [`https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${nytimesApiKey}` + addedParamsToURL1,
      `https://newsapi.org/v2/top-headlines?apiKey=${NewsApiKey}&language=en` + addedParamsToURL2,
      `https://eventregistry.org/api/v1/article/getArticles?apiKey=${NewsApiAIKey}&lang=eng` + addedParamsToURL3
      ];

      setLoading(true);
      const fetchPromises = endpoints.map(endpoint => fetch(endpoint));
      let collectedData = []
      let sources = []
      let authors = []
      Promise.all(fetchPromises)
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
          // Merge and process the data (unify keys in all responces)
          let collectedDataFromResponce = CollectAndUnifyDataFromAPIsResponce(data);
          setNewsData(collectedDataFromResponce.collectedData);
          setSources(collectedDataFromResponce.sources);
          setAuthors(collectedDataFromResponce.authors);
          setLoading(false);

        })
        .catch(error => {
          // Handle any errors
          setError(error);
          setLoading(false);
        });
    }

    fetchNewsAPIData();
  }, [category, selectedSource, startDate, endDate, searchTerm]);

  return { newsData, sources, authors, loading, error };
};

export default useNewsData;