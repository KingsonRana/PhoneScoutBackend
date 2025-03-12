const requiredFields = [
    "screenBrightness",
    "pixelDensity",
    "displayType",
    "colorAccuracy",
    "refreshRate",
    "screenResolution",
    "mainCameraMP",
    "mainCameraAperture",
    "mainCameraSensorSize",
    "mainCameraOIS",
    "mainCameraVideoQuality",
    "mainCameraHDRSupport",
    "ultraWideMP",
    "ultraWideAperture",
    "telephotoMP",
    "telephotoAperture",
    "telephotoZoom",
    "frontCameraMP",
    "frontCameraAperture",
    "GeekbenchSingle",
    "GeekbenchMulti",
    "AnTuTu",
    "storageSpeed",
    "ramCapacity",
    "ramType",
    "batteryCapacity",
    "chargingSpeed",
    "screenProtectionScore",
    "ipRating",
    "stereoSpeakers",
    "dolbyAtmos",
  ];
  
  const validationRules = {
    screenBrightness: (value) => value === "NA" || (value >= 500 && value <= 6000),
    displayType: (value) => ["LCD", "OLED", "AMOLED"].includes(value) || value === "NA",
    pixelDensity: (value) => value === "NA" || (value >= 200 && value <= 600),
    refreshRate: (value) => value === "NA" || (value >= 120 && value <= 480),
    colorAccuracy: (value) => value === "NA" || (value >= 80 && value <= 100),
    mainCameraMP: (value) => value === "NA" || (value >= 8 && value <= 200),
    mainCameraAperture: (value) => value === "NA" || (value >= 1.2 && value <= 4.0),
    ultraWideMP: (value) => value === "NA" || (value >= 8 && value <= 50),
    ultraWideAperture: (value) => value === "NA" || (value >= 1.2 && value <= 4.0),
    telephotoMP: (value) => value === "NA" || (value >= 8 && value <= 50),
    telephotoAperture: (value) => value === "NA" || (value >= 1.2 && value <= 4.0),
    telephotoZoom: (value) => value === "NA" || (value >= 2 && value <= 10),
    GeekbenchSingle: (value) => value === "NA" || (value >= 500 && value <= 2000),
    GeekbenchMulti: (value) => value === "NA" || (value >= 1000 && value <= 8000),
    AnTuTu: (value) => value === "NA" || (value >= 300000 && value <= 1200000),
    storageSpeed: (value) => ["UFS 3.1", "UFS 4.0", "NA"].includes(value),
    batteryCapacity: (value) => value === "NA" || (value >= 3000 && value <= 6000),
    chargingSpeed: (value) => value === "NA" || (value >= 10 && value <= 120),
    ipRating: (value) => ["IP67", "IP68", "NA"].includes(value),
    stereoSpeakers: (value) => [true, false, "NA"].includes(value),
    dolbyAtmos: (value) => [true, false, "NA"].includes(value),
    ram: (value) => value === "NA" || (value >= 6 && value <= 32),
    screenResolution: (value) => value === "NA" || (value >= 921600 && value <= 6000000), // E.g., "1080x2400"
    mainCameraSensorSize: (value) => value === "NA" || (value >= 0.751 && value <= 1), // Updated to include min and max sensor sizes
    mainCameraOIS: (value) => [true, false, "NA"].includes(value),
    mainCameraVideoQuality: (value) => ["4K30fps", "4K60fps", "8K", "NA"].includes(value),
    mainCameraHDRSupport: (value) => [true, false, "NA"].includes(value),
    frontCameraMP: (value) => value === "NA" || (value >= 8 && value <= 50),
    frontCameraAperture: (value) => value === "NA" || (value >= 1.2 && value <= 4.0),
    ramCapacity: (value) => value === "NA" || (value >= 6 && value <= 32),
    ramType: (value) => ["LPDDR4", "LPDDR5", "NA"].includes(value),
    screenProtectionScore: (value) => value === "NA" || (value >= 50 && value <= 150), // Assuming a numeric score
  };
  
  export const validateSpecs = (specs) => {
    const errors = [];
  
    // Check for extra fields that are not in the requiredFields list
    Object.keys(specs).forEach((field) => {
      if (!requiredFields.includes(field)) {
        console.error(`Field ${field} is not part of the required fields.`);
      }
    });
  
    requiredFields.forEach((field) => {
      const value = specs[field];
  
      // Check if the field exists and has a valid value
      if (value === undefined) {
        errors.push(`${field} is required.`);
      } else if (!(field in validationRules)) {
        console.error(`Validation rule for ${field} is missing.`);
      } else if (!validationRules[field](value)) {
        errors.push(`Invalid value for ${field}: ${value}`);
      }
    });
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  export const validateParameter = (parameter) => {
    const { name, weight, hasArrayValue, hasNumericalValue, arrayValues, numericValues } = parameter;
  
    // Validate required fields
    if (!name || !weight) {
      return false;
    }
  
    // Ensure hasArrayValue and hasNumericalValue are not both true
    if (hasArrayValue && hasNumericalValue) {
      return false;
    }
  
    // Validate `hasArrayValue` logic
    if (hasArrayValue) {
      if (
        !Array.isArray(arrayValues) || // Ensure `arrayValues` is an array
        arrayValues.length === 0 ||   // Ensure `arrayValues` is not empty
        numericValues?.min !== undefined // Ensure `numericValues.min` is not defined
      ) {
        return false;
      }
    }else if (hasNumericalValue) {
      if (
        !numericValues || // Ensure `numericValues` exists
        numericValues.min === undefined || // Ensure `min` is defined
        numericValues.max === undefined || // Ensure `max` is defined
        (arrayValues && arrayValues.length > 0) // Ensure `arrayValues` is empty
      ) {
        return false;
      }
    }
  
    // Return true if all validations pass
    return true;
  };
  