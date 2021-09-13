import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import RedefinePassword from "./redefinePassword";
import TutorialVideo from "./tutorialVideo";
import { useSelector } from "react-redux";

function getModalStyle() {
	return {
		top: `50%`,
		left: `50%`,
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: `translate(-50%, -50%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 435,
		height: 260,
		borderRadius: 5,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		display: "flex",
		justifyContent: "center",
		fontSize: 13,
		color: "#666",
		alignItems: "center",
	},
}));

export default function UIModal({ ...options }) {

	const {
		user: { has_logged, id, token },
	} = useSelector((state) => state.auth);

	  useEffect(() => {
	    const isAuthenticated = !!id && !!token;
	    if (isAuthenticated && has_logged === 0) setShowFirstAccessModal(true)
	  }, [has_logged])

	const [showFirstAccessModal, setShowFirstAccessModal] = useState(false);

	const handleClose = () => {
		setShowFirstAccessModal(false);
		return;
	};

	const classes = useStyles();
	const [modalStyle] = React.useState({ ...getModalStyle(), ...options });

	const [currentStep, setCurrentStep] = useState(0);

	return (
		<Modal
			open={showFirstAccessModal}
			disableBackdropClick={true}
			onClose={handleClose}
			aria-labelledby="simple-modal-title"
			aria-describedby="simple-modal-description"
			disableEscapeKeyDown
		>
			<div
				style={{
					...modalStyle,
					width: currentStep === 0 ? 435 : "auto",
					height: currentStep === 0 ? 260 : "auto",
					padding: currentStep === 0 ? "32px" : "0",
				}}
				className={classes.paper}
			>
				{currentStep === 0 ? (
					<RedefinePassword setCurrentStep={setCurrentStep} />
				) : (
					<TutorialVideo
						handleClose={handleClose}
						setCurrentStep={setCurrentStep}
					/>
				)}
			</div>
		</Modal>
	);
}
