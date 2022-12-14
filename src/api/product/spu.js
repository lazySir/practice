import request from "@/utils/request";

//根据三级分类id获取spu列表
export const reqGetSpuListById = (
  page,
  limit,
  category1Id,
  category2Id,
  category3Id
) =>
  request({
    url: `/admin/product/spu/getListById/${page}/${limit}`,
    method: "post",
    data: {
      category1Id,
      category2Id,
      category3Id,
    },
  });

//根据三级分类id获取tradedeMark列表
export const reqGetBrandListByCategoryId = (
  category1Id,
  category2Id,
  category3Id
) =>
  request({
    url: `/admin/product/tradeMark/getByCategoryId/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });

//新增spu//或者修改spu
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    return request({
      url: "/admin/product/spu/updateSpu",
      method: "put",
      data: spuInfo,
    });
  } else {
    return request({
      url: "/admin/product/spu/add",
      method: "post",
      data: spuInfo,
    });
  }
};

//根据spu_img_id获取图片列表
export const reqGetSpuImageListBySpuId = (spuId) =>
  request({
    url: `/admin/product/spu/getSpuImgListBySpuId/${spuId}`,
    method: "get",
  });

//根据spu_sale_id获取sale列表
export const reqGetSpuSaleListBySpuId = (spuId) =>
  request({
    url: `/admin/product/spu/getSpuSaleListBySpuId/${spuId}`,
    method: "get",
  });
export const reqGetSpuSaleListBySpuId2 = (spuId) =>
  request({
    url: `/admin/product/spu/getSpuSaleListBySpuId2/${spuId}`,
    method: "get",
  });
//根据三级分类id获取attr列表
export const reqGetAttrListBycategoryId = (
  category1Id,
  category2Id,
  category3Id
) =>
  request({
    url: `/admin/product/attr/getListById/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });
//添加sku
export const reqAddSku = (skuInfo) =>
  request({
    url: "/admin/product/spu/addSku",
    method: "post",
    data: skuInfo,
  });

//根据id获取spuInfo
export const reqGetSpuInfoById = (spu_Id) =>
  request({
    url: `/admin/product/spu/getSpuInfoById/${spu_Id}`,
    method: "get",
  });

//根据spu_id获取sku列表
export const reqGetSkuListById = (spu_id) =>
  request({
    url: `/admin/product/spu/getSkuById/${spu_id}`,
    method: "get",
  });
//根据spu_id删除数据
export const reqDeleteSpuById = (spu_id) => 
  request({
    url: `/admin/product/spu/deleteById/${spu_id}`,
    method: "delete",
  });

