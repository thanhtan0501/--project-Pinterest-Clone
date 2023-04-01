import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Feed = () => {
    const [loading, setLoading] = useState(false);
    const [pins, setPins] = useState(null);

    const { categoryId } = useParams();

    useEffect(() => {
        setLoading(true);
        if (categoryId) {
            const query = searchQuery(categoryId);
            client.fetch(query).then((data) => {
                setPins(data);
                setLoading(false);
            });
        } else {
            client.fetch(feedQuery).then((data) => {
                setPins(data);
                setLoading(false);
            });
        }
    }, [categoryId]);

    if (loading) return <Spinner />;
    if (!pins?.length)
        return <h2 className="mt-10 text-center text-xl">No Pins available</h2>;
    return (
        <div className="h-full pt-4">
            {pins && <MasonryLayout pins={pins} />}
        </div>
    );
};

export default Feed;
