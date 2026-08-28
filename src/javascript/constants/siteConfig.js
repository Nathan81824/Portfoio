// src/javascript/formatters.js

export function formatName(name) {
  if (!name) {
    return {
      original: "",
      lowercase: "",
      uppercase: "",
      capitalized: "",
    };
  }

  return {
    original: name,

    lowercase:
      name.toLowerCase(),

    uppercase:
      name.toUpperCase(),

    capitalized:
      name.charAt(0).toUpperCase() +
      name.slice(1).toLowerCase(),
  };
}