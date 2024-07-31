import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BreadcrumbsBar, BreadcrumbItem, Button } from "monday-ui-react-core";
import { Workspace, Placeholder } from "monday-ui-react-core/icons";
import { useLocation } from "react-router-dom";
import HoverButton from "../hoverButton/HoverButton.js";
import { handleClick } from "../../services/Api";

const SongDescription = () => {
  const navigate = useNavigate();

  const location = useLocation();
  let description = location.state.description;
  let formattedDescription = description.replace(/(Title|Tempo|Genre|Melody):/g, "\n$&");
  let songURL = "";

  useEffect(() => {
    const fetchSongURL = async () => {
      songURL = await handleClick(description);
    };

    fetchSongURL();
  }, [description, navigate]);

  const handleListenClick = async () => {
    console.log("handleListenClick", songURL);
    if (songURL) {
      navigate("/song", { state: { song: songURL } });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <BreadcrumbsBar type={BreadcrumbsBar.types.NAVIGATION} style={{ position: "absolute", top: 0, left: 0 }}>
        <BreadcrumbItem icon={Workspace} text="Composure" Composure />
      </BreadcrumbsBar>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "70vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: "70%" }}>
          <div style={{ padding: "5px", backgroundColor: "#f0f0f0", border: "15px solid #000", borderRadius: "10px", width: "100%", height: "80%", marginTop: "2%", marginBottom: "30px", position: "relative", overflow: "hidden", transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)", boxShadow: "5px 5px 0 #000, 10px 10px 0 #FFB6C1" }}>
            <h2 style={{ marginBottom: "-25px" }}>Song Description</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{formattedDescription}</p>{" "}
          </div>
        </div>
        <div style={{ marginTop: "5px" }}>
          <HoverButton text="Listen to your song" onclick={() => handleListenClick()} color="#FFB6C1" width="400px" height="100px" />
        </div>
      </div>
    </motion.div>
  );
};

export default SongDescription;
