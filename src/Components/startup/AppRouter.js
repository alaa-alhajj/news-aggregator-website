import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Preferences from "../preferences"
import NewsContainer from "../NewsContainer";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<NewsContainer />} />
                <Route path='/Preferences' element={<Preferences authed={true} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;