import { useEffect, useRef, useState } from "react";
import { Circle, Image, Layer, Stage, Text } from "react-konva";
import useImage from "use-image";
import { truncateText } from "../../common/utils/helper";
import Konva from "konva";

const MemeCanvas = () => {
  const [stageSize, setStageSize] = useState({
    width: 600,
    height: 500,
    scale: 1,
  });

  const [memeImage, setMemeImage] = useState<string | null>(null);
  const [topText, setTopText] = useState<string | null>("");
  const [bottomText, setBottomText] = useState<string | null>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<any>(null);

  const updateSize = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // Calculate available space considering the form elements
    const availableHeight = containerHeight - 200; // Reserve space for inputs
    const availableWidth = Math.min(containerWidth - 40, 600); // Cap at 600px and account for padding

    const scale = Math.min(availableWidth / 600, availableHeight / 500);

    setStageSize({
      width: 600,
      height: 500,
      scale: scale,
    });
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    console.log("bottomText", bottomText, textRef)
    const textNode = textRef.current;
    if (textNode) {
      console.log(textNode, 'textNode')
    }
  }, [textRef, bottomText])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(
      e.target.files,
      URL.createObjectURL(e?.target?.files?.[0] ?? new Blob())
    );
    setMemeImage(URL.createObjectURL(e?.target?.files?.[0] ?? new Blob()));
  };

  const URLImage = ({ src, ...rest }: { src: any; x?: number; y?: number }) => {
    const [image] = useImage(
      memeImage || "https://konvajs.org/assets/yoda.jpg",
      "anonymous"
    );

    if (!image) return null;

    // Calculate dimensions to fit the image properly
    const containerWidth = stageSize.width / stageSize.scale;
    const containerHeight = stageSize.height / stageSize.scale;

    // Calculate dimensions maintaining aspect ratio
    const imageRatio = image.width / image.height;
    const containerRatio = containerWidth / containerHeight;

    let scaledWidth, scaledHeight;
    if (imageRatio > containerRatio) {
      // Image is wider than container
      scaledWidth = containerWidth * 0.8; // 80% of container width
      scaledHeight = scaledWidth / imageRatio;
    } else {
      // Image is taller than container
      scaledHeight = containerHeight * 0.8; // 80% of container height
      scaledWidth = scaledHeight * imageRatio;
    }

    // Center the image
    const x = (containerWidth - scaledWidth) / 2;
    const y = (containerHeight - scaledHeight) / 4; // Keep the 1/4 position from top

    // Calculate text width based on image width
    const textWidth = scaledWidth;
    const textX = x;

    const calculateTextDimensions = (text: string, width: number, fontSize: number) => {
      // Create a temporary text node to measure
      const tempText = new Konva.Text({
        text: (truncateText(text || "", 45) || "").toUpperCase(),
        width: width,
        fontSize: fontSize,
        fontFamily: "Impact",
        align: "center"
      });
      
      return {
        textHeight: tempText.height(),
        textWidth: tempText.width(),
        lineHeight: tempText.lineHeight() * fontSize
      };
    };

    const bottomTextMetrics = calculateTextDimensions(
      bottomText || "",
      scaledWidth,
      Math.min(40, scaledWidth * 0.1)
    );

    // Use these metrics to calculate the position
    const bottomTextY = y + scaledHeight - bottomTextMetrics.textHeight - 40; // 20px margin

    return (
      <>
        <Image
          image={image}
          x={x}
          y={y}
          width={scaledWidth}
          height={scaledHeight}
          {...rest}
        />
        <Text
          text={(truncateText(topText || "", 45) || "").toUpperCase()}
          x={textX}
          y={y + 20}
          width={scaledWidth}
          align="center"
          fontSize={Math.min(40, scaledWidth * 0.1)}
          fontFamily="Impact"
          fill="white"
          stroke="black"
          strokeWidth={2}
          lineHeight={1.2}
        />

        <Text
          ref={textRef}
          text={(truncateText(bottomText || "", 45) || "").toUpperCase()}
          x={textX}
          y={bottomTextY}
          width={scaledWidth}
          align="center"
          fontSize={Math.min(40, scaledWidth * 0.1)}
          fontFamily="Impact"
          fill="white"
          stroke="black"
          strokeWidth={2}
          lineHeight={1.2}
        />
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        overflow: "hidden",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stage
          width={600}
          height={500}
          scaleX={stageSize.scale}
          scaleY={stageSize.scale}
          style={{
            display: "block",
            margin: "0 auto",
          }}
        >
          <Layer>
            <URLImage src="https://konvajs.org/assets/yoda.jpg" />
          </Layer>
        </Stage>
      </div>

      <div className="flex flex-col gap-2 w-full" style={{ maxWidth: "600px" }}>
        <input
          type="file"
          name="image"
          id="image"
          onChange={handleImageUpload}
          className="w-full"
        />
        <input
          type="text"
          className="meme-text border-2 border-gray-300 rounded-md p-2 w-full"
          placeholder="Top Text"
          value={topText || ""}
          onChange={(e) => setTopText(e.target.value)}
        />
        <input
          type="text"
          className="meme-text border-2 border-gray-300 rounded-md p-2 w-full"
          placeholder="Bottom Text"
          value={bottomText || ""}
          onChange={(e) => {
            setBottomText(e.target.value)
          }}
        />
      </div>
    </div>
  );
};

export default MemeCanvas;
