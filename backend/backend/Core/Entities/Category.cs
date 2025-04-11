using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Core.Entities
{
    public class Category
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("category_name"), BsonRepresentation(BsonType.String)]
        public string? CategoryName { get; set; }

        [BsonElement("description"), BsonRepresentation(BsonType.String)]
        public string? Description { get; set; }
    }
}
