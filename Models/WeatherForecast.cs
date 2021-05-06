using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace fuusorcodesample
{
    public class WeatherForecast
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        public string city { get; set; }

        public DateTime date { get; set; }

        public double temperatureC { get; set; }

        public double temperatureF { get; set; }

        public int wind { get; set; }

        public int rain { get; set; }
    }
}
