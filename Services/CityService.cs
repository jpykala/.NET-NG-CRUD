using System;
using System.Collections.Generic;
using fuusorcodesample.Models;
using MongoDB.Driver;

namespace fuusorcodesample.Services
{
    public class CityService
    {
        private readonly IMongoCollection<City> _cityCollection;

        public CityService(IDbSettings settings)
        {
            var mongoUrl = new MongoUrl(settings.MongoUri);
            var client = new MongoClient(mongoUrl);
            var database = client.GetDatabase(settings.DatabaseName);
            _cityCollection = database.GetCollection<City>(settings.CityCollectionName);
        }

        public List<City> Get() => _cityCollection.Find(city => true).ToList();
        
        public City Get(string id) => 
            _cityCollection.Find<City>(city => city.Id == id).FirstOrDefault();
        
        public City Create(City city)
        {
            _cityCollection.InsertOne(city);
            return city;
        }
        public void Remove(string id) => 
            _cityCollection.DeleteOne(city => city.Id == id);
        
        public void Remove() =>
            _cityCollection.DeleteMany(city => true);
    }
}