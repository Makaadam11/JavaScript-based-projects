import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button, BreadcrumbsBar, BreadcrumbItem } from "monday-ui-react-core";
import { analyzeFace } from "../../services/Api.js";
import { motion } from "framer-motion";
import { Form, Quote, Emoji, Placeholder, Workspace } from "monday-ui-react-core/icons";
import { useNavigate } from "react-router-dom";
import HoverButton from "../hoverButton/HoverButton.js";

const Express = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    analyzeFace(imageSrc, navigate);
    // Send imageSrc to your backend service for processing
    // Update songDescription state with the response from your backend service
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <BreadcrumbsBar
        type={BreadcrumbsBar.types.NAVIGATION}
        style={{ position: "absolute", top: 0, left: 0 }}
        items={[
          {
            icon: Workspace,
            text: "Homepage",
          },
          {
            icon: Emoji,
            text: "Express",
          },
        ]}
      >
        <BreadcrumbItem icon={Workspace} text="Homepage" onClick={() => navigate("/")} />
        <BreadcrumbItem icon={Emoji} text="Express" />
      </BreadcrumbsBar>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{
            border: "15px solid #000",
            borderRadius: "10px",
            width: "33%",
            height: "33%",
            marginTop: "-1%",
            marginBottom: "30px",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            boxShadow: "5px 5px 0 #000, 10px 10px 0 #FFA07A",
          }}
        />{" "}
        <HoverButton text="Capture" onclick={capture} color="#FFA07A" width="200px" height="100px" />
        {/* <Button onClick={capture} style={{ margin: "10px", width: "120px", height: "60px", backgroundColor: "orange" }}>
          Capture
        </Button> */}
      </div>
    </motion.div>
  );
};

export default Express;
