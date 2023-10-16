import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./App.css";
import Header from "./Header";

function App() {
  const downloadImage = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = resizedSrc;
    downloadLink.download = "resized-image.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const [fileUploaded, setFileUploaded] = useState(false);
  const [resizedSrc, setResizedSrc] = useState(null);
  const [file, setFile] = useState(null);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    const reader = new FileReader();
    setFileUploaded(true);
    setFile(uploadedFile);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleResize = () => {
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      const aspectRatio = image.width / image.height;
      let newWidth = width ? parseInt(width) : image.width;
      let newHeight = height ? parseInt(height) : image.height;

      if (width && !height) {
        newHeight = newWidth / aspectRatio;
      } else if (!width && height) {
        newWidth = newHeight * aspectRatio;
      }

      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
      setResizedSrc(canvas.toDataURL());
    };
  };

  return (
    <>
      <Header />
      <div className="App">
        <div className="gray" {...getRootProps()}>
          <input {...getInputProps()} />
          {fileUploaded ? (
            <p>
              File uploaded <span>✔️</span>
            </p>
          ) : (
            <p>Drag & drop an image here, or click to select one</p>
          )}
        </div>
        <div>
          <input
            className="input"
            type="number"
            placeholder="Width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
          px
          <input
            className="input"
            type="number"
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <span>px</span>
        </div>
        <div className="button-wrap">
          <button className="button" onClick={handleResize}>
            Resize
          </button>
          {resizedSrc && (
            <div>
              <button className="button" onClick={downloadImage}>
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
