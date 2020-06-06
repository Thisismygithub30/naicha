// pages/goods_detail/index.js
/**
 * 发送请求数据
 * 点击轮播图预览大图功能
 *  1 给轮播图绑定点击事件
 *  2 调用小程序的API  previewImage
 * 点击加入购物车
 *  1 绑定点击事件
 *  2 获取缓存中的购物车数据 数组格式
 *  3 先判断当前商品是否已经存在于购物车
 *  4 已经存在 改变商品数据 购物车数量++ 重新把购物车数组填充回缓存中
 *  5 不存在购物车的数组中，直接给购物车数组添加一个新元素 新元素 带上购买数量的属性填充回购物车数组
 *  6 弹出提示
 */
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  //商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options;
    console.log(goods_id);
    this.getGoodsDetail(goods_id);
  },

  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const res=await request({url:"/goods/detail",data:{goods_id}});
    //console.log(goodsObj.data.message);
    this.GoodsInfo=res.data.message;
    this.setData({
      goodsObj:{
        goods_name:res.data.message.goods_name,
        goods_id:res.data.message.goods_id,
        goods_price:res.data.message.goods_price,
        /**iPhone部分机型不适配webp格式 临时更改为jpg */
        goods_introduce:res.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:res.data.message.pics

      }
    })
  },

  //点击轮播图 放大预览
  handlePreviewImage(e){
    // console.log("预览");
    //先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    //接收传递过的url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current:current, // 当前显示图片的http链接
      urls:urls// 需要预览的图片http链接列表
    })
  },

  handleCartAdd(){
    // 1 先获取缓存中的数组
    let cart = wx.getStorageSync("cart")||[];
    // 2 判断商品对象是否存在于购物车当中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      // 不存在 第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      cart[index].num++;
      //已经存在购物车数组中 执行num++
    }
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '添加购物车成功',
      icon: 'success',
      mask: true
    });
  }

  
})