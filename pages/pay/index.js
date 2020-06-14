// pages/cart/index.js
/**
 * 1 页面加载的时候
 *    1 从缓存中获取购物车数据 渲染到页面中 checked为true的商品
 * 2 微信支付需要企业账户
 *    1 么有 无法操做
 * 3 支付按钮
 *    1 先判断缓存中有没有token
 *    2 没有 就跳转到授权页面 进行获取token
 *    3 有token就接着执行 从后台获取订单号的操作
 *    4 获取订单编号
 *    5 完成微信支付
 *    6 手动删除缓存中的 已经被选中的商品
 *    7 删除后的 购物车数组 填充回缓存中
 */

 import { showModal,showToast } from "../../utils/asyncWx.js";
 import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart:[],
    totalPrice:0,
    totalNum:0,
    hour:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //1 获取缓存中的物品信息
    let cart = wx.getStorageSync("cart")||[];
    //过滤后的购物车数组 拿取到checked为true的商品
    cart=cart.filter(v=>v.checked);
    //总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
    })
    //判断数组是否为空


    //获取当前时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var tomorrow_timetamp = timestamp + 15 * 60;
    var n = tomorrow_timetamp * 1000;
    var date = new Date(n);
   
    //时
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    //分
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let m_15m=h+":"+m;
    console.log(m_15m);
    
    this.setData({
      cart,
      totalPrice,
      totalNum,
      startTime:m_15m
    });
    
  },

  //点击支付
  async handleOrderPay(){
    try {
      //1 判断缓存总有没有token
      const token=wx.getStorageSync("token");
      //2 判断
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      const hour=this.data.hour;
      //console.log(hour);
      if(hour==-1){
        //console.log(hour);
        await showToast({title:"您还没有选择预定的时间"});
        return;
      }
      const sec=this.data.sec;
      //console.log("已经存在token")
      //3 创建订单
      //3.1准备 请求头参数
      //const header={Authorization:token};
      //3.2 准备请求体参数 order_price 总价格   goods 商品数组
      const order_price=this.data.totalPrice;
      const cart=this.data.cart;
      let goods=[];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price,
        goods_name:v.goods_name
      }))
      const orderParams={order_price,goods,token,hour,sec};
      console.log(orderParams);
      //4 发送请求 创建订单 获取订单编号  临时自定义，没有后台接口 用假的替代
      //const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams,header:header});
      //let {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams});
      let order_number='12314';
      var reqTask = wx.request({
        url: 'http://localhost:8080/TestMaven2/customer/order',
        data: {goods,token,hour,sec},
        success: (result)=>{
         console.log("成功发送请求！");
          console.log(result);
        }
        
      });
      if(!order_number){
        order_number=12345;
      }
      //console.log(order_number);
      //准备 发起预支付接口
      //const {pay}= await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
      //console.log(pay);
      /**微信支付
       * 调取微信支付API接口，不是企业id无法使用；
      wx.requestPayment({
        timeStamp: '',
        nonceStr: '',
        package: '',
        signType: '',
        paySign: '',
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      */
      //暂时没有后台数据，所以此处使用假数据代替
      //const res=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number},header:header});
      let {message}=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}});
      if(!message){
        message="支付成功";
      }
      //console.log(message);
      //手动删除缓存中已经支付的商品
      let newcart=wx.getStorageSync("cart");
      newcart=newcart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newcart);
      await showToast({title:"支付成功"});
      //跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });


    } catch (error) {
      await showToast({title:"支付失败"});
    }
  },
  //时间选择器
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e);
    let hAs=e.detail.value;
    let hs=hAs.split(":");
    console.log(hs);
    this.setData({
      time: e.detail.value,
      hour:hs[0],
      sec:hs[1]
    })
  },

  



  


  
})