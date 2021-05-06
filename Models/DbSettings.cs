namespace fuusorcodesample.Models
{
    public class DbSettings :IDbSettings
    {
        public string ForecastCollectionName { get; set; }
        public string CityCollectionName { get; set; }
        public string MongoUri { get; set; }
        public string DatabaseName { get; set; }
        
     
    }
    public interface IDbSettings
    {
        string ForecastCollectionName { get; set; }
        string CityCollectionName { get; set; }
        string MongoUri { get; set; }
        string DatabaseName { get; set; }
    }
}