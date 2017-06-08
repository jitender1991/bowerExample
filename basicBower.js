'use strict';

var _ = require('lodash');
var libUtils = require('../../lib/utils');
var storeContainerModel = require('store-model').store.store_container;
var storeUtility = require('store-model').store.utility;

var store_container = {

  createContainer: function(data, callback) {
    var createData = {};
    var fieldsFilter = ['name', 'parent_id', 'type', 'site_id', 'child_site_id', 'priority', 'status', 'visibility', 'view_ids', 'is_template', 'derived_from', 'meta_data', 'seo_detail'];

    if (!data || !data.child_site_id || isNaN(data.child_site_id)) {
      return callback(libUtils.setError('Invalid child_site_id provided to create container', 412));
    }

    createData = libUtils.pick(data, fieldsFilter);

    if (!Object.keys(createData).length) {
      return callback(libUtils.setError('No valid data to create View', 412));
    }

    libUtils.objectFieldToString(createData, ['meta_data', 'seo_detail']);

    storeContainerModel.insert(createData, {}, function(error, view_id) {
      if (error) {
        return callback(error);
      }
      callback(null, view_id);
    });
  },

  updateContainer: function(data, callback) {
    var updateData = {};
    var fieldsFilter = ['name', 'priority', 'status', 'visibility', 'meta_data', 'seo_detail'];

    if (!data || !data.id || isNaN(data.id)) {
      return callback(libUtils.setError('Invalid container_id provided to update container', 412));
    }

    updateData = libUtils.pick(data, fieldsFilter);

    if (!Object.keys(updateData).length) {
      return callback(libUtils.setError('No valid data to update container', 412));
    }

    libUtils.objectFieldToString(updateData, ['meta_data', 'seo_detail']);

    var id = Number(data.id);

    storeContainerModel.update(updateData, {
      id: id
    }, function(error) {
      if (error) {
        return callback(error);
      }
      callback(null, id);
    });
  },

  getContainer: function(options, callback) {
    var filters = {};
    var fieldsFilter = ['id', 'parent_id', 'child_site_id', 'type'];
    var columns = options.columns || ['id', 'name', 'child_site_id', 'status'];

    filters = libUtils.pick(options, fieldsFilter);

    if (!Object.keys(filters).length) {
      return callback(libUtils.setError('Missing mandatory field to get container data', 412));
    }

    if (options.status) {
      filters.status = options.status;
    }

    storeContainerModel.select(filters, {
      columns: columns
    }, function(error, response) {
      if (error) {
        return callback(error);
      }
      callback(null, response);
    });
  },

  getStore: function(options, callback) {
    var filters = {};
    var fieldsFilter = ['child_site_id', 'visibility', 'is_template'];

    filters = libUtils.pick(options, fieldsFilter);

    if (!Object.keys(filters).length) {
      return callback(libUtils.setError('Missing mandatory field to get container data', 412));
    }

    if (options.status) {
      filters.status = options.status;
    }

    storeUtility.getStructurizedResponse({
      opts: {
        container: filters
      },
      adminView: true
    }, function(error, response) {
      if (error) {
        return callback(error);
      }
      _.map(response, function(container) {
        container.meta_data = libUtils.jsonParser(container.meta_data);
        container.seo_detail = libUtils.jsonParser(container.seo_detail);
      });
      callback(null, response);
    });
  }
};

module.exports = store_container;
