import React from "react";
import Masonry from "react-masonry-css";

import Pin from "./Pin";

const breakpointObj = {
    default: 4,
    2000: 5,
    1200: 4,
    1020: 3,
    800: 2,
    500: 1,
};

const MasonryLayout = ({ pins }) => {
    return (
        <Masonry
            className="flex animate-slide-fwd px-6 md:px-20 "
            breakpointCols={breakpointObj}
        >
            {pins.map((pin) => (
                <Pin pin={pin} key={pin._id} className="w-screen" />
            ))}
        </Masonry>
    );
};

export default MasonryLayout;
