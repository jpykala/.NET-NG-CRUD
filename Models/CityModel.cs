using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace fuusorcodesample.Models
{
    public class City
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string name { get; set;}
    }
}