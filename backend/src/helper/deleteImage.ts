import fs from 'fs/promises'

export const deleteImage = async (imagePath: string, distFolder: string) => {
  try {
    if (imagePath !== `public/images/${distFolder}/default.png`) {
      await fs.unlink(imagePath)
    }
  } catch (error) {
    throw error
  }
}
