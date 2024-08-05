import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BreadcrumbsBar, BreadcrumbItem, Button } from "monday-ui-react-core";
import { Workspace, Education } from "monday-ui-react-core/icons";
import { useLocation } from "react-router-dom";
import HoverButton from "../hoverButton/HoverButton.js";
import { handleClick, generateDescription } from "../../services/Api";
import Loader from "../loader/Loader.js";

const SongDescription = () => {
	const navigate = useNavigate();

	const location = useLocation();
	const description = location.state?.description;
	const faceExpression = location.state?.faceExpression;
	let formattedDescription = "";
	if (description) {
		formattedDescription = description.replace(/(Title|Tempo|Genre|Melody):/g, "\n$&");
	}
	let songURL = "";

	useEffect(() => {
		const fetchSongURL = async () => {
			songURL = await handleClick(description);
		};

		if (description && navigate) {
			fetchSongURL();
		}
	}, [description, navigate]);

	const [isLoading, setIsLoading] = useState(false);

	const generateSongFromExpression = async () => {
		setIsLoading(true);
		try {
			if (faceExpression) {
				const description = await generateDescription(faceExpression, navigate);
			}
			if (description) {
			} else {
				setIsLoading(false);
			}
		} catch (error) {
			console.error("Error in onStop:", error);
			setIsLoading(false);
		}
	};

	// const generateSongFromExpression = async () => {
	// 	if (faceExpression) {
	// 		await generateDescription(faceExpression, navigate);
	// 	}
	// };

	const navigateToSong = async () => {
		setIsLoading(true);
		console.log("navigateToSong", songURL);
		if (songURL) {
			navigate("/song", { state: { song: songURL } });
		}
	};

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
			<BreadcrumbsBar type={BreadcrumbsBar.types.NAVIGATION} style={{ position: "absolute", top: 0, left: 0 }}>
				<BreadcrumbItem icon={Workspace} text="Home" onClick={() => navigate("/")} />
				<BreadcrumbItem icon={Education} text="Description" />
			</BreadcrumbsBar>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "70vh" }}>
				<div style={{ display: "flex", justifyContent: "space-between", width: "70%" }}>
					<div style={{ padding: "5px", backgroundColor: "#f0f0f0", border: "15px solid #000", borderRadius: "10px", width: "100%", height: "80%", marginTop: "3%", marginBottom: "30px", position: "relative", overflow: "hidden", transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)", boxShadow: "5px 5px 0 #000, 10px 10px 0 #FFB6C1" }}>
						{formattedDescription && (
							<div>
								<h2 style={{ marginBottom: "-10px" }}>Song Description</h2>
								<p style={{ whiteSpace: "pre-wrap" }}>{formattedDescription}</p>
							</div>
						)}
						{faceExpression && (
							<div>
								<h2 style={{ marginBottom: "-10px" }}>Your Face Expression</h2>
								<p style={{ whiteSpace: "pre-wrap" }}>{faceExpression}</p>{" "}
							</div>
						)}
					</div>
				</div>
				{isLoading ? (
					<Loader />
				) : (
					<div>
						{" "}
						{description && (
							<div style={{ marginTop: "30px" }}>
								<HoverButton text="Listen to your song" onclick={() => navigateToSong()} color="#FFB6C1" width="400px" height="100px" />
							</div>
						)}
						{faceExpression && (
							<div style={{ marginTop: "40px" }}>
								<HoverButton text="Generate song" onclick={() => generateSongFromExpression()} color="#FFB6C1" width="400px" height="100px" />
							</div>
						)}
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default SongDescription;
