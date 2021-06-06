import React, { useEffect, useRef, useState } from "react";

const WebCamStreaming = ({ children }) => {
  // The video stream
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef();
  // Attach listeners

  useEffect(() => {
    var mediaSupport = "mediaDevices" in navigator;
    var stream = null;
    if (mediaSupport && null == cameraStream) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: 640,
            height: 480,
          },
          audio: true,
        })
        .then(function (mediaStream) {
          setCameraStream(mediaStream);
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
          }
        })
        .catch(function (err) {
          console.log("Unable to access camera: " + err);
        });
    } else {
      console.log("Your browser does not support media devices.");
    }
    return () => {
      if (null != stream) {
        stream?.getTracks()?.forEach((track) => track?.stop());
        // setCameraStream(null);
      }
    };
  }, []);

  function captureSnapshot() {
    if (videoRef.current) {
      return new Promise((resolve, reject) => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            resolve({ blob, url: URL.createObjectURL(blob) });
          }, "image/jpeg");
        } catch (error) {
          reject(error);
        }
      });
    }

    return null;
  }
  const recordAudio = () =>
    new Promise(async (resolve) => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      const start = () => mediaRecorder.start();

      const stop = () =>
        new Promise((resolve) => {
          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            // const audioUrl = URL.createObjectURL(audioBlob);
            // const audio = new Audio(audioUrl);
            // const play = () => audio.play();
            resolve({
              audioBlob,
              // , audioUrl
              // , play
            });
          });

          mediaRecorder.stop();
        });

      resolve({ start, stop });
    });

  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  return children({
    cameraStream,
    captureSnapshot,
    sleep,
    recordAudio,
    videoRef,
  });
};
export default WebCamStreaming;
