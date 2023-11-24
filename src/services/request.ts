import {
  getStorageSync,
  request,
  setStorageSync,
  showToast,
} from "@tarojs/taro";
import {config} from "@/utils/config";

interface Options {
  ignoreError?: boolean;
  params?: any;
  url?:string,
  header?:any,
  complete?:(res:any)=>void,
  method?:"GET"|"POST"|"PUT"|"DELETE"|"HEAD"|"OPTIONS",

}

export const noPaging: PaginationParams = {
  currPage: -1,
  pageSize: -1,
};



const makeRequest = (option: Options): Promise<any> => {
  return new Promise((resolve, reject) => {
    const options:any = { ...option };
    options.url = options.url.replace("/api", config.apiDomain);
    // 获取本地存储的token  这里使用静态的方式去存储 测试
    options.header = options.header || {
      logonType: "weapp",
      "uc__access_token_": getStorageSync("login").token,
      "Content-type": "application/json",
    };
    options.complete = (res: any) => {
      if (res.statusCode == 200) {
        if (res.data.success) {
          resolve(res.data.res);
        } else {
          //todo 因为有些完成会hideLoading，这是会干掉toast,所以异步
          setTimeout(() => {
            showToast({
              title: res.data.err.msg,
              icon: "none",
              duration: 2000,
            });
          }, 100);
          resolve(res.data);
        }
      }
      //登录失效
      else if (res.statusCode == 401) {
        setStorageSync("login", {});
        // gotoPage("/tab-pages/home/login");
        reject({ code: 401, msg: "登录失效" });
      }  else {
        showToast({
          title: "网络出问题了，请稍后再试",
          icon: "none",
        });
        reject({ code: -100, msg: "网络出问题了，请稍后再试" });
      }
    };
    request(options);
  });
};

export const getRequest = (
  url: string,
  params?: Options["params"],
) => {
  return makeRequest({
    url,
    params: params || ({} as any),
    method: "GET",
  });
};

export const postRequest = (
  url: string,
  params: object = {},
) => {
  return makeRequest({
    url,
    params,
    method: "POST",
  });
};
export const putRequest = (
  url: string,
  params: object = {},
) => {
  return makeRequest({
    url,
    params,
    method: "PUT",
  });
};
