import { GlobeSettings } from "./globeConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { IoIosWarning } from "react-icons/io";
import { MdOutlineAvTimer } from "react-icons/md";
import { MdTornado } from "react-icons/md";
import { TbRulerMeasure2 } from "react-icons/tb";
import { FaRegLightbulb } from "react-icons/fa";
import {
  IoChevronBack,
  IoChevronForward,
  IoSparklesSharp,
} from "react-icons/io5";
import { FaWaveSquare } from "react-icons/fa6";
import { TbGeometry } from "react-icons/tb";
import { useState } from "react";

interface GlobeControlsPanelProps {
  settings: GlobeSettings;
  hasUnsavedChanges: boolean;
  updateSetting: <K extends keyof GlobeSettings>(
    key: K,
    value: GlobeSettings[K]
  ) => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export default function GlobeControlsPanel({
  settings,
  hasUnsavedChanges,
  updateSetting,
  onSave,
  onCancel,
  onReset,
}: GlobeControlsPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`fixed right-4 top-4 bg-background_alt flex flex-col gap-2 text-primary p-4 rounded-lg z-50 ${collapsed ? "w-auto" : "max-h-[90vh] overflow-y-auto w-80"}`}
    >
      {/* Header with collapse button */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold">Settings</h3>
        <Button
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className="h-10 w-10"
        >
          {collapsed ? <IoChevronForward /> : <IoChevronBack />}
        </Button>
      </div>

      {/* Only show content when not collapsed */}
      {!collapsed && (
        <>
          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <Button onClick={onSave} className="bg-accent text-primary">
              Save
            </Button>
            <Button variant="destructive" onClick={onCancel} className="">
              Cancel
            </Button>
            <Button variant="outline" onClick={onReset} className="">
              Reset
            </Button>
          </div>

          {hasUnsavedChanges && (
            <div className=" border border-warning rounded p-2 mb-4 text-sm flex items-center gap-2">
              <IoIosWarning className="text-warning" />
              <span>Unsaved changes</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Animation Settings */}
            <div>
              <div className="flex items-center gap-2">
                <MdOutlineAvTimer className="text-primary" />
                <p className="font-semibold"> Animation</p>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Time Frequency</Label>
                  <Input
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    value={settings.timeFrequency}
                    onChange={(e) =>
                      updateSetting("timeFrequency", parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.timeFrequency}
                  </span>
                </div>
              </div>
            </div>

            {/* Distortion Settings */}
            <div>
              <div className="flex items-center gap-2">
                <MdTornado className="text-primary" />
                <p className="font-semibold"> Distortion</p>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Frequency</Label>
                  <Input
                    type="range"
                    min="0"
                    max="10"
                    step="0.001"
                    value={settings.distortionFrequency}
                    onChange={(e) =>
                      updateSetting(
                        "distortionFrequency",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.distortionFrequency}
                  </span>
                </div>
                <div>
                  <Label className="text-xs">Strength</Label>
                  <Input
                    type="range"
                    min="0"
                    max="10"
                    step="0.001"
                    value={settings.distortionStrength}
                    onChange={(e) =>
                      updateSetting(
                        "distortionStrength",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.distortionStrength}
                  </span>
                </div>
              </div>
            </div>

            {/* Displacement Settings */}
            <div>
              <div className="flex items-center gap-2">
                <TbRulerMeasure2 className="text-primary" />
                <p className="font-semibold"> Displacement</p>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Frequency</Label>
                  <Input
                    type="range"
                    min="0"
                    max="5"
                    step="0.001"
                    value={settings.displacementFrequency}
                    onChange={(e) =>
                      updateSetting(
                        "displacementFrequency",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.displacementFrequency}
                  </span>
                </div>
                <div>
                  <Label className="text-xs">Strength</Label>
                  <Input
                    type="range"
                    min="0"
                    max="1"
                    step="0.001"
                    value={settings.displacementStrength}
                    onChange={(e) =>
                      updateSetting(
                        "displacementStrength",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.displacementStrength}
                  </span>
                </div>
              </div>
            </div>

            {/* Lighting Settings */}
            <div>
              <div className="flex items-center gap-2">
                <FaRegLightbulb className="text-primary" />
                <p className="font-semibold"> Lighting</p>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Light A Color</Label>
                  <Input
                    type="color"
                    value={settings.lightAColor}
                    onChange={(e) =>
                      updateSetting("lightAColor", e.target.value)
                    }
                    className="w-full h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Light A Intensity</Label>
                  <Input
                    type="range"
                    min="0"
                    max="10"
                    step="0.001"
                    value={settings.lightAIntensity}
                    onChange={(e) =>
                      updateSetting(
                        "lightAIntensity",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.lightAIntensity}
                  </span>
                </div>
                <div>
                  <Label className="text-xs">Light B Color</Label>
                  <Input
                    type="color"
                    value={settings.lightBColor}
                    onChange={(e) =>
                      updateSetting("lightBColor", e.target.value)
                    }
                    className="w-full h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Light B Intensity</Label>
                  <Input
                    type="range"
                    min="0"
                    max="10"
                    step="0.001"
                    value={settings.lightBIntensity}
                    onChange={(e) =>
                      updateSetting(
                        "lightBIntensity",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.lightBIntensity}
                  </span>
                </div>
              </div>
            </div>

            {/* Fresnel Settings */}
            <div>
              <div className="flex items-center gap-2">
                <IoSparklesSharp className="text-primary" />
                <p className="font-semibold"> Fresnel</p>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Offset</Label>
                  <Input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.001"
                    value={settings.fresnelOffset}
                    onChange={(e) =>
                      updateSetting("fresnelOffset", parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.fresnelOffset}
                  </span>
                </div>
                <div>
                  <Label className="text-xs">Multiplier</Label>
                  <Input
                    type="range"
                    min="0"
                    max="5"
                    step="0.001"
                    value={settings.fresnelMultiplier}
                    onChange={(e) =>
                      updateSetting(
                        "fresnelMultiplier",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.fresnelMultiplier}
                  </span>
                </div>
                <div>
                  <Label className="text-xs">Power</Label>
                  <Input
                    type="range"
                    min="0"
                    max="15"
                    step="0.001"
                    value={settings.fresnelPower}
                    onChange={(e) =>
                      updateSetting("fresnelPower", parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.fresnelPower}
                  </span>
                </div>
              </div>
            </div>

            {/* Noise Settings */}
            <div>
              <div className="flex items-center gap-2">
                <FaWaveSquare className="text-primary" />
                <p className="font-semibold"> Noise</p>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Strength</Label>
                  <Input
                    type="range"
                    min="0"
                    max="10"
                    step="0.01"
                    value={settings.noiseStrength}
                    onChange={(e) =>
                      updateSetting("noiseStrength", parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.noiseStrength}
                  </span>
                </div>
                <div>
                  <Label className="text-xs">Frequency</Label>
                  <Input
                    type="range"
                    min="0"
                    max="5"
                    step="0.01"
                    value={settings.noiseFrequency}
                    onChange={(e) =>
                      updateSetting(
                        "noiseFrequency",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.noiseFrequency}
                  </span>
                </div>
              </div>
            </div>

            {/* Geometry Settings */}
            <div>
              <div className="flex items-center gap-2">
                <TbGeometry className="text-primary" />
                <p className="font-semibold"> Geometry</p>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Subdivision X</Label>
                  <Input
                    type="range"
                    min="1"
                    max="1024"
                    step="1"
                    value={settings.subdivisionX}
                    onChange={(e) =>
                      updateSetting("subdivisionX", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.subdivisionX}
                  </span>
                </div>
                <div>
                  <Label className="text-xs">Subdivision Y</Label>
                  <Input
                    type="range"
                    min="1"
                    max="1024"
                    step="1"
                    value={settings.subdivisionY}
                    onChange={(e) =>
                      updateSetting("subdivisionY", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-300">
                    {settings.subdivisionY}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
