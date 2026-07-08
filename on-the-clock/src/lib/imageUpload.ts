const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_BYTES = 5 * 1024 * 1024
const MAX_EDGE = 512
const JPEG_QUALITY = 0.82

export type ImageValidationError = 'format' | 'size'

export function validateImage(file: File): ImageValidationError | null {
  if (!ALLOWED_TYPES.has(file.type)) return 'format'
  if (file.size > MAX_BYTES) return 'size'
  return null
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('image_load_failed'))
    }
    image.src = objectUrl
  })
}

/** Center-crop to square, then resize to maxEdge and return JPEG Blob. */
export async function compressImage(file: File): Promise<Blob> {
  const image = await loadImage(file)
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight)
  const sx = (image.naturalWidth - sourceSize) / 2
  const sy = (image.naturalHeight - sourceSize) / 2
  const edge = Math.min(MAX_EDGE, sourceSize)

  const canvas = document.createElement('canvas')
  canvas.width = edge
  canvas.height = edge
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas_unavailable')

  context.drawImage(image, sx, sy, sourceSize, sourceSize, 0, 0, edge, edge)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result)
        else reject(new Error('image_compress_failed'))
      },
      'image/jpeg',
      JPEG_QUALITY
    )
  })

  return blob
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('image_read_failed'))
    }
    reader.onerror = () => reject(new Error('image_read_failed'))
    reader.readAsDataURL(blob)
  })
}

/**
 * Validate → compress → return Base64 data URL for Firestore users/{userId}.photoURL.
 * userId is accepted for API symmetry / future Storage migration.
 */
export async function uploadProfileImage(file: File, _userId: string): Promise<string> {
  const validationError = validateImage(file)
  if (validationError === 'format') throw new Error('photo_format')
  if (validationError === 'size') throw new Error('photo_size')

  const compressed = await compressImage(file)
  const dataUrl = await blobToDataUrl(compressed)

  // Firestore single-field practical ceiling (~1MB). Base64 expands ~33%.
  if (dataUrl.length > 900_000) {
    throw new Error('photo_size')
  }

  return dataUrl
}
