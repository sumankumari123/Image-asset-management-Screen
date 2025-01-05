import React, { useState, useRef } from "react";

import {
  Drawer,
  Button,
  IconButton,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { Masonry } from "@mui/lab";
import CropIcon from "@mui/icons-material/Crop";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import FlipIcon from "@mui/icons-material/Flip";
import UploadIcon from "@mui/icons-material/Upload";
import ReactCropper from "react-cropper";
import "cropperjs/dist/cropper.css"; // Import Cropper CSS

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editImage, setEditImage] = useState(null);

  const cropperRef = useRef(null);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setSelectedImage(imageData);
        setEditImage(imageData);
        setDrawerOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper; // Access the cropper instance
    if (cropper) {
      const croppedDataUrl = cropper.getCroppedCanvas().toDataURL(); // Get the cropped image data URL
      setEditImage(croppedDataUrl); // Update the state with the cropped image
    } else {
      console.error("Cropper instance is not available.");
    }
  };

  const handleRotate = () => {
    if (!editImage) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = editImage;

    image.onload = () => {
      canvas.width = image.height; // Swap width and height for rotation
      canvas.height = image.width;

      // Rotate the canvas context
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180); // Rotate 90 degrees clockwise
      ctx.drawImage(image, -image.width / 2, -image.height / 2);

      const rotatedDataUrl = canvas.toDataURL();
      setEditImage(rotatedDataUrl); // Update the image being edited
    };
  };

  const handleFlip = (direction) => {
    if (!editImage) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = editImage;

    image.onload = () => {
      // Set canvas dimensions to match the image
      canvas.width = image.width;
      canvas.height = image.height;

      // Apply flipping transformation
      ctx.save(); // Save the current state
      if (direction === "horizontal") {
        ctx.scale(-1, 1); // Flip horizontally
        ctx.drawImage(image, -canvas.width, 0);
      } else if (direction === "vertical") {
        ctx.scale(1, -1); // Flip vertically
        ctx.drawImage(image, 0, -canvas.height);
      }
      ctx.restore(); // Restore the original state

      // Get the flipped image as a data URL
      const flippedDataUrl = canvas.toDataURL();
      setEditImage(flippedDataUrl); // Update the edited image
    };
  };

  const handleReplace = () => {
    document.getElementById("image-upload-input").click();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add Assets Here
      </Typography>

      <Button
        variant="contained"
        component="label"
        startIcon={<UploadIcon />}
        sx={{ mb: 3 }}
      >
        Upload Image
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
      </Button>

      <Masonry columns={3} spacing={2} className="w-[70%] mx-auto">
        {images.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image}
            alt={`Uploaded ${index}`}
            sx={{ width: "100%", borderRadius: 2 }}
            onClick={() => {
              setSelectedImage(image); // Set the selected image for editing
              setEditImage(image); // Set the image to be edited
              setDrawerOpen(true); // Open the drawer
            }}
          />
        ))}
      </Masonry>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 400, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Image
          </Typography>

          {editImage && (
            <ReactCropper
              style={{ width: "100%", height: "200px" }}
              src={editImage}
              ref={cropperRef}
              guides={true}
              responsive={true}
              autoCropArea={1}
              initialAspectRatio={1}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              checkOrientation={false}
            />
          )}

          <Grid container spacing={2} className="my-8">
            <Grid item xs={6}>
              <Button
                variant="outlined"
                startIcon={<CropIcon />}
                onClick={handleCrop}
                fullWidth
              >
                Crop
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                startIcon={<RotateRightIcon />}
                onClick={handleRotate}
                fullWidth
              >
                Rotate
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                startIcon={<FlipIcon />}
                onClick={() => handleFlip("horizontal")}
                fullWidth
              >
                Flip Horizontal
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                startIcon={<FlipIcon />}
                onClick={() => handleFlip("vertical")}
                fullWidth
              >
                Flip Vertical
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleReplace} fullWidth>
                Replace Image
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!editImage || !selectedImage) return; // Ensure there are valid images
                  setImages((prevImages) => [
                    ...prevImages,
                    editImage,
                  ]);

          
                  setDrawerOpen(false); // Close the drawer
                  setSelectedImage(null); // Reset the selected image
                  setEditImage(null); // Reset the edit image
                }}
                fullWidth
              >
                Save
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditImage(selectedImage); // Reset to the original selected image
                  setDrawerOpen(false); // Close the drawer
                }}
                fullWidth
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ImageUploader;
