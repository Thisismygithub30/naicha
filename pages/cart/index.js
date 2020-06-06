// pages/cart/index.js
/**
 * 1 onshow
 *    0 回到商品详情页面手动添加 checked 为true
 *    1 获取缓存中的购物车数组
 *    2 把购物车数据 填充到data中
 * 2 全选的实现 数据的展示
 *    1 onshow 获取缓存中的数据
 *    2 根据购物车中的商品数据进行计算
 *      1当购物车所有商品都被选中时，全选按钮应该被选中
 * 3 总价格和总数量
 *    1 都需要商品被选中，才能用来计算
 *    2 获取购物车数组
 *    3 遍历
 *    4 判断商品是否被选中
 *    5 总价格+=商品的单价*数量
 *    6 总数量+=商品数量
 *    7 把计算后的价格和数量 设置回data中
 * 4 商品的选中
 *    1 绑定change事件
 *    2 获取到被修改的商品对象
 *    3 商品对象的选中状态取反
 *    4 重新填充回data中和缓存中
 *    5 重新计算全选，总价格 总数量
 * 5 全选和反选
 *    1 全选复选框绑定事件 change
 *    2 获取 data 中的全选变量 allchecked
 *    3 直接取反allchecked
 *    4 遍历购物车数组 让里面的商品选中状态跟随 all checked改变而改变
 *    5 把购物车数组 和allchecked 重新设置回data 把购物车数据重新设置回缓存中
 * 6 商品数量的编辑功能
 *    1 "+","-"按钮 绑定一个点击事件，区分的关键 自定义属性
 *      1 "+" "+1"
 *      2 "-" "-1"
 *    2 传递被点击的商品id goods_id
 *    3 获取data中的购物车数组，来获取需要被修改的商品对象
 *    4 直接修改商品对象的数量 num
 *    5 把cart数组 重新填入data和缓存中 this.setCart(cart);
 * 7 点击结算
 *    1 判读用户有没有选购商品
 *    2 弹窗提示
 *    3 跳转到支付页面
 */

 import { showModal,showToast } from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart:[],
    allchecked:false,
    totalPrice:0,
    totalNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },



  //商品的选中
  handleItemChange(e){
    //获取被修改的商品id
    const goods_id=e.currentTarget.dataset.id;
    //console.log(goods_id);
    //获取购物车数组
    let {cart}=this.data;
    //找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    //选中状态取反
    cart[index].checked=!cart[index].checked;
    
    this.setCart(cart);
    
   

  },
  //设置购物车状态同时，重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
    //把购物车数据重新设置到data中和缓存中
    //写回
    let allchecked=true;
    //总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allchecked=false;
      }
    })
    //判断数组是否为空
    allchecked=cart.length!=0?allchecked:false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allchecked
    });
    wx.setStorageSync("cart", cart);

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //1 获取缓存中的物品信息
    const cart = wx.getStorageSync("cart")||[];
     // console.log(cart);
    // 1 计算全选
        //every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么 every 方法的返回值就为true
        //只要 有一个回调函数返回false 那么不再执行循环 直接返回false
        //空数组调用every 返回值true
    //const allchecked=cart.length?cart.every(v=>v.checked):false;
    this.setCart(cart);

  },

  //商品的全选功能
  handleItemAllchecked(){
    // 1 bindchange
    // 2 获取 data 中的全选变量 allchecked
    let {cart,allchecked}=this.data;
    
    // 3 直接取反allchecked
    allchecked=!allchecked;
    // 4 遍历购物车数组 让里面的商品选中状态跟随 all checked改变而改变
    cart.forEach(v=>v.checked=allchecked);
    // 5 把购物车数组 和allchecked 重新设置回data 把购物车数据重新设置回缓存中
    this.setCart(cart);

  },
  //商品的数量编辑功能

  async handleItemNumEdit(e){
    //获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    //获取购物车数组
    const {cart}=this.data;
    //找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id);
    //判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      const result=await showModal({content:"你是否要删除此商品？"});
      if(result.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
      
    }else{
      //进行修改数量
      cart[index].num+=operation;
    }
    
    //设置回缓存和data中
    this.setCart(cart);
  },

  //点击结算
  async handlePay(e){
    //判断有没有选购商品
    const {totalNum}=this.data;
    if(totalNum===0){
      await showToast({title:"您还没有选购商品！"});
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });

  }



  


  
})