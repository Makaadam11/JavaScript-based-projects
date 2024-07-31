import React, { useState } from "react";
import { Button, BreadcrumbItem, BreadcrumbsBar } from "monday-ui-react-core";
import { handleClick } from "../../services/Api"; // replace './api' with the actual path to your api.js file
import { motion } from "framer-motion";
import { Form, Quote, Emoji, Placeholder, Workspace } from "monday-ui-react-core/icons";
import { useNavigate } from "react-router-dom";
import TextArea from "../textArea/textArea.js"; // replace './textArea' with the actual path to your TextArea.js file
import HoverButton from "../hoverButton/HoverButton.js";

const Chat = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleClickWithText = () => handleClick(text, navigate);

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
        ]}
      >
        <BreadcrumbItem icon={Workspace} text="Homepage" onClick={() => navigate("/")} />
        <BreadcrumbItem icon={Form} text="Chat" />
      </BreadcrumbsBar>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "150px" }}>
        {/* <h1 style={{ textAlign: "center", marginBottom: "20px" }}>This is Mood generative AI - choose how you want to create your song</h1> */}

        <div style={{ marginBottom: "50px" }}>
          <TextArea label="How are you feeling today?" onChange={(e) => setText(e.target.value)} />
        </div>

        <HoverButton text="Generate Your Mood" onclick={handleClickWithText} color="#4682b4" width="350px" height="100px" />
        {/* <Button onClick={handleClickWithText} style={{ margin: "10px", width: "200px", height: "80px", backgroundColor: "blue" }}>
          Generate Your Mood
        </Button> */}
      </div>
    </motion.div>
  );
};

export default Chat;
