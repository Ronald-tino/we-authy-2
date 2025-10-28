/**
 * Converts HTTP Cloudinary URLs to HTTPS
 * @param {string} url - The image URL
 * @returns {string} - HTTPS version of the URL
 */
export const fixCloudinaryUrl = (url) => {
  if (!url) return url;

  // If it's an HTTP Cloudinary URL, convert to HTTPS
  if (url.startsWith("http://res.cloudinary.com")) {
    return url.replace("http://", "https://");
  }

  return url;
};

export default fixCloudinaryUrl;
