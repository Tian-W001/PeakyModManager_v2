# flip all images in the directory vertically
import os
from PIL import Image

def flip_images():
    # Loop through all files in the directory
    for filename in os.listdir('.'):
        
        if filename.endswith('.png') and not filename=="Unknown.png":
            file_path = os.path.join('.', filename)
            try:
                # Open the image file
                with Image.open(file_path) as img:
                    # Flip the image vertically
                    flipped_img = img.transpose(Image.FLIP_TOP_BOTTOM)
                    # Save the flipped image back to the same file
                    flipped_img.save(file_path)
                    print(f"Flipped image: {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")
if __name__ == "__main__":

    flip_images()