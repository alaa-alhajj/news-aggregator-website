import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import * as Functions from "./common/functions";
import { useNavigate } from 'react-router-dom';

function Preferences() {
    // localStorage.clear();
    const navigate = useNavigate();

    const location = useLocation();
    const data = location.state || [];

    useEffect(() => {
        if (Functions.isEmpty(data)) {
            navigate('/');
        }
    })

    const [userinfo, setUserInfo] = useState({
        preferedSources: JSON.parse(localStorage.getItem('userPreferedSources')) || [],
        preferedAuthors: JSON.parse(localStorage.getItem('userPreferedAuthors')) || [],
        preferedCategories: JSON.parse(localStorage.getItem('userPreferedCategories')) || []

    });

    const handleClearPreferencies = () => {
        localStorage.clear();
        setUserInfo({
            preferedSources: [],
            preferedAuthors: [],
            preferedCategories: []

        })
        Functions.showAlertMessage(true, "Your prerfernces removed successfully!");
    }


    const handleChangePreferedCheckBox = (e, field) => {
        // Destructuring
        const { value, checked } = e.target;
        const oldValues = userinfo[field];
        // Case 1 : The user checks the box
        if (checked) {
            setUserInfo(prevState => {
                // Object.assign would also work
                return {
                    ...prevState,
                    [field]: [...oldValues, value]
                };
            });
        }

        // Case 2  : The user unchecks the box
        else {
            setUserInfo(prevState => {
                // Object.assign would also work
                return {
                    ...prevState,
                    [field]: oldValues.filter(
                        (e) => e !== value
                    )
                };
            });
        }

    };

    const handleSavePreferences = (event) => {
        event.preventDefault();

        localStorage.setItem('userPreferedSources', JSON.stringify(userinfo.preferedSources));
        localStorage.setItem('userPreferedAuthors', JSON.stringify(userinfo.preferedAuthors));
        localStorage.setItem('userPreferedCategories', JSON.stringify(userinfo.preferedCategories));
        Functions.showAlertMessage(true, "Your prerfernces saved successfully!");
    };

    function generateCheckBoxes(data) {
        let content = [];
        Object.keys(data).forEach(function (key) {
            content.push(<Col xs={12} md={4}>
                <h5 className='pt-2'>{key}</h5>
                {
                    !Functions.isEmpty(data[key]) ?
                        data[key].map((singlePrefernce, index) => {
                            let checkAlreadySelected = userinfo[`prefered${key}`] && userinfo[`prefered${key}`].length > 0 ? userinfo[`prefered${key}`].filter(preferedInfo => { return preferedInfo === singlePrefernce.replace(/ /g, '-') }) : []
                            return <Form.Check
                                checked={checkAlreadySelected.length > 0}
                                label={singlePrefernce}
                                value={singlePrefernce.replace(/ /g, '-')}
                                name={`prefered${key}`}
                                type={'checkbox'}
                                id={`inline-${key}-${index}-1`}
                                key={`inline-${key}-${index}-1`}
                                onChange={
                                    (e, field) => handleChangePreferedCheckBox(e, `prefered${key}`)
                                }
                            />
                        }
                        )
                        : null
                }
            </Col>
            )
        })
        return content
    }


    return (
        <Container>

            <h4>Adjust your Preferences</h4>
            <hr></hr>

            <Form onSubmit={handleSavePreferences} >
                <Container>
                    <Row>
                        {generateCheckBoxes(data)}
                    </Row>
                </Container>
                <div className='mt-4' >
                    <Button variant="outline-primary" className='mb-1' type="submit" >
                        Save
                    </Button>{' '}
                    <Button variant="secondary" className='mb-1' onClick={handleClearPreferencies}>Clear preferenceies</Button>
                    {' '}
                    <Button variant="outline-dark" className='mb-1' href="/">Go back</Button>
                </div>
            </Form>
        </Container>
    )

}

export default Preferences;