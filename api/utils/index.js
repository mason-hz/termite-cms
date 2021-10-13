const Bignumber = require("bignumber.js");
const axios = require("axios");
const server = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  timeout: 5000,
});
function parseBoardroom(v) {
  const obj = {};
  try {
    Object.values(v).forEach((i) => {
      const item = JSON.parse(i);
      obj[item.pool_id] = item;
    });
  } catch (error) {
    console.log(error, "=====error");
  }
  return obj;
}
function getApy(i, boardroomReq, lpsReq) {
  const { mdxType, boardroomType, mdxPoolId } = i || {};
  let apy = 0;
  try {
    if (mdxType === "boardroom") {
      apy = boardroomReq[boardroomType][mdxPoolId].pool_apy;
    } else {
      apy = new Bignumber(lpsReq[mdxPoolId].pool_apy).times(365).toNumber();
    }
  } catch (error) {
    console.log(error, "=====error");
  }
  return apy;
}
async function getMdxData(mdxUrl) {
  let boardroomReq = {},
    lpsReq = {};
  try {
    if (mdxUrl) {
      const [boardroom, lps] = await Promise.all([
        server.get(mdxUrl.boardroomUrl),
        server.get(mdxUrl.liquidityUrl),
      ]);
      if (boardroom.status === 200 && boardroom.data.code === 0) {
        const { boardroom_hmdx, boardroom_lock, boardroom_wbnb } =
          boardroom.data.result;
        boardroomReq = {
          hmdx: parseBoardroom(boardroom_hmdx),
          mdx: parseBoardroom(boardroom_lock),
          wbnb: parseBoardroom(boardroom_wbnb),
        };
      }
      if (lps.status === 200 && lps.data.code === 0) {
        lpsReq = lps.data.result;
      }
    }
  } catch (error) {
    console.log(error, "=====error");
  }

  return { boardroomReq, lpsReq };
}
module.exports = {
  parseBoardroom,
  getApy,
  getMdxData,
};
