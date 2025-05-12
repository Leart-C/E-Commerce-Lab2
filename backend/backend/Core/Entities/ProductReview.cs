using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace backend.Core.Entities
{
    public class ProductReview
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("reviewText"), BsonRepresentation(BsonType.String)]
        public string? ReviewText { get; set; }

        [BsonElement("rating"), BsonRepresentation(BsonType.Int32)]
        public int Rating { get; set; }

        // ForeignKey që lidhet me përdoruesin në SQL
        public string UserId { get; set; }

        // ForeignKey që lidhet me produktin në MongoDB
        public string ProductId { get; set; }

        // Datë e krijimit e rishikimit
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public ReviewUserInfo UserInfo { get; set; }
        public class ReviewUserInfo
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
        }
    }
}
