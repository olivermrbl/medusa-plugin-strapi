'use strict';
const {notFound, serverError, success, badRequest} = require("../../../utils/response");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    try {
      const { medusaId } = ctx.params;
      const region = await strapi.query('region', '').findOne({ region_id: medusaId });
      if (region && region.id) {
        return success(ctx, { region });
      }
      return notFound(ctx);
    } catch (e) {
      return serverError(ctx);
    }

  },
  async create(ctx) {
    try {
      const regionBody = ctx.request.body;
      Object.keys(regionBody).forEach(key => regionBody[key] === undefined && delete regionBody[key]);

      const create = await strapi.services.region.createWithRelations(regionBody);
      if (create) {
        return success(ctx, { id: create });
      }
      return badRequest(ctx);

    } catch (e) {
      return serverError(ctx, e);
    }
  },
  async update(ctx) {
    try {
      const { medusaId } = ctx.params;
      const regionBody = ctx.request.body;
      Object.keys(regionBody).forEach(key => regionBody[key] === undefined && delete regionBody[key]);

      const found = await strapi.query('region', '').findOne({
        medusa_id: medusaId
      });

      if (found) {
        const update = await strapi.services.region.updateWithRelations(regionBody);
        if (update) {
          return success(ctx, { id: update });
        }
      }

      const create = await strapi.services.region.createWithRelations(regionBody);
      if (create) {
        return success(ctx, { id: create });
      }

      return notFound(ctx);
    } catch (e) {
      return serverError(ctx, e);
    }
  }
};
