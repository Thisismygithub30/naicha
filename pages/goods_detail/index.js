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
 * 点击收藏商品
 *  1 页面onshow的时候，加载缓存中的商品收藏的数据/或者通过网络请求去获取商品收藏数据
 *  2 判断当前商品是不是被收藏
 *    1 是 改变当前页面的图标
 *    2 不是 
 *  3 点击商品收藏按钮
 *    1 判断该商品是否存在于缓存数据中 或者服务器中
 *    2 已经存在 删除该商品
 *    3 没有存在 将商品添加到收藏数组中存入缓存 上传数据到服务器
 */
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    //商品是否被收藏
    isCollect:false
    // selectSize:[
    //   {id:1,name:'小杯'},
    //   {id:2,name:'中杯'},
    //   {id:3,name:'大杯'}
    // ],
    // selectIce:[
    //   {id:4,name:'少冰'},
    //   { id: 5, name: '常温'},
    //   { id: 6, name: '多冰'}
    // ],
    // selectSugger:[
    //   {id:7,name:'少糖'},
    //   { id: 8, name: '正常糖'},
    //   { id: 9, name: '多糖'}
    // ]
  },
  //商品对象
  GoodsInfo:{},

  //商品规格之杯型选择
  // handleselectSize:function(e){
  //   this.setData({
  //     Sid: e.currentTarget.dataset.index,
  //     Sindex: e.currentTarget.dataset.current,
  //   })
  // },
  // handleselectIce:function(e){
  //   this.setData({
  //     Iid: e.currentTarget.dataset.index,
  //     Iindex: e.currentTarget.dataset.current,
  //   })
  // },
  // handleselectSugger:function(e){
  //   this.setData({
  //     Suggerid: e.currentTarget.dataset.index,
  //     Suggerindex: e.currentTarget.dataset.current,
  //   })
  // },

  onShow: function () {
    let pages =  getCurrentPages();
    let currentpage=pages[pages.length-1];
    let options=currentpage.options;
    const {goods_id} = options;
    ///console.log(goods_id);
    this.getGoodsDetail(goods_id);



  },

  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const res=await request({url:"/goods/detail",data:{goods_id}});
    //console.log(goodsObj.data.message);
    this.GoodsInfo=res.data.message;
    console.log(this.GoodsInfo);
    //获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    //判断当前商品是否被收藏
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);

    this.setData({
      goodsObj:{
        goods_name:res.data.message.goods_name,
        goods_id:res.data.message.goods_id,
        goods_price:res.data.message.goods_price,
        /**iPhone部分机型不适配webp格式 临时更改为jpg */
        goods_introduce:res.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:res.data.message.pics,
        goods_s_logo:res.data.message.goods_small_logo

      },
      isCollect
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
  },
  //商品收藏点击事件
  handleCollect(){
    let isCollect=false;
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    //判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //当index！=-1 表示收藏过
    if(index!==-1){
      //能找到该商品，该商品已收藏在收藏夹了，删除该商品
      collect.splice(index,1);
      //修改图片变化
      isCollect=false;
      //弹窗提示
      wx.showToast({
        title: '取消收藏成功',
        icon: 'success',
        mask: true
      });
    }else{
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    //把数组存入缓存总
    wx.setStorageSync("collect", collect);
    //修改data中的属性
    this.setData({
      isCollect
    })

  },

  //点击 弹出层 选择规格
  //显示对话框
//  showModal() {
//   // 显示遮罩层
//     var animation = wx.createAnimation({
//       duration: 200,
//       timingFunction: "linear",
//       delay: 0
//     })
//     this.animation = animation;
//     animation.translateY(300).step();
//     this.setData({
//       animationData: animation.export(),
//       showModalStatus: true
//     })
//     setTimeout(function () {
//       animation.translateY(0).step();
//       this.setData({
//         animationData: animation.export()
//       })
//     }.bind(this), 200)
//   },
//   //隐藏对话框
//   hideModal() {
//     // 隐藏遮罩层
//     var animation = wx.createAnimation({
//     duration: 200,
//     timingFunction: "linear",
//     delay: 0
//     })
//     this.animation = animation
//     animation.translateY(300).step()
//     this.setData({
//     animationData: animation.export(),
//     })
//     setTimeout(function () {
//     animation.translateY(0).step()
//     this.setData({
//       animationData: animation.export(),
//       showModalStatus: false
//     })
//     }.bind(this), 200)
//  }

  

  
})