import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BreadcrumbsBar, BreadcrumbItem, Button } from "monday-ui-react-core";
import { Workspace, Placeholder } from "monday-ui-react-core/icons";
import ReactSlider from "react-slider";
import styled from "styled-components";
import WaveCard from "../../waveCard/WaveCard.js";
import HoverButton from "../../hoverButton/HoverButton.js";
import { generateDescription } from "../../../services/Api";

const White = () => {
	const navigate = useNavigate();
	const [emotionPercentage, setEmotionPercentage] = useState(50);
	const PositiveEmotions = ["Cleanliness, purity, freedom, simplicity, virtue, innocence, openness, peace, calm, hope, and self-sufficiency"];
	const NegativeEmotions = ["Impersonality, distance, coldness, boringness, isolation, emptiness, caution, and lack of imagination"];

	const emotionSentence = `This person feels like ${emotionPercentage}% of ${PositiveEmotions} and ${100 - emotionPercentage}% of ${NegativeEmotions}.`;

	const getColorShade = (percentage) => {
		const color = 350 - percentage * 2.55; // Convert percentage to a scale of 0-255
		return `rgb(${color}, ${color}, ${color})`; // Use the same value for red, green, and blue
	};
	const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1);
  background: ${(props) => {
		const startColor = getColorShade(0);
		const midColor = getColorShade(50);
		const endColor = getColorShade(100);
		return `linear-gradient(to right, 
    ${startColor} 0%, 
    ${midColor} 50%,
    ${endColor} 100%
  )`;
  }};
  margin: 20px 0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
`;

	const StyledThumb = styled.div`
  height: 100px;
  width: 100px;
  margin: -13px 0;
  background-color: ${(props) => getColorShade(props.value)};
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-color: black
  color: rgba(255, 255, 255, 0.8);
  &:hover {
    transform: scale(1.05);
  }

  &:active {
    cursor: grabbing;
  }
`;

	const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  border-radius: 999px;
`;

	const Thumb = (props, state) => (
		<StyledThumb
			{...props}
			value={state.valueNow}>
			{state.valueNow}%
		</StyledThumb>
	);

	const Track = (props, state) => (
		<StyledTrack
			{...props}
			value={state.valueNow}
		/>
	);

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
					icon={Placeholder}
					text="Colour"
					onClick={() => navigate("/color")}
				/>
			</BreadcrumbsBar>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "70vh" }}>
				<WaveCard
					text={"Pick a colour of your choice..."}
					cardStyle={{ width: "700px", height: "150px", margin: "10px auto", marginBottom: "40px", marginTop: "-15px" }}
					infoStyle={{
						position: "relative",
						top: "40px",
						color: "#017663",
					}}
					waveStyle={{ width: "900px", height: "800px", marginLeft: "-20%", marginTop: "-25%" }}
					colors={["#44b9c9", "#b2dfdb"]}
				/>

				<div style={{ display: "flex", justifyContent: "space-between", width: "70%" }}>
					<StyledSlider
						value={emotionPercentage}
						onChange={(value) => setEmotionPercentage(value)}
						min={0}
						max={100}
						renderThumb={Thumb}
						renderTrack={Track}
					/>{" "}
				</div>
				<div style={{ marginTop: "2%" }}>
					{" "}
					<HoverButton
						onclick={() => generateDescription(emotionSentence, navigate)}
						text="Generate"
						color="#D3D3D9"
						width="220px"
						height="100px"
						style={{ margin: "10px" }}
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default White;
