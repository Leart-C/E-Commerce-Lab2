using backend.Core.Entities;
using backend.Core.Interfaces;
using MongoDB.Driver;

namespace backend.data
{
    public class MongoDbService
    {
        private readonly IConfiguration _configuration;
        private readonly IMongoDatabase? _database;
        private readonly IMongoCollection<Product> _products;



        public MongoDbService(IConfiguration configuration)
        {
            _configuration = configuration;

            var connectionString = _configuration.GetSection("MongoDb:DbConnection").Value;
            var mongoUrl = MongoUrl.Create(connectionString);
            var mongoClient = new MongoClient(mongoUrl);

            _database = mongoClient.GetDatabase(mongoUrl.DatabaseName);

            // Koleksioni i produkteve
            _products = _database.GetCollection<Product>("Products");

        }

        public IMongoDatabase? Database => _database;


        // Metodë për të marrë produktet e një user-i
        public async Task<IEnumerable<Product>> GetProductsByUserIdAsync(string userId)
        {
            return await _products.Find(p => p.UserId == userId).ToListAsync();
        }

        // Metodë për të krijuar një produkt
        public async Task CreateProductAsync(Product product)
        {
            await _products.InsertOneAsync(product);
        }


    }
}
