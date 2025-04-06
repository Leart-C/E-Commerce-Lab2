using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Core.Entities
{
    public class Product
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("product_name"), BsonRepresentation(BsonType.String)]
        public string? ProductName { get; set; }

        [BsonElement("description"), BsonRepresentation(BsonType.String)]
        public string? Description { get; set; }
        [BsonElement("price"), BsonRepresentation(BsonType.Decimal128)]
        public Decimal? Price { get; set; }

   

    }
}
