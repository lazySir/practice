import request from "@/utils/request";

export const reqGetSkuList = (page, limit) =>
  request({
    url: `/admin/product/sku/getSkuList/${page}/${limit}`,
    method: "get",
  });
export const reqGetSkuById=(id)=>request({
  url:`/admin/product/sku/getSkuById/${id}`,
  method:'get'
})
//上架
export const reqShelves =(id)=>request({
  url: `/admin/product/sku/shelves/${id}`,
  method:'put'
})
//下架
export const reqTheShelves =(id)=>request({
  url: `/admin/product/sku/TheShelves/${id}`,
  method:'put'
})

//删除
export const reqDeleteSkuById=(id)=>request({
  url:`/admin/product/sku/deleteById/${id}`,
  method:'delete'
})