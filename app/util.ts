import { v5 as uuidv5 } from "uuid";

// You could define your own namespace UUID or use one provided
const MY_NAMESPACE = "f1b38080-213a-4307-bbb3-580e7f66f794";
const STORAGE_KEY = "device_identifier";

export const generateIdFromIp = async () => {
  // First check if we have a stored identifier
  const storedId = localStorage.getItem(STORAGE_KEY);
  if (storedId && storedId.length > 0) {
    return storedId;
  }

  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    const ip = data.ip;

    // This will consistently return the same UUID every time `ip` is the same
    const deterministicUuid = uuidv5(ip, MY_NAMESPACE);
    // Store the generated UUID for future use
    localStorage.setItem(STORAGE_KEY, deterministicUuid);
    return deterministicUuid;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    // Fallback to a random UUID if IP fetch fails
    const fallbackId = uuidv5(`${Date.now()}-fallback`, MY_NAMESPACE);
    localStorage.setItem(STORAGE_KEY, fallbackId);
    return fallbackId;
  }
};
