import http from '@/utils/http';

/**
 * 获取指定文献的阅读URL
 * @param {number} articleId - 文献ID
 * @returns {Promise<Object>} - 包含文献URL和更新时间的响应
 */
export function getArticleUrl(articleId) {
  return http.get('/article/readArticleByUrl', {
    params: {
      article_id: articleId,
    },
  });
}

/**
 * 阅读某篇文献，返回PDF文件本身 (旧接口，可能不再需要，但保留以供参考)
 * @param {number} articleId - 文献ID
 * @returns {Promise<Blob>} - PDF文件的Blob对象
 */
export function readArticleBlob(articleId) {
    return http.get("/article/readArticle", {
        params: {
            article_id: articleId,
        },
        responseType: "blob",
    });
}

// 可以根据 OpenAPI 文档添加更多与文献相关的 API 调用函数
// 例如：
// export function getSelfFolders(params) { ... }
// export function uploadToSelfFolder(folderId, articleFile) { ... }
