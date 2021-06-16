import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";

// 캡쳐 이미지는 세로 길이에 맞춤

const App = () => {
  const [canvas, setCanvas] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef();

  const canvasRef = useRef();
  const canvasRef2 = useRef();

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  const togglePlay = () => {
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  // canvas객체 생성
  const initCanvas = () => new fabric.Canvas("canvas");

  // const addImg = (e, url, canvi) => {
  //   e.preventDefault();
  //   const img = new Image();
  //   img.crossOrigin = "anonymous";
  //   img.src = url;
  //   img.onload = function () {
  //     canvi.setBackgroundImage(img.src, canvi.renderAll.bind(canvi), {
  //       originX: "left",
  //       originY: "top",
  //       left: 0,
  //       top: 0,
  //       crossOrigin: "anonymous",
  //     });
  //   };
  //   new fabric.Image.fromURL(url, (img) => {
  //     img.scale(0.75);
  //     canvi.add(img);
  //     canvi.renderAll();
  //     setImgURL("");
  //   });
  // };

  // 범위 지정 사각형 생성 함수
  const createBoundary = (canvas) => {
    console.log(this);
    let mousePressed = false;
    let x = 0;
    let y = 0;

    let square;

    canvas.on("mouse:down", (event) => {
      clearCanvas(canvas);
      mousePressed = true;
      console.log(event);
      const mouse = canvas.getPointer(event.e);
      mousePressed = true;
      x = mouse.x;
      y = mouse.y;

      square = new fabric.Rect({
        width: 0,
        height: 0,
        left: x,
        top: y,
        fill: "rgb(255, 255, 255, 0)",
        stroke: "blue",
        opacity: 1,
        strokeWidth: 4,
        strokeDashArray: [15, 15],
      });

      canvas.add(square);
      canvas.renderAll();
      canvas.setActiveObject(square);
    });

    canvas.on("mouse:move", (event) => {
      if (!mousePressed) {
        return false;
      }

      const mouse = canvas.getPointer(event.e);

      let w = Math.abs(mouse.x - x),
        h = Math.abs(mouse.y - y);

      if (!w || !h) {
        return false;
      }
      square = canvas.getActiveObject();
      square.set("width", w).set("height", h);
      canvas.renderAll();
    });

    canvas.on("mouse:up", (event) => {
      if (mousePressed) {
        mousePressed = false;
      }
      square = canvas.getActiveObject();
      canvas.add(square);

      imageCapture(square);
      // cutImage(canvas, square);
      // setVideo(canvas, square);

      canvas.renderAll();
    });
  };

  const imageCapture = (square) => {
    console.log(canvasRef.current);
    console.log(square);
    console.log(videoRef.current);
    let w, h, ratio;

    // ratio = videoRef.current.width / videoRef.current.height;
    w = square.width;
    h = square.height;

    // canvasRef2.current.width = w;
    // canvasRef2.current.height = h;

    const ctx = canvasRef2.current.getContext("2d");
    // ctx.fillRect(0, 0, w, h);
    ctx.drawImage(
      videoRef.current,
      square.left,
      square.top,
      w,
      h,
      square.left,
      square.top,
      w,
      h
    );
  };

  const clearCanvas = (canvas) => {
    canvas.getObjects().forEach((o) => {
      console.log(o);
      console.log(canvas.getObjects());
      if (o !== canvas.backgroundImage) {
        canvas.remove(o);
      }
    });
  };

  // const cutImage = (canvas, square) => {
  //   const image = canvas.toDataURL({
  //     format: "jpeg",
  //     left: square.left,
  //     top: square.top,
  //     width: square.width + 2,
  //     height: square.height + 2,
  //   });
  //   console.log(image);
  // };

  // const setVideoOnCanvas = (canvas) => {
  //   const videoEl = document.querySelector("#video");
  //   const video = new fabric.Image(videoEl, {
  //     left: 0,
  //     top: 0,
  //     width: 500,
  //     height: 300,
  //     angle: 0,
  //     originX: 0,
  //     originY: 0,
  //     objectCaching: true,
  //     statefullCache: true,
  //   });

  //   canvas.add(video);
  //   fabric.util.requestAnimFrame(function render() {
  //     canvas.renderAll();
  //     fabric.util.requestAnimFrame(render);
  //   });
  // };

  const setVideo = (canvas, square) => {
    const video = document.querySelector("video");

    drawImage(canvas, video, square);
  };

  const drawImage = (canvas, video, square) => {
    console.log(square.top);
    let a = canvas
      .getContext("2d", { alpha: false })
      .drawImage(video, square.left, square.top, square.width, square.height);

    console.log(a);
  };

  return (
    <div className="containerVideo">
      <button onClick={() => setVideo(canvas)}>setVideo</button>
      <button onClick={() => createBoundary(canvas)}>Boundary</button>
      <br />
      <br />
      <br />
      <video
        id="video"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        width="500"
        height="300"
        controls
        ref={videoRef}
      />
      <div
        id="canvasWrapper"
        style={{
          position: "absolute",
          width: 500,
          height: 300,
          left: 0,
          top: 72,
        }}
      >
        <canvas id="canvas" ref={canvasRef} width="500" height="300" />
        <canvas
          style={{ backgroundColor: "red" }}
          id="canvas2"
          ref={canvasRef2}
          width="500"
          height="300"
        />
      </div>
    </div>
  );
};

export default App;
