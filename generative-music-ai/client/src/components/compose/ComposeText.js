import React, { useState } from "react";
import { Button, BreadcrumbItem, BreadcrumbsBar } from "monday-ui-react-core";
import { motion } from "framer-motion";
import { Form, Quote, Emoji, Placeholder, Workspace } from "monday-ui-react-core/icons";
import { useNavigate } from "react-router-dom";
import TextArea from "../textArea/textArea.js"; // replace './textArea' with the actual path to your TextArea.js file
import HoverButton from "../hoverButton/HoverButton.js";

const ComposeText = () => {
	const [text, setText] = useState("");
	const navigate = useNavigate();

	const Generate = async (text) => {
		try {
			const songDescription = generateDescription(emotionSentence);
			setText(songDescription);
		} catch (error) {
			console.error("Error in onStop:", error);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			<BreadcrumbsBar
				type={BreadcrumbsBar.types.NAVIGATION}
				style={{ position: "absolute", top: 0, left: 0 }}
				items={[
					{
						icon: Workspace,
						text: "Homepage",
					},
				]}>
				<BreadcrumbItem
					icon={Workspace}
					text="Homepage"
					onClick={() => navigate("/")}
				/>
				<BreadcrumbItem
					icon={Form}
					text="Chat"
				/>
			</BreadcrumbsBar>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "150px" }}>
				<div style={{ marginBottom: "50px" }}>
					<TextArea
						label="Describe your song here!"
						onChange={(e) => Generate(e.target.value)}
					/>
				</div>
				<HoverButton
					text="Compose Song Description"
					onclick={() => navigate("/composemelody", { state: { description: text } })}
					color="#D2B48C"
					width="450px"
					height="100px"
				/>
			</div>
		</motion.div>
	);
};

export default ComposeText;
