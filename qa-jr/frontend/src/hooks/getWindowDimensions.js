import { useState, useLayoutEffect } from "react";

const GetDimensions = () => {

    const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight
	});

    useLayoutEffect(() => {
        const updateScreenDimensions = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight
			})
		};

        window.addEventListener("resize", updateScreenDimensions);
		updateScreenDimensions();
        return () => window.removeEventListener("resize", updateScreenDimensions);
    }, []);

    return dimensions;
};

export default GetDimensions;
