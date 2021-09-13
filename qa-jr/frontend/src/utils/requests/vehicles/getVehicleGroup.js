const loadVehicleGroup = () => {
    return getTaggingByFilters({
      urn: "v0:cgv:vehicle:" + organization_id + ":" + initialValue.id
    })
  }