import { MARKET_LOAD, MARKET_LOADING } from "../actions/types";
import { orderBookLoadAsync } from "."

export const marketLoadAsync = newMarket => {
  return async dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: MARKET_LOADING
      })

      // await dispatch(orderBookLoadAsync(newMarket))
      
      // dispatch({
      //   type: MARKET_LOAD,
      //   payload: {
      //     currentMarket: newMarket
      //   }
      // });

      setTimeout(() => {
        dispatch({
          type: MARKET_LOAD,
          payload: {
            currentMarket: newMarket
          }
        })
        resolve()
      }, 3000)
    })

    // dispatch({
    //   type: MARKET_LOADING
    // })

    // // await dispatch(orderBookLoadAsync(newMarket))
    
    // // dispatch({
    // //   type: MARKET_LOAD,
    // //   payload: {
    // //     currentMarket: newMarket
    // //   }
    // // });

    // setTimeout(() => {
    //   dispatch({
    //     type: MARKET_LOAD,
    //     payload: {
    //       currentMarket: newMarket
    //     }
    //   })
    // }, 3000)
  };
};
