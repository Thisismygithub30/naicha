// pages/goods_list/index.js
/**
 * 用户上滑页面 滚动条触底加载下一页页面
 *  找到滚动条触底事件
 *  判断还有没有下一页数据，弹出一个提示
 *    获取总页数 总条数
 *    获取到当前的页码  pagenum
 *    判断当前页码是否为大于等于总页数 总页数=math.ceil（总条数/pagesize）
 *      表示没有下一页
 *      
 *  假如没有就弹出一个提示
 *  假如有就加载下一页数据
 *      当前页码++
 *      重新发送请求
 *      数据请求回来 要对data中的数组进行拼接 不是替换
 * 
 * 下拉刷新页面
 *   触发下拉刷新事件 在json中配置允许下拉
 *      找到触发下拉刷新的事件 
 *   重置 数据 数组
 *   重置页码 设置为1
 *   重新发送请求
 * 请求回来之后要手动关闭刷新效果
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
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }

    ],
    goodsList:[]
  },
  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    this.QueryParams.cid = options.cid;
    this.getGoodsList();

    wx.showLoading({
      title: '加载中',
    })
    
    setTimeout(function () {
      wx.hideLoading()
    }, 3000)

  },
  //页面上滑滚动条触底事件
  onReachBottom(){
    //console.log("onReachBottom");
    // 判断还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      //表示没有下一页
      wx.showToast({
        title: '没有下一页数据了'
      });
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    //console.log("刷新");
    //重置数组
    this.setData({
      goodsList:[]
    })
    //重置页码
    this.QueryParams.pagenum=1;
    //重新发送请求
    this.getGoodsList();
    },


  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams});
    //获取总条数
    const total = res.data.message.total;
    //console.log(total);
    // //计算总页数
    this.totalPages=Math.ceil( total / this.QueryParams.pagesize);
    //console.log(this.totalPages);
    //console.log(Math.ceil( total / this.QueryParams.pagesize));
    //console.log(res);
    this.setData({
      //拼接数组
      goodsList:[...this.data.goodsList,...res.data.message.goods]
    })
    //关闭下拉刷新窗口
    wx.stopPullDownRefresh();
  },


  handleTabsItemChange(e){
    //获取被点击的标题索引
    const {index}=e.detail;
    //修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  }
})