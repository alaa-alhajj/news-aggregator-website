import { useState } from "react";
import {
    Col, Container, Row,
    Form,
    FormControl,
    Button,
    Dropdown,
    FloatingLabel
} from "react-bootstrap";

import useNewsData from "../hooks/useNewsData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import NewsList from "./NewsList"
import * as Functions from "./common/functions"

function NewsContainer() {
    const navigate = useNavigate();
    const [category, setCategory] = useState("");
    const [selectedSource, setSource] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const categories = ['Business', 'Politics', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology', 'Book Review']

    const { newsData, sources, authors, loading, error } = useNewsData(category, selectedSource, startDate, endDate, searchTerm);

    const handleCategoryClick = (cetegory) => {
        setCategory(cetegory);

    };

    const handleSourceClick = (source) => {
        setSource(source)
    };

    const handleSearch = (event) => {
        event.preventDefault();

        setSearchTerm(event.target.search.value);
    };

    function handleGoToPreferences() {
        navigate('/preferences', { state: { Sources: sources, Authors: authors, Categories: categories } });
    }

    function handleClearFilters(){
        setSource("");
        setCategory("");
        setSearchTerm("");
        setStartDate(null);
        setEndDate(null);
    }

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <Form onSubmit={handleSearch} className="d-flex">
                        <FormControl
                            type="text"
                            placeholder="Search"
                            className="me-2"
                            name="search"
                        />

                        <Button variant="outline-primary" type="submit">
                            Search
                        </Button>
                    </Form>
                </Col>
                <Col xs={12}>
                    <div className="d-flex  flex-wrap mb-3 justify-content-between align-items-end">
                        <div className="d-inline-flex flex-row flex-wrap">
                            <div className="p-2 ps-0">

                                <FloatingLabel>Categories</FloatingLabel>

                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-primary">
                                        {category ? category : "Categories"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            categories?.map((category, index) => (
                                                <Dropdown.Item key={`category-${index}`}
                                                    onClick={() => handleCategoryClick(category)}
                                                >
                                                    {category}
                                                </Dropdown.Item>
                                            )
                                            )
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <div className="p-2">
                                <FloatingLabel>Sources</FloatingLabel>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-primary">
                                        {selectedSource ? selectedSource : "Sources"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            sources?.map((source, index) => (
                                                <Dropdown.Item key={`source-${index}`}
                                                    onClick={() => handleSourceClick(source)}
                                                >
                                                    {source}
                                                </Dropdown.Item>
                                            )
                                            )
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <div className="p-2">
                                <FloatingLabel>From</FloatingLabel>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    disabledKeyboardNavigation
                                    className="btn btn-outline-primary"
                                    isClearable={true}
                                />
                            </div>

                            <div className="p-2">
                                <FloatingLabel>To</FloatingLabel>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    disabledKeyboardNavigation
                                    className="btn btn-outline-primary"
                                    isClearable={true}
                                />
                            </div>
                            

                        </div>
                      
                        <div className="p-2 px-0">
                        <Button variant="outline-secondary"  onClick={handleClearFilters}>Clear filters</Button>
                        {' '}
                            <Button variant="outline-primary" onClick={handleGoToPreferences}>Personalize news feed</Button>
                        </div>

                    </div>
                </Col>
            </Row>
            <NewsList loading={loading} error={error} newsData={newsData} />
        </Container>
    );
};

export default NewsContainer;