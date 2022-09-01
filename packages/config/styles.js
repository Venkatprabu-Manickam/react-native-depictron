import {
  black,
  error,
  iconDark,
  placeholderTextColor,
  primary,
  primaryDark,
  starFillColor,
  success,
  textInputBorderColor,
  textPrimary,
  white,
} from './colors';

const fontFamily = 'system font';

export const defaultColors = {
  primary,
  textPrimary,
  primaryDark,
  error,
  iconDark,
  textInputBorderColor,
  placeholderTextColor,
  starFillColor,
  black,
  white,
  success,
};

export const defaultFonts = {
  defaultFontFamily: fontFamily,
};

export const defaultTheme = {
  // Labels
  label: {
    fontSize: 14,
    color: textPrimary,
  },
  // Error
  error: {
    fontSize: 12,
    color: error,
  },
  // Headers
  headers: {
    h1: {
      fontSize: 24,
      color: textPrimary,
      fontFamily,
    },
    h2: {
      fontSize: 20,
      color: textPrimary,
      fontFamily,
    },
    h3: {
      fontSize: 16,
      color: textPrimary,
      fontFamily,
    },
  },
  // Paragraph
  p: {
    fontSize: 16,
    color: textPrimary,
  },
  // Input
  input: {
    placeholderTextColor,
    iconColor: iconDark,
    style: {},
  },
  // Rating
  rating: {
    starFillColor,
    remarkStyle: {
      color: starFillColor,
      fontSize: 14,
    },
  },
  // Toggle
  toggle: {
    knobColor: primaryDark,
    tintColor: primary,
  },
  // Select
  select: {
    tagRemoveIconColor: error,
    tagBorderColor: textInputBorderColor,
    tagTextColor: primary,
    selectedItemTextColor: primary,
    selectedItemIconColor: primary,
    itemTextColor: textPrimary,
    submitButtonColor: success,
  },
  filepicker: {
    addButtonStyle: {
      fontSize: 14,
    },
  },
};

export const buildTheme = (userColors = {}, userFonts = {}, userTheme = {}) => {
  // Merge colors
  const mergedColors = {
    ...defaultColors,
    ...userColors,
  };
  // Merge fonts
  const mergedFonts = {
    ...defaultFonts,
    ...userFonts,
  };

  return {
    colors: mergedColors,
    fonts: mergedFonts,

    // Labels
    label: {
      fontSize: 14,
      color: mergedColors.textPrimary,
    },
    // Error
    error: {
      fontSize: 12,
      color: mergedColors.error,
    },
    /*
     * Component related theme
     * headers
     */
    headers: {
      h1: {
        fontSize: 28,
        color: mergedColors.textPrimary,
        fontFamily: mergedFonts.defaultFontFamily,
      },
      h2: {
        fontSize: 24,
        color: mergedColors.textPrimary,
        fontFamily: mergedFonts.defaultFontFamily,
      },
      h3: {
        fontSize: 20,
        color: mergedColors.textPrimary,
        fontFamily: mergedFonts.defaultFontFamily,
      },
    },
    // Paragraph
    p: {
      fontSize: 16,
      color: mergedColors.textPrimary,
    },
    // Input
    input: {
      placeholderTextColor: mergedColors.placeholderTextColor,
      iconColor: mergedColors.iconDark,
    },
    // Rating
    rating: {
      starFillColor: mergedColors.starFillColor,
      remarkStyle: {
        color: mergedColors.starFillColor,
        fontSize: 14,
      },
    },
    // Toggle
    toggle: {
      knobColor: mergedColors.primaryDark,
      tintColor: mergedColors.primary,
    },
    // Select
    select: {
      tagRemoveIconColor: mergedColors.error,
      tagBorderColor: mergedColors.primary,
      tagTextColor: mergedColors.primaryDark,
      selectedItemTextColor: mergedColors.primary,
      selectedItemIconColor: mergedColors.primary,
      itemTextColor: mergedColors.textPrimary,
      submitButtonColor: mergedColors.success,
    },
    filepicker: {
      addButtonStyle: {
        fontSize: 14,
      },
    },
  };
};

export default {};
