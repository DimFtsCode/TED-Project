using Microsoft.EntityFrameworkCore;

namespace MyApi.Data
{
    public class WordsContext : DbContext
    {
        public WordsContext(DbContextOptions<WordsContext> options) : base(options)
        {
        }

        public DbSet<MyApi.Models.Word> Words { get; set; }
    }
}
