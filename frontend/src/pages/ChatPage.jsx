import React from "react";
import SideBar from "../components/SideBar";
import PersistentDrawerLeft from "../components/PersistentDrawerLeft";
import ChatSection from "../components/ChatSection";

export default function ChatPage() {
  return (
    <div>
      <PersistentDrawerLeft>
        <ChatSection />
      </PersistentDrawerLeft>
    </div>
  );
}
