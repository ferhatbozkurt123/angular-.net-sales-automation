using Microsoft.EntityFrameworkCore;

namespace SalesAutomationAPI.Models
{
    public class SalesAutomationContext : DbContext
    {
        public SalesAutomationContext(DbContextOptions<SalesAutomationContext> options) : base(options) { }

        public DbSet<Urunler> Products { get; set; }
    }
}
