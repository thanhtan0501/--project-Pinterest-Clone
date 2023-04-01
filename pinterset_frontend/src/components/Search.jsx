import React, { useEffect, useState } from "react";

import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Search = ({ searchTerm }) => {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log(pins?.length);
    useEffect(() => {
        if (searchTerm) {
            setLoading(true);
            const query = searchQuery(searchTerm.toLowerCase());
            client.fetch(query).then((data) => {
                setPins(data);
                setLoading(false);
            });
        } else {
            // client.fetch(feedQuery).then((data) => {
            //     setPins(data);
            //     setLoading(false);
            // });
            setPins([]);
        }
    }, [searchTerm]);

    return (
        <div>
            {loading && <Spinner />}
            {pins?.length !== 0 && <MasonryLayout pins={pins} />}

            {pins?.length === 0 && searchTerm !== "" && !loading && (
                <div className="mt-10 text-center text-xl">No Pins Found!!</div>
            )}
        </div>
    );
};

export default Search;