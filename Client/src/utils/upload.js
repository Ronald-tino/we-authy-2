import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "lugshare"); // Your Cloudinary upload preset

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dzmrfifoq/image/upload", // Your Cloudinary cloud name
      data
    );
    return res.data.url;
  } catch (err) {
    console.log(err);
  }
};

export default upload;