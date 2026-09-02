/**
 * Client-side Image Compression Utility
 * Resizes huge smartphone camera photos (5-15MB) down to optimized Web standards (150-300KB)
 * using the HTML5 Canvas API without any external dependencies.
 */
export async function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.82
): Promise<File> {
  // If not an image, return original file
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let { width, height } = img;

        // Calculate proportional downscaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // Fallback to original
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with standard 82% quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Create compressed file keeping the base name but with .jpg extension
            const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
            const compressedFile = new File([blob], `${baseName}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // Fallback on image load error
      };
    };

    reader.onerror = () => {
      resolve(file); // Fallback on reader error
    };
  });
}
