import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const uploadImage = async (image) => {
  if (!image) {
    throw new Error("No image selected");
  }

  const formData = new FormData();
  formData.append("image", image);

  const response = await Axios({
    ...SummaryApi.uploadImage,
    data: formData,
  });

  if (!response?.data?.data?.url) {
    throw new Error("Upload failed - invalid response");
  }

  return response;
};

export default uploadImage;
