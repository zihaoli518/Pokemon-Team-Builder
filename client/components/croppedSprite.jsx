import React, { useState } from 'react';
import smartcrop from 'smartcrop';

function ImageComponent(props) {
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  const handleImageLoad = async (event) => {
    const { naturalWidth, naturalHeight } = event.target;
    const cropOptions = { width: props.maxWidth, height: props.maxHeight };
    const cropResult = await smartcrop(naturalWidth, naturalHeight, cropOptions);
    const { x, y, width: croppedWidth, height: croppedHeight } = cropResult.topCrop;
    const canvas = document.createElement('canvas');
    canvas.width = croppedWidth;
    canvas.height = croppedHeight;
    const context = canvas.getContext('2d');
    context.drawImage(event.target, x, y, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
    const croppedImageUrl = canvas.toDataURL();
    setCroppedImageUrl(croppedImageUrl);
    console.log(croppedImageUrl)
  };

  return (
    <img
      src={croppedImageUrl ? croppedImageUrl : props.src}
      alt={props.alt}
      onLoad={handleImageLoad}
      style={{ maxWidth: props.maxWidth, maxHeight: props.maxHeight }}
    />
  );
}

export default ImageComponent;
