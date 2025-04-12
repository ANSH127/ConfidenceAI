import React from "react";
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
