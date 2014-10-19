class CollectionDecorator

  class << self
    def collection_as_id_map(collection)
      hash = {}
      collection.each do |object|
        hash[object.id] = object
      end
      hash
    end
  end
end