// pages/order/index.js
/**
 * 1 页面被打开的时候 onshow
 *  0 onshow 不同于onload 无法在形参上接收 options参数
 *    判断缓存中有没有token，如果有就直接用，没有就跳转到授权页面
 *  1 获取url上的参数order_type
 *      根据order_type值来决定页面标题数组元素 哪个被激活选中
 *  2 根据order_type去获取订单数据
 *  3 渲染页面
 * 2 点击不同的标题重新 发送请求 来获取和渲染数据
 */
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"已完成订单",
        isActive:false
      }
    ],
    orders:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /**
     * 1 获取当前小程序的页面栈 -数组 页面栈 长度最大是10页面
     * 2 数组中索引最大的页面就是当前页面
     */

    const token=wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    
    
    let curPages =  getCurrentPages();
    // console.log(curPages);
    let currentpage=curPages[curPages.length-1];
    //console.log(currentpage.options);
    let {order_type}=currentpage.options;

    this.changTitleByIndex(order_type-1);

    this.getOrders(order_type);
    
    
  },
  //获取订单列表的方法
  async getOrders(order_type){
    //假数据
   // const res=await request({url:"/my/orders/all",data:{order_type}});
    let res=await request({url:"/my/orders/all",data:{order_type}});
    if(!res.orders){
      res.orders=[
        {
          order_id:1104,
          user_id:23,
          order_number:"HU12345",
          order_price:1133,
          create_time:1579999999,
          update_time:1565616985
        },
        {
          order_id:1124,
          user_id:23,
          order_number:"HU12355",
          order_price:1133,
          create_time:1579999999,
          update_time:1565616985
        },
        {
          order_id:11874,
          user_id:23,
          order_number:"HU123555",
          order_price:1133,
          create_time:1579999999,
          update_time:1565616985
        }
      ];
    }
    //console.log(res.orders);
    
    this.setData({
      orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
    
  } , 

  //根据标题的索引，来激活选中标题数组
  changTitleByIndex(index){
    //修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

  handleTabsItemChange(e){
   //console.log(e);
    
    //获取被点击的标题索引
    const {index}=e.detail;
    this.changTitleByIndex(index);
    this.getOrders(index+1);
  }
})