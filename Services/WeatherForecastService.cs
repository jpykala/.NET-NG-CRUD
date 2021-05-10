
using System.Collections.Generic;
using fuusorcodesample.Models;
using MongoDB.Driver;

namespace fuusorcodesample.Services
{
    public class WeatherForecastService
    {
        private readonly IMongoCollection<WeatherForecast> _forecastCollection;

        public WeatherForecastService(IDbSettings settings)
        {
            var mongoUrl = new MongoUrl(settings.MongoUri);
            var client = new MongoClient(mongoUrl);
            var database = client.GetDatabase(settings.DatabaseName);
            _forecastCollection = database.GetCollection<WeatherForecast>(settings.ForecastCollectionName);
        }
        public List<WeatherForecast> Get() => _forecastCollection.Find(forecast => true).Sort(Builders<WeatherForecast>.Sort.Ascending("date")).ToList();

        public WeatherForecast Get(string id) =>
            _forecastCollection.Find<WeatherForecast>(forecast => forecast.Id == id).FirstOrDefault();

        public WeatherForecast Create(WeatherForecast weatherForecast)
        {
            _forecastCollection.InsertOne(weatherForecast);
            return weatherForecast;
        }
        public void Update(string id, WeatherForecast forecastIn) =>
                    _forecastCollection.ReplaceOne(forecast => forecast.Id == id, forecastIn);
        public void Remove(string id) => 
            _forecastCollection.DeleteOne(forecast => forecast.Id == id);

        public void Remove() => 
            _forecastCollection.DeleteMany(forecast => true);

    }
}