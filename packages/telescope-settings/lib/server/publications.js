Meteor.publish('settings', function() {
  var options = {};
  var privateFields = {};

  // look at Settings.schema to see which fields should be kept private
  _.each(Settings.schema._schema, function (property, key) {
    if (property.private)
      privateFields[key] = false;
  });

  if(!Users.isAdminById(this.userId)){
    options = _.extend(options, {
      fields: privateFields
    });
  }

  return Settings.find({}, options);
});
