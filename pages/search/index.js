// pages/search/index.js
/**
 * 1 输入框绑定事件 值改变事件 input事件
 *  1 获取到输入框的值
 *  2 合法性判断 判空
 *  3 检验通过 把输入框的值发送到后台
 *  4 返回的数据打印到页面上
 * 2 防抖（防止抖动） 通过定时器来实现  节流
  *  0 防抖 一般是在输入框中，防止重复输入导致重复发送请求
  *  1 节流 一般是用在页面下拉和上拉
 *  1 定义一个全局的定时器id
 * 
 */

 import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    //取消的按钮是否显示
    isFocus:false,
    //输入框的值
    inputValue:""
  },
  //定时器id
  TimeId:-1,

  //输入框的值改变就会触发的事件
  handleInput(e){
    // console.log(e);
    //1 获取输入框的值
    const {value}=e.detail;
    //2 监测合法性
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      });
      //值不合法
      return;
    }

    this.setData({
      isFocus:true
    });
    //3 准备发送请求获取数据
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.qsearch(value);
    }, 1000);

    

    
  },

  //发送请求 获取搜索建议数据
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}});
    console.log(res.data.message);
    this.setData({
      goods:res.data.message
    })
    
  },

  //点击取消按钮
  handleCancel(e){
    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[]
    });
  }

})