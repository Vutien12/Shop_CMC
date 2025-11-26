import api from './axiosInstance'

/**
 * Upload a file
 * @param {File} file - The file to upload
 * @param {Object} request - The file metadata
 * @returns {Promise}
 */
export const uploadFile = async (file, request) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' }),
  )

  const response = await api.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * Search files with pagination and sorting
 * @param {Object} params - Search parameters
 * @returns {Promise}
 */
export const searchFiles = async (params = {}) => {
  const { page = 0, size = 10, sort = 'createdAt,desc', search = '' } = params

  const response = await api.get('/files/search', {
    params: {
      page,
      size,
      sort,
      ...(search && { search }),
    },
  })
  return response.data
}

/**
 * Delete a file by ID
 * @param {number} id - The file ID
 * @returns {Promise}
 */
export const deleteFile = async (id) => {
  const response = await api.delete(`/files/${id}`)
  return response.data
}

/**
 * Delete multiple files by IDs
 * @param {number[]} ids - Array of file IDs
 * @returns {Promise}
 */
export const deleteFiles = async (ids) => {
  const deletePromises = ids.map((id) => deleteFile(id))
  return Promise.all(deletePromises)
}

/**
 * Attach a file to an entity (blog, product, brand, etc.)
 * @param {Object} entityFileData - Entity file data
 * @param {number} entityFileData.fileId - The file ID
 * @param {number} entityFileData.entityId - The entity ID (blog ID, product ID, etc.)
 * @param {string} entityFileData.entityType - The entity type (e.g., 'blog', 'product', 'brand')
 * @param {string} entityFileData.zone - The zone/purpose (e.g., 'thumbnail', 'logo', 'gallery')
 * @returns {Promise}
 */
export const attachFileToEntity = async (entityFileData) => {
  const response = await api.post('/entity-files', entityFileData)
  return response.data
}

