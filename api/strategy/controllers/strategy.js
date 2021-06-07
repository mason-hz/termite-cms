"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { getApy, getMdxData } = require("../../utils");
module.exports = {
  async find(ctx) {
    const entities = await strapi.query("strategy").find(ctx.query);
    const mdxUrl = await strapi.query("mdx-url").findOne(ctx.query);
    const { boardroomReq, lpsReq } = await getMdxData(mdxUrl);
    const strategies = entities.map((i) => {
      const apy = getApy(i, boardroomReq, lpsReq);
      return {
        apy,
        name: i.name,
        chainId: i.chainId,
        website: i.website,
        address: i.address,
        websiteName: i.websiteName,
        interestNumber: i.interestNumber,
      };
    });
    // const rn = new Bignumber(1.549).div(17520);
    // console.log(rn.toFixed(10));
    // const pl = rn.plus(1);
    // console.log(pl.toFixed(10));

    // const aa = pl.pow(17520).minus(1).toFixed(2);
    // console.log(aa);
    return strategies;
  },
};
