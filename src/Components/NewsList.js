import { useState, useEffect } from "react";
import {
  Card, Col, Row, Spinner
} from "react-bootstrap";
import CustomPagination from "./CustomPagination";
import dateFormat from 'dateformat';
import "react-datepicker/dist/react-datepicker.css";


const NewsList = (props) => {

  const [currentPage, setCurrentPage] = useState(1);
  let { loading, error, newsData } = props
  const onPageChange = (pageNumber) => setCurrentPage(pageNumber);

  const pageSize = 12;

  useEffect(() => {
    setCurrentPage(1)
  }, [props])

  if (loading) {
    return <div className='custom-loader'>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const totalArticles = newsData && newsData.length > 0 ? newsData.length : 0;
  let { totalPages, startIndex, endIndex } = 0
  let currentArticles = []
  if (totalArticles > 0) {
    totalPages = Math.ceil(totalArticles / pageSize);
    startIndex = (currentPage - 1) * pageSize;
    endIndex = startIndex + pageSize;
    currentArticles = newsData.slice(startIndex, endIndex);
  }
  console.log("currentPage", currentPage)
  return (
    <>

      <Row className="articles-wrapper">
        {currentArticles.length > 0 ? currentArticles.map((article) => (
          <Col xs={12} md={6} lg={4} key={article.url} className="single-article">
            <Card>
              <Card.Img src={article.urlToImage ? article.urlToImage : './images/placeholder.png'} variant="top" />
              <Card.Body>

                <Card.Title>{article.title}</Card.Title>

                <div className="card-text"
                  dangerouslySetInnerHTML={{ __html: article.description ? article.description.substring(0, 100) : "" }}
                />

                <Card.Link href={article.url} target="_blank" className="link-unstyled">Read More</Card.Link>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Published date: {dateFormat(article.publishedAt, "mmmm dS, yyyy")}</small><br />
                <small className="text-muted"><strong>{article.sourceName}</strong></small><br />
                <small className="text-muted"><strong>{article.author}</strong></small>
              </Card.Footer>
            </Card>
          </Col>
        )) : <div>No articels</div>}
      </Row>
      {
        totalArticles > pageSize ?
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
          : null
      }

    </>
  );
};

export default NewsList;