using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SampleController : ControllerBase
    {
        private readonly WordsContext _context;

        public SampleController(WordsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<string>>> Get()
        {
            var words = await _context.Words.Select(w => w.Text).ToListAsync();
            return words;
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<string>>> AddWord([FromBody] string wordText)
        {
            var word = new Word { Text = wordText };
            _context.Words.Add(word);
            await _context.SaveChangesAsync();
            var words = await _context.Words.Select(w => w.Text).ToListAsync();
            return words;
        }

        [HttpDelete("{wordText}")]
        public async Task<ActionResult<IEnumerable<string>>> RemoveWord(string wordText)
        {
            var word = await _context.Words.FirstOrDefaultAsync(w => w.Text == wordText);
            if (word != null)
            {
                _context.Words.Remove(word);
                await _context.SaveChangesAsync();
            }
            var words = await _context.Words.Select(w => w.Text).ToListAsync();
            return words;
        }
    }
}
