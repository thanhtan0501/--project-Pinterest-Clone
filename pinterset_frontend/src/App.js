import React from "react";
import { Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./container/Home";

const App = () => {
    return (
        <GoogleOAuthProvider
            // clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
            clientId="44245256388-mg2kr0je32s5cguqkbknoovshf7hbepp.apps.googleusercontent.com"
        >
            <Routes>
                <Route path="/*" element={<Home />} />
            </Routes>
        </GoogleOAuthProvider>
    );
};

export default App;
