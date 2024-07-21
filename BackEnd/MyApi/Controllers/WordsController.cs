using Microsoft.AspNetCore.Mvc;
using MyApi.Data;
using MyApi.Models;
using System.Linq;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WordsController : ControllerBase
    {
        private readonly WordsContext _context;

        public WordsController(WordsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetWords()
        {
            return Ok(_context.Words.Select(w => w.Text).ToList());
        }

        [HttpPost]
        public IActionResult AddWord([FromBody] string newWord)
        {
            var word = new Word { Text = newWord };
            _context.Words.Add(word);
            _context.SaveChanges();
            return Ok(_context.Words.Select(w => w.Text).ToList());
        }

        [HttpDelete("{text}")]
        public IActionResult DeleteWord(string text)
        {
            var word = _context.Words.FirstOrDefault(w => w.Text == text);
            if (word == null)
            {
                return NotFound();
            }

            _context.Words.Remove(word);
            _context.SaveChanges();
            return Ok(_context.Words.Select(w => w.Text).ToList());
        }
    }
}
