import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import background from '../assets/images/backgrounds/bg-1.webp';
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const VirtualTour = () => {
  const iframeRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const currentRoomIdRef = useRef(0);

  const onMessage = async (event) => {
    console.info("event", event);
    if (event.origin !== "https://gilberttrausch.uni.lu") return;
    const { type } = event.data || {};
    if (type === "PDF") {
      console.log("PDF message received from iframe!", event.origin);

      try {
        const response = await fetch(`${API_URL}/api/resource?url=${event.data.url}`);
        const { data } = await response.json();
        navigate(`/resources/${data.id}`, { state: { modal: true, previousLocation: location.state?.modal ? location.state.previousLocation : location } });
      } catch (error) {
        console.error("Error fetching resource:", error);
      }
    }
  };
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return function () {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  useEffect(() => {
    console.info("Pathname changed to: ", location.pathname);
    const match = location.pathname.match(/^\/virtual-tour\/room\/([^/]+)$/);
    if (match && iframeRef.current) {
      const roomId = match[1];
      currentRoomIdRef.current = parseInt(roomId, 10);
      console.info("roomId", roomId);
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "navigate",
          route: currentRoomIdRef.current,
        },
        "*"
      );
    }
  }, [location.pathname]);

  return (
    <motion.div
      style={{ background: `url(${background}) center / cover no-repeat` }}
      className={classNames('popup_resource h-[100dvh] flex flex-col overflow-hidden  ', { "fixed inset-0 z-[9999]": location.state?.modal })}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      
      <div className='py-[10px] border-b border-black h-[40px] flex items-center justify-center'>
        <button className='block text-[14px] text-center cursor-pointer hover:text-[#4100FC] duration-500 uppercase font-light' onClick={() => location.state?.modal ? navigate(-1) : navigate('/virtual-tour') }>{ t('close') }</button>
      </div>
    
      <iframe
        ref={iframeRef}
        allowFullScreen
        frameBorder="0"
        className="w-full h-[calc(100dvh-40px)]"
        src="https://gilberttrausch.uni.lu/3dvista"
      />
    </motion.div>
  );
};

export default VirtualTour;
