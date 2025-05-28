import http from '@/utils/http'

/**
 * 上传图片
 * @param {File} image - 图片文件
 * @returns {Promise<{image_url: string}>} - 返回上传后的图片URL
 */
export const uploadImage = async (image) => {
  const formData = new FormData()
  formData.append('image', image)
  
  const response = await http.post('/public/image/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  
  return response.data
}