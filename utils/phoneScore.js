export default function ratePhone(specs) {
  console.log("Rate phone called.");

  const phoneRatingConfig = {
    Display: {
      weight: 0.2,
      weights: {
        screenBrightness: 0.2,
        pixelDensity: 0.25,
        displayType: 0.25,
        colorAccuracy: 0.1,
        refreshRate: 0.1,
        screenResolution: 0.1, // Added screenResolution field
      },
      normalization: {
        screenBrightness: { min: 500, max: 6000, invert: false },
        pixelDensity: { min: 200, max: 500, invert: false },
        displayType: { values: { LCD: 50, OLED: 80, AMOLED: 100 } },
        colorAccuracy: { min: 80, max: 100, invert: false },
        refreshRate: { min: 60, max: 120, invert: false },
        screenResolution: { min: 921600, max: 6000000, invert: false }, // Normalize total pixels (HD to 4K)
      },
    },
    Camera: {
      weight: 0.25,
      weights: {
        mainCameraMP: 0.15,
        mainCameraAperture: 0.2,
        mainCameraSensorSize: 0.15,
        mainCameraOIS: 0.1,
        mainCameraVideoQuality: 0.15,
        mainCameraHDRSupport: 0.05,
        ultraWideMP: 0.05,
        ultraWideAperture: 0.05,
        telephotoMP: 0.05,
        telephotoAperture: 0.05,
        telephotoZoom: 0.05,
        frontCameraMP: 0.05,
        frontCameraAperture: 0.05,
      },
      normalization: {
        mainCameraMP: { min: 12, max: 200, invert: false },
        mainCameraAperture: { min: 1.4, max: 2.8, invert: true },
        mainCameraSensorSize: { min: 0.751,max: 1,invert: true },
        mainCameraOIS: { values: { true: 100, false: 0 } },
        mainCameraVideoQuality: {
          values: { "4K30fps": 70, "4K60fps": 90, "8K": 100 },
        },
        mainCameraHDRSupport: { values: { true: 100, false: 0 } },
        ultraWideMP: { min: 8, max: 50, invert: false },
        ultraWideAperture: { min: 1.8, max: 2.8, invert: true },
        telephotoMP: { min: 8, max: 50, invert: false },
        telephotoAperture: { min: 2.0, max: 3.5, invert: true },
        telephotoZoom: { min: 2, max: 10, invert: false },
        frontCameraMP: { min: 8, max: 40, invert: false },
        frontCameraAperture: { min: 1.8, max: 2.8, invert: true },
      },
    },
    Performance: {
      weight: 0.2,
      weights: {
        GeekbenchSingle: 0.2,
        GeekbenchMulti: 0.2,
        AnTuTu: 0.4,
        storageSpeed: 0.2,
      },
      normalization: {
        GeekbenchSingle: { min: 500, max: 2000, invert: false },
        GeekbenchMulti: { min: 1000, max: 7000, invert: false },
        AnTuTu: { min: 300000, max: 1200000, invert: false },
        storageSpeed: { values: { "UFS 3.1": 75, "UFS 4.0": 100 } },
      },
    },
    RAM: {
      weight: 0.1,
      weights: {
        ramCapacity: 0.6,
        ramType: 0.4,
      },
      normalization: {
        ramCapacity: { min: 6, max: 32, invert: false },
        ramType: { values: { LPDDR4: 40, LPDDR4X:60,LPDDR5: 80, LPDDR5X:100} },
      },
    },
    Battery: {
      weight: 0.15,
      weights: {
        batteryCapacity: 0.5,
        chargingSpeed: 0.5,
      },
      normalization: {
        batteryCapacity: { min: 3000, max: 6000, invert: false },
        chargingSpeed: { min: 18, max: 120, invert: false },
      },
    },
    Durability: {
      weight: 0.1,
      weights: {
        screenProtectionScore: 0.5,
        ipRating: 0.5,
      },
      normalization: {
        screenProtectionScore: { min: 50, max: 150, invert: false },
        ipRating: { values: { IP67: 80, IP68: 100 } },
      },
    },
    Audio: {
      weight: 0.05,
      weights: {
        stereoSpeakers: 0.6,
        dolbyAtmos: 0.4,
      },
      normalization: {
        stereoSpeakers: { values: { true: 100, false: 50 } },
        dolbyAtmos: { values: { true: 100, false: 0 } },
      },
    },                          
  };

  function normalizeValue(value, config) {
    if (value === "NA") {
      return 0; // Return 0 if value is "NA"
    }

    if ("min" in config && "max" in config) {
      const { min, max, invert } = config;
      let normalized = (value - min) / (max - min);
      if (invert) {
        normalized = 1 - normalized;
      }
      return Math.max(0, Math.min(100, normalized * 100));
    } else if ("values" in config) {
      return config.values[value] || 0;
    }
    return 0;
  }

  let totalScore = 0;

  for (const [category, details] of Object.entries(phoneRatingConfig)) {
    let categoryScore = 0;

    for (const [spec, weight] of Object.entries(details.weights)) {
      const value = specs[spec];
      if (value !== undefined) {
        const normalizedScore = normalizeValue(
          value,
          details.normalization[spec]
        );
        categoryScore += normalizedScore * weight;
      }
    }
    totalScore += (categoryScore / 100) * details.weight * 100;
  }

  return Math.min(100, Math.round(totalScore * 100) / 100);
}
