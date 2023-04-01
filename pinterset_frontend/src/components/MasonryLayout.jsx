import React from "react";
import Masonry from "react-masonry-css";

import Pin from "./Pin";

const breakpointObj = {
    default: 4,
    2000: 5,
    1400: 4,
    1100: 3,
    850: 2,
    550: 1,
};
const MasonryLayout = ({ pins }) => {
    return (
        <Masonry
            className="flex animate-slide-fwd px-6 md:px-12 lg:px-16 xl:px-20 mx-auto"
            breakpointCols={breakpointObj}
        >
            {pins.map((pin) => (
                <Pin pin={pin} key={pin._id} className="w-screen" />
            ))}
        </Masonry>
    );
};

export default MasonryLayout;
