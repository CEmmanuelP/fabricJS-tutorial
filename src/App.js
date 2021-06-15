import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";

// 캡쳐 이미지는 세로 길이에 맞춤

const App = () => {
  const [canvas, setCanvas] = useState("");
  const [imgURL, setImgURL] = useState("");

  const canvasRef = useRef();

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  // canvas객체 생성
  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      height: 300,
      width: 500,
      backgroundColor: "pink",
    });

  const addImg = (e, url, canvi) => {
    e.preventDefault();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = function () {
      canvi.setBackgroundImage(img.src, canvi.renderAll.bind(canvi), {
        originX: "left",
        originY: "top",
        left: 0,
        top: 0,
        crossOrigin: "anonymous",
      });
    };
    // new fabric.Image.fromURL(url, (img) => {
    //   img.scale(0.75);
    //   canvi.add(img);
    //   canvi.renderAll();
    //   setImgURL("");
    // });
  };

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

      cutImage(canvas, square);

      canvas.renderAll();
    });
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

  const cutImage = (canvas, square) => {
    const image = canvas.toDataURL({
      format: "jpeg",
      left: square.left,
      top: square.top,
      width: square.width + 2,
      height: square.height + 2,
    });
    console.log(image);
  };

  const setVideoOnCanvas = (canvas) => {
    const videoEl = document.querySelector("#video");
    const video = new fabric.Image(videoEl, {
      left: 0,
      top: 0,
      width: 500,
      height: 300,
      angle: 0,
      originX: 0,
      originY: 0,
      objectCaching: true,
      statefullCache: true,
    });

    canvas.add(video);
    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  };

  const setVideo = (canvas) => {
    const video = document.querySelector("video");

    drawImage(canvas, video);
  };

  const drawImage = (canvas, video) => {
    canvas
      .getContext("2d", { alpha: false })
      .drawImage(video, 0, 0, canvas.width, canvas.height);
  };

  return (
    <div>
      <button onClick={() => setVideoOnCanvas(canvas)}>newSetVideo</button>
      <button onClick={() => setVideo(canvas)}>setVideo</button>
      <button onClick={() => createBoundary(canvas)}>Boundary</button>
      <br />
      <br />
      <form onSubmit={(e) => addImg(e, imgURL, canvas)}>
        <div>
          <input
            type="text"
            value={imgURL}
            onChange={(e) => setImgURL(e.target.value)}
          />
          <button type="submit">Add Image</button>
        </div>
      </form>

      <br />
      <br />
      <canvas id="canvas" ref={canvasRef} />
      <video
        id="video"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        width="500"
        height="300"
        controls
      />
    </div>
  );
};

export default App;
