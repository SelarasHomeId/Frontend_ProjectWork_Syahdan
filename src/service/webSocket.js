import { useCallback, useEffect, useRef } from "react";
import { Centrifuge } from "centrifuge";
import { BASE_URL_SOCKET } from "../utils/constant";
import Cookies from "js-cookie";
import { refreshToken } from "./apiService";

export const useCentrifuge = ({ userId, onDataReceive }) => {
  const centrifugeRef = useRef(null);

  const connectCentrifuge =  useCallback(() => {
    const token = Cookies.get("token");
    if (!token || !userId) return;

    const centrifuge = new Centrifuge(`${BASE_URL_SOCKET}/websocket`, {
      name: "js",
      token: token,
    });

    const subscribeToChannel = () => {
      const channel = `${userId}`;
      const sub = centrifuge.newSubscription(channel);

      sub.on("publication", ctx => {
        onDataReceive?.(ctx.data);
      });

      sub.subscribe();
    };

    centrifuge.on("connect", ctx => {
      subscribeToChannel();

      centrifuge.rpc("your_rpc_method", { key: "value" })
        .then(result => {
          console.log("RPC Success:", result.data);
        })
        .catch(error => {
          console.error("RPC Error:", error);
        });
    });

    centrifuge.on("disconnect", ctx => {
      if (ctx.code === 109) {
        setTimeout( async () => {
          await refreshToken();
          connectCentrifuge();
        }, 1000);
      }
      if (ctx.code === 3500) {
        setTimeout(() => {
          connectCentrifuge();
        }, 1000);
      }
      if (ctx.code === 3000) {
        return;
      }
    });
    
    centrifuge.connect();
    subscribeToChannel();

    try {
      centrifugeRef.current?.disconnect?.();
    } catch (err) {
      console.warn("Error during previous disconnect:", err);
    }
    centrifugeRef.current = centrifuge;
  }, [userId, onDataReceive]);

  useEffect(() => {
    connectCentrifuge();

    return () => {
      try {
        centrifugeRef.current?.disconnect?.();
      } catch (err) {
        console.warn("Error during cleanup disconnect:", err);
      }
    };
  }, [connectCentrifuge]);

  const callRpc = async (method, params) => {
    try {
      const response = await centrifugeRef.current?.rpc(method, params);
      return response?.data;
    } catch (error) {
      console.error("RPC Error:", error);
      throw error;
    }
  };

  return { callRpc };
};
