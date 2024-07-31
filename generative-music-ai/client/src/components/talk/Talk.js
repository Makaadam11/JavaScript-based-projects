import React, { useState } from "react";
import { ReactMic } from "react-mic";
import { Button, BreadcrumbsBar, BreadcrumbItem } from "monday-ui-react-core";
import { Form, Quote, Emoji, Placeholder, Workspace } from "monday-ui-react-core/icons";
import { useNavigate } from "react-router-dom";
import { transcribeSpeech } from "../../services/Api.js";
import { motion } from "framer-motion";
import HoverButton from "../hoverButton/HoverButton.js";
import WaveCard from "../waveCard/WaveCard.js";

const Talk = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [blobURL, setBlobURL] = useState("");
	const navigate = useNavigate();

	const startRecording = () => {
		setIsRecording(true);
	};

	const stopRecording = () => {
		setIsRecording(false);
	};

	const onData = (recordedBlob) => {
		console.log("chunk of real-time data is: ", recordedBlob);
	};

	const onStop = (recordedBlob) => {
		setBlobURL(recordedBlob.blobURL);
		const file = new File([recordedBlob.blob], "audio.webm", { type: "audio/webm" }); // Ensure the type matches your server's expectations
		const songDecription = transcribeSpeech(file, navigate);
		navigate("/songdescription", { state: { description: songDecription } });
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			<BreadcrumbsBar
				type={BreadcrumbsBar.types.NAVIGATION}
				style={{ position: "absolute", top: 0, left: 0 }}>
				<BreadcrumbItem
					icon={Workspace}
					text="Homepage"
					onClick={() => navigate("/")}
				/>
				<BreadcrumbItem
					icon={Quote}
					text="Talk"
				/>
			</BreadcrumbsBar>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh" }}>
				<WaveCard
					text={"Click Start to begin recording and stop to end it"}
					infoStyle={{ marginTop: "-40px" }}
					cardStyle={{ width: "700px", height: "300px", margin: "10px auto" }}
					waveStyle={{ width: "1000px", height: "1000px", marginLeft: "-20%", marginTop: "-25%" }}
					colors={["#44b9c9", "#b2dfdb"]}
				/>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						marginTop: "20px",
					}}>
					<ReactMic
						className="sound-wave"
						record={isRecording}
						onStop={onStop}
						onData={onData}
						backgroundColor="#FF4081"
					/>
				</div>
				<div style={{ display: "flex", flexDirection: "row", marginTop: "20px", justifyContent: "space-between", width: "30%", alignItems: "center" }}>
					<HoverButton
						onclick={startRecording}
						disabled={isRecording}
						text="Start"
						color="#4682B4"
						width="220px"
						height="100px"
					/>
					<HoverButton
						onclick={stopRecording}
						disabled={!isRecording}
						text="Stop"
						color="#FF6B6B"
						width="220px"
						height="100px"
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default Talk;
