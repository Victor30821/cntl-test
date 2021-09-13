import React, { useEffect, useState } from "react";

const padTime = (time) => {
	return String(time).length === 1 ? `0${time}` : `${time}`;
};

const format = (time) => {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;
	return `${minutes}:${padTime(seconds)}`;
};

const TutorialVideo = ({ handleClose, setCurrentStep }) => {
	const [counter, setCounter] = useState(120);

	useEffect(() => {
		let timer;
		if (counter > 0) {
			timer = setTimeout(() => setCounter((c) => c - 1), 1000);
		}

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [counter]);

	return (
		<>
			<span
				onClick={() => {
					if (counter !== 0) return;
					handleClose();
					setCurrentStep(0);
				}}
				style={{
					position: "absolute",
					right: 0,
					top: -40,
					cursor: counter === 0 ? "pointer" : "initial",
					backgroundColor: "red",
					height: "auto",
					width: "auto",
					color: "yellow",
					fontSize: "1rem",
					border: "1px solid white",
					borderRadius: "5px",
					backgroundColor: counter === 0 ? "white" : "transparent",
					color: counter === 0 ? "black" : "white",
					padding: ".5rem",
				}}
			>
				{counter === 0 ? "Fechar" : format(counter)}
			</span>
			<iframe
				width="1100"
				height="600"
				src="https://www.youtube.com/embed/pyRZdDUL83k?autoplay=1"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</>
	);
};

export default TutorialVideo;
