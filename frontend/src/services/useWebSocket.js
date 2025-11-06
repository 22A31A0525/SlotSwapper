import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { getUserEmailFromToken } from "../jwt";
export const useWebSocket = (onNotificationReceived) => {
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const userEmail = getUserEmailFromToken(token);

    if (!userEmail) {
      console.log(
        "No authenticated user found. Skipping WebSocket connection."
      );
      return;
    }

    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    let wsUrl = API_BASE_URL;

    if (wsUrl.startsWith("https")) {
      wsUrl = wsUrl.replace("https", "wss"); // Secure WebSocket
    } else {
      wsUrl = wsUrl.replace("http", "ws");
    }

    wsUrl = wsUrl + "/ws";

    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000, // Try to reconnect every 5 seconds
    });

    client.onConnect = (frame) => {
      console.log("WebSocket Connected! Subscribing to private user queue.");

      client.subscribe(
        "/user/queue/notifications",
        (message) => {
          console.log("Notification received:", message.body);
          onNotificationReceived(message.body);
        },
        { Authorization: `Bearer ${token}` }
      );
    };
    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
    };

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
        console.log("WebSocket Disconnected.");
      }
    };
  }, [onNotificationReceived]);
};
