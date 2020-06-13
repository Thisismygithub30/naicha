export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: content,
            success: (result) => {
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
          });
    })
}

export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon: "none",
            success: (result) => {
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
          });
    })
}


export const login=()=>{
    return new Promise((resolve,reject)=>{
        
        wx.login({
            timeout:10000,
            success: (result)=>{

                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            }
        });
    })
}

export const getUserInfo=()=>{
    return new Promise((resolve,reject)=>{
        
        wx.getUserInfo({
            withCredentials: 'true ',
            lang: 'zh_CN',
            timeout:10000,
            success: (res)=>{
                resolve(res);
                //console.log(res);
            },
            fail: (err)=>{
                reject(err)
            }
        });
                
                
    })
}