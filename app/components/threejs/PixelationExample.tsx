import React, { useState } from "react";
import NetworkGlobe from "./NetworkGlobe";

export default function PixelationExample() {
  const [pixelationFactor, setPixelationFactor] = useState(4.0);
  const [enableWobble, setEnableWobble] = useState(true);
  const [enableLoFiPixelation, setEnableLoFiPixelation] = useState(true);

  return (
    <div className="w-full h-screen relative">
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-10 bg-black/80 text-white p-4 rounded-lg space-y-3">
        <h3 className="text-lg font-bold text-green-400">
          Lo-Fi Pixelation Controls
        </h3>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={enableLoFiPixelation}
              onChange={(e) => setEnableLoFiPixelation(e.target.checked)}
              className="form-checkbox"
            />
            <span>Enable Lo-Fi Pixelation</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={enableWobble}
              onChange={(e) => setEnableWobble(e.target.checked)}
              className="form-checkbox"
            />
            <span>Enable Wobble Effect</span>
          </label>
        </div>

        <div>
          <label className="block text-sm">
            Pixelation Factor: {pixelationFactor.toFixed(1)}
          </label>
          <input
            type="range"
            min="1"
            max="8"
            step="0.5"
            value={pixelationFactor}
            onChange={(e) => setPixelationFactor(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-gray-400">
            Higher values = more pixelated
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-4">
          <p>🎮 Inspired by Three.js pixelated lo-fi energy techniques</p>
          <p>📝 Based on Napoleon Services Medium article</p>
        </div>
      </div>

      {/* Globe with Pixelation Effects */}
      <NetworkGlobe
        debug={false}
        nodeCount={100}
        glowColor="#00ff88"
        secondaryColor="#8844ff"
        pixelSize={3}
        enableRetroEffect={true}
        enableLoFiPixelation={enableLoFiPixelation}
        pixelationFactor={pixelationFactor}
        enableWobble={enableWobble}
      />
    </div>
  );
}
