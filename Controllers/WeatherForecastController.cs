
using System.Collections.Generic;
using fuusorcodesample.Services;
using Microsoft.AspNetCore.Mvc;


namespace fuusorcodesample.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
       

        private readonly WeatherForecastService _weatherForecastService;

        public WeatherForecastController(WeatherForecastService weatherForecastService)
        {
            _weatherForecastService = weatherForecastService;
        }

        [HttpGet]
        public ActionResult<List<WeatherForecast>> Get() => _weatherForecastService.Get();

        [HttpGet("{id:length(24)}", Name = "GetWeatherForecast")]
        public ActionResult<WeatherForecast> Get(string id)
        {
            var forecast = _weatherForecastService.Get(id);

            if (forecast == null)
            {
                return NotFound();
            }

            return forecast;
        }

        [HttpPost]
        public ActionResult<WeatherForecast> Create(WeatherForecast weatherForecast)
        {
            _weatherForecastService.Create(weatherForecast);
            return CreatedAtRoute("GetWeatherForecast", new { id = weatherForecast.Id.ToString()}, weatherForecast);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, WeatherForecast forecastIn)
        {
            var forecast = _weatherForecastService.Get(id);

            if (forecast == null)
            {
                return NotFound();
            }

            _weatherForecastService.Update(id, forecastIn);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var forecast = _weatherForecastService.Get(id);

            if (_weatherForecastService == null)
            {
                return NotFound();
            }

            _weatherForecastService.Remove(forecast.Id);

            return NoContent();
        }

        [HttpDelete]
        public IActionResult Delete()
        {
            _weatherForecastService.Remove();
            return NoContent();
        }

    }
}


