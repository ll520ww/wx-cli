import {useEffect} from "react";
import {getArticleList} from "@/services";
import './index.less'

export default function Index() {



  useEffect(() => {
    const fn=async () =>{
     const data= await getArticleList({})
    }
    fn()
  }, []);

  return (
    <div className='index'>
      <div>Hello world!</div>
    </div>
  )
}
